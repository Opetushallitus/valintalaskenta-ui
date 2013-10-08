app.factory('HakukohteetModel', function($q, $routeParams, Haku, HakuHakukohdeChildren, HakukohdeNimi, AuthService, TarjontaHaku) {
    var model;
    model = new function(){
    	this.hakukohteet= [];
		this.filtered = [];
		this.totalCount = 0;
		this.pageSize = 15;
		this.searchWord = "";
		this.lastSearch = null;
		this.lastHakuOid = null;
		this.omatHakukohteet = true;
		this.valmiitHakukohteet = "JULKAISTU";
		this.readyToQueryForNextPage = true;
		
		this.getTarjoajaNimi = function(hakukohde) {
			return this.getNimi(hakukohde.tarjoajaNimi);
		}
		this.getHakukohdeNimi = function(hakukohde) {
			return this.getNimi(hakukohde.hakukohdeNimi);
		}
		this.getNimi = function(nimi) {
			for (var key in nimi) {
				// avaimia on talla hetkella: fi,en,sv;fi;sv;en
				// eli esim "fi,en,sv".indexOf("fi") != -1
				if(key.indexOf("fi") != -1) {
					return nimi[key];
				}
			}
		}
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
					if(model.readyToQueryForNextPage) {
		    			model.readyToQueryForNextPage = false;
						AuthService.getOrganizations("APP_VALINTOJENTOTEUTTAMINEN").then(function(roleModel){
	
						    var searchParams = {
						        hakuOid:hakuOid,
						        startIndex:startIndex,
						        count:model.pageSize,
						        searchTerms:model.lastSearch};
	
						    if(model.omatHakukohteet) {
						        searchParams.organisationOids = roleModel.toString();
						    }
	
						    searchParams.hakukohdeTilas = model.valmiitHakukohteet;
	
	
	                        TarjontaHaku.query(searchParams, function(result) {
	                        	
	                            if(restart) { // eka sivu
	                                self.hakukohteet = result.tulokset;
	                                self.totalCount = result.kokonaismaara;
	                            } else { // seuraava sivu
	                                if(startIndex != self.getCount()) {
	                                    //
	                                    // Ei tehda mitaan
	                                    //
	                                	model.readyToQueryForNextPage = true;
	                                    return;
	                                } else {
	                                    self.hakukohteet = self.hakukohteet.concat(result.tulokset);
	                                    if(self.getTotalCount() !== result.kokonaismaara) {
	                                        // palvelimen tietomalli on paivittynyt joten koko lista on ladattava uudestaan!
	                                        // ... tai vaihtoehtoisesti kayttajalle naytetaan epasynkassa olevaa listaa!!!!!
	                                        self.lastSearch = null;
	                                        model.readyToQueryForNextPage = true;
	                                        self.getNextPage(true);
	                                    }
	                                }
	                            }
	                            model.readyToQueryForNextPage = true;
	                        });
					});
				}
			}
    	};
        
        this.refresh = function() {

        	var word = $.trim(this.searchWord);
//        	if(this.lastSearch !== word
//        	    || this.lastHakuOid !== $routeParams.hakuOid) {

        		this.lastSearch = word;
        		this.lastHakuOid = $routeParams.hakuOid;

        		this.getNextPage(true);
        	//}

        };

        this.refreshIfNeeded = function() {
        	/*var hakuOid = $routeParams.hakuOid;
            if( (hakuOid) && (hakuOid !== "undefined") && (hakuOid != model.hakuOid) ) {
                model.searchWord = "";
                model.refresh(hakuOid);
            }*/
        };
    };

    return model;
});



function HakukohteetController($rootScope, $scope, $location, $timeout, $routeParams, HakukohteetModel, GlobalStates, HakukohdeNimi) {
	   $scope.hakuOid = $routeParams.hakuOid;
	   $scope.hakukohdeOid = $routeParams.hakukohdeOid;
	   $scope.hakukohteetVisible = GlobalStates.hakukohteetVisible;

	   // Muistetaan millä alasivulla ollaan, kun vaihdetaan hakukohdetta.
	   
//	   $scope.subpage = $location.path().split('/')[5] || 'perustiedot';
	   $scope.model = HakukohteetModel;
	   $scope.model.refresh();

	   $scope.toggleHakukohteetVisible = function() {
	      $scope.hakukohteetVisible = !$scope.hakukohteetVisible;
	      GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
	   }

	   $scope.showHakukohde = function(hakukohde, lisahaku) {
	   		$rootScope.selectedHakukohdeNimi = hakukohde.hakukohdeNimi.fi;
			$scope.hakukohteetVisible = false;
			GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
			$location.path( (lisahaku ? '/lisahaku/' : '/haku/') + $routeParams.hakuOid + '/hakukohde/' + hakukohde.hakukohdeOid  + '/perustiedot');
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