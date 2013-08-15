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
				self.prepareHistoryForUi();
			});
		},
		prepareHistoryForUi: function() {
			var historiat = this.get();
			historiat.forEach(function(element, index, array){
				
			});
			this.nodeHasNLChild(this.get()[0]);
		},
		//returns true if nodes child has nimetty lukuarvo
		nodeHasNLChild: function(node) {
			var foundKaava = false;
			if(this.getChildKaavas(node) && this.childHasNL(node)) {
				foundKaava = this.iterateChildrenForNL(this.getChildKaavas(node));
			}
			return foundKaava;
		},

		iterateChildrenForNL: function(node) {
			var self = this;
			var foundKaava = false;
			console.log(node);
			node.forEach(function(element, index, array) {
				if(self.nodeHasNLChild(element)) {
					foundKaava = true;
				} else {
					foundKaava = self.iterateChildrenForNL(self.getChildKaavas(element));
				}
			});
			return foundKaava;
			
		},
		//returns true if this node has nimetty lukuarvo
		childHasNL: function(node) {
			var self = this;
			var foundKaava = false;
			self.getChildKaavas(node).forEach(function(element, index, array) {
				if(self.hasNimettyLukuarvo(element)) {
					foundKaava = true;
				}
			});
			return foundKaava;
		},
		hasNimettyLukuarvo: function(node) {
			if(node.funktio === "Nimetty lukuarvo") {
				return true;
			} else {
				return false;
			}
		},
		getChildKaavas: function(kaava) {
			return kaava.historiat;
		}
	};
    modelInterface.refresh();
    return modelInterface;
});



function ValintalaskentaHistoriaController($scope, $routeParams, ValintalaskentaHistoriaModel) {
	$scope.hakijaOid = $routeParams.hakijaOid;
	$scope.model = ValintalaskentaHistoriaModel;


	$scope.historyTabIndex = 0;	
	
	$scope.changeTab = function(index) {
		$scope.historyTabIndex = index;
	}

	$scope.logmodel = function() {
		console.log($scope.model.get());
	}


}
