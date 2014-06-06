"use strict";
var app = angular.module('valintalaskenta', ['ngResource', 'loading', 'ngRoute', 'ngAnimate', 'pascalprecht.translate', 'ui.tinymce', 'valvomo','ui.bootstrap','angularFileUpload'], function($rootScopeProvider) {
	$rootScopeProvider.digestTtl(25);
}).run(function($http, MyRolesModel){
	// ja vastaus ei ole $window.location.pathname koska siina tulee mukana myos index.html
  	tinyMCE.baseURL = '/valintalaskenta-ui/common/jslib/static/tinymce-4.0.12';
    MyRolesModel;
    $http.get(VALINTAPERUSTEET_URL_BASE + "buildversion.txt?auth");
});

var SERVICE_URL_BASE = SERVICE_URL_BASE || "";
var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";
var VALINTAPERUSTEET_URL_BASE = VALINTAPERUSTEET_URL_BASE || "";
var DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE || ""; 
var VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE || "";
var VALINTALASKENTAKOOSTE_URL_BASE_HTTP = VALINTALASKENTAKOOSTE_URL_BASE.replace(/:\d{4}/, '');
var TARJONTA_URL_BASE = TARJONTA_URL_BASE || "";
var SERVICE_EXCEL_URL_BASE = SERVICE_EXCEL_URL_BASE || "";
var SIJOITTELU_EXCEL_URL_BASE = SIJOITTELU_EXCEL_URL_BASE || "";
var HAKEMUS_URL_BASE = HAKEMUS_URL_BASE || "";
var ORGANISAATIO_URL_BASE = ORGANISAATIO_URL_BASE || "";
var HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE || "";
var VIESTINTAPALVELU_URL_BASE = VIESTINTAPALVELU_URL_BASE || "";
var CAS_URL = CAS_URL || "/cas/myroles";


