

function YhteisvalinnanHallintaController($scope, $location, $routeParams, Sijoitteluktivointi, HakuModel, AktivoiHaunValintalaskenta, ParametriService, HakuVirheet) {
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


    $scope.showErros = function() {
        HakuVirheet.get({parentOid: $routeParams.hakuOid}, function(result) {
            $scope.virheet = result;
        });
    }

    HakuVirheet.get({parentOid: $routeParams.hakuOid}, function(result) {
        $scope.virheet = result;
    });


    $scope.showHakukohde = function(virhe) {
        virhe.showValinnanvaihe =! virhe.showValinnanvaihe;
    }

    $scope.stopPropagination = function($event) {
        $event.stopPropagation();
    }

    $scope.privileges = ParametriService;
}
