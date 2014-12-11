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
        'ValinnanhallintaModel', 'HakukohdeModel', 
        'ParametriService', 'IlmoitusTila', 'HakuModel',
    function ($scope, $routeParams, $modal, Latausikkuna, Ilmoitus, ValinnanhallintaModel, HakukohdeModel,
              ParametriService, IlmoitusTila, HakuModel) {
    "use strict";

    $scope.model = ValinnanhallintaModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.kaikkiKerralla = function() {
        var erillishaku = HakuModel.hakuOid.erillishaku;
    	var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/hakukohdeseurantaikkuna.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        erillishaku: erillishaku,
                        nimentarkennus: $scope.hakukohdeModel.hakukohdeNimi,
                        tyyppi: "HAKUKOHDE",
                        hakukohteet: [$routeParams.hakukohdeOid]
                    };
                }
            }
        });
    };
    $scope.kaynnistaValintalaskenta = function (valinnanvaihe) {
        var erillishaku = HakuModel.hakuOid.erillishaku;
        var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/hakukohdeseurantaikkuna.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        erillishaku: erillishaku,
                        valinnanvaihe: valinnanvaihe,
                        valintakoelaskenta: false,
                        tyyppi: "HAKUKOHDE",
                        hakukohteet: [$routeParams.hakukohdeOid]
                    };
                }
            }
        });
    };

    $scope.kaynnistaValintakoelaskenta = function () {
        var hakuOid = $routeParams.hakuOid;
        var hakukohdeOid = $routeParams.hakukohdeOid;
        var erillishaku = HakuModel.hakuOid.erillishaku;
        var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/valintakoelaskenta.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        erillishaku: erillishaku,
                        valinnanvaihe: null,
                        valintakoelaskenta: true,
                        tyyppi: "HAKUKOHDE",
                        hakukohteet: [$routeParams.hakukohdeOid]
                    };
                }
            }
        });
    };

    $scope.privileges = ParametriService;
}]);
