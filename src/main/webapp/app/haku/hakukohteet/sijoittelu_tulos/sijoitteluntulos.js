app.factory('SijoitteluntulosModel', function ($q, Ilmoitus, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila,
                                               $timeout, SijoitteluAjo, VastaanottoTilat, IlmoitusTila,
                                               HaunTiedot) {
    "use strict";

    var model = new function () {

        this.hakuOid = null;
        this.hakukohdeOid = null;
        this.sijoittelu = {};
        this.latestSijoitteluajo = {};
        this.sijoitteluTulokset = {};
        this.errors = [];

        this.hakemusErittelyt = []; //dataa perustietonäkymälle
        this.sijoitteluntulosHakijoittain = {};
        this.sijoitteluntulosHakijoittainArray = [];

        this.filterValitut = function(hakemukset) {
			return _.filter(hakemukset,function(hakemus) {
				return hakemus.valittu;
			});
		};

        this.filterHyvaksytty = function(hakemukset) {
			return _.filter(hakemukset,function(hakemus) {
				return hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY";
			});
		};
		this.isAllValittu = function(valintatapajono) {
			return _.reduce(valintatapajono.hakemukset, function(memo, hakemus){
				if(hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY") {
					return memo && hakemus.valittu;
				}
				return memo;
			}, true);
		};
		this.check = function(valintatapajono) {
			valintatapajono.valittu = this.isAllValittu(valintatapajono);
		};
		this.checkAll = function(valintatapajono) {
			var kaikkienUusiTila = valintatapajono.valittu;
			_.each(valintatapajono.hakemukset, function(hakemus) {
                if(hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY") {
				    hakemus.valittu = kaikkienUusiTila;
                }
			});
			valintatapajono.valittu = this.isAllValittu(valintatapajono);
		};
		
        this.refresh = function (hakuOid, hakukohdeOid) {
            model.errors = [];
            model.errors.length = 0;
            model.hakuOid = hakuOid;
            model.hakukohdeOid = hakukohdeOid;
            model.sijoittelu = {};
            model.latestSijoitteluajo = {};
            model.sijoitteluTulokset = {};
            model.hakemusErittelyt.length = 0;
            model.haku = {};
            model.sijoitteluntulosHakijoittain = {};
            model.sijoitteluntulosHakijoittainArray = [];

            HaunTiedot.get({hakuOid: hakuOid}, function(result) {
                model.haku = result;
            });

            LatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid
            }, function (result) {
                if (result.sijoitteluajoId) {
                    model.latestSijoitteluajo.sijoitteluajoId = result.sijoitteluajoId;

                    model.sijoitteluTulokset = result;

                    var valintatapajonot = model.sijoitteluTulokset.valintatapajonot;

                    valintatapajonot.forEach(function (valintatapajono, index) {

                        valintatapajono.index = index;
                        valintatapajono.valittu = true;
                        var valintatapajonoOid = valintatapajono.oid;
                        var hakemukset = valintatapajono.hakemukset;

                        //pick up data to be shown in basicinformation vie
                        var hakemuserittely = {
                            nimi: valintatapajono.nimi,
                            hyvaksytyt: [],
                            paikanVastaanottaneet: [],
                            hyvaksyttyHarkinnanvaraisesti: [],
                            varasijoilla: [],
                            ehdollisesti: []
                        };
                        hakemuserittely.aloituspaikat = valintatapajono.aloituspaikat;
                        model.hakemusErittelyt.push(hakemuserittely);

                        var lastTasaSija = 1;
                        var sija = 0;
                        hakemukset.forEach(function (hakemus, index) {
                            var jono = {
                                nimi: valintatapajono.nimi,
                                pisteet: hakemus.pisteet,
                                tila: hakemus.tila,
                                prioriteetti: valintatapajono.prioriteetti,
                                tilaHistoria: hakemus.tilaHistoria
                            };
                            if (model.sijoitteluntulosHakijoittain[hakemus.hakijaOid] === undefined) {
                                model.sijoitteluntulosHakijoittain[hakemus.hakijaOid] = {
                                    etunimi: hakemus.etunimi,
                                    sukunimi: hakemus.sukunimi,
                                    hakemusOid: hakemus.hakemusOid,
                                    hakijaOid: hakemus.hakijaOid,
                                    vastaanottoTila: 'KESKEN',
                                    ilmoittautumisTila: 'EI_TEHTY',
                                    jonot: []
                                };

                            }
                            model.sijoitteluntulosHakijoittain[hakemus.hakijaOid].jonot.push(jono);

                            if (hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY") {
                                sija++;
                                hakemus.valittu = true;
                                hakemuserittely.hyvaksytyt.push(hakemus);
                                hakemus.sija = sija;
                            }

                            if ((hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY") && hakemus.hyvaksyttyHarkinnanvaraisesti) {
                                hakemuserittely.hyvaksyttyHarkinnanvaraisesti.push(hakemus);
                            }


                            if (hakemus.tila === "VARALLA") {
                                sija++;
                                hakemuserittely.varasijoilla.push(hakemus);
                                hakemus.sija = sija;
                            }

                            lastTasaSija = hakemus.tasasijaJonosija;
                        });


                        VastaanottoTilat.get({hakukohdeOid: hakukohdeOid,
                            valintatapajonoOid: valintatapajonoOid}, function (result) {

                            if (hakemukset) {
                                hakemukset.forEach(function (currentHakemus) {

                                    //make rest calls in separate scope to prevent hakemusOid to be overridden during rest call
                                    currentHakemus.vastaanottoTila = "KESKEN";
                                    currentHakemus.muokattuVastaanottoTila = "KESKEN";
                                    currentHakemus.muokattuIlmoittautumisTila = "EI_TEHTY";

                                    result.some(function (vastaanottotila) {
                                        if (vastaanottotila.hakemusOid === currentHakemus.hakemusOid) {
                                            currentHakemus.logEntries = vastaanottotila.logEntries;
                                            if (vastaanottotila.tila === null) {
                                                vastaanottotila.tila = "KESKEN";
                                            }
                                            currentHakemus.vastaanottoTila = vastaanottotila.tila;
                                            currentHakemus.muokattuVastaanottoTila = vastaanottotila.tila;
                                            if (currentHakemus.vastaanottoTila === "VASTAANOTTANUT") {
                                                hakemuserittely.paikanVastaanottaneet.push(currentHakemus);
                                            }

                                            if (currentHakemus.vastaanottoTila === "EHDOLLISESTI_VASTAANOTTANUT") {
                                                hakemuserittely.ehdollisesti.push(currentHakemus);
                                            }

                                            if (vastaanottotila.ilmoittautumisTila === null) {
                                                vastaanottotila.ilmoittautumisTila = "EI_TEHTY";
                                            }
                                            currentHakemus.ilmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                            currentHakemus.muokattuIlmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                            currentHakemus.julkaistavissa = vastaanottotila.julkaistavissa;
                                            currentHakemus.hyvaksyttyVarasijalta = vastaanottotila.hyvaksyttyVarasijalta;

                                            model.sijoitteluntulosHakijoittain[currentHakemus.hakijaOid].vastaanottoTila=currentHakemus.vastaanottoTila;
                                            model.sijoitteluntulosHakijoittain[currentHakemus.hakijaOid].ilmoittautumisTila=currentHakemus.ilmoittautumisTila;

                                            return true;
                                        }
                                    });
                                });
                            }

                        }, function (error) {
                            model.errors.push(error);
                        });



                    });

                      // Väliaikaisesti pois
//                    SijoitteluAjo.get({
//                            hakuOid: hakuOid,
//                            sijoitteluajoOid: result.sijoitteluajoId
//                        }, function (result) {
//                            model.latestSijoitteluajo.startMils = result.startMils;
//                            model.latestSijoitteluajo.endMils = result.endMils;
//                            model.latestSijoitteluajo.sijoitteluajoId = result.sijoitteluajoId;
//                        }, function (error) {
//                            model.errors.push(error);
//                        }
//                    );

                }

                for (var key in model.sijoitteluntulosHakijoittain) {
                    if (model.sijoitteluntulosHakijoittain.hasOwnProperty(key)) {
                        model.sijoitteluntulosHakijoittainArray.push(model.sijoitteluntulosHakijoittain[key]);
                    }
                };
            }, function (error) {
                model.errors.push(error.data.message);
            });
        };

        //refresh if haku or hakukohde has changed
        this.refreshIfNeeded = function (hakuOid, hakukohdeOid, isHakukohdeChanged) {
        	if(hakukohdeOid && hakuOid) {
	            if (model.sijoittelu.hakuOid !== hakuOid || isHakukohdeChanged) {
	                model.refresh(hakuOid, hakukohdeOid);
	            }
        	}
        };

        this.updateHakemuksienTila = function (valintatapajonoOid) {
        	var jonoonLiittyvat = _.filter(model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
        		return valintatapajono.oid === valintatapajonoOid;
        	});

            var halututTilat = ["HYVAKSYTTY", "VARLLA", "VARASIJALTA_HYVAKSYTTY", "HYLATTY"];

        	var muokatutHakemukset = _.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
        		return valintatapajono.hakemukset;
        	}));
        	model.updateVastaanottoTila("Massamuokkaus", muokatutHakemukset, valintatapajonoOid, function(success){
                Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
            }, function(error){
                Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
            });
        };

        this.updateVastaanottoTila = function (selite, muokatutHakemukset, valintatapajonoOid) {
            model.errors.length = 0;
            var tilaParams = {
                hakuoid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                selite: selite
            };

            var tilaObj = _.map(muokatutHakemukset, function(hakemus) {
                if (hakemus.muokattuVastaanottoTila === '') {
                    hakemus.muokattuVastaanottoTila = null;
                }
                if (hakemus.muokattuIlmoittautumisTila === '') {
                    hakemus.muokattuIlmoittautumisTila = null;
                }
            	return {
            		tila: hakemus.muokattuVastaanottoTila,
                    ilmoittautumisTila: hakemus.muokattuIlmoittautumisTila,
            		valintatapajonoOid: valintatapajonoOid,
                	hakemusOid: hakemus.hakemusOid,
                    julkaistavissa: hakemus.julkaistavissa,
                    hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta
            	};
            });

            VastaanottoTila.post(tilaParams, tilaObj, function (result) {
            	Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
            }, function (error) {
            	Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
            });
        };

        this.valitutOidit = function(){
            var oidit = [];
            if(model.sijoitteluTulokset.valintatapajonot) {
                model.sijoitteluTulokset.valintatapajonot.forEach(function(valintatapajono){
                    if(valintatapajono.hakemukset) {
                        model.filterValitut(valintatapajono.hakemukset).forEach(function(hakemus){
                            oidit.push(hakemus.hakemusOid);
                        });
                    }
                });
            }
            return oidit;
        };
    }();

    return model;

});


