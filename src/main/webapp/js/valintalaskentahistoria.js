app.factory('ValintalaskentaHistoriaModel', function() {
	var model = new function() {
		this.valintalaskentahistoriat = [];

		/*
		var dummyHistories = [
			
		];

		(function parseHistory() {
			angular.forEach(dummyHistories, function(historiaString){
	    		model.valintalaskentahistoriat.push(angular.toJson(historiaString));
	    	});

	    	console.log(model.valintalaskentahistoriat);
		})();
				*/	

		this.refresh = function(oid) {
			//TODO tarvitaan resurssi josta hakijakohtainen valintalaskentahistoria saadaan
		}

	}

	return model;
});

function ValintalaskentaHistoriaController($scope, $routeParams, ValintalaskentaHistoriaModel) {
	$scope.hakijaOid = $routeParams.hakijaOid;
	$scope.model = ValintalaskentaHistoriaModel;
	//TODO päivitä valintalaskentahistoriamodel
}
