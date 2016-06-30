//TARJONTA RESOURCES
app.factory('Haku', function($resource) {
    return $resource(TARJONTA_URL_BASE + "haku", {}, {
        get: {method: "GET", isArray: true, cache: true}
    });
});

app.factory('HaunTiedot', function($resource) {
    return $resource(TARJONTA_URL_BASE + "haku/:hakuOid", {hakuOid: "@hakuOid"}, {
        get: {method: "GET", cache: true}
    });
});
app.factory('HakuHakukohdeChildren', function($resource) {
    return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohde?count=99999", {hakuOid: "@hakuOid"}, {
        get: {method: "GET", isArray: true, cache: true}
    });
});
app.factory('TarjontaHaku', function($resource) {
    return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohdeTulos", {},{
        query:  {method:'GET', isArray:false, cache: true}
    });
});

app.factory('TarjontaHakukohde', function($resource) {
    return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", cache: true}
    });
});
app.factory('HakukohdeNimi', function($resource) {
    return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid/nimi", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", cache: true}
    });
});

app.factory('TarjontaHaut', function($resource) {
    return $resource(TARJONTA_URL_BASE + "haku/find?addHakukohdes=false", {}, {
        get: {method: "GET", cache: true}
    });
});



// Hakuparametrit
app.factory('Parametrit', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/parametrit/:hakuOid", {}, {
        list: {method: "GET", cache: false}
    });
});

app.factory('ValintaTulosProxy', function ($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulos/haku/:hakuOid/hakemusOid/:hakemusOid", {}, {
        list: {method: "GET", cache: false}
    });
});

app.factory('ViestintapalveluProxy', function ($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/viestintapalvelu/count/haku/:hakuOid", {}, {
        list: {method: "GET", cache: false}
    });
});

app.factory('ViestintapalveluJulkaiseProxy', function ($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/viestintapalvelu/publish/haku/:hakuOid",
        {asiointikieli: "@asiointikieli", kirjeenTyyppi: "@kirjeenTyyppi"}, {
        post: {method: "POST", cache: false}
    });
});
app.factory('ViestintapalveluEPosti', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/securelinkit/aktivoi", {}, {
        post:  {method:'POST', cache: false}
    });
});

//Valintalaskenta
app.factory('HakukohdeValinnanvaihe', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:parentOid/valinnanvaihe", {parentOid: "@parentOid"}, {
        get: {method: "GET", isArray: true, cache: false },
        post:{method: "POST"},
        insert: {method: "PUT"}
    });
});

app.factory('HakuVirheet', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/haku/:parentOid/:virhetyyppi", {parentOid: "@parentOid", virhetyyppi: "@virhetyyppi"}, {
        get: {method: "GET", isArray: true, cache: false }
    });
});

app.factory('ValinnanvaiheListByHakukohde', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe?tarjoajaOid=:tarjoajaOid", {hakukohdeoid: "@hakukohdeoid", tarjoajaOid: "@tarjoajaOid"}, {
        get: {method: "GET", isArray: true, cache: false},
        post:{method: "POST"}
    });
});

app.factory('Valintatapajono', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoid/jarjestyskriteeritulos", {valintatapajonoid: "@valintatapajonoid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

app.factory('ValintatapajonoListByValinnanvaihe', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:valinnanvaiheoid/valintatapajono", {valinnanvaiheoid: "@valinnanvaiheoid"}, {
        get: {method: "GET", isArray: true, cache: false}
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
            get: {method: "GET", isArray: true, cache: false}
        });
});
app.factory('HarkinnanvaraisestiHyvaksytty', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/harkinnanvarainenhyvaksynta/haku/:hakuOid/hakemus/:hakemusOid",
        {
            hakuOid: "@hakuOid",
            hakemusOid: "@hakemusOid"

        }, {
            get: {method: "GET", isArray: true, cache: false}
        });
});

app.factory('HakukohdeHakijaryhma', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeoid/hakijaryhma", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

//valintaperusteet
app.factory('ValinnanvaiheListFromValintaperusteet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true, cache: false, params: {withValisijoitteluTieto: true}}
    });
});
app.factory('Valintatapajono', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/valintatapajono/:valintatapajonoOid", {valintatapajonoOid: "@valintatapajonoOid"}, {
        get: {method: "GET", cache: false}
    });
});
app.factory('ValinnanVaiheetIlmanLaskentaa', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid/ilmanlaskentaa", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

app.factory('ValintaperusteetHakukohde', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: false, cache: false}
    });
});

