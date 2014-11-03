angular.module('valintalaskenta')

.factory('ErillishakuModel', ['$routeParams', '_', 'ValinnanvaiheListByHakukohde', 'JarjestyskriteeriMuokattuJonosija',
        'ValinnanVaiheetIlmanLaskentaa', 'HakukohdeHenkilotFull', 'Ilmoitus', 'IlmoitusTila', '$q', 'ValintaperusteetHakukohde',
        'ValintatapajonoSijoitteluStatus', 'ErillisHakuSijoitteluajoHakukohde', 'ErillishakuVienti', 'VastaanottoTilat','VastaanottoTila', 'HaunTiedot',
        function($routeParams, _, ValinnanvaiheListByHakukohde, JarjestyskriteeriMuokattuJonosija,
    ValinnanVaiheetIlmanLaskentaa, HakukohdeHenkilotFull, Ilmoitus, IlmoitusTila, $q, ValintaperusteetHakukohde,
    ValintatapajonoSijoitteluStatus, ErillisHakuSijoitteluajoHakukohde,ErillishakuVienti, VastaanottoTilat,VastaanottoTila,HaunTiedot) {
    "use strict";

    var model;
	model = new function() {

        this.hakuOid = "";
        this.hakukohdeOid = {};
        this.valintatapajonoOid = "";
        this.valinnanvaiheet = [];
        this.ilmanlaskentaa = [];
        this.errors = [];
        this.hakukohdeOid = "";
        this.tarjoajaOid = "";
        this.hakeneet = [];
        this.erillishakuDefer = $q.defer();
        this.vastaanottoTilat = [];
        this.lastValinnanVaihe = "";

        this.refresh = function(hakukohdeOid, hakuOid) {
            var defer = $q.defer();

            model.hakuOid = hakuOid;
            model.hakukohdeOid = {};
            model.valinnanvaiheet = [];
            model.ilmanlaskentaa = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.tarjoajaOid = "";
            model.hakeneet = [];
            model.erillishakuSijoitteluajoTulos = {};
            model.vastaanottoTilat = [];
            model.lastValinnanVaihe = "";

            HaunTiedot.get({hakuOid: hakuOid}, function(result) {
                model.haku = result;
            });

            ValintaperusteetHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.tarjoajaOid = result.tarjoajaOid;
            });
            ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.valinnanvaiheet = result;
                console.log(result);
                var found = false;
                _.some(model.valinnanvaiheet, function (valinnanvaihe) {
                    _.some(valinnanvaihe.valintatapajonot, function (valintatapajono) {
                        if(_.has(valintatapajono, 'sijoitteluajoId') && valintatapajono.sijoitteluajoId !== null) {

                            ErillisHakuSijoitteluajoHakukohde.get({hakukohdeOid: hakukohdeOid, hakuOid: hakuOid, sijoitteluajoId: valintatapajono.sijoitteluajoId}, function (result) {
                                model.erillishakuSijoitteluajoTulos = result;

                                _.forEach(model.erillishakuSijoitteluajoTulos.valintatapajonot, function (sijoitteluJono) {
                                    _.forEach(sijoitteluJono.hakemukset, function (sijoitteluHakemus) {
                                        _.forEach(valinnanvaihe.valintatapajonot, function (jono) {
                                            _.extend(_.find(jono.jonosijat, function (hakemus) {
                                                return hakemus.hakemusOid === sijoitteluHakemus.hakemusOid;
                                            }), {tilanKuvaukset: sijoitteluHakemus.tilanKuvaukset});
                                        });
                                    });
                                });

                                model.erillishakuDefer.resolve();
                            });
                            found = true;
                            model.lastValinnanVaihe = valinnanvaihe.valinnanvaiheoid;
                        }
                        return found;
                    });
                    return found;
                });

                _.forEach(model.valinnanvaiheet, function (valinnanvaihe) {
                    _.forEach(valinnanvaihe.valintatapajonot, function (valintatapajono) {
                        VastaanottoTilat.get({
                            hakukohdeOid: hakukohdeOid,
                            valintatapajonoOid: valintatapajono.oid
                        }, function (result) {
                            _.forEach(result, function (vastaanottotila) {
                                var jonosija = _.findWhere(valintatapajono.jonosijat, {hakemusOid: vastaanottotila.hakemusOid});
                                _.extend( jonosija, {
                                    muokattuVastaanottoTila: vastaanottotila.tila,
                                    muokattuIlmoittautumisTila: vastaanottotila.ilmoittautumisTila,
                                    hyvaksyttyVarasijalta: vastaanottotila.hyvaksyttyVarasijalta,
                                    julkaistavissa: vastaanottotila.julkaistavissa
                                });
                            });
                        });
                    });
                });

                ValinnanVaiheetIlmanLaskentaa.get({hakukohdeoid: hakukohdeOid}, function(result) {
                    model.ilmanlaskentaa = result;

                    if(result.length > 0) {
                        HakukohdeHenkilotFull.get({aoOid: hakukohdeOid, rows: 100000}, function (result) {
                            model.hakeneet = result;
                            model.ilmanlaskentaa.forEach(function (vaihe) {
                                vaihe.valintatapajonot = [];
                                vaihe.hakuOid = hakuOid;
                                vaihe.jonot.forEach(function(jono) {
                                    var tulosjono = {};
                                    tulosjono.oid = jono.oid;
                                    tulosjono.valintatapajonooid = jono.oid;
                                    tulosjono.prioriteetti = jono.prioriteetti;
                                    tulosjono.aloituspaikat = jono.aloituspaikat;

                                    if(jono.siirretaanSijoitteluun == null) {
                                        tulosjono.siirretaanSijoitteluun = true;
                                    } else {
                                        tulosjono.siirretaanSijoitteluun = jono.siirretaanSijoitteluun;
                                    }
                                    if(jono.valmisSijoiteltavaksi == null) {
                                        tulosjono.siirretaanSijoitteluun = true;
                                    } else {
                                        tulosjono.siirretaanSijoitteluun = jono.valmisSijoiteltavaksi;
                                    }
                                    if(jono.tasapistesaanto == null) {
                                        tulosjono.tasasijasaanto = 'ARVONTA'
                                    } else {
                                        tulosjono.tasasijasaanto = jono.tasapistesaanto;
                                    }
                                    if(jono.eiVarasijatayttoa == null) {
                                        tulosjono.eiVarasijatayttoa = false;
                                    } else {
                                        tulosjono.eiVarasijatayttoa = jono.eiVarasijatayttoa;
                                    }
                                    if(jono.kaikkiEhdonTayttavatHyvaksytaan == null) {
                                        tulosjono.kaikkiEhdonTayttavatHyvaksytaan = false;
                                    } else {
                                        tulosjono.kaikkiEhdonTayttavatHyvaksytaan = jono.kaikkiEhdonTayttavatHyvaksytaan;
                                    }
                                    if(jono.poissaOlevaTaytto == null) {
                                        tulosjono.poissaOlevaTaytto = false;
                                    } else {
                                        tulosjono.poissaOlevaTaytto = jono.poissaOlevaTaytto;
                                    }
                                    if(jono.kaytetaanValintalaskentaa == null) {
                                        tulosjono.kaytetaanValintalaskentaa = true;
                                    } else {
                                        tulosjono.kaytetaanValintalaskentaa = jono.kaytetaanValintalaskentaa;
                                    }

                                    tulosjono.nimi = jono.nimi;
                                    tulosjono.jonosijat = [];

                                    var jonosijat = _.chain(model.valinnanvaiheet)
                                        .filter(function(current) {return current.valinnanvaiheoid == vaihe.oid})
                                        .map(function(current) {return current.valintatapajonot})
                                        .first()
                                        .filter(function(tulosjono) {return tulosjono.oid == jono.oid})
                                        .map(function(tulosjono) {return tulosjono.jonosijat})
                                        .first()
                                        .value();

                                    model.hakeneet.forEach(function(hakija) {
                                        var jonosija = _.findWhere(jonosijat, {hakemusOid : hakija.oid});
                                        if(jonosija) {
                                            var krit = jonosija.jarjestyskriteerit[0];
                                            if(krit.tila != 'HYVAKSYTTAVISSA') {
                                                delete jonosija.jonosija
                                            } else {
                                                jonosija.jonosija = -(krit.arvo);
                                            }
                                            tulosjono.jonosijat.push(jonosija);
                                        } else {
                                            jonosija = {};
                                            jonosija.hakemusOid = hakija.oid;
                                            jonosija.hakijaOid = null;
                                            jonosija.prioriteetti = model.hakutoivePrioriteetti(hakija.oid);
                                            jonosija.harkinnanvarainen = false;
                                            jonosija.historiat = null;
                                            jonosija.syotetytArvot = [];
                                            jonosija.funktioTulokset = [];
                                            jonosija.muokattu = false;
                                            jonosija.sukunimi = hakija.answers.henkilotiedot.Sukunimi;
                                            jonosija.etunimi = hakija.answers.henkilotiedot.Etunimet;
                                            jonosija.jarjestyskriteerit = [
                                                {
                                                    arvo: null,
                                                    tila: "",
                                                    kuvaus: { },
                                                    prioriteetti: 0,
                                                    nimi: ""
                                                }
                                            ];
                                            tulosjono.jonosijat.push(jonosija);
                                        }

                                    });
                                    vaihe.valintatapajonot.push(tulosjono);

                                });
                            });
                            model.valinnanvaiheet.forEach(function(vaihe, index) {
                                vaihe.valintatapajonot.forEach(function(jono, i) {
                                    if(jono.kaytetaanValintalaskentaa == false) {
                                        vaihe.valintatapajonot.splice(i, 1);
                                    }
                                });
                                if(vaihe.valintatapajonot.length <= 0) {
                                    model.valinnanvaiheet.splice(index, 1);
                                }
                            });
                            defer.resolve();
                        }, function (error) {
                            model.errors.push(error);
                            defer.reject("hakukohteen tietojen hakeminen epäonnistui");
                        });
                    }
                }, function(error) {
                    model.errors.push(error);
                    defer.reject("hakukohteen tietojen hakeminen epäonnistui");
                });
            }, function(error) {
                model.errors.push(error);
                defer.reject("hakukohteen tietojen hakeminen epäonnistui");
            });

            return defer.promise;
        };

        this.hakutoivePrioriteetti = function(hakemusoid) {
            var hakija = _.findWhere(model.hakeneet, {oid:hakemusoid});
            if (!hakija) {
                return -1;
            }
            var toive = (_.invert(hakija.answers.hakutoiveet))[model.hakukohdeOid];

            if(toive) {
                return parseInt(toive.substring(10,11));
            } else {
                return -1;
            }
        };

        this.muutaSijoittelunStatus = function(jono, status) {
            ValintatapajonoSijoitteluStatus.put({valintatapajonoOid: jono.oid, status: status},function(result) {
                jono.valmisSijoiteltavaksi = status;
                Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
            }, function(error) {
                Ilmoitus.avaa("Tallennus epäonnistui", "Tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.", IlmoitusTila.ERROR);
            });
        };

        this.updateHakemuksienTila = function (valintatapajono) {
            var jonoonLiittyvat = _.filter(model.erillishakuSijoitteluajoTulos.valintatapajonot, function(jono) {
                return jono.oid === valintatapajono.oid;
            });

            var halututTilat = ["HYVAKSYTTY", "VARLLA", "VARASIJALTA_HYVAKSYTTY", "HYLATTY"];
            var muokatutHakemukset = _.flatten(_.map(jonoonLiittyvat, function(liittyvaJono) {
                return liittyvaJono.hakemukset;
            }));

            _.forEach(muokatutHakemukset, function (mHakemus) {
                _.extend(
                    mHakemus,
                    _.pick(_.findWhere(valintatapajono.jonosijat, {hakemusOid: mHakemus.hakemusOid}),
                        'julkaistavissa','muokattuIlmoittautumisTila', 'muokattuVastaanottoTila', 'hyvaksyttyVarasijalta')
                );

            });

            console.log('muokatut hakemukset', muokatutHakemukset);
            model.updateVastaanottoTila("Massamuokkaus", muokatutHakemukset, valintatapajono.oid, function(success){
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
                if (hakemus.muokattuVastaanottoTila === '' || hakemus.muokattuVastaanottoTila === undefined) {
                    hakemus.muokattuVastaanottoTila = 'KESKEN';
                }
                if (hakemus.muokattuIlmoittautumisTila === '' || hakemus.muokattuIlmoittautumisTila === undefined) {
                    hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
                }
                return {
                    tila: hakemus.muokattuVastaanottoTila,
                    ilmoittautumisTila: hakemus.muokattuIlmoittautumisTila,
                    valintatapajonoOid: valintatapajonoOid,
                    hakemusOid: hakemus.hakemusOid,
                    julkaistavissa: hakemus.julkaistavissa,
                    hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta
                };
            });

            console.log('tilaObj', tilaObj);

            VastaanottoTila.post(tilaParams, tilaObj, function (result) {
                Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
            }, function (error) {
                Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
            });
        };


	};

	return model;
}])



    .controller('ErillishakuController', ['$scope', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti','ErillishakuModel',
        'TulosXls', 'HakukohdeModel', '$http', 'AuthService', 'UserModel','SijoitteluntulosModel', '_', 'LocalisationService',
    function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti,ErillishakuModel, TulosXls, HakukohdeModel, $http, AuthService, UserModel, SijoitteluntulosModel, _, LocalisationService) {
    "use strict";

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ErillishakuModel;
    ErillishakuModel.refresh($scope.hakukohdeOid, $scope.hakuOid);
    $scope.hakukohdeModel = HakukohdeModel;
    SijoitteluntulosModel.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);


    var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.pageSize = 50;
    $scope.currentPage = [];
    $scope.filteredResults = [];

    $scope.model.erillishakuDefer.promise.then(function () {
        $scope.fetch = true;
    });

/*
    var promise = $scope.model.refresh($scope.hakukohdeOid, $scope.hakuOid);
    AuthService.crudOph("APP_VALINTOJENTOTEUTTAMINEN").then(function(){
        $scope.updateOph = true;
        $scope.jkmuokkaus = true;
    });

    hakukohdeModelpromise.then(function () {
        AuthService.crudOrg("APP_VALINTOJENTOTEUTTAMINEN", HakukohdeModel.hakukohde.tarjoajaOid).then(function () {
            $scope.crudOrg = true;
        });
    });
    */

    $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOid', function () {
        AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOid).then(function () {
            $scope.updateOrg = true;

        });

    });

    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
        $scope.jkmuokkaus = true;
    });

    $scope.hakemuksenMuokattuIlmoittautumisTilat = [
        {value: "EI_TEHTY", text: "sijoitteluntulos.enrollmentinfo.notdone", default_text:"Ei tehty"},
        {value: "LASNA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.present", default_text:"Läsnä (koko lukuvuosi)"},
        {value: "POISSA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.notpresent", default_text:"Poissa (koko lukuvuosi)"},
        {value: "EI_ILMOITTAUTUNUT", text: "sijoitteluntulos.enrollmentinfo.noenrollment", default_text:"Ei ilmoittautunut"},
        {value: "LASNA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.presentfall", default_text:"Läsnä syksy, poissa kevät"},
        {value: "POISSA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.notpresentfall", default_text:"Poissa syksy, läsnä kevät"},
        {value: "LASNA", text: "sijoitteluntulos.enrollmentinfo.presentspring", default_text:"Läsnä, keväällä alkava koulutus"},
        {value: "POISSA", text: "sijoitteluntulos.enrollmentinfo.notpresentspring", default_text:"Poissa, keväällä alkava koulutus"}
    ];

    LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuIlmoittautumisTilat).then(function () {

        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

    });

    $scope.user = UserModel;
    UserModel.refreshIfNeeded().then(function(){
        $scope.jkmuokkaus = UserModel.isKKUser;
        $scope.jkmuokkaus = true;
    });

        $scope.getHakijanSijoitteluTulos = function (valintatapajono, hakija) {
            var jono = _.find($scope.model.erillishakuSijoitteluajoTulos.valintatapajonot, function (item) {
                return item.oid === valintatapajono.oid;
            });

            if(!_.isEmpty(jono)) {
                return _.find(jono.hakemukset, function (item) {
                    return item.hakijaOid === hakija.hakijaOid;
                });
            }
        };

        for (var i = 0; i < 1000; i++) {
            $scope.currentPage[i] = [];
            $scope.filteredResults[i] = [];
            for (var j = 0; j < 1000; j++) {
                $scope.currentPage[i][j] = 1;
            }
        }

        $scope.valintatapajonoVientiXlsx = function(valintatapajonoOid) {
            ValintatapajonoVienti.vie({
                    valintatapajonoOid: valintatapajonoOid,
                    hakukohdeOid: $scope.hakukohdeOid,
                    hakuOid: $routeParams.hakuOid},
                {}, function (id) {
                    Latausikkuna.avaa(id, "Valintatapajonon vienti taulukkolaskentaan", "");
                }, function () {
                    Ilmoitus.avaa("Valintatapajonon vienti epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
                });
        };

        $scope.valintatapajonoTuontiXlsx = function(valintatapajonoOid, $files) {
            var file = $files[0];
            var fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            var hakukohdeOid = $scope.hakukohdeOid;
            var hakuOid = $routeParams.hakuOid;
            fileReader.onload = function(e) {
                $scope.upload = $upload.http({
                    url: VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintatapajonolaskenta/tuonti?hakuOid=" +hakuOid + "&hakukohdeOid=" +hakukohdeOid + "&valintatapajonoOid="+ valintatapajonoOid, //upload.php script, node.js route, or servlet url
                    method: "POST",
                    headers: {'Content-Type': 'application/octet-stream'},
                    data: e.target.result
                }).progress(function(evt) {
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(id, status, headers, config) {
                    Latausikkuna.avaaKustomoitu(id, "Valintatapajonon tuonti", "", "../common/modaalinen/tuontiikkuna.html",
                        function(dokumenttiId) {
                            // tee paivitys
                            $scope.model.refresh(hakukohdeOid, hakuOid);
                        }
                    );
                }).error(function(data) {
                    //error
                });
            };
        };

        $scope.valintalaskentaTulosXLS = function() {
            TulosXls.query({hakukohdeOid:$routeParams.hakukohdeOid});
        };

        $scope.showHistory = function(valintatapajonoOid, hakemusOid) {
            $location.path('/valintatapajono/' + valintatapajonoOid + '/hakemus/' + hakemusOid + '/valintalaskentahistoria');
        };

        $scope.showTilaPartial = function(valintatulos) {
            if(valintatulos.showTilaPartial === null || valintatulos.showTilaPartial === false) {
                valintatulos.showTilaPartial = true;
            } else {
                valintatulos.showTilaPartial = false;
            }
        };
        $scope.showHenkiloPartial = function(valintatulos) {
            if(valintatulos.showHenkiloPartial === null || valintatulos.showHenkiloPartial === false) {
                valintatulos.showHenkiloPartial = true;
            } else {
                valintatulos.showHenkiloPartial = false;
            }
        };


        $scope.submit = function (valintatapajonoOid) {
            $scope.model.updateHakemuksienTila(valintatapajonoOid);
        };






        //$scope.submit = function (vaiheoid, jonooid) {
        //    ValintalaskentatulosModel.submit(vaiheoid, jonooid);
        //};

        $scope.muutaSijoittelunStatus = function (jono, status) {
            ValintalaskentatulosModel.muutaSijoittelunStatus(jono, status);
        };

        $scope.changeTila = function (jonosija, value) {
            if (_.isNumber(value)) {
                $timeout(function(){
                    jonosija.tuloksenTila = "HYVAKSYTTAVISSA";
                });
            } else {
                $timeout(function(){
                    jonosija.tuloksenTila = "";
                    delete jonosija.jonosija;
                });
            }

        };

        $scope.changeSija = function (jonosija, value) {
            if (value !== 'HYVAKSYTTAVISSA') {
                $timeout(function(){
                    delete jonosija.jonosija;
                });
            }

        };
        $scope.erillishaunVientiXlsx = function() {
        	ErillishakuVienti.vie({
        		hakukohdeOid: $scope.hakukohdeOid,
        		hakuOid: $routeParams.hakuOid,
        		tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOid,
        		valintatapajonoOid: $scope.model.valintatapajonoOid,
        	},
        		{}, function (id) {
                Latausikkuna.avaa(id, "Erillishaun hakukohteen vienti taulukkolaskentaan", "");
            }, function () {
                Ilmoitus.avaa("Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
            });
        };
        $scope.erillishaunTuontiXlsx = function($files) {
    		var file = $files[0];
    		var fileReader = new FileReader();
    	    fileReader.readAsArrayBuffer(file);
    	    var hakukohdeOid = $scope.hakukohdeOid;
    	    var hakuOid = $routeParams.hakuOid;
    	    var tarjoajaOid = $scope.hakukohdeModel.hakukohde.tarjoajaOid;
    	    var valintatapajonoOid = $scope.model.valintatapajonoOid;
    	    fileReader.onload = function(e) {
    			$scope.upload = $upload.http({
    	    		url: VALINTALASKENTAKOOSTE_URL_BASE + "resources/erillishaku/tuonti?hakuOid=" +hakuOid + "&hakukohdeOid=" +hakukohdeOid
    	    		+"&tarjoajaOid="+ tarjoajaOid+"&valintatapajonoOid="+valintatapajonoOid, //upload.php script, node.js route, or servlet url
    				method: "POST",
    				headers: {'Content-Type': 'application/octet-stream'},
    				data: e.target.result
    			}).progress(function(evt) {
    				//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    			}).success(function(id, status, headers, config) {
    				Latausikkuna.avaaKustomoitu(id, "Erillishaun hakukohteen tuonti", "", "../common/modaalinen/tuontiikkuna.html",
    	            function(dokumenttiId) {
    	            	// tee paivitys
    	            	$scope.model.refresh(hakukohdeOid, hakuOid);
    	            }
    	            );
    			}).error(function(data) {
    			    //error
    			});
    	    };
    	};
}]);
