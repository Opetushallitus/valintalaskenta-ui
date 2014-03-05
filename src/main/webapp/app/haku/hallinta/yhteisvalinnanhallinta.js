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
        };

        return instance;
    })();

    return factory;

});

function ModalInstanceCtrl($scope, $log, $interval, $routeParams, $modalInstance, HakuModel, ValintalaskentaKeskeyta, ValintalaskentaKaynnissa, ValintalaskentaMuistissa, ValintalaskentaStatus) {
	$scope.uuid = null;
	$scope.tyot = [];
	$scope.nimi = HakuModel.getNimi();
	$scope.lisaa = false;
	$scope.getProsentit = function(t) {
		return t.prosentteina * 100;
	};
	ValintalaskentaMuistissa.aktivoi({hakuOid: $routeParams.hakuOid}, [], function(uuid) {
		$scope.uuid = uuid.latausUrl;
		update();
	}, function() {
		ValintalaskentaKaynnissa.hae(function(uuid) {
			$scope.uuid = uuid.latausUrl;
			update();
		});
	});
	
	var update = function () {
		if($scope.uuid != null) {
			ValintalaskentaStatus.get({uuid:$scope.uuid}, function(r) {
				$scope.tyot = [r.prosessi.kokonaistyo, r.prosessi.valintalaskenta, r.prosessi.hakemukset, r.prosessi.valintaperusteet, r.prosessi.hakukohteilleHakemukset];
			});
		}
    };
    
	var timer = $interval(function () {
        update();
    }, 10000);

	$scope.peruuta = function() {
    	ValintalaskentaKeskeyta.keskeyta();
    };

    $scope.naytaLisaa = function() {
    	$scope.lisaa = !$scope.lisaa;
    };

	  $scope.ok = function () {
		  $interval.cancel(timer);
	    $modalInstance.close(); //$scope.selected.item);
	  };

	  $scope.cancel = function () {
		  $interval.cancel(timer);
	    $modalInstance.dismiss('cancel');
	  };
};

function YhteisvalinnanHallintaController($scope, $modal, $interval, $log, $timeout, $q, $location, KelaDokumentti, Latausikkuna, $routeParams, $http, $route, $window, SijoitteluAjo, JalkiohjausXls, Jalkiohjauskirjeet, Sijoitteluktivointi, HakuModel, VirheModel, AktivoiHaunValintalaskenta, ParametriService, AktivoiHaunValintakoelaskenta, JatkuvaSijoittelu) {
	$scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
	$scope.DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE; 
	$scope.VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE;
	$scope.hakumodel = HakuModel;
	$scope.virheet = VirheModel;
	$scope.naytaKokeita = 50;
	// KELA TAULUKON CHECKBOXIT ALKAA
	$scope.naytetaanHaut = false;
	$scope.naytaHaut = function() {
		$scope.naytetaanHaut =true;
	};
	$scope.kaikkiHautValittu = false;
	$scope.notThisHaku = function(haku) {
		return haku != $scope.hakumodel.hakuOid;
	};
	$scope.filterNotThisHaku = function() {
		return _.filter($scope.hakumodel.haut,function(haku) {
			return $scope.notThisHaku(haku);
		});
	};
	$scope.filterValitut = function() {
		return _.filter($scope.filterNotThisHaku(),function(haku) {
			return haku.valittu;
		});
	};
	$scope.isAllValittu = function() {
		return $scope.filterNotThisHaku().length == $scope.filterValitut().length;
	};
	$scope.check = function(oid) {
		$scope.kaikkiHautValittu = $scope.isAllValittu();
	};
	$scope.checkAll = function() {
		var kaikkienTila = $scope.kaikkiHautValittu;
		_.each($scope.hakumodel.haut, function(haku) {
			haku.valittu = kaikkienTila;
		});
		$scope.kaikkiHautValittu = $scope.isAllValittu();
	};
	$scope.muodostaKelaDokumentti = function() {
		KelaDokumentti.post({ 
        	hakuOid: $routeParams.hakuOid},
        		{}, 
        		function (id) {
            Latausikkuna.avaaKustomoitu(id, "Kela-dokumentin luonti", "", "haku/hallinta/modaalinen/kelaikkuna.html", {
            	ftpVienti: function() {
            		console.log('tehaan vienti!');
            	}
            });
        }, function () {
            
        });
	};
	// KELA TAULUKON CHECKBOXIT LOPPUU
	
	///////////////////
	$scope.aktivoiMuistinvarainenValintalaskenta = function () {
		
	    var valintalaskentaInstance = $modal.open({
	      backdrop: 'static',
	      templateUrl: 'haku/hallinta/modaalinen/valintalaskentaikkuna.html',
	      controller: ModalInstanceCtrl,
	      resolve: {
	      }
	    });

	    valintalaskentaInstance.result.then(function () { // selectedItem
	    	
	    }, function () {
	    	
	    });
	};

	SijoitteluAjo.get({hakuOid: $routeParams.hakuOid, sijoitteluajoOid: 'latest'}, function(result){
	    $scope.sijoitteluModel = result;
	});
	
	$scope.muodostaJalkiohjauskirjeet = function() {
		Jalkiohjauskirjeet.post({ 
        	hakuOid: $routeParams.hakuOid},
        		{}, 
        		function (id) {
            Latausikkuna.avaa(id, "Jälkiohjauskirjeiden luonti", "");
        }, function () {
            
        });
	};
	
	$scope.aktivoiJalkiohjaustuloksetXls = function() {
		JalkiohjausXls.query({hakuOid:$routeParams.hakuOid});
	};
	
    $scope.kaynnistaSijoittelu = function() {
        var hakuoid = $routeParams.hakuOid;
        Sijoitteluktivointi.aktivoi({hakuOid: hakuoid}, function(d) {

        }, function() {
        	$window.alert("Sinulla ei ole tarvittavia käyttöoikeuksia!");
        });
    };

    $scope.aktivoiHaunValintalaskenta = function() {
      var hakuoid = $routeParams.hakuOid;
          AktivoiHaunValintalaskenta.aktivoi({hakuOid: hakuoid}, function() {
      });
    };

    $scope.aktivoiHaunValintakoelaskenta = function() {
       var hakuoid = $routeParams.hakuOid;
           AktivoiHaunValintakoelaskenta.aktivoi({hakuOid: hakuoid}, function() {
       });
    };

    $scope.showErrors = function() {
        VirheModel.refresh($routeParams.hakuOid);
    };

    $scope.show = function(virhe) {
        virhe.show =! virhe.show;
    };

    $scope.stopPropagination = function($event) {
        $event.stopPropagation();
    };

    $scope.henkilonakyma = function(hakemusOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemusOid + '/henkilotiedot');
    };

    $scope.hakukohdenakyma = function(hakukohdeOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/hakukohde/' + hakukohdeOid + '/pistesyotto');
    };

    $scope.kaynnistaJatkuvaSijoittelu = function() {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'aktivoi'}, function(result) {
            $route.reload();
        }, function(error){
            alert(error);
        });
    };

    $scope.pysaytaJatkuvaSijoittelu = function() {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'poista'}, function(result) {
            $route.reload();
        }, function(error){
            alert("virhe");
        });
    };

    JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid}, function(result) {
        $scope.jatkuva = result;
    }, function(error){
        alert("virhe");
    });

    $scope.privileges = ParametriService;
}
