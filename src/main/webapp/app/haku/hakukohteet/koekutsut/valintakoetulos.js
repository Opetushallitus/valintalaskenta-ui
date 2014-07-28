app.factory('ValintakoetulosModel', function($routeParams, Valintakoetulokset, Valintakoe, HakukohdeValintakoe,
                                             HakukohdeHenkilot) {
    "use strict";
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.koetulokset = [];
		this.valintakokeet = {};
		this.valintakokeetHakijoittain = {};
		this.valintakokeetHakijoittainArray = [];
        this.errors = [];
        this.filter = "OSALLISTUU";
        this.filterImmutable = "OSALLISTUU";
		
		this.refresh = function(hakukohdeOid) {
		    model.hakukohdeOid = {};
            model.koetulokset = [];
            model.valintakokeet = {};
            model.valintakokeetHakijoittain = {};
            model.valintakokeetHakijoittainArray = [];
            model.koetyypit = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;

            HakukohdeValintakoe.get({hakukohdeOid: hakukohdeOid}, function(hakukohteenValintakokeet) {
            	Valintakoetulokset.get({hakukohdeoid: hakukohdeOid}, function(result) {
				    model.koetulokset = result;
	                _.each(hakukohteenValintakokeet, function(entry) {
	            		
	            		model.valintakokeet[entry.oid] = {
	            			aktiivinen: entry.aktiivinen != false,
	            			valittu: true, 
	            			valintakoeOid: entry.oid, 
	            			valintakoeTunniste: entry.nimi,
	            			kutsutaankoKaikki: entry.kutsutaankoKaikki,
	                        lahetetaankoKoekutsut: entry.lahetetaankoKoekutsut,
	            			hakijat: []
	            		};
	            		if(entry.kutsutaankoKaikki) {
	            			HakukohdeHenkilot.get({aoOid: hakukohdeOid}, function(hakuResult) {
	            				_.each(hakuResult.results, function(hakija) {
	            					var e = {};
		            				e.osallistuminen = "OSALLISTUU";
		            				e.hakuOid = $routeParams.hakuOid;
	                                e.hakemusOid = hakija.oid;
	                                e.hakijaOid = hakija.personOid;
	                                e.etunimi = hakija.firstNames;
	                                e.sukunimi = hakija.lastName;
	                                e.valittu = true;
	                                e.aktiivinen = entry.aktiivinen;
	                                e.valintakoeOid = entry.oid;
	                                e.lahetetaankoKoekutsut = true;
	                                e.valintakoeTunniste = entry.nimi; // OVT-6961?
									model.valintakokeet[entry.oid].hakijat.push(e);
									if (model.valintakokeetHakijoittain[e.hakemusOid] === undefined ) {
	                                    model.valintakokeetHakijoittain[e.hakemusOid] = {hakemusOid: e.hakemusOid, etunimi: e.etunimi, sukunimi: e.sukunimi};
	                                    model.valintakokeetHakijoittain[e.hakemusOid].kokeet = [];
	                                    model.valintakokeetHakijoittain[e.hakemusOid].kokeet[e.valintakoeTunniste] = e;
	                                } else {
	                                    model.valintakokeetHakijoittain[e.hakemusOid].kokeet[e.valintakoeTunniste] = e;
	                                }
	                                if(model.koetyypit.indexOf(e.valintakoeTunniste) === -1) {
	                                   model.koetyypit.push(e.valintakoeTunniste);
	                                }
	            				});
	            				
	            			});
	            		}
	            	});
	                flatKoetulokset();
				}, function(error) {
	                model.errors.push(error);
	            });
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
			if(hakijat) {
				return _.filter(hakijat,function(hakija) {
					return hakija.osallistuminen === "OSALLISTUU";
				});
			}
			return [];
		};
		this.isAllValittu = function(valintakoe) {
			return _.reduce(valintakoe.hakijat, function(memo, hakija){
				if(hakija.osallistuminen !== "OSALLISTUU") {
					return memo;
				}
				return memo && hakija.valittu;
			}, true);
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
		this.valintakoeOids = function() {
			return _.map(model.valintakokeet, function(valintakoe){
				return valintakoe.valintakoeOid;
			});
		};
		this.aktiivisetJaLahetettavatValintakoeOids = function() {
			return _.map(_.filter(model.valintakokeet, function(valintakoe){
				return valintakoe.aktiivinen && valintakoe.lahetetaankoKoekutsut;
			}), function(valintakoe) {
				return valintakoe.valintakoeOid;
			});
		};
		this.valitutHakemusOids = function(valintakoe) {
			return _.map(this.filterValitut(this.filterOsallistujat(valintakoe.hakijat)), function(hakija){ return hakija.hakemusOid; });
		};

		// helpommin käsiteltävään muotoon tulokset. samoin privaattina
		// funktiona, niin ei turhaan pysty kutsumaan tätä suoraan ulkopuolelta.
		function flatKoetulokset() {
            
            model.koetulokset.forEach(function(koetulos){
                koetulos.hakutoiveet.forEach(function(hakutoive) {
                    if(hakutoive.hakukohdeOid === model.hakukohdeOid) {
                        hakutoive.valinnanVaiheet.forEach(function(valinnanvaihe) {
                            valinnanvaihe.valintakokeet.forEach(function(valintakoe) {
                            	if (model.valintakokeet[valintakoe.valintakoeOid] === undefined ) {
                                	model.errors.push("tunnistamaton valintakoe " + valintakoe.valintakoeTunniste);
                                	return;
                                }
                                if(model.valintakokeet[valintakoe.valintakoeOid].kutsutaankoKaikki) {
                                	return;
                                }

                                var entry = {};
                                entry.osallistuminen = valintakoe.osallistuminenTulos.osallistuminen;
                                entry.hakuOid = koetulos.hakueOid;
                                entry.hakemusOid = koetulos.hakemusOid;
                                entry.hakijaOid = koetulos.hakijaOid;
                                entry.createdAt = koetulos.createdAt;
                                entry.etunimi = koetulos.etunimi;
                                entry.sukunimi = koetulos.sukunimi;
                                entry.valittu = true;
                                entry.aktiivinen = valintakoe.aktiivinen;
                                entry.valintakoeOid = valintakoe.valintakoeOid;
                                entry.lahetetaankoKoekutsut = valintakoe.lahetetaankoKoekutsut;
                                // OVT-6961
                                if(valintakoe.nimi !== undefined) {
                                	entry.valintakoeTunniste = valintakoe.nimi;
                                } else {
                                	entry.valintakoeTunniste = valintakoe.valintakoeTunniste;
                                }

								model.valintakokeet[entry.valintakoeOid].hakijat.push(entry);
                                if (model.valintakokeetHakijoittain[entry.hakemusOid] === undefined ) {
                                    model.valintakokeetHakijoittain[entry.hakemusOid] = {hakemusOid: entry.hakemusOid, etunimi: entry.etunimi, sukunimi: entry.sukunimi};
                                    model.valintakokeetHakijoittain[entry.hakemusOid].kokeet = [];
                                    model.valintakokeetHakijoittain[entry.hakemusOid].kokeet[entry.valintakoeTunniste] = entry;
                                } else {
                                    model.valintakokeetHakijoittain[entry.hakemusOid].kokeet[entry.valintakoeTunniste] = entry;
                                }

                                //add identifier to list
                               if(model.koetyypit.indexOf(entry.valintakoeTunniste) === -1) {
                                   model.koetyypit.push(entry.valintakoeTunniste);
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


angular.module('valintalaskenta').
    controller('ValintakoetulosController', ['$scope', '$routeParams', 'Ilmoitus', 'Latausikkuna', 'ValintakoetulosModel',
        'HakukohdeModel', 'Koekutsukirjeet', 'Osoitetarrat', 'ValintakoeXls', 'IlmoitusTila',
        function ($scope, $routeParams, Ilmoitus, Latausikkuna, ValintakoetulosModel, HakukohdeModel, Koekutsukirjeet,
                  Osoitetarrat, ValintakoeXls, IlmoitusTila) {

    "use strict";

	// kayttaa dokumenttipalvelua
	$scope.DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE; 
	
	// kayttaa dokumenttipalvelua
	$scope.tinymceModel = {};
	
	$scope.tinymceOptions = {
		handle_event_callback: function (e) {
			
		}
	};

    $scope.currentPage = [];
    $scope.filteredResults = [];
    for (var i = 0; i < 1000; i++) {
        $scope.currentPage[i] = 1;
        $scope.filteredResults[i] = 0;
    }

    $scope.pageSize = 50;

    $scope.isBlank = function (str) {
	    return (!str || /^\s*$/.test(str));
	  };
	  
	$scope.tulostaKoekutsukirjeet = function(valintakoe) {
		var hakemusOids = null;
		var otsikko = null;
		var letterBodyText = $scope.tinymceModel[valintakoe.valintakoeOid];
		if(!$scope.isBlank(letterBodyText)) {
			if($scope.model.isAllValittu(valintakoe)) {
				// luodaan uusimmasta kannan datasta. kayttoliittama voi olla epasynkassa
				otsikko = "Muodostetaan koekutsukirjeet valintakokeelle";
			} else {
				hakemusOids =  $scope.model.valitutHakemusOids(valintakoe);
				if(hakemusOids.length == 0) {
					return; // ei tehda tyhjalle joukolle
				}
				otsikko = "Muodostetaan koekutsukirjeet valituille hakemuksille";
			}
			Koekutsukirjeet.post({
				hakukohdeOid:$routeParams.hakukohdeOid, 
				valintakoeOids: [valintakoe.valintakoeOid]},{
					tag: "valintakoetulos",
					hakemusOids: hakemusOids,
					letterBodyText: letterBodyText
				},
				function(id) {
					Latausikkuna.avaa(id, otsikko, valintakoe.valintakoeTunniste);
	    	},function() {
	    	});
		} else {
			Ilmoitus.avaa("Koekutsuja ei voida muodostaa!","Koekutsuja ei voida muodostaa, ennen kuin kutsun sisältö on annettu. Kirjoita kutsun sisältö ensin yllä olevaan kenttään.", IlmoitusTila.WARNING);
		}
	};
	$scope.valintakoeTulosXLS = function(valintakoe) {
		var hakemusOids = null;
		if(!$scope.model.isAllValittu(valintakoe)) {
    		hakemusOids = $scope.model.valitutHakemusOids(valintakoe);
		}
    	ValintakoeXls.lataa({hakukohdeOid:$routeParams.hakukohdeOid},{hakemusOids: hakemusOids, valintakoeOids:[valintakoe.valintakoeOid]}, function(id) {
    		Latausikkuna.avaa(id, "Muodostetaan valintakoetuloksille taulukkolaskentatiedosto", valintakoe.valintakoeTunniste);
    	});
    };
	$scope.addressLabelPDF = function(valintakoe) {
		var otsikko = null;
		var hakemusOids = null;
		if($scope.model.isAllValittu(valintakoe)) {
			// luodaan uusimmasta kannan datasta. kayttoliittama voi olla epasynkassa
			otsikko = "Muodostetaan osoitetarrat valintakokeelle";
		} else {
			hakemusOids =  $scope.model.valitutHakemusOids(valintakoe);
			if(hakemusOids.length === 0) {
				return; // ei tehda tyhjalle joukolle
			}
			otsikko = "Muodostetaan osoitetarrat valituille hakemuksille";
		}
    	Osoitetarrat.post({ 
    		hakukohdeOid:$routeParams.hakukohdeOid, 
    		valintakoeOid:[valintakoe.valintakoeOid]},{
    			tag: "valintakoetulos",
    			hakemusOids: hakemusOids
    		},function(id) {
    			Latausikkuna.avaa(id, otsikko, valintakoe.valintakoeTunniste);
    	});
    };
    $scope.allAddressLabelPDF = function() {
    	var kokeet = $scope.model.aktiivisetJaLahetettavatValintakoeOids();
    	Osoitetarrat.post({
    		hakukohdeOid:$routeParams.hakukohdeOid, 
    		valintakoeOid:kokeet},{
    			tag: "valintakoetulos",
        		hakemusOids: null
        		}, function(id) {
    		Latausikkuna.avaa(id, "Osoitetarrat hakukohteen valintakokeille", "Kaikille hakukohteen valintakokeille");
    	}, function() {
    		
    	});
    };
    
	$scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.model = ValintakoetulosModel;
    $scope.hakukohdeModel = HakukohdeModel;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    $scope.model.refresh($scope.hakukohdeOid);


    $scope.nakymanTila = "Kokeittain";

    $scope.predicate = ['sukunimi','etunimi'];

    $scope.allValintakoeTulosXLS = function() {
    	ValintakoeXls.lataa({hakukohdeOid:$routeParams.hakukohdeOid},{valintakoeOids:$scope.model.valintakoeOids(),hakemusOids: []}, function(id) {
    		Latausikkuna.avaa(id, "Muodostetaan valintakoetuloksille taulukkolaskentatiedosto", "");
    	});
    };

    $scope.updateNakymanTila = function() {
        $scope.currentPage.forEach(function(page){
            page = 1;
        });
    }
}]);
