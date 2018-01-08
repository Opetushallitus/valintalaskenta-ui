app.factory('HakeneetModel', function(HakukohdeHenkilotFull, AtaruApplications, HenkiloPerustietosByHenkiloOidList, $q) {
    'use strict';

    var processHakuappApplications = function(applications, hakukohdeOid, persons) {
        return applications.map(function(application) {
            var hakija = {};
            if (application.answers) {
                var person = persons.filter(function(person) {
                    return person.oidHenkilo === application.personOid;
                })[0];

                for (var i = 1; i < 10; i++) {
                    if (!application.answers.hakutoiveet) {
                        break;
                    }
                    var oid = application.answers.hakutoiveet["preference" + i + "-Koulutus-id"];

                    if (oid === undefined) {
                        break;
                    }

                    if (oid === hakukohdeOid) {
                        hakija.hakutoiveNumero = i;

                        if (application.preferenceEligibilities) {
                            for (var j = 0; j < application.preferenceEligibilities.length; j++) {
                                if (application.preferenceEligibilities[j].aoId === hakukohdeOid) {
                                    hakija.hakukelpoisuus = application.preferenceEligibilities[j].status;
                                    if (application.preferenceEligibilities[j].maksuvelvollisuus) {
                                        hakija.maksuvelvollisuus = application.preferenceEligibilities[j].maksuvelvollisuus;
                                    } else {
                                        hakija.maksuvelvollisuus = 'NOT_CHECKED';
                                    }
                                }
                            }
                        }
                        break;
                    }
                }

                hakija.state = application.state;
                hakija.Etunimet = person.etunimet;
                hakija.Sukunimi = person.sukunimi;
                hakija.personOid = person.oidHenkilo;
                hakija.hakemusOid = application.oid;
            }

            return hakija;
        });
    };

    var ataruMaksuvelvollisuus = function(hakutoive) {
        var paymentObligation = hakutoive ? hakutoive.paymentObligation : null;
        switch (paymentObligation) {
            case "obligated":
                return "REQUIRED";
            case "not-obligated":
                return "NOT_REQUIRED";
            default:
                return "NOT_CHECKED";
        }
    };

    var ataruApplicationState = function(hakutoive) {
        var state = hakutoive ? hakutoive.processingState : null;
        if (state === "information-request") return 'INCOMPLETE';
        else return 'ACTIVE';
    };

    var ataruHakukelpoisuus = function(hakutoive) {
        var hakukelpoisuus = hakutoive ? hakutoive.eligibilityState : null;
        switch (hakukelpoisuus) {
            case "eligible":
                return "Hakukelpoinen";
            case "uneligible":
                return "Ei Hakukelpoinen";
            default:
                return "Tarkastamatta";
        }
    };

    var processAtaruApplications = function(applications, persons, hakukohdeOid) {
        return applications.map(function(application) {
            var person = persons.filter(function(person) {
                return person.oidHenkilo === application.henkiloOid;
            })[0];

            var hakutoive = application.hakutoiveet.filter(function(h) {
                return h.hakukohdeOid === hakukohdeOid;
            })[0];

            return {
                maksuvelvollisuus: ataruMaksuvelvollisuus(hakutoive),
                state: ataruApplicationState(hakutoive),
                hakukelpoisuus: ataruHakukelpoisuus(hakutoive.eligibilityState),
                Etunimet: person.etunimet,
                Sukunimi: person.sukunimi,
                personOid: person.oidHenkilo,
                hakemusOid: application.oid
            }
        })
    };

    var onError = function(error) {
        console.log(error);
        model.errors.push(error);
    };

    var model;
    model = new function() {
        this.hakeneet = [];
        this.errors = [];

        this.refresh = function(hakukohdeOid, hakuOid, loadFromAtaru, promise) {
            model.hakeneet = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakuOid = hakuOid;

            if (loadFromAtaru) {
                console.log("Get applications from Ataru");
                AtaruApplications.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid},
                    function(applications) {
                        var hakijaOids = _.uniq(applications.map(function(application) {
                            return application.henkiloOid;
                        }));

                        HenkiloPerustietosByHenkiloOidList.post(hakijaOids,
                            function(persons) {
                                model.hakeneet = processAtaruApplications(applications, persons, hakukohdeOid);
                                promise.resolve();
                            }, onError);
                    }, onError);
            } else {
                console.log("Get applications from hakuapp");
                HakukohdeHenkilotFull.get({aoOid: hakukohdeOid, rows: 100000, asId: model.hakuOid},
                    function(applications) {
                        var hakijaOids = _.uniq(applications.map(function(application) {
                            return application.personOid;
                        }));

                        HenkiloPerustietosByHenkiloOidList.post(hakijaOids,
                            function(persons) {
                                model.hakeneet = processHakuappApplications(applications, hakukohdeOid, persons);
                                promise.resolve();
                            }, onError);

                    }, onError);
            }
        };

        this.refreshIfNeeded = function(hakukohdeOid, hakuOid, loadFromAtaru) {
            var deferred = $q.defer();
            if (hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid, loadFromAtaru, deferred);
            } else deferred.resolve();

            return deferred.promise;
        };
    }();

    return model;
});

angular.module('valintalaskenta').controller('HakeneetController', ['$scope', '$location', '$routeParams', 'HakeneetModel', 'HakukohdeModel',
    'ngTableParams', '$filter', 'FilterService', 'Korkeakoulu', 'HakuModel',
    function($scope, $location, $routeParams, HakeneetModel, HakukohdeModel, ngTableParams, $filter, FilterService, Korkeakoulu, HakuModel) {
        'use strict';

        $scope.hakukohdeOid = $routeParams.hakukohdeOid;
        $scope.hakuOid = $routeParams.hakuOid;
        $scope.url = window.url;
        $scope.hakuModel = HakuModel;
        $scope.korkeakouluService = Korkeakoulu;
        $scope.hakukohdeModel = HakukohdeModel;
        $scope.model = HakeneetModel;
        $scope.tila = {
            ACTIVE: $scope.t('tila.active') || 'Aktiivinen',
            INCOMPLETE: $scope.t('tila.incomplete') || 'Puutteellinen'
        };
        $scope.maksuvelvollisuus = {
            NOT_CHECKED: $scope.t('maksuvelvollisuus.not_checked') || 'Ei tarkistettu',
            NOT_REQUIRED: $scope.t('maksuvelvollisuus.not_required') || 'Ei maksuvelvollinen',
            REQUIRED: $scope.t('maksuvelvollisuus.required') || 'Maksuvelvollinen'
        };
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 50,          // count per page
            filters: {
                'Sukunimi': ''
            },
            sorting: {
                'Sukunimi': 'asc'     // initial sorting
            }
        }, {
            total: $scope.model.hakeneet.length, // length of data
            getData: function($defer, params) {
                HakuModel.promise.then(function(hakuModel) {
                    var loadFromAtaru = hakuModel.hakuOid.ataruLomakeAvain !== undefined;
                    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid, $scope.hakuOid, loadFromAtaru)
                        .then(function() {
                            $scope.reviewUrlKey = loadFromAtaru ? "ataru.application.review" : "haku-app.virkailija.hakemus.esikatselu";
                            var filters = FilterService.fixFilterWithNestedProperty(params.filter());
                            var orderedData = params.sorting() ?
                                $filter('orderBy')($scope.model.hakeneet, params.orderBy()) :
                                $scope.model.hakeneet;

                            orderedData = params.filter() ?
                                $filter('filter')(orderedData, filters) :
                                orderedData;

                            params.total(orderedData.length); // set total for recalc pagination
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        });
                });
            }
        });
    }]);

