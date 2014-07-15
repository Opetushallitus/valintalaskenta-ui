"use strict";

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
			self.setHidingVariables(jarjestyskriteerit, 2, 0);
		},
		addVisibilityVariable: function(nodeArray) {
			var self = this;
			nodeArray.forEach(function(node) {	

				//find nodes that should be folders in view
				if(self.hasNimettyLukuarvo(node)) {
					angular.extend(node, {"folder": true});
				} 
				
				//show-boolean is used to show & hide node in view
				//first all nodes are set visible
				angular.extend(node, {"show": true});
				
				//iterate through subtree recursively
				if(self.hasKaavas(node)) {
					self.addVisibilityVariable(self.hasKaavas(node));
				}
			});
		},
		//
		setHidingVariables: function(nodeArray, level, currentLevel) {
			var self = this;
			nodeArray.forEach(function(node) {

				//piilotetaan noden alipuu, jos level-parametriä syvemmällä puussa
				if(  (currentLevel > level) && self.hasNimettyLukuarvo(node) ) {
					angular.extend(node, {"show": false});
				}

				if(self.hasKaavas(node)) {
					self.setHidingVariables(self.hasKaavas(node), level, currentLevel + 1);
				}
				
			});
		},
		hasNimettyLukuarvo: function(node) {
			if(node.funktio === "Nimetty lukuarvo" || node.funktio === "Nimetty totuusarvo") {
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



angular.module('valintalaskenta').
    controller('ValintalaskentaHistoriaController', ['$scope', '$routeParams', 'ValintalaskentaHistoriaModel',
        function ($scope, $routeParams, ValintalaskentaHistoriaModel) {
	$scope.hakijaOid = $routeParams.hakijaOid;
	$scope.model = ValintalaskentaHistoriaModel;

	$scope.historyTabIndex = 0;	
	
	$scope.changeTab = function(index) {
		$scope.historyTabIndex = index;
	};

	$scope.isUndefined = function(v) {
		if(v === undefined) {
			return true;
		}
		return false;
	};

	$scope.openTree = function(tree) {
		tree.show = !tree.show;
	};
}]);
