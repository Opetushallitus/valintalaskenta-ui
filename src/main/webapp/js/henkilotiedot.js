
function HenkiloTiedotController($scope,$routeParams,Hakemus) {
	
	//
	// Hakemus 
	//
	$scope.hakemus = Hakemus.get({oid: $routeParams.hakemusOid});
	
	console.log($scope.hakemus);
}