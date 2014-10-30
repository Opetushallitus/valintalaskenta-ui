angular.module('valintalaskenta')

.factory('ErillishakuModel', ['$routeParams', '_', 'ValinnanvaiheListByHakukohde', 'JarjestyskriteeriMuokattuJonosija',
        'ValinnanVaiheetIlmanLaskentaa', 'HakukohdeHenkilotFull', 'Ilmoitus', 'IlmoitusTila', '$q', 'ValintaperusteetHakukohde', 
        'ValintatapajonoSijoitteluStatus', 'ErillisHakuSijoitteluajoHakukohde', 'ErillishakuVienti',
        function($routeParams, _, ValinnanvaiheListByHakukohde, JarjestyskriteeriMuokattuJonosija,
    ValinnanVaiheetIlmanLaskentaa, HakukohdeHenkilotFull, Ilmoitus, IlmoitusTila, $q, ValintaperusteetHakukohde, 
    ValintatapajonoSijoitteluStatus, ErillisHakuSijoitteluajoHakukohde,ErillishakuVienti) {
    "use strict";

    var model;
	model = new function() {

        this.hakukohdeOid = {};
        this.valintatapajonoOid = "";
        this.valinnanvaiheet = [];
        this.ilmanlaskentaa = [];
        this.errors = [];
        this.hakukohdeOid = "";
        this.tarjoajaOid = "";
        this.hakeneet = [];


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
            model.erillishakuSijoitteluajoTulos = {};

            ValintaperusteetHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.tarjoajaOid = result.tarjoajaOid;
            });
            ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.valinnanvaiheet = result;

                var found = false;
                var def = $q.defer();
                _.some(model.valinnanvaiheet, function (valinnanvaihe) {
                    _.some(valinnanvaihe.valintatapajonot, function (valintatapajono) {
                        if(_.has(valintatapajono, 'sijoitteluajoId')) {
                            ErillisHakuSijoitteluajoHakukohde.get({hakukohdeOid: hakukohdeOid, hakuOid: hakuOid, sijoitteluajoId: valintatapajono.sijoitteluajoId}, function (result) {
                                model.erillishakuSijoitteluajoTulos = result;
                                def.resolve(result);
                            });
                            found = true;
                        }
                        return found;
                    });
                    return found;
                });

                def.promise.then(function (tulos) {

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


	};

	return model;
}])



    .controller('ErillishakuController', ['$scope', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti','ErillishakuModel',
        'TulosXls', 'HakukohdeModel', '$http', 'AuthService', 'UserModel','SijoitteluntulosModel',
    function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti,ErillishakuModel, TulosXls, HakukohdeModel, $http, AuthService, UserModel, SijoitteluntulosModel) {
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

    $scope.user = UserModel;
    UserModel.refreshIfNeeded().then(function(){
        $scope.jkmuokkaus = UserModel.isKKUser;
    });


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
