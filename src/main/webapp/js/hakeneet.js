app.factory('HakeneetModel', function(HakukohdeAvaimet, HakukohdeHenkilot) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.hakukohdeOid = hakukohdeOid;
            model.hakeneet = HakukohdeHenkilot.get({hakuOid: hakuOid,hakukohdeOid: hakukohdeOid}, function(result) {
                                                              model.hakeneet = result;
                                                          });

            var params = [hakukohdeOid];
            HakukohdeAvaimet.post(params, function(result) {
                model.avaimet = result;

                model.avaimet.forEach(function(avain){
                    avain.tyyppi = function(){
                        if(avain.funktiotyyppi == "TOTUUSARVOFUNKTIO") {
                            return "checkbox";
                        }
                        return avain.arvot && avain.arvot.length > 0 ? "combo" : "input";
                    };
                });
                model.hakeneet.forEach(function(hakija){
                    model.avaimet.forEach(function(avain){
                        if(!hakija[avain.tunniste]){
                            hakija[avain.tunniste] = "";
                        }
                    });
                });
            });
		}

		this.refreshIfNeeded = function(hakukohdeOid, hakuOid) {

            if(hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }
        }

	};

	return model;
});


function HakeneetController($scope, $location, $routeParams, HakeneetModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakeneetModel;
    $scope.hakukohdeModel = HakukohdeModel;
    
    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'sukunimi';
}
