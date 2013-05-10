function YhteisvalinnanHallintaController($scope, $location, $routeParams, Sijoitteluktivointi  ) {

    $scope.kaynnistaValintalaskenta = function() {
        var hakuoid = $routeParams.hakuOid;
            Sijoitteluktivointi.aktivoi({hakuOid: hakuoid}, function() {
        });
    }
}

