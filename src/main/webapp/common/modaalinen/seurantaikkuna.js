function SeurantaIkkunaCtrl($scope, $modalInstance, oids, $log, $interval, $routeParams, 
		HakuModel, ValintalaskentaKerrallaAktivointi, Ilmoitus, IlmoitusTila, SeurantaPalvelu) {
	$scope.uuid = null;
	$scope.tyot = [];
	$scope.nimi = HakuModel.getNimi();
	$scope.lisaa = false;
	$scope.getProsentit = function(t) {
		return t.prosentteina * 100;
	};
	ValintalaskentaKerrallaAktivointi.aktivoi({
		hakuoid: oids.hakuOid
		}, function(uuid) {
		$scope.uuid = uuid.latausUrl;
		update();
	}, function() {
		Ilmoitus.avaa(
				"Valintakoelaskenta epäonnistui", 
				"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", 
				IlmoitusTila.ERROR);
	});
	
	var update = function () {
		if($scope.uuid != null) {
			SeurantaPalvelu.hae({uuid:$scope.uuid}, function(r) {
				$log.info(r);
			});
//			ValintalaskentaStatus.get({uuid:$scope.uuid}, function(r) {
//				if(r.prosessi) {
//				    $scope.tyot = [r.prosessi.kokonaistyo, r.prosessi.valintalaskenta, r.prosessi.hakemukset, r.prosessi.valintaperusteet, r.prosessi.hakukohteilleHakemukset];
//                    $scope.virheet = r.prosessi.exceptions;
//                    $scope.varoitukset = r.prosessi.varoitukset;
//				}
//			});
		}
    };
    
	var timer = $interval(function () {
        update();
    }, 10000);

	$scope.peruuta = function() {
//    	ValintalaskentaKeskeyta.keskeyta({uuid:$scope.uuid});
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
