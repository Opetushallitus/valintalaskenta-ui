app.factory('HenkiloTiedotModel', function ($q, Hakemus, ValintalaskentaHakemus, HakukohdeNimi,
                                            ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe,
                                            SijoittelunVastaanottotilat, LatestSijoittelunTilat,
                                            ValintakoetuloksetHakemuksittain, HarkinnanvaraisestiHyvaksytty,
                                            HakukohdeAvaimet, HakemusAdditionalData, HaunTiedot, HakemuksenValintatulokset,
                                            LatestSijoitteluajoHakukohde, HakukohdeAvainTyyppiService,
                                            KoostettuHakemusAdditionalDataByOids, KoostettuHakemusAdditionalData) {
    "use strict";

    var model = new function () {
        this.hakemus = {};
        this.hakutoiveetMap = {};
        this.hakutoiveet = [];
        this.haku = {};
        this.errors = [];
        this.sijoittelu = {};
        this.hakenutHarkinnanvaraisesti = false;
        this.naytaPistesyotto = false;

        this.refresh = function (hakuOid, hakemusOid) {
            var hakemus = {};
            var hakutoiveetMap = {};
            var hakutoiveet = [];
            var errors = [];
            var haku = {};
            var sijoittelu = {};

            HaunTiedot.get({hakuOid: hakuOid}, function (resultWrapper) {
                for (var attr in resultWrapper.result) {
                    if (resultWrapper.result.hasOwnProperty(attr)) {
                        haku[attr] = resultWrapper.result[attr];
                    }
                }
            }, function(error) {
                errors.push(error);
            });

            Hakemus.get({oid: hakemusOid}, function (result) {
                for (var attr in result) {
                    if (result.hasOwnProperty(attr)) {
                        hakemus[attr] = result[attr];
                    }
                }
                if (hakemus.answers && hakemus.answers.hakutoiveet) {
                    for (var i = 1; hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"]; i++) {
                        var oid = hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];
                        var harkinnanvarainen = hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];
                        var discretionary = hakemus.answers.hakutoiveet["preference" + i + "-Harkinnanvarainen"];  // this should be removed at some point

                        var hakutoive = {
                            hakukohdeOid: oid,
                            hakutoiveNumero: i,
                            koulutuksenNimi: hakemus.answers.hakutoiveet["preference" + i + "-Koulutus"],
                            oppilaitos: hakemus.answers.hakutoiveet["preference" + i + "-Opetuspiste"],
                            hakemusOid: hakemus.oid,
                            hakenutHarkinnanvaraisesti: (harkinnanvarainen || discretionary) === "true",
                            additionalData: hakemus.additionalInfo
                        };

                        hakutoiveetMap[oid] = hakutoive;
                        hakutoiveet.push(hakutoive);
                        if (hakutoive.hakenutHarkinnanvaraisesti) {
                            model.hakenutHarkinnanvaraisesti = true;
                        }
                    }
                }
                HarkinnanvaraisestiHyvaksytty.get({hakemusOid: hakemusOid, hakuOid: hakuOid}, function (result) {
                    result.forEach(function (harkinnanvarainen) {
                        var hakutoive = hakutoiveetMap[harkinnanvarainen.hakukohdeOid];
                        if (hakutoive) {
                            hakutoive.muokattuHarkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                            hakutoive.harkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                        }
                    });
                }, function (error) {
                    errors.push(error);
                });

                //fetch sijoittelun tilat and extend hakutoiveet
                LatestSijoittelunTilat.get({hakemusOid: hakemus.oid, hakuOid: hakuOid}, function (latest) {
                    if (latest.hakutoiveet) {
                        latest.hakutoiveet.forEach(function (hakutoive) {
                            if (hakutoiveetMap[hakutoive.hakukohdeOid]) {
                                hakutoiveetMap[hakutoive.hakukohdeOid].sijoittelu = hakutoive.hakutoiveenValintatapajonot || [];
                                hakutoiveetMap[hakutoive.hakukohdeOid].sijoittelu.forEach(function (valintatapajono) {
                                    valintatapajono.hakemusOid = hakemus.oid;
                                    valintatapajono.hakijaOid = hakemus.personOid;
                                    sijoittelu[valintatapajono.valintatapajonoOid] = valintatapajono;
                                });
                                model.vastaanottoTilaOptionsToShow(hakutoive);
                            }
                        });
                        hakutoiveet.forEach(function(hakutoive) {
                            (hakutoive.sijoittelu || []).forEach(function (valintatapajono) {
                                HakemuksenValintatulokset.get({
                                    hakemusOid: hakemusOid,
                                    hakuOid: hakuOid,
                                    hakukohdeOid: hakutoive.hakukohdeOid,
                                    valintatapajonoOid: valintatapajono.valintatapajonoOid
                                }, function (result) {
                                    result.forEach(function (r) {
                                        if (r.hakemusOid === hakemus.oid) {
                                            sijoittelu[valintatapajono.valintatapajonoOid].logEntries = r.logEntries;
                                        }
                                    });
                                }, function (error) {
                                    errors.push(error);
                                });
                            });
                        });
                        hakutoiveet.forEach(function(hakutoive) {
                            LatestSijoitteluajoHakukohde.get({
                                hakukohdeOid: hakutoive.hakukohdeOid,
                                hakuOid: hakuOid
                            }, function (result) {
                                (result.valintatapajonot || []).forEach(function (jono) {
                                    jono.hakemukset.forEach(function (h) {
                                        if (h.hakemusOid === hakemus.oid && sijoittelu[jono.oid]) {
                                            sijoittelu[jono.oid].tilaHistoria = h.tilaHistoria;
                                        }
                                    });
                                });
                            }, function (error) {
                                errors.push(error);
                            });
                        });

                        //fetch sijoittelun vastaanottotilat and extend hakutoiveet
                        SijoittelunVastaanottotilat.get({hakuOid: hakuOid, hakemusOid: hakemus.oid}, function (vastaanottotilat) {
                            vastaanottotilat.forEach(function (vastaanottoTila) {
                                if (sijoittelu[vastaanottoTila.valintatapajonoOid]) {
                                    sijoittelu[vastaanottoTila.valintatapajonoOid].vastaanottoTila = vastaanottoTila.tila;
                                    sijoittelu[vastaanottoTila.valintatapajonoOid].muokattuVastaanottoTila = vastaanottoTila.tila;
                                }
                            });
                        }, function (error) {
                            errors.push(error);
                        });
                    }
                }, function (error) {
                    errors.push(error);
                });

                $q.all(hakutoiveet.map(function(hakutoive) {
                    return KoostettuHakemusAdditionalDataByOids.post(
                        {hakuOid: hakuOid, hakukohdeOid: hakutoive.hakukohdeOid}, [hakemusOid]
                    ).$promise.then(function(result) {
                        hakutoive.additionalData = result[0].additionalData;
                    });
                })).then(function() {
                    return ValintakoetuloksetHakemuksittain.get({hakemusOid: hakemus.oid}).$promise;
                }).then(function(hakemus) {
                    (hakemus.hakutoiveet || []).forEach(function (hakutoive) {
                        var hakukohde = hakutoiveetMap[hakutoive.hakukohdeOid];
                        if (hakukohde) {
                            hakukohde.valintakokeet = {};
                            hakukohde.osallistuminen = false;
                            hakutoive.valinnanVaiheet.forEach(function (valinnanVaihe) {
                                valinnanVaihe.valintakokeet.forEach(function (valintakoe) {
                                    hakukohde.valintakokeet[valintakoe.valintakoeTunniste] = {
                                        jarjestysluku: valinnanVaihe.valinnanVaiheJarjestysluku,
                                        valinnanVaiheOid: valinnanVaihe.valinnanVaiheOid,
                                        valintakoeOid: valintakoe.valintakoeOid,
                                        valintakoeTunniste: valintakoe.valintakoeTunniste,
                                        osallistuminen: valintakoe.osallistuminenTulos.osallistuminen
                                    };
                                    if (valintakoe.osallistuminenTulos.osallistuminen === 'OSALLISTUU') {
                                        hakukohde.osallistuminen = true;
                                    }
                                });
                            });
                            if (hakukohde.osallistuminen) {
                                HakukohdeAvaimet.get({hakukohdeOid: hakutoive.hakukohdeOid}, function (result) {
                                    hakukohde.avaimet = result;
                                    HakukohdeAvainTyyppiService.createAvainTyyppiValues(hakukohde.avaimet, []);
                                    hakukohde.osallistuu = {};
                                    if (!hakukohde.additionalData) {
                                        hakukohde.additionalData = {};
                                    }
                                    hakukohde.avaimet.forEach(function (avain) {
                                        hakukohde.osallistuu[avain.tunniste] = false;
                                        if (hakukohde.valintakokeet &&
                                            hakukohde.valintakokeet[avain.tunniste]) {
                                            hakukohde.osallistuu[avain.tunniste] = hakukohde.valintakokeet[avain.tunniste].osallistuminen;
                                            if (hakukohde.osallistuu[avain.tunniste] === 'OSALLISTUU') {
                                                hakukohde.naytaPistesyotto = true;
                                                model.naytaPistesyotto = true;
                                            }
                                        }
                                        if (!hakukohde.additionalData[avain.tunniste]) {
                                            hakukohde.additionalData[avain.tunniste] = "";
                                        }
                                        if (!hakukohde.additionalData[avain.osallistuminenTunniste]) {
                                            if (!avain.vaatiiOsallistumisen) {
                                                hakukohde.additionalData[avain.osallistuminenTunniste] = "EI_VAADITA";
                                            } else {
                                                hakukohde.additionalData[avain.osallistuminenTunniste] = "MERKITSEMATTA";
                                            }
                                        }
                                        if (avain.syotettavissaKaikille) {
                                            hakukohde.osallistuu[avain.tunniste] = 'OSALLISTUU';
                                        }
                                    });
                                }, function (error) {
                                    errors.push(error);
                                });
                            }
                        }
                    });
                }, function(error) {
                    errors.push(error);
                });
                ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function (valintalaskenta) {
                    valintalaskenta.hakukohteet.forEach(function (hakukohde) {
                        var hakutoive = hakutoiveetMap[hakukohde.oid];
                        if (hakutoive) {
                            hakutoive.valintalaskenta = hakukohde.valinnanvaihe;
                        }
                    });
                }, function (error) {
                    errors.push(error);
                });
            }, function (error) {
                errors.push(error);
            });

            model.hakuOid = hakuOid;
            model.hakemus = hakemus;
            model.hakutoiveetMap = hakutoiveetMap;
            model.hakutoiveet = hakutoiveet;
            model.errors = errors;
            model.haku = haku;
            model.sijoittelu = sijoittelu;
        };

        this.refreshIfNeeded = function (hakuOid, hakemusOid) {
            if (model.hakemus.oid !== hakemusOid || model.valintalaskentaHakemus.hakuoid !== hakuOid) {
                model.refresh(hakuOid, hakemusOid);
            }
        };

        this.vastaanottoTilaOptionsToShow = function(hakutoive) {
            var showSitovasti = false;
            if (hakutoive.hakutoiveenValintatapajonot) {
                hakutoive.hakutoiveenValintatapajonot.forEach(function (valintatapajono, index) {
                    // mitä vaihtoehtoja näytetään vastaanottotila-dialogissa
                    if (valintatapajono.tila === 'HYVAKSYTTY') {
                        if (valintatapajono.valintatapajonoPrioriteetti === index+1) {
                            showSitovasti = true;
                        }
                        if (valintatapajono.valintatapajonoPrioriteetti === 1) {
                            model.sijoittelu[valintatapajono.valintatapajonoOid].showSitovasti = true;
                            model.sijoittelu[valintatapajono.valintatapajonoOid].showEhdollisesti = false;
                        }
                        if (valintatapajono.valintatapajonoPrioriteetti > 1) {
                            model.sijoittelu[valintatapajono.valintatapajonoOid].showSitovasti = showSitovasti;
                            model.sijoittelu[valintatapajono.valintatapajonoOid].showEhdollisesti = true;
                        }
                    }
                });
            }
        };

        this.tallennaPisteet = function () {
            return model.hakutoiveet.map(function(hakutoive) {
               if (hakutoive.osallistuminen) {
                   return KoostettuHakemusAdditionalData.put(
                       {hakuOid: model.hakuOid, hakukohdeOid: hakutoive.hakukohdeOid},
                       [{
                           oid: model.hakemus.oid,
                           personOid: model.hakemus.personOid,
                           additionalData: hakutoive.additionalData
                       }]
                   ).$promise;
               } else {
                   return $q.resolve();
               }
            });
        };
    }();

    return model;
});