angular.module('valintalaskenta').
    controller('SijoitteluntulosController', ['$scope', '$modal', '$routeParams', '$window', 'Kirjepohjat', 'Latausikkuna', 'HakukohdeModel',
        'SijoitteluntulosModel', 'OsoitetarratSijoittelussaHyvaksytyille', 'Hyvaksymiskirjeet',
        'Jalkiohjauskirjeet', 'SijoitteluXls', 'AuthService', 'HaeDokumenttipalvelusta', 'LocalisationService','HakuModel',
        function ($scope, $modal, $routeParams, $window, Kirjepohjat, Latausikkuna, HakukohdeModel,
                                    SijoitteluntulosModel, OsoitetarratSijoittelussaHyvaksytyille, Hyvaksymiskirjeet,
                                    Jalkiohjauskirjeet, SijoitteluXls, AuthService, HaeDokumenttipalvelusta,LocalisationService,HakuModel) {
    "use strict";

    $scope.hakuOid = $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.hakukohdeModel = HakukohdeModel;
    $scope.model = SijoitteluntulosModel;

    $scope.nakymanTila = "Jonottain";

    //
    // pikalatauslinkit on harmaannettuna jos ei ensimmaistakaan generointia 
    $scope.osoitetarratUrl = null;
    $scope.hyvaksymiskirjeetUrl = null;
    $scope.sijoitteluntuloksetUrl = null;
    HaeDokumenttipalvelusta.get({tyyppi:'osoitetarrat',hakukohdeoid:$routeParams.hakukohdeOid }, function (vastaus) {
		if(vastaus[0]) {
			$scope.osoitetarratUrl = vastaus[0].documentId;
		}
	});
    HaeDokumenttipalvelusta.get({tyyppi:'hyvaksymiskirjeet',hakukohdeoid:$routeParams.hakukohdeOid }, function (vastaus) {
		if(vastaus[0]) {
			$scope.hyvaksymiskirjeetUrl = vastaus[0].documentId;
		}
	});
	HaeDokumenttipalvelusta.get({tyyppi:'sijoitteluntulokset',hakukohdeoid:$routeParams.hakukohdeOid}, function(vastaus) {
		if(vastaus[0]) {
			$scope.sijoitteluntuloksetUrl = vastaus[0].documentId;
		}	
	});
	
    $scope.hakemuksenMuokattuIlmoittautumisTilat = [
        {value: "EI_TEHTY", text: "sijoitteluntulos.enrollmentinfo.notdone", default_text:"Ei tehty"},
        {value: "LASNA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.present", default_text:"Läsnä (koko lukuvuosi)"},
        {value: "POISSA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.notpresent", default_text:"Poissa (koko lukuvuosi)"},
        {value: "EI_ILMOITTAUTUNUT", text: "sijoitteluntulos.enrollmentinfo.noenrollment", default_text:"Ei ilmoittautunut"},
        {value: "LASNA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.presentfall", default_text:"Läsnä syksy, poissa kevät"},
        {value: "POISSA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.notpresentfall", default_text:"Poissa syksy, läsnä kevät"},
        {value: "LASNA", text: "sijoitteluntulos.enrollmentinfo.presentspring", default_text:"Läsnä, keväällä alkava koulutus"},
        {value: "POISSA", text: "sijoitteluntulos.enrollmentinfo.notpresentspring", default_text:"Poissa, keväällä alkava koulutus"}
    ];

    $scope.pageSize = 50;
    $scope.currentPage = [];
    $scope.filteredResults = [];

    for (var i = 0; i < 1000; i++) {
        $scope.currentPage[i] = 1;
    }



    $scope.updateVastaanottoTila = function (hakemus, valintatapajonoOid) {
        $scope.model.updateVastaanottoTila(hakemus, valintatapajonoOid);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    };

    $scope.submit = function (valintatapajonoOid) {
        $scope.model.updateHakemuksienTila(valintatapajonoOid);
    };
    
    $scope.luoHyvaksymiskirjeetPDF = function() {
    	var hakuOid = $routeParams.hakuOid;
    	var hakukohde = $scope.hakukohdeModel.hakukohde;
    	var tag = null;
    	if(hakukohde.hakukohdeNimiUri) {
    		tag = hakukohde.hakukohdeNimiUri.split('#')[0];
    	} else {
    		tag = $routeParams.hakukohdeOid;
    	}
    	var langcode = $scope.hakukohdeModel.getKieliCode();
    	var templateName = $scope.hakuaVastaavaHyvaksymiskirjeMuotti();
    	var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                    	otsikko: "Hyväksymiskirjeet",
                    	toimintoNimi: "Muodosta hyväksymiskirjeet",
                    	toiminto: function(sisalto) {
                    		Hyvaksymiskirjeet.post({
					        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
					        	hakuOid: $routeParams.hakuOid, 
					        	tarjoajaOid: hakukohde.tarjoajaOid,
					        	templateName: templateName,
					        	tag: tag,
					        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: null,letterBodyText:sisalto} , function (id) {
					            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille hyväksymiskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        tarjoajaOid: hakukohde.tarjoajaOid,
                        pohjat: function() {
                        	return Kirjepohjat.get({templateName:templateName, languageCode: langcode, tarjoajaOid: hakukohde.tarjoajaOid, tag: tag, hakuOid: hakuOid});
                        },
                        hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
                        hakukohdeNimi: $scope.hakukohdeModel.getHakukohdeNimi()
                    };
                }
            }
        });
    };
    
    $scope.createHyvaksymisosoitteetPDF = function (oidit) {
        OsoitetarratSijoittelussaHyvaksytyille.post({
        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
        	hakuOid: $routeParams.hakuOid, 
        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: oidit }, function (id) {
            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille osoitetarrat", "");
        }, function () {
            
        });
    };
    
     $scope.sijoittelunTulosXLS = function () {
        SijoitteluXls.post({
        	hakuOid: $routeParams.hakuOid, 
        	hakukohdeOid: $routeParams.hakukohdeOid, 
        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId}, {}, function (id) {
            Latausikkuna.avaa(id, "Sijoittelun tulokset taulukkolaskentaan", "");
        }, function () {
            
        });
    };
    $scope.hakuaVastaavaHyvaksymiskirjeMuotti = function() {
    	if(HakuModel.hakuOid.nivelvaihe) {
    		return "hyvaksymiskirje_nivel";	
    	}else {
	    	return "hyvaksymiskirje";
	    }
    };

    $scope.filterChangedValues = function(hakemus) {
        if ($scope.model.naytaVainMuuttuneet) {
            if (hakemus.tilaHistoria && hakemus.tilaHistoria.length > 0) {
                var i = 0;
                if (hakemus.tilaHistoria.length > 2)
                    i = hakemus.tilaHistoria.length-2;
                if (hakemus.tilaHistoria[i].tila === hakemus.tila)
                    return false;
            }
        }

        return true;
    };

    $scope.createHyvaksymiskirjeetPDF = function (oidit) {
        var hakuOid = $routeParams.hakuOid;
		var hakukohde = $scope.hakukohdeModel.hakukohde;
		var tag = null;
    	if(hakukohde.hakukohdeNimiUri) {
    		tag = hakukohde.hakukohdeNimiUri.split('#')[0];
    	} else {
    		tag = $routeParams.hakukohdeOid;
    	}
    	var langcode = $scope.hakukohdeModel.getKieliCode();
    	var templateName = $scope.hakuaVastaavaHyvaksymiskirjeMuotti();
    	var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                    	otsikko: "Hyväksymiskirjeet",
                    	toimintoNimi: "Muodosta hyväksymiskirjeet",
                    	toiminto: function(sisalto) {
                    		Hyvaksymiskirjeet.post({
					        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
					        	hakuOid: $routeParams.hakuOid, 
					        	tarjoajaOid: hakukohde.tarjoajaOid,
					        	templateName: templateName,
					        	tag: tag,
					        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: oidit,letterBodyText:sisalto} , function (id) {
					            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille hyväksymiskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        tarjoajaOid: hakukohde.tarjoajaOid,
                        pohjat: function() {
                        	return Kirjepohjat.get({templateName:templateName, languageCode: langcode, tarjoajaOid: hakukohde.tarjoajaOid, tag: tag, hakuOid: hakuOid});
                        },
                        hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
                        hakukohdeNimi: $scope.hakukohdeModel.getHakukohdeNimi()
                    };
                }
            }
        });
    };

    $scope.createJalkiohjauskirjeetPDF = function () {
        Jalkiohjauskirjeet.post({sijoitteluajoId: $scope.model.latestSijoitteluajo.sijoitteluajoId, hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid}, function (resurssi) {
            $window.location.href = resurssi.latausUrl;
        }, function (response) {
            alert(response.data.viesti);
        });
    };

    $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOid', function () {
        AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOid).then(function () {
            $scope.updateOrg = true;
        });

    });

    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
    });

    var order = {
        "HYVAKSYTTY": 1,
        "VARASIJALTA_HYVAKSYTTY": 1,
        "VARALLA": 2,
        "PERUNUT": 3,
        "PERUUTETTU": 4,
        "PERUUNTUNUT": 5,
        "HYLATTY": 6
    };

    $scope.jarjesta = function(value) {
        var i = order[value.tila];
        if(i == order["HYVAKSYTTY"] && value.hyvaksyttyHarkinnanvaraisesti) {
            i = 0;
        }
        return i;
    };

    $scope.selectIlmoitettuToAll = function(valintatapajonoOid) {
        var jonoonLiittyvat = _.filter($scope.model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
            return valintatapajono.oid === valintatapajonoOid;
        });
        var muokattavatHakemukset = _.filter(_.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
            return valintatapajono.hakemukset;
        })), function(hakemus) {
            return (hakemus.vastaanottoTila === "KESKEN");
        });
        muokattavatHakemukset.forEach(function (hakemus) {
            hakemus.julkaistavissa = true;
        });
    };


    $scope.resetIlmoittautumisTila = function(hakemus) {
        if(hakemus.muokattuVastaanottoTila !== 'VASTAANOTTANUT' && hakemus.muokattuVastaanottoTila !== 'EHDOLLISESTI_VASTAANOTTANUT') {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        } else if (!hakemus.muokattuIlmoittautumisTila) {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        }
    };


    LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuIlmoittautumisTilat).then(function () {

        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.model.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);

    });

}]);
