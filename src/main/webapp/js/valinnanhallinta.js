app.factory('ValinnanhallintaModel', function(ValinnanvaiheListFromValintaperusteet, ValintalaskentaAktivointi, HakukohdeValinnanvaihe) {

	var model;
	model = new function() {

		this.hakukohde = {};
        this.hakukohdeOid = '';
        this.valinnanvaiheet = [];

		this.refresh = function(hakukohdeOid) {
			if( hakukohdeOid !== undefined) {
                ValinnanvaiheListFromValintaperusteet.get({hakukohdeoid: hakukohdeOid}, function(result) {
					model.valinnanvaiheList = result;
				});

				HakukohdeValinnanvaihe.get({parentOid: model.hakukohdeOid}, function(result) {
					model.valinnanvaiheet = result;
				});
			}
		}

        this.kaynnistaValintalaskenta = function(valinnanvaihe) {
            ValintalaskentaAktivointi.aktivoi({hakukohdeOid: this.hakukohdeOid, valinnanvaihe: valinnanvaihe}, function() {

            });
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

function ValinnanhallintaController($scope, $location, $routeParams, ValinnanhallintaModel, HakukohdeModel) {
	$scope.model = ValinnanhallintaModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
	$scope.model.refreshIfNeeded($routeParams.hakukohdeOid);

}