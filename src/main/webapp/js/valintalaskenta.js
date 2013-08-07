var app = angular.module('valintalaskenta', ['ngResource', 'loading']);

var SERVICE_URL_BASE = SERVICE_URL_BASE || "";
var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";
var VALINTAPERUSTEET_URL_BASE = VALINTAPERUSTEET_URL_BASE || "";
var VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE || "";
var VALINTALASKENTAKOOSTE_URL_BASE_HTTP = VALINTALASKENTAKOOSTE_URL_BASE.replace(/:\d{4}/, '');
var TARJONTA_URL_BASE = TARJONTA_URL_BASE || "";
var SERVICE_EXCEL_URL_BASE = SERVICE_EXCEL_URL_BASE || "";
var SIJOITTELU_EXCEL_URL_BASE = SIJOITTELU_EXCEL_URL_BASE || "";
var HAKEMUS_URL_BASE = HAKEMUS_URL_BASE || "";
var ORGANISAATIO_URL_BASE = ORGANISAATIO_URL_BASE || "";
var HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE || "";


//Route configuration
app.config(function($routeProvider) {
    $routeProvider.

    when('/haku/', {controller:HakuController, templateUrl:TEMPLATE_URL_BASE + 'haut.html'}).
    when('/haku/:hakuOid/hakukohde/', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohde.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohdeperustiedot.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valinnanhallinta', {controller:ValinnanhallintaController, templateUrl:TEMPLATE_URL_BASE + 'valinnanhallinta.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/harkinnanvaraiset/pistelaskennassa', {controller:PistelaskentaController, templateUrl:TEMPLATE_URL_BASE + 'pistelaskennassa.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/harkinnanvaraiset/harkinnassa', {controller:HarkinnassaController, templateUrl:TEMPLATE_URL_BASE + 'harkinnassa.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintalaskentatulos', {controller:ValintalaskentatulosController, templateUrl:TEMPLATE_URL_BASE + 'valintalaskentatulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintakoetulos', {controller:ValintakoetulosController, templateUrl:TEMPLATE_URL_BASE + 'valintakoetulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/hakeneet', {controller:HakeneetController, templateUrl:TEMPLATE_URL_BASE + 'hakeneet.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/sijoitteluntulos', {controller:SijoitteluntulosController, templateUrl:TEMPLATE_URL_BASE + 'sijoitteluntulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/hakijaoid/:hakijaOid/valintalaskentahistoria', {controller:ValintalaskentaHistoriaController, templateUrl:TEMPLATE_URL_BASE + 'valintalaskentahistoria.html'}).
    //when('/haku/:hakuOid/henkiloittain', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'henkiloittain.html'}).
    //when('/haku/:hakuOid/henkiloittain/mitätuleekin', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'henkiloittain.html'}).


    when('/haku/:hakuOid/yhteisvalinnanhallinta', {controller:YhteisvalinnanHallintaController, templateUrl:TEMPLATE_URL_BASE + 'yhteisvalinnanhallinta.html'}).

    otherwise({redirectTo:'/haku/'});
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






app.factory('HakukohdeValinnanvaihe', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakukohde/:parentOid/valinnanvaihe", {parentOid: "@parentOid"}, {
     get: {method: "GET", isArray: true },
     post:{method: "POST"},
     insert: {method: "PUT"}
   });
});

//One does not simply call 'ValinnanVaiheList' 'Hakukohde'
app.factory('ValinnanvaiheListByHakukohde', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe", {hakukohdeoid: "@hakukohdeoid"}, {
    get: {method: "GET", isArray: true}
  });
});

//One does not simply call 'ValinnanVaiheList' 'Hakukohde'
app.factory('ValinnanvaiheListFromValintaperusteet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true}
    });
});


// Järjestyskriteeritulokset
app.factory('Valintatapajono', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoid/jarjestyskriteeritulos", {valintatapajonoid: "@valintatapajonoid"}, {
    get: {method: "GET", isArray: true}
  });
});


//Valintatapajonot
app.factory('ValintatapajonoListByValinnanvaihe', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:valinnanvaiheoid/valintatapajono", {valinnanvaiheoid: "@valinnanvaiheoid"}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('ValintakoelaskentaAktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintakoelaskenta/aktivoi", {}, {
        aktivoi: {method: "GET"}
    })
});

app.factory('ValintalaskentaAktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskenta/aktivoi", {}, {
        aktivoi: {method: "GET"}
    })
});


app.factory('Sijoitteluktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/sijoittelu/aktivoi", {}, {
        aktivoi: {method: "GET"}
    })
});

app.factory('AktivoiHaunValintalaskenta', function($resource) {
  return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskenta/aktivoiHaunValintalaskenta", {}, {
      aktivoi: {method: "GET"}
  })
});

