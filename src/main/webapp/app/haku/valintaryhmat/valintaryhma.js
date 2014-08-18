//domain .. this is both, service & domain layer
app.factory('ValintaryhmaLista', function ($resource, $q, ValintaryhmatJaHakukohteet, AuthService) {

    //and return interface for manipulating the model
    var modelInterface = {
        //models
        valintaperusteList: [],
        search: {   q: null,
            valintaryhmatAuki: null
        },
        tilasto: {
            valintaryhmia: 0,
            valintaryhmiaNakyvissa: 0
        },

        refresh: function () {
            var deferred = $q.defer();
            ValintaryhmatJaHakukohteet.get({
                q: this.search.q,
                hakukohteet: true
            }, function (result) {
                modelInterface.valintaperusteList = result;
                modelInterface.update();
                deferred.resolve();
            }, function (error) {
                deferred.reject('Valintaryhmapuun tietojen hakeminen epäonnistui', error);
            });

            return deferred.promise;
        },
        expandTree: function () {
            modelInterface.forEachValintaryhma(function (item) {
                item.isVisible = true;
            });
        },
        forEachValintaryhma: function (f) {
            var recursion = function (item, f) {
                f(item);
                if (item.alavalintaryhmat) for (var i = 0; i < item.alavalintaryhmat.length; i++)  recursion(item.alavalintaryhmat[i], f);
            }
            for (var i = 0; i < modelInterface.valintaperusteList.length; i++) recursion(modelInterface.valintaperusteList[i], f);
        },
        getValintaryhma: function (oid) {
            var valintaryhma = null;
            modelInterface.forEachValintaryhma(function (item) {
                if (item.oid == oid) valintaryhma = item;
            });
            return valintaryhma;
        },
        update: function () {
            var list = modelInterface.valintaperusteList;
            modelInterface.valintaperusteList = [];
            modelInterface.tilasto.valintaryhmia = 0;
            modelInterface.tilasto.valintaryhmiaNakyvissa = 0;

            var recursion = function (item) {

                if (item.tyyppi == 'VALINTARYHMA') {
                    modelInterface.tilasto.valintaryhmia++;
                }

                /*
                 AuthService.getOrganizations("APP_VALINTAPERUSTEET").then(function(organisations){
                 "use strict";
                 item.access = false;
                 organisations.forEach(function(org){

                 if(item.organisaatiot.length > 0) {
                 item.organisaatiot.forEach(function(org2) {
                 if(org2.parentOidPath.indexOf(org) > -1) {
                 item.access = true;
                 }
                 });
                 } else {
                 AuthService.updateOph("APP_VALINTAPERUSTEET").then(function(){
                 item.access = true;
                 });
                 }
                 });
                 });
                 */


                if (item.alavalintaryhmat) {
                    for (var i = 0; i < item.alavalintaryhmat.length; i++)  recursion(item.alavalintaryhmat[i]);
                }
            }
            for (var i = 0; i < list.length; i++) {
                recursion(list[i]);
            }

            modelInterface.valintaperusteList = list;
        },
        expandNode: function (node) {
            if ((node.alavalintaryhmat && node.alavalintaryhmat.length > 0)) {

                if (node.isVisible != true) {
                    node.isVisible = true;
                } else {
                    node.isVisible = false;
                }
            }
        }
    };
    return modelInterface;
});

