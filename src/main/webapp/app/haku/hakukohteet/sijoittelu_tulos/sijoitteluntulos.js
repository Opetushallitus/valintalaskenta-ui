angular.module('valintalaskenta')

.factory('SijoitteluntulosModel', [ '$q', 'Ilmoitus', 'Sijoittelu', 'LatestSijoitteluajoHakukohde', 'VastaanottoTila', 'ValintaesityksenHyvaksyminen',
        '$timeout', 'SijoitteluAjo', 'HakukohteenValintatuloksetIlmanTilaHakijalleTietoa', 'ValinnanTulos', 'Valinnantulokset', 'VastaanottoUtil', 'HakemustenVastaanottotilaHakijalle',
        'IlmoitusTila', 'HaunTiedot', '_', 'ngTableParams', 'FilterService', '$filter',
        function ($q, Ilmoitus, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila, ValintaesityksenHyvaksyminen,
                                               $timeout, SijoitteluAjo, HakukohteenValintatuloksetIlmanTilaHakijalleTietoa, ValinnanTulos, Valinnantulokset, VastaanottoUtil, HakemustenVastaanottotilaHakijalle,
                                               IlmoitusTila, HaunTiedot, _, ngTableParams, FilterService, $filter) {
    "use strict";

    var createHakemuserittely = function(valintatapajono) {
        return {
            nimi: valintatapajono.nimi,
            hyvaksytyt: [],
            paikanVastaanottaneet: [],
            hyvaksyttyHarkinnanvaraisesti: [],
            varasijoilla: [],
            ehdollisesti: [],
            aloituspaikat: valintatapajono.aloituspaikat,
            alkuperaisetAloituspaikat: valintatapajono.alkuperaisetAloituspaikat,
            prioriteetti: valintatapajono.prioriteetti
        }
    };

    var createHakijanSijoitteluntulos = function(hakemus) {
        return {
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
            vastaanottoTila: hakemus.vastaanottoTila,
            ilmoittautumisTila: hakemus.ilmoittautumisTila,
            jonot: []
        }
    };

    var createHakijanSijoitteluntuloksenJono = function(valintatapajono, hakemus) {
        var jono = {
            nimi: valintatapajono.nimi,
            pisteet: hakemus.pisteet,
            tila: hakemus.tila,
            jonosija: hakemus.jonosija,
            prioriteetti: valintatapajono.prioriteetti,
            tilaHistoria: hakemus.tilaHistoria,
            varasijanNumero: hakemus.varasijanNumero
        };
        if (hakemus.sija) {
            jono.sija = hakemus.sija;
        }
        return jono;
    };

    var categorizeHakemusForErittely = function(hakemuserittely, hakemus) {
        if (hakemus.tila === "HYVAKSYTTY" || hakemus.tila === "VARASIJALTA_HYVAKSYTTY") {
            hakemuserittely.hyvaksytyt.push(hakemus);

            if (hakemus.hyvaksyttyHarkinnanvaraisesti) {
                hakemuserittely.hyvaksyttyHarkinnanvaraisesti.push(hakemus);
            }

            if (hakemus.vastaanottoTila === "VASTAANOTTANUT_SITOVASTI") {
                hakemuserittely.paikanVastaanottaneet.push(hakemus);
            } else if (hakemus.vastaanottoTila === "EHDOLLISESTI_VASTAANOTTANUT") {
                hakemuserittely.ehdollisesti.push(hakemus);
            }
        } else if (hakemus.tila === "VARALLA") {
            hakemuserittely.varasijoilla.push(hakemus);
        }
    };

    var createValintatapajonoTableParams = function(valintatapajono) {
        return new ngTableParams({
            page: 1,
            count: 50,
            filters: {
                'sukunimi' : ''
            },
            sorting: {
                'tilaPrioriteetti': 'asc',
                'varasijanNumero': 'asc',
                'sija': 'asc'
            }
        }, {
            total: valintatapajono.hakemukset.length,
            getData: function ($defer, params) {
                var filters = FilterService.fixFilterWithNestedProperty(params.filter());

                var orderedData = params.sorting() ?
                    $filter('orderBy')(valintatapajono.hakemukset, params.orderBy()) :
                    valintatapajono.hakemukset;
                orderedData = params.filter() ?
                    $filter('filter')(orderedData, filters) :
                    orderedData;

                params.total(orderedData.length); // set total for recalc pagination
                var visibleSlice = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                if ("false" !== SHOW_TILA_HAKIJALLE_IN_SIJOITTELUN_TULOKSET) {
                    haeTilaHakijalleTarvitsevilleHakemuksille(visibleSlice, valintatapajono.oid);
                }
                $defer.resolve(visibleSlice);
            }
        })
    };

    var createSijoittelutulosHakijoittainTableParams = function(sijoitteluntulosHakijoittainArray) {
        return new ngTableParams({
            page: 1,
            count: 50,
            filters: {
                'sukunimi' : ''
            },
            sorting: {
                'tilaPrioriteetti': 'asc',
                'varasijanNumero': 'asc',
                'sija': 'asc'
            }
        }, {
            total: sijoitteluntulosHakijoittainArray.length,
            getData: function ($defer, params) {
                var filters = FilterService.fixFilterWithNestedProperty(params.filter());

                var orderedData = params.sorting() ?
                    $filter('orderBy')(sijoitteluntulosHakijoittainArray, params.orderBy()) :
                    sijoitteluntulosHakijoittainArray;
                orderedData = params.filter() ?
                    $filter('filter')(orderedData, filters) :
                    orderedData;
                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

            }
        })
    };

    var calculateSijat = function(valintatapajono) {
        valintatapajono.hakemukset.filter(function(hakemus) {
            return (
                hakemus.tila === "HYVAKSYTTY" ||
                hakemus.tila === "VARASIJALTA_HYVAKSYTTY" ||
                hakemus.tila === "VARALLA"
            );
        }).forEach(function(hakemus, i) {
            hakemus.sija = i + 1;
        });
    };

    var enrichHakemusWithValintatulos = function(hakemus, valintatulos) {
        hakemus.logEntries = valintatulos.logEntries;
        if (!hakemus.hakijaOid) {
            hakemus.hakijaOid = valintatulos.hakijaOid;
        }
        if (valintatulos.tila === null) {
            valintatulos.tila = "KESKEN";
        }
        if (valintatulos.tilaHakijalle === null) {
            valintatulos.tilaHakijalle = "";
            hakemus.tilaHakijalleTaytyyLadataPalvelimelta = true;
        }
        hakemus.vastaanottoTila = valintatulos.tila;
        hakemus.muokattuVastaanottoTila = valintatulos.tila;

        if (valintatulos.ilmoittautumisTila === null) {
            valintatulos.ilmoittautumisTila = "EI_TEHTY";
        }
        hakemus.tilaHakijalle = valintatulos.tilaHakijalle;
        hakemus.viimeinenMuutos = valintatulos.viimeinenMuutos;
        hakemus.onkoMuuttunutViimeSijoittelussa =
            hakemus.onkoMuuttunutViimeSijoittelussa ||
            model.latestSijoitteluajo.sijoitteluajoId <= hakemus.viimeinenMuutos;
        hakemus.ilmoittautumisTila = valintatulos.ilmoittautumisTila;
        hakemus.muokattuIlmoittautumisTila = valintatulos.ilmoittautumisTila;
        hakemus.julkaistavissa = valintatulos.julkaistavissa;
        hakemus.ehdollisestiHyvaksyttavissa = valintatulos.ehdollisestiHyvaksyttavissa;
        hakemus.ehtoEditableInputFields = (valintatulos.ehdollisenHyvaksymisenEhtoKoodi == "hyvaksynnanehdot_muu");
        hakemus.ehtoInputFields = valintatulos.ehdollisestiHyvaksyttavissa;
        hakemus.ehdollisenHyvaksymisenEhtoKoodi = valintatulos.ehdollisenHyvaksymisenEhtoKoodi;
        hakemus.ehdollisenHyvaksymisenEhtoFI = valintatulos.ehdollisenHyvaksymisenEhtoFI;
        hakemus.ehdollisenHyvaksymisenEhtoSV = valintatulos.ehdollisenHyvaksymisenEhtoSV;
        hakemus.ehdollisenHyvaksymisenEhtoEN = valintatulos.ehdollisenHyvaksymisenEhtoEN;
        hakemus.hyvaksyttyVarasijalta = valintatulos.hyvaksyttyVarasijalta;
        hakemus.read = valintatulos.read;
        hakemus.hyvaksyPeruuntunut = valintatulos.hyvaksyPeruuntunut;

        if (valintatulos.hyvaksymiskirjeLahetetty) {
            hakemus.hyvaksymiskirjeLahetetty = true;
            hakemus.hyvaksymiskirjeLahetettyPvm = valintatulos.hyvaksymiskirjeLahetetty;
        }
        else {
            valintatulos.hyvaksymiskirjeLahetetty = false;
        }
    };

    var model = new function () {

        this.hakuOid = null;
        this.hakukohdeOid = null;
        this.sijoittelu = {};
        this.latestSijoitteluajo = {};
        this.sijoitteluTulokset = {};
        this.errors = [];
        this.valintatapajonoLastModified = {};

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
            model.myohastymistietoLadattu = false;
            model.eraantyneitaHakemuksia = false;
            model.valintatapajonoLastModified = {};

            HaunTiedot.get({hakuOid: hakuOid}, function(resultWrapper) {
                model.haku = resultWrapper.result;
            });

            $q.all({
                sijoittelunTulokset: LatestSijoitteluajoHakukohde.get({
                    hakukohdeOid: hakukohdeOid,
                    hakuOid: hakuOid
                }).$promise,
                valintatulokset: HakukohteenValintatuloksetIlmanTilaHakijalleTietoa.get({
                    hakukohdeOid: hakukohdeOid,
                    hakuOid: hakuOid
                }).$promise
            }).then(function(o) {
                var sijoittelunTulokset = o.sijoittelunTulokset;
                var valintatulokset = o.valintatulokset;
                if (sijoittelunTulokset.sijoitteluajoId) {
                    model.latestSijoitteluajo.sijoitteluajoId = sijoittelunTulokset.sijoitteluajoId;
                    model.sijoitteluTulokset = sijoittelunTulokset;
                    model.sijoitteluTulokset.valintatapajonot.forEach(function (valintatapajono, index) {
                        valintatapajono.index = index;
                        valintatapajono.valittu = true;
                        var hakemuserittely = createHakemuserittely(valintatapajono);
                        model.hakemusErittelyt.push(hakemuserittely);
                        calculateSijat(valintatapajono);
                        valintatapajono.hakemukset.forEach(function (hakemus) {
                            hakemus.valittu = (
                                hakemus.tila === "HYVAKSYTTY" ||
                                hakemus.tila === "VARASIJALTA_HYVAKSYTTY"
                            );
                            hakemus.naytetaanVastaanottotieto = (
                                hakemus.tila == 'HYVAKSYTTY' ||
                                hakemus.tila == 'VARASIJALTA_HYVAKSYTTY' ||
                                hakemus.tila == 'PERUNUT' ||
                                hakemus.tila == 'PERUUTETTU'
                            );
                            hakemus.tilaPrioriteetti = model.jarjesta(hakemus);

                            hakemus.vastaanottoTila = "KESKEN";
                            hakemus.muokattuVastaanottoTila = "KESKEN";
                            hakemus.muokattuIlmoittautumisTila = "EI_TEHTY";
                            hakemus.tilaHakijalle = "KESKEN";
                            valintatulokset.forEach(function(valintatulos) {
                                if (valintatulos.hakemusOid === hakemus.hakemusOid &&
                                    valintatulos.valintatapajonoOid === valintatapajono.oid) {
                                    enrichHakemusWithValintatulos(hakemus, valintatulos);
                                }
                            });

                            categorizeHakemusForErittely(hakemuserittely, hakemus);
                            if (!model.sijoitteluntulosHakijoittain[hakemus.hakemusOid]) {
                                var hakijanSijoitteluntulos = createHakijanSijoitteluntulos(hakemus);
                                model.sijoitteluntulosHakijoittain[hakemus.hakemusOid] = hakijanSijoitteluntulos;
                                model.sijoitteluntulosHakijoittainArray.push(hakijanSijoitteluntulos);
                            }
                            model.sijoitteluntulosHakijoittain[hakemus.hakemusOid].jonot.push(
                                createHakijanSijoitteluntuloksenJono(valintatapajono, hakemus)
                            );
                        });

                        valintatapajono.tableParams = createValintatapajonoTableParams(valintatapajono);
                    });
                }
                model.sijoitteluntulosHakijoittainTableParams = createSijoittelutulosHakijoittainTableParams(model.sijoitteluntulosHakijoittainArray);
            }).then(function() {
                model.sijoitteluTulokset.valintatapajonot.forEach(function(v) {
                    // Result intentionally unused, used for integration testing
                    ValinnanTulos.get({valintatapajonoOid: v.oid}).then(function(response) {
                        Valinnantulokset.compareSijoitteluOldAndNewVtsResponse(v, response.data);
                        model.valintatapajonoLastModified[v.oid] = response.headers("Last-Modified");
                    }, function(error) {
                        var forBreakpoint = error;
                    });
                });
            }).then(fetchAndPopulateVastaanottoAikarajaMennyt)
                .catch(function(error) { model.errors.push(error.data.message); });
        };

        //refresh if haku or hakukohde has changed
        this.refreshIfNeeded = function (hakuOid, hakukohdeOid, isHakukohdeChanged) {
        	if(hakukohdeOid && hakuOid) {
	            if (model.sijoittelu.hakuOid !== hakuOid || isHakukohdeChanged) {
	                model.refresh(hakuOid, hakukohdeOid);
	            }
        	}
        };

        this.muokattuHakemusToServerRequestObject = function(valintatapajonoOid) {
            return function(hakemus) {
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
                    ehdollisestiHyvaksyttavissa: hakemus.ehdollisestiHyvaksyttavissa,
                    ehdollisenHyvaksymisenEhtoKoodi: hakemus.ehdollisenHyvaksymisenEhtoKoodi,
                    ehdollisenHyvaksymisenEhtoFI: hakemus.ehdollisenHyvaksymisenEhtoFI,
                    ehdollisenHyvaksymisenEhtoSV: hakemus.ehdollisenHyvaksymisenEhtoSV,
                    ehdollisenHyvaksymisenEhtoEN: hakemus.ehdollisenHyvaksymisenEhtoEN,
                    hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta,
                    hyvaksyPeruuntunut: hakemus.hyvaksyPeruuntunut,
                    hyvaksymiskirjeLahetetty: hakemus.hyvaksymiskirjeLahetettyPvm,
                    read: hakemus.read
                };
            };
        };

        this.reportSuccessfulSave = function(afterSuccess, muokatutHakemukset) {
            return function(result) {
                afterSuccess(function () { document.location.reload(); }, muokatutHakemukset.length + " muutosta tallennettu.");
            }
        };

        this.reportFailedSave = function(afterFailure, muokatutHakemukset) {
            return function(error) {
                var errorCount = error.data.statuses.length;
                var errorMsg = errorCount + "/" + muokatutHakemukset.length + " hakemuksen päivitys epäonnistui. ";
                if (error.data.statuses.filter(function(status) { return status.status === 409; }).length > 0) {
                    errorMsg += "Tietoihin on tehty samanaikaisia muutoksia, päivitä sivu ja yritä uudelleen";
                } else {
                    errorMsg += "Yritä uudelleen tai ota yhteyttä ylläpitoon.";
                }
                var errorRows = _.map(error.data.statuses, function(status) { return status.message; });
                afterFailure(function() { document.location.reload(); }, errorMsg, errorRows);
            }
        };

        this.updateHakemuksienTila = function (jononHyvaksynta, valintatapajonoOid, uiMuokatutHakemukset, afterSuccess, afterFailure) {
            var jonoonLiittyvat = _.filter(model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
                return valintatapajono.oid === valintatapajonoOid;
            });

            var muokatutHakemuksetOids = _.pluck(uiMuokatutHakemukset, 'hakemusOid');

            var muokatutHakemukset = _.filter(_.flatten(_.map(jonoonLiittyvat, function(valintatapajono) {
                return valintatapajono.hakemukset;
            })), function (hakemus) {
                return _.contains(muokatutHakemuksetOids, hakemus.hakemusOid);
            });

            if (jononHyvaksynta) {
                model.merkitseJonoHyvaksytyksi(muokatutHakemukset, valintatapajonoOid, afterSuccess, afterFailure);
            } else {
                model.updateVastaanottoTila(muokatutHakemukset, valintatapajonoOid, afterSuccess, afterFailure);
            }
        };

        this.merkitseJonoHyvaksytyksi = function (muokatutHakemukset, valintatapajonoOid, afterSuccess, afterFailure) {
            model.errors.length = 0;
            var tilaParams = {
                hakuOid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                hyvaksyttyJonoOid: valintatapajonoOid,
                selite: "Jonon valintaesityksen hyväksyminen"
            };

            var tilaObj = _.map(muokatutHakemukset, this.muokattuHakemusToServerRequestObject(valintatapajonoOid));
            ValintaesityksenHyvaksyminen.post(tilaParams, tilaObj, this.reportSuccessfulSave(afterSuccess, muokatutHakemukset), this.reportFailedSave(afterFailure, muokatutHakemukset));
        };


        this.updateVastaanottoTila = function (muokatutHakemukset, valintatapajonoOid, afterSuccess, afterFailure) {
            model.errors.length = 0;
            var tilaParams = {
                hakuOid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                hyvaksyttyJonoOid: "",
                selite: "Massamuokkaus"
            };

            var tilaObj = _.map(muokatutHakemukset, this.muokattuHakemusToServerRequestObject(valintatapajonoOid));
            console.log(tilaObj);
            console.log(tilaParams);
            VastaanottoTila.post(tilaParams, tilaObj, this.reportSuccessfulSave(afterSuccess, muokatutHakemukset), this.reportFailedSave(afterFailure, muokatutHakemukset));
            // Used for integration testing
            ValinnanTulos.patch({valintatapajonoOid: valintatapajonoOid}, _.map(muokatutHakemukset, function(h) {
                return {
                    hakukohdeOid: h.hakukohdeOid,
                    valintatapajonoOid: h.valintatapajonoOid,
                    hakemusOid: h.hakemusOid,
                    henkiloOid: h.hakijaOid,
                    vastaanottotila: h.muokattuVastaanottoTila,
                    ilmoittautumistila: h.muokattuIlmoittautumisTila,
                    valinnantila: h.tila,
                    julkaistavissa: h.julkaistavissa,
                    ehdollisestiHyvaksyttavissa: h.ehdollisestiHyvaksyttavissa,
                    hyvaksyttyVarasijalta: h.hyvaksyttyVarasijalta,
                    hyvaksyPeruuntunut: h.hyvaksyPeruuntunut
                };
            }), {
                headers: {
                    'If-Unmodified-Since': model.valintatapajonoLastModified[valintatapajonoOid]
                }
            }).then(function(response) {
                    var forBreakpoint = response;
                }, function(error) {
                    var forBreakpoint = error;
                });
        };

    }();

    return model;

    function fetchAndPopulateVastaanottoAikarajaMennyt() {
        if ("false" !== SHOW_TILA_HAKIJALLE_IN_SIJOITTELUN_TULOKSET) {
            var hakemuksetOnLadattu = _.size(model.sijoitteluntulosHakijoittain) > 0;
            if (hakemuksetOnLadattu) {
                var kaikkiHakemukset = _.flatten(_.map(model.sijoitteluTulokset.valintatapajonot, function (valintatapajono) {
                    return valintatapajono.hakemukset;
                }));

                var oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon = _.map(_.filter(kaikkiHakemukset, function (h) {
                    return h.vastaanottoTila === "KESKEN" && h.julkaistavissa &&
                        (h.tila === 'HYVAKSYTTY' || h.tila === 'VARASIJALTA_HYVAKSYTTY' || h.tila === 'PERUNUT');
                }), function (relevanttiHakemus) {
                    return relevanttiHakemus.hakemusOid;
                });

                VastaanottoUtil.fetchAndPopulateVastaanottoDeadlineDetailsAsynchronously(model.hakuOid, model.hakukohdeOid, kaikkiHakemukset,
                    oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon, function (eraantyneitaHakemuksia) {
                        model.myohastymistietoLadattu = true;
                        model.eraantyneitaHakemuksia = eraantyneitaHakemuksia;
                    });
            }
        }
    }

    function haeTilaHakijalleTarvitsevilleHakemuksille(nakyvatJononHakemukset, valintatapajonoOid) {
        var oiditHakemuksilleJotkaTarvitsevatTilanHakijalle = _.map(_.filter(nakyvatJononHakemukset, function(h) {
            return h.tilaHakijalleTaytyyLadataPalvelimelta;
        }), function(relevanttiHakemus) {
            relevanttiHakemus.tilaHakijalleTaytyyLadataPalvelimelta = false;
            return relevanttiHakemus.hakemusOid;
        });

        var tilatHakijalleDeferred = $q.defer();
        tilatHakijalleDeferred.promise.then(function(tilaHakijalleTiedot) {
            _.forEach(tilaHakijalleTiedot, function(yksittainenTilaHakijalleTieto) {
                _.forEach(nakyvatJononHakemukset, function(hakemus) {
                    if (hakemus && (hakemus.hakemusOid === yksittainenTilaHakijalleTieto.hakemusOid && hakemus.valintatapajonoOid === yksittainenTilaHakijalleTieto.valintatapajonoOid)) {
                        hakemus.tilaHakijalle = yksittainenTilaHakijalleTieto.tilaHakijalle;
                    }
                });
            });
        });

        if (oiditHakemuksilleJotkaTarvitsevatTilanHakijalle.length > 0) {
            HakemustenVastaanottotilaHakijalle.post({hakuOid: model.hakuOid, hakukohdeOid: model.hakukohdeOid, valintatapajonoOid: valintatapajonoOid},
              angular.toJson(oiditHakemuksilleJotkaTarvitsevatTilanHakijalle),
                  function(result) { tilatHakijalleDeferred.resolve(result); },
                  function(error) { tilatHakijalleDeferred.reject(error); }
            );
        }
    }
}])


    .controller('SijoitteluntulosController', ['$scope', '$modal', 'TallennaValinnat', '$routeParams', '$window', 'Kirjepohjat', 'Latausikkuna', 'HakukohdeModel',
        'SijoitteluntulosModel', 'OsoitetarratSijoittelussaHyvaksytyille', 'Hyvaksymiskirjeet', 'HakukohteelleJalkiohjauskirjeet',
        'Jalkiohjauskirjeet', 'SijoitteluXls', 'AuthService', 'HaeDokumenttipalvelusta', 'LocalisationService','HakuModel', 'Ohjausparametrit', 'HakuUtility', '_', '$log', 'Korkeakoulu', 'HakukohdeNimiService',
        'Kirjeet','UserModel', 'VastaanottoUtil', 'HakemuksenValintatulokset', 'EhdollisenHyvaksymisenEhdot',
        function ($scope, $modal, TallennaValinnat, $routeParams, $window, Kirjepohjat, Latausikkuna, HakukohdeModel,
                                    SijoitteluntulosModel, OsoitetarratSijoittelussaHyvaksytyille, Hyvaksymiskirjeet, HakukohteelleJalkiohjauskirjeet,
                                    Jalkiohjauskirjeet, SijoitteluXls, AuthService, HaeDokumenttipalvelusta, LocalisationService, HakuModel, Ohjausparametrit, HakuUtility, _, $log, Korkeakoulu, HakukohdeNimiService,
                                    Kirjeet, UserModel, VastaanottoUtil, HakemuksenValintatulokset, EhdollisenHyvaksymisenEhdot) {
    "use strict";
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.url = window.url;
    $scope.hakuModel = HakuModel;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.model = SijoitteluntulosModel;
    $scope.korkeakouluService = Korkeakoulu;
    $scope.tilaFilterValue = "";
    $scope.valintaesitysJulkaistavissa = false;
    $scope.ehdollisestiHyvaksyttavissaOlevatOpts = [];

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


     EhdollisenHyvaksymisenEhdot.query(function (result) {
         result.forEach(function(ehto){
             $scope.ehdollisestiHyvaksyttavissaOlevatOpts.push(
                {
                    koodiUri: ehto.koodiUri,
                    nimi: _.findWhere(ehto.metadata, {kieli: 'FI'}).nimi
                });
            });
    });

    $scope.pageSize = 50;

/*
    $scope.updateVastaanottoTila = function (hakemus, valintatapajonoOid) {
        $scope.model.updateVastaanottoTila(hakemus, valintatapajonoOid);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    };
*/

    $scope.showEhdot = function (model, value) {
        if (value == 'hyvaksynnanehdot_muu') {
            model.ehtoInputFields = true;
            model.ehtoEditableInputFields = true;
            model.ehdollisenHyvaksymisenEhtoFI = '';
            model.ehdollisenHyvaksymisenEhtoSV = '';
            model.ehdollisenHyvaksymisenEhtoEN = '';
        } else {
            model.ehtoInputFields = true;
            model.ehtoEditableInputFields = false;
            $scope.ehdollisestiHyvaksyttavissaOlevatOpts.forEach(function(op){
                if(op.koodiUri == value){
                    model.ehdollisenHyvaksymisenEhtoFI = op.nimiFI;
                    model.ehdollisenHyvaksymisenEhtoSV = op.nimiSV;
                    model.ehdollisenHyvaksymisenEhtoEN = op.nimiEN;
                }
            });
        }
    };

    $scope.muokatutHakemukset = [];

    $scope.addMuokattuHakemus = function (hakemus) {
        $scope.muokatutHakemukset.push(hakemus);
        $scope.muokatutHakemukset = _.uniq($scope.muokatutHakemukset, 'hakemusOid');
    };

    $scope.updateHyvaksymiskirjeLahetettyPvm = function (hakemus) {
        if (hakemus.hyvaksymiskirjeLahetetty) {
            hakemus.hyvaksymiskirjeLahetettyPvm = new Date();
        }
        else {
            hakemus.hyvaksymiskirjeLahetettyPvm = null;
        }
        $scope.addMuokattuHakemus(hakemus);
    };

    $scope.validateEhdollisenHyvaksymisenKoodi = function(hakemukset){
        var valid = true;
        hakemukset.forEach(function (hakemus){
            if(hakemus.ehdollisestiHyvaksyttavissa &&
                (
                    (hakemus.ehdollisenHyvaksymisenEhtoKoodi != "" && hakemus.ehdollisenHyvaksymisenEhtoKoodi != "hyvaksynnanehdot_muu") ||
                    (hakemus.ehdollisenHyvaksymisenEhtoKoodi == "hyvaksynnanehdot_muu" && hakemus.ehdollisenHyvaksymisenEhtoFI != undefined &&
                    hakemus.ehdollisenHyvaksymisenEhtoSV != undefined && hakemus.ehdollisenHyvaksymisenEhtoEN != undefined && hakemus.ehdollisenHyvaksymisenEhtoFI != "" &&
                    hakemus.ehdollisenHyvaksymisenEhtoSV != "" && hakemus.ehdollisenHyvaksymisenEhtoEN != "")
                )
            ){
                // ok
            } else {
                valid = false; // not valid row
            }
        });
        return valid;
    };

    $scope.submit = function (valintatapajonoOid) {

        var title = LocalisationService.tl('tallennaMuutokset') || 'Tallenna muutokset.';
        var body = LocalisationService.tl('oletTallentamassaMuutoksia') || 'Olet tallentamassa muutoksia: ';
        var kpl = LocalisationService.tl('kpl') || 'kpl';

        if($scope.validateEhdollisenHyvaksymisenKoodi($scope.muokatutHakemukset)) {
            TallennaValinnat.avaa(title, body + $scope.muokatutHakemukset.length + ' ' + kpl + '.', function (success, failure) {
                $scope.model.updateHakemuksienTila(false, valintatapajonoOid, $scope.muokatutHakemukset, success, failure);
            });
        }
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
    $scope.luoHyvaksymiskirjeetPDF = function(hakemusOids, sijoitteluajoId) {
        var hakukohde = $scope.hakukohdeModel.hakukohde;
        var tag = null;
        if(hakukohde.hakukohdeNimiUri) {
            tag = hakukohde.hakukohdeNimiUri.split('#')[0];
        } else {
            tag = $routeParams.hakukohdeOid;
        }
        Kirjeet.hyvaksymiskirjeet({
            hakuOid: $routeParams.hakuOid,
            hakukohdeOid: $routeParams.hakukohdeOid,
            sijoitteluajoId : sijoitteluajoId,
            hakemusOids: hakemusOids,
            tarjoajaOid: hakukohde.tarjoajaOids[0],
            hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
            hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi,
            tag: tag,
            langcode: HakukohdeNimiService.getOpetusKieliCode(hakukohde),
            templateName: "hyvaksymiskirje"
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
        var muokatutHakemukset = VastaanottoUtil.merkitseMyohastyneeksi(muokattavatHakemukset);
        _.forEach(muokatutHakemukset, $scope.addMuokattuHakemus)
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

            $scope.model.updateHakemuksienTila(true, valintatapajonoOid, $scope.muokatutHakemukset, success, failure);

        });
    };

    $scope.jonoLength = function(length) {
        return LocalisationService.tl('sijoitteluntulos.jonosija') ? LocalisationService.tl('sijoitteluntulos.jonosija') +  " ("+length+")" : 'Jonosija' +  " ("+length+")";
    };

    LocalisationService.getTranslationsForArray($scope.tilaFilterValues).then(function () {
    });

    LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuIlmoittautumisTilat).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.model.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);
    });
    $scope.showEhdollinenHyvaksynta = function() {
        return !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
    };
    $scope.showJalkiohjaus = function() {
        return UserModel.isOphUser ||
            !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri) ||
            !(HakuUtility.isYhteishaku(HakuModel.hakuOid) && HakuUtility.isVarsinainenhaku(HakuModel.hakuOid));
    };
    $scope.enableTulostus = function() {
        return !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri) ||
                UserModel.isOphUser ||
                _.every($scope.model.sijoitteluTulokset.valintatapajonot, 'valintaesitysHyvaksytty');
    };

    $scope.currentHakuIsToinenAsteHaku = function() {
        return isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
    };

    $scope.showCorrectHakemuksenTila = function(hakemuksenTila) {
        if (hakemuksenTila === 'VASTAANOTTANUT_SITOVASTI' &&
            HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri)) return 'VASTAANOTTANUT';
        else return hakemuksenTila;
    };

    UserModel.refreshIfNeeded()
}]);

app.filter('removeUnderscores', function() {
    return function(obj){
        // try to replace only if type is string
        if (typeof obj === 'string'){
            return obj.replace(/_/g, "");
        } else {
            return obj;
        }
    }
});

/**
 * Show a simple arrow with a title when hovered over if the Hakemus has
 * siirtynytToisestaValintatapajonosta as true.
 */
app.directive('siirtynytToisestaValintatapajonostaIndicator', ['LocalisationService', function (LocalisationService) {
    return {
        restrict: 'E',
        scope: {
            hakemus: '='
        },
        link: function ($scope, element, attrs) {
            var siirtynyt = $scope.hakemus.siirtynytToisestaValintatapajonosta;
            $scope.isSiirtynyt = !!siirtynyt;
            $scope.title = LocalisationService.tl('sijoitteluntulos.siirtynyttoisestavalintatapajonosta') || 'Vain siirtynyt toisesta valintatapajonosta';
        },
        template: '<img src="../common/img/icon-up.png" style="cursor: pointer; height: 1em; width: auto;" title="{{title}}" ng-if="isSiirtynyt" />'
    };
}]);
