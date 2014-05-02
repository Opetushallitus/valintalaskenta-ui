app.factory('VirheModel', function (HakuVirheet) {

    var factory = (function() {
        var instance = {};
        instance.valintalaskenta = [];
        instance.valintakoe = [];

        instance.refresh = function(oid) {

            HakuVirheet.get({parentOid: oid, virhetyyppi: 'virheet'}, function(result) {
                if(result.length > 0) {
                    instance.valintalaskenta = result;
                } else {
                    instance.eiLaskentaVirheita = true;
                }
            });

            HakuVirheet.get({parentOid: oid, virhetyyppi: 'valintakoevirheet'}, function(result) {
                if(result.length > 0) {
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



function YhteisvalinnanHallintaController($scope, $modal, $interval, AktivoiKelaFtp, $log, $timeout, $q, $location, ValintakoelaskentaAktivointi, Ilmoitus, KelaDokumentti, Latausikkuna, $routeParams, $http, $route, $window, SijoitteluAjo, JalkiohjausXls, Jalkiohjauskirjeet, Sijoitteluktivointi, HakuModel, VirheModel, JatkuvaSijoittelu, IlmoitusTila) {
	$scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
	$scope.DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE; 
	$scope.VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE;
	$scope.hakumodel = HakuModel;
	$scope.virheet = VirheModel;
	$scope.naytaKokeita = 50;
	// KELA TAULUKON CHECKBOXIT ALKAA
	$scope.aineistonnimi = "";
	$scope.isNotBlank = function(str) {
	   if (!str || str.length === 0 || str === "" || typeof str === 'undefined' || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === ""){
		    return false;
	   } else {
	   		return true;
	   }
	};
	$scope.naytetaanHaut = false;
	$scope.kaikkiHautValittu = false;
	$scope.isValittu = function(haku) {
		if(haku.oid === $routeParams.hakuOid) {
			return true;
		}
		else {
			return haku.valittu;
		}
		
	}
	$scope.isAllValittu = function() {
		return _.reduce($scope.hakumodel.haut, function(memo, haku){
				if($scope.isValittu(haku)) {
					return memo;
				}
				return memo && haku.valittu;
			}, true);
	};
	$scope.checkAllWith = function(kaikkienTila) {
		_.each($scope.hakumodel.haut, function(haku) {
			haku.valittu = kaikkienTila;
		});
		$scope.kaikkiHautValittu = kaikkienTila;
	};
	$scope.checkAllWith(false);
	
	$scope.naytaHaut = function() {
		$scope.naytetaanHaut =true;
	};
	$scope.filterValitut = function() {
		return _.filter($scope.hakumodel.haut,function(haku) {
			return $scope.isValittu(haku);
		});
	};
	$scope.check = function(oid) {
		$scope.kaikkiHautValittu = $scope.isAllValittu();
	};
	
	$scope.checkAll = function() {
		$scope.checkAllWith($scope.kaikkiHautValittu);
	};
	$scope.muodostaKelaDokumentti = function() {
		var hakuOids = _.map($scope.filterValitut(), function(haku){
				return haku.oid;
		});
		KelaDokumentti.post({},
        		{
        		hakuOids: hakuOids,
        		aineisto: $scope.aineistonnimi
        		}, 
        		function (id) {
            Latausikkuna.avaaKustomoitu(id, "Kela-dokumentin luonti", "", "haku/hallinta/modaalinen/kelaikkuna.html",
            function(dokumenttiId) {
            		
            		AktivoiKelaFtp.put(dokumenttiId, function(success) {
            			Ilmoitus.avaa("Kela-dokumentin ftp-siirto onnistui", "Ftp-siirto onnistui");
            		}, function() {
            			Ilmoitus.avaa("Kela-dokumentin ftp-siirto epäonnistui", "Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
            		});
            	
            }
            );
        }, function () {
            Ilmoitus.avaa("Kela-dokumentin luonnin aloitus epäonnistui", "Kela-dokumentin luonnin aloitus epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });
	};
	// KELA TAULUKON CHECKBOXIT LOPPUU
	
	///////////////////
	$scope.aktivoiMuistinvarainenValintalaskenta = function () {
	    var valintalaskentaInstance = $modal.open({
	      backdrop: 'static',
	      templateUrl: '../common/modaalinen/valintalaskentaikkuna.html',
	      controller: ValintalaskentaIkkunaCtrl,
	      resolve: {
	      	oids: function () {
	      		return {
		      		hakuOid: $routeParams.hakuOid,
		      		hakukohdeOid: null,
		      		valinnanvaihe: null
	      		};
	      	}
	      }
	    });
	};

	SijoitteluAjo.get({hakuOid: $routeParams.hakuOid, sijoitteluajoOid: 'latest'}, function(result){
	    $scope.sijoitteluModel = result;
	});
	
	$scope.muodostaJalkiohjauskirjeet = function() {
		Jalkiohjauskirjeet.post({ 
        	hakuOid: $routeParams.hakuOid},
        		{}, 
        		function (id) {
            Latausikkuna.avaa(id, "Jälkiohjauskirjeiden luonti", "");
        }, function () {
            
        });
	};
	
	$scope.aktivoiJalkiohjaustuloksetXls = function() {
		JalkiohjausXls.query({hakuOid:$routeParams.hakuOid});
	};
	
    $scope.kaynnistaSijoittelu = function() {
        var hakuoid = $routeParams.hakuOid;
        Sijoitteluktivointi.aktivoi({hakuOid: hakuoid}, {}, function(id) {
       		Latausikkuna.avaaKustomoitu(id, "Suoritetaan sijoittelua haulle", "", "haku/hallinta/modaalinen/sijoitteluikkuna.html", {});
        }, function() {
        	Ilmoitus.avaa("Sijoittelun aktivointi epäonnistui", "Sijoittelun aktivointi epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });
        
    };

    $scope.aktivoiHaunValintakoelaskenta = function() {
       var hakuoid = $routeParams.hakuOid;
       ValintakoelaskentaAktivointi.aktivoi({hakuOid: hakuoid}, {}, function(id) {
       		Latausikkuna.avaaKustomoitu(id, "Valintakoelaskenta haulle", "", "haku/hallinta/modaalinen/valintakoeikkuna.html", {});
       },function() {
       		Ilmoitus.avaa("Valintakoelaskenta epäonnistui", "Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
       });
    };

    $scope.showErrors = function() {
        VirheModel.refresh($routeParams.hakuOid);
    };

    $scope.show = function(virhe) {
        virhe.show =! virhe.show;
    };

    $scope.stopPropagination = function($event) {
        $event.stopPropagation();
    };

    $scope.henkilonakyma = function(hakemusOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemusOid + '/henkilotiedot');
    };

    $scope.hakukohdenakyma = function(hakukohdeOid) {
        $location.path('/haku/' + $routeParams.hakuOid + '/hakukohde/' + hakukohdeOid + '/pistesyotto');
    };

    $scope.kaynnistaJatkuvaSijoittelu = function() {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'aktivoi'}, function(result) {
            $route.reload();
        }, function(error){
            alert(error);
        });
    };

    $scope.pysaytaJatkuvaSijoittelu = function() {
        JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid, method: 'poista'}, function(result) {
            $route.reload();
        }, function(error){
            alert("virhe");
        });
    };

    JatkuvaSijoittelu.get({hakuOid: $routeParams.hakuOid}, function(result) {
        $scope.jatkuva = result;
    }, function(error){
        alert("virhe");
    });

}