app.factory('ValintaperusteetHakukohdeValintaryhma', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid/valintaryhma", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: false, cache: false}
    });
});

// d
app.factory('DokumenttiProsessinTila', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/dokumenttiprosessi/:id", {id: "@id"}, {
        lue: {method: "GET", cache: false},
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
app.factory('HaeDokumenttipalvelusta', function($resource) {
    return $resource(DOKUMENTTIPALVELU_URL_BASE + "/dokumentit/:tyyppi/:hakukohdeoid", {tyyppi: "@tyyppi", hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
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
            $http({method: "GET", cache: false, url: DOKUMENTTIPALVELU_URL_BASE + "/dokumentit/hae"}).
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
app.factory('ValintalaskentaKokoHaulle', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentakerralla/haku/:hakuoid/tyyppi/HAKU", {hakuoid: "@hakuoid"}, {aktivoi: {method: "POST"}});
});
app.factory('ValintalaskentaKerrallaHakukohteille', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentakerralla/haku/:hakuoid/tyyppi/:tyyppi/whitelist/:whitelist",
        {hakuoid: "@hakuoid", whitelist: "@whitelist", tyyppi: "@tyyppi"}, {
            aktivoi: {method: "POST"}
        });
});
app.factory('ValintalaskentaKerrallaAktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentakerralla/haku/:hakuoid", {hakuoid: "@hakuoid"}, {
        keskeyta: {method: "DELETE"}
    });
});
app.factory('ValintalaskentaKerrallaUudelleenYrita', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentakerralla/uudelleenyrita/:uuid", {uuid: "@uuid"}, {
        uudelleenyrita: {method: "POST"}
    });
});
app.factory('DokumenttiSeurantaPalvelu', function($resource) {
    return $resource(SEURANTA_URL_BASE + "/dokumenttiseuranta/:uuid", {uuid: "@uuid"}, {
        hae: {method: "GET", isArray:false, cache: false}
    });
});
app.factory('SeurantaPalvelu', function($resource) {
    return $resource(SEURANTA_URL_BASE + "/seuranta/yhteenveto/:uuid", {uuid: "@uuid"}, {
        hae: {method: "GET", isArray:false, cache: false}
    });
});
app.factory('SeurantaPalveluHaunLaskennat', function($resource) {
    return $resource(SEURANTA_URL_BASE + "/seuranta/hae/:hakuoid/tyyppi/:tyyppi", {hakuoid: "@hakuoid", tyyppi: "@tyyppi"}, {
        hae: {method: "GET", isArray:true, cache: false}
    });
});
app.factory('SeurantaPalveluLataa', function($resource) {
    return $resource(SEURANTA_URL_BASE + "/seuranta/lataa/:uuid", {uuid: "@uuid"}, {
        hae: {method: "GET", isArray:false, cache: false}
    });
});
app.factory('ValintalaskentaStatus', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentakerralla/status/:uuid", {uuid: "@uuid"}, {
        get: {method: "GET", cache: false}
    });
});
app.factory('SijoitteluAktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/koostesijoittelu/aktivoi", {}, {
        aktivoi: {method: "POST"}
    });
});
app.factory('SijoittelunValvonta', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/koostesijoittelu/status/:hakuoid", {hakuoid: "@hakuoid"}, {
        hae: {method: "GET", cache: false}
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

app.factory('KoekutsukirjeetEsikatseleSahkopostita', function($resource) {
    return $resource(VIESTINTAPALVELU_URL_BASE + "/api/v1/letter/previewLetterBatchEmail/:documentId", {
        documentId: "@documentId"
    }, {
        put: {method: "GET", isArray:false, cache: false}
    });
});
app.factory('KoekutsukirjeetSahkopostita', function($resource) {
    return $resource(VIESTINTAPALVELU_URL_BASE + "/api/v1/letter/emailLetterBatch/:documentId", {
        documentId: "@documentId"
    }, {
        put: {method: "POST", isArray:false}
    });
});
app.factory('AktivoiKelaFtp', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/kela/laheta", {}, {
        post: {method: "POST", isArray:false}
    });
});

