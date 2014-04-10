function ValintalaskentaIkkunaCtrl($scope, $modalInstance, oids, $log, $interval, $routeParams, HakuModel, ValintalaskentaKeskeyta, ValintalaskentaKaynnissa, ValintalaskentaMuistissa, ValintalaskentaStatus) {
	$scope.uuid = null;
	$scope.tyot = [];
	$scope.nimi = HakuModel.getNimi();
	$scope.lisaa = false;
	$scope.getProsentit = function(t) {
		return t.prosentteina * 100;
	};
	ValintalaskentaMuistissa.aktivoi({
		hakuOid: oids.hakuOid,
		hakukohdeOid: oids.hakukohdeOid,
		valinnanvaihe: oids.valinnanvaihe
		}, [], function(uuid) {
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
				if(r.prosessi) {
				    $scope.tyot = [r.prosessi.kokonaistyo, r.prosessi.valintalaskenta, r.prosessi.hakemukset, r.prosessi.valintaperusteet, r.prosessi.hakukohteilleHakemukset];
                    $scope.virheet = r.prosessi.exceptions;
                    $scope.varoitukset = r.prosessi.varoitukset;
				}
			});
		}
    };
    
	var timer = $interval(function () {
        update();
    }, 10000);

	$scope.peruuta = function() {
    	ValintalaskentaKeskeyta.keskeyta({uuid:$scope.uuid});
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