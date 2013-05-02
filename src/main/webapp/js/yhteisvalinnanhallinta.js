function YhteisvalinnanHallintaController($scope, $location, $routeParams) {
	$scope.hakuOid = $routeParams.hakuOid;

	$scope.startSijoittelu = function() {
		$location.path('/valintalaskentakoostepalvelu/resources/sijoittelu/aktivoi?hakuOid=' + $scope.hakuOid);
	}

}

