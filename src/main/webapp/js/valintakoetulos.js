app.factory('ValintakoetulosModel', function(Valintakoetulokset) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.koetulokset = [];
		this.valintakokeet = {};
		this.valintakokeetHakijoittain = {};
		this.valintakokeetHakijoittainArray = [];
        this.errors = [];
        this.filter = "OSALLISTUU";
		
		this.refresh = function(hakukohdeOid) {
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            
			Valintakoetulokset.get({hakukohdeoid: hakukohdeOid}, function(result) {
			    model.koetulokset = result;
                flatKoetulokset();
			}, function(error) {
                model.errors.push(error);
            });
		}




		// helpommin käsiteltävään muotoon tulokset. samoin privaattina
		// funktiona, niin ei turhaan pysty kutsumaan tätä suoraan ulkopuolelta.
		function flatKoetulokset() {
		    model.valintakokeet = {};
            model.koetyypit = [];
            model.valintakokeetHakijoittain = {};
            model.valintakokeetHakijoittainArray = [];

            model.koetulokset.forEach(function(koetulos){
                koetulos.hakutoiveet.forEach(function(hakutoive) {
                    if(hakutoive.hakukohdeOid === model.hakukohdeOid) {
                        hakutoive.valinnanVaiheet.forEach(function(valinnanvaihe) {
                            valinnanvaihe.valintakokeet.forEach(function(valintakoe) {
                                var entry = {};
                                entry.hakuOid = koetulos.hakueOid;
                                entry.hakemusOid = koetulos.hakemusOid;
                                entry.hakijaOid = koetulos.hakijaOid;
                                entry.createdAt = koetulos.createdAt;
                                entry.etunimi = koetulos.etunimi;
                                entry.sukunimi = koetulos.sukunimi;

                                entry.valintakoeOid = valintakoe.valintakoeOid;
                                entry.valintakoeTunniste = valintakoe.valintakoeTunniste;
                                entry.osallistuminen = valintakoe.osallistuminenTulos.osallistuminen;
                                
                                if (model.valintakokeet[entry.valintakoeOid] === undefined ) {
                                	model.valintakokeet[entry.valintakoeOid] = {valintakoeOid: entry.valintakoeOid, valintakoeTunniste: entry.valintakoeTunniste, hakijat: [entry]};    
                                } else {
                                	model.valintakokeet[entry.valintakoeOid].hakijat.push(entry);
                                }

                                if (model.valintakokeetHakijoittain[entry.hakemusOid] === undefined ) {
                                    model.valintakokeetHakijoittain[entry.hakemusOid] = {hakemusOid: entry.hakemusOid, etunimi: entry.etunimi, sukunimi: entry.sukunimi};
                                    model.valintakokeetHakijoittain[entry.hakemusOid].kokeet = [];
                                    model.valintakokeetHakijoittain[entry.hakemusOid].kokeet[entry.valintakoeTunniste] = entry;
                                } else {
                                    model.valintakokeetHakijoittain[entry.hakemusOid].kokeet[entry.valintakoeTunniste] = entry;
                                }

                                //add identifier to list
                               if(model.koetyypit.indexOf(valintakoe.valintakoeTunniste) == -1) {
                                    model.koetyypit.push(valintakoe.valintakoeTunniste);
                               }

                            });
                        });
                    }
                });
            });

            for (var key in model.valintakokeetHakijoittain) {
              if (model.valintakokeetHakijoittain.hasOwnProperty(key)) {
                model.valintakokeetHakijoittainArray.push(model.valintakokeetHakijoittain[key]);
              }
            }
		}

	};

	return model;
});


function ValintakoetulosController($scope, $window, $routeParams, ValintakoetulosModel, HakukohdeModel, Osoitetarrat,ValintakoeXls) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.model = ValintakoetulosModel;
    $scope.hakukohdeModel = HakukohdeModel;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    $scope.model.refresh($scope.hakukohdeOid);

    $scope.nakymanTila = "Hakijoittain"; // Hakijoittain


    $scope.predicate = 'hakijaOid';

    /*$scope.valintakoeTulosXLS = function(valintakoeOid) {
    	$window.location.href = SERVICE_EXCEL_URL_BASE + "export/valintakoetulos.xls?hakukohdeOid=" + $routeParams.hakukohdeOid + "&valintakoeOid=" + valintakoeOid;
    }*/
    $scope.allValintakoeTulosXLS = function() {
    	var kokeet = [];
    	for (var key in $scope.model.valintakokeet) {
    	    kokeet.push(key);
    	}
    	ValintakoeXls.query({hakukohdeOid:$routeParams.hakukohdeOid, valintakoeOid:kokeet});
    } 
    $scope.valintakoeTulosXLS = function(valintakoeOid) {
    	ValintakoeXls.query({hakukohdeOid:$routeParams.hakukohdeOid, valintakoeOid:[valintakoeOid]});
    }
    $scope.allAddressLabelPDF = function() {
    	var kokeet = [];
    	for (var key in $scope.model.valintakokeet) {
    	    kokeet.push(key);
    	}
    	Osoitetarrat.query({hakukohdeOid:$routeParams.hakukohdeOid, valintakoeOid:kokeet}, function(resurssi) {
    		$window.location.href = resurssi.latausUrl;
    	}, function(response) {
    		alert(response.data.viesti);
    	});
    	//console.log(kokeet);
    }
    $scope.addressLabelPDF = function(valintakoeOid) {
    	Osoitetarrat.query({hakukohdeOid:$routeParams.hakukohdeOid, valintakoeOid:[valintakoeOid]},function(resurssi) {
    		$window.location.href = resurssi.latausUrl;
    	});
    	
    }
}   
