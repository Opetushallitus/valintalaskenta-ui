function valintakokeetFixtures(valintakokeet) {
    return function() {
        var httpBackend = testFrame().httpBackend
        var kokeet = _.map(valintakokeet, function(valintakoe){
            return {
                tunniste: valintakoe.valintakoeOid,
                selvitettyTunniste: valintakoe.valintakoeOid,
                laskentakaavaId: 579,
                nimi: valintakoe.valintakoeOid,
                kuvaus: valintakoe.valintakoeOid,
                aktiivinen: true,
                lahetetaankoKoekutsut: true,
                kutsutaankoKaikki: valintakoe.kutsutaankoKaikki,
                kutsuttavienMaara: null,
                kutsunKohde: "YLIN_TOIVE",
                kutsunKohdeAvain: null,
                oid: valintakoe.valintakoeOid,
                funktiokutsu: null
            }
        });
        httpBackend.when('GET', /.*\/valintaperusteet-service\/resources\/hakukohde\/HAKUKOHDE1\/valintakoe/).respond(
            kokeet
        );
    }
}


function valintaperusteetFixtures() {
    var httpBackend = testFrame().httpBackend

    httpBackend.when('GET', /.*\/valintaperusteet-service\/resources\/hakukohde\/(HAKUKOHDEOID|HAKUKOHDE1)\/valintaryhma/).respond({
        "nimi": "Peruskaava",
        "kohdejoukko": null,
        "hakuoid": null,
        "hakuvuosi": null,
        "organisaatiot": [],
        "oid": "13959055144092858132438821182002",
        "hakukohdekoodit": [],
        "valintakoekoodit": [],
        "lapsivalintaryhma": false,
        "lapsihakukohde": false
    })

    httpBackend.when('GET', /.*\/valintaperusteet-service\/resources\/hakukohde\/avaimet\/.*/).respond([
        {
            "tunniste": "ei_vaikuta",
            "kuvaus": "Kaikille vaikuttaa ei vaikuta laskentaan",
            "funktiotyyppi": "LUKUARVOFUNKTIO",
            "lahde": "SYOTETTAVA_ARVO",
            "onPakollinen": false,
            "min": null,
            "max": null,
            "arvot": null,
            "osallistuminenTunniste": "ei_vaikuta-OSALLISTUMINEN",
            "vaatiiOsallistumisen": false,
            "syotettavissaKaikille": true
        },
        {
            "tunniste": "42f3fca6-14a0-1a3b-e042-627a30bef63d",
            "kuvaus": "Kirjallinen osio 2 (max 30 p)",
            "funktiotyyppi": "LUKUARVOFUNKTIO",
            "lahde": "SYOTETTAVA_ARVO",
            "onPakollinen": true,
            "min": "0",
            "max": "30",
            "arvot": null,
            "osallistuminenTunniste": "42f3fca6-14a0-1a3b-e042-627a30bef63d-OSALLISTUMINEN",
            "vaatiiOsallistumisen": true,
            "syotettavissaKaikille": false
        },
        {
            "tunniste": "d3c46564-1700-4c73-eabd-808cf667dad8",
            "kuvaus": "Kirjallinen osio 1 (max 20 p)",
            "funktiotyyppi": "LUKUARVOFUNKTIO",
            "lahde": "SYOTETTAVA_ARVO",
            "onPakollinen": true,
            "min": "0",
            "max": "20",
            "arvot": null,
            "osallistuminenTunniste": "d3c46564-1700-4c73-eabd-808cf667dad8-OSALLISTUMINEN",
            "vaatiiOsallistumisen": true,
            "syotettavissaKaikille": false
        },
        {
            "tunniste": "efea9350-9bb6-5949-c2aa-b27f1c5784d9",
            "kuvaus": "Soveltuvuus ja motivaatio alalle (max 20 p)",
            "funktiotyyppi": "LUKUARVOFUNKTIO",
            "lahde": "SYOTETTAVA_ARVO",
            "onPakollinen": true,
            "min": "0",
            "max": "20",
            "arvot": null,
            "osallistuminenTunniste": "efea9350-9bb6-5949-c2aa-b27f1c5784d9-OSALLISTUMINEN",
            "vaatiiOsallistumisen": true,
            "syotettavissaKaikille": false
        },
        {
            "tunniste": "vaikuttaa_laskentaan",
            "kuvaus": "Kaikille vaikuttaa laskentaan",
            "funktiotyyppi": "LUKUARVOFUNKTIO",
            "lahde": "SYOTETTAVA_ARVO",
            "onPakollinen": false,
            "min": null,
            "max": null,
            "arvot": null,
            "osallistuminenTunniste": "vaikuttaa_laskentaan-OSALLISTUMINEN",
            "vaatiiOsallistumisen": true,
            "syotettavissaKaikille": true
        },
        {
            "tunniste": "ala_kutsu_ketaan",
            "kuvaus": "Älä kutsu ketään",
            "funktiotyyppi": "LUKUARVOFUNKTIO",
            "lahde": "SYOTETTAVA_ARVO",
            "onPakollinen": false,
            "min": null,
            "max": null,
            "arvot": null,
            "osallistuminenTunniste": "ala_kutsu_ketaan-OSALLISTUMINEN",
            "vaatiiOsallistumisen": true,
            "syotettavissaKaikille": false
        }
    ])
}