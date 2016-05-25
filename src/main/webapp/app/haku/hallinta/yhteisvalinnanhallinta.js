
app.factory('VirheModel', function (HakuVirheet) {
    "use strict";

    var factory = (function () {
        var instance = {};
        instance.valintalaskenta = [];
        instance.valintakoe = [];

        instance.refresh = function (oid) {

            HakuVirheet.get({parentOid: oid, virhetyyppi: 'virheet'}, function (result) {
                if (result.length > 0) {
                    instance.valintalaskenta = result;
                } else {
                    instance.eiLaskentaVirheita = true;
                }
            });

            HakuVirheet.get({parentOid: oid, virhetyyppi: 'valintakoevirheet'}, function (result) {
                if (result.length > 0) {
                    instance.valintakoe = result;
                } else {
                    instance.eiKoeVirheita = true;
                }
            });
        };

        return instance;
    })();

    return factory;

});


angular.module('valintalaskenta').
    controller('YhteisvalinnanHallintaController',['$scope', '$modal', '$interval', '_', 
        'SijoittelunTulosTaulukkolaskenta','SijoittelunTulosOsoitetarrat', 'SijoittelunTulosHyvaksymiskirjeet', 
        'Jalkiohjauskirjepohjat', 'AktivoiKelaFtp',
        '$log', '$timeout', '$q','$location', 
        'Ilmoitus', 'KelaDokumentti', 'Latausikkuna', '$routeParams',
        '$http', '$route', '$window', 'SijoitteluAjo', 'JalkiohjausXls', 'Jalkiohjauskirjeet', 'SijoitteluAktivointi',
        'HakuModel', 'VirheModel', 'JatkuvaSijoittelu', 'IlmoitusTila', 'SeurantaPalveluHaunLaskennat', 'Korkeakoulu',
        'CustomHakuUtil','Hyvaksymiskirjepohjat',
        function ($scope, $modal, $interval, _, 
        		SijoittelunTulosTaulukkolaskenta,SijoittelunTulosOsoitetarrat, SijoittelunTulosHyvaksymiskirjeet, 
        		Jalkiohjauskirjepohjat, AktivoiKelaFtp, 
        		$log, $timeout, $q, $location, 
        		Ilmoitus, KelaDokumentti, Latausikkuna, $routeParams,
                $http, $route, $window, SijoitteluAjo, JalkiohjausXls, Jalkiohjauskirjeet, SijoitteluAktivointi,
                HakuModel, VirheModel, JatkuvaSijoittelu, IlmoitusTila, SeurantaPalveluHaunLaskennat, Korkeakoulu,
                CustomHakuUtil,Hyvaksymiskirjepohjat) {
    "use strict";
    $scope.naytetaanHaut = false;
    $scope.kaikkiHautValittu = false;
    $scope.customHakuUtil = CustomHakuUtil;
    $scope.hakuvuodet = [];
    $scope.kelafilter = null;
    $scope.kelaUpdate = function(kelafilter) {
        $scope.kelafilter = kelafilter;
    }
    $scope.jatkuva = {};
    $scope.korkeakoulu = Korkeakoulu;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE;
    $scope.VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE;
    if(_.isEmpty(HakuModel.deferred)) { HakuModel.init($routeParams.hakuOid) }
    $scope.hakumodel = HakuModel;
    HakuModel.promise.then(function(h){
        $scope.iskorkeakoulu = $scope.korkeakoulu.isKorkeakoulu(h.hakuOid.kohdejoukkoUri);
    });

    $scope.nullIsUndefined = function(value) {
        if(value) {
            return value;
        }
    };
    $scope.aktivoiValintalaskentaKerralla = function () {
    	var hakuoid = $routeParams.hakuOid;
    	var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/seurantaikkuna.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        kokoHaku: true
                    };
                }
            }
        });
    };
    $scope.prosentteina = function(a, b) {
    	return Math.round((a / b)*100);
    };
    $scope.uudelleenYritaLaskentaa = function($event, laskenta) {
    	$event.stopPropagation();
    	var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/seurantaikkuna.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        uuid: laskenta.uuid,
                        laskenta: laskenta
                    };
                }
            }
        });
    };
    


    $scope.virheet = VirheModel;
    $scope.naytaKokeita = 50;
    // KELA TAULUKON CHECKBOXIT ALKAA

    $scope.maxdate =  new Date();
    $scope.maxdate.setDate($scope.maxdate.getDate()-1);
    $scope.aineistonnimi = "";
    $scope.isNotBlank = function (str) {
        if (!str || str.length === 0 || str === "" || typeof str === 'undefined' || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g, "") === "") {
            return false;
        } else {
            return true;
        }
    };
    $scope.yksittainenhakukohde = { hakukohteitaYhteensa: 1 };
    $scope.notequals = function(actual, expected) {
    	return !angular.equals(expected, actual);
    };
    $scope.naytaHaunLaskennat = false;
    $scope.haunLaskennat = [];
    $scope.updateHaunLaskennat = function() {
    	if(SeurantaPalveluHaunLaskennat.hae) {
	    	SeurantaPalveluHaunLaskennat.hae({hakuoid: $routeParams.hakuOid, tyyppi: "HAKU"}, function(laskennat) {
	    		$scope.haunLaskennat = laskennat;
	    	});
    	}
    };

    $scope.isValittu = function (haku) {
        if (haku.oid === $routeParams.hakuOid) {
            return true;
        }
        else {
            return haku.valittu;
        }

    }
    $scope.checkAllWith = function (kaikkienTila) {
        _.each($scope.hakumodel.haut, function (haku) {
            haku.valittu = kaikkienTila;
        });
    };
    $scope.checkAllWithFilter = function () {
        _.each($scope.hakumodel.haut, function (haku) {
            var ok = true;
            //{hakuvuosi: 2013, hakukausi: "kausi_s", hakutapa: "hakutapa_01", kohdejoukko: "haunkohdejoukko_10", hakutyyppi: "hakutyyppi_03"}
            if($scope.kelafilter.hakuvuosi) {
                if(haku.hakukausiVuosi != $scope.kelafilter.hakuvuosi) {
                    ok = false;
                }
            }
            if($scope.kelafilter.hakukausi) {
                if(haku.hakukausiUri.indexOf($scope.kelafilter.hakukausi) === 0) {

                } else {
                    ok = false;
                }
            }
            if($scope.kelafilter.hakutapa) {
                if(haku.hakutapaUri.indexOf($scope.kelafilter.hakutapa) === 0) {

                } else {
                    ok = false;
                }
            }
            if($scope.kelafilter.kohdejoukko) {
                if(haku.kohdejoukkoUri.indexOf($scope.kelafilter.kohdejoukko) === 0) {

                } else {
                    ok = false;
                }
            }
            if($scope.kelafilter.hakutyyppi) {
                if(haku.hakutyyppiUri.indexOf($scope.kelafilter.hakutyyppi) === 0) {

                } else {
                    ok = false;
                }
            }
            if(ok) {
                haku.valittu = $scope.kaikkiHautValittu;
            }
        });
    };
    $scope.switchChecked = function() {
        $scope.kaikkiHautValittu = !$scope.kaikkiHautValittu;
        $scope.checkAllWithFilter();
    }
    $scope.checkAllWith(false);
    $scope.naytaHaut = function () {
        $scope.naytetaanHaut = true;
    };
    $scope.filterValitut = function () {
        return _.filter($scope.hakumodel.haut, function (haku) {
            return $scope.isValittu(haku);
        });
    };

    $scope.muodostaKelaDokumentti = function (alku,loppu,nimi) {
    	alku.setHours(0,0,0,0);
    	loppu.setHours(23,59,59,999);
        var hakuOids = _.map($scope.filterValitut(), function (haku) {
            return haku.oid;
        });
        KelaDokumentti.post({},
            {
                aineisto: nimi,
                alkupvm: alku,
                loppupvm: loppu,
                hakuOids: hakuOids
            },
            function (id) {
                Latausikkuna.avaaKustomoitu(id, "Kela-dokumentin luonti", "", "haku/hallinta/modaalinen/kelaikkuna.html",
                    function (dokumenttiId) {

                        AktivoiKelaFtp.post({}, dokumenttiId, function (success) {
                            Ilmoitus.avaa("Kela-dokumentin ftp-siirto onnistui", "Ftp-siirto onnistui");
                        }, function () {
                            Ilmoitus.avaa("Kela-dokumentin ftp-siirto epäonnistui", "Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
                        });

                    }
                );
            }, function () {
                Ilmoitus.avaa("Kela-dokumentin luonnin aloitus epäonnistui", "Kela-dokumentin luonnin aloitus epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
            });
    };
    // KELA TAULUKON CHECKBOXIT LOPPUU
    SijoitteluAjo.get({hakuOid: $routeParams.hakuOid, sijoitteluajoOid: 'latest'}, function (result) {
        $scope.sijoitteluModel = result;
    });
    $scope.sijoittelunTuloksetHyvaksymiskirjeiksi = function() {
        var hakuoid = $routeParams.hakuOid;
        SijoittelunTulosHyvaksymiskirjeet.aktivoi({hakuOid: hakuoid}, {}, function (id) {
            Latausikkuna.avaa(id, "Sijoitteluntulokset hyväksymiskirjeiksi", "", {});
        }, function () {
            Ilmoitus.avaa("Sijoittelun tulokset hyväksymiskirjeiksi epäonnistui", "Sijoittelun tulokset hyväksymiskirjeiksi epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });
    };

    $scope.muodostaKirjeet = function(hyvaksymiskirje, langcode, iposti) {
        console.log("is hyvaksymiskirje? " + (hyvaksymiskirje == true));
        console.log("is iposti? " + (iposti == true));
        console.log("using language " + langcode);
        if(hyvaksymiskirje) {
            $scope.muodostaHyvaksymiskirjeet(langcode, iposti);
        } else {
            $scope.muodostaJalkiohjauskirjeet(langcode, iposti);
        }
    }

    $scope.muodostaHyvaksymiskirjeet = function (langcode, iposti) {
        var hakuOid = $routeParams.hakuOid;
        var templateName = "hyvaksymiskirje";
        var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        otsikko: "Hyväksymiskirjeet",
                        toimintoNimi: "Muodosta hyväksymiskirjeet",
                        toiminto: function(sisalto) {
                            SijoittelunTulosHyvaksymiskirjeet.aktivoi({
                                hakuOid: hakuOid,
                                asiointikieli: langcode,
                                sahkoposti: !iposti,
                                letterBodyText: sisalto
                            }, {}, function (id) {
                                Latausikkuna.avaa(id, "Hyväksymiskirjeet", "");
                            }, function () {

                            });
                        },
                        showDateFields: true,
                        hakuOid: $routeParams.hakuOid,
                        pohjat: function() {
                            return Hyvaksymiskirjepohjat.get({templateName: templateName, languageCode: langcode, tag: hakuOid, applicationPeriod: hakuOid});
                        }
                    };
                }
            }
        });
    };

    $scope.muodostaJalkiohjauskirjeet = function (langcode, iposti) {
        var isKorkeakoulu = $scope.korkeakoulu.isKorkeakoulu($scope.hakumodel.hakuOid.kohdejoukkoUri);
        var hakuOid = $routeParams.hakuOid;
    	var tag = $routeParams.hakuOid;
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
                    sahkoposti: !iposti,
					        	tag: tag, templateName: "jalkiohjauskirje"}, {hakemusOids: null,letterBodyText:sisalto, languageCode: langcode} , function (id) {
					            Latausikkuna.avaa(id, latausikkunaTeksti, "");
					        }, function () {
					            
					        });
                    	},
                        showDateFields: true,
                        hakuOid: $routeParams.hakuOid,
                        pohjat: function() {
                        	return Jalkiohjauskirjepohjat.get({languageCode: langcode, tag: tag, applicationPeriod: hakuOid});
                        }
                    };
                }
            }
        });
    };

    $scope.aktivoiJalkiohjaustuloksetXls = function () {
        JalkiohjausXls.query({hakuOid: $routeParams.hakuOid});
    };
	$scope.sijoittelunTuloksetTaulukkolaskentaan = function() {
		var hakuoid = $routeParams.hakuOid;
        SijoittelunTulosTaulukkolaskenta.aktivoi({hakuOid: hakuoid}, {}, function (id) {
            Latausikkuna.avaa(id, "Sijoittelun tulokset taulukkolaskentaan", "", {});
        }, function () {
            Ilmoitus.avaa("Sijoittelun tulokset taulukkolaskentaan epäonnistui", "Sijoittelun tulokset taulukkolaskentaan epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });
	};
	
	$scope.sijoittelunTuloksetOsoitetarrat = function() {
		var hakuoid = $routeParams.hakuOid;
        SijoittelunTulosOsoitetarrat.aktivoi({hakuOid: hakuoid}, {}, function (id) {
            Latausikkuna.avaa(id, "Sijoitteluntulokset osoitetarroiksi", "", {});
        }, function () {
            Ilmoitus.avaa("Sijoittelun tulokset osoitetarrat epäonnistui", "Sijoittelun tulokset osoitetarrat epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });
	};
	
    $scope.kaynnistaSijoittelu = function () {
    	var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/sijoitteluikkuna.html',
            controller: SijoitteluIkkunaCtrl,
            size: 'lg'
        });
    };
    $scope.aktivoiHaunValintalaskenta = function() {
    	var hakuoid = $routeParams.hakuOid;
    	var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/seurantaikkuna.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        valinnanvaihe: -1,
                        valintakoelaskenta: false,
                        kokoHaku: true
                    };
                }
            }
        });
    };
    $scope.aktivoiHaunValintakoelaskenta = function () {
        var hakuoid = $routeParams.hakuOid;
    	var valintalaskentaInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/valintakoelaskenta.html',
            controller: SeurantaIkkunaCtrl,
            size: 'lg',
            resolve: {
                oids: function () {
                    return {
                        hakuOid: $routeParams.hakuOid,
                        valinnanvaihe: null,
                        valintakoelaskenta: true,
                        kokoHaku: true
                    };
                }
            }
        });
    };

    $scope.showErrors = function () {
        VirheModel.refresh($routeParams.hakuOid);
    };

    $scope.show = function (virhe) {
        virhe.show = !virhe.show;
    };

    $scope.stopPropagination = function ($event) {
        $event.stopPropagation();
    };

    $scope.henkilonakyma = function (hakemusOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemusOid + '/henkilotiedot');
    };

    $scope.hakukohdenakyma = function (hakukohdeOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/hakukohde/' + hakukohdeOid + '/pistesyotto');
    };

    $scope.kaynnistaJatkuvaSijoittelu = function () {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'aktivoi'}, function (result) {
            $route.reload();
        }, function (error) {
            alert(error);
        });
    };

    $scope.pysaytaJatkuvaSijoittelu = function () {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'poista'}, function (result) {
            $route.reload();
        }, function (error) {
            alert("virhe");
        });
    };

    $scope.paivitaJatkuvanSijoittelunAloitus = function () {
        $scope.jatkuva.aloitusajankohta = new Date();

        if ($scope.jatkuva.aloitusajankohta_date && $scope.jatkuva.aloitusajankohta_time) {
            $scope.jatkuva.aloitusajankohta = new Date($scope.jatkuva.aloitusajankohta_date);
            $scope.jatkuva.aloitusajankohta.setHours(new Date($scope.jatkuva.aloitusajankohta_time).getHours(), new Date($scope.jatkuva.aloitusajankohta_time).getMinutes());
        }
        if (!$scope.jatkuva.ajotiheys) {
            $scope.jatkuva.ajotiheys = 0;
        }
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, aloitusajankohta: new Date($scope.jatkuva.aloitusajankohta).getTime(), ajotiheys: $scope.jatkuva.ajotiheys,
            method: 'paivita'}, function (result) {
            $route.reload();
        }, function (error) {
            alert("virhe");
        });
    };

    JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid}, function (result) {
        $scope.jatkuva = result;
        $scope.jatkuva.aloitusajankohta_date = $scope.jatkuva.aloitusajankohta;
        $scope.jatkuva.aloitusajankohta_time = $scope.jatkuva.aloitusajankohta;
    }, function (error) {
        alert("virhe");
    });

}]);
