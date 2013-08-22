app.factory('HenkiloModel', function($resource,$q,$routeParams, Henkilot) {
	var hakemukset = [];
	//console.log(hakuOid);
	function getName(hakemus) {
		return hakemus.lastName + ", " + hakemus.firstNames;
	}
    
	function getHakemukset(){
		//console.log('haetaan henkilot');
		return hakemukset;
	}
    function refresh() {
    	//var hakuOid = $routeParams.hakuOid;
    	//https://itest-virkailija.oph.ware.fi/haku-app/applications?appState=ACTIVE&appState=INCOMPLETE&asId=1.2.246.562.5.2013062511414871880564&start=0&rows=50
    	Henkilot.query({appState: ["ACTIVE","INCOMPLETE"], asId:$routeParams.hakuOid, start:0, rows:50 }, function(result) {
    		console.log(result);
    		hakemukset = result.results;
    	});
    	
    	/*
    	HakuHakukohdeChildren.get({"hakuOid": hakuOid}, function(result) {
    		result.forEach(function(hakukohde) {
    			HakukohdeHenkilot.get({"hakuOid": hakuOid, "hakukohdeOid": hakukohde.oid}, function(r) {
    				r.forEach(function(henkilo) {
    					henkilot[henkilo.personOid] = henkilo;	
    				});
				});
    		});
    		
        });
        */
    }
    
	var modelInterface = {
		searchWord: "",
        getHakemukset: getHakemukset,
        refresh: refresh,
        getName: getName
    }
	modelInterface.refresh();
	return modelInterface;
});

function HenkiloController($scope,$location,$routeParams,HenkiloModel) {
	
	$scope.model = HenkiloModel;
	$scope.hakukohteetVisible = true;
	
	
	$scope.toggleHakukohteetVisible = function() {
		
	}
	
	$scope.showHakemus = function(hakemus) {
		// haku/1.2.246.562.5.2013060313080811526781/henkiloittain/
      //$scope.hakukohteetVisible = false;
      //GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
      $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemus.oid + "/henkilotiedot");
   }
	
}