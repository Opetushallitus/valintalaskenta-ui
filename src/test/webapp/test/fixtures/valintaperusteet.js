function valintakokeetFixtures(valintakokeet) {
    return function () {
        var httpBackend = testFrame().httpBackend
        var kokeet = _.map(valintakokeet, function (valintakoe) {
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
        httpBackend.when('GET', /.*\/valintaperusteet-service\/resources\/hakukohde\/(HAKUKOHDE1|1\.2\.246\.562\.20\.37731636579|)\/valintakoe/).respond(
            kokeet
        );

        var haku = {
            "nimi": null,
            "kohdejoukko": null,
            "hakuoid": null,
            "hakuvuosi": null,
            "organisaatiot": [],
            "oid": null,
            "hakukohdekoodit": [],
            "valintakoekoodit": [],
            "lapsivalintaryhma": false,
            "lapsihakukohde": false
        };

        httpBackend.when('GET', /.*\/valintaperusteet-service\/resources\/hakukohde\/(HAKUKOHDE1|HAKUKOHDEOID)\/valintaryhma/).respond(haku);
        httpBackend.when('GET', /.*\/valintaperusteet-service\/resources\/hakukohde\/avaimet\/HAKUKOHDEOID/).respond([{
            "tunniste":"kielikoe_fi",
            "osallistuminenTunniste":"kielikoe_fi-OSALLISTUMINEN",
            "lahde":"SYOTETTAVA_ARVO",
            "vaatiiOsallistumisen":true,
            "kuvaus":"eka",
            "syotettavissaKaikille": true,
            "min": 0,
            "max": 100
        }]);

    }
}
