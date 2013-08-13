app.factory('ValintalaskentaHistoriaModel', function(ValintalaskentaHistoria,$routeParams) {
	
	
	var modelInterface = {
		model: [],
		get: function() {
			return this.model;
		},
		refresh: function() {
			var self = this;
			// "valintatapajonoOid") String valintatapajonoOid, @PathParam("versio")Integer versio, @PathParam("hakemusOid"
			///haku/:hakuOid/hakukohde/:hakukohdeOid/hakija/:hakijaOid/valintalaskentahistoria
			//valintatapajono/:valintatapajonoOid/versio/:versio/hakemus/:hakemusOid/valintalaskentahistoria
			
			ValintalaskentaHistoria.get({valintatapajonoOid: $routeParams.valintatapajonoOid, hakemusOid: $routeParams.hakemusOid}, function(data) {
				var result = [];
				angular.forEach(data, function(h) {
					result.push(angular.fromJson(h.historia));
				});
				self.model = result;
			});
			
		}

	};
    modelInterface.refresh();
    return modelInterface;
});

function ValintalaskentaHistoriaController($scope, $routeParams, ValintalaskentaHistoriaModel) {
	$scope.hakijaOid = $routeParams.hakijaOid;
	$scope.model = ValintalaskentaHistoriaModel;
	
	
	
	//TODO päivitä valintalaskentahistoriamodel
}
