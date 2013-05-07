app.factory('ValintalaskentatulosModel', function(ValinnanvaiheListByHakukohde) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.valinnanvaiheet = [];
		
		this.refresh = function(hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			    model.valinnanvaiheet = result;
			});
			
		}

// Kai tämä on hyvä joka kerta refreshata, niin ei tarvi painaa alt+f5/cmd+r
//		this.refreshIfNeeded = function(hakukohdeOid) {
//
//			if( model.hakukohdeOid != hakukohdeOid ) {
//				model.refresh(hakukohdeOid);
//			}
//		}
		

	};

	return model;
});


function ValintalaskentatulosController($scope, $location, $routeParams, ValintalaskentatulosModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = ValintalaskentatulosModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refresh($scope.hakukohdeOid);

}