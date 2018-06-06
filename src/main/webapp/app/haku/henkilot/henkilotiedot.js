var app = angular.module('valintalaskenta');
app.factory('HenkiloTiedotModel', function ($q, AuthService, Hakemus, ValintalaskentaHakemus, HakukohdeNimi,
                                            ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe,
                                            SijoittelunVastaanottotilat, VtsLatestSijoittelunTilat,
                                            ValintakoetuloksetHakemuksittain, HarkinnanvaraisestiHyvaksytty,
                                            HakukohdeAvaimet, HaunTiedot, HakemuksenValintatulokset,
                                            VtsLatestSijoitteluajoHakukohde, HakukohdeAvainTyyppiService,
                                            KoostettuHakemusAdditionalDataForHakemus, R, HenkiloPerustiedot) {
    "use strict";

    function setVastaanottoTilaOptionsToShow(hakutoiveenValintatapajonot) {
        var showSitovasti = false;
        (hakutoiveenValintatapajonot || []).forEach(function (valintatapajono, index) {
            if (valintatapajono.tila === 'HYVAKSYTTY') {
                if (valintatapajono.valintatapajonoPrioriteetti === index + 1) {
                    showSitovasti = true;
                }
                if (valintatapajono.valintatapajonoPrioriteetti === 1) {
                    valintatapajono.showSitovasti = true;
                    valintatapajono.showEhdollisesti = false;
                }
                if (valintatapajono.valintatapajonoPrioriteetti > 1) {
                    valintatapajono.showSitovasti = showSitovasti;
                    valintatapajono.showEhdollisesti = true;
                }
            }
        });
    }

    function getHakuAppHakemus(hakemusOid) {
        return Hakemus.get({oid: hakemusOid}).$promise.then(function (hakemus) {
            var hakutoiveet = [];
            for (var i = 1; hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"]; i++) {
                var harkinnanvarainen = hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];
                var discretionary = hakemus.answers.hakutoiveet["preference" + i + "-Harkinnanvarainen"];

                var hakutoive = {
                    hakukohdeOid: hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"],
                    hakutoiveNumero: i,
                    koulutuksenNimi: hakemus.answers.hakutoiveet["preference" + i + "-Koulutus"],
                    oppilaitos: hakemus.answers.hakutoiveet["preference" + i + "-Opetuspiste"],
                    oppilaitosId: hakemus.answers.hakutoiveet["preference" + i + "-Opetuspiste-id"],
                    hakenutHarkinnanvaraisesti: (harkinnanvarainen || discretionary) === "true"
                };
                hakutoiveet.push(hakutoive);
            }
            return {
                originalHakemus: hakemus,
                hakutoiveet: hakutoiveet
            };
        });
    }

    function getHenkilo(hakemus) {
        return HenkiloPerustiedot.get({henkiloOid: hakemus.originalHakemus.personOid}).$promise
            .then(function (henkilo) {
                return {
                    oid: henkilo.oidHenkilo,
                    sukunimi: henkilo.sukunimi,
                    etunimet: henkilo.etunimet,
                    asiointikieli: (henkilo.asiointiKieli || {}).kieliTyyppi,
                    henkilotunnus: henkilo.hetu
                }
            });
    }

    function valintalaskentaByHakukohdeOid(hakuOid, hakemusOid) {
        return ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}).$promise
            .then(function (valintalaskenta) {
                var valintalaskentaByHakukohdeOid = {};
                valintalaskenta.hakukohteet.forEach(function(hakukohde) {
                    valintalaskentaByHakukohdeOid[hakukohde.oid] = hakukohde.valinnanvaihe;
                });
                return valintalaskentaByHakukohdeOid;
            });
    }

    function harkinnanvaraisuusTilaByHakukohdeOid(hakuOid, hakemusOid) {
        return HarkinnanvaraisestiHyvaksytty.get({hakemusOid: hakemusOid, hakuOid: hakuOid}).$promise
            .then(function (harkinnanvaraisuus) {
                var harkinnanvaraisuusTilaByHakukohdeOid = {};
                harkinnanvaraisuus.forEach(function(harkinnanvarainen) {
                    harkinnanvaraisuusTilaByHakukohdeOid[harkinnanvarainen.hakukohdeOid] = harkinnanvarainen.harkinnanvaraisuusTila;
                });
                return harkinnanvaraisuusTilaByHakukohdeOid;
            });
    }

    function vastaanottotilatByValintatapajonoOid(hakuOid, hakemusOid) {
        return SijoittelunVastaanottotilat.get({hakuOid: hakuOid, hakemusOid: hakemusOid}).$promise
            .then(function (vastaanottotilat) {
                var vastaanottotilatByValintatapajonoOid = {};
                vastaanottotilat.forEach(function (vastaanottotila) {
                    vastaanottotilatByValintatapajonoOid[vastaanottotila.valintatapajonoOid] = vastaanottotila.tila;
                });
                return vastaanottotilatByValintatapajonoOid;
            });
    }

    function tilaHistoriatByValintatapajonoOid(hakuOid, hakemusOid, hakutoiveet) {
        var tilaHistoriatByValintatapajonoOid = {};
        return $q.all(hakutoiveet.map(function (hakutoive) {
            return VtsLatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakutoive.hakukohdeOid,
                hakuOid: hakuOid
            }).$promise.then(function (sijoitteluajo) {
                sijoitteluajo.valintatapajonot.forEach(function (valintatapajono) {
                    valintatapajono.hakemukset.forEach(function (hakemus) {
                        if (hakemus.hakemusOid === hakemusOid) {
                            tilaHistoriatByValintatapajonoOid[valintatapajono.oid] = hakemus.tilaHistoria;
                        }
                    });
                });
            });
        })).then(function () {
            return tilaHistoriatByValintatapajonoOid;
        });
    }

    function logEntriesByValintatapajonoOid(hakuOid, hakemusOid, hakutoiveet) {
        var logEntriesByValintatapajonoOid = {};
        return $q.all(hakutoiveet.map(function (hakutoive) {
            return $q.all(hakutoive.hakutoiveenValintatapajonot.map(function (valintatapajono) {
                return HakemuksenValintatulokset.get({
                    hakemusOid: hakemusOid,
                    hakuOid: hakuOid,
                    hakukohdeOid: hakutoive.hakukohdeOid,
                    valintatapajonoOid: valintatapajono.valintatapajonoOid
                }).$promise.then(function (valintatulokset) {
                    valintatulokset.forEach(function (valintatulos) {
                        logEntriesByValintatapajonoOid[valintatapajono.valintatapajonoOid] = valintatulos.logEntries;
                    });
                });
            }));
        })).then(function () {
            return logEntriesByValintatapajonoOid;
        });
    }

    function getSijoittelu(hakuOid, hakemusOid) {
        return VtsLatestSijoittelunTilat.get({hakemusOid: hakemusOid, hakuOid: hakuOid}).$promise
            .then(function (sijoittelunTilat) {
                var hakutoiveet = sijoittelunTilat.hakutoiveet || [];
                var sijoitteluByHakukohdeOid = {};
                var sijoitteluByValintatapajonoOid = {};
                hakutoiveet.forEach(function (hakutoive) {
                    sijoitteluByHakukohdeOid[hakutoive.hakukohdeOid] = hakutoive.hakutoiveenValintatapajonot;
                    hakutoive.hakutoiveenValintatapajonot.forEach(function (valintatapajono) {
                        sijoitteluByValintatapajonoOid[valintatapajono.valintatapajonoOid] = valintatapajono;
                    });
                });
                return $q.all({
                    tilaHistoriatByValintatapajonoOid: tilaHistoriatByValintatapajonoOid(hakuOid, hakemusOid, hakutoiveet),
                    logEntriesByValintatapajonoOid: logEntriesByValintatapajonoOid(hakuOid, hakemusOid, hakutoiveet)
                }).then(function (o) {
                    return {
                        sijoitteluByHakukohdeOid: sijoitteluByHakukohdeOid,
                        sijoitteluByValintatapajonoOid: sijoitteluByValintatapajonoOid,
                        tilaHistoriatByValintatapajonoOid: o.tilaHistoriatByValintatapajonoOid,
                        logEntriesByValintatapajonoOid: o.logEntriesByValintatapajonoOid
                    };
                });
            });
    }

    function avaimetByHakukohdeOid(hakemus) {
        var avaimetByHakukohdeOid = {};
        return $q.all(hakemus.hakutoiveet.map(function (hakutoive) {
            return HakukohdeAvaimet.get({hakukohdeOid: hakutoive.hakukohdeOid}).$promise
                .then(function (avaimet) {
                    avaimetByHakukohdeOid[hakutoive.hakukohdeOid] = avaimet;
                });
        })).then(function () {
            return avaimetByHakukohdeOid;
        });
    }

    function organizationChecksByHakukohdeOid(hakemus) {
        var organizationChecksByHakukohdeOid = {};
        return $q.all(hakemus.hakutoiveet.map(function (hakutoive) {
            return AuthService.readOrg("APP_VALINTOJENTOTEUTTAMINENKK", hakutoive.oppilaitosId)
                .then(function () {
                    organizationChecksByHakukohdeOid[hakutoive.hakukohdeOid] = true;
                }, function () {
                    organizationChecksByHakukohdeOid[hakutoive.hakukohdeOid] = false;
                });
        })).then(function () {
            return organizationChecksByHakukohdeOid;
        });
    }

    function refresh(hakuOid, hakemusOid) {
        var self = this;
        self.hakemus = {};
        self.henkilo = {};
        self.hakutoiveet = [];
        self.hakuOid = null;
        self.hakuOid = hakuOid;
        self.haku = {};
        self.errors = [];
        self.sijoittelu = {};
        self.hakenutHarkinnanvaraisesti = false;
        self.naytaPistesyotto = false;
        self.lastmodified = null;
        self.valintatapajonoLastModified = {}; // FIXME vaatii valintatuloksen hakemisen uudemmasta VTS:n API:sta

        var hakemusPromise = getHakuAppHakemus(hakemusOid);
        return $q.all({
            haku: HaunTiedot.get({hakuOid: hakuOid}).$promise,
            hakemus: hakemusPromise,
            henkilo: hakemusPromise.then(getHenkilo),
            avaimetByHakukohdeOid: hakemusPromise.then(avaimetByHakukohdeOid),
            organizationChecksByHakukohdeOid: hakemusPromise.then(organizationChecksByHakukohdeOid),
            valintalaskentaByHakukohdeOid: valintalaskentaByHakukohdeOid(hakuOid, hakemusOid),
            harkinnanvaraisuusTilaByHakukohdeOid: harkinnanvaraisuusTilaByHakukohdeOid(hakuOid, hakemusOid),
            sijoittelu: getSijoittelu(hakuOid, hakemusOid),
            vastaanottotilatByValintatapajonoOid: vastaanottotilatByValintatapajonoOid(hakuOid, hakemusOid),
            additionalData: KoostettuHakemusAdditionalDataForHakemus.get({hakemusOid: hakemusOid})
        }).then(function(o) {
            self.haku = o.haku;
            self.hakemus = o.hakemus.originalHakemus;
            self.henkilo = o.henkilo;
            self.sijoittelu = o.sijoittelu.sijoitteluByValintatapajonoOid;
            self.lastmodified = o.additionalData.lastmodified;
            self.hakutoiveet = o.hakemus.hakutoiveet.map(function (h) {
                var avaimet = o.avaimetByHakukohdeOid[h.hakukohdeOid];
                HakukohdeAvainTyyppiService.createAvainTyyppiValues(avaimet, []);
                var osallistuu = o.additionalData.hakukohteittain[h.hakukohdeOid].hakukohteidenOsallistumistiedot[h.hakukohdeOid].valintakokeidenOsallistumistiedot;
                var naytaPistesyotto = avaimet.reduce(function (naytaPistesyotto, a) {
                    return naytaPistesyotto || (osallistuu[a.tunniste] && osallistuu[a.tunniste].osallistumistieto !== "EI_KUTSUTTU");
                }, false);
                var sijoittelu = o.sijoittelu.sijoitteluByHakukohdeOid[h.hakukohdeOid] || [];
                setVastaanottoTilaOptionsToShow(sijoittelu);
                sijoittelu.forEach(function (valintatapajono) {
                    valintatapajono.hakemusOid = hakemusOid;
                    valintatapajono.hakijaOid = self.henkilo.oid;
                    valintatapajono.vastaanottoTila = o.vastaanottotilatByValintatapajonoOid[valintatapajono.valintatapajonoOid];
                    valintatapajono.muokattuVastaanottoTila = valintatapajono.vastaanottoTila;
                    valintatapajono.tilaHistoria = o.sijoittelu.tilaHistoriatByValintatapajonoOid[valintatapajono.valintatapajonoOid];
                    valintatapajono.logEntries = o.sijoittelu.logEntriesByValintatapajonoOid[valintatapajono.valintatapajonoOid];
                });
                return {
                    hakukohdeOid: h.hakukohdeOid,
                    hakutoiveNumero: h.hakutoiveNumero,
                    koulutuksenNimi: h.koulutuksenNimi,
                    oppilaitos: h.oppilaitos,
                    oppilaitosId: h.oppilaitosId,
                    hakemusOid: hakemusOid,
                    hakenutHarkinnanvaraisesti: h.hakenutHarkinnanvaraisesti,
                    additionalData: o.additionalData.hakukohteittain[h.hakukohdeOid].applicationAdditionalDataDTO.additionalData,
                    valintalaskenta: o.valintalaskentaByHakukohdeOid[h.hakukohdeOid],
                    harkinnanvaraisuusTila: o.harkinnanvaraisuusTilaByHakukohdeOid[h.hakukohdeOid],
                    muokattuHarkinnanvaraisuusTila: o.harkinnanvaraisuusTilaByHakukohdeOid[h.hakukohdeOid],
                    sijoittelu: sijoittelu,
                    osallistuu: osallistuu,
                    avaimet: avaimet,
                    naytaPistesyotto: naytaPistesyotto,
                    hasDoneOrganizationCheck: true,
                    showAsLink: o.organizationChecksByHakukohdeOid[h.hakukohdeOid]
                };
            });
            self.hakenutHarkinnanvaraisesti = self.hakutoiveet.reduce(function (hakenutHarkinnanvaraisesti, hakutoive) {
                return hakenutHarkinnanvaraisesti || hakutoive.hakenutHarkinnanvaraisesti;
            }, false);
            self.naytaPistesyotto = self.hakutoiveet.reduce(function (naytaPistesyotto, hakutoive) {
                return naytaPistesyotto || hakutoive.naytaPistesyotto;
            }, false);
        }, function(error) {
            self.errors.push(error);
        });
    }

    function tallennaPisteet() {
        var mergedAdditionalData = R.mergeAll(R.map(function (h) { return h.additionalData; }, this.hakutoiveet));
        return KoostettuHakemusAdditionalDataForHakemus.put(
            {
                hakemusOid: this.hakemus.oid
            },
            {
                lastmodified: this.lastmodified,
                hakemus: {
                    oid: this.hakemus.oid,
                    personOid: this.henkilo.oid,
                    additionalData: mergedAdditionalData
                }
            }
        );
    }

    return {
        hakemus: {},
        henkilo: {},
        hakutoiveet: [],
        hakuOid: null,
        haku: {},
        errors: [],
        sijoittelu: {},
        hakenutHarkinnanvaraisesti: false,
        naytaPistesyotto: false,
        lastmodified: null,
        valintatapajonoLastModified: {},

        refresh: refresh,
        tallennaPisteet: tallennaPisteet
    };
});

