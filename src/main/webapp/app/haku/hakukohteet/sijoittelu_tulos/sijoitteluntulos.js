"use strict";
app.factory('SijoitteluntulosModel', function ($q, Ilmoitus, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila,
                                               $timeout, SijoitteluAjo, VastaanottoTilat, IlmoitusTila, Valintatapajono,
                                               HaunTiedot) {

    var model = new function () {

        this.hakuOid = null;
        this.hakukohdeOid = null;
        this.sijoittelu = {};
        this.latestSijoitteluajo = {};
        this.sijoitteluTulokset = {};
        this.errors = [];

        this.hakemusErittelyt = []; //dataa perustietonäkymälle

        this.filterValitut = function(hakemukset) {
			return _.filter(hakemukset,function(hakemus) {
				return hakemus.valittu;
			});
		};

        this.filterHyvaksytty = function(hakemukset) {
			return _.filter(hakemukset,function(hakemus) {
				return hakemus.tila === "HYVAKSYTTY";
			});
		};
		this.isAllValittu = function(valintatapajono) {
			return _.reduce(valintatapajono.hakemukset, function(memo, hakemus){
				if(hakemus.tila === "HYVAKSYTTY") {
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
                if(hakemus.tila === "HYVAKSYTTY") {
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

            HaunTiedot.get({hakuOid: hakuOid}, function(result) {
                model.haku = result;
            });

            LatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid
            }, function (result) {
                if (result.sijoitteluajoId) {

                    model.sijoitteluTulokset = result;

                    var valintatapajonot = model.sijoitteluTulokset.valintatapajonot;

                    valintatapajonot.forEach(function (valintatapajono, index) {
                        Valintatapajono.get({valintatapajonoOid: valintatapajono.oid}, {}, function(result){
                            valintatapajono.eiVarasijatayttoa = result.eiVarasijatayttoa;
                        });
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
                            varasijoilla: []
                        };

                        model.hakemusErittelyt.push(hakemuserittely);

                        var lastTasaSija = 1;
                        var sija = 0;
                        hakemukset.forEach(function (hakemus, index) {
                            if (lastTasaSija >= hakemus.tasasijaJonosija) {
                                sija = index + 1;
                            }

                            if (hakemus.tila === "HYVAKSYTTY") {
                                hakemus.valittu = true;
                                hakemuserittely.hyvaksytyt.push(hakemus);
                            }

                            if (hakemus.tila === "HYVAKSYTTY" && hakemus.hyvaksyttyHarkinnanvaraisesti) {
                                hakemuserittely.hyvaksyttyHarkinnanvaraisesti.push(hakemus);
                            }

                            if (hakemus.tila === "VARALLA") {
                                hakemuserittely.varasijoilla.push(hakemus);
                            }

                            hakemus.sija = sija;
                            lastTasaSija = hakemus.tasasijaJonosija;
                        });


                        VastaanottoTilat.get({hakukohdeOid: hakukohdeOid,
                            valintatapajonoOid: valintatapajonoOid}, function (result) {

                            if (hakemukset) {
                                hakemukset.forEach(function (currentHakemus) {

                                    //make rest calls in separate scope to prevent hakemusOid to be overridden during rest call
                                    currentHakemus.vastaanottoTila = "";
                                    currentHakemus.muokattuVastaanottoTila = "";
                                    currentHakemus.muokattuIlmoittautumisTila = "";

                                    result.some(function (vastaanottotila) {
                                        if (vastaanottotila.hakemusOid === currentHakemus.hakemusOid) {
                                            currentHakemus.logEntries = vastaanottotila.logEntries;
                                            if (vastaanottotila.tila === null) {
                                                vastaanottotila.tila = "";
                                            }
                                            currentHakemus.vastaanottoTila = vastaanottotila.tila;
                                            currentHakemus.muokattuVastaanottoTila = vastaanottotila.tila;
                                            if (currentHakemus.vastaanottoTila === "VASTAANOTTANUT") {
                                                hakemuserittely.paikanVastaanottaneet.push(currentHakemus);
                                            }

                                            if (vastaanottotila.ilmoittautumisTila === null) {
                                                vastaanottotila.ilmoittautumisTila = "EI_TEHTY";
                                            }
                                            currentHakemus.ilmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                            currentHakemus.muokattuIlmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                            return true;
                                        }
                                    });
                                });
                            }

                        }, function (error) {
                            model.errors.push(error);
                        });



                    });


                    SijoitteluAjo.get({
                            hakuOid: hakuOid,
                            sijoitteluajoOid: result.sijoitteluajoId
                        }, function (result) {
                            model.latestSijoitteluajo.startMils = result.startMils;
                            model.latestSijoitteluajo.endMils = result.endMils;
                            model.latestSijoitteluajo.sijoitteluajoId = result.sijoitteluajoId;
                        }, function (error) {
                            model.errors.push(error);
                        }
                    );

                }

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
        	var muokatutHakemukset = _.filter(_.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
        		return valintatapajono.hakemukset;
        	})), function(hakemus) {
        		return (hakemus.vastaanottoTila !== hakemus.muokattuVastaanottoTila || hakemus.ilmoittautumisTila !== hakemus.muokattuIlmoittautumisTila);
        	});
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
                	hakemusOid: hakemus.hakemusOid
            	};
            });

            VastaanottoTila.post(tilaParams, tilaObj, function (result) {
            	Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
            }, function (error) {
            	Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
            });
        }

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
    };

    return model;

});


