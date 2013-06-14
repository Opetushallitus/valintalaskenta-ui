app.factory('HakeneetModel', function($http, HakukohdeAvaimet, HakukohdeHenkilot, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.hakukohdeOid = hakukohdeOid;
            HakukohdeHenkilot.get({hakuOid: hakuOid,hakukohdeOid: hakukohdeOid}, function(result) {
                model.hakeneet = result;
                var params = [hakukohdeOid];
                HakukohdeAvaimet.post(params, function(result) {
                    model.avaimet = result;

//                    model.avaimet.forEach(function(avain){
//                       avain.tyyppi = function(){
//                           if(avain.funktiotyyppi == "TOTUUSARVOFUNKTIO") {
//                               return "checkbox";
//                           }
//                           return avain.arvot && avain.arvot.length > 0 ? "combo" : "input";
//                       };
//                    });

                    model.hakeneet.forEach(function(hakija){
                       hakija.originalData = [];
                       if(!hakija.additionalData) {
                           hakija.additionalData = [];
                       }

                       model.avaimet.forEach(function(avain){
                           if(!hakija.additionalData[avain.tunniste]) {
                               hakija.additionalData[avain.tunniste] = "";
                           }
                           hakija.originalData[avain.tunniste] = hakija.additionalData[avain.tunniste];
                       });

                    });
                });
            });
		}

		this.refreshIfNeeded = function(hakukohdeOid, hakuOid) {

            if(hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }

        }

        this.submit = function() {
            model.hakeneet.forEach( function(hakija) {
                model.avaimet.forEach( function(avain) {
                    if(hakija.originalData[avain.tunniste] !== hakija.additionalData[avain.tunniste]) {
                        console.log(hakija.additionalData[avain.tunniste]);
                        HakemusKey.put({
                            "oid": hakija.applicationOid,
                            "key": avain.tunniste,
                            "value": hakija.additionalData[avain.tunniste]
                            }
                        , function(result){

                        });
                    }
                });
            });
        };

	};

	return model;
});


function HakeneetController($scope, $location, $routeParams, HakeneetModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakeneetModel;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.arvoFilter = "SYOTETTAVA_ARVO";
    $scope.muutettu = false;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'sukunimi';

    $scope.submit = function() {
        HakeneetModel.submit();
    }
}
