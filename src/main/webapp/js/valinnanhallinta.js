app.factory('ValinnanhallintaModel', function(ValinnanvaiheListFromValintaperusteet, ValintalaskentaAktivointi, HakukohdeValinnanvaihe) {

	var model;
	model = new function() {

		this.hakukohde = {};
        this.hakukohdeOid = '';
        //this.valintaperusteValinnanvaiheet = [];
        this.tulosValinnanvaiheet = [];

		this.refresh = function(hakukohdeOid) {
			if( hakukohdeOid !== undefined) {
                ValinnanvaiheListFromValintaperusteet.get({hakukohdeoid: hakukohdeOid}, function(result) {
					model.tulosValinnanvaiheet = result;
				});

                /*
				HakukohdeValinnanvaihe.get({parentOid: model.hakukohdeOid}, function(result) {
					model.valinnanvaiheet = result;
				});
				*/
			}
		}

		this.refreshIfNeeded = function(hakukohdeOid) {
            this.hakukohdeOid = hakukohdeOid;
			if(model.hakukohde.oid !== hakukohdeOid) {
				model.refresh(hakukohdeOid);
			}
		}

	};

	return model;
});

function ValinnanhallintaController($scope, $location, $routeParams, ValinnanhallintaModel, HakukohdeModel, ValintalaskentaAktivointi, ValintakoelaskentaAktivointi) {
	$scope.model = ValinnanhallintaModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
	$scope.model.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.kaynnistaValintalaskenta = function() {
        var hakukohdeOid = $routeParams.hakukohdeOid;
        var valinnanVaihe = $routeParams.valinnanvaihe;
        ValintalaskentaAktivointi.aktivoi({hakukohdeOid: hakukohdeOid, valinnanvaihe: valinnanvaihe}, function() {
        });
    }

    $scope.kaynnistaValintakoelaskenta = function() {
        var hakukohdeOid = $routeParams.hakukohdeOid;
        ValintakoelaskentaAktivointi.aktivoi({hakukohdeOid: hakukohdeOid}, function() {
        });
    }
}