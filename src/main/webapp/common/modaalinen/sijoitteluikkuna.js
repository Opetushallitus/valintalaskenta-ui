function SijoitteluIkkunaCtrl($scope, $modalInstance, $window, $log,
		$interval, $routeParams, HakuModel, Ilmoitus, IlmoitusTila, SijoitteluAktivointi, SijoittelunValvonta) {

	$scope.hakuOid = $routeParams.hakuOid;
	$scope.nimi = HakuModel.getNimi();
	$scope.ohitettu = 0;
	$scope.valmis = 0;
	SijoitteluAktivointi.aktivoi({hakuOid: $scope.hakuOid}, {}, function (id) {
		update();
    }, function () {
        Ilmoitus.avaa("Sijoittelun aktivointi epäonnistui", "Sijoittelun aktivointi epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
    });
	
	var timer = $interval(function() {
		update();
	}, 10000);

	var update = function() {
	
		SijoittelunValvonta.hae({
			hakuoid : $scope.hakuOid
		}, function(r) {
			console.log(r);
		});
	
	};

	$scope.ok = function() {
		$interval.cancel(timer);
		$modalInstance.close(); 
	};

	$scope.cancel = function() {
		$interval.cancel(timer);
		$modalInstance.dismiss('cancel');
	};
	$scope.isValmis = function() {
		return 0;
	};
	$scope.isOhitettu = function() {
		return 0;
	};

};
