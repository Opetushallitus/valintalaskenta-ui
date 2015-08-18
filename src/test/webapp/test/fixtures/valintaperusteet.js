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

        // lisahaku
        var lisahaku = {
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
        }
        httpBackend.when('GET', /.*\/valintaperusteet-service\/resources\/hakukohde\/LISAHAKUKOHDE\/valintaryhma/).respond(lisahaku);
    }
}
