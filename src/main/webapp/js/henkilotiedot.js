
function HenkiloTiedotController($scope,$routeParams,Hakemus,ValintalaskentaHakemus) {
	
	//
	// Hakemus 
	//
	$scope.hakemus = Hakemus.get({oid: $routeParams.hakemusOid});
	
	$scope.haku = ValintalaskentaHakemus.get({hakuoid: $routeParams.hakuOid, hakemusoid: $routeParams.hakemusOid},function() {
		console.log($scope.haku.hakukohteet);
	});
	//if($scope.tulokset.hakukohteet !== undefined) {
	
	//}
}