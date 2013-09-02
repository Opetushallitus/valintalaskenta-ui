app.factory('VirheModel', function (HakuVirheet) {

    var factory = (function() {
        var instance = {};
        instance.valintalaskenta = [];
        instance.valintakoe = [];

        instance.refresh = function(oid) {

            HakuVirheet.get({parentOid: oid, virhetyyppi: 'virheet'}, function(result) {
                if(result.length > 0) {
                    instance.valintalaskenta = result;
                } else {
                    instance.eiLaskentaVirheita = true;
                }
            });

            HakuVirheet.get({parentOid: oid, virhetyyppi: 'valintakoevirheet'}, function(result) {
                if(result.length > 0) {
                    instance.valintakoe = result;
                } else {
                    instance.eiKoeVirheita = true;
                }
            });
        }

        return instance;
    })();

    return factory;

});

function YhteisvalinnanHallintaController($scope, $location, $routeParams, Sijoitteluktivointi, HakuModel, VirheModel, AktivoiHaunValintalaskenta, ParametriService, AktivoiHaunValintakoelaskenta) {
	$scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

	$scope.hakumodel = HakuModel;
	$scope.virheet = VirheModel;
	$scope.naytaKokeita = 50;

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

    $scope.showErrors = function() {
        VirheModel.refresh($routeParams.hakuOid);
    }

    $scope.show = function(virhe) {
        virhe.show =! virhe.show;
    }

    $scope.stopPropagination = function($event) {
        $event.stopPropagation();
    }

    $scope.henkilonakyma = function(hakemusOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemusOid + '/henkilotiedot');
    }

    $scope.hakukohdenakyma = function(hakukohdeOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/hakukohde/' + hakukohdeOid + '/pistesyotto');
    }

    $scope.privileges = ParametriService;
}
