
angular.module('valintalaskenta').factory('HakukohdeModel', ['$q', '$log', '$http', 'TarjontaHakukohde', 'HakukohdeNimiService',
    'ValintaperusteetHakukohdeValintaryhma','ErillishakuProxy', '_', 'HakuModel',
    function ($q, $log, $http, TarjontaHakukohde, HakukohdeNimiService,ValintaperusteetHakukohdeValintaryhma, ErillishakuProxy, _, HakuModel) {
    "use strict";

    var model;

    model = new function () {
        this.hakukohdeOid = undefined;
        this.hakukohdeNimi = undefined;
        this.tarjoajaNimi = undefined;
        this.hakukohde = {};
        this.deferred = undefined;
        this.valintaryhma = {};
        this.kaytetaanValintalaskentaa = false;
        this.haku = HakuModel;

        this.refresh = function (hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
            TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (resultWrapper) {
                var hakukohde = resultWrapper.result;
                model.hakukohde = hakukohde;
                model.setHakukohdeNames();
                model.setHakukohdeValintaRyhma(hakukohdeOid);
                model.fetchKaytetaanValintalaskentaa(hakukohdeOid, hakukohde.hakuOid).then(function(kaytetaanValintalaskentaa) {
                    model.kaytetaanValintalaskentaa = kaytetaanValintalaskentaa;
                    model.deferred.resolve();
                }, function(error) {
                    $log.error("hakukohteen valintalaskennan kayton hakeminen epäonnistui", error);
                    model.deferred.reject("hakukohteen valintalaskennan kayton hakeminen epäonnistui");
                });
            }, function(error) {
                $log.error('Hakukohteen tietojen hakeminen epäonnistui', error);
                model.deferred.reject("hakukohteen tietojen hakeminen epäonnistui");
            });
            return model.deferred;
        };


        //This will fail if hakukohdeOid -parameter doesn't exist
        this.refreshIfNeeded = function (hakukohdeOid) {
            if(_.isEmpty(model.deferred) || model.isHakukohdeChanged(hakukohdeOid)) {
                model.deferred = $q.defer();
                model.refresh(hakukohdeOid);
                return model.deferred.promise;
            } else {
                return model.deferred.promise;
            }
        };

        //helper method needed in other controllers
        this.isHakukohdeChanged = function (hakukohdeOid) {
            if (model.hakukohdeOid !== hakukohdeOid) {
                return true;
            } else {
                return false;
            }
        };

        this.setHakukohdeNames = function (hakukohdeNimi, tarjoajaNimi) {
            if(hakukohdeNimi || tarjoajaNimi) {
                model.hakukohdeNimi = hakukohdeNimi;
                model.tarjoajaNimi = tarjoajaNimi;
            } else {
                model.hakukohdeNimi = HakukohdeNimiService.getHakukohdeNimi(model.hakukohde);
                model.tarjoajaNimi = HakukohdeNimiService.getTarjoajaNimi(model.hakukohde);
            }

        };

        this.setHakukohdeValintaRyhma = function (hakukohdeOid) {
            ValintaperusteetHakukohdeValintaryhma.get({hakukohdeoid: hakukohdeOid}, function (result) {
                model.valintaryhma = result;
            }, function(error) {
                $log.error('Hakukohteen valintaryhmän tietojen hakeminen epäonnistui', error);
            })
        };

        this.fetchKaytetaanValintalaskentaa = function (hakukohdeOid, hakuOid) {
            return model.haku.promise.then(function() {
                if (model.haku.hakuOid.sijoittelu) {
                    return false;
                } else {
                    return ErillishakuProxy.hae({hakukohdeOid: hakukohdeOid, hakuOid: hakuOid}).$promise.then(function (result) {
                        return _(result).filter(function (e) {
                            return e.viimeinenVaihe;
                        })[0].valintatapajonot.some(function (e) {
                            return e.kaytetaanValintalaskentaa;
                        });
                    });
                }
            });
        }
    }();

    return model;
}])
    
.controller('HakukohdeController', ['$scope', '$location', '$routeParams', 'HakukohdeModel', 'HakuModel',
        'SijoitteluntulosModel', 'Korkeakoulu', 'HakukohdeHenkilotFull',
        function ($scope, $location, $routeParams, HakukohdeModel, HakuModel, SijoitteluntulosModel, Korkeakoulu, HakukohdeHenkilotFull) {
    "use strict";

    $scope.hakuOid = $routeParams.hakuOid;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;

    $scope.model = HakukohdeModel;
    $scope.hakumodel = HakuModel;
    if($routeParams.hakukohdeOid) {
        // Haetaan henkilöt kakkuun
        HakukohdeHenkilotFull.get({aoOid: $scope.hakukohdeOid, rows: 100000, asId: $scope.hakuOid}, function (result) {});
        $scope.model.refreshIfNeeded($routeParams.hakukohdeOid);
    }

    $scope.isKorkeakoulu = function () {
        return Korkeakoulu.isKorkeakoulu($scope.sijoitteluntulosModel.haku.kohdejoukkoUri);
    };

    if($routeParams.hakukohdeOid) {
        $scope.sijoitteluntulosModel = SijoitteluntulosModel;
        $scope.sijoitteluntulosModel.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
    }
}])

.controller('HakukohdeNimiController', ['$scope', '$routeParams', 'HakukohdeModel', function ($scope, $routeParams, HakukohdeModel) {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.hakukohdeModel = HakukohdeModel;
    }]);

