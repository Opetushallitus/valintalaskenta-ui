app.factory('ValintalaskentaHistoriaModel', function(ValintalaskentaHistoria,$routeParams, $q) {

    var deferred = $q.defer();
	
	var modelInterface = {
		model: [],
		get: function() {
			return this.model;
		},
		refresh: function() {
			var self = this;
			ValintalaskentaHistoria.get({valintatapajonoOid: $routeParams.valintatapajonoOid, hakemusOid: $routeParams.hakemusOid}, function(data) {
					var result = [];
				angular.forEach(data, function(h) {
					result.push(angular.fromJson(h.historia));
				});
				self.model = result;
				self.prepareHistoryForUi();
				deferred.resolve(modelInterface);
			});
		},
		prepareHistoryForUi: function() {
			var self = this;
			var jarjestyskriteerit = this.get();
			
			self.addVisibilityVariable(jarjestyskriteerit);
			self.setHidingVariables(jarjestyskriteerit);
		},
		addVisibilityVariable: function(nodeArray) {
			var self = this;
			nodeArray.forEach(function(node) {	

				//extend node with funktio: Nimetty lukuarvo -field
				if(self.hasNimettyLukuarvo(node)) {
					angular.extend(node, {"folder": true});
				} 
				
				//extend node with visibility value
				angular.extend(node, {"show": true});
				
				//iterate through subtree recursively
				if(self.hasKaavas(node)) {
					self.addVisibilityVariable(self.hasKaavas(node));
				}
			});
		},
		setHidingVariables: function(nodeArray) {
			var self = this;
			nodeArray.forEach(function(node) {
				
				var foundObj = {"found": false};
				self.hasFolderChildren(self.hasKaavas(node), foundObj);

				if(self.hasNimettyLukuarvo(node) && !foundObj.found) {
					angular.extend(node, {"show": false});
				}

				if(self.hasKaavas(node)) {
					self.setHidingVariables(self.hasKaavas(node));
				}
				
			});
		},
		hasFolderChildren: function(nodeArray, foundObj) {
			
			var self = this;
			if(nodeArray) {
				nodeArray.forEach(function(node) {
					if(self.hasNimettyLukuarvo(node)) {
						foundObj.found = true;
					}

					self.hasFolderChildren(self.hasKaavas(node), foundObj);
				});
			} 
			
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

    return deferred.promise;
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

	$scope.openTree = function(tree) {
		tree.show = !tree.show;
	}

	$scope.folderOpen = function(open) {
		if(open) {
			return 'folder-open';
		} else {
			return 'folder-closed';
		}
	}


}
