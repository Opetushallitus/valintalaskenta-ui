function ViestintapalveluIkkunaCtrl($scope, $modalInstance, oids, $log,
		$interval, $routeParams) {
	//$scope.pohja = "";
	//$scope.letterbody = "";
	$scope.pohjat = oids.pohjat();
    $scope.pohja = $scope.pohjat[0];
    
	$scope.oids = oids;
	$scope.pohjaVaihtui = function(p) {
		//console.log(p);
		if(p) {
			var value = _.find(p.templateReplacements, function (repl) { return repl.name == "sisalto"; }).defaultValue;
			//console.log(value);
			$scope.letterbody = value;
			tinymce.activeEditor.setContent(value);
		}
	};
	
	$scope.translate = function(name) {
		if(name === "default") {
			return "OPH:n oletuspohja";
		} else if(name === "organizationLatest") {
			return "organisaation viimeisin";
		} else if(name === "organizationLatestbyTag") {
			return "hakukohteen viimeisin";
		} else {
			return name;
		}
	}
	
	var update = function() {

	};

	var timer = $interval(function() {update();}, 10000);

	$scope.peruuta = function() {

	};

	$scope.ok = function() {
		$interval.cancel(timer);
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$interval.cancel(timer);
		$modalInstance.dismiss('cancel');
	};
};