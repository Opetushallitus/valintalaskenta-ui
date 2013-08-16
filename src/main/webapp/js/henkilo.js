app.factory('HenkiloModel', function($q,$routeParams, Haku, HakuHakukohdeChildren, HakukohdeNimi, AuthService, Hakemus, HakukohdeHenkilot) {
	var henkilot = {};
	//console.log(hakuOid);
	function getName(henkilo) {
		return henkilo.lastName + " " + henkilo.firstName;
	}
    
	function getHenkilot(){
		//console.log('haetaan henkilot');
		return henkilot;
	}
    function refresh() {
    	var hakuOid = $routeParams.hakuOid;
    	
    	HakuHakukohdeChildren.get({"hakuOid": hakuOid}, function(result) {
    		result.forEach(function(hakukohde) {
    			HakukohdeHenkilot.get({"hakuOid": hakuOid, "hakukohdeOid": hakukohde.oid}, function(r) {
    				r.forEach(function(henkilo) {
    					henkilot[henkilo.personOid] = henkilo;	
    				});
				});
    		});
    		
        });
        
    }
    
	var modelInterface = {
		searchWord: "",
        getHenkilot: getHenkilot,
        refresh: refresh,
        getName: getName
    }
	modelInterface.refresh();
	return modelInterface;
});

function HenkiloController($scope,HenkiloModel) {
	
	$scope.model = HenkiloModel;
	$scope.hakukohteetVisible = true;
	
	//$scope.model.refreshIfNeeded($scope.hakuOid, $scope.hakukohdeOid);
	
	
	$scope.toggleHakukohteetVisible = function() {
		
	}
	
	$scope.showHakukohde = function(hakukohdeOid) {
	      
	}
}
/*Hakemus.get({"oid": $routeParams.hakuOid}, function(result) {
console.log(result);
});*/
/*
HakuHakukohdeChildren.get({"hakuOid": hakuOid}, function(result) {
var hakukohdeOids = result;

hakukohdeOids.forEach(function(element, index) {

  HakukohdeNimi.get({hakukohdeoid: element.oid}, function(hakukohdeObject) {
    model.hakukohteet.push(hakukohdeObject);
    AuthService.readOrg("APP_VALINTOJENTOTEUTTAMINEN", hakukohdeObject.tarjoajaOid).then(function() {
        model.filtered.push(hakukohdeObject);
    });

  });
});

});
*/

/*this.refreshIfNeeded = function(hakuOid) {
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
}*/