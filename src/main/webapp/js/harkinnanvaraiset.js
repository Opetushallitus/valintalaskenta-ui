app.factory('HarkinnanvaraisetModel', function(HakukohdeHenkilot, Hakemus, HakemusKey) {
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

                console.log("========= Hakukohdeoid:" +model.hakukohdeOid );
                for(var i =0; i<10; i++) {
                    var oid = hakija.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];
                    console.log("Hakutoive[" + i +"] " + oid);
                    if(oid === model.hakukohdeOid) {
                        var harkinnanvarainen = hakija.hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];

                           hakija.hakenutHarkinnanvaraisesti =harkinnanvarainen;
                        }
                }
                console.log("=========");
                });
            });
            });
		}

       this.updateJarjestyskriteerinTila = function(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, tila) {
                var updateParams = {
                    valintatapajonoOid: valintatapajonoOid,
                    hakemusOid: hakemusOid,
                    jarjestyskriteeriprioriteetti: jarjestyskriteeriprioriteetti
                }

                JarjestyskriteeriTila.post(updateParams, tila, function(result) {});
            };


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

    $scope.hyvaksyHarkinnanvaisesti = function(valintatapajonoOid, hakemusOid) {
        var tila ="HYVAKSYTTY_HARKINNANVARAISESTI";
        var prioriteetti =0;
        $scope.model.updateJarjestyskriteerinTila(valintatapajonoOid, hakemusOid, prioriteetti, tila)
    };

}