function ValintaryhmaController($scope, $routeParams, $modal, _, HakuModel, ValintaryhmaLista, ValintaryhmaLaskenta) {
    $scope.predicate = 'nimi';
    $scope.domain = ValintaryhmaLista;

    var promise = ValintaryhmaLista.refresh();
    promise.then(function (result) {
        _.forEach($scope.domain.valintaperusteList, function (valintaperusteHierarkia) {
            $scope.reverseSearch(valintaperusteHierarkia);
        });

    });

    $scope.hakukohteet = [];

    $scope.hakumodel = HakuModel;

    $scope.expandNode = function (node) {
        if ((node.alavalintaryhmat && node.alavalintaryhmat.length > 0) ||
            (node.hakukohdeViitteet && node.hakukohdeViitteet.length > 0 )) {
            if (node.isVisible != true) {
                node.isVisible = true;

                // aukaisee alitason, jos ei ole liikaa tavaraa
                var iter = function (ala) {
                    ala.forEach(function (ala) {
                        if (!ala.alavalintaryhmat || ala.alavalintaryhmat.length < 4) {
                            ala.isVisible = true;
                            iter(ala.alavalintaryhmat);
                        }
                    });
                }
                if (node.alavalintaryhmat.length < 4) {
                    iter(node.alavalintaryhmat);
                }

            } else {
                node.isVisible = false;
            }
        }
    };

    $scope.changeValintaryhma = function (valintaryhma) {
        $scope.hakukohteetVisible ? $scope.hakukohteetVisible = false : "";
        $scope.selectedValintaryhma = valintaryhma;
        $scope.hakukohteet.length = 0;
    };

    $scope.showHakukohteet = function (valintaryhma) {
        if (_.isEmpty($scope.hakukohteet)) {
            $scope.fetchValintaryhmat(valintaryhma);
        }
        $scope.hakukohteetVisible = !$scope.hakukohteetVisible;
    };

    $scope.fetchValintaryhmat = function(valintaryhma) {
        $scope.recurseValintaryhmat(valintaryhma, [$scope.findHakukohteet]);
    }


    $scope.reverseSearch = function (valintaryhma) {
        _.forEach(valintaryhma.alavalintaryhmat, function (alaValintaryhma) {
            $scope.reverseSearch(alaValintaryhma);
        });

        if (valintaryhma.tyyppi === 'HAKUKOHDE') {
            valintaryhma.showValintaryhma = true;
        } else if ($scope.hasHakukohdeViiteChild(valintaryhma.alavalintaryhmat) || valintaryhma.hakukohdeViitteet.length > 0) {
            valintaryhma.showValintaryhma = true;
        } else if (_.isEmpty(valintaryhma.alavalintaryhmat) && _.isEmpty(valintaryhma.hakukohdeViitteet)) {
            valintaryhma.showValintaryhma = false;
        } else {
            valintaryhma.showValintaryhma = false;
        }
    };

    $scope.hasHakukohdeViiteChild = function (alavalintaryhmat) {
        return _.some(alavalintaryhmat, function (alaValintaryhma) {
            return alaValintaryhma.showValintaryhma;
        });
    };

    //suorita funcList:n funktiot kaikilla valintaryhmille
    $scope.recurseValintaryhmat = function (valintaryhma, funcList) {
        _.forEach(funcList, function (func) {
            func(valintaryhma);
        });
        _.forEach(valintaryhma.alavalintaryhmat, function (valintaryhma) {
            $scope.recurseValintaryhmat(valintaryhma, funcList);
        });
    };

    $scope.findHakukohteet = function (valintaryhma) {

        _.forEach(valintaryhma.hakukohdeViitteet, function (hakukohde) {
            $scope.hakukohteet.push(hakukohde);
        });
    };

    $scope.kaynnistaValintalaskenta = function (valintaryhma) {

        $scope.fetchValintaryhmat(valintaryhma);

        var hakukohdeOids = [];
        _.forEach($scope.hakukohteet, function (hakukohde) {
            hakukohdeOids.push(hakukohde.oid);
        });


        var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/valintalaskentaikkuna.html',
            controller: ValintaryhmaValintalaskentaIkkunaCtrl,
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $scope.hakumodel.hakuOid.oid,
                        hakukohdeOids: hakukohdeOids,
                        laskeMuistissa: true
                    };
                }
            }
        });


    };

    $scope.kaynnistaValintakoelaskenta = function () {
        var hakuOid = $routeParams.hakuOid;
        var hakukohdeOid = $routeParams.hakukohdeOid;
        ValintakoelaskentaAktivointi.aktivoi({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}, {}, function (id) {
            Latausikkuna.avaaKustomoitu(id, "Valintakoelaskenta hakukohteelle " + hakukohdeOid, "", "haku/hallinta/modaalinen/valintakoeikkuna.html", {});
        }, function (error) {
            Ilmoitus.avaa("Valintakoelaskenta epäonnistui", "Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon. Valintakoelaskenta epäonnistui palvelin virheeseen:" + error.data, IlmoitusTila.ERROR);
        });
    };


}


