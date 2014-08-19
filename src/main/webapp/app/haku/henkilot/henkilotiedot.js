app.factory('HenkiloTiedotModel', function ($q, Hakemus, ValintalaskentaHakemus, HakukohdeNimi, ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe, SijoittelunVastaanottotilat, LatestSijoittelunTilat, ValintakoetuloksetHakemuksittain, HarkinnanvaraisestiHyvaksytty, HakukohdeAvaimet, HakemusAdditionalData, HaunTiedot) {
    "use strict";

    var model = new function () {
        this.hakemus = {};
        this.hakutoiveetMap = {};
        this.hakutoiveet = [];
        this.haku = {};
        this.errors = [];

        this.refresh = function (hakuOid, hakemusOid) {
            model.hakuOid = hakuOid;
            model.hakemus = {};
            model.hakutoiveetMap = {};
            model.hakutoiveet.length = 0;
            model.errors.length = 0;
            model.haku = {};

            HaunTiedot.get({hakuOid: hakuOid}, function (result) {
                model.haku = result;
                var hakutyyppi = model.haku.hakutyyppiUri;
                var lisahakutyyppiRegExp = /(hakutyyppi_03).*/;
                var match = lisahakutyyppiRegExp.exec(hakutyyppi);
                match ? model.haku.lisahaku = true : model.haku.lisahaku = false;
            });

            Hakemus.get({oid: hakemusOid}, function (result) {
                model.hakemus = result;

                // autoscroll kutsuu controlleria kahteen kertaan. öri öri
                model.hakutoiveetMap = {};
                model.hakutoiveet.length = 0;

                for (var i = 1; i < 10; i++) {
                    var oid = model.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];

                    if (oid === undefined) {
                        break;
                    }

                    var hakutoiveIndex = i;
                    var koulutus = model.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus"];
                    var oppilaitos = model.hakemus.answers.hakutoiveet["preference" + i + "-Opetuspiste"];

                    var harkinnanvarainen = model.hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];
                    var discretionary = model.hakemus.answers.hakutoiveet["preference" + i + "-Harkinnanvarainen"];  // this should be removed at some point

                    //create hakutoiveObject that can easily be iterated in view
                    var hakutoive = {
                        hakukohdeOid: oid,
                        hakutoiveNumero: hakutoiveIndex,
                        koulutuksenNimi: koulutus,
                        oppilaitos: oppilaitos,
                        hakemusOid: model.hakemus.oid,
                        hakenutHarkinnanvaraisesti: (harkinnanvarainen || discretionary),
                        additionalData: model.hakemus.additionalInfo
                    };

                    if (oid) {
                        model.hakutoiveetMap[oid] = hakutoive;
                        model.hakutoiveet.push(hakutoive);
                    }
                    if (hakutoive.hakenutHarkinnanvaraisesti === 'true') {
                        model.hakenutHarkinnanvaraisesti = true;
                    }
                }

                HarkinnanvaraisestiHyvaksytty.get({hakemusOid: hakemusOid, hakuOid: hakuOid}, function (result) {

                    result.forEach(function (harkinnanvarainen) {
                        var hakutoive = model.hakutoiveetMap[harkinnanvarainen.hakukohdeOid];
                        if (hakutoive) {
                            hakutoive.muokattuHarkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                            hakutoive.harkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                        }
                    });

                }, function (error) {
                    model.errors.push(error);
                });

                //fetch sijoittelun tilat and extend hakutoiveet
                LatestSijoittelunTilat.get({hakemusOid: model.hakemus.oid, hakuOid: hakuOid}, function (latest) {
                    model.sijoittelu = {};
                    if (latest.hakutoiveet) {
                        latest.hakutoiveet.forEach(function (hakutoive) {
                            if (model.hakutoiveetMap[hakutoive.hakukohdeOid]) {

                                // Sijoittelun tilan muutosta varten
                                hakutoive.hakutoiveenValintatapajonot.forEach(function (sijoittelu) {
                                    sijoittelu.hakemusOid = model.hakemus.oid;
                                });
                                model.hakutoiveetMap[hakutoive.hakukohdeOid].sijoittelu = hakutoive.hakutoiveenValintatapajonot;

                                if (hakutoive.hakutoiveenValintatapajonot) {
                                    hakutoive.hakutoiveenValintatapajonot.forEach(function (valintatapajono) {
                                        model.sijoittelu[valintatapajono.valintatapajonoOid] = valintatapajono;
                                    });
                                }
                                model.vastaanottoTilaOptionsToShow(hakutoive);
                            }
                        });

                        //fetch sijoittelun vastaanottotilat and extend hakutoiveet
                        SijoittelunVastaanottotilat.get({hakemusOid: model.hakemus.oid}, function (vastaanottotilat) {
                            if (vastaanottotilat.length > 0) {
                                vastaanottotilat.forEach(function (vastaanottoTila) {

                                    if (model.hakutoiveetMap[vastaanottoTila.hakukohdeOid] &&
                                        model.hakutoiveetMap[vastaanottoTila.hakukohdeOid].sijoittelu) {
                                        model.hakutoiveetMap[vastaanottoTila.hakukohdeOid].sijoittelu.forEach(function (sijoittelu) {
                                            // Sijoittelun tilan muutosta varten
                                            sijoittelu.hakemusOid = model.hakemus.oid;
                                            if (sijoittelu.valintatapajonoOid === vastaanottoTila.valintatapajonoOid) {
                                                sijoittelu.vastaanottoTila = vastaanottoTila.tila;
                                                sijoittelu.muokattuVastaanottoTila = vastaanottoTila.tila;
                                            }
                                        });

                                    }
                                });

                            }
                        }, function (error) {
                            model.errors.push(error);
                        });
                    }
                }, function (error) {
                    model.errors.push(error);
                });


                ValintakoetuloksetHakemuksittain.get({hakemusOid: model.hakemus.oid}, function (hakemus) {
                    hakemus.hakutoiveet.forEach(function (hakutoive) {
                        var hakukohde = model.hakutoiveetMap[hakutoive.hakukohdeOid];
                        var hakukohdeOid = hakutoive.hakukohdeOid;
                        if (hakukohde) {

                            hakukohde.valintakokeet = {};
                            hakukohde.osallistuminen = false;
                            hakutoive.valinnanVaiheet.forEach(function (valinnanVaihe) {

                                valinnanVaihe.valintakokeet.forEach(function (valintakoe) {
                                    var valintakoe = {
                                        jarjestysluku: valinnanVaihe.valinnanVaiheJarjestysluku,
                                        valinnanVaiheOid: valinnanVaihe.valinnanVaiheOid,
                                        valintakoeOid: valintakoe.valintakoeOid,
                                        valintakoeTunniste: valintakoe.valintakoeTunniste,
                                        osallistuminen: valintakoe.osallistuminenTulos.osallistuminen
                                    };
                                    hakukohde.valintakokeet[valintakoe.valintakoeTunniste] = valintakoe;

                                    if (valintakoe.osallistuminen === 'OSALLISTUU') {
                                        hakukohde.osallistuminen = true;
                                    }
                                });

                            });

                            if (hakukohde.osallistuminen) {
                                HakukohdeAvaimet.get({hakukohdeOid: hakutoive.hakukohdeOid}, function (result) {

                                    hakukohde.avaimet = result;

                                    hakukohde.avaimet.forEach(function (avain) {
                                        avain.tyyppi = function () {
                                            if (avain.funktiotyyppi === "TOTUUSARVOFUNKTIO") {
                                                return "boolean";
                                            }
                                            return avain.arvot && avain.arvot.length > 0 ? "combo" : "input";
                                        };
                                    });

                                    hakukohde.osallistuu = {};

                                    if (!hakukohde.additionalData) {
                                        hakukohde.additionalData = {};
                                    }

                                    model.naytaPistetsyotto = false;
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
                                            hakukohde.additionalData[avain.osallistuminenTunniste] = "MERKITSEMATTA";
                                        }

                                    });

                                }, function (error) {
                                    model.errors.push(error);
                                });
                            }
                        }
                    });


                    ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function (valintalaskenta) {
                        valintalaskenta.hakukohteet.forEach(function (hakukohde) {
                            var hakutoive = model.hakutoiveetMap[hakukohde.hakukohdeoid];
                            if (hakutoive) {
                                hakutoive.valintalaskenta = hakukohde.valinnanvaihe;
                            }
                        });

                    }, function (error) {
                        model.errors.push(error);
                    });

                }, function (error) {
                    model.errors.push(error);
                });

            }, function (error) {
                model.errors.push(error);
            });

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
            model.errors.length = 0;
            var promises = [];
            model.hakutoiveet.forEach(function (hakutoive) {
                if (hakutoive.osallistuminen) {

                    promises.push(function () {
                        var deferred = $q.defer();
                        var hakeneet = [
                            {
                                oid: model.hakemus.oid,
                                additionalData: hakutoive.additionalData
                            }
                        ];


                        HakemusAdditionalData.put({hakuOid: model.hakuOid, hakukohdeOid: hakutoive.hakukohdeOid}, hakeneet, function (success) {
                            deferred.resolve(success);
                        }, function (error) {
                            deferred.reject(error);
                            console.log(error);
                        });

                        return deferred;
                    }());
                }

            });

            return promises;
        };
    }();

    return model;
});

