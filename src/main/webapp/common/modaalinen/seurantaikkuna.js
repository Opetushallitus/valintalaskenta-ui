function SeurantaIkkunaCtrl($scope, $modalInstance, oids, $window, $log, $interval, $routeParams, 
		HakuModel, ValintalaskentaKerrallaHakukohteille, ValintalaskentaKerrallaAktivointi, 
		Ilmoitus, IlmoitusTila, SeurantaPalvelu,
		ValintalaskentaKerrallaUudelleenYrita, SeurantaPalveluLataa) {
	$scope.uuid = oids.uuid;
	$scope.kaynnissa = false;
	$scope.nimi = HakuModel.getNimi();
	$scope.nimentarkennus = oids.nimentarkennus;
	$scope.lisaa = false;
	$scope.ohitettu = 0;
	$scope.tehty = 0;
	$scope.kaikkityot = 0;
	$scope.disabloikeskeyta = false;
	$scope.source = null;
	var timer = undefined;
    $scope.paivitaPollaten = function(uuid) {
    	$scope.uuid = uuid;
		update();
		$interval.cancel(timer);
		timer = $interval(function () {
	        update();
	    }, 10000);
    };
    $scope.paivitaSSE = function(uuid) {
    	$scope.uuid = uuid;
    	$scope.source = new EventSource(SEURANTA_URL_BASE + '/seuranta/yhteenveto/'+ uuid +'/sse');
    	$scope.source.addEventListener('message', function(e) {
    		$scope.$apply(function () {
    			var r = angular.fromJson(e.data);
        		$scope.ohitettu = r.hakukohteitaKeskeytetty;
    			$scope.tehty = r.hakukohteitaValmiina;
    			$scope.kaikkityot = r.hakukohteitaYhteensa;
    			$scope.kaynnissa = (r.tila == "MENEILLAAN");    
            }); 
  		}, false);

    	$scope.source.addEventListener('open', function(e) {
  			$log.info("SSE yhteys avattu");
  		}, false);

    	$scope.source.addEventListener('error', function(e) {
  		  if (e.readyState == EventSource.CLOSED) {
  			$log.error("SSE yhteys suljettu");
  		  }
  		}, false);
    };
    
	
	if($scope.uuid) {
		ValintalaskentaKerrallaUudelleenYrita.uudelleenyrita({
			uuid: $scope.uuid
			}, function(uuid) {
				if (!!window.EventSource) {
					$scope.paivitaSSE(uuid.latausUrl);
				} else {
					$scope.paivitaPollaten(uuid.latausUrl);
				}
		}, function() {
			Ilmoitus.avaa(
					"Valintakoelaskennan uudelleen yritys epäonnistui", 
					"Valintakoelaskenta uudelleen yritys epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", 
					IlmoitusTila.ERROR);
		});
	} else {
		var whitelist = oids.whitelist;
		if(!whitelist) {
			whitelist = true;
		}
		var tyyppi = oids.tyyppi;
		if(!tyyppi) {
			tyyppi = "HAKU";
		}
		var hakukohteet = oids.hakukohteet;
		if(!hakukohteet) {
			hakukohteet = [];
		}
		ValintalaskentaKerrallaHakukohteille.aktivoi({hakuoid: oids.hakuOid, tyyppi: tyyppi, whitelist: whitelist}, hakukohteet, 
		function(uuid) {
			if (!!window.EventSource) {
				$scope.paivitaSSE(uuid.latausUrl);
			} else {
				$scope.paivitaPollaten(uuid.latausUrl);
			}
		}, function() {
		Ilmoitus.avaa(
				"Valintakoelaskenta epäonnistui", 
				"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", 
				IlmoitusTila.ERROR);
		});
	}
	
	$scope.isKaynnissa = function() { // onko ajossa tai onko mielekasta enaa ajaakkaan
		if($scope.uuid == null || $scope.kaynnissa) {
			// tavallaan ei enaa kaynnissa koska kaikki tyot on tehty
			return $scope.ohitettu + $scope.tehty != $scope.kaikkityot;
		}
		return false;
	};
	$scope.uudelleenyrita = function() {
		if($scope.isKaynnissa()) {
			Ilmoitus.avaa(
					"Laskenta on vielä käynnissä", 
					"Uudelleen yritystä voidaan yrittää vasta kun vanha laskenta on päättynyt", 
					IlmoitusTila.ERROR);
		} else {
			ValintalaskentaKerrallaUudelleenYrita.uudelleenyrita({
				uuid: $scope.uuid
				}, function(uuid) {
					$scope.uuid = uuid.latausUrl;
					update();
					$interval.cancel(timer);
					timer = $interval(function () {
				        update();
				    }, 10000);
			}, function() {
				Ilmoitus.avaa(
						"Valintakoelaskenta epäonnistui", 
						"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", 
						IlmoitusTila.ERROR);
			});
		}
	};
	$scope.yhteenveto = function() {
		$window.open(VALINTALASKENTAKOOSTE_URL_BASE + "resources//valintalaskentakerralla/status/"+$scope.uuid+"/xls");
	};
	$scope.vieJsoniksi = function() {
		$window.open(SEURANTA_URL_BASE + "/seuranta/lataa/" +$scope.uuid);
	};
	
	var update = function () {
		if($scope.uuid != null) {
			SeurantaPalvelu.hae({uuid:$scope.uuid}, function(r) {
				$scope.ohitettu = r.hakukohteitaKeskeytetty;
				$scope.tehty = r.hakukohteitaValmiina;
				$scope.kaikkityot = r.hakukohteitaYhteensa;
				
				$scope.kaynnissa = (r.tila == "MENEILLAAN"); 
				
				if($scope.tehty + $scope.ohitettu == $scope.kaikkityot) {
					$interval.cancel(timer);
				}
			});
		}
    };
    
	$scope.peruuta = function() {
		if(!$scope.disabloikeskeyta) {
			$scope.disabloikeskeyta = true;
			ValintalaskentaKerrallaAktivointi.keskeyta({hakuoid:$scope.uuid});
		}
    };

    $scope.naytaLisaa = function() {
    	$scope.lisaa = !$scope.lisaa;
    };

	  $scope.ok = function () {
		  if(timer) {
				 $interval.cancel(timer);
			 }
	    $modalInstance.close(); //$scope.selected.item);
	  };

	  $scope.cancel = function () {
		 if(timer) {
			 $interval.cancel(timer);
		 }
	    $modalInstance.dismiss('cancel');
	  };
	  $scope.getOnnistuneetProsentit = function() {
			if($scope.kaikkityot == 0) {
				return 0;
			} else {
				return Math.round(($scope.tehty / $scope.kaikkityot) * 100);
			}
		};
		$scope.getOhitetutProsentit = function() {
			if($scope.kaikkityot == 0) {
				return 0;
			} else {
				return Math.round(($scope.ohitettu / $scope.kaikkityot) * 100);
			}
		};
		$scope.getProsentit = function() {
			if($scope.kaikkityot == 0) {
				return 0;
			} else {
				return Math.round((($scope.tehty + $scope.ohitettu) / $scope.kaikkityot) * 100);
			}
		};
};
