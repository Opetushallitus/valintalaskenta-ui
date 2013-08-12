app.factory('ValintalaskentaHistoriaModel', function(ValintalaskentaHistoria) {
	var model = new function() {
		this.valintalaskentahistoriat = [];
					

		this.refresh = function(oid) {
			model.valintalaskentahistoriat = ValintalaskentaHistoria.get();
			console.log(model.valintalaskentahistoriat);
		}

	}

	return model;
});

function ValintalaskentaHistoriaController($scope, $routeParams, ValintalaskentaHistoriaModel) {
	$scope.hakijaOid = $routeParams.hakijaOid;
	$scope.model = ValintalaskentaHistoriaModel;
	
	$scope.model.refresh();
	
}