angular.module('valintalaskenta').
    controller('HenkiloTiedotController', ['$q', '$scope', '$modal', '$routeParams', 'ParametriService', 'Latausikkuna', 'Jalkiohjauskirjepohjat',
        'Jalkiohjauskirjeet', 'HenkiloTiedotModel', 'AuthService', 'Pohjakoulutukset', 'Ilmoitus', 'IlmoitusTila','HakuModel',
        function ($q, $scope, $modal, $routeParams, ParametriService, Latausikkuna, Jalkiohjauskirjepohjat,
                  Jalkiohjauskirjeet, HenkiloTiedotModel, AuthService, Pohjakoulutukset, Ilmoitus, IlmoitusTila,HakuModel) {
    "use strict";

    $scope.model = HenkiloTiedotModel;
    $scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid);
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakuaVastaavaJalkiohjauskirjeMuotti = function() {
    	if(HakuModel.hakuOid.nivelvaihe) {
    		return "jalkiohjauskirje_nivel";	
    	}else {
	    	return "jalkiohjauskirje";
	    }
    };
    $scope.muodostaJalkiohjauskirje = function () {
        
        var tag = $routeParams.hakuOid;
        var hakemusOid = $scope.model.hakemus.oid;
        var asiointikieli = $scope.model.hakemus.answers.lisatiedot.asiointikieli;
        var langcode = "FI";
        if(asiointikieli !== undefined && asiointikieli.toUpperCase() === "RUOTSI") {
			langcode = "SV";
        }
        var templateName = $scope.hakuaVastaavaJalkiohjauskirjeMuotti();
        var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                    	otsikko: "Jälkiohjauskirjeet",
                    	toimintoNimi: "Muodosta jälkiohjauskirjeet",
                    	toiminto: function(sisalto) {
                    		Jalkiohjauskirjeet.post({
					        	hakuOid: $routeParams.hakuOid,
					        	tag: tag, templateName: templateName}, {hakemusOids: [hakemusOid],
					        	letterBodyText: sisalto} , function (id) {
					            Latausikkuna.avaa(id, "Jälkiohjauskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        hakuOid: $routeParams.hakuOid,
                        pohjat: function() {
                        	return Jalkiohjauskirjepohjat.get({templateName: templateName,languageCode: langcode, tag: tag});
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

    $scope.isValinnanvaiheVisible = function (valintalaskenta, index, filter, last) {
        return ((last && !filter && valintalaskenta[index].valintatapajonot) ||
            (index + 1 < valintalaskenta.length && valintalaskenta[index + 1].valintatapajonot.length === 0) || filter);
    };
    $scope.isValinnanvaiheNameVisible = function (valintalaskenta, index, filter, last, first) {
        return ((last && !filter && valintalaskenta[index].valintatapajonot) ||
            (!filter && index + 1 < valintalaskenta.length && valintalaskenta[index + 1].valintatapajonot.length === 0) || first && filter);
    };

    $scope.tallennaPisteet = function () {
        var promises = $scope.model.tallennaPisteet();
        $q.all(promises).then(function () {
            Ilmoitus.avaa("Tallennus onnistui", "Pisteet tallennettu onnistuneesti.");
        }, function () {
            Ilmoitus.avaa("Tallennus epäonnistui", "Pisteiden tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.", IlmoitusTila.ERROR);
        });
    };

    $scope.changeOsallistuminen = function (hakija, tunniste, value) {
        if (value) {
            hakija.additionalData[tunniste] = "OSALLISTUI";
        }
    };
    $scope.changeArvo = function (hakija, tunniste, value, tyyppi) {
        hakija.additionalData[tunniste] = "";
        if (value === "OSALLISTUI") {
            if (tyyppi === "boolean") {
                hakija.additionalData[tunniste] = "true";
            } else {
                hakija.additionalData[tunniste] = undefined;
            }
        }

    };

    $scope.valintalaskentaKerrallaHakukohteille = function() {
        var hakutoiveet = [];
        $scope.model.hakutoiveet.forEach(function (hakutoive) {
            hakutoiveet.push(hakutoive.hakukohdeOid);
        });
        var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/hakutoiveetseurantaikkuna.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        tyyppi: "VALINTARYHMA",
                        hakutoiveet: hakutoiveet
                    };
                }
            }
        });
    };

    $scope.privileges = ParametriService;
}]);