app.factory('KelaDokumentti', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/kela/aktivoi", {}, {
        post:  {method:'POST', isArray:false}
    });
});
app.factory('ErillishakuVienti', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/erillishaku/vienti", {}, {
        vie: {method:'POST', isArray:false}
    });
});
app.factory('ErillishakuTuonti', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/erillishaku/tuonti/json", {}, {
        tuo: {method:'POST', isArray:false}
    });
});
app.factory('ErillishakuProxy', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/erillishaku/haku/:hakuOid/hakukohde/:hakukohdeOid", {
        hakuOid: "@hakuOid",
        hakukohdeOid: "@hakukohdeOid"
    }, {
        hae: {method:'GET', isArray:true, cache: false}
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
app.factory('HakukohteelleJalkiohjauskirjeet', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/hakukohteessahylatyt/aktivoi", {}, {
        post:  {method:'POST', isArray:false}
    });
});
app.factory('Hyvaksymiskirjeet', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/viestintapalvelu/hyvaksymiskirjeet/aktivoi", {}, {
        post:  {method:'POST', isArray:false}
    });
});





app.factory('SijoittelunTulosOsoitetarrat', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/sijoitteluntuloshaulle/osoitetarrat", {}, {
        aktivoi:  {method:'POST', isArray:false}
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
    return $resource(VIESTINTAPALVELU_URL_BASE + "/api/v1/template/getHistory?templateName=:templateName&languageCode=:languageCode&oid=:tarjoajaOid&tag=:tag&applicationPeriod=:hakuOid", {templateName: "@templateName", languageCode:"@languageCode", tarjoajaOid: "@tarjoajaOid", tag:"@tag", hakuOid: "@hakuOid"}, {
        get: {method: "GET", isArray:true, cache: false}
    });
});
app.factory('Jalkiohjauskirjepohjat', function($resource) {
    return $resource(VIESTINTAPALVELU_URL_BASE + "/api/v1/template/getHistory?templateName=jalkiohjauskirje&languageCode=:languageCode&tag=:tag&applicationPeriod=:applicationPeriod", {languageCode:"@languageCode", tag:"@tag", applicationPeriod: "@applicationPeriod"}, {
        get: {method: "GET", isArray:true, cache: false}
    });
});
app.factory('Hyvaksymiskirjepohjat', function($resource) {
    return $resource(VIESTINTAPALVELU_URL_BASE + "/api/v1/template/getHistory?templateName=hyvaksymiskirje&languageCode=:languageCode&tag=:tag&applicationPeriod=:applicationPeriod", {languageCode:"@languageCode", tag:"@tag", applicationPeriod: "@applicationPeriod"}, {
        get: {method: "GET", isArray:true, cache: false}
    });
});
//hakuapp related
app.factory('Hakemus', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/:oid", {oid: "@oid", appState:["ACTIVE","INCOMPLETE"]}, {
        get: {method: "GET", cache: false}
    });
});
app.factory('HakemusAdditionalData', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/additionalData/:hakuOid/:hakukohdeOid", {hakuOid: "@hakuOid", hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET", isArray: true, cache: false},
        put: {method: "PUT", isArray: true}
    });
});
app.factory('HakemusAdditionalDataByOids', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/additionalData", {}, {
        post: {method: "POST", isArray: true}
    });
});
app.factory('HakukohdeHenkilot', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications",{aoOid: "@aoOid", asId: "@asId", appState:["ACTIVE","INCOMPLETE"], rows: 100000}, {
        get: {method: "GET", isArray: false, cache: true}
    });
});

app.factory('HakukohdeHenkilotFull', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/listfull",{aoOid: "@aoOid", asId: "@asId", appState:["ACTIVE","INCOMPLETE"], rows: 100000}, {
        get: {method: "GET", isArray: true, cache: true}
    });
});

app.factory('Henkilot', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications", {appState:["ACTIVE","INCOMPLETE"], rows: 100000},{
        query:  {method:'GET', isArray:false, cache: true}
    });
});
app.factory('HakemusKey', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/:oid/:key", {oid: "@oid", key: "@key", value: "@value"}, {
        get: {method: "GET", isArray: false, cache: false},
        put: {method: "PUT", isArray: false}
    });
});


