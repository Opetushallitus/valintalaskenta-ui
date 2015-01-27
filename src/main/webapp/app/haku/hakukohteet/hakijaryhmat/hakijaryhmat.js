app.factory('ValintalaskentaHakijaryhmaModel', function($routeParams, HakukohdeHakijaryhma, Ilmoitus, IlmoitusTila, $q,
                                                        HakemuksenVastaanottoTila,HakemuksenVastaanottoTilat,LatestSijoittelunTilat,
                                                        ngTableParams, $filter, FilterService) {
    "use strict";

    var model;
    model = new function() {

        this.hakukohdeOid = {};
        this.hakijaryhmat = [];
        this.errors = [];

        this.refresh = function(hakuOid, hakukohdeOid) {

            model.hakijaryhmat = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakeneet = [];
            this.loaded = $q.defer();

            HakukohdeHakijaryhma.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.hakijaryhmat = result;

                model.hakijaryhmat.forEach(function (hakijaryhma) {
                    hakijaryhma.tableParams = new ngTableParams({
                        page: 1,            // show first page
                        count: 50,          // count per page
                        filters: {
                            'sukunimi' : '',
                            'jarjestyskriteerit[0].tila': ''
                        },
                        sorting: {
                            'sukunimi': 'asc'     // initial sorting
                        }
                    }, {
                        total: hakijaryhma.jonosijat.length, // length of data
                        getData: function ($defer, params) {
                            var filters = FilterService.fixFilterWithNestedProperty(params.filter());

                            var orderedData = params.sorting() ?
                                $filter('orderBy')(hakijaryhma.jonosijat, params.orderBy()) :
                                hakijaryhma.jonosijat;
                            orderedData = params.filter() ?
                                $filter('filter')(orderedData, filters) :
                                orderedData;

                            params.total(orderedData.length); // set total for recalc pagination
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                        }
                    });
                    hakijaryhma.jonosijat.forEach(function (jonosija) {

                        var tilaParams = {
                            hakemusOid: jonosija.hakemusOid
                        };
                        HakemuksenVastaanottoTilat.get(tilaParams, function (result) {
                            var valintatapajonoOid = "";

                            result.forEach(function (entry) {
                                if (entry.hakukohdeOid === hakukohdeOid) {
                                    jonosija.vastaanottoTila = entry.tila;
                                    valintatapajonoOid = entry.valintatapajonoOid;
                                }
                            });

                            LatestSijoittelunTilat.get({hakemusOid: jonosija.hakemusOid, hakuOid: hakuOid}, function (latest) {

                                latest.hakutoiveet.forEach(function (hakutoive) {
                                    if (hakutoive.hakukohdeOid === hakukohdeOid) {
                                        hakutoive.hakutoiveenValintatapajonot.forEach(function (jono) {
                                            if (jono.valintatapajonoOid === valintatapajonoOid) {
                                                jonosija.tila = jono.tila;
                                                jonosija.tilanKuvaukset = jono.tilanKuvaukset;
                                                jonosija.varasijanNumero = jono.varasijanNumero;
                                                jonosija.hyvaksyttyHarkinnanvaraisesti = jono.hyvaksyttyHarkinnanvaraisesti;
                                            }
                                        });
                                    }
                                });

                                model.loaded.resolve();
                            });
                        }, function (error) {
                        });

                    });
                });
            }, function(error) {
                model.errors.push(error);
            });

        };

    }();

    return model;
});

angular.module('valintalaskenta').

    controller('HakijaryhmatController', ['$scope', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila','ValintalaskentaHakijaryhmaModel','HakukohdeModel', '$http', 'AuthService', 'LocalisationService',
        function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila
                  ,ValintalaskentaHakijaryhmaModel, HakukohdeModel, $http, AuthService, LocalisationService) {
            "use strict";

            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.hakuOid =  $routeParams.hakuOid;
            $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
            $scope.model = ValintalaskentaHakijaryhmaModel;
            $scope.hakukohdeModel = HakukohdeModel;

            $scope.kuuluuFilterValue = "";

            $scope.kuuluuFilterValues = [
                {value: "", text_prop: "hakijaryhmat.alasuodata", default_text:"Älä suodata"},
                {value: "HYVAKSYTTAVISSA", text_prop: "hakijaryhmat.HYVAKSYTTAVISSA", default_text:"Kuuluu"},
                {value: "HYLATTY", text_prop: "hakijaryhmat.HYLATTY", default_text:"Ei kuulu"}
            ];

            LocalisationService.getTranslationsForArray($scope.kuuluuFilterValues).then(function () {
            });

            var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

            $scope.model.refresh($scope.hakuOid, $scope.hakukohdeOid);

            var order = {
                "HYVAKSYTTAVISSA": 1,
                "HYVAKSYTTY_HARKINNANVARAISESTI": 2,
                "HYLATTY": 3,
                "VIRHE": 4,
                "MAARITTELEMATON": 5
            };

            $scope.jarjesta = function(value) {
                var i = order[value.jarjestyskriteerit[0].tila];
                return i;
            };

            AuthService.crudOph("APP_VALINTOJENTOTEUTTAMINEN").then(function(){
                $scope.updateOph = true;
            });

            hakukohdeModelpromise.then(function () {
                AuthService.crudOrg("APP_VALINTOJENTOTEUTTAMINEN", HakukohdeModel.hakukohde.tarjoajaOids[0]).then(function () {
                    $scope.crudOrg = true;
                });
            });

            $scope.promise = $scope.model.loaded.promise;


    }]);