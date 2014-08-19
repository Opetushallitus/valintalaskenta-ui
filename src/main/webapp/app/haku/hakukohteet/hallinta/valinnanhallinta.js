app.factory('ValinnanhallintaModel', function (ValinnanvaiheListFromValintaperusteet) {
    "use strict";

    var model;
    model = new function () {

        this.hakukohde = {};
        this.hakukohdeOid = '';
        this.tulosValinnanvaiheet = [];
        this.errors = [];

        this.refresh = function (hakukohdeOid) {
            if (hakukohdeOid !== undefined) {
                model.hakukohde = {};
                model.tulosValinnanvaiheet = [];
                model.errors = [];
                model.errors.length = 0;
                ValinnanvaiheListFromValintaperusteet.get({hakukohdeoid: hakukohdeOid}, function (result) {
                    model.tulosValinnanvaiheet = result;
                }, function (error) {
                    model.errors.push(error);
                });
            }
        };

        this.refreshIfNeeded = function (hakukohdeOid) {
            this.hakukohdeOid = hakukohdeOid;
            if (model.hakukohde.oid !== hakukohdeOid) {
                model.refresh(hakukohdeOid);
            }
        };

    }();

    return model;
});

angular.module('valintalaskenta').
    controller('ValinnanhallintaController',['$scope', '$routeParams', '$modal', 'Latausikkuna', 'Ilmoitus',
        'ValinnanhallintaModel', 'HakukohdeModel', 'ValintalaskentaMuistissa', 'ValintakoelaskentaAktivointi',
        'ParametriService', 'IlmoitusTila',
    function ($scope, $routeParams, $modal, Latausikkuna, Ilmoitus, ValinnanhallintaModel, HakukohdeModel,
              ValintalaskentaMuistissa, ValintakoelaskentaAktivointi, ParametriService, IlmoitusTila) {
    "use strict";

    $scope.model = ValinnanhallintaModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.kaikkiKerralla = function() {
    	var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/hakukohdeseurantaikkuna.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        nimentarkennus: $scope.hakukohdeModel.getHakukohdeNimi(),
                        tyyppi: "HAKUKOHDE",
                        hakukohteet: [$routeParams.hakukohdeOid]
                    };
                }
            }
        });
    };
    $scope.kaynnistaValintalaskenta = function (valinnanvaihe) {
        var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/valintalaskentaikkuna.html',
            controller: ValintalaskentaIkkunaCtrl,
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        valinnanvaihe: valinnanvaihe,
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

    $scope.privileges = ParametriService;
}]);
