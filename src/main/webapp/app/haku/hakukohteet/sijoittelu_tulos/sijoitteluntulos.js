"use strict";
app.factory('SijoitteluntulosModel', function ($q, Ilmoitus, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila, $timeout, SijoitteluAjo, VastaanottoTilat, IlmoitusTila) {

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
			return this.filterHyvaksytty(valintatapajono.hakemukset).length == this.filterValitut(valintatapajono.hakemukset).length;
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

            LatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid
            }, function (result) {
                if (result.sijoitteluajoId) {

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
                            varasijoilla: []
                        }

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

                                    result.some(function (vastaanottotila) {
                                        if (vastaanottotila.hakemusOid === currentHakemus.hakemusOid) {
                                            currentHakemus.logEntries = vastaanottotila.logEntries;
                                            if (vastaanottotila.tila != null) {
                                                currentHakemus.vastaanottoTila = vastaanottotila.tila;
                                            }
                                            currentHakemus.muokattuVastaanottoTila = vastaanottotila.tila;
                                            if (currentHakemus.vastaanottoTila === "VASTAANOTTANUT_POISSAOLEVA" || currentHakemus.vastaanottoTila === "VASTAANOTTANUT_LASNA") {
                                                hakemuserittely.paikanVastaanottaneet.push(currentHakemus);
                                            }
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
            if (model.sijoittelu.hakuOid !== hakuOid || isHakukohdeChanged) {
                model.refresh(hakuOid, hakukohdeOid);
            }
        };

        this.updateHakemuksienTila = function (valintatapajonoOid) {
        	var jonoonLiittyvat = _.filter(model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
        		return valintatapajono.oid === valintatapajonoOid;
        	});
        	var muokatutHakemukset = _.filter(_.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
        		return valintatapajono.hakemukset;
        	})), function(hakemus) {
        		return hakemus.vastaanottoTila != hakemus.muokattuVastaanottoTila;
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
                //valintatapajonoOid: valintatapajonoOid,
                //hakemusOid: hakemus.hakemusOid,
                selite: selite
            };
            
            var tilaObj = _.map(muokatutHakemukset, function(hakemus) {
            	return {
            		tila: hakemus.muokattuVastaanottoTila,
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
                        console.log(valintatapajono.hakemukset);
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


function SijoitteluntulosController($scope, $timeout, $routeParams, $window, Latausikkuna, HakukohdeModel, SijoitteluntulosModel, OsoitetarratSijoittelussaHyvaksytyille, Hyvaksymiskirjeet, Jalkiohjauskirjeet, SijoitteluXls, AuthService) {
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;


    $scope.model.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);

    $scope.updateVastaanottoTila = function (hakemus, valintatapajonoOid) {
        $scope.model.updateVastaanottoTila(hakemus, valintatapajonoOid);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    };

    $scope.submit = function (valintatapajonoOid) {
        $scope.model.updateHakemuksienTila(valintatapajonoOid);
    };
    $scope.createHyvaksymisosoitteetPDF = function () {

        OsoitetarratSijoittelussaHyvaksytyille.post({
        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
        	hakuOid: $routeParams.hakuOid, 
        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: SijoitteluntulosModel.valitutOidit() }, function (id) {
            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille osoitetarrat", "");
        }, function () {
            
        });
    };
    $scope.createHyvaksymiskirjeetPDF = function () {
        Hyvaksymiskirjeet.post({
        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
        	hakuOid: $routeParams.hakuOid, 
        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: SijoitteluntulosModel.valitutOidit() } , function (id) {
            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille hyväksymiskirjeet", "");
        }, function () {
            
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
}