//Route configuration
app.config(function($routeProvider) {
    $routeProvider.
    when('/haku/', {controller:HakuController, templateUrl:TEMPLATE_URL_BASE + 'haku/haut.html'}).
    when('/haku/:hakuOid/hakukohde/', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hakukohde.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/perustiedot/hakukohdeperustiedot.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valinnanhallinta', {controller:ValinnanhallintaController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hallinta/valinnanhallinta.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/harkinnanvaraiset', {controller:HarkinnanvaraisetController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/harkinnanvaraiset/harkinnanvaraiset.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintalaskentatulos', {controller:ValintalaskentatulosController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/valintalaskenta_tulos/valintalaskentatulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintakoetulos', {controller:ValintakoetulosController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/koekutsut/valintakoetulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/hakeneet', {controller:HakeneetController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hakeneet/hakeneet.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/pistesyotto', {controller:PistesyottoController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/pistesyotto/pistesyotto.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/sijoitteluntulos', {controller:SijoitteluntulosController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/sijoittelu_tulos/sijoitteluntulos.html'}).

    when('/valintatapajono/:valintatapajonoOid/hakemus/:hakemusOid/valintalaskentahistoria', {controller:ValintalaskentaHistoriaController, templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/valintalaskenta_tulos/valintalaskentahistoria.html'}).

    when('/haku/:hakuOid/henkiloittain/', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilo.html'}).
    when('/haku/:hakuOid/henkiloittain/:hakemusOid/henkilotiedot', {controller:HenkiloTiedotController, templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilotiedot.html'}).
    when('/haku/:hakuOid/henkiloittain/:hakemusOid/henkilotiedot/:scrollTo', {controller:HenkiloTiedotController, templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilotiedot.html'}).

    when('/haku/:hakuOid/yhteisvalinnanhallinta', {controller:YhteisvalinnanHallintaController, templateUrl:TEMPLATE_URL_BASE + 'haku/hallinta/yhteisvalinnanhallinta.html'}).
    when('/haku/:hakuOid/yhteisvalinnanhallinta/valintatulos', {controller:ValintatulosController, templateUrl:TEMPLATE_URL_BASE + 'haku/hallinta/tulos/valintatulos.html'}).

    when('/lisahaku/:hakuOid/hakukohde', {controller: LisahakuController, templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/lisahakuHakukohde.html'}).
    when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller: HakukohdeController, templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/hakukohdeperustiedot.html'}).
    when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/hyvaksytyt', {controller: LisahakuhyvaksytytController, templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/hyvaksytyt.html'}).
    when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/hakeneet', {controller: HakeneetController, templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/hakeneet.html'}).

    otherwise({redirectTo:'/haku/'});

});




//MODAALISET IKKUNAT
app.factory('Ilmoitus', function($modal, IlmoitusTila) {
	return {
		avaa: function(otsikko, ilmoitus, tila) {
			$modal.open({
		      backdrop: 'static',
		      templateUrl: '../common/modaalinen/ilmoitus.html',
		      controller: function($scope, $window, $modalInstance) {
				  $scope.ilmoitus = ilmoitus;
		    	  $scope.otsikko = otsikko;
                  if(!tila) {
                      tila = IlmoitusTila.INFO;
                  }
                  $scope.tila = tila;
		    	  $scope.sulje = function() {
		    	  		$modalInstance.dismiss('cancel');
		    	  };
		      },
		      resolve: {
		    	  
		      }
		    }).result.then(function() {
		    }, function() {
		    });
		    
		}
	};
});
app.factory('Latausikkuna', function($log, $modal, DokumenttiProsessinTila) {
	return {
		
		avaaKustomoitu: function(id, otsikko, lisatiedot, ikkunaHtml, laajennettuMalli) {
			var timer = null;
			var cancelTimerWhenClosing = function() {
				DokumenttiProsessinTila.ilmoita({id: id, poikkeus:"peruuta prosessi"});
			};
			$modal.open({
		      backdrop: 'static',
		      templateUrl: ikkunaHtml,
		      controller: function($log, $scope, $window, $modalInstance, $interval, laajennos, DokumenttiProsessinTila) {
		    	  cancelTimerWhenClosing = function() {
				  	$interval.cancel(timer);
				  };
				  $scope.lisatiedot = lisatiedot;
		    	  $scope.otsikko = otsikko;
		    	  $scope.prosessi = {};
		    	  $scope.kutsuLaajennettuaMallia = function() {
		    	  	$log.error($scope.prosessi.dokumenttiId);
		    	  	laajennos($scope.prosessi.dokumenttiId);
		    	  };
		    	  $scope.update = function() {
		    	  		DokumenttiProsessinTila.lue({id: id.id}, function(data) {
		    	  			if(data.keskeytetty == true) {
		    	  				cancelTimerWhenClosing();
		    	  			}
		    	  			$scope.prosessi = data;
		    	  			if(data.dokumenttiId != null) {
		    	  				$interval.cancel(timer);
		    	  			}
		    	  		});
		    	  };
		    	  $scope.onVirheita = function() {
		    	  	if($scope.prosessi == null) {
		    	  		return false;
		    	  	} else {
		    	  		return $scope.prosessi.keskeytetty; 
		    	  	}
		    	  };
		    	  $scope.onKesken = function() {
		    	  	if($scope.prosessi == null) {
		    	  		return true;
		    	  	} else {
		    	  		return $scope.prosessi.dokumenttiId == null; 
		    	  	}
		    	  };
		    	  $scope.getProsentit = function(t) {
		    	  	if(t == null) {
		    	  		return 0;
		    	  	}
					return t.prosentteina * 100;
				  };
		    	  $scope.sulje = function() {
		    	  		DokumenttiProsessinTila.ilmoita({id: id.id, poikkeus:"Käyttäjän sulkema"});
		    	  		$modalInstance.dismiss('cancel');
		    	  };
		    	  timer = $interval(function () {
				        $scope.update();
				  }, 10000);
				  
				  $scope.ok = function() {
				  	if($scope.onKesken()) {
				  		return;
				  	} else {
				  		$window.location.href = "/dokumenttipalvelu-service/resources/dokumentit/lataa/" + $scope.prosessi.dokumenttiId;
				  	}
				  };
		      },
		      resolve: {
		    	  laajennos: function() {
		    	  	return laajennettuMalli;
		    	  }
		      }
		    }).result.then(function() {
		    	cancelTimerWhenClosing();
		    }, function() {
		    	DokumenttiProsessinTila.ilmoita({id: id, poikkeus:"peruuta prosessi"});
		    	cancelTimerWhenClosing();
		    });
		    
		},
		avaa: function(id, otsikko, lisatiedot) {
			this.avaaKustomoitu(id,otsikko,lisatiedot,'../common/modaalinen/latausikkuna.html',{});
		}
	};
});

//TARJONTA RESOURCES
app.factory('Haku', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku", {}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('HaunTiedot', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku/:hakuOid", {hakuOid: "@hakuOid"}, {
    get: {method: "GET"}
  });
});
app.factory('HakuHakukohdeChildren', function($resource) {
return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohde?count=99999", {hakuOid: "@hakuOid"}, {
    get: {method: "GET", isArray: true}
  });
});
app.factory('TarjontaHaku', function($resource) {
	return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohdeTulos", {},{
		query:  {method:'GET', isArray:false}
	});
});

app.factory('TarjontaHakukohde', function($resource) {
return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
    get: {method: "GET"}
  });
});
app.factory('HakukohdeNimi', function($resource) {
    return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid/nimi", {hakukohdeoid: "@hakukohdeoid"}, {
     get: {method: "GET"}
    });
});