function SijoitteluntulosController($scope, $timeout, $modal, $routeParams, $window, Kirjepohjat, Latausikkuna, HakukohdeModel, SijoitteluntulosModel, OsoitetarratSijoittelussaHyvaksytyille, Hyvaksymiskirjeet, Jalkiohjauskirjeet, SijoitteluXls, AuthService) {
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;

    $scope.hakemuksenMuokattuIlmoittautumisTilat = [
        {value: "EI_TEHTY", text: "sijoitteluntulos.enrollmentinfo.notdone"},
        {value: "LASNA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.present"},
        {value: "POISSA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.notpresent"},
        {value: "EI_ILMOITTAUTUNUT", text: "sijoitteluntulos.enrollmentinfo.noenrollment"},
        {value: "LASNA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.presentfall"},
        {value: "POISSA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.notpresentfall"},
        {value: "LASNA", text: "sijoitteluntulos.enrollmentinfo.presentspring"},
        {value: "POISSA", text: "sijoitteluntulos.enrollmentinfo.notpresentspring"}
    ];

    //korkeakoulujen 'ehdollisesti vastaanotettu' lisätään isKorkeakoulu() -funktiossa
    $scope.hakemuksenMuokattuVastaanottoTilat = [
        {value: "ILMOITETTU", text: "Hakijalle ilmoitettu"},
        {value: "VASTAANOTTANUT", text: "Vastaanottanut"},
        {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text: "Ei vastaanotettu määräaikana"},
        {value: "PERUNUT", text: "Perunut"},
        {value: "PERUUTETTU", text: "Peruutettu"}
    ];





    $scope.model.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);

    $scope.updateVastaanottoTila = function (hakemus, valintatapajonoOid) {
        $scope.model.updateVastaanottoTila(hakemus, valintatapajonoOid);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    };

    $scope.submit = function (valintatapajonoOid) {
        $scope.model.updateHakemuksienTila(valintatapajonoOid);
    };
    
    $scope.luoHyvaksymiskirjeetPDF = function() {
    	var hakukohde = $scope.hakukohdeModel.hakukohde;
    	var tag = hakukohde.hakukohdeNimiUri.split('#')[0];
    	var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
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
					        	sisalto: sisalto,
					        	templateName: "Organisaation viimeisin",
					        	tag: tag,
					        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: null } , function (id) {
					            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille hyväksymiskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        tarjoajaOid: hakukohde.tarjoajaOid,
                        pohjat: function() {
                        	return Kirjepohjat.get({templateName:"hyvaksymiskirje", languageCode: "FI", tarjoajaOid: hakukohde.tarjoajaOid, tag: tag});
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
    $scope.createHyvaksymiskirjeetPDF = function (oidit) {
        
		var hakukohde = $scope.hakukohdeModel.hakukohde;
    	//var pohjat = ;
    	
    	var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            resolve: {
                oids: function () {
                	console.log(hakukohde);
                    return {
                    	otsikko: "Hyväksymiskirjeet",
                    	toimintoNimi: "Muodosta hyväksymiskirjeet",
                    	toiminto: function(sisalto) {
                    		Hyvaksymiskirjeet.post({
					        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
					        	hakuOid: $routeParams.hakuOid, 
					        	tarjoajaOid: hakukohde.tarjoajaOid,
					        	sisalto: sisalto,
					        	templateName: "Organisaation viimeisin",
					        	tag: "",
					        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: oidit } , function (id) {
					            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille hyväksymiskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        tarjoajaOid: hakukohde.tarjoajaOid,
                        pohjat: function() {
                        	return Kirjepohjat.get({templateName:"hyvaksymiskirje", languageCode: "FI"});
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

    $scope.sijoittelunTulosXLS = function () {
        SijoitteluXls.query({hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid, sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId});
    };

    $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOid', function () {
        AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOid).then(function () {
            $scope.updateOrg = true;
        });

    });

    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
    });

    $scope.limit = 20;
    $scope.lazyLoading = function () {
        $scope.showLoading = true;
        $timeout(function () {
            $scope.limit += 50;
            $scope.showLoading = false;
        }, 10);
    };

    var order = {
        "HYVAKSYTTY": 1,
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

    $scope.isKorkeakoulu = function() {
        var returnValue = false;
        if ($scope.model.haku.kohdejoukkoUri) {
            returnValue = $scope.model.haku.kohdejoukkoUri.indexOf('_12') !== -1;
        }
        if(returnValue) {
            $scope.hakemuksenMuokattuVastaanottoTilat.push({value: "EHDOLLISESTI_VASTAANOTTANUT", text: "Ehdollisesti vastaanottanut"})
        }
    };

    $scope.resetIlmoittautumisTila = function(hakemus) {
        if(hakemus.muokattuVastaanottoTila !== 'VASTAANOTTANUT' && hakemus.muokattuVastaanottoTila !== 'EHDOLLISESTI_VASTAANOTTANUT') {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        }
    };

    $scope.isKorkeakoulu();


}
