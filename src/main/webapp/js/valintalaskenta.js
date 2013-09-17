var app = angular.module('valintalaskenta', ['ngResource', 'loading', 'ngRoute', 'ngAnimate'], function($rootScopeProvider) {
	$rootScopeProvider.digestTtl(25);
});

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
var CAS_URL = CAS_URL || "/cas/myroles";


//Route configuration
app.config(function($routeProvider) {
    $routeProvider.
    when('/haku/', {controller:HakuController, templateUrl:TEMPLATE_URL_BASE + 'haut.html'}).
    when('/haku/:hakuOid/hakukohde/', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohde.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohdeperustiedot.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valinnanhallinta', {controller:ValinnanhallintaController, templateUrl:TEMPLATE_URL_BASE + 'valinnanhallinta.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/harkinnanvaraiset', {controller:HarkinnanvaraisetController, templateUrl:TEMPLATE_URL_BASE + 'harkinnanvaraiset.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintalaskentatulos', {controller:ValintalaskentatulosController, templateUrl:TEMPLATE_URL_BASE + 'valintalaskentatulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintakoetulos', {controller:ValintakoetulosController, templateUrl:TEMPLATE_URL_BASE + 'valintakoetulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/hakeneet', {controller:HakeneetController, templateUrl:TEMPLATE_URL_BASE + 'hakeneet.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/pistesyotto', {controller:PistesyottoController, templateUrl:TEMPLATE_URL_BASE + 'pistesyotto.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/sijoitteluntulos', {controller:SijoitteluntulosController, templateUrl:TEMPLATE_URL_BASE + 'sijoitteluntulos.html'}).

    when('/valintatapajono/:valintatapajonoOid/hakemus/:hakemusOid/valintalaskentahistoria', {controller:ValintalaskentaHistoriaController, templateUrl:TEMPLATE_URL_BASE + 'valintalaskentahistoria.html'}).

    when('/haku/:hakuOid/henkiloittain/', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'henkilo.html'}).
    when('/haku/:hakuOid/henkiloittain/:hakemusOid/henkilotiedot', {controller:HenkiloTiedotController, templateUrl:TEMPLATE_URL_BASE + 'partials/henkilotiedot.html'}).
    //when('/haku/:hakuOid/henkiloittain', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'henkiloittain.html'}).
    //when('/haku/:hakuOid/henkiloittain/mitätuleekin', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'henkiloittain.html'}).


    when('/haku/:hakuOid/yhteisvalinnanhallinta', {controller:YhteisvalinnanHallintaController, templateUrl:TEMPLATE_URL_BASE + 'yhteisvalinnanhallinta.html'}).
    when('/lisahaku/:hakuOid/hakukohde', {controller: LisahakuController, templateUrl: TEMPLATE_URL_BASE + 'lisahakuHakukohde.html'}).
    when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller: HakukohdeController, templateUrl: TEMPLATE_URL_BASE + 'lisahaku/hakukohdeperustiedot.html'}).
    when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/hyvaksytyt', {controller: LisahakuhyvaksytytController, templateUrl: TEMPLATE_URL_BASE + 'lisahaku/hyvaksytyt.html'}).
    when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/hakeneet', {controller: HakeneetController, templateUrl: TEMPLATE_URL_BASE + 'lisahaku/hakeneet.html'}).

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



// Hakuparametrit
app.factory('Parametrit', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/parametrit/:hakuOid", {}, {
        list: {method: "GET"}
    });
})


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
    get: {method: "GET", isArray: true}
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
 return $resource(SERVICE_URL_BASE + "resources/harkinnanvarainenhyvaksynta/haku/:hakuOid/hakukohde/:hakukohdeOid/hakemus/:hakemusOid", {
    hakuOid: "@hakuOid",
    hakukohdeOid: "@hakukohdeOid",
    hakemusOid: "@hakemusOid"
    }, {
     post:{method: "POST"},
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





//valintaperusteet
app.factory('ValinnanvaiheListFromValintaperusteet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true}
    });
});



//koostepalvelu
app.factory('ValintakoelaskentaAktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintakoelaskenta/aktivoiHakukohteenValintakoelaskenta", {}, {
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
app.factory('AktivoiHaunValintakoelaskenta', function($resource) {
  return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintakoelaskenta/aktivoiHaunValintakoelaskenta", {}, {
      aktivoi: {method: "GET"}
  })
});


