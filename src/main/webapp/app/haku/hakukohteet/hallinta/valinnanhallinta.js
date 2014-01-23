app.factory('ValinnanhallintaModel', function (ValinnanvaiheListFromValintaperusteet, ValintalaskentaAktivointi, HakukohdeValinnanvaihe) {

    var model;
    model = new function () {

        this.hakukohde = {};
        this.hakukohdeOid = '';
        //this.valintaperusteValinnanvaiheet = [];
        this.tulosValinnanvaiheet = [];
        this.errors = [];

        this.refresh = function (hakukohdeOid) {
            if (hakukohdeOid !== undefined) {
                model.hakukohde = {};
                model.tulosValinnanvaiheet = [];
                model.errors = [];
                model.errors.length = 0;
                console.log("jee");
                ValinnanvaiheListFromValintaperusteet.get({hakukohdeoid: hakukohdeOid}, function (result) {
                    console.log("jii");
                    console.log(result);
                    model.tulosValinnanvaiheet = result;
                }, function (error) {
                    model.errors.push(error);
                });
            }
        }

        this.refreshIfNeeded = function (hakukohdeOid) {
            console.log("joo");
            this.hakukohdeOid = hakukohdeOid;
            if (model.hakukohde.oid !== hakukohdeOid) {
                model.refresh(hakukohdeOid);
            }
        }

    };

    return model;
});

function ValinnanhallintaController($scope, $location, $routeParams, ValinnanhallintaModel, HakukohdeModel, ValintalaskentaAktivointi, ValintakoelaskentaAktivointi, ParametriService) {
    $scope.model = ValinnanhallintaModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.kaynnistaValintalaskenta = function (valinnanvaihe) {
        var hakukohdeOid = $routeParams.hakukohdeOid;
        ValintalaskentaAktivointi.aktivoi({hakukohdeOid: hakukohdeOid, valinnanvaihe: valinnanvaihe}, function (success) {
        }, function (error) {
            alert("Valintalaskennan suoritus keskeytyi palvelin virheeseen: " + error.data);
        });
    }

    $scope.kaynnistaValintakoelaskenta = function () {
        var hakukohdeOid = $routeParams.hakukohdeOid;
        ValintakoelaskentaAktivointi.aktivoi({hakukohdeOid: hakukohdeOid}, function (success) {
        }, function (error) {
            alert("Valintalaskennan suoritus keskeytyi palvelin virheeseen: " + error.data);
        });
    }

    $scope.privileges = ParametriService;
}
