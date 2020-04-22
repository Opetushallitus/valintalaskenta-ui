var app = angular.module('valintalaskenta');
app.factory('ValinnanhallintaModel', function (ValinnanvaiheListFromValintaperusteet) {
    "use strict";

    var model;
    model = new function () {

        this.hakukohde = {};
        this.hakukohdeOid = '';
        this.tulosValinnanvaiheet = [];
        this.errors = [];
        this.anyVVHasValisijoittelu = false;

        this.refresh = function (hakukohdeOid) {
            if (hakukohdeOid !== undefined) {
                model.hakukohde = {};
                model.tulosValinnanvaiheet = [];
                model.errors = [];
                model.errors.length = 0;
                model.anyVVHasValisijoittelu = false;

                ValinnanvaiheListFromValintaperusteet.get({hakukohdeoid: hakukohdeOid}, function (result) {
                    model.tulosValinnanvaiheet = result.map(
                        valinnanvaihe => Object.assign(
                            {},
                            valinnanvaihe,
                            {
                                jonot: valinnanvaihe.jonot.map(
                                    valintatapajono => Object.assign(
                                        {},
                                        valintatapajono,
                                        valintatapajono.eiLasketaPaivamaaranJalkeen
                                            ? {eiLasketaPaivamaaranJalkeen: new Date(valintatapajono.eiLasketaPaivamaaranJalkeen)}
                                            : undefined
                                    )
                                ).filter(
                                    valintatapajono => valintatapajono.aktiivinen
                                ).sort(
                                    (j, jj) => j.prioriteetti - jj.prioriteetti
                                )
                            }
                        )
                    );

                    var anyHasValisijoittelu = !_.every(result, {'hasValisijoittelu': false});

                    if (anyHasValisijoittelu) {
                        model.anyVVHasValisijoittelu = true;
                    }

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
        var nimi = ($scope.hakukohdeModel.tarjoajaNimi ? $scope.hakukohdeModel.tarjoajaNimi + ': ' : '') + $scope.hakukohdeModel.hakukohdeNimi;
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
                        nimentarkennus: nimi,
                        tyyppi: "HAKUKOHDE",
                        hakukohteet: [$routeParams.hakukohdeOid]
                    };
                }
            }
        });
    };
    $scope.kaynnistaValintalaskenta = function (valinnanvaihe) {
        var erillishaku = HakuModel.hakuOid.erillishaku;
        var nimi = ($scope.hakukohdeModel.tarjoajaNimi ? $scope.hakukohdeModel.tarjoajaNimi + ': ' : '') + $scope.hakukohdeModel.hakukohdeNimi;
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
                        nimentarkennus: nimi,
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
        var nimi = ($scope.hakukohdeModel.tarjoajaNimi ? $scope.hakukohdeModel.tarjoajaNimi + ': ' : '') + $scope.hakukohdeModel.hakukohdeNimi;
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
                        nimentarkennus: nimi,
                        valinnanvaihe: null,
                        valintakoelaskenta: true,
                        tyyppi: "HAKUKOHDE",
                        hakukohteet: [$routeParams.hakukohdeOid]
                    };
                }
            }
        });
    };

    $scope.toLocalDate = function(date) {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };

    $scope.valintatapajonoEiLaskettavissa = function(valintatapajono) {
        return valintatapajono.eiLasketaPaivamaaranJalkeen && valintatapajono.eiLasketaPaivamaaranJalkeen < new Date();
    };
}]);
