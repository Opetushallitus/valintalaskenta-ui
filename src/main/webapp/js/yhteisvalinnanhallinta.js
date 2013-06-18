

function YhteisvalinnanHallintaController($scope, $location, $routeParams, Sijoitteluktivointi, HakuModel, AktivoiHaunValintalaskenta  ) {
	$scope.hakumodel = HakuModel;

    $scope.kaynnistaSijoittelu = function() {
        var hakuoid = $routeParams.hakuOid;
            Sijoitteluktivointi.aktivoi({hakuOid: hakuoid}, function() {
        });
    }
      $scope.aktivoiHaunValintalaskenta = function() {
          var hakuoid = $routeParams.hakuOid;
              AktivoiHaunValintalaskenta.aktivoi({hakuOid: hakuoid}, function() {
          });
      }

}