//Sijoittelu
app.factory('HakemuksenValintatulokset', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/hakemus/:hakemusOid/haku/:hakuOid/hakukohde/:hakukohdeOid/valintatapajono/:valintatapajonoOid",
      {
          hakemusOid: "@hakemusOid",
          hakuOid: "@hakuOid",
          hakukohdeOid: "@hakukohdeoid",
          valintatapajonoOid: "@valintatapajonoOid"
      }, {
          get: {method: "GET", isArray:true, cache: false}
      });
});
app.factory('HenkilotByOid', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/list", {rows: 100000}, {
        hae: {method:'POST', isArray:true} // , cache: true
    });
});
app.factory('VastaanottoTila', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/haku/:hakuOid/hakukohde/:hakukohdeOid?selite=:selite",
        {
            hakuOid: "@hakuOid",
            hakukohdeOid: "@hakukohdeOid",
            selite: "@selite"
        }, {
            post: {method: "POST"}
        });
});
app.factory('ValintaesityksenHyvaksyminen', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/tila/haku/:hakuOid/hakukohde/:hakukohdeOid/valintatapajono/:hyvaksyttyJonoOid/valintaesitys?selite=:selite&hyvaksytty=true",
        {
            hakuOid: "@hakuOid",
            hakukohdeOid: "@hakukohdeOid",
            selite: "@selite",
            valintatapajonoOid: "@hyvaksyttyJonoOid"
        }, {
            post: {method: "POST"}
        });
});
app.factory('ErillishaunVastaanottoTila', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/erillishaku/haku/:hakuoid/hakukohde/:hakukohdeOid?selite=:selite",
        {
            hakuoid: "@hakuoid",
            hakukohdeOid: "@hakukohdeoid",
            selite: "@selite"
        }, {
            post: {method: "POST"}
        });
});

app.factory('SijoitteluTila', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/tila/haku/:hakuoid/hakukohde/:hakukohdeOid/hakemus/:hakemusOid?tarjoajaOid=:tarjoajaOid",
        {
            hakuoid: "@hakuoid",
            hakukohdeOid: "@hakukohdeoid",
            hakemusOid: "@hakemusOid",
            tarjoajaOid: "@tarjoajaOid"
        }, {
            post: {method: "POST"}
        });
});


app.factory('HakemuksenVastaanottoTila', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/hakemus/:hakemusOid/haku/:hakuOid/hakukohde/:hakukohdeOid/valintatapajono/:valintatapajonoOid",
        {
            hakuOid: "@hakuOid",
            hakukohdeOid: "@hakukohdeOid",
            valintatapajonoOid: "@valintatapajonoOid",
            hakemusOid: "@hakemusOid"
        }, {
            get: {method: "GET", isArray: true, cache: false}
        });
});

app.factory('SijoittelunVastaanottotilat', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/hakemus/:hakemusOid/haku/:hakuOid",
      {
          hakuoid: "@hakuoid",
          hakemusOid: "@hakemusOid"
      }, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

app.factory('Sijoittelu', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/", {hakuOid: "@hakuOid"}, {
        get: {method: "GET", cache: false}
    });
});
app.factory('SijoitteluAjo', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/:sijoitteluajoOid", {hakuOid: "@hakuOid", sijoitteluajoOid:"@sijoitteluajoOid" }, {
        get: {method: "GET", cache: false}
    });
});

app.factory('LatestSijoittelunTilat', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/latest/hakemus/:hakemusOid", {hakemusOid: "@hakemusOid", hakuOid:"@hakuOid"}, {
        get: {method: "GET", cache: false}
    });
});

app.factory('LatestSijoitteluajoHakukohde', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/latest/hakukohde/:hakukohdeOid", {hakukohdeOid: "@hakukohdeOid", hakuOid:"@hakuOid"}, {
        get: {method: "GET", cache: false}
    });
});

app.factory('ErillisHakuSijoitteluajoHakukohde', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/erillissijoittelu/:hakuOid/sijoitteluajo/:sijoitteluajoId/hakukohde/:hakukohdeOid", {hakukohdeOid: "@hakukohdeOid", hakuOid:"@hakuOid", sijoitteluajoId: "@sijoitteluajoId"}, {
        get: {method: "GET", cache: false}
    });
});


