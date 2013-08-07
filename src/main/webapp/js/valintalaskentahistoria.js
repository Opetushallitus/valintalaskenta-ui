app.factory('ValintalaskentaHistoriaModel', function() {
	var model = new function() {
		this.valintalaskentahistoria = {};

		this.refresh = function(oid) {
			//TODO tarvitaan resurssi josta hakijakohtainen valintalaskentahistoria saadaan
		}

	}

	return model;
});

function ValintalaskentaHistoriaController($scope, $routeParams, ValintalaskentaHistoriaModel) {
	$scope.hakijaOid = $routeParams.hakijaOid;

	//TODO päivitä valintalaskentahistoriamodel
}
