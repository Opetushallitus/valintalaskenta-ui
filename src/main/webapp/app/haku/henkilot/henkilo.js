app.factory('HenkiloModel', function($resource,$q,$routeParams, Henkilot) {
	
	function getName(hakemus) {
		return hakemus.lastName + ", " + hakemus.firstNames;
	}
	function getCount() {
		if(this.hakemukset === undefined) {
			return 0;
		}
		return this.hakemukset.length;
	}
	function getTotalCount() {
    	return this.totalCount;
    }
	function getHakemukset(){
		return this.hakemukset;
	}
	function getNextPage() {
		var startIndex = this.getCount();
		var lastTotalCount =this.getTotalCount();
		var notLastPage = startIndex < lastTotalCount; //this.totalCount < (this.pages + 1)*this.pageSize;
		if(notLastPage) {
			var self = this;
			if(modelInterface.readyToQueryForNextPage) {
				modelInterface.readyToQueryForNextPage = false;
								
				Henkilot.query({appState: ["ACTIVE","INCOMPLETE"], asId:$routeParams.hakuOid, start:startIndex, rows:this.pageSize, q:this.lastSearch }, function(result) {
					if(startIndex !== self.getCount()) {
						modelInterface.readyToQueryForNextPage = true;
					} else {
						self.hakemukset = self.hakemukset.concat(result.results);
						if(self.getTotalCount() !== result.totalCount) {
							// palvelimen tietomalli on paivittynyt joten koko lista on ladattava uudestaan!
							// ... tai vaihtoehtoisesti kayttajalle naytetaan epasynkassa olevaa listaa!!!!!
							self.lastSearch = null;
							self.refresh();
							modelInterface.readyToQueryForNextPage = true;
						}
					}
					modelInterface.readyToQueryForNextPage = true;
		    	});
		    }
		}
	}

    function refresh() {
    	// should also clear all paging information
    	var word = $.trim(this.searchWord);

        this.lastSearch = word;
        var self = this;

        Henkilot.query({appState: ["ACTIVE","INCOMPLETE"], asId:$routeParams.hakuOid, start:0, rows:this.pageSize, q:word }, function(result) {
            self.hakemukset = result.results;
            self.totalCount = result.totalCount;
        });

    }

    function refreshIfNeeded(hakuOid) {
    	if(this.hakuOid !== hakuOid) {
            this.hakuOid = hakuOid;
            this.searchWord = "";
            this.lastSearch = "";
    		var self = this;
    		Henkilot.query({appState: ["ACTIVE","INCOMPLETE"], asId:$routeParams.hakuOid, start:0, rows:this.pageSize, q:this.lastSearch }, function(result) {
    			self.hakemukset = result.results;
	    		self.totalCount = result.totalCount;
	    	});
    	}
    }

	var modelInterface = {
		hakemukset: [],
		totalCount: 0,
		pageSize: 30,
		searchWord: "",
		lastSearch: "",
        readyToQueryForNextPage: true,
        hakuOid: null,

		refresh: refresh,
        refreshIfNeeded: refreshIfNeeded,
		getTotalCount: getTotalCount,
		getHakemukset: getHakemukset,
        getNextPage: getNextPage,
        getCount: getCount,
        getName: getName
        
    };

	return modelInterface;
});

function HenkiloController($scope,$location,$routeParams, HenkiloModel) {

	$scope.model = HenkiloModel;
	$scope.model.refreshIfNeeded($routeParams.hakuOid);
	$scope.hakemusOid = $routeParams.hakemusOid;
	$scope.henkiloittainVisible = true;
    if($routeParams.scrollTo) {
        $location.hash($routeParams.scrollTo);
    }

    $scope.$watch('model.searchWord', debounce(function() {
        HenkiloModel.refresh();
    }, 500));

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }
	
	$scope.lazyLoading = function() {
		$scope.model.getNextPage();	
	};
	
	$scope.toggleHenkiloittainVisible = function() {
		$scope.henkiloittainVisible = !$scope.henkiloittainVisible;
	};
	
	$scope.showHakemus = function(hakemus) {
      $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemus.oid + "/henkilotiedot/id_" + hakemus.oid);
   };
	
}