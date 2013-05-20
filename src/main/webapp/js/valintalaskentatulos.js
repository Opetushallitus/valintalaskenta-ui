app.factory('ValintalaskentatulosModel', function(ValinnanvaiheListByHakukohde) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.valinnanvaiheet = [];
		
		this.refresh = function(hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			     model.valinnanvaiheet = result;

                /* for(var i = 0 ; i < model.valinnanvaiheet.length ; i++) {
                    var valinanvaihe =   model.valinnanvaiheet[i];
                        console.debug('valinnaanvaihe');
                     console.debug(valinanvaihe);
                       for(var j = 0 ; j < valinanvaihe.valintatapajono.length ; j++) {
                          console.debug("valintatapajono");
                          console.debug(valinnanvaihe);
                       }
                 } */
			});
		}
	};

	return model;
});


function ValintalaskentatulosController($scope, $location, $routeParams, ValintalaskentatulosModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = ValintalaskentatulosModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refresh($scope.hakukohdeOid);

    $scope.valintalaskentatulosExcelExport = "http://localhost:8180/valintalaskenta-laskenta-service/" + "export/valintalaskentatulos.xls?hakukohdeOid=" + $routeParams.hakukohdeOid;
    
}