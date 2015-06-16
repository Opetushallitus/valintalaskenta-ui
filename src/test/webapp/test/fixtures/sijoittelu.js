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

    var sijoitteluKesken = {
        "sijoitteluajoId": 1434456001492,
        "oid": "1.2.246.562.20.38908264799",
        "tila": null,
        "tarjoajaOid": "1.2.246.562.10.72985435253",
        "valintatapajonot": [{
            "tasasijasaanto": "ALITAYTTO",
            "tila": null,
            "oid": "14255456271064587270246623295085",
            "nimi": "DIA-DI valintaryhmä 1",
            "prioriteetti": 0,
            "aloituspaikat": 25,
            "alinHyvaksyttyPistemaara": -5,
            "eiVarasijatayttoa": false,
            "kaikkiEhdonTayttavatHyvaksytaan": false,
            "poissaOlevaTaytto": false,
            "hakemukset": [{
                "hakijaOid": null,
                "hakemusOid": "1.2.246.562.11.00000000220",
                "pisteet": -2,
                "paasyJaSoveltuvuusKokeenTulos": null,
                "etunimi": "Teppo",
                "sukunimi": "Testaaja",
                "prioriteetti": 1,
                "jonosija": 2,
                "tasasijaJonosija": 1,
                "tila": "HYVAKSYTTY",
                "tilanKuvaukset": {},
                "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1434433941533}],
                "hyvaksyttyHarkinnanvaraisesti": false,
                "varasijanNumero": null,
                "sijoitteluajoId": 1434456001492,
                "hakukohdeOid": "1.2.246.562.20.38908264799",
                "tarjoajaOid": "1.2.246.562.10.72985435253",
                "valintatapajonoOid": "14255456271064587270246623295085",
                "hakuOid": null,
                "pistetiedot": [],
                "todellinenJonosija": 2
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
        "kaikkiJonotSijoiteltu": false
    };

    var hakukohteet1 = [{
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

    var hakukohteet2 = [{
        "id": {
            "timeSecond": 1434436218,
            "inc": -1570761716,
            "machine": -458201388,
            "timestamp": 1434436218,
            "time": 1434436218000,
            "date": 1434436218000,
            "new": false
        },
        "valintatapajonoOid": "14255456271064587270246623295085",
        "hakemusOid": "1.2.246.562.11.00000000495",
        "hakukohdeOid": "1.2.246.562.20.38908264799",
        "julkaistavissa": false,
        "hyvaksyttyVarasijalta": false,
        "hakijaOid": null,
        "hakuOid": "1.2.246.562.29.95390561488",
        "hakutoive": 1,
        "tila": "KESKEN",
        "ilmoittautumisTila": "EI_TEHTY",
        "logEntries": [{
            "id": null,
            "luotu": 1434436218285,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1434436288202,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }]
    }, {
        "id": {
            "timeSecond": 1434436218,
            "inc": -1570761717,
            "machine": -458201388,
            "timestamp": 1434436218,
            "time": 1434436218000,
            "date": 1434436218000,
            "new": false
        },
        "valintatapajonoOid": "14255456271064587270246623295085",
        "hakemusOid": "1.2.246.562.11.00000000369",
        "hakukohdeOid": "1.2.246.562.20.38908264799",
        "julkaistavissa": false,
        "hyvaksyttyVarasijalta": false,
        "hakijaOid": null,
        "hakuOid": "1.2.246.562.29.95390561488",
        "hakutoive": 1,
        "tila": "KESKEN",
        "ilmoittautumisTila": "EI_TEHTY",
        "logEntries": [{
            "id": null,
            "luotu": 1434436218269,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1434436288190,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }]
    }, {
        "id": {
            "timeSecond": 1434436218,
            "inc": -1570761718,
            "machine": -458201388,
            "timestamp": 1434436218,
            "time": 1434436218000,
            "date": 1434436218000,
            "new": false
        },
        "valintatapajonoOid": "14255456271064587270246623295085",
        "hakemusOid": "1.2.246.562.11.00000000233",
        "hakukohdeOid": "1.2.246.562.20.38908264799",
        "julkaistavissa": false,
        "hyvaksyttyVarasijalta": false,
        "hakijaOid": null,
        "hakuOid": "1.2.246.562.29.95390561488",
        "hakutoive": 1,
        "tila": "KESKEN",
        "ilmoittautumisTila": "EI_TEHTY",
        "logEntries": [{
            "id": null,
            "luotu": 1434436218259,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1434436288184,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }]
    }, {
        "id": {
            "timeSecond": 1434436218,
            "inc": -1570761719,
            "machine": -458201388,
            "timestamp": 1434436218,
            "time": 1434436218000,
            "date": 1434436218000,
            "new": false
        },
        "valintatapajonoOid": "14255456271064587270246623295085",
        "hakemusOid": "1.2.246.562.11.00000000220",
        "hakukohdeOid": "1.2.246.562.20.38908264799",
        "julkaistavissa": true,
        "hyvaksyttyVarasijalta": false,
        "hakijaOid": null,
        "hakuOid": "1.2.246.562.29.95390561488",
        "hakutoive": 1,
        "tila": "KESKEN",
        "ilmoittautumisTila": "EI_TEHTY",
        "logEntries": [{
            "id": null,
            "luotu": 1434436218236,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1434436288178,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1434438554943,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }]
    }, {
        "id": {
            "timeSecond": 1434436218,
            "inc": -1570761720,
            "machine": -458201388,
            "timestamp": 1434436218,
            "time": 1434436218000,
            "date": 1434436218000,
            "new": false
        },
        "valintatapajonoOid": "14255456271064587270246623295085",
        "hakemusOid": "1.2.246.562.11.00000000327",
        "hakukohdeOid": "1.2.246.562.20.38908264799",
        "julkaistavissa": false,
        "hyvaksyttyVarasijalta": false,
        "hakijaOid": null,
        "hakuOid": "1.2.246.562.29.95390561488",
        "hakutoive": 1,
        "tila": "KESKEN",
        "ilmoittautumisTila": "EI_TEHTY",
        "logEntries": [{
            "id": null,
            "luotu": 1434436218142,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }, {
            "id": null,
            "luotu": 1434436288173,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "KESKEN",
            "selite": "Massamuokkaus"
        }]
    }];

    httpBackend.when('GET', /.*resources\/tila\/hakukohde\/1\.2\.246\.562\.20\.37731636579\/1433334427784-5861045456369717641/)
        .respond(hakukohteet1);

    httpBackend.when('GET', /.*resources\/tila\/hakukohde\/1\.2\.246\.562\.11\.00000000220\/14255456271064587270246623295085/)
        .respond(hakukohteet2);

    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.37731636579/)
        .respond(dippainssiSijoittelu);

    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.11\.00000000220/)
        .respond(sijoitteluKesken);
}