angular.module('valintalaskenta').
    controller('HenkiloTiedotController', ['$q', '$scope', '$modal', '$routeParams', 'ParametriService', 'Latausikkuna', 'Jalkiohjauskirjepohjat',
        'Jalkiohjauskirjeet', 'HenkiloTiedotModel', 'AuthService', 'Pohjakoulutukset', 'Ilmoitus', 'IlmoitusTila','HakuModel', '$filter', 'Korkeakoulu',
        '$window', 'R',
        function ($q, $scope, $modal, $routeParams, ParametriService, Latausikkuna, Jalkiohjauskirjepohjat,
                  Jalkiohjauskirjeet, HenkiloTiedotModel, AuthService, Pohjakoulutukset, Ilmoitus, IlmoitusTila,HakuModel,$filter, Korkeakoulu,
                  $window, R) {
    "use strict";

    $scope.model = HenkiloTiedotModel;
    $scope.hakutoiveetLoadedPromise = $scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid);
    $scope.url = window.url;
    $scope.hakuModel = HakuModel;
    $scope.korkeakoulu = Korkeakoulu;

    $scope.hakuaVastaavaJalkiohjauskirjeMuotti = function() {
	    return "jalkiohjauskirje";
    };
    $scope.muodostaJalkiohjauskirje = function () {
        var isKorkeakoulu = $scope.korkeakoulu.isKorkeakoulu($scope.hakuModel.hakuOid.kohdejoukkoUri);
        var applicationPeriod = $routeParams.hakuOid;
        var hakemusOid = $scope.model.hakemus.oid;
        var asiointikieli = $scope.model.henkilo.asiointikieli;
        var langcode = "FI";
        if(asiointikieli !== undefined && asiointikieli.toUpperCase() === "RUOTSI") {
			langcode = "SV";
        }
        var templateName = $scope.hakuaVastaavaJalkiohjauskirjeMuotti();
        var otsikko = "";
        var toimintoNimi = "";
        var latausikkunaTeksti = "";
        if(isKorkeakoulu) {
            otsikko = "Ei-hyväksyttyjen kirjeet";
            toimintoNimi = "Muodosta ei-hyväksyttyjen kirjeet";
            latausikkunaTeksti = "Ei-hyväksyttyjen kirjeet";
        } else {
            otsikko = "Jälkiohjauskirjeet";
            toimintoNimi = "Muodosta jälkiohjauskirjeet";
            latausikkunaTeksti = "Jälkiohjauskirjeet";
        }

        var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                    	otsikko: otsikko,
                    	toimintoNimi: toimintoNimi,
                    	toiminto: function(sisalto) {
                    		Jalkiohjauskirjeet.post({
					        	hakuOid: $routeParams.hakuOid,
					        	applicationPeriod: applicationPeriod, templateName: templateName}, {hakemusOids: [hakemusOid],
					        	letterBodyText: sisalto, languageCode: langcode} , function (id) {
					            Latausikkuna.avaa(id, latausikkunaTeksti, "");
					        }, function () {
					            
					        });
                    	},
                        showDateFields: true,
                        hakuOid: $routeParams.hakuOid,
                        pohjat: function() {
                        	return Jalkiohjauskirjepohjat.get({templateName: templateName, languageCode: langcode, applicationPeriod: applicationPeriod});
                        }
                    };
                }
            }
        });
    };

    $scope.pohjakoulutukset = Pohjakoulutukset;

    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
    });

    $scope.isValinnanvaiheVisible = function (index, valinnanvaiheet) {
        var orderBy = $filter('orderBy');
        valinnanvaiheet = orderBy(valinnanvaiheet, 'jarjestysnumero', true);
        for (var i = 0; i < valinnanvaiheet.length; i++) {
            if (valinnanvaiheet[i].valintatapajonot.length > 0) {
                if (index === i) {
                    return true;
                } else {
                    return false;
                }

            }
        }
    };

    $scope.tallennaPisteet = function () {
        $scope.model.tallennaPisteet().then(function (response) {
            $scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid);
            var ilmoitusteksti = "";
            if(R.isEmpty(response.data)) {
                ilmoitusteksti = "Pisteet tallennettu onnistuneesti.";
            } else {
                ilmoitusteksti = "Hakemuksella oli uudempia pistetietoja. Ole hyvä ja yritä tallentaa uudelleen.";
            }
            Ilmoitus.avaa("Tallennus onnistui", ilmoitusteksti, IlmoitusTila.INFO, function() {
                $window.location.reload();
            });
        }, function () {
            Ilmoitus.avaa("Tallennus epäonnistui", "Pisteiden tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.", IlmoitusTila.ERROR, function() {
                $window.location.reload();
            });
        });
    };

    $scope.valintalaskentaKerrallaHakukohteille = function() {
        var hakukohteet = $scope.model.hakutoiveet.map(function (hakutoive) {
           return hakutoive.hakukohdeOid;
        });
        var erillishaku = HakuModel.hakuOid.erillishaku;
        if(hakukohteet.length > 0) {
            $modal.open({
                backdrop: 'static',
                templateUrl: '../common/modaalinen/hakutoiveetseurantaikkuna.html',
                controller: SeurantaIkkunaCtrl,
                size: 'lg',
                resolve: {
                    oids: function () {
                        return {
                            hakuOid: $routeParams.hakuOid,
                            nimentarkennus: "",
                            erillishaku: erillishaku,
                            tyyppi: "HAKUKOHDE",
                            hakukohteet: hakukohteet
                        };
                    }
                }
            });
        } else {
        	Ilmoitus.avaa("Ei hakutoiveta", "Hakijalle ei ole hakutoiveita.", IlmoitusTila.ERROR);
        }
    };

    $scope.showMuodostaJalkiohjauskirje = false;
    ParametriService($routeParams.hakuOid).then(function(privileges) {
        $scope.showMuodostaJalkiohjauskirje = privileges.valintalaskenta;
    });
}]);
