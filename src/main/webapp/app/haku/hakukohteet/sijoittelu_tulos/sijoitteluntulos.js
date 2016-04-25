angular.module('valintalaskenta')

.factory('SijoitteluntulosModel', [ '$q', 'Ilmoitus', 'Sijoittelu', 'LatestSijoitteluajoHakukohde', 'VastaanottoTila',
        '$timeout', 'SijoitteluAjo', 'HakukohteenValintatulokset', 'IlmoitusTila', 'HaunTiedot', '_', 'ngTableParams',
        'FilterService', '$filter',
        function ($q, Ilmoitus, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila,
                                               $timeout, SijoitteluAjo, HakukohteenValintatulokset, IlmoitusTila,
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
            model.sijoitteluajoId = 0;

            HaunTiedot.get({hakuOid: hakuOid}, function(resultWrapper) {
                model.haku = resultWrapper.result;
            });

            var vastaanottotilatDeferred = $q.defer();
            var sijoitteluajoDeferred = $q.defer();

            HakukohteenValintatulokset.get({hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid},
              function (result) {
                  vastaanottotilatDeferred.resolve(result);
            }, function (error) {
                  vastaanottotilatDeferred.reject(error);
            });

            sijoitteluajoDeferred.promise.then(function(result) {
                vastaanottotilatDeferred.promise.then(function(tilat) {
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
                                hakemus.onkoMuuttunutViimeSijoittelussa = (hakemus.onkoMuuttunutViimeSijoittelussa === true) || model.latestSijoitteluajo.sijoitteluajoId <= hakemus.viimeinenMuutos;

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
                                        onkoMuuttunutViimeSijoittelussa: hakemus.onkoMuuttunutViimeSijoittelussa,
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

                                if(hakemus.tila == 'HYVAKSYTTY' || hakemus.tila == 'VARASIJALTA_HYVAKSYTTY' || hakemus.tila == 'PERUNUT' || hakemus.tila == 'PERUUTETTU') {
                                    hakemus.naytetaanVastaanottotieto = true;
                                } else {
                                    hakemus.naytetaanVastaanottotieto = false;
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

                            // HERE
                            if (hakemukset) {
                                hakemukset.forEach(function (currentHakemus) {

                                    //make rest calls in separate scope to prevent hakemusOid to be overridden during rest call
                                    currentHakemus.vastaanottoTila = "KESKEN";
                                    currentHakemus.muokattuVastaanottoTila = "KESKEN";
                                    currentHakemus.muokattuIlmoittautumisTila = "EI_TEHTY";
                                    currentHakemus.tilaHakijalle = "KESKEN";

                                    tilat.some(function (vastaanottotila) {
                                        if (vastaanottotila.hakemusOid === currentHakemus.hakemusOid && vastaanottotila.valintatapajonoOid === valintatapajonoOid) {
                                            currentHakemus.logEntries = vastaanottotila.logEntries;
                                            if (vastaanottotila.tila === null) {
                                                vastaanottotila.tila = "KESKEN";
                                            }
                                            if (vastaanottotila.tilaHakijalle === null) {
                                                vastaanottotila.tilaHakijalle = "KESKEN";
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
                                            currentHakemus.tilaHakijalle = vastaanottotila.tilaHakijalle;
                                            currentHakemus.viimeinenMuutos = vastaanottotila.viimeinenMuutos;
                                            currentHakemus.ilmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                            currentHakemus.muokattuIlmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                            currentHakemus.julkaistavissa = vastaanottotila.julkaistavissa;
                                            currentHakemus.hyvaksyttyVarasijalta = vastaanottotila.hyvaksyttyVarasijalta;
                                            currentHakemus.read = vastaanottotila.read;
                                            currentHakemus.hyvaksyPeruuntunut = vastaanottotila.hyvaksyPeruuntunut;
                                            model.sijoitteluntulosHakijoittain[currentHakemus.hakemusOid].vastaanottoTila=currentHakemus.vastaanottoTila;
                                            model.sijoitteluntulosHakijoittain[currentHakemus.hakemusOid].ilmoittautumisTila=currentHakemus.ilmoittautumisTila;

                                            return true;
                                        }
                                    });
                                });
                            }

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

                }, function(error) {
                    model.errors.push(error.data.message);
                })
            }, function(error) {
                model.errors.push(error.data.message);
            });

            LatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid
            },
              function (result) {
                  sijoitteluajoDeferred.resolve(result);

            }, function (error) {
                  sijoitteluajoDeferred.reject(error);
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

        this.updateHakemuksienTila = function (valintatapajonoOid, uiMuokatutHakemukset, afterSuccess, afterFailure) {
            var jonoonLiittyvat = _.filter(model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
                return valintatapajono.oid === valintatapajonoOid;
            });

            var muokatutHakemuksetOids = _.pluck(uiMuokatutHakemukset, 'hakemusOid');

            var muokatutHakemukset = _.filter(_.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
                return valintatapajono.hakemukset;
            })), function (hakemus) {
                return _.contains(muokatutHakemuksetOids, hakemus.hakemusOid);
            });

            model.updateVastaanottoTila("Massamuokkaus", muokatutHakemukset, valintatapajonoOid, afterSuccess, afterFailure);
        };
        this.updateVastaanottoTila = function (selite, muokatutHakemukset, valintatapajonoOid, afterSuccess, afterFailure) {
            model.errors.length = 0;
            var tilaParams = {
                hakuOid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                selite: selite
            };

            var tilaObj = _.map(muokatutHakemukset, function (hakemus) {
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
                    hakijaOid: hakemus.hakijaOid,
                    hakuOid: model.hakuOid,
                    hakukohdeOid: model.hakukohdeOid,
                    julkaistavissa: hakemus.julkaistavissa,
                    hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta,
                    hyvaksyPeruuntunut: hakemus.hyvaksyPeruuntunut,
                    read: hakemus.read
                };
            });

            VastaanottoTila.post(tilaParams, tilaObj, function (result) {
                afterSuccess(function() { document.location.reload(); }, muokatutHakemukset.length + " muutosta tallennettu.");
            }, function (error) {
                var errorCount = error.data.statuses.length;
                var errorMsg = errorCount + "/" + muokatutHakemukset.length + " hakemuksen päivitys epäonnistui. ";
                if (error.data.statuses.filter(function(status) { return status.status === 409; }).length > 0) {
                    errorMsg += "Tietoihin on tehty samanaikaisia muutoksia, päivitä sivu ja yritä uudelleen";
                } else {
                    errorMsg += "Yritä uudelleen tai ota yhteyttä ylläpitoon.";
                }
                var errorRows = _.map(error.data.statuses, function(status) { return status.message; });
                afterFailure(function() { document.location.reload(); }, errorMsg, errorRows);
            });
        };

    }();

    return model;

}])


    .controller('SijoitteluntulosController', ['$scope', '$modal', 'TallennaValinnat', '$routeParams', '$window', 'Kirjepohjat', 'Latausikkuna', 'HakukohdeModel',
        'SijoitteluntulosModel', 'OsoitetarratSijoittelussaHyvaksytyille', 'Hyvaksymiskirjeet', 'HakukohteelleJalkiohjauskirjeet',
        'Jalkiohjauskirjeet', 'SijoitteluXls', 'AuthService', 'HaeDokumenttipalvelusta', 'LocalisationService','HakuModel', 'Ohjausparametrit', 'HakuUtility', '_', '$log', 'Korkeakoulu', 'HakukohdeNimiService',
        'Kirjeet','UserModel',
        function ($scope, $modal, TallennaValinnat, $routeParams, $window, Kirjepohjat, Latausikkuna, HakukohdeModel,
                                    SijoitteluntulosModel, OsoitetarratSijoittelussaHyvaksytyille, Hyvaksymiskirjeet, HakukohteelleJalkiohjauskirjeet,
                                    Jalkiohjauskirjeet, SijoitteluXls, AuthService, HaeDokumenttipalvelusta, LocalisationService, HakuModel, Ohjausparametrit, HakuUtility, _, $log, Korkeakoulu, HakukohdeNimiService,
                                    Kirjeet, UserModel) {
    "use strict";
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakuModel = HakuModel;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.model = SijoitteluntulosModel;
    $scope.korkeakouluService = Korkeakoulu;
    $scope.tilaFilterValue = "";
    $scope.valintaesitysJulkaistavissa = false;

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

    HakuModel.promise.then(function(haku) {
        if (haku.korkeakoulu) {
            $scope.valintaesitysJulkaistavissa = true;
        }
    });

    if($routeParams.hakuOid) {
        Ohjausparametrit.get({hakuOid: $routeParams.hakuOid}, function (result) {
            var now = new Date();
            if (result.PH_VEH && result.PH_VEH.date && now >= new Date(result.PH_VEH.date)) {
                $scope.valintaesitysJulkaistavissa = true;
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

/*
    $scope.updateVastaanottoTila = function (hakemus, valintatapajonoOid) {
        $scope.model.updateVastaanottoTila(hakemus, valintatapajonoOid);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    };
*/

    $scope.muokatutHakemukset = [];

    $scope.addMuokattuHakemus = function (hakemus) {
        $scope.muokatutHakemukset.push(hakemus);
        $scope.muokatutHakemukset = _.uniq($scope.muokatutHakemukset, 'hakemusOid');
    };

    $scope.submit = function (valintatapajonoOid) {

        TallennaValinnat.avaa("Tallenna muutokset.", "Olet tallentamassa muutoksia: " + $scope.muokatutHakemukset.length + " kpl.", function(success, failure) {
            $scope.model.updateHakemuksienTila(valintatapajonoOid, $scope.muokatutHakemukset, success, failure);
        });
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
    	var hakukohde = $scope.hakukohdeModel.hakukohde;
    	var tag = null;
    	if(hakukohde.hakukohdeNimiUri) {
    		tag = hakukohde.hakukohdeNimiUri.split('#')[0];
    	} else {
    		tag = $routeParams.hakukohdeOid;
    	}
    	var templateName = "hyvaksymiskirje";
        Kirjeet.hyvaksymiskirjeet({
            hakuOid: $routeParams.hakuOid,
            hakukohdeOid: $routeParams.hakukohdeOid,
            tarjoajaOid: hakukohde.tarjoajaOids[0],
            hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
            hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi,
            tag: tag,
            langcode: HakukohdeNimiService.getOpetusKieliCode(hakukohde),
            templateName: templateName
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

    $scope.filterChangedValues = function(naytaVainMuuttuneet, tableParams) {
        if(naytaVainMuuttuneet) {
            tableParams.filter()['onkoMuuttunutViimeSijoittelussa'] = true;
        } else {
            tableParams.filter()['onkoMuuttunutViimeSijoittelussa'] = undefined;
        }
    }

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
    	var templateName = "hyvaksymiskirje";
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

    $scope.selectEiVastanotettuMaaraaikanaToAll = function(valintatapajonoOid) {
        var jonoonLiittyvat = _.filter($scope.model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
            return valintatapajono.oid === valintatapajonoOid;
        });
        var muokattavatHakemukset = _.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
            return valintatapajono.hakemukset;
        }));

        muokattavatHakemukset.forEach(function(hakemus) {
          if(hakemus.julkaistavissa && "HYLATTY" !== hakemus.tila && "EI_VASTAANOTETTU_MAARA_AIKANA" === hakemus.tilaHakijalle) {
            hakemus.muokattuVastaanottoTila = hakemus.tilaHakijalle
          }
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

        TallennaValinnat.avaa("Hyväksy jonon valintaesitys", "Olet hyväksymässä muutoksia jonosta 1/" + $scope.model.sijoitteluTulokset.valintatapajonot.length + ": " + muokattavatHakemukset.length + " kpl.", function(success, failure) {
            muokattavatHakemukset.forEach(function (hakemus) {
                hakemus.julkaistavissa = true;
                $scope.addMuokattuHakemus(hakemus);
            });

            $scope.model.updateHakemuksienTila(valintatapajonoOid, $scope.muokatutHakemukset, success, failure);

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
    function isToinenAsteKohdeJoukko(kohdejoukkoUri) {
        var returnValue = false;
        if (kohdejoukkoUri) {
            var arr = ["_11", "_17", "_20"];
            return arr.some(function(s){return kohdejoukkoUri.indexOf(s) !== -1});
        }
        return returnValue;
    }
    $scope.showJalkiohjaus = function() {
        return UserModel.isOphUser || !isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
    }
    UserModel.refreshIfNeeded()
}]);

app.filter('removeUnderscores', function(){
    return function(obj){
        return obj.replace(/_/g, "");
    }
});