app.factory('Valintatulos', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/sijoittelu/:hakuOid/sijoitteluajo/latest/hakemukset", {hakuOid:"@hakuOid"}, {
        get: {method: "GET", cache: false}
    });
});


// Valintakoetulokset
app.factory('Valintakoetulokset', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintakoe/hakutoive/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

app.factory('Valintakoe', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/valintakoe/:valintakoeOid", {valintakoeOid: "@valintakoeOid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});
app.factory('HakukohdeValintakoe', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeOid/valintakoe", {hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

app.factory('ValintakoetuloksetHakemuksittain', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintakoe/hakemus/:hakemusOid", {hakemusOid: "@hakemusOid"}, {
        get: {method: "GET", cache: false}
    });
});

app.factory('HakukohdeAvaimet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/avaimet/:hakukohdeOid",{hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});


app.factory('ValintalaskentaHistoria', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/jonosijahistoria/:valintatapajonoOid/:hakemusOid", {valintatapajonoOid: "@valintatapajonoOid", hakemusOid:"@hakemusOid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});
app.factory('ValintalaskentaHakemus', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakemus/:hakuoid/:hakemusoid", {hakuoid: "@hakuoid", hakemusoid:"@hakemusoid"}, {
        get: {method: "GET", isArray: false, cache: false}
    });
});
app.factory('MyRoles', function($resource) {
    return $resource(CAS_URL, {}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

app.factory('JatkuvaSijoittelu', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/koostesijoittelu/jatkuva/:method", {}, {
        get: {method: "GET", cache: false}
    });
});



app.factory('JarjestyskriteeriMuokattuJonosija', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoOid/:hakemusOid/:jarjestyskriteeriprioriteetti/jonosija", {
            valintatapajonoOid: "@valintatapajonoOid",
            hakemusOid: "@hakemusOid",
            jarjestyskriteeriprioriteetti:"@jarjestyskriteeriprioriteetti"
        },
        {
            post: {method: "POST"},
            remove: {method: "DELETE"}
        });
});

app.factory('ValintatapajonoSijoitteluStatus', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoOid/valmissijoiteltavaksi?status=:status", {
            valintatapajonoOid: "@valintatapajonoOid",
            status: "@status"
        },
        {
            put: {method: "put"}
        });
});

//Valintaryhma
app.factory('ValintaryhmatJaHakukohteet', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/puu", {
        q: "@q",
        hakuOid: "@hakuOid",
        tila: "@tila",
        kohdejoukko: "@kohdejoukko"
    }, {
        get: {method: "GET", isArray: true, cache: false  }
    });
});


app.factory('OrganizationByOid', function ($resource) {
    return $resource(ORGANIZATION_SERVICE_URL_BASE + "organisaatio/:oid", {oid: "@oid"}, {
        get: {method: "GET", cache: true}
    });
});

app.factory('OrganizationHierarchy', function ($resource) {
    return $resource(ORGANIZATION_SERVICE_URL_BASE + "organisaatio/v2/hierarkia/hae?aktiiviset=true&suunnitellut=true&lakkautetut=false&oid=:oid", {oid: "@oid"}, {
        get: {method: "GET", cache: true}
    });
});


angular.module('valintalaskenta')

    .factory('HakujenHakutyypit', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/hakutyyppi/1");
    }])

    .factory('HakujenKohdejoukot', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/haunkohdejoukko/1");
    }])

    .factory('HakujenHakutavat', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/hakutapa/1");
    }])

    .factory('HakujenHakukaudet', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/kausi/1");
    }])

    .factory('HakukohteenNimi', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE +  "hakukohdenimi/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"});
    }])

    .factory('HakukohdeKoodistoNimi', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "json/hakukohteet/koodi/:hakukohteenNimiUri", {hakukohteenNimiUri: "@hakukohteenNimiUri"});
    }])


    .factory('Ohjausparametrit', ['$resource', function ($resource) {
        return $resource(OHJAUSPARAMETRIT_URL_BASE + "/v1/rest/parametri/:hakuOid", {hakuOid: "@hakuOid"});
    }]);

