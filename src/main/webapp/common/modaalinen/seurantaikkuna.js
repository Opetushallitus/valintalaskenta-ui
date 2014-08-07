function SeurantaIkkunaCtrl($scope, $modalInstance, oids, $log, $interval, $routeParams, 
		HakuModel, ValintalaskentaKerrallaAktivointi, Ilmoitus, IlmoitusTila, SeurantaPalvelu) {
	$scope.uuid = null;
	$scope.nimi = HakuModel.getNimi();
	$scope.lisaa = false;
	$scope.ohitettu = 0;
	$scope.tehty = 0;
	$scope.kaikkityot = 0;
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
			return Math.round(($scope.tehty / $scope.kaikkityot) * 100);
		}
	};
	ValintalaskentaKerrallaAktivointi.aktivoi({
		hakuoid: oids.hakuOid
		}, function(uuid) {
			console.log(uuid);
			$scope.uuid = uuid.latausUrl;
			update();
	}, function() {
		Ilmoitus.avaa(
				"Valintakoelaskenta epäonnistui", 
				"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", 
				IlmoitusTila.ERROR);
	});
	$scope.uudelleenyrita = function() {
		
	};
	$scope.yhteenveto = function() {
		
	};
	var timer = $interval(function () {
        update();
    }, 10000);
	
	var update = function () {
		if($scope.uuid != null) {
			SeurantaPalvelu.hae({uuid:$scope.uuid}, function(r) {
				$scope.ohitettu = r.hakukohteitaKeskeytetty;
				$scope.tehty = r.hakukohteitaValmiina + r.hakukohteitaKeskeytetty;
				$scope.kaikkityot = r.hakukohteitaYhteensa;
				if($scope.tehty == $scope.kaikkityot) {
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
};
