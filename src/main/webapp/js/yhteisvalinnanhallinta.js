function YhteisvalinnanHallintaController($scope, $location, $routeParams) {
	$scope.hakuOid = $routeParams.hakuOid;

	$scope.sijoittelulinkki = '/valintalaskentakoostepalvelu/resources/sijoittelu/aktivoi?hakuOid=' + $scope.hakuOid;

}

