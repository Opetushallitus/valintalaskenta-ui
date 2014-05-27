app.factory('ValintalaskentatulosModel', function(
    ValinnanvaiheListByHakukohde,
    JarjestyskriteeriMuokattuJonosija,
    ValinnanVaiheetIlmanLaskentaa,
    HakukohdeHenkilotFull,
    Ilmoitus,
    IlmoitusTila) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.valinnanvaiheet = [];
        this.errors = [];

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
		
		this.refresh = function(hakukohdeOid) {
		    model.hakukohdeOid = {};
            model.valinnanvaiheet = [];
            model.ilmanlaskentaa = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakeneet = [];
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			    model.valinnanvaiheet = result;
                ValinnanVaiheetIlmanLaskentaa.get({hakukohdeoid: hakukohdeOid}, function(result) {
                    model.ilmanlaskentaa = result;
                    HakukohdeHenkilotFull.get({aoOid: hakukohdeOid, rows: 100000}, function (result) {
                        model.hakeneet = result;

                        model.ilmanlaskentaa.forEach(function (vaihe) {
                            vaihe.valintatapajonot = [];
                            vaihe.jonot.forEach(function(jono) {
                                var tulosjono = {};
                                tulosjono.oid = jono.oid;
                                tulosjono.valintatapajonooid = jono.oid;
                                tulosjono.prioriteetti = jono.prioriteetti;
                                tulosjono.aloituspaikat = jono.aloituspaikat;

                                tulosjono.siirretaanSijoitteluun = jono.siirretaanSijoitteluun;
                                tulosjono.tasasijasaanto = jono.tasasijasaanto;
                                tulosjono.eiVarasijatayttoa = jono.eiVarasijatayttoa;
                                tulosjono.kaikkiEhdonTayttavatHyvaksytaan = jono.kaikkiEhdonTayttavatHyvaksytaan;
                                tulosjono.poissaOlevaTaytto = jono.poissaOlevaTaytto;
                                tulosjono.kaytetaanValintalaskentaa = jono.kaytetaanValintalaskentaa;

                                tulosjono.nimi = jono.nimi;
                                tulosjono.jonosijat = [];
                                model.hakeneet.forEach(function(hakija) {

                                    var vaiheet = angular.copy(model.valinnanvaiheet);
                                    var jonosijat = _.chain(vaiheet)
                                        .filter(function(current) {return current.valinnanvaiheoid == vaihe.oid})
                                        .map(function(current) {return current.valintatapajonot}).first()
                                        .filter(function(tulosjono) {return tulosjono.oid == jono.oid})
                                        .map(function(tulosjono) {return tulosjono.jonosijat}).first().value();

                                    var jonosija = _.findWhere(jonosijat, {hakemusOid : hakija.oid});

                                    if(jonosija) {
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
                    }, function (error) {
                        model.errors.push(error);
                    });
                }, function(error) {
                    model.errors.push(error);
                })
			}, function(error) {
                model.errors.push(error);
            });

		};

        this.submit = function (vaiheoid, jonooid) {
            var vv = _.findWhere(model.ilmanlaskentaa, {valinnanvaiheoid:vaiheoid});
            if(vv) {
                var vaihe = {};
                angular.copy(vv, vaihe);
                angular.copy(vv.valintatapajonot, vaihe.valintatapajonot);
                vaihe.valinnanvaiheoid = vaihe.oid;
                var yksijono = _.findWhere(vaihe.valintatapajonot, {valintatapajonooid:jonooid});

                vaihe.valintatapajonot = [yksijono];
                // Suodatetaan pois hakemukset joille ei ole merkitty jonosijaa ja asetetaan pisteiksi jonosijan negaatio
                var suodatetutSijat = _.chain(yksijono.jonosijat)
                    .filter(function(sija) {
                        return (!_.isUndefined(sija.tuloksenTila) && sija.tuloksenTila != '')
                    }).map(function(sija) {
                        if(_.isUndefined(sija.jonoSija && _.isNumber(sija.jonosija))) {
                            sija.jarjestyskriteerit[0].arvo = -(sija.jonosija);
                        } else {
                            delete sija.jarjestyskriteerit[0].arvo;
                        }
                        if(_.isUndefined(sija.prioriteetti) || sija.prioriteetti == 0) {
                            sija.prioriteetti = model.hakutoivePrioriteetti(sija.hakemusOid);
                        }
                        sija.jarjestyskriteerit[0].tila = sija.tuloksenTila;
                        return sija;
                    }).value();

                vaihe.valintatapajonot[0].jonosijat = suodatetutSijat;

                ValinnanvaiheListByHakukohde.post({hakukohdeoid: model.hakukohdeOid}, vaihe, function(result) {
                    Ilmoitus.avaa("Tallennus onnistui", "Valintatulosten tallennus onnistui.");
                }, function(error) {
                    Ilmoitus.avaa("Tallennus epäonnistui", "Valintatulosten tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.", IlmoitusTila.ERROR);
                });

            }
        };

	};

	return model;
});


function ValintalaskentatulosController($scope, $location, $routeParams, $timeout, ValintalaskentatulosModel, TulosXls, HakukohdeModel, $http, AuthService) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ValintalaskentatulosModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refresh($scope.hakukohdeOid);
    
    $scope.valintalaskentaTulosXLS = function() {
    	TulosXls.query({hakukohdeOid:$routeParams.hakukohdeOid});
    };

    $scope.showHistory = function(valintatapajonoOid, hakemusOid) {
        $location.path('/valintatapajono/' + valintatapajonoOid + '/hakemus/' + hakemusOid + '/valintalaskentahistoria');
    };

    $scope.showTilaPartial = function(valintatulos) {
         if(valintatulos.showTilaPartial == null || valintatulos.showTilaPartial == false) {
             valintatulos.showTilaPartial = true;
         } else {
             valintatulos.showTilaPartial = false;
         }
    };
    $scope.showHenkiloPartial = function(valintatulos) {
        if(valintatulos.showHenkiloPartial == null || valintatulos.showHenkiloPartial == false) {
            valintatulos.showHenkiloPartial = true;
        } else {
            valintatulos.showHenkiloPartial = false;
        }
    };

    AuthService.crudOph("APP_VALINTOJENTOTEUTTAMINEN").then(function(){
        $scope.updateOph = true;
    });

    $scope.submit = function (vaiheoid, jonooid) {
        ValintalaskentatulosModel.submit(vaiheoid, jonooid);
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
        if (value != 'HYVAKSYTTAVISSA') {
            $timeout(function(){
                delete jonosija.jonosija;
            });
        }

    };

    $scope.limit = 20;
    $scope.lazyLoading = function() {
        $scope.showLoading = true;
        $timeout(function(){
            $scope.limit += 50;
            $scope.showLoading = false;
        }, 10);
    };

}