app.factory('TarjontaHaut', function($resource) {
    return $resource(TARJONTA_URL_BASE + "haku/findAll");
});



// Hakuparametrit
app.factory('Parametrit', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/parametrit/:hakuOid", {}, {
        list: {method: "GET"}
    });
});


//Valintalaskenta
app.factory('HakukohdeValinnanvaihe', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakukohde/:parentOid/valinnanvaihe", {parentOid: "@parentOid"}, {
     get: {method: "GET", isArray: true },
     post:{method: "POST"},
     insert: {method: "PUT"}
   });
});

app.factory('HakuVirheet', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/haku/:parentOid/:virhetyyppi", {parentOid: "@parentOid", virhetyyppi: "@virhetyyppi"}, {
     get: {method: "GET", isArray: true }
   });
});

app.factory('ValinnanvaiheListByHakukohde', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe", {hakukohdeoid: "@hakukohdeoid"}, {
    get: {method: "GET", isArray: true},
    post:{method: "POST"}
  });
});

app.factory('Valintatapajono', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoid/jarjestyskriteeritulos", {valintatapajonoid: "@valintatapajonoid"}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('ValintatapajonoListByValinnanvaihe', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:valinnanvaiheoid/valintatapajono", {valinnanvaiheoid: "@valinnanvaiheoid"}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('HarkinnanvarainenHyvaksynta', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/harkinnanvarainenhyvaksynta/", { }, {
     post:{method: "POST"}
   });
});
app.factory('HarkinnanvaraisestiHyvaksytyt', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/harkinnanvarainenhyvaksynta/haku/:hakuOid/hakukohde/:hakukohdeOid",
    {hakuOid: "@hakuOid",
    hakukohdeOid: "@hakukohdeOid"

    }, {
    get: {method: "GET", isArray: true}
  });
});
app.factory('HarkinnanvaraisestiHyvaksytty', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/harkinnanvarainenhyvaksynta/haku/:hakuOid/hakemus/:hakemusOid",
    {
        hakuOid: "@hakuOid",
        hakemusOid: "@hakemusOid"

    }, {
        get: {method: "GET", isArray: true}
  });
});

//valintaperusteet
app.factory('ValinnanvaiheListFromValintaperusteet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true}
    });
});
app.factory('Valintatapajono', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/valintatapajono/:valintatapajonoOid", {valintatapajonoOid: "@valintatapajonoOid"}, {
        get: {method: "GET"}
    });
});
app.factory('ValinnanVaiheetIlmanLaskentaa', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid/ilmanlaskentaa", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true}
    });
});

