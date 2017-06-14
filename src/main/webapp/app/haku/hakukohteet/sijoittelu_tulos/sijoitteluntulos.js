angular.module('valintalaskenta')
.factory('SijoitteluntulosModel', [ '$q', 'Ilmoitus', 'LatestSijoitteluajoHakukohde', 'VtsLatestSijoitteluajoHakukohde', 'VastaanottoTila', 'ValintaesityksenHyvaksyminen',
        '$timeout', 'HakukohteenValintatuloksetIlmanTilaHakijalleTietoa', 'ValinnanTulos', 'Valinnantulokset', 'VastaanottoUtil', 'HakemustenVastaanottotilaHakijalle',
        'IlmoitusTila', 'HaunTiedot', '_', 'ngTableParams', 'FilterService', '$filter', 'HenkiloPerustietosByHenkiloOidList', 'ErillishakuHyvaksymiskirjeet', 'Lukuvuosimaksut', 'HakemusEligibilities', 'VtsSijoittelunTulos',
        function ($q, Ilmoitus, LatestSijoitteluajoHakukohde, VtsLatestSijoitteluajoHakukohde, VastaanottoTila, ValintaesityksenHyvaksyminen,
                  $timeout, HakukohteenValintatuloksetIlmanTilaHakijalleTietoa, ValinnanTulos, Valinnantulokset, VastaanottoUtil, HakemustenVastaanottotilaHakijalle,
                  IlmoitusTila, HaunTiedot, _, ngTableParams, FilterService, $filter, HenkiloPerustietosByHenkiloOidList, ErillishakuHyvaksymiskirjeet, Lukuvuosimaksut, HakemusEligibilities, VtsSijoittelunTulos) {
    "use strict";

    var useVtsData = READ_FROM_VALINTAREKISTERI === "true";

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
        valintatapajono.hakemukset.sort(function(a, b) {
           if (a.jonosija === b.jonosija) {
               return a.tasasijaJonosija - b.tasasijaJonosija;
           }  else {
               return a.jonosija - b.jonosija;
           }
        });
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
        hakemus.vastaanottoTila = "KESKEN";
        hakemus.muokattuVastaanottoTila = "KESKEN";
        hakemus.muokattuIlmoittautumisTila = "EI_TEHTY";
        hakemus.tilaHakijalle = "KESKEN";
        if (!valintatulos) {
            return;
        }

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
        hakemus.ehtoEditableInputFields = (valintatulos.ehdollisenHyvaksymisenEhtoKoodi == "muu");
        hakemus.ehtoInputFields = valintatulos.ehdollisestiHyvaksyttavissa;
        hakemus.ehdollisenHyvaksymisenEhtoKoodi = valintatulos.ehdollisenHyvaksymisenEhtoKoodi;
        hakemus.ehdollisenHyvaksymisenEhtoFI = valintatulos.ehdollisenHyvaksymisenEhtoFI;
        hakemus.ehdollisenHyvaksymisenEhtoSV = valintatulos.ehdollisenHyvaksymisenEhtoSV;
        hakemus.ehdollisenHyvaksymisenEhtoEN = valintatulos.ehdollisenHyvaksymisenEhtoEN;
        hakemus.hyvaksyttyVarasijalta = valintatulos.hyvaksyttyVarasijalta;
        hakemus.read = valintatulos.read;
        hakemus.hyvaksyPeruuntunut = valintatulos.hyvaksyPeruuntunut;
        hakemus.hyvaksymiskirjeLahetetty = valintatulos.hyvaksymiskirjeLahetetty || null;
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

		var createSijoittelunHakijaOidArray = function(sijoitteluTulokset) {
            return _.reject(_.uniq(_.flatten(_.map(
                sijoitteluTulokset.valintatapajonot, function(jono) {
                    return _.map(jono.hakemukset, function(hakemus) {
                        return hakemus.hakijaOid;
                    });
                }
            ))), function(hakijaOid) {return _.isEmpty(hakijaOid)});
        };

		var enrichWithValintatulokset = function(results) {
        (results.sijoittelunTulokset.valintatapajonot || []).forEach(function (valintatapajono) {
            valintatapajono.hakemukset.forEach(function (hakemus) {
                enrichHakemusWithValintatulos(hakemus, _.find(results.valintatulokset, function (v) {
                    return v.valintatapajonoOid === valintatapajono.oid && v.hakemusOid === hakemus.hakemusOid;
                }));
            });
        });
    };

		var sijoittelunTuloksetPromise = function(hakuOid, hakukohdeOid, valintatapajonoLastModified) {
        var fromVts = VtsSijoittelunTulos.get({
            hakukohdeOid: hakukohdeOid,
            hakuOid: hakuOid
          }).$promise.catch(function(vtsError) {
              if (vtsError.status === 404) {
                  console.log('Ei löytynyt sijoitteluajoa valintarekisteristä. hakuOid', hakuOid, 'hakukohdeOid', hakukohdeOid);
                  return { valintatapajonot: [] };
              }
              return $q.reject(vtsError);
            }).then(function (results) {
            (results.sijoittelunTulokset.valintatapajonot || []).forEach(function(valintatapajono) {
               valintatapajonoLastModified[valintatapajono.oid] = results.lastModified;
            });
            var kirjeLahetetty = results.kirjeLahetetty.reduce(function(acc, kirje) {
                acc[kirje.henkiloOid] = new Date(kirje.lahetetty);
                return acc;
            }, {});
            results.valintatulokset.forEach(function (v) {
                v.logEntries = [];
                v.hakijaOid = v.henkiloOid;
                v.tila = v.vastaanottotila;
                v.tilaHakijalle = null;
                v.ilmoittautumisTila = v.ilmoittautumistila;
                v.hyvaksymiskirjeLahetetty = kirjeLahetetty[v.henkiloOid];
            });
            enrichWithValintatulokset(results);
            return results;
        });
        if (useVtsData) {
            return fromVts;
        } else {
            return $q.all({
                sijoittelunTulokset: LatestSijoitteluajoHakukohde.get({
                    hakukohdeOid: hakukohdeOid,
                    hakuOid: hakuOid
                }).$promise,
                valintatulokset: HakukohteenValintatuloksetIlmanTilaHakijalleTietoa.get({
                    hakukohdeOid: hakukohdeOid,
                    hakuOid: hakuOid
                }).$promise
            }).then(function (results) {
                enrichWithValintatulokset(results);
                fromVts.then(function(sijoittelunTulosFromVts) {
                    (results.sijoittelunTulokset.valintatapajonot || []).forEach(function(v) {
                        var vtsJono = _.find(sijoittelunTulosFromVts.sijoittelunTulokset.valintatapajonot, function(vv) {
                            return vv.oid === v.oid;
                        });
                        Valinnantulokset.compareSijoitteluOldAndNewVtsResponse(v, vtsJono.hakemukset);
                    });
                }, function(error) {
                    console.log(error);
                });
                return results;
            });
        }
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
            model.myohastymistietoLadattu = SHOW_TILA_HAKIJALLE_IN_SIJOITTELUN_TULOKSET === "false";
            model.eraantyneitaHakemuksia = false;
            model.valintatapajonoLastModified = {};

            HaunTiedot.get({hakuOid: hakuOid}, function(resultWrapper) {
                model.haku = resultWrapper.result;
            });
            $q.all([
              sijoittelunTuloksetPromise(hakuOid, hakukohdeOid, model.valintatapajonoLastModified).then(function(tulokset) {
                  var hakijaOidArray = createSijoittelunHakijaOidArray(tulokset.sijoittelunTulokset);
                  if(hakijaOidArray && 0 < hakijaOidArray.length) {
                      return HenkiloPerustietosByHenkiloOidList.post(
                        createSijoittelunHakijaOidArray(tulokset.sijoittelunTulokset)).$promise.then(function(henkiloPerustiedot) {
                            tulokset.henkilot = _.map(henkiloPerustiedot, function(henkilo) {
                                return {
                                    oid : henkilo.oidHenkilo,
                                    etunimi : henkilo.etunimet,
                                    sukunimi : henkilo.sukunimi
                                }
                            });
                            return tulokset;
                        }
                      );
                  } else {
                      return tulokset;
                  }
              }),
              HakemusEligibilities.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}).$promise
            ])
            .then(function(o) {
                var tulokset = o[0];
                var eligibilities = o[1];
                var lukuvuosimaksut = o[0].lukuvuosimaksut;
                model.valintaesitys = tulokset.valintaesitys;
                if (tulokset.sijoittelunTulokset.sijoitteluajoId) {
                    model.latestSijoitteluajo.sijoitteluajoId = tulokset.sijoittelunTulokset.sijoitteluajoId;
                    model.sijoitteluTulokset = tulokset.sijoittelunTulokset;
                    model.henkilot = tulokset.henkilot;
                    model.sijoitteluTulokset.valintatapajonot.forEach(function (valintatapajono, index) {
                        valintatapajono.index = index;
                        valintatapajono.valittu = true;
                        var hakemuserittely = createHakemuserittely(valintatapajono);
                        model.hakemusErittelyt.push(hakemuserittely);
                        calculateSijat(valintatapajono);
                        valintatapajono.hakemukset.forEach(function (hakemus) {
                            var hakija = _.find(model.henkilot, function(henkilo) { return henkilo.oid == hakemus.hakijaOid });
                            if(hakija) {
                                hakemus.etunimi = hakija.etunimi;
                                hakemus.sukunimi = hakija.sukunimi;
                            } else {
                                console.log("Hakijan " + hakemus.hakijaOid + " nimeä ei löytynyt oppijanumerorekisteristä.")
                            }
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
                            hakemus.isMaksuvelvollinen = _.indexOf(eligibilities, hakemus.hakemusOid) !== -1
                            if(hakemus.isMaksuvelvollinen) {
                                var lukuvuosimaksu = _.find(lukuvuosimaksut, {"personOid": hakemus.hakijaOid})
                                if(lukuvuosimaksu) {
                                    hakemus.maksuntila = lukuvuosimaksu.maksuntila
                                    hakemus.muokattuMaksuntila = lukuvuosimaksu.maksuntila
                                } else {
                                    hakemus.maksuntila = "MAKSAMATTA";
                                    hakemus.muokattuMaksuntila = "MAKSAMATTA";
                                }
                            }
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
            }).then(fetchAndPopulateVastaanottoAikarajaMennyt)
                .catch(function(error) { error.data ? model.errors.push(error.data.message) : model.errors.push(error); });
        };

        //refresh if haku or hakukohde has changed
        this.refreshIfNeeded = function (hakuOid, hakukohdeOid, isHakukohdeChanged) {
        	if(hakukohdeOid && hakuOid) {
	            if (model.hakuOid !== hakuOid || model.hakukohdeOid !== hakukohdeOid || isHakukohdeChanged) {
	                model.refresh(hakuOid, hakukohdeOid);
	            }
        	}
        };

        this.muokattuHakemusToLukuvuosimaksu = function(hakemus) {
            return {
                personOid: hakemus.hakijaOid,
                maksuntila: hakemus.muokattuMaksuntila
            };
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
                    hyvaksymiskirjeLahetetty: hakemus.hyvaksymiskirjeLahetetty,
                    read: hakemus.read
                };
            };
        };

        this.reportSuccessfulSave = function(muokatutHakemukset) {
            return function() {
                return muokatutHakemukset.length + " muutosta tallennettu.";
            }
        };

        this.reportFailedSave = function(muokatutHakemukset) {
            return function(error) {
                var errorCount = error.data.statuses.length;
                var errorMsg = errorCount + "/" + muokatutHakemukset.length + " hakemuksen päivitys epäonnistui. ";
                if (error.data.statuses.filter(function(status) { return status.status === 409; }).length > 0) {
                    errorMsg += "Tietoihin on tehty samanaikaisia muutoksia, päivitä sivu ja yritä uudelleen";
                } else {
                    errorMsg += "Yritä uudelleen tai ota yhteyttä ylläpitoon.";
                }
                var errorRows = _.map(error.data.statuses, function(status) { return status.message; });
                return $q.reject({
                    message: errorMsg,
                    errorRows: errorRows
                });
            }
        };

        this.updateHakemuksienTila = function (jononHyvaksynta, valintatapajonoOid, uiMuokatutHakemukset, uiMuokatutMaksuntilat) {
            var jonoonLiittyvat = _.chain(model.sijoitteluTulokset.valintatapajonot)
                .filter(function(valintatapajono) {
                    return valintatapajono.oid === valintatapajonoOid;
                })
                .map(function(valintatapajono) {
                    return valintatapajono.hakemukset;
                })
                .flatten()
                .value();
            var tallennaMuokatutHakemukset = function() {
                if (jononHyvaksynta) {
                    jonoonLiittyvat.forEach(function(hakemus) {
                        hakemus.julkaistavissa = true;
                    });
                    return model.merkitseJonoHyvaksytyksi(jonoonLiittyvat, valintatapajonoOid);
                } else {
                    var muokatutHakemuksetOids = _.pluck(uiMuokatutHakemukset, 'hakemusOid');
                    var muokatutHakemukset = _.filter(jonoonLiittyvat, function(hakemus) {
                       return _.contains(muokatutHakemuksetOids, hakemus.hakemusOid);
                    });
                    if(muokatutHakemukset.length > 0) {
                        return model.updateVastaanottoTila(muokatutHakemukset, valintatapajonoOid);
                    } else {
                        return $q.resolve();
                    }

                }
            };

            if(_.isEmpty(uiMuokatutMaksuntilat)) {
                return tallennaMuokatutHakemukset();
            } else {
                var lukuvuosimaksut = _.map(uiMuokatutMaksuntilat, this.muokattuHakemusToLukuvuosimaksu);
                return Lukuvuosimaksut.post({hakukohdeOid: model.hakukohdeOid}, lukuvuosimaksut).then(
                    tallennaMuokatutHakemukset,
                    this.reportFailedSave(lukuvuosimaksut)
                );
            }
        };

        this.merkitseJonoHyvaksytyksi = function (muokatutHakemukset, valintatapajonoOid) {
            model.errors.length = 0;
            var tilaParams = {
                hakuOid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                hyvaksyttyJonoOid: valintatapajonoOid,
                selite: "Jonon valintaesityksen hyväksyminen"
            };

            var tilaObj = _.map(muokatutHakemukset, this.muokattuHakemusToServerRequestObject(valintatapajonoOid));
            return ValintaesityksenHyvaksyminen.post(tilaParams, tilaObj).$promise.then(
                this.reportSuccessfulSave(muokatutHakemukset),
                this.reportFailedSave(muokatutHakemukset)
            );
        };


        this.updateVastaanottoTila = function (muokatutHakemukset, valintatapajonoOid) {
            model.errors.length = 0;
            var tilaParams = {
                hakuOid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                hyvaksyttyJonoOid: "",
                selite: "Massamuokkaus"
            };
            var muuttuneetHyvaksymiskirjeet = muokatutHakemukset
                .map(function(hakemus) {
                    return {
                        henkiloOid: hakemus.hakijaOid,
                        hakukohdeOid: model.hakukohdeOid,
                        lahetetty: hakemus.hyvaksymiskirjeLahetetty
                    };
                });
            var valinnantilanMuutokset = _.map(muokatutHakemukset, function(h) {
                return {
                    hakukohdeOid: model.hakukohdeOid,
                    valintatapajonoOid: valintatapajonoOid,
                    hakemusOid: h.hakemusOid,
                    henkiloOid: h.hakijaOid,
                    vastaanottotila: h.muokattuVastaanottoTila,
                    ilmoittautumistila: h.muokattuIlmoittautumisTila,
                    valinnantila: h.tila,
                    julkaistavissa: h.julkaistavissa,
                    ehdollisestiHyvaksyttavissa: h.ehdollisestiHyvaksyttavissa,
                    ehdollisenHyvaksymisenEhtoKoodi: h.ehdollisenHyvaksymisenEhtoKoodi,
                    ehdollisenHyvaksymisenEhtoFI: h.ehdollisenHyvaksymisenEhtoFI,
                    ehdollisenHyvaksymisenEhtoSV: h.ehdollisenHyvaksymisenEhtoSV,
                    ehdollisenHyvaksymisenEhtoEN: h.ehdollisenHyvaksymisenEhtoEN,
                    hyvaksyttyVarasijalta: h.hyvaksyttyVarasijalta,
                    hyvaksyPeruuntunut: h.hyvaksyPeruuntunut
                };
            });
            var tilaObj = _.map(muokatutHakemukset, this.muokattuHakemusToServerRequestObject(valintatapajonoOid));

            var reportSuccessfulSave = this.reportSuccessfulSave;
            var reportFailedSave = this.reportFailedSave;
            var p = $q.all([
                ValinnanTulos.patch(
                    valintatapajonoOid,
                    valinnantilanMuutokset,
                    {headers: {'If-Unmodified-Since': model.valintatapajonoLastModified[valintatapajonoOid]}}
                ),
                ErillishakuHyvaksymiskirjeet.post({}, muuttuneetHyvaksymiskirjeet).$promise
            ]);
            if (READ_FROM_VALINTAREKISTERI === "true") {
                return p.then(
                    function(o) {
                        var statuses = o[0].data;
                        if (statuses.length === 0) {
                            return valinnantilanMuutokset.length + " muutosta tallennettu.";
                        } else {
                            return reportFailedSave(valinnantilanMuutokset)({data: {statuses: statuses}});
                        }
                    },
                    function(error) {
                        if (error.data.error) {
                            return $q.reject({
                                message: error.data.error,
                                errorRows: []
                            });
                        } else {
                            return reportFailedSave(valinnantilanMuutokset)({data: {statuses: error.data}});
                        }
                    }
                );
            } else {
                return VastaanottoTila.post(tilaParams, tilaObj).$promise.then(
                    reportSuccessfulSave(muokatutHakemukset),
                    reportFailedSave(muokatutHakemukset)
                );
            }
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
    .controller('SijoitteluntulosController', [
        '$scope',
        '$modal',
        'TallennaValinnat',
        '$routeParams',
        '$window',
        'Kirjepohjat',
        'Latausikkuna',
        'HakukohdeModel',
        'SijoitteluntulosModel',
        'OsoitetarratSijoittelussaHyvaksytyille',
        'Hyvaksymiskirjeet',
        'HakukohteelleJalkiohjauskirjeet',
        'Jalkiohjauskirjeet',
        'SijoitteluXls',
        'AuthService',
        'HaeDokumenttipalvelusta',
        'LocalisationService',
        'HakuModel',
        'Ohjausparametrit',
        'HakuUtility',
        '_',
        '$log',
        'Korkeakoulu',
        'HakukohdeNimiService',
        'Kirjeet',
        'UserModel',
        'VastaanottoUtil',
        'HakemuksenValintatulokset',
        'EhdollisenHyvaksymisenEhdot',
        'valinnantuloksenHistoriaService',
        '$q',
        'Valintaesitys',
        function ($scope,
                  $modal,
                  TallennaValinnat,
                  $routeParams,
                  $window,
                  Kirjepohjat,
                  Latausikkuna,
                  HakukohdeModel,
                  SijoitteluntulosModel,
                  OsoitetarratSijoittelussaHyvaksytyille,
                  Hyvaksymiskirjeet,
                  HakukohteelleJalkiohjauskirjeet,
                  Jalkiohjauskirjeet,
                  SijoitteluXls,
                  AuthService,
                  HaeDokumenttipalvelusta,
                  LocalisationService,
                  HakuModel,
                  Ohjausparametrit,
                  HakuUtility,
                  _,
                  $log,
                  Korkeakoulu,
                  HakukohdeNimiService,
                  Kirjeet,
                  UserModel,
                  VastaanottoUtil,
                  HakemuksenValintatulokset,
                  EhdollisenHyvaksymisenEhdot,
                  valinnantuloksenHistoriaService,
                  $q,
                  Valintaesitys) {
    "use strict";
    $scope.readFromVts = READ_FROM_VALINTAREKISTERI === 'true';
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.url = window.url;
    $scope.hakuModel = HakuModel;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.model = SijoitteluntulosModel;
    $scope.korkeakouluService = Korkeakoulu;
    $scope.isKorkeakoulu = false;
    $scope.tilaFilterValue = "";
    $scope.valintaesitysJulkaistavissa = false;
    $scope.ehdollisestiHyvaksyttavissaOlevatOpts = [];
    $scope.hyvaksymiskirjeLahetettyCheckbox = {};
    $scope.userModelPromise = UserModel.refreshIfNeeded();
    $scope.hakuModelPromise = $scope.hakuModel.promise;
    $scope.enableTulostus = function() {return false;};

    $scope.$watch('model.valintaesitys', function () {
      $q.all([
        $scope.userModelPromise,
        $scope.hakuModelPromise
      ]).then(function() {
        var isEnableTulostus = !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri) || UserModel.isOphUser || _.every($scope.model.valintaesitys, 'hyvaksytty');
        $scope.enableTulostus = function() {return isEnableTulostus;};
      })
    });

    $scope.$watch('model.sijoitteluTulokset.valintatapajonot', function () {
        ($scope.model.sijoitteluTulokset.valintatapajonot || []).forEach(function (valintatapajono) {
            valintatapajono.hakemukset.forEach(function (hakemus) {
                $scope.hyvaksymiskirjeLahetettyCheckbox[hakemus.hakijaOid] =
                    $scope.hyvaksymiskirjeLahetettyCheckbox[hakemus.hakijaOid] || !!hakemus.hyvaksymiskirjeLahetetty;
            });
        });
    });

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

    $scope.hakuModelPromise.then(function(haku) {
        if (haku.korkeakoulu) {
            $scope.valintaesitysJulkaistavissa = true;
            $scope.isKorkeakoulu = true;
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
    $scope.hakemuksenMuokattuMaksunTilat = [
        {value: "MAKSAMATTA", text_prop: "sijoitteluntulos.maksuntila.maksamatta", default_text:"Maksamatta"},
        {value: "MAKSETTU", text_prop: "sijoitteluntulos.maksuntila.maksettu", default_text:"Maksettu"},
        {value: "VAPAUTETTU", text_prop: "sijoitteluntulos.maksuntila.vapautettu", default_text:"Vapautettu"}
    ];
     EhdollisenHyvaksymisenEhdot.query(function (result) {
         result.forEach(function(ehto){
             $scope.ehdollisestiHyvaksyttavissaOlevatOpts.push(
                {
                    koodiUri: ehto.koodiArvo,
                    nimi: _.findWhere(ehto.metadata, {kieli: 'FI'}).nimi,
                    nimiFI: _.findWhere(ehto.metadata, {kieli: 'FI'}).nimi,
                    nimiSV: _.findWhere(ehto.metadata, {kieli: 'SV'}).nimi,
                    nimiEN: _.findWhere(ehto.metadata, {kieli: 'EN'}).nimi
                });
            });
    });

    $scope.pageSize = 50;

    $scope.showEhdot = function (model, value) {
        if (value == 'muu') {
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
    $scope.muokatutMaksuntilat = [];

    $scope.addMuokattuHakemus = function (hakemus) {
        $scope.muokatutMaksuntilat.push(hakemus);
        $scope.muokatutMaksuntilat = _.uniq($scope.muokatutMaksuntilat, 'hakemusOid');
        $scope.muokatutMaksuntilat = _.filter($scope.muokatutMaksuntilat, function(h) {
            return h.maksuntila !== h.muokattuMaksuntila
        });
        $scope.muokatutHakemukset.push(hakemus);
        $scope.muokatutHakemukset = _.uniq($scope.muokatutHakemukset, 'hakemusOid');
    };

    $scope.openValinnantuloksenHistoriaModal = function(valintatapajonoOid, hakemusOid) {
        $modal.open({
            templateUrl: 'vtsLogModal.html',
            controller: 'ValinnantuloksenHistoriaModalController',
            size: 'lg',
            resolve: {
                historia: function() {
                    return valinnantuloksenHistoriaService.get(valintatapajonoOid, hakemusOid);
                }
            }
        });
    };

    $scope.updateHyvaksymiskirjeLahetettyPvm = function (hakemus) {
        hakemus.hyvaksymiskirjeLahetetty = $scope.hyvaksymiskirjeLahetettyCheckbox[hakemus.hakijaOid] ? new Date() : null;
        $scope.addMuokattuHakemus(hakemus);
    };

    $scope.submit = function (valintatapajonoOid) {

        var title = LocalisationService.tl('tallennaMuutokset') || 'Tallenna muutokset.';
        var body = LocalisationService.tl('oletTallentamassaMuutoksia') || 'Olet tallentamassa muutoksia: ';
        var kpl = LocalisationService.tl('kpl') || 'kpl';

        var reload = document.location.reload.bind(document.location);
        TallennaValinnat.avaa(title, body + $scope.muokatutHakemukset.length + ' ' + kpl + '.', function() {
            return $scope.model.updateHakemuksienTila(false, valintatapajonoOid, $scope.muokatutHakemukset, $scope.muokatutMaksuntilat);
        }).then(reload, reload);
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
        var valintatapajono = _.find($scope.model.sijoitteluTulokset.valintatapajonot, function(valintatapajono) {
            return valintatapajono.oid === valintatapajonoOid;
        });
        var hakemuksiaInJono = valintatapajono.hakemukset.length;
        var reload = document.location.reload.bind(document.location);
        TallennaValinnat.avaa(
            "Hyväksy jonon valintaesitys",
            'Olet hyväksymässä muutoksia jonosta "' + valintatapajono.nimi + '": ' + hakemuksiaInJono + ' kpl.',
            function () {
                var hyvaksy = function() {
                    return Valintaesitys.hyvaksy(valintatapajonoOid).then(
                        function () {
                            return "Valintaesitys hyväksytty";
                        }, function (response) {
                            console.log(response);
                            var msg = "Valintaesityksen hyväksyntä epäonnistui";
                            if (response.data && response.data.error) {
                                msg = response.data.error;
                            }
                            return $q.reject({
                                message: msg,
                                errorRows: []
                            });
                        });
                };
                if (READ_FROM_VALINTAREKISTERI === "true") {
                    return $scope.model.updateHakemuksienTila(false, valintatapajonoOid, $scope.muokatutHakemukset, $scope.muokatutMaksuntilat)
                        .then(hyvaksy);
                } else {
                    var p = $scope.model.updateHakemuksienTila(true, valintatapajonoOid, $scope.muokatutHakemukset, $scope.muokatutMaksuntilat);
                    p.then(hyvaksy);
                    return p;
                }
            }
        ).then(reload, reload);
    };

    $scope.jonoLength = function(length) {
        return LocalisationService.tl('sijoitteluntulos.jonosija') ? LocalisationService.tl('sijoitteluntulos.jonosija') +  " ("+length+")" : 'Jonosija' +  " ("+length+")";
    };

    $q.all([
      LocalisationService.getTranslationsForArray($scope.tilaFilterValues),
      LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuIlmoittautumisTilat),
      LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuMaksunTilat)
    ]).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.model.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid)
    })

    $scope.showEhdollinenHyvaksynta = function() {
        return !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
    };
    $scope.showJalkiohjaus = function() {
        return UserModel.isOphUser ||
            !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri) ||
            !(HakuUtility.isYhteishaku(HakuModel.hakuOid) && HakuUtility.isVarsinainenhaku(HakuModel.hakuOid));
    };

    $scope.currentHakuIsToinenAsteHaku = function() {
        return isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
    };

    $scope.showCorrectHakemuksenTila = function(hakemuksenTila) {
        if (hakemuksenTila === 'VASTAANOTTANUT_SITOVASTI' &&
            HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri)) return 'VASTAANOTTANUT';
        else return hakemuksenTila;
    };


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
