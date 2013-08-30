app.factory('HakukohteetModel', function($q, $routeParams, Haku, HakuHakukohdeChildren, HakukohdeNimi, AuthService, TarjontaHaku) {
    var model;
    model = new function(){
    	this.hakukohteet= [];
		this.filtered = [];
		this.totalCount = 0;
		this.pageSize = 15;
		this.searchWord = "";
		this.lastSearch = null;
		this.filterToggle = false;
		
		this.getCount = function() {
			if(this.hakukohteet === undefined) {
				return 0;
			}
			return this.hakukohteet.length;
		}
		this.getTotalCount = function() {
	    	return this.totalCount;
	    }
		this.getHakukohteet = function(){
			return this.hakukohteet;
		}
    	this.getNextPage = function(restart) {
    		var hakuOid = $routeParams.hakuOid;
    		if(restart) {
    			this.hakukohteet = [];
    			this.filtered = [];
    		}
    		var startIndex = this.getCount();
    		var lastTotalCount = this.getTotalCount();
    		var notLastPage = startIndex < lastTotalCount;
    		if(notLastPage || restart) {
				var self = this;
	        	TarjontaHaku.query({hakuOid:hakuOid, startIndex:startIndex, count:this.pageSize, searchTerms: this.searchWord}, function(result) {

	        		if(restart) { // eka sivu
	        			self.hakukohteet = result.tulokset;
		    			self.totalCount = result.kokonaismaara;
	        		} else { // seuraava sivu
	        			if(startIndex != self.getCount()) {
	    					//
	        				// Ei tehda mitaan
	        				//
	        				return;
	    				} else {
	    					self.hakukohteet = self.hakukohteet.concat(result.tulokset);
	    					if(self.getTotalCount() !== result.kokonaismaara) {
	    						// palvelimen tietomalli on paivittynyt joten koko lista on ladattava uudestaan!
	    						// ... tai vaihtoehtoisesti kayttajalle naytetaan epasynkassa olevaa listaa!!!!!
	    						self.lastSearch = null;
	    						self.getNextPage(true);
	    					}
	    				}
	        		}
	        		result.tulokset.forEach(function(hakukohdeObject, index) {
	                    /*HakukohdeNimi.get({hakukohdeoid: element.oid}, function(hakukohdeObject) {
	                      //model.hakukohteet.push(hakukohdeObject);
	                    });*/
	                    AuthService.readOrg("APP_VALINTOJENTOTEUTTAMINEN", hakukohdeObject.tarjoajaOid).then(function() {
	                          model.filtered.push(hakukohdeObject);
	                    });
	                });
	                
	            });
			}
    	};
        
        this.refresh = function() {
        	var word = $.trim(this.searchWord);
        	if(this.lastSearch !== word) {
        		this.lastSearch = word;
        		this.getNextPage(true);
        	}
        };

        this.refreshIfNeeded = function() {
        	var hakuOid = $routeParams.hakuOid;
            if( (hakuOid) && (hakuOid !== "undefined") && (hakuOid != model.hakuOid) ) {
                model.searchWord = "";
                model.refresh(hakuOid);
            }
        };

        this.blender = function(filter){
            if(filter) {
                return model.filtered;
            } else {
                return model.hakukohteet;
            }
        }
    };

    return model;
});



function HakukohteetController($rootScope, $scope, $location, $timeout, $routeParams, HakukohteetModel, GlobalStates) {

	   $scope.hakuOid = $routeParams.hakuOid;
	   $scope.hakukohdeOid = $routeParams.hakukohdeOid;
	   $scope.hakukohteetVisible = GlobalStates.hakukohteetVisible;

	   // Muistetaan millä alasivulla ollaan, kun vaihdetaan hakukohdetta.
	   
	   $scope.subpage = $location.path().split('/')[5] || 'perustiedot';
	   $scope.model = HakukohteetModel;
	   $scope.model.refreshIfNeeded();

	   $scope.toggleHakukohteetVisible = function() {
	      $scope.hakukohteetVisible = !$scope.hakukohteetVisible;
	      GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
	   }

	   $scope.showHakukohde = function(hakukohdeOid) {
	      $scope.hakukohteetVisible = false;
	      GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
	      $location.path('/haku/' + $routeParams.hakuOid + '/hakukohde/' + hakukohdeOid + '/' + $scope.subpage);
	   }
	   
	   // uuden sivun lataus
	   $scope.lazyLoading = function() {
		   $scope.model.getNextPage(false);	
	   }
}

app.factory('GlobalStates', function() {
   var model = new function() {
       this.hakukohteetVisible = true;
   }
   return model;
 });