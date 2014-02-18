app.factory('ValintakoetulosModel', function(Valintakoetulokset, Valintakoe) {
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
		    model.hakukohdeOid = {};
            model.koetulokset = [];
            model.valintakokeet = {};
            model.valintakokeetHakijoittain = {};
            model.valintakokeetHakijoittainArray = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            
			Valintakoetulokset.get({hakukohdeoid: hakukohdeOid}, function(result) {
			    model.koetulokset = result;
                flatKoetulokset();
			}, function(error) {
                model.errors.push(error);
            });
		};
		this.filterValitut = function(hakijat) {
			return _.filter(hakijat,function(hakija) {
				return hakija.valittu;
			});
		};
		this.filterOsallistujat = function(hakijat) {
			var self = this;
			return _.filter(hakijat,function(hakija) {
				return hakija.osallistuminen == self.filter;
			});
		};
		this.isAllValittu = function(valintakoe) {
			var osallistujat = this.filterOsallistujat(valintakoe.hakijat);
			return osallistujat.length == this.filterValitut(osallistujat).length;
		};
		this.check = function(valintakoe) {
			valintakoe.valittu = this.isAllValittu(valintakoe);
		};
		this.checkAll = function(valintakoe) {
			var kaikkienUusiTila = valintakoe.valittu;
			_.each(this.filterOsallistujat(valintakoe.hakijat), function(hakija) {
				hakija.valittu = kaikkienUusiTila;
			});
			valintakoe.valittu = this.isAllValittu(valintakoe);
		};
		
		this.valitutHakemusOids = function(valintakoe) {
			return _.map(this.filterValitut(this.filterOsallistujat(valintakoe.hakijat)), function(hakija){ return hakija.hakemusOid; });
		};

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
                                entry.valittu = true;
                                
                                entry.valintakoeOid = valintakoe.valintakoeOid;
                                entry.valintakoeTunniste = valintakoe.valintakoeTunniste;
                                entry.osallistuminen = valintakoe.osallistuminenTulos.osallistuminen;
                                
                                if (model.valintakokeet[entry.valintakoeOid] === undefined ) {
                                	var valintakoeModel = {
                                			aktiivinen: true, 
                                			valittu: true, 
                                			valintakoeOid: entry.valintakoeOid, 
                                			valintakoeTunniste: entry.valintakoeTunniste, 
                                			hakijat: [entry]};
                                	model.valintakokeet[entry.valintakoeOid] = valintakoeModel;
                                	Valintakoe.get({}, function(result) {
                                		valintakoeModel.aktiivinen = result.aktiivinen;
                                	},function() {
                                		valintakoeModel.aktiivinen = false;
                                		valintakoeModel.virheIlmoitus = "Valintakokeen tietoja ei saatu palvelimelta. Ota yhteys ylläpitoon.";
                                	});
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
            };
		}

	};

	return model;
});


function ValintakoetulosController($scope, $window, $routeParams, ValintakoetulosModel, HakukohdeModel, Koekutsukirjeet, Osoitetarrat, ValintakoeXls, Dokumenttipalvelu) {
	// kayttaa dokumenttipalvelua
	$scope.DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE; 
	$scope.dokumenttiLimit = 5;
	$scope.dokumentit = [];
	$scope.update = function(data) {
		// paivitetaan ainoastaan tarpeen vaatiessa
		if(data.length != $scope.dokumentit.length) {
			$scope.dokumentit = data;
		}
	}
	Dokumenttipalvelu.aloitaPollaus($scope.update);
	$scope.$on('$destroy', function() {Dokumenttipalvelu.lopetaPollaus();});
	$scope.showMoreDokumentit = function() {
		$scope.dokumenttiLimit = $scope.dokumenttiLimit + 10;
	};
	// kayttaa dokumenttipalvelua
	$scope.tinymceModel = {};
	
	$scope.tinymceOptions = {
		handle_event_callback: function (e) {
			
		}
	};
	
	$scope.tulostaKoekutsukirjeet = function(valintakoe) {
		var hakemusOids = null;
		if($scope.model.isAllValittu(valintakoe)) {
			// luodaan uusimmasta kannan datasta. kayttoliittama voi olla epasynkassa
		} else {
			hakemusOids =  $scope.model.valitutHakemusOids(valintakoe);
			if(hakemusOids.length == 0) {
				return; // ei tehda tyhjalle joukolle
			}
		}
		
		Koekutsukirjeet.post({
			hakemusOids: hakemusOids,
			hakukohdeOid:$routeParams.hakukohdeOid, 
			valintakoeOids: [valintakoe.valintakoeOid]},
			$scope.tinymceModel[valintakoe.valintakoeOid],
			function() {
			Dokumenttipalvelu.paivita($scope.update);
    	},function() {
    		Dokumenttipalvelu.paivita($scope.update);
    	});
    	
	};
	$scope.addressLabelPDF = function(valintakoe) {
		var hakemusOids = null;
		if($scope.model.isAllValittu(valintakoe)) {
			// luodaan uusimmasta kannan datasta. kayttoliittama voi olla epasynkassa
		} else {
			hakemusOids =  $scope.model.valitutHakemusOids(valintakoe);
			if(hakemusOids.length == 0) {
				return; // ei tehda tyhjalle joukolle
			}
		}
    	Osoitetarrat.post({
    		hakemusOids: hakemusOids, 
    		hakukohdeOid:$routeParams.hakukohdeOid, 
    		valintakoeOid:[valintakoe.valintakoeOid]},function(resurssi) {
    			Dokumenttipalvelu.paivita($scope.update);
    	});
    };
    $scope.allAddressLabelPDF = function() {
    	var kokeet = [];
    	for (var key in $scope.model.valintakokeet) {
    	    kokeet.push(key);
    	}
    	Osoitetarrat.post({
    		hakemusOids: null,
    		hakukohdeOid:$routeParams.hakukohdeOid, 
    		valintakoeOid:kokeet}, function(resurssi) {
    		$window.location.href = resurssi.latausUrl;
    	}, function(response) {
    		Dokumenttipalvelu.paivita($scope.update);
    	});
    	//console.log(kokeet);
    };
    
	$scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.model = ValintakoetulosModel;
    $scope.hakukohdeModel = HakukohdeModel;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    $scope.model.refresh($scope.hakukohdeOid);

    $scope.nakymanTila = "Hakijoittain"; // Hakijoittain

    $scope.predicate = 'hakijaOid';

    $scope.allValintakoeTulosXLS = function() {
    	var kokeet = [];
    	for (var key in $scope.model.valintakokeet) {
    	    kokeet.push(key);
    	}
    	ValintakoeXls.query({hakukohdeOid:$routeParams.hakukohdeOid, valintakoeOid:kokeet});
    };
    $scope.valintakoeTulosXLS = function(valintakoeOid) {
    	ValintakoeXls.query({hakukohdeOid:$routeParams.hakukohdeOid, valintakoeOid:[valintakoeOid]});
    };
    
    
}   
