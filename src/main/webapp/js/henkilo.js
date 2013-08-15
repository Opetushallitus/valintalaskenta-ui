function HenkiloController($scope,$routeParams) {
	$scope.hakuOid = $routeParams.hakuOid;
	$scope.hakukohdeOid = $routeParams.hakukohdeOid;
	
	$scope.toggleHakukohteetVisible = function() {
		if(!$scope.hakukohteetVisible) {
			$scope.hakukohteetVisible = true;
		}else {
			$scope.hakukohteetVisible = false;
		}
	}

	$scope.showHakukohde = function(hakukohdeOid) {
	      
	}
}