// d
app.factory('DokumenttiProsessinTila', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/dokumenttiprosessi/:id", {id: "@id"}, {
        lue: {method: "GET"},
        ilmoita: {method: "POST"}
    });
});
//dokumenttipalvelu
app.factory('Dokumenttiprosessi', function($http, $log, $rootScope, $resource, $window, $interval) {
	return {
		_timer: undefined,
		aloitaPollaus: function(callback) {
			this.lopetaPollaus();
			this._timer = $interval(function () {
				callback();
		    }, 10000);
		},
		lopetaPollaus: function() {
			if(this._timer != undefined) {
				$interval.cancel(this._timer);
			}
		}
	};
});

app.factory('Dokumenttipalvelu', function($http, $log, $rootScope, $resource, $window, Poller) {
	
    return {
    	_filter: "",
    	_p1: null,
    	_repeater: function() {
    		var self = this;
    		$rootScope.$apply(function () {
                self._p1 = Poller.poll(DOKUMENTTIPALVELU_URL_BASE + "/dokumentit/hae");
                self._p1.then(function(data){
                	console.log(data);
                });
            });
    	},
    	_timer: null,
    	paivita: function(callback) {
    		$http({method: "GET", url: DOKUMENTTIPALVELU_URL_BASE + "/dokumentit/hae"}).
    		  success(function(data) {
    			  callback(data);
    		  });
    	},
    	aloitaPollaus: function(callback, filter) {
    		this._filter = filter;
    		this.paivita(callback);
    		this._timer = $window.setInterval(this._repeater, 5000);
    		$log.info('start polling start' + this._timer);
    	},
    	lopetaPollaus: function() {
    		$window.clearInterval(this._timer);
    		$log.info('end polling end'+ this._timer);
    	}
    };
});

//koostepalvelus
app.factory('ValintakoelaskentaAktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintakoelaskenta/aktivoiValintakoelaskenta", {}, {
        aktivoi: {method: "POST"}
    });
});

app.factory('ValintalaskentaKaynnissa', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentamuistissa/aktiivinenValintalaskenta", {}, {
        hae: {method: "GET"}
    });
});
app.factory('ValintalaskentaKeskeyta', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentamuistissa/keskeytaAktiivinenValintalaskenta", {uuid: "@uuid"}, {
        keskeyta: {method: "POST"}
    });
});
app.factory('ValintalaskentaStatus', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentamuistissa/status/:uuid", {uuid: "@uuid"}, {
        aktivoi: {method: "GET"}
    });
});
app.factory('ValintalaskentaMuistissa', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentamuistissa/aktivoi", {}, {
        aktivoi: {method: "POST"}
    });
});


app.factory('Sijoitteluktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/koostesijoittelu/aktivoi", {}, {
        aktivoi: {method: "POST"}
    });
});

app.factory('AktivoiHaunValintalaskenta', function($resource) {
  return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskenta/aktivoiHaunValintalaskenta", {}, {
      aktivoi: {method: "GET"}
  });
});

app.factory('OsoitetarratSijoittelussaHyvaksytyille', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/osoitetarrat/sijoittelussahyvaksytyille/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});//
});
app.factory('SijoitteluXls', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentaexcel/sijoitteluntulos/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});//
});

app.factory('TulosXls', function($window) {
	return {
		query: function(data) {
			$window.location.href = VALINTALASKENTAKOOSTE_URL_BASE +"resources/valintalaskentaexcel/valintalaskennantulos/aktivoi?hakukohdeOid=" + data.hakukohdeOid;
		}
	};
});
app.factory('JalkiohjausXls', function($window) {
	return {
		query: function(data) {
			$window.location.href = VALINTALASKENTAKOOSTE_URL_BASE +"resources/valintalaskentaexcel/jalkiohjaustulos/aktivoi?hakuOid=" + data.hakuOid;
		}
	};
});
app.factory('ValintakoeXls', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentaexcel/valintakoekutsut/aktivoi", {}, {
        lataa: {method: "POST"}
    });
});

app.factory('AktivoiKelaFtp', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/kela/laheta/:documentId", {
			documentId: "@documentId"
	    }, {
	    put: {method: "PUT", isArray:false}
	});
});

app.factory('KelaDokumentti', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/kela/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});
});

