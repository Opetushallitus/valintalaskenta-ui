
angular.module('valintalaskenta').factory('HakukohdeModel', ['$q', '$log', '$http', 'TarjontaHakukohde', 'HakukohdeNimiService',
    'ValintaperusteetHakukohdeValintaryhma','KayttaaValintalaskentaa', '_', 'HakuModel',
    function ($q, $log, $http, TarjontaHakukohde, HakukohdeNimiService,ValintaperusteetHakukohdeValintaryhma, KayttaaValintalaskentaa, _, HakuModel) {
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
                model.hakukohde = resultWrapper.result;
                model.setHakukohdeNames();
                model.setHakukohdeValintaRyhma(hakukohdeOid);
                model.fetchKaytetaanValintalaskentaa(hakukohdeOid).then(function(kaytetaanValintalaskentaa) {
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

        this.fetchKaytetaanValintalaskentaa = function (hakukohdeOid) {
            return model.haku.promise.then(function() {
                if (model.haku.hakuOid.sijoittelu) {
                    return false;
                } else {
                    return KayttaaValintalaskentaa.get({hakukohdeOid: hakukohdeOid}).$promise.then(function(result) {
                        return result.kayttaaValintalaskentaa;
                    });
                }
            });
        }
    }();

    return model;
}])
    
.controller('HakukohdeController', ['$scope', '$location', '$routeParams', 'HakukohdeModel', 'HakuModel',
        'SijoitteluntulosModel', 'Korkeakoulu', 'HakukohdeHenkilotFull', 'ValinnanTulos', '_',
        function ($scope, $location, $routeParams, HakukohdeModel, HakuModel, SijoitteluntulosModel, Korkeakoulu, HakukohdeHenkilotFull, ValinnanTulos, _) {
    "use strict";

    $scope.useVtsData = READ_FROM_VALINTAREKISTERI === "true";

    $scope.hakuOid = $routeParams.hakuOid;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            
    $scope.hakumodel = HakuModel;
    $scope.hakumodel.refreshIfNeeded($scope.hakuOid);

    $scope.model = HakukohdeModel;
    if($routeParams.hakukohdeOid) {
        // Haetaan henkilöt kakkuun
        HakukohdeHenkilotFull.get({aoOid: $scope.hakukohdeOid, rows: 100000, asId: $scope.hakuOid}, function (result) {});
        $scope.model.refreshIfNeeded($routeParams.hakukohdeOid);
    }

    $scope.isKorkeakoulu = function () {
        if($scope.useVtsData && $scope.isErillishakuIlmanValintalaskentaa()) {
            return HakuModel.korkeakoulu;
        } else {
            return Korkeakoulu.isKorkeakoulu($scope.sijoitteluntulosModel.haku.kohdejoukkoUri);
        }
    };

    $scope.isErillishakuIlmanValintalaskentaa = function () {
        return HakuModel.hakuOid.erillishaku == true && !HakukohdeModel.kaytetaanValintalaskentaa
    };

    $scope.erillishaunHakemusErittelyt = {
            hyvaksytyt : [],
            ehdollisestiVastaanottaneet : [],
            paikanVastaanottaneet: []
    };

    var updateErillishaunHakemusErittelyt = function(valintatapajono) {
      _.forEach(valintatapajono.hakemukset, function(hakemus) {
          if("HYVAKSYTTY" === hakemus.valinnantila || "VARASIJALTA_HYVAKSYTTY" === hakemus.valinnantila) {
              $scope.erillishaunHakemusErittelyt.hyvaksytyt.push(hakemus)
          }
          if("VASTAANOTTANUT_SITOVASTI" === hakemus.vastaanottotila) {
              $scope.erillishaunHakemusErittelyt.paikanVastaanottaneet.push(hakemus)
          } else if ("EHDOLLISESTI_VASTAANOTTANUT" === hakemus.vastaanottotila) {
              $scope.erillishaunHakemusErittelyt.ehdollisestiVastaanottaneet.push(hakemus)
          }
      });
    };

    var updateSijoitteluntulosModel = function() {
        $scope.sijoitteluntulosModel = SijoitteluntulosModel;
        $scope.sijoitteluntulosModel.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
    };

    if($routeParams.hakukohdeOid) {
        if($scope.useVtsData && $scope.isErillishakuIlmanValintalaskentaa()) {
            HakukohdeModel.valinnanvaiheet.forEach(function (e) {
                e.valintatapajonot.forEach(function(v) {
                    ValinnanTulos.get({valintatapajonoOid: v.oid}).then(function(response) {
                        updateErillishaunHakemusErittelyt(response.data);
                    }, function(error) {
                        console.log(error);
                    });
                });
            });
        } else {
            updateSijoitteluntulosModel()
        }
    }
}])

.controller('HakukohdeNimiController', ['$scope', '$routeParams', 'HakukohdeModel', function ($scope, $routeParams, HakukohdeModel) {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.hakukohdeModel = HakukohdeModel;
    }]);

