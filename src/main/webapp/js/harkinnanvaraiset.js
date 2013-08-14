app.factory('HarkinnanvaraisetModel', function($http, HakukohdeHenkilot, Hakemus, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.hakukohdeOid = hakukohdeOid;
            HakukohdeHenkilot.get({hakuOid: hakuOid,hakukohdeOid: hakukohdeOid}, function(result) {
                model.hakeneet = result;

                  model.hakeneet.forEach(function(hakija){
                         Hakemus.get({oid: hakija.applicationOid}, function(result) {
                            hakija.hakemus=result;
                         });
                  });

                /*
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
                */
            });
		}

		this.refreshIfNeeded = function(hakukohdeOid, hakuOid) {

            if(hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }

        }


           /*
        this.submit = function() {
        	function tallenna(hakija, avain, value) {

        	};

            model.hakeneet.forEach( function(hakija) {
                model.avaimet.forEach( function(avain) {
                	var min = parseInt(avain.min);
                	var max = parseInt(avain.max);
                	var value = hakija.additionalData[avain.tunniste];
                	var valueInt = parseInt(value);
                	var tallenna = false;
                	if(!isNaN(min) && !isNaN(max)) {
                		// arvovali on kaytossa
                		if(isNaN(valueInt)) {
                			// tallenna jos null?
                			if(!value) {
                				value = "";
                				tallenna = true;
                				//hakija.errorField[avain.tunniste] = "";
                			} else {
                				// virhe roskaa
                				//hakija.errorField[avain.tunniste] = "Arvo on virheellinen!";
                			}
                		} else if(min <= valueInt && max >= valueInt) {
                			tallenna = true;
                			//hakija.errorField[avain.tunniste] = "";
                		} else {
                			// virhe ei alueella
                			//hakija.errorField[avain.tunniste] = "Arvo ei ole arvoalueella!";
                		}

                	} else {
                		// ei arvovalia. tallennetaan mita vaan?
                		tallenna = true;
                		//hakija.errorField[avain.tunniste] = "";
                	}

                	if(tallenna && hakija.originalData[avain.tunniste] !== value) {
                		HakemusKey.put({
                            "oid": hakija.applicationOid,
                            "key": avain.tunniste,
                            "value": value
                            }
                        , function(){
                        	hakija.originalData[avain.tunniste] = value;
                        });
        			}

                });
            });
        };
         */
	};

	return model;
});

function HarkinnanvaraisetController($scope, $location, $routeParams, HarkinnanvaraisetModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HarkinnanvaraisetModel;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.arvoFilter = "SYOTETTAVA_ARVO";
    $scope.muutettu = false;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HarkinnanvaraisetModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'sukunimi';

    $scope.submit = function() {
        HakeneetModel.submit();
    }
}
