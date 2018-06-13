var app = angular.module('valintalaskenta');
app.factory('HenkiloTiedotModel', function ($q, Hakemus, ValintalaskentaHakemus, HakukohdeNimi,
                                            ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe,
                                            SijoittelunVastaanottotilat, VtsLatestSijoittelunTilat,
                                            ValintakoetuloksetHakemuksittain, HarkinnanvaraisestiHyvaksytty,
                                            HakukohdeAvaimet, HaunTiedot, HakemuksenValintatulokset,
                                            VtsLatestSijoitteluajoHakukohde, HakukohdeAvainTyyppiService,
                                            KoostettuHakemusAdditionalDataForHakemus, R) {
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
            var hakutoiveetLoaded = $q.defer();

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
                            oppilaitosId: hakemus.answers.hakutoiveet["preference" + i + "-Opetuspiste-id"],
                            hakemusOid: hakemus.oid,
                            hakenutHarkinnanvaraisesti: (harkinnanvarainen || discretionary) === "true",
                            additionalData: hakemus.additionalInfo,
                            hasDoneOrganizationCheck: false,
                            showAsLink: false
                        };
                        hakutoiveetMap[oid] = hakutoive;
                        hakutoiveet.push(hakutoive);
                        if (hakutoive.hakenutHarkinnanvaraisesti) {
                            model.hakenutHarkinnanvaraisesti = true;
                        }
                    }
                    hakutoiveetLoaded.resolve();
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
                var extendHakutoiveet =  function (latest) {
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
                            var hadleValintatapajonot = function (result) {
                                (result.valintatapajonot || []).forEach(function (jono) {
                                    jono.hakemukset.forEach(function (h) {
                                        if (h.hakemusOid === hakemus.oid && sijoittelu[jono.oid]) {
                                            sijoittelu[jono.oid].tilaHistoria = h.tilaHistoria;
                                        }
                                    });
                                });
                            };

                            VtsLatestSijoitteluajoHakukohde.get({
                                hakukohdeOid: hakutoive.hakukohdeOid,
                                hakuOid: hakuOid
                            }, hadleValintatapajonot, function (error) {
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
                };

                VtsLatestSijoittelunTilat.get({hakemusOid: hakemus.oid, hakuOid: hakuOid}, extendHakutoiveet, function (error) {
                    if(400 !== error.status) {
                        errors.push(error);
                    }
                });
                //$q.all(model.hakutoiveet.map(function(h) {
                KoostettuHakemusAdditionalDataForHakemus.get({hakemusOid: model.hakemus.oid}).then(function (pistetiedot) {
                    var pistetiedotByHakukohdeOid = pistetiedot.hakukohteittain;
                    model.lastmodified = pistetiedot.lastmodified;
                    $q.all(hakutoiveet.map(function (hakutoive) {
                        HakukohdeAvaimet.get({hakukohdeOid: hakutoive.hakukohdeOid}, function (avaimet) {
                            hakutoive.avaimet = avaimet;
                            HakukohdeAvainTyyppiService.createAvainTyyppiValues(hakutoive.avaimet, []);
                            var pistetieto = pistetiedotByHakukohdeOid[hakutoive.hakukohdeOid];
                            if (pistetieto.hakukohteidenOsallistumistiedot &&
                              pistetieto.hakukohteidenOsallistumistiedot[hakutoive.hakukohdeOid] &&
                              pistetieto.hakukohteidenOsallistumistiedot[hakutoive.hakukohdeOid].valintakokeidenOsallistumistiedot) {
                                hakutoive.osallistuu = pistetieto.hakukohteidenOsallistumistiedot[hakutoive.hakukohdeOid].valintakokeidenOsallistumistiedot;
                            } else {
                                hakutoive.osallistuu = {};
                            }
                            hakutoive.additionalData = pistetieto.applicationAdditionalDataDTO.additionalData;
                            hakutoive.naytaPistesyotto = false;
                            hakutoive.avaimet.forEach(function (a) {
                                if (hakutoive.osallistuu[a.tunniste] &&
                                  hakutoive.osallistuu[a.tunniste].osallistumistieto !== "EI_KUTSUTTU") {
                                    hakutoive.naytaPistesyotto = true;
                                    model.naytaPistesyotto = true;
                                }
                            });
                        }, function (error) {
                            errors.push(error);
                        });
                    })).then(function() {}, function (error) {
                        errors.push(error);
                    });
                }, function (error) {
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
            return hakutoiveetLoaded.promise;
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
            var mergedAdditionalData = R.mergeAll(R.map(function(h) {return h.additionalData;}, model.hakutoiveet));
            return KoostettuHakemusAdditionalDataForHakemus.put(
                {
                    hakemusOid: model.hakemus.oid
                },
                {
                    lastmodified: model.lastmodified,
                    hakemus: {
                        oid: model.hakemus.oid,
                        personOid: model.hakemus.personOid,
                        additionalData: mergedAdditionalData
                    }
                }
            );
        };
    }();

    return model;
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

    $scope.hakutoiveetLoadedPromise.then(function() {
        $scope.model.hakutoiveet.forEach(function(h) {
            $scope.hasOrganizationReadAccess(h).then(function () {
                h.hasDoneOrganizationCheck = true;
                h.showAsLink = true;
            }, function () {
                h.hasDoneOrganizationCheck = true;
                h.showAsLink = false;
            })
        });
    });

    $scope.hasOrganizationReadAccess = function (hakutoive) {
        return AuthService.readOrg("APP_VALINTOJENTOTEUTTAMINENKK", hakutoive.oppilaitosId);
    };

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
