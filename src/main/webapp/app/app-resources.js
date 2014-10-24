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
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeoid/valinnanvaihe?tarjoajaOid=:tarjoajaOid", {hakukohdeoid: "@hakukohdeoid", tarjoajaOid: "@tarjoajaOid"}, {
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

app.factory('HakukohdeHakijaryhma', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeoid/hakijaryhma", {hakukohdeoid: "@hakukohdeoid"}, {
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

app.factory('ValintaperusteetHakukohde', function($resource) {
    return $resource(VALINTAPERUSTEET_URL_BASE + "resources/hakukohde/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: false}
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
app.factory('HaeDokumenttipalvelusta', function($resource) {
    return $resource(DOKUMENTTIPALVELU_URL_BASE + "/dokumentit/:tyyppi/:hakukohdeoid", {tyyppi: "@tyyppi", hakukohdeoid: "@hakukohdeoid"}, {
        get: {method: "GET", isArray: true}
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
app.factory('SeurantaPalvelu', function($resource) {
    return $resource(SEURANTA_URL_BASE + "/seuranta/yhteenveto/:uuid", {uuid: "@uuid"}, {
        hae: {method: "GET", isArray:false}
    });
});
app.factory('SeurantaPalveluHaunLaskennat', function($resource) {
    return $resource(SEURANTA_URL_BASE + "/seuranta/hae/:hakuoid/tyyppi/:tyyppi", {hakuoid: "@hakuoid", tyyppi: "@tyyppi"}, {
        hae: {method: "GET", isArray:true}
    });
});
app.factory('SeurantaPalveluLataa', function($resource) {
    return $resource(SEURANTA_URL_BASE + "/seuranta/lataa/:uuid", {uuid: "@uuid"}, {
        hae: {method: "GET", isArray:false}
    });
});
app.factory('ValintalaskentaStatus', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentakerralla/status/:uuid", {uuid: "@uuid"}, {
        get: {method: "GET"}
    });
});
app.factory('SijoitteluAktivointi', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/koostesijoittelu/aktivoi", {}, {
        aktivoi: {method: "POST"}
    });
});
app.factory('SijoittelunValvonta', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/koostesijoittelu/status/:hakuoid", {hakuoid: "@hakuoid"}, {
        hae: {method: "GET"}
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
        put: {method: "GET", isArray:false}
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
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications",{aoOid: "@aoOid", appState:["ACTIVE","INCOMPLETE"], rows: 100000}, {
        get: {method: "GET", isArray: false}
    });
});

app.factory('HakukohdeHenkilotFull', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/listfull",{aoOid: "@aoOid", appState:["ACTIVE","INCOMPLETE"], rows: 100000}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('Henkilot', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications", {appState:["ACTIVE","INCOMPLETE"], rows: 100000},{
        query:  {method:'GET', isArray:false}
    });
});
app.factory('HakemusKey', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "haku-app/applications/:oid/:key", {oid: "@oid", key: "@key", value: "@value"}, {
        get: {method: "GET", isArray: false},
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

app.factory('HakemuksenVastaanottoTilat', function($resource) {
    return $resource(SIJOITTELU_URL_BASE + "resources/tila/:hakemusOid",
        {
            hakemusOid: "@hakemusOid"
        }, {
            get: {method: "GET", isArray: true}
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
        get: {method: "GET", isArray: true  }
    });
});


app.factory('OrganizationByOid', function ($resource) {
    return $resource(ORGANIZATION_SERVICE_URL_BASE + "organisaatio/:oid", {oid: "@oid"}, {
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
    }]);

// Koodisto
// https://itest-virkailija.oph.ware.fi/koodisto-service/rest/codeelement/codes/hakutyyppi/1
// https://itest-virkailija.oph.ware.fi/koodisto-service/rest/codeelement/codes/haunkohdejoukko/1
// https://itest-virkailija.oph.ware.fi/koodisto-service/rest/codeelement/codes/hakutapa/1
// https://itest-virkailija.oph.ware.fi/koodisto-service/rest/codeelement/codes/kausi/1