app.factory('SijoitteluXls', function($window) {
	return {
		query: function(data) {
			$window.location.href = VALINTALASKENTAKOOSTE_URL_BASE +"resources/valintalaskentaexcel/sijoitteluntulos/aktivoi?hakukohdeOid=" + data.hakukohdeOid + "&sijoitteluajoId="+ data.sijoitteluajoId + "&hakuOid=" + data.hakuOid;
		}
	};
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
app.factory('ValintakoeXls', function($window) {
	return {
		query: function(data) {
			// {hakukohdeOid:$routeParams.hakukohdeOid, valintakoeOid:[kokeet]}
			var postfix = "";
			data.valintakoeOid.forEach(function(oid) {
				postfix = postfix + "&valintakoeOid=" + oid;
				
			});
			$window.location.href = VALINTALASKENTAKOOSTE_URL_BASE +"resources/valintalaskentaexcel/valintakoekutsut/aktivoi?hakukohdeOid="+ data.hakukohdeOid + postfix;
		}
	};
});
app.factory('Osoitetarrat', function($resource,$window) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/osoitetarrat/aktivoi", {}, {
		query:  {method:'GET', isArray:false}
	});
});

app.factory('Hyvaksymiskirjeet', function($resource,$window) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/hyvaksymiskirjeet/aktivoi", {}, {
		query:  {method:'GET', isArray:false}
	});
});

app.factory('Jalkiohjauskirjeet', function($resource,$window) {
	return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/jalkiohjauskirjeet/aktivoi", {}, {
		query:  {method:'GET', isArray:false}
	});
});



//hakuapp related
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
app.factory('HakukohdeHenkilot', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications",{aoOid: "@aoOid"}, {
        get: {method: "GET", isArray: false}
    });
});
app.factory('Henkilot', function($resource) {
	return $resource(HAKEMUS_URL_BASE + "haku-app/applications", {},{
		query:  {method:'GET', isArray:false}
    });
});





 //Sijoittelu
app.factory('VastaanottoTilat', function($resource) {
     return $resource(SIJOITTELU_URL_BASE + "resources/tila/hakukohde/:hakukohdeOid/:valintatapajonoOid",
         {
             hakukohdeOid: "@hakukohdeoid",
             valintatapajonoOid: "@valintatapajonoOid",
         }, {
         get: {method: "GET", isArray:true}
     });
});

 app.factory('VastaanottoTila', function($resource) {
     return $resource(SIJOITTELU_URL_BASE + "resources/tila/:hakemusOid/:hakuoid/:hakukohdeOid/:valintatapajonoOid?selite=:selite",
         {
             hakuoid: "@hakuoid",
             hakukohdeOid: "@hakukohdeoid",
             valintatapajonoOid: "@valintatapajonoOid",
             hakemusOid: "@hakemusOid",
             selite: "@selite"
         }, {
         get: {method: "GET"},
         post: {method: "POST"}
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
        get: {method: "GET", isArray: true}
    });
});

app.factory('LatestSijoitteluajoHakukohde', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/latest/hakukohde/:hakukohdeOid", {hakukohdeOid: "@hakukohdeOid", hakuOid:"@hakuOid"}, {
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



app.factory('JarjestyskriteeriMuokattuJonosija', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoOid/:hakemusOid/:jarjestyskriteeriprioriteetti/jonosija?selite=:selite", {
        valintatapajonoOid: "@valintatapajonoOid",
        hakemusOid: "@hakemusOid",
        jarjestyskriteeriprioriteetti:"@jarjestyskriteeriprioriteetti",
        selite:"@selite"
    },
    {
        post: {method: "POST"}
    });
});

app.factory('ParametriService', function($routeParams, Parametrit) {
    var loaded = false, privilegesMap = {};
    if(!loaded) {
        Parametrit.list({hakuOid: $routeParams.hakuOid}, function(data) {
            $.extend(privilegesMap, data);
            loaded = true;
        });
    }
    return {
        showHakeneet: function() {
            return privilegesMap.hakeneet;
        },
        showValintalaskenta: function() {
            return privilegesMap.valintalaskenta;
        },
        showValintakoekutsut: function() {
            return privilegesMap.valintakoekutsut;
        },
        showPistesyotto: function() {
            return privilegesMap.pistesyotto;
        },
        showHarkinnanvaraiset: function() {
            return privilegesMap.harkinnanvaraiset;
        },
        showValinnanhallinta: function() {
            return privilegesMap.valinnanhallinta;
        }
    };
})