angular.module('valintalaskenta').
    controller('HenkiloTiedotController', ['$q', '$scope', '$modal', '$routeParams', 'ParametriService', 'Latausikkuna', 'Jalkiohjauskirjepohjat',
        'Jalkiohjauskirjeet', 'HenkiloTiedotModel', 'AuthService', 'Pohjakoulutukset', 'Ilmoitus', 'IlmoitusTila','HakuModel', '$filter', 'Korkeakoulu',
        function ($q, $scope, $modal, $routeParams, ParametriService, Latausikkuna, Jalkiohjauskirjepohjat,
                  Jalkiohjauskirjeet, HenkiloTiedotModel, AuthService, Pohjakoulutukset, Ilmoitus, IlmoitusTila,HakuModel,$filter, Korkeakoulu) {
    "use strict";

    $scope.model = HenkiloTiedotModel;
    $scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid);
    $scope.url = window.url;
    HakuModel.refreshIfNeeded($routeParams.hakuOid);
    $scope.hakuModel = HakuModel;
    $scope.korkeakoulu = Korkeakoulu;

    $scope.hakuaVastaavaJalkiohjauskirjeMuotti = function() {
	    return "jalkiohjauskirje";
    };
    $scope.muodostaJalkiohjauskirje = function () {
        var isKorkeakoulu = $scope.korkeakoulu.isKorkeakoulu($scope.hakuModel.hakuOid.kohdejoukkoUri);
        var applicationPeriod = $routeParams.hakuOid;
        var hakemusOid = $scope.model.hakemus.oid;
        var asiointikieli = $scope.model.hakemus.answers.lisatiedot.asiointikieli;
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
					        	letterBodyText: sisalto} , function (id) {
					            Latausikkuna.avaa(id, latausikkunaTeksti, "");
					        }, function () {
					            
					        });
                    	},
                        showDateFields: true,
                        hakuOid: $routeParams.hakuOid,
                        pohjat: function() {
                        	return Jalkiohjauskirjepohjat.get({templateName: templateName,languageCode: langcode, applicationPeriod: applicationPeriod});
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
        var promises = $scope.model.tallennaPisteet();
        $q.all(promises).then(function () {
            Ilmoitus.avaa("Tallennus onnistui", "Pisteet tallennettu onnistuneesti.");
        }, function () {
            Ilmoitus.avaa("Tallennus epäonnistui", "Pisteiden tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.", IlmoitusTila.ERROR);
        });
    };

    $scope.valintalaskentaKerrallaHakukohteille = function() {
        var hakutoiveet = [];
        $scope.model.hakutoiveet.forEach(function (hakutoive) {
            hakutoiveet.push(hakutoive.hakukohdeOid);
        });
        var erillishaku = HakuModel.hakuOid.erillishaku;
        if(hakutoiveet[0] != null) {
            var valintalaskentaInstance = $modal.open({
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
	                        hakukohteet: hakutoiveet
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
