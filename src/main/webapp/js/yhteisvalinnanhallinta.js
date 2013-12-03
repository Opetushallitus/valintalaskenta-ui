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
app.factory('Poller', function($http,$q){
    return {
         poll : function(api){
             var deferred = $q.defer();
             $http.get(api).then(function (response) {
                     deferred.resolve(response.data);
             });
             return deferred.promise;
         }

     }
 });
function YhteisvalinnanHallintaController($scope, $timeout, $q, $location, Poller, $routeParams, $http, $route, $window, SijoitteluAjo, JalkiohjausXls, AktivoiKelaFtp, AktivoiKelaVienti,Jalkiohjauskirjeet, Sijoitteluktivointi, HakuModel, VirheModel, AktivoiHaunValintalaskenta, ParametriService, AktivoiHaunValintakoelaskenta, JatkuvaSijoittelu) {
	$scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
	$scope.VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE;
	$scope.hakumodel = HakuModel;
	$scope.virheet = VirheModel;
	$scope.naytaKokeita = 50;
	$scope.viestintapalveluntiedostot = [];
	$scope.kelatiedostot = [];
	$scope.jalkiohjausLimit = 5;
	$scope.kelaLimit = 5;
	
	$scope.showMoreJalkiohjaus = function() {
		$scope.jalkiohjausLimit = $scope.jalkiohjausLimit + 10;
	};
	$scope.showMoreKela = function() {
		$scope.kelaLimit = $scope.kelaLimit + 10;
	};
	
	var Repeater = function () {
        $scope.$apply(function () {
            $scope.p1 = Poller.poll(VIESTINTAPALVELU_URL_BASE + "/api/v1/download");
            $scope.p1.then(function(data){
            	if(data.length != $scope.viestintapalveluntiedostot.length) {
    				$scope.viestintapalveluntiedostot = data;
    			}
            });
            $scope.p2 = Poller.poll(VALINTALASKENTAKOOSTE_URL_BASE + "resources/kela/listaus");
            $scope.p2.then(function(data){
            	if(data.length != $scope.kelatiedostot.length) {
    				$scope.kelatiedostot = data;
    			}
            });
        });
    };
    
    var timer = $window.setInterval(Repeater, 5000);
    $scope.$on('$destroy', function cleanup() {
    	$window.clearInterval(timer);
	});
    
	$scope.ftpVienti = function(tiedosto) {
		AktivoiKelaFtp.put({
			documentId:tiedosto.documentId
		}, function() {
			//$scope.paivitaKelaListaus();
		}, function() {
			//$scope.paivitaKelaListaus();
		});
	}
	
	$scope.lataa = function(tiedosto) {
		$window.location.href = VIESTINTAPALVELU_URL_BASE + "/api/v1/download/" + tiedosto.documentId;
	}
	
	SijoitteluAjo.get({hakuOid: $routeParams.hakuOid, sijoitteluajoOid: 'latest'}, function(result){
	    $scope.sijoitteluModel = result;
	});
	
	$scope.aktivoiJalkiohjaustuloksetPdf = function() {
		Jalkiohjauskirjeet.query({hakuOid: $routeParams.hakuOid}, function(resurssi) {
			alert("Jälkiohjauskirjeen luonti on käynnistetty! Luonti kestää noin 20minuuttia.");
    	}, function(response) {
    		alert("Jälkiohjauskirjeen luonti epäonnistui.");
    	});
	}
	
	$scope.aktivoiJalkiohjaustuloksetXls = function() {
		JalkiohjausXls.query({hakuOid:$routeParams.hakuOid});
	}
	
	$scope.aktivoiKelaVienti = function() {
		AktivoiKelaVienti.query({
			hakuOid:$routeParams.hakuOid,
			hakukohdeOid:"1.2.246.562.5.02371_01_610_1410",
			lukuvuosi:"22.11.1983",
			poimintapaivamaara:"22.11.1983"
		}, function() {
			$scope.paivitaKelaListaus();
		}, function() {
			$scope.paivitaKelaListaus();
		});
		
		
	}
	
    $scope.kaynnistaSijoittelu = function() {
        var hakuoid = $routeParams.hakuOid;
        Sijoitteluktivointi.aktivoi({hakuOid: hakuoid}, function() {});
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

    $scope.kaynnistaJatkuvaSijoittelu = function() {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'aktivoi'}, function(result) {
            $route.reload();
        }, function(error){
            alert(error);
        });
    }

    $scope.pysaytaJatkuvaSijoittelu = function() {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'poista'}, function(result) {
            $route.reload();
        }, function(error){
            alert("virhe");
        });
    }

    JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid}, function(result) {
        $scope.jatkuva = result;
    }, function(error){
        alert("virhe");
    });

    $scope.privileges = ParametriService;
}
