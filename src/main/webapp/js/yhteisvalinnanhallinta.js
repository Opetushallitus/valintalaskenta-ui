

function YhteisvalinnanHallintaController($scope, $location, $routeParams, Sijoitteluktivointi, HakuModel, AktivoiHaunValintalaskenta, ParametriService, HakuVirheet, AktivoiHaunValintakoelaskenta) {
	$scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

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

    $scope.aktivoiHaunValintakoelaskenta = function() {
       var hakuoid = $routeParams.hakuOid;
           AktivoiHaunValintakoelaskenta.aktivoi({hakuOid: hakuoid}, function() {
       });
    }



    $scope.showErros = function() {
        HakuVirheet.get({parentOid: $routeParams.hakuOid}, function(result) {
            if(result.length > 0) {
                $scope.virheet = result;
            } else {
                $scope.eiVirheita = true;
            }
        });
    }

    $scope.showHakukohde = function(virhe) {
        virhe.showValinnanvaihe =! virhe.showValinnanvaihe;
    }

    $scope.stopPropagination = function($event) {
        $event.stopPropagation();
    }

    $scope.henkilonakyma = function(hakemusOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemusOid + '/henkilotiedot');
    }

    $scope.privileges = ParametriService;
}
