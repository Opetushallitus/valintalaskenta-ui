app.factory('HenkiloModel', function($resource,$q,$routeParams, Henkilot) {
	
	function getName(hakemus) {
		return hakemus.lastName + ", " + hakemus.firstNames;
	}
	function getCount() {
		return this.hakemukset.length;
	}
	function getTotalCount() {
    	return this.totalCount;
    }
	function getHakemukset(){
		return this.hakemukset;
	}
	function getNextPage() {
		var notLastPage = this.getCount() < this.getTotalCount(); //this.totalCount < (this.pages + 1)*this.pageSize;
		if(notLastPage) {
			var startIndex = this.getCount();
			var self = this;
			Henkilot.query({appState: ["ACTIVE","INCOMPLETE"], asId:$routeParams.hakuOid, start:startIndex, rows:this.pageSize, q:this.lastSearch }, function(result) {
				if(startIndex != self.hakemukset.length) {
					//
					// ei esta saman joukon hakemista useaan kertaan mutta estaa saman joukon lisayksen useaan kertaan!
					//
					console.log("ERROR! HAETAAN SAMAA JOUKKOA USEAAN KERTAAN!");
				} else {
					self.hakemukset = self.hakemukset.concat(result.results);
	    			self.totalCount = result.totalCount;
				}
	    	});
		} else {
			//console.log("this is last page! " + this.pages);
		}
	}
    function refresh() {
    	// should also clear all paging information
    	var word = $.trim(this.searchWord);
    	if(this.lastSearch !== word) {
    		this.lastSearch = word;
    		var self = this;
    		Henkilot.query({appState: ["ACTIVE","INCOMPLETE"], asId:$routeParams.hakuOid, start:0, rows:this.pageSize, q:word }, function(result) {
	    		//console.log(result);
    			
    			self.hakemukset = result.results;
	    		self.totalCount = result.totalCount;
	    	});
    	}
    }
	var modelInterface = {
		hakemukset: [],
		totalCount: 0,
		pageSize: 20,
		searchWord: "",
		lastSearch: null,
        
		refresh: refresh,
		getTotalCount: getTotalCount,
		getHakemukset: getHakemukset,
        getNextPage: getNextPage,
        getCount: getCount,
        getName: getName
    }
	modelInterface.refresh();
	return modelInterface;
});

function HenkiloController($scope,$location,$routeParams,HenkiloModel) {
	
	$scope.model = HenkiloModel;
	$scope.henkiloittainVisible = true;
	
	$scope.lazyLoading = function() {
		$scope.model.getNextPage();	
	}
	
	$scope.toggleHenkiloittainVisible = function() {
		$scope.henkiloittainVisible = !$scope.henkiloittainVisible;
	}
	
	$scope.showHakemus = function(hakemus) {
      $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemus.oid + "/henkilotiedot");
   }
	
}