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
			var self = this;
			var historiat = this.get();
			
			historiat.forEach(function(element, index, array){
				self.operateTree(element);
			});
		},
		operateTree: function(node) {

			var self = this;
			var subKaavas = this.hasKaavas(node);
			var hasChildNL = false; 
			if(subKaavas) {

				//search through subtree and determine whether each node has at least one child 
				subKaavas.forEach(function(subnode, index, array) {
					hasChildNL = self.nodesChildrenHasNimettyLukuarvo(subnode);
				});

				subKaavas.forEach(function(subnode, index, array){
					self.operateTree(subnode);
				});
			}
		},

		//extend each node with key 'NL' and value true if 
		//this node has a child with funktio value Nimetty lukuarvo
		nodesChildrenHasNimettyLukuarvo: function(node) {
			var self = this;
			var hasNL = false;
			var subnodeArray = self.hasKaavas(node);
			
			if(subnodeArray) {
				subnodeArray.forEach( function(subnode, index, array){
					if (self.hasNimettyLukuarvo(subnode)) {
						hasNL = true;
						self.nodesChildrenHasNimettyLukuarvo(subnode);
					} else {
						hasNL = self.nodesChildrenHasNimettyLukuarvo(subnode);	
					}

					//extend current object to help UI show or hide it
					if(hasNL) {
						angular.extend(node, {"NL":"true"});
					} else {
						angular.extend(node, {"NL":"false"});
					}

				});
			}
			return hasNL;
		},
		hasNimettyLukuarvo: function(node) {
			if(node.funktio === "Nimetty lukuarvo") {
				return true;
			} 
			return false;
			
		},
		//returns historiat if object has it otherwise return false
		hasKaavas: function(node) {
			
			if(node && node.historiat) {
				return node.historiat;
			} 
			return false;
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
	$scope.isUndefined = function(v) {
		if(v === undefined) {
			return true;
		}
		return false;
	}
	$scope.toggleFolder = function(folderClass) {
		if(folderClass === "folder-open") {
			folderClass = "folder-closed";
		} else {
			folderClass = "folder-open";
		}
	}

	$scope.openTree = function(folder) {
		folder.NL = !folder.NL;
		if(folder.historiat) {
			
		}
	}


}
