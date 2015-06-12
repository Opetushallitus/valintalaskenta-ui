function sijoitteluAjoFixtures() {
    var httpBackend = testFrame().httpBackend

    var dippainssiSijoittelu = {
        "sijoitteluajoId": 1433338214458,
        "oid": "1.2.246.562.20.37731636579",
        "tila": null,
        "tarjoajaOid": "1.2.246.562.10.72985435253",
        "valintatapajonot": [{
            "tasasijasaanto": "YLITAYTTO",
            "tila": null,
            "oid": "1433334427784-5861045456369717641",
            "nimi": "valintapajono1",
            "prioriteetti": 0,
            "aloituspaikat": 10,
            "alinHyvaksyttyPistemaara": null,
            "eiVarasijatayttoa": false,
            "kaikkiEhdonTayttavatHyvaksytaan": false,
            "poissaOlevaTaytto": false,
            "hakemukset": [{
                "hakijaOid": "1.2.246.562.24.28860135980",
                "hakemusOid": "1.2.246.562.11.00003935855",
                "pisteet": null,
                "paasyJaSoveltuvuusKokeenTulos": null,
                "etunimi": "Iiris VII",
                "sukunimi": "Vitsijärvi",
                "prioriteetti": 1,
                "jonosija": 1,
                "tasasijaJonosija": 1,
                "tila": "HYVAKSYTTY",
                "tilanKuvaukset": {},
                "tilaHistoria": [{"tila": "PERUUNTUNUT", "luotu": 1433336039261}, {
                    "tila": "HYVAKSYTTY",
                    "luotu": 1433336759084
                }],
                "hyvaksyttyHarkinnanvaraisesti": false,
                "varasijanNumero": null,
                "sijoitteluajoId": 1433338214458,
                "hakukohdeOid": "1.2.246.562.20.37731636579",
                "tarjoajaOid": "1.2.246.562.10.72985435253",
                "valintatapajonoOid": "1433334427784-5861045456369717641",
                "hakuOid": null,
                "pistetiedot": [],
                "todellinenJonosija": 1
            }],
            "hakeneet": 1,
            "hyvaksytty": 1,
            "varalla": 0,
            "varasijat": 0,
            "varasijaTayttoPaivat": 0,
            "varasijojaKaytetaanAlkaen": null,
            "varasijojaTaytetaanAsti": null,
            "tayttojono": null
        }],
        "kaikkiJonotSijoiteltu": true
    };

    var hakukohteet = [{
        "id": {
            "timeSecond": 1433337344,
            "inc": 302142310,
            "machine": -458211048,
            "time": 1433337344000,
            "date": 1433337344000,
            "timestamp": 1433337344,
            "new": false
        },
        "valintatapajonoOid": "1433334427784-5861045456369717641",
        "hakemusOid": "1.2.246.562.11.00003935855",
        "hakukohdeOid": "1.2.246.562.20.37731636579",
        "julkaistavissa": true,
        "hyvaksyttyVarasijalta": false,
        "hakijaOid": "1.2.246.562.24.28860135980",
        "hakuOid": "1.2.246.562.29.11735171271",
        "hakutoive": 1,
        "tila": "VASTAANOTTANUT_SITOVASTI",
        "ilmoittautumisTila": "EI_TEHTY",
        "logEntries": [{
            "id": null,
            "luotu": 1433337344263,
            "muokkaaja": "1.2.246.562.24.41327169638",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1433338287101,
            "muokkaaja": "1.2.246.562.24.41327169638",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1433338484384,
            "muokkaaja": "henkilö:1.2.246.562.24.28860135980",
            "muutos": "VASTAANOTTANUT_SITOVASTI",
            "selite": "Muokkaus Omat Sivut -palvelussa"
        }]
    }]

    httpBackend.when('GET', /.*resources\/tila\/hakukohde\/1\.2\.246\.562\.20\.37731636579\/1433334427784-5861045456369717641/)
        .respond(hakukohteet);
    
    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.37731636579/)
        .respond(dippainssiSijoittelu);
}
