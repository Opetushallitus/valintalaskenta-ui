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
                    $scope.virheet = r.prosessi.exceptions;
                    $scope.varoitukset = r.prosessi.varoitukset;
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

function YhteisvalinnanHallintaController($scope, $modal, $interval, $log, $timeout, $q, $location, ValintakoelaskentaAktivointi, Ilmoitus, KelaDokumentti, Latausikkuna, $routeParams, $http, $route, $window, SijoitteluAjo, JalkiohjausXls, Jalkiohjauskirjeet, Sijoitteluktivointi, HakuModel, VirheModel, ParametriService, JatkuvaSijoittelu) {
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
		return _.filter($scope.hakumodel.haut,function(haku) {
			return haku.valittu;
		});
	};
	$scope.filterValitutExcludingThisHaku = function() {
		return _.filter($scope.filterNotThisHaku(),function(haku) {
			return haku.valittu;
		});
	};
	$scope.isAllValittu = function() {
		return $scope.filterNotThisHaku().length == $scope.filterValitutExcludingThisHaku().length;
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
        		{
        		hakuOids: $scope.filterValitut()
        		}, 
        		function (id) {
            Latausikkuna.avaaKustomoitu(id, "Kela-dokumentin luonti", "", "haku/hallinta/modaalinen/kelaikkuna.html", {
            	ftpVienti: function() {
            		console.log('tehaan vienti!');
            	}
            });
        }, function () {
            Ilmoitus.avaa("Kela-dokumentin luonnin aloitus epäonnistui", "Kela-dokumentin luonnin aloitus epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
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
        	Ilmoitus.avaa("Sijoittelu on käynnissä", "Sijoittelu on nyt käynnissä.");
        }, function() {
        	Ilmoitus.avaa("Sijoittelun aktivointi epäonnistui", "Sijoittelun aktivointi epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });
    };

    $scope.aktivoiHaunValintakoelaskenta = function() {
       var hakuoid = $routeParams.hakuOid;
       ValintakoelaskentaAktivointi.aktivoi({hakuOid: hakuoid}, function(id) {
       		Latausikkuna.avaaKustomoitu(id, "Valintakoelaskenta haulle", "", "haku/hallinta/modaalinen/valintakoeikkuna.html", {
            });
       },function() {
       		Ilmoitus.avaa("Valintakoelaskenta epäonnistui", "Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
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
