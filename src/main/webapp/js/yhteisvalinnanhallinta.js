

function YhteisvalinnanHallintaController($scope, $location, $routeParams, Sijoitteluktivointi, HakuModel  ) {
	$scope.hakumodel = HakuModel;

    $scope.kaynnistaSijoittelu = function() {
        var hakuoid = $routeParams.hakuOid;
            Sijoitteluktivointi.aktivoi({hakuOid: hakuoid}, function() {
        });
    }
}
