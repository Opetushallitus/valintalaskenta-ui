var app = angular.module('valintalaskenta', ['ngResource', 'loading']);

var SERVICE_URL_BASE = SERVICE_URL_BASE || "";
var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";
var VALINTAPERUSTEET_URL_BASE = VALINTAPERUSTEET_URL_BASE || "";
var VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE || "";
var TARJONTA_URL_BASE = TARJONTA_URL_BASE || "";


//Route configuration
app.config(function($routeProvider) {
    $routeProvider.

    
    when('/haku/:hakuOid/hakukohde/', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohde.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohdeperustiedot.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valinnanhallinta', {controller:ValinnanhallintaController, templateUrl:TEMPLATE_URL_BASE + 'valinnanhallinta.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/pistesyotto', {controller:PistesyottoController, templateUrl:TEMPLATE_URL_BASE + 'pistesyotto.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/harkinnanvaraiset/pistelaskennassa', {controller:PistelaskentaController, templateUrl:TEMPLATE_URL_BASE + 'pistelaskennassa.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/harkinnanvaraiset/harkinnassa', {controller:HarkinnassaController, templateUrl:TEMPLATE_URL_BASE + 'harkinnassa.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintalaskentatulos', {controller:ValintalaskentatulosController, templateUrl:TEMPLATE_URL_BASE + 'valintalaskentatulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintakoetulos', {controller:ValintakoetulosController, templateUrl:TEMPLATE_URL_BASE + 'valintakoetulos.html'}).
    when('/haku/:hakuOid/hakukohde/:hakukohdeOid/sijoitteluntulos', {controller:SijoitteluntulosController, templateUrl:TEMPLATE_URL_BASE + 'sijoitteluntulos.html'}).

    //when('/haku/:hakuOid/henkiloittain', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'henkiloittain.html'}).
    //when('/haku/:hakuOid/henkiloittain/mitätuleekin', {controller:HenkiloController, templateUrl:TEMPLATE_URL_BASE + 'henkiloittain.html'}).


    when('/haku/:hakuOid/yhteisvalinnanhallinta', {controller:YhteisvalinnanHallintaController, templateUrl:TEMPLATE_URL_BASE + 'yhteisvalinnanhallinta.html'}).

    otherwise({redirectTo:'/haku//hakukohde/'});
});

 
//rest resources
app.factory('Haku', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku", {}, {
    get: {method: "GET", isArray: true}
  });
});


app.factory('HakuHakukohdeChildren', function($resource) {
return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohde", {hakuOid: "@hakuOid"}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('tarjontaHakukohde', function($resource) {
return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
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

app.factory('KaikkiHakemukset', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "applications/", {}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('Hakemus', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "applications/:oid", {oid: "@oid"}, {
        get: {method: "GET"}
    });
});

app.factory('HakemusKey', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "applications/:oid/:key", {oid: "@oid", key: "@key"}, {
        get: {method: "GET"},
        put: {method: "PUT"}
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
