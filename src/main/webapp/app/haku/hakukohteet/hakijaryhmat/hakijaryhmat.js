app.factory('ValintalaskentaHakijaryhmaModel', function($routeParams, HakukohdeHakijaryhma, Ilmoitus, IlmoitusTila, $q,
                                                        HakemuksenVastaanottoTila,HakemuksenVastaanottoTilat,LatestSijoittelunTilat) {
    "use strict";

    var model;
    model = new function() {

        this.hakukohdeOid = {};
        this.hakijaryhmat = [];
        this.errors = [];

        this.refresh = function(hakuOid, hakukohdeOid) {
            var defer = $q.defer();

            model.hakijaryhmat = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakeneet = [];

            HakukohdeHakijaryhma.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.hakijaryhmat = result;

                model.hakijaryhmat.forEach(function (hakijaryhma) {
                    hakijaryhma.jonosijat.forEach(function (jonosija) {
                        var tilaParams = {
                            hakemusOid: jonosija.hakemusOid
                        };
                        HakemuksenVastaanottoTilat.get(tilaParams, function (result) {
                            var valintatapajonoOid = "";
                            result.forEach(function (entry) {
                                if (entry.hakukohdeOid === hakukohdeOid) {
                                    jonosija.vastaanottoTila = entry.tila;
                                }
                            });

                            LatestSijoittelunTilat.get({hakemusOid: jonosija.hakemusOid, hakuOid: hakuOid}, function (latest) {
                                latest.hakutoiveet.forEach(function (hakutoive) {
                                    if (hakutoive.hakukohdeOid === hakukohdeOid) {
                                        hakutoive.hakutoiveenValintatapajonot.forEach(function (jono) {
                                            jonosija.sijoittelunTila = jono.tila;
                                            jonosija.tilanKuvaukset = jono.tilanKuvaukset;
                                            jonosija.varasijanNumero = jono.varasijanNumero;
                                            jonosija.hyvaksyttyHarkinnanvaraisesti = jono.hyvaksyttyHarkinnanvaraisesti;
                                        });
                                    }
                                });
                            });
                        }, function (error) {
                        });

                    });
                });
            }, function(error) {
                model.errors.push(error);
                defer.reject("hakukohteen tietojen hakeminen epäonnistui");
            });

            return defer.promise;
        };

    }();

    return model;
});

angular.module('valintalaskenta').

    controller('HakijaryhmatController', ['$scope', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila','ValintalaskentaHakijaryhmaModel','HakukohdeModel', '$http', 'AuthService',
        function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila
                  ,ValintalaskentaHakijaryhmaModel, HakukohdeModel, $http, AuthService) {
            "use strict";

            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.hakuOid =  $routeParams.hakuOid;
            $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
            $scope.model = ValintalaskentaHakijaryhmaModel;
            $scope.hakukohdeModel = HakukohdeModel;

            $scope.pageSize = 50;

            var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

            var promise = $scope.model.refresh($scope.hakuOid, $scope.hakukohdeOid);

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
                AuthService.crudOrg("APP_VALINTOJENTOTEUTTAMINEN", HakukohdeModel.hakukohde.tarjoajaOid).then(function () {
                    $scope.crudOrg = true;
                });
            });
    }]);