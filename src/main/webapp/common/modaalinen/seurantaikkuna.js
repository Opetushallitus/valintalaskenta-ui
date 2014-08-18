function SeurantaIkkunaCtrl($scope, $modalInstance, oids, $window, $log, $interval, $routeParams, 
		HakuModel, ValintalaskentaKerrallaHakukohteille, ValintalaskentaKerrallaAktivointi, 
		Ilmoitus, IlmoitusTila, SeurantaPalvelu,
		ValintalaskentaKerrallaUudelleenYrita, SeurantaPalveluLataa) {
	$scope.uuid = oids.uuid;
	$scope.kaynnissa = false;
	$scope.nimi = HakuModel.getNimi();
	$scope.valintaryhmanimi = oids.valintaryhmanimi;
	$scope.lisaa = false;
	$scope.ohitettu = 0;
	$scope.tehty = 0;
	$scope.kaikkityot = 0;
	
	if($scope.uuid) {
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
		ValintalaskentaKerrallaHakukohteille.aktivoi({hakuoid: oids.hakuOid, tyyppi: tyyppi, whitelist: whitelist}, oids.hakukohteet, 
		function(uuid) {
			$scope.uuid = uuid.latausUrl;
			update();
		}, function() {
		Ilmoitus.avaa(
				"Valintakoelaskenta epäonnistui", 
				"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", 
				IlmoitusTila.ERROR);
		});
	}

	var timer = $interval(function () {
        update();
    }, 10000);
	$scope.isKaynnissa = function() {
		return $scope.uuid == null || $scope.kaynnissa;
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
		ValintalaskentaKerrallaAktivointi.keskeyta({hakuoid:$scope.uuid});
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
