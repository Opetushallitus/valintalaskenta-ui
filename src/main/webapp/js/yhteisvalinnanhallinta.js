function YhteisvalinnanHallintaController($scope, $location, $routeParams, Sijoitteluktivointi  ) {

    $scope.kaynnistaSijoittelu = function() {
        var hakuoid = $routeParams.hakuOid;
            Sijoitteluktivointi.aktivoi({hakuOid: hakuoid}, function() {
        });
    }
}