app.factory('Osoitetarrat', function($resource,$window) {
	return { lataaPDF: function(hakukohdeOid, valintakoeOid) {
		return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/addressLabelBatch/aktivoi", {}, {
			aktivoi: {method: "POST", params:{hakukohdeOid: hakukohdeOid, valintakoeOid:valintakoeOid}}
		});
		
		}
	}
});

app.factory('Hyvaksymiskirjeet', function($http,$window) {
  return { lataaPDF: function(batch) {
	  return $http({
		    method: 'POST',
		    url: VALINTALASKENTAKOOSTE_URL_BASE_HTTP + "resources/hyvaksymiskirjeBatch/aktivoi/",
		    data: batch
		}).success(function(data) {
			$window.location.href = data;
		})
	}
  }
});

app.factory('Jalkiohjauskirjeet', function($http,$window) {
  return { lataaPDF: function(batch) {
	  return $http({
		    method: 'POST',
		    url: VALINTALASKENTAKOOSTE_URL_BASE_HTTP + "resources/jalkiohjauskirjeBatch/aktivoi/",
		    data: batch
		}).success(function(data) {
			$window.location.href = data;
		})
	}
  }
});



app.factory('KaikkiHakemukset', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/", {}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('Hakemus', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/:oid", {oid: "@oid"}, {
        get: {method: "GET"}
    });
});

app.factory('HakemusKey', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/:oid/:key?value=:value", {oid: "@oid", key: "@key", value:"@value"}, {
        get: {method: "GET"},
        put: {method: "PUT"}
    });
});

app.factory('HakemuksenTila', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/tila/:hakuoid/:hakukohdeOid/:valintatapajonoOid/:hakemusOid",
        {
            hakuoid: "@hakuoid",
            hakukohdeOid: "@hakukohdeoid", 
            valintatapajonoOid: "@valintatapajonoOid", 
            hakemusOid: "@hakemusOid"
        }, {
        get: {method: "GET"},
        post: {method: "POST"}
    });
});



//Sijoittelu
app.factory('Sijoittelu', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/", {hakuOid: "@hakuOid"}, {
        get: {method: "GET"}
    });
});

app.factory('SijoitteluajoLatest', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo?latest=true", {hakuOid: "@hakuOid"}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('SijoitteluajoAtTimestamp', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/:timestamp", {hakuOid: "@hakuoid", timestamp: "@timestamp"}, {
        get: {method: "GET"}
    });
});

app.factory('Sijoitteluajo', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoitteluajo/:sijoitteluajoOid", {sijoitteluajoOid: "@sijoitteluajoOid"}, {
        get: {method: "GET"}
    });
});

app.factory('SijoitteluajoHakukohde', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoitteluajo/:sijoitteluajoOid/:hakukohdeOid", {sijoitteluajoOid: "@sijoitteluajoOid", hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET"}
    });
});

// Valintakoetulokset
app.factory('Valintakoetulokset', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintakoe/hakutoive/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('HakukohdeAvaimet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/avaimet",{}, {
        post: {method: "POST", isArray: true}
    });
});

app.factory('HakukohdeHenkilot', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/applicant/:hakuOid/:hakukohdeOid",{hakuOid: "@hakuOid", hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET", isArray: true}
    });
});



//Järjestyskriteerin arvon muuttaminen
app.factory('JarjestyskriteeriArvo', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoOid/:hakemusOid/:jarjestyskriteeriprioriteetti/arvo", {
        valintatapajonoOid: "@valintatapajonoOid",
        hakemusOid: "@hakemusOid",
        jarjestyskriteeriprioriteetti:"@jarjestyskriteeriprioriteetti"
    },
    {
        post: {method: "POST"}
    });
});
var INTEGER_REGEXP = /^\-?\d*$/;
app.directive('arvovalidaattori', function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
        	
        	ctrl.$parsers.unshift(function(viewValue) {
			  if (INTEGER_REGEXP.test(viewValue)) {
				  var min = parseInt($(elm).attr("min"));
				  var max = parseInt($(elm).attr("max"));
				  var intVal = parseInt(viewValue);
				  if(!isNaN(min) && !isNaN(max) && intVal) {
					  if(min <= intVal && max >= intVal) {
						// it is valid
						$(elm).siblings("span").empty();
						ctrl.$setValidity('arvovalidaattori', true);						  
					  } else {
						  // not in range
						  $(elm).siblings("span").text("Arvo ei ole välillä " + min + " - " + max);
						  ctrl.$setValidity('arvovalidaattori', false); 
					  }
				  } else {
					// it is valid
						$(elm).siblings("span").empty();
						ctrl.$setValidity('arvovalidaattori', true);
				  }
				  
				  return viewValue;
			  } else {
				  // it is invalid, return undefined (no model update)
				  
				  
				  $(elm).siblings("span").text("Arvo ei ole laillinen!");
				  ctrl.$setValidity('arvovalidaattori', false);
			        return undefined;
			      }
			    });
        }
    };
});
