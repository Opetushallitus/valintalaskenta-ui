app.factory('ValintalaskentatulosModel', function($routeParams, ValinnanvaiheListByHakukohde, JarjestyskriteeriMuokattuJonosija,
    ValinnanVaiheetIlmanLaskentaa, HakukohdeHenkilotFull, Ilmoitus, IlmoitusTila, $q, ValintaperusteetHakukohde, ValintatapajonoSijoitteluStatus) {
    "use strict";

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
		
		this.refresh = function(hakukohdeOid, hakuOid) {
            var defer = $q.defer();

		    model.hakukohdeOid = {};
            model.valinnanvaiheet = [];
            model.ilmanlaskentaa = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.tarjoajaOid = "";
            model.hakeneet = [];
            ValintaperusteetHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.tarjoajaOid = result.tarjoajaOid;
            });
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			    model.valinnanvaiheet = result;
            	ValinnanVaiheetIlmanLaskentaa.get({hakukohdeoid: hakukohdeOid}, function(result) {
                    model.ilmanlaskentaa = result;
                    if(result.length > 0) {
                        HakukohdeHenkilotFull.get({aoOid: hakukohdeOid, rows: 100000, asId: hakuOid}, function (result) {
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
                        return (!_.isUndefined(sija.tuloksenTila) && sija.tuloksenTila !== '');
                    }).map(function(sija) {
                        if(_.isUndefined(sija.jonoSija && _.isNumber(sija.jonosija))) {
                            sija.jarjestyskriteerit[0].arvo = -(sija.jonosija);
                        } else {
                            delete sija.jarjestyskriteerit[0].arvo;
                        }
                        if(_.isUndefined(sija.prioriteetti) || sija.prioriteetti === 0) {
                            sija.prioriteetti = model.hakutoivePrioriteetti(sija.hakemusOid);
                        }
                        sija.jarjestyskriteerit[0].tila = sija.tuloksenTila;
                        return sija;
                    }).value();

                vaihe.valintatapajonot[0].jonosijat = suodatetutSijat;

                ValinnanvaiheListByHakukohde.post({hakukohdeoid: model.hakukohdeOid, tarjoajaOid: model.tarjoajaOid}, vaihe, function(result) {
                	model.refresh($routeParams.hakukohdeOid, $routeParams.hakuOid);
                    Ilmoitus.avaa("Tallennus onnistui", "Valintatulosten tallennus onnistui.");
                }, function(error) {
                    Ilmoitus.avaa("Tallennus epäonnistui", "Valintatulosten tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.", IlmoitusTila.ERROR);
                });

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

	}();

	return model;
});


angular.module('valintalaskenta').
    controller('ValintalaskentatulosController', ['$scope', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti','ValintalaskentatulosModel',
        'TulosXls', 'HakukohdeModel', '$http', 'AuthService', 'UserModel',
    function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti,ValintalaskentatulosModel, TulosXls, HakukohdeModel, $http, AuthService, UserModel) {
    "use strict";

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ValintalaskentatulosModel;
    $scope.hakukohdeModel = HakukohdeModel;

    var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.pageSize = 50;

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

        $scope.user = UserModel;
        UserModel.refreshIfNeeded().then(function(){
            $scope.jkmuokkaus = UserModel.isKKUser;
        });


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









    $scope.submit = function (vaiheoid, jonooid) {
        ValintalaskentatulosModel.submit(vaiheoid, jonooid);
    };

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




}]);
