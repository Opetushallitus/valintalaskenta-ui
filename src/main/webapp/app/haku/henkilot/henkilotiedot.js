"use strict";
app.factory('HenkiloTiedotModel', function (Hakemus, ValintalaskentaHakemus, HakukohdeNimi, ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe, SijoittelunVastaanottotilat, LatestSijoittelunTilat, ValintakoetuloksetHakemuksittain, HarkinnanvaraisestiHyvaksytty) {
    var model = new function () {
        this.hakemus = {};
        this.hakutoiveetMap = {};
        this.hakutoiveet = [];

        this.errors = [];

        this.refresh = function (hakuOid, hakemusOid) {
            model.hakuOid = hakuOid;
            model.hakemus = {};
            model.hakutoiveetMap = {};
            model.hakutoiveet.length = 0;
            model.errors.length = 0;


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
                        hakenutHarkinnanvaraisesti: harkinnanvarainen || discretionary
                    }

                    model.hakutoiveetMap[oid] = hakutoive;
                    model.hakutoiveet.push(hakutoive);


                }

                HarkinnanvaraisestiHyvaksytty.get({hakemusOid: hakemusOid, hakuOid: hakuOid}, function (result) {

                    result.forEach(function(harkinnanvarainen){
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
                    latest.hakutoiveet.forEach(function(hakutoive){
                        if(model.hakutoiveetMap[hakutoive.hakukohdeOid]) {
                            // Sijoittelun tilan muutosta varten
                            hakutoive.hakutoiveenValintatapajonot.forEach(function(sijoittelu) {
                                sijoittelu.hakemusOid = model.hakemus.oid;
                            });
                            model.hakutoiveetMap[hakutoive.hakukohdeOid].sijoittelu = hakutoive.hakutoiveenValintatapajonot;
                        }
                    });

                    //fetch sijoittelun vastaanottotilat and extend hakutoiveet
                    SijoittelunVastaanottotilat.get({hakemusOid: model.hakemus.oid}, function (vastaanottotilat) {
                        if (vastaanottotilat.length > 0) {
                            vastaanottotilat.forEach(function (vastaanottoTila) {

                                if(model.hakutoiveetMap[vastaanottoTila.hakukohdeOid] &&
                                    model.hakutoiveetMap[vastaanottoTila.hakukohdeOid].sijoittelu) {
                                    model.hakutoiveetMap[vastaanottoTila.hakukohdeOid].sijoittelu.forEach(function(sijoittelu) {
                                        // Sijoittelun tilan muutosta varten
                                        sijoittelu.hakemusOid = model.hakemus.oid;
                                        if(sijoittelu.valintatapajonoOid == vastaanottoTila.valintatapajonoOid) {
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
                }, function (error) {
                    model.errors.push(error);
                });


                ValintakoetuloksetHakemuksittain.get({hakemusOid: model.hakemus.oid}, function (hakemus) {
                    hakemus.hakutoiveet.forEach(function (hakutoive) {

                        if(model.hakutoiveetMap[hakutoive.hakukohdeOid]) {
                            model.hakutoiveetMap[hakutoive.hakukohdeOid].valintakokeet = [];
                            hakutoive.valinnanVaiheet.forEach(function (valinnanVaihe) {

                                valinnanVaihe.valintakokeet.forEach(function (valintakoe) {
                                    var valintakoe = {
                                        jarjestysluku: valinnanVaihe.valinnanVaiheJarjestysluku,
                                        valinnanVaiheOid: valinnanVaihe.valinnanVaiheOid,
                                        valintakoeOid: valintakoe.valintakoeOid,
                                        valintakoeTunniste: valintakoe.valintakoeTunniste,
                                        osallistuminen: valintakoe.osallistuminenTulos.osallistuminen
                                    };

                                    model.hakutoiveetMap[hakutoive.hakukohdeOid].valintakokeet.push(valintakoe);

                                });

                            });
                        }
                    });



                    ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function (valintalaskenta) {
                        valintalaskenta.hakukohteet.forEach(function(hakukohde){
                            var hakutoive = model.hakutoiveetMap[hakukohde.hakukohdeoid];
                            if(hakutoive) {
                                hakutoive.valintalaskenta = hakukohde.valinnanvaihe;
                            }
                        })

                    }, function (error) {
                        model.errors.push(error);
                    });

                }, function (error) {
                    model.errors.push(error);
                });

            }, function (error) {
                model.errors.push(error);
            });

        }

        this.refreshIfNeeded = function (hakuOid, hakemusOid) {
            if (model.hakemus.oid !== hakemusOid || model.valintalaskentaHakemus.hakuoid !== hakuOid) {
                model.refresh(hakuOid, hakemusOid);
            }
        }

    }
    return model;
});

function HenkiloTiedotController($scope, $routeParams, HenkiloTiedotModel, AuthService, Pohjakuolutukset) {
    $scope.model = HenkiloTiedotModel;
    $scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid);
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.pohjakoulutukset = Pohjakuolutukset;

    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
    });
}