app.factory('PistesyottoVienti', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/pistesyotto/vienti", {}, {
		vie: {method:'POST', isArray:false}
	});
});
app.factory('ValintatapajonoVienti', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintatapajonolaskenta/vienti", {}, {
		vie: {method:'POST', isArray:false}
	});
});

app.factory('Koekutsukirjeet', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/koekutsukirjeet/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});
});

app.factory('Osoitetarrat', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/osoitetarrat/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});
});
app.factory('OsoitetarratHakemuksille', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/osoitetarrat/hakemuksille/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});
});


//
app.factory('Hyvaksymiskirjeet', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/hyvaksymiskirjeet/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});
});


app.factory('SijoittelunTulosTaulukkolaskenta', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/sijoitteluntuloshaulle/taulukkolaskennat", {}, {
		aktivoi:  {method:'POST', isArray:false}
	});
});
app.factory('SijoittelunTulosHyvaksymiskirjeet', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/sijoitteluntuloshaulle/hyvaksymiskirjeet", {}, {
		aktivoi:  {method:'POST', isArray:false}
	});
});
app.factory('Jalkiohjauskirjeet', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/jalkiohjauskirjeet/aktivoi", {}, {
		post:  {method:'POST', isArray:false}
	});
});

app.factory('Kirjepohjat', function($resource) {
    return $resource(VIESTINTAPALVELU_URL_BASE + "/api/v1/template/getHistory?templateName=:templateName&languageCode=:languageCode&oid=:tarjoajaOid&tag=:tag", {templateName: "@templateName", languageCode:"@languageCode", tarjoajaOid: "@tarjoajaOid", tag:"@tag"}, {
        get: {method: "GET", isArray:true}
    });
});
app.factory('Jalkiohjauskirjepohjat', function($resource) {
    return $resource(VIESTINTAPALVELU_URL_BASE + "/api/v1/template/getHistory?templateName=jalkiohjauskirje&languageCode=:languageCode&tag=:tag", {languageCode:"@languageCode", tag:"@tag"}, {
        get: {method: "GET", isArray:true}
    });
});
//hakuapp related
app.factory('Hakemus', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/:oid", {oid: "@oid", appState:["ACTIVE","INCOMPLETE"]}, {
        get: {method: "GET"}
    });
});
app.factory('HakemusAdditionalData', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/additionalData/:hakuOid/:hakukohdeOid", {hakuOid: "@hakuOid", hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET", isArray: true},
        put: {method: "PUT", isArray: true}
    });
});
app.factory('HakukohdeHenkilot', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications",{aoOid: "@aoOid", appState:["ACTIVE","INCOMPLETE"]}, {
        get: {method: "GET", isArray: false}
    });
});

app.factory('HakukohdeHenkilotFull', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/listfull",{aoOid: "@aoOid", appState:["ACTIVE","INCOMPLETE"]}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('Henkilot', function($resource) {
	return $resource(HAKEMUS_URL_BASE + "haku-app/applications", {appState:["ACTIVE","INCOMPLETE"]},{
		query:  {method:'GET', isArray:false}
    });
});
app.factory('HakemusKey', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/:oid/:key", {oid: "@oid", key: "@key"}, {
        get: {method: "GET", isArray: true},
        put: {method: "PUT", isArray: false}
    });
});




 //Sijoittelu
app.factory('VastaanottoTilat', function($resource) {
     return $resource(SIJOITTELU_URL_BASE + "resources/tila/hakukohde/:hakukohdeOid/:valintatapajonoOid",
         {
             hakukohdeOid: "@hakukohdeoid",
             valintatapajonoOid: "@valintatapajonoOid"
         }, {
         get: {method: "GET", isArray:true}
     });
});

app.factory('VastaanottoTila', function($resource) {
 return $resource(SIJOITTELU_URL_BASE + "resources/tila/haku/:hakuoid/hakukohde/:hakukohdeOid?selite=:selite",
     {
         hakuoid: "@hakuoid",
         hakukohdeOid: "@hakukohdeoid",
         selite: "@selite"
     }, {
     post: {method: "POST"}
 });
});

app.factory('HakemuksenVastaanottoTila', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/tila/:hakemusOid/:hakuoid/:hakukohdeOid/:valintatapajonoOid",
        {
            hakuoid: "@hakuoid",
            hakukohdeOid: "@hakukohdeoid",
            valintatapajonoOid: "@valintatapajonoOid",
            hakemusOid: "@hakemusOid"
        }, {
            get: {method: "GET"}
        });
});

app.factory('SijoittelunVastaanottotilat', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/tila/:hakemusOid/", {hakemusOid: "@hakemusOid"}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('Sijoittelu', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/", {hakuOid: "@hakuOid"}, {
        get: {method: "GET"}
    });
});
app.factory('SijoitteluAjo', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/:sijoitteluajoOid", {hakuOid: "@hakuOid", sijoitteluajoOid:"@sijoitteluajoOid" }, {
        get: {method: "GET"}
    });
});

app.factory('LatestSijoittelunTilat', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/latest/hakemus/:hakemusOid", {hakemusOid: "@hakemusOid", hakuOid:"@hakuOid"}, {
        get: {method: "GET"}
    });
});

app.factory('LatestSijoitteluajoHakukohde', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/latest/hakukohde/:hakukohdeOid", {hakukohdeOid: "@hakukohdeOid", hakuOid:"@hakuOid"}, {
        get: {method: "GET"}
    });
});

app.factory('Valintatulos', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/latest/hakemukset", {hakuOid:"@hakuOid"}, {
        get: {method: "GET"}
    });
});













// Valintakoetulokset
app.factory('Valintakoetulokset', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintakoe/hakutoive/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('Valintakoe', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/valintakoe/:valintakoeOid", {valintakoeOid: "@valintakoeOid"}, {
        get: {method: "GET", isArray: true}
    });
});
app.factory('HakukohdeValintakoe', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeOid/valintakoe", {hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('ValintakoetuloksetHakemuksittain', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintakoe/hakemus/:hakemusOid", {hakemusOid: "@hakemusOid"}, {
        get: {method: "GET"}
    });
});

app.factory('HakukohdeAvaimet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/avaimet/:hakukohdeOid",{hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET", isArray: true}
    });
});


app.factory('ValintalaskentaHistoria', function($resource) {
	return $resource(SERVICE_URL_BASE + "resources/jonosijahistoria/:valintatapajonoOid/:hakemusOid", {valintatapajonoOid: "@valintatapajonoOid", hakemusOid:"@hakemusOid"}, {
        get: {method: "GET", isArray: true}
    });
});
app.factory('ValintalaskentaHakemus', function($resource) {
	return $resource(SERVICE_URL_BASE + "resources/hakemus/:hakuoid/:hakemusoid", {hakuoid: "@hakuoid", hakemusoid:"@hakemusoid"}, {
        get: {method: "GET", isArray: false}
    });
});
app.factory('MyRoles', function($resource) {
	return $resource(CAS_URL, {}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('JatkuvaSijoittelu', function($resource) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/koostesijoittelu/jatkuva/:method", {}, {
        get: {method: "GET"}
    });
});



app.factory('JarjestyskriteeriMuokattuJonosija', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoOid/:hakemusOid/:jarjestyskriteeriprioriteetti/jonosija", {
        valintatapajonoOid: "@valintatapajonoOid",
        hakemusOid: "@hakemusOid",
        jarjestyskriteeriprioriteetti:"@jarjestyskriteeriprioriteetti"
    },
    {
        post: {method: "POST"}
    });
});


app.constant('Pohjakuolutukset', {
	0: "Ulkomailla suoritettu koulutus",
	1: "Perusopetuksen oppimäärä",
	2: "Perusopetuksen osittain yksilöllistetty oppimäärä",
	3: "Perusopetuksen yksilöllistetty oppimäärä, opetus järjestetty toiminta-alueittain",
	6: "Perusopetuksen pääosin tai kokonaan yksilöllistetty oppimäärä",
	7: "Oppivelvollisuuden suorittaminen keskeytynyt (ei päättötodistusta)",
	9: "Lukion päättötodistus, ylioppilastutkinto tai abiturientti"
});

app.constant('IlmoitusTila', {
	INFO: 'success',
	WARNING: 'warning',
	ERROR: 'danger'
});
