
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
        'HakuModel', 'VirheModel', 'JatkuvaSijoittelu', 'IlmoitusTila', 'SeurantaPalveluHaunLaskennat',
        function ($scope, $modal, $interval, _, 
        		SijoittelunTulosTaulukkolaskenta,SijoittelunTulosOsoitetarrat, SijoittelunTulosHyvaksymiskirjeet, 
        		Jalkiohjauskirjepohjat, AktivoiKelaFtp, 
        		$log, $timeout, $q, $location, 
        		Ilmoitus, KelaDokumentti, Latausikkuna, $routeParams,
                $http, $route, $window, SijoitteluAjo, JalkiohjausXls, Jalkiohjauskirjeet, SijoitteluAktivointi,
                HakuModel, VirheModel, JatkuvaSijoittelu, IlmoitusTila, SeurantaPalveluHaunLaskennat) {
    "use strict";

    
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
                        hakuOid: $routeParams.hakuOid
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
    
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE;
    $scope.VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE;
    $scope.hakumodel = HakuModel;
    $scope.virheet = VirheModel;
    $scope.naytaKokeita = 50;
    // KELA TAULUKON CHECKBOXIT ALKAA
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
    $scope.naytetaanHaut = false;
    $scope.kaikkiHautValittu = false;
    $scope.isValittu = function (haku) {
        if (haku.oid === $routeParams.hakuOid) {
            return true;
        }
        else {
            return haku.valittu;
        }

    }
    $scope.isAllValittu = function () {
        return _.reduce($scope.hakumodel.haut, function (memo, haku) {
            if ($scope.isValittu(haku)) {
                return memo;
            }
            return memo && haku.valittu;
        }, true);
    };
    $scope.checkAllWith = function (kaikkienTila) {
        _.each($scope.hakumodel.haut, function (haku) {
            haku.valittu = kaikkienTila;
        });
        $scope.kaikkiHautValittu = kaikkienTila;
    };
    $scope.checkAllWith(false);

    $scope.naytaHaut = function () {
        $scope.naytetaanHaut = true;
    };
    $scope.filterValitut = function () {
        return _.filter($scope.hakumodel.haut, function (haku) {
            return $scope.isValittu(haku);
        });
    };
    $scope.check = function (oid) {
        $scope.kaikkiHautValittu = $scope.isAllValittu();
    };

    $scope.checkAll = function () {
        $scope.checkAllWith($scope.kaikkiHautValittu);
    };
    $scope.muodostaKelaDokumentti = function () {
        var hakuOids = _.map($scope.filterValitut(), function (haku) {
            return haku.oid;
        });
        KelaDokumentti.post({},
            {
                hakuOids: hakuOids,
                aineisto: $scope.aineistonnimi
            },
            function (id) {
                Latausikkuna.avaaKustomoitu(id, "Kela-dokumentin luonti", "", "haku/hallinta/modaalinen/kelaikkuna.html",
                    function (dokumenttiId) {

                        AktivoiKelaFtp.put(dokumenttiId, function (success) {
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
    $scope.hakuaVastaavaJalkiohjauskirjeMuotti = function() {
    	if(HakuModel.hakuOid.nivelvaihe) {
    		return "jalkiohjauskirje_nivel";	
    	}else {
	    	return "jalkiohjauskirje";
	    }
    };
    $scope.muodostaJalkiohjauskirjeet = function (langcode) {
    	var tag = $routeParams.hakuOid;
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
					        	tag: tag, templateName: templateName}, {hakemusOids: null,letterBodyText:sisalto, languageCode: langcode} , function (id) {
					            Latausikkuna.avaa(id, "Jälkiohjauskirjeet", "");
					        }, function () {
					            
					        });
                    	},
                        hakuOid: $routeParams.hakuOid,
                        pohjat: function() {
                        	return Jalkiohjauskirjepohjat.get({templateName: templateName, languageCode: langcode, tag: tag});
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
    $scope.sijoittelunTuloksetHyvaksymiskirjeiksi = function() {
		var hakuoid = $routeParams.hakuOid;
        SijoittelunTulosHyvaksymiskirjeet.aktivoi({hakuOid: hakuoid}, {}, function (id) {
            Latausikkuna.avaa(id, "Sijoitteluntulokset hyväksymiskirjeiksi", "", {});
        }, function () {
            Ilmoitus.avaa("Sijoittelun tulokset hyväksymiskirjeiksi epäonnistui", "Sijoittelun tulokset hyväksymiskirjeiksi epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
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
                        valintakoelaskenta: false
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
                        valintakoelaskenta: true
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
        $scope.jatkuva.aloitusajankohta = new Date($scope.jatkuva.aloitusajankohta_date);
        $scope.jatkuva.aloitusajankohta.setHours(new Date($scope.jatkuva.aloitusajankohta_time).getHours(),new Date($scope.jatkuva.aloitusajankohta_time).getMinutes());

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
