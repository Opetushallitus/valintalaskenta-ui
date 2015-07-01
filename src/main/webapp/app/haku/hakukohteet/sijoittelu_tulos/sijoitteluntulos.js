angular.module('valintalaskenta')

.factory('SijoitteluntulosModel', [ '$q', 'Ilmoitus', 'Sijoittelu', 'LatestSijoitteluajoHakukohde', 'VastaanottoTila',
        '$timeout', 'SijoitteluAjo', 'VastaanottoTilat', 'IlmoitusTila', 'HaunTiedot', '_', 'ngTableParams',
        'FilterService', '$filter',
        function ($q, Ilmoitus, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila,
                                               $timeout, SijoitteluAjo, VastaanottoTilat, IlmoitusTila,
                                               HaunTiedot, _, ngTableParams, FilterService, $filter) {
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

        var order = {
            "HYVAKSYTTY": 1,
            "VARASIJALTA_HYVAKSYTTY": 1,
            "VARALLA": 2,
            "PERUNUT": 3,
            "PERUUTETTU": 4,
            "PERUUNTUNUT": 5,
            "HYLATTY": 6
        };

        this.jarjesta = function(value) {
            var i = order[value.tila];
            if(i == order["HYVAKSYTTY"] && value.hyvaksyttyHarkinnanvaraisesti) {
                i = 0;
            }
            return i;
        };

        this.filterValitut = function(hakemukset) {
			return _.filter(hakemukset,function(hakemus) {
				return hakemus.valittu;
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

            HaunTiedot.get({hakuOid: hakuOid}, function(resultWrapper) {
                model.haku = resultWrapper.result;
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
                                jonosija: hakemus.jonosija,
                                prioriteetti: valintatapajono.prioriteetti,
                                tilaHistoria: hakemus.tilaHistoria,
                                varasijanNumero: hakemus.varasijanNumero
                            };
                            if (!model.sijoitteluntulosHakijoittain[hakemus.hakemusOid]) {
                                model.sijoitteluntulosHakijoittain[hakemus.hakemusOid] = {
                                    etunimi: hakemus.etunimi,
                                    sukunimi: hakemus.sukunimi,
                                    hakemusOid: hakemus.hakemusOid,
                                    hakijaOid: hakemus.hakijaOid,
                                    tilanKuvaukset: hakemus.tilanKuvaukset,
                                    hyvaksyttyHarkinnanvaraisesti: hakemus.hyvaksyttyHarkinnanvaraisesti,
                                    varasijanNumero: hakemus.varasijanNumero,
                                    tila: hakemus.tila,
                                    tilaHistoria: hakemus.tilaHistoria,
                                    vastaanottoTila: 'KESKEN',
                                    ilmoittautumisTila: 'EI_TEHTY',
                                    jonot: []
                                };

                            }

                            if (hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY") {
                                sija++;
                                hakemus.valittu = true;
                                hakemuserittely.hyvaksytyt.push(hakemus);
                                hakemus.sija = sija;
                                jono.sija = sija;
                            }

                            if ((hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY") && hakemus.hyvaksyttyHarkinnanvaraisesti) {
                                hakemuserittely.hyvaksyttyHarkinnanvaraisesti.push(hakemus);
                            }


                            if (hakemus.tila === "VARALLA") {
                                sija++;
                                hakemuserittely.varasijoilla.push(hakemus);
                                hakemus.sija = sija;
                                jono.sija = sija;
                            }

                            hakemus.tilaPrioriteetti = model.jarjesta(hakemus);

                            var found = false;
                            model.sijoitteluntulosHakijoittain[hakemus.hakemusOid].jonot.forEach(function (j) {
                                if (j.nimi === jono.nimi) found = true;
                            });
                            if (!found)
                                model.sijoitteluntulosHakijoittain[hakemus.hakemusOid].jonot.push(jono);


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
                                            if (currentHakemus.vastaanottoTila === "VASTAANOTTANUT" || currentHakemus.vastaanottoTila === "VASTAANOTTANUT_SITOVASTI") {
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
                                            currentHakemus.read = vastaanottotila.read;
                                            model.sijoitteluntulosHakijoittain[currentHakemus.hakemusOid].vastaanottoTila=currentHakemus.vastaanottoTila;
                                            model.sijoitteluntulosHakijoittain[currentHakemus.hakemusOid].ilmoittautumisTila=currentHakemus.ilmoittautumisTila;
                                            return true;
                                        }
                                    });
                                });
                            }

                        }, function (error) {
                            model.errors.push(error);
                        });

                        valintatapajono.tableParams = new ngTableParams({
                            page: 1,            // show first page
                            count: 50,          // count per page
                            filters: {
                                'sukunimi' : ''
                            },
                            sorting: {
                                'tilaPrioriteetti': 'asc',     // initial sorting
                                'varasijanNumero': 'asc',
                                'sija': 'asc'
                            }
                        }, {
                            total: valintatapajono.hakemukset.length, // length of data
                            getData: function ($defer, params) {
                                var filters = FilterService.fixFilterWithNestedProperty(params.filter());

                                var orderedData = params.sorting() ?
                                    $filter('orderBy')(valintatapajono.hakemukset, params.orderBy()) :
                                    valintatapajono.hakemukset;
                                orderedData = params.filter() ?
                                    $filter('filter')(orderedData, filters) :
                                    orderedData;

                                params.total(orderedData.length); // set total for recalc pagination
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                            }
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

                model.sijoitteluntulosHakijoittainTableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 50,          // count per page
                    filters: {
                        'sukunimi' : ''
                    },
                    sorting: {
                        'tilaPrioriteetti': 'asc',     // initial sorting
                        'varasijanNumero': 'asc',
                        'sija': 'asc'
                    }
                }, {
                    total: model.sijoitteluntulosHakijoittainArray.length, // length of data
                    getData: function ($defer, params) {
                        var filters = FilterService.fixFilterWithNestedProperty(params.filter());

                        var orderedData = params.sorting() ?
                            $filter('orderBy')(model.sijoitteluntulosHakijoittainArray, params.orderBy()) :
                            model.sijoitteluntulosHakijoittainArray;
                        orderedData = params.filter() ?
                            $filter('filter')(orderedData, filters) :
                            orderedData;

                        params.total(orderedData.length); // set total for recalc pagination
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                    }
                });
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

        this.updateHakemuksienTila = function (valintatapajonoOid, uiMuokatutHakemukset) {
            var jonoonLiittyvat = _.filter(model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
                return valintatapajono.oid === valintatapajonoOid;
            });

            var muokatutHakemuksetOids = _.pluck(uiMuokatutHakemukset, 'hakemusOid');


            var muokatutHakemukset = _.filter(_.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
                return valintatapajono.hakemukset;
            })), function (hakemus) {
                return _.contains(muokatutHakemuksetOids, hakemus.hakemusOid);
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
                	hakemusOid: hakemus.hakemusOid,
                    julkaistavissa: hakemus.julkaistavissa,
                    hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta,
                    read: hakemus.read
            	};
            });

            VastaanottoTila.post(tilaParams, tilaObj, function (result) {
            	Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
            }, function (error) {

                function getMessage(error) {
                    return error.status == 409 ? "Tietoihin on tehty samanaikaisia muutoksia, päivitä sivu ja yritä uudelleen" : "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon."
                }
                Ilmoitus.avaa("Sijoittelun tulosten tallennus", getMessage(error), IlmoitusTila.ERROR)
            });
        };

    }();

    return model;

}])


    .controller('SijoitteluntulosController', ['$scope', '$modal', '$routeParams', '$window', 'Kirjepohjat', 'Latausikkuna', 'HakukohdeModel',
        'SijoitteluntulosModel', 'OsoitetarratSijoittelussaHyvaksytyille', 'Hyvaksymiskirjeet', 'HakukohteelleJalkiohjauskirjeet',
        'Jalkiohjauskirjeet', 'SijoitteluXls', 'AuthService', 'HaeDokumenttipalvelusta', 'LocalisationService','HakuModel', 'Ohjausparametrit', 'HakuUtility', '_', '$log', 'Korkeakoulu', 'HakukohdeNimiService',
        function ($scope, $modal, $routeParams, $window, Kirjepohjat, Latausikkuna, HakukohdeModel,
                                    SijoitteluntulosModel, OsoitetarratSijoittelussaHyvaksytyille, Hyvaksymiskirjeet, HakukohteelleJalkiohjauskirjeet,
                                    Jalkiohjauskirjeet, SijoitteluXls, AuthService, HaeDokumenttipalvelusta, LocalisationService, HakuModel, Ohjausparametrit, HakuUtility, _, $log, Korkeakoulu, HakukohdeNimiService) {
    "use strict";
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakuModel = HakuModel;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.model = SijoitteluntulosModel;
    $scope.korkeakouluService = Korkeakoulu;
    $scope.tilaFilterValue = "";

    $scope.tilaFilterValues = [
        {value: "", text_prop: "sijoitteluntulos.alasuodatatilan", default_text:"Älä suodata tilan mukaan"},
        {value: "HYLATTY", text_prop: "sijoitteluntulos.hylatty", default_text:"Hylätty"},
        {value: "VARALLA", text_prop: "sijoitteluntulos.varalla", default_text:"Varalla"},
        {value: "PERUUNTUNUT", text_prop: "sijoitteluntulos.peruuntunut", default_text:"Peruuntunut"},
        {value: "VARASIJALTA_HYVAKSYTTY", text_prop: "sijoitteluntulos.varasijalta", default_text:"Varasijalta hyväksytty"},
        {value: "HYVAKSYTTY", text_prop: "sijoitteluntulos.hyvaksytty", default_text:"Hyväksytty"},
        {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"},
        {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"}
    ];

    if($routeParams.hakuOid) {
        Ohjausparametrit.get({hakuOid: $routeParams.hakuOid}, function (result) {
            var now = new Date();
            if(result.PH_VTSSV) {
                $scope.showHakemuksenTilaMuokkaus = now >= result.PH_VTSSV; //kaikki jonot siirretty sijoitteluun
            } else {
                $scope.showHakemuksenTilaMuokkaus = true;
            }
        });
    }

    $scope.nakymanTila = "Jonottain";

    $scope.hakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function () {
        $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOids', function () {
            AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOids[0]).then(function () {
                $scope.updateOrg = true;
            });

            AuthService.musiikkiOrg("APP_VALINTOJENTOTEUTTAMINEN", HakukohdeModel.hakukohde.tarjoajaOids[0]).then(function () {
                $scope.updateVarasijaltaHyvaksytty = true;
            });
        });
    });

    //
    // pikalatauslinkit on harmaannettuna jos ei ensimmaistakaan generointia 
    $scope.osoitetarratUrl = null;
    $scope.hyvaksymiskirjeetUrl = null;
    $scope.sijoitteluntuloksetUrl = null;
    HaeDokumenttipalvelusta.get({tyyppi:'osoitetarrat',hakukohdeoid:$routeParams.hakukohdeOid }, function (vastausOsoitetarrat) {
		if(vastausOsoitetarrat[0]) {
			$scope.osoitetarratUrl = vastausOsoitetarrat[0].documentId;
		}
		HaeDokumenttipalvelusta.get({tyyppi:'hyvaksymiskirjeet',hakukohdeoid:$routeParams.hakukohdeOid }, function (vastausHyvaksymiskirjeet) {
            if(vastausHyvaksymiskirjeet[0]) {
                $scope.hyvaksymiskirjeetUrl = vastausHyvaksymiskirjeet[0].documentId;
            }
        });
        HaeDokumenttipalvelusta.get({tyyppi:'sijoitteluntulokset',hakukohdeoid:$routeParams.hakukohdeOid}, function(vastausSijoitteluntulokset) {
            if(vastausSijoitteluntulokset[0]) {
                $scope.sijoitteluntuloksetUrl = vastausSijoitteluntulokset[0].documentId;
            }
        });
	});


	
    $scope.hakemuksenMuokattuIlmoittautumisTilat = [
        {value: "EI_TEHTY", text_prop: "sijoitteluntulos.enrollmentinfo.notdone", default_text:"Ei tehty"},
        {value: "LASNA_KOKO_LUKUVUOSI", text_prop: "sijoitteluntulos.enrollmentinfo.present", default_text:"Läsnä (koko lukuvuosi)"},
        {value: "POISSA_KOKO_LUKUVUOSI", text_prop: "sijoitteluntulos.enrollmentinfo.notpresent", default_text:"Poissa (koko lukuvuosi)"},
        {value: "EI_ILMOITTAUTUNUT", text_prop: "sijoitteluntulos.enrollmentinfo.noenrollment", default_text:"Ei ilmoittautunut"},
        {value: "LASNA_SYKSY", text_prop: "sijoitteluntulos.enrollmentinfo.presentfall", default_text:"Läsnä syksy, poissa kevät"},
        {value: "POISSA_SYKSY", text_prop: "sijoitteluntulos.enrollmentinfo.notpresentfall", default_text:"Poissa syksy, läsnä kevät"},
        {value: "LASNA", text_prop: "sijoitteluntulos.enrollmentinfo.presentspring", default_text:"Läsnä, keväällä alkava koulutus"},
        {value: "POISSA", text_prop: "sijoitteluntulos.enrollmentinfo.notpresentspring", default_text:"Poissa, keväällä alkava koulutus"}
    ];

    $scope.pageSize = 50;


    $scope.updateVastaanottoTila = function (hakemus, valintatapajonoOid) {
        $scope.model.updateVastaanottoTila(hakemus, valintatapajonoOid);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    };

    $scope.muokatutHakemukset = [];

    $scope.addMuokattuHakemus = function (hakemus) {
        $scope.muokatutHakemukset.push(hakemus);
        $scope.muokatutHakemukset = _.uniq($scope.muokatutHakemukset, 'hakemusOid');
    };

    $scope.submit = function (valintatapajonoOid) {
        $scope.model.updateHakemuksienTila(valintatapajonoOid, $scope.muokatutHakemukset);
    };

    $scope.luoJalkiohjauskirjeetPDF = function() {
    	var hakuOid = $routeParams.hakuOid;
    	var hakukohde = $scope.hakukohdeModel.hakukohde;
    	var tag = null;
    	if(hakukohde.hakukohdeNimiUri) {
    		tag = hakukohde.hakukohdeNimiUri.split('#')[0];
    	} else {
    		tag = $routeParams.hakukohdeOid;
    	}


    	var langcode = HakukohdeNimiService.getOpetusKieliCode($scope.hakukohdeModel.hakukohde);
    	var templateName = "jalkiohjauskirje";
    	var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                    	otsikko: "Hakukohteessa hylätyille jälkiohjauskirjeet",
                    	toimintoNimi: "Muodosta jälkiohjauskirjeet",
                    	toiminto: function(sisalto) {
                    		HakukohteelleJalkiohjauskirjeet.post({
					        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
					        	hakuOid: $routeParams.hakuOid, 
					        	tarjoajaOid: hakukohde.tarjoajaOids[0],
					        	templateName: templateName,
					        	tag: tag,
					        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: null,letterBodyText:sisalto} , function (id) {
					            Latausikkuna.avaa(id, "Hakukohteessa hylätyille jälkiohjauskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        showDateFields: false,
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        tarjoajaOid: hakukohde.tarjoajaOids[0],
                        pohjat: function() {
                        	return Kirjepohjat.get({templateName:templateName, languageCode: langcode, tarjoajaOid: hakukohde.tarjoajaOids[0], tag: tag, hakuOid: hakuOid});
                        },
                        hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
                        hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi
                    };
                }
            }
        });
    }
    $scope.luoHyvaksymiskirjeetPDF = function() {
    	var hakuOid = $routeParams.hakuOid;
    	var hakukohde = $scope.hakukohdeModel.hakukohde;
    	var tag = null;
    	if(hakukohde.hakukohdeNimiUri) {
    		tag = hakukohde.hakukohdeNimiUri.split('#')[0];
    	} else {
    		tag = $routeParams.hakukohdeOid;
    	}
    	var langcode = HakukohdeNimiService.getOpetusKieliCode($scope.hakukohdeModel.hakukohde);
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
                    	toiminto: function(sisalto, palautusPvm, palautusAika) {
                    		Hyvaksymiskirjeet.post({

					        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
					        	hakuOid: $routeParams.hakuOid, 
					        	tarjoajaOid: hakukohde.tarjoajaOids[0],
					        	templateName: templateName,
					        	palautusPvm: palautusPvm,
					        	palautusAika: palautusAika,
					        	tag: tag,
					        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: null,letterBodyText:sisalto} , function (id) {
					            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille hyväksymiskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        showDateFields: true,
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        tarjoajaOid: hakukohde.tarjoajaOids[0],
                        pohjat: function() {
                        	return Kirjepohjat.get({templateName:templateName, languageCode: langcode, tarjoajaOid: hakukohde.tarjoajaOids[0], tag: tag, hakuOid: hakuOid});
                        },
                        hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
                        hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi
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
    	//var langcode = HakukohdeNimiService.getKieliCode($scope.hakukohdeModel.hakukohde);
    	var langcode = HakukohdeNimiService.getOpetusKieliCode($scope.hakukohdeModel.hakukohde);
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
                    	toiminto: function(sisalto, palautusPvm, palautusAika) {
                    		Hyvaksymiskirjeet.post({
					        	sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, 
					        	hakuOid: $routeParams.hakuOid, 
					        	tarjoajaOid: hakukohde.tarjoajaOids[0],
					        	templateName: templateName,
					        	palautusPvm: palautusPvm,
					        	palautusAika: palautusAika,
					        	tag: tag,
					        	hakukohdeOid: $routeParams.hakukohdeOid}, {hakemusOids: oidit,letterBodyText:sisalto} , function (id) {
					            Latausikkuna.avaa(id, "Sijoittelussa hyväksytyille hyväksymiskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        showDateFields: true,
                        hakuOid: $routeParams.hakuOid,
                        hakukohdeOid: $routeParams.hakukohdeOid,
                        tarjoajaOid: hakukohde.tarjoajaOids[0],
                        pohjat: function() {
                        	return Kirjepohjat.get({templateName:templateName, languageCode: langcode, tarjoajaOid: hakukohde.tarjoajaOids[0], tag: tag, hakuOid: hakuOid});
                        },
                        hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
                        hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi
                    };
                }
            }
        });
    };

    $scope.createJalkiohjauskirjeetPDF = function () {
        Jalkiohjauskirjeet.post({
        	sijoitteluajoId: $scope.model.latestSijoitteluajo.sijoitteluajoId, 
        	hakuOid: $routeParams.hakuOid, 
        	hakukohdeOid: $routeParams.hakukohdeOid}, function (resurssi) {
            $window.location.href = resurssi.latausUrl;
        }, function (response) {
            alert(response.data.viesti);
        });
    };



    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
    });

    $scope.jarjesta = function(value) {
        return $scope.model.jarjesta(value);
    };

    $scope.selectIlmoitettuToAll = function(valintatapajonoOid) {
        var jonoonLiittyvat = _.filter($scope.model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
            return valintatapajono.oid === valintatapajonoOid;
        });
        var muokattavatHakemukset = _.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
            return valintatapajono.hakemukset;
        }));

        muokattavatHakemukset.forEach(function (hakemus) {
            hakemus.julkaistavissa = true;
            $scope.addMuokattuHakemus(hakemus);
        });


    };

    $scope.jonoLength = function(length) {
        return LocalisationService.tl('sijoitteluntulos.jonosija') ? LocalisationService.tl('sijoitteluntulos.jonosija') +  " ("+length+")" : 'Jonosija' +  " ("+length+")";
    };

    $scope.resetIlmoittautumisTila = function(hakemus) {
        if(hakemus.muokattuVastaanottoTila !== 'VASTAANOTTANUT' && hakemus.muokattuVastaanottoTila !== 'EHDOLLISESTI_VASTAANOTTANUT') {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        } else if (!hakemus.muokattuIlmoittautumisTila) {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        }
    };

    LocalisationService.getTranslationsForArray($scope.tilaFilterValues).then(function () {
    });

    LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuIlmoittautumisTilat).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.model.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);
    });

}]);
