app.factory('HenkiloTiedotModel', function ($q, Hakemus, ValintalaskentaHakemus, HakukohdeNimi,
                                            ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe,
                                            SijoittelunVastaanottotilat, LatestSijoittelunTilat,
                                            ValintakoetuloksetHakemuksittain, HarkinnanvaraisestiHyvaksytty,
                                            HakukohdeAvaimet, HakemusAdditionalData, HaunTiedot, HakemuksenValintatulokset,
                                            LatestSijoitteluajoHakukohde, HakukohdeAvainTyyppiService) {
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
            model.hakutoiveet = [];
            model.errors = [];
            model.haku = {};
            model.sijoittelu = {};

            HaunTiedot.get({hakuOid: hakuOid}, function (resultWrapper) {
                model.haku = resultWrapper.result;
            }, function(error) {
                model.errors.push(error);
            });

            Hakemus.get({oid: hakemusOid}, function (result) {
                model.hakemus = result;
                if (model.hakemus.answers && model.hakemus.answers.hakutoiveet) {
                    model.hakutoiveet = [];
                    for (var i = 1; model.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"]; i++) {
                        var oid = model.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];
                        var harkinnanvarainen = model.hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];
                        var discretionary = model.hakemus.answers.hakutoiveet["preference" + i + "-Harkinnanvarainen"];  // this should be removed at some point

                        var hakutoive = {
                            hakukohdeOid: oid,
                            hakutoiveNumero: i,
                            koulutuksenNimi: model.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus"],
                            oppilaitos: model.hakemus.answers.hakutoiveet["preference" + i + "-Opetuspiste"],
                            hakemusOid: model.hakemus.oid,
                            hakenutHarkinnanvaraisesti: (harkinnanvarainen || discretionary) === "true",
                            additionalData: model.hakemus.additionalInfo
                        };

                        model.hakutoiveetMap[oid] = hakutoive;
                        model.hakutoiveet.push(hakutoive);
                        model.hakenutHarkinnanvaraisesti = model.hakenutHarkinnanvaraisesti || hakutoive.hakenutHarkinnanvaraisesti;
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
                    if (latest.hakutoiveet) {
                        latest.hakutoiveet.forEach(function (hakutoive) {
                            if (model.hakutoiveetMap[hakutoive.hakukohdeOid]) {
                                model.hakutoiveetMap[hakutoive.hakukohdeOid].sijoittelu = hakutoive.hakutoiveenValintatapajonot || [];
                                model.hakutoiveetMap[hakutoive.hakukohdeOid].sijoittelu.forEach(function (valintatapajono) {
                                    valintatapajono.hakemusOid = model.hakemus.oid;
                                    valintatapajono.hakijaOid = model.hakemus.personOid;
                                    model.sijoittelu[valintatapajono.valintatapajonoOid] = valintatapajono;

                                    HakemuksenValintatulokset.get({
                                        hakemusOid: hakemusOid,
                                        hakuOid: hakuOid,
                                        hakukohdeOid: hakutoive.hakukohdeOid,
                                        valintatapajonoOid: valintatapajono.valintatapajonoOid
                                    }, function (result) {
                                        result.forEach(function (r) {
                                            if (r.hakemusOid === model.hakemus.oid) {
                                                model.sijoittelu[valintatapajono.valintatapajonoOid].logEntries = r.logEntries;
                                            }
                                        });
                                    });
                                });
                                model.vastaanottoTilaOptionsToShow(hakutoive);
                                LatestSijoitteluajoHakukohde.get({
                                    hakukohdeOid: hakutoive.hakukohdeOid,
                                    hakuOid: hakuOid
                                }, function (result) {
                                    (result.valintatapajonot || []).forEach(function (jono) {
                                        jono.hakemukset.forEach(function (h) {
                                            if (h.hakemusOid === model.hakemus.oid && model.sijoittelu[jono.oid]) {
                                                model.sijoittelu[jono.oid].tilaHistoria = h.tilaHistoria;
                                            }
                                        });
                                    });
                                });
                            }
                        });

                        //fetch sijoittelun vastaanottotilat and extend hakutoiveet
                        SijoittelunVastaanottotilat.get({hakuOid: hakuOid, hakemusOid: model.hakemus.oid}, function (vastaanottotilat) {
                            vastaanottotilat.forEach(function (vastaanottoTila) {
                                if (model.sijoittelu[vastaanottoTila.valintatapajonoOid]) {
                                    model.sijoittelu[vastaanottoTila.valintatapajonoOid].vastaanottoTila = vastaanottoTila.tila;
                                    model.sijoittelu[vastaanottoTila.valintatapajonoOid].muokattuVastaanottoTila = vastaanottoTila.tila;
                                }
                            });
                        }, function (error) {
                            model.errors.push(error);
                        });
                    }
                }, function (error) {
                    model.errors.push(error);
                });


                ValintakoetuloksetHakemuksittain.get({hakemusOid: model.hakemus.oid}, function (hakemus) {
                    (hakemus.hakutoiveet || []).forEach(function (hakutoive) {
                        var hakukohde = model.hakutoiveetMap[hakutoive.hakukohdeOid];
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
                                    model.naytaPistesyotto = false;
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
                                        if (avain.vaatiiOsallistumisen == false && !hakukohde.additionalData[avain.osallistuminenTunniste]) {
                                            hakukohde.additionalData[avain.osallistuminenTunniste] = "EI_VAADITA";
                                        }
                                        if (avain.syotettavissaKaikille == true) {
                                            hakukohde.osallistuu[avain.tunniste] = 'OSALLISTUU';
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
                }, function (error) {
                    model.errors.push(error);
                });
                ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function (valintalaskenta) {
                    valintalaskenta.hakukohteet.forEach(function (hakukohde) {
                        var hakutoive = model.hakutoiveetMap[hakukohde.oid];
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
            model.errors = [];
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
