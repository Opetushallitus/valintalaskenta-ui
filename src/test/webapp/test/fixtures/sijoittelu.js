function sijoitteluAjoFixturesWithValintaesitysHyvaksytty() {
    return sijoitteluAjoFixtures(true);
}
function sijoitteluAjoFixtures(valintaesitysHyvaksytty) {
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
            "nimi": "valintatapajono1",
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
                "onkoMuuttunutViimeSijoittelussa": true,
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
            }, {
                   "hakijaOid": "1.2.246.562.24.28860135981",
                   "hakemusOid": "1.2.246.562.11.00003935856",
                   "pisteet": null,
                   "paasyJaSoveltuvuusKokeenTulos": null,
                   "etunimi": "Pekka III",
                   "sukunimi": "Testauspastori",
                   "prioriteetti": 1,
                   "jonosija": 1,
                   "tasasijaJonosija": 1,
                   "tila": "HYVAKSYTTY",
                   "tilanKuvaukset": {},
                   "onkoMuuttunutViimeSijoittelussa": true,
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
               }
            ]},
            {
                "tasasijasaanto": "YLITAYTTO",
                "tila": null,
                "oid": "1433334427784-5861045456369717642",
                "nimi": "valintatapajono2",
                "prioriteetti": 0,
                "aloituspaikat": 10,
                "alinHyvaksyttyPistemaara": null,
                "eiVarasijatayttoa": false,
                "kaikkiEhdonTayttavatHyvaksytaan": false,
                "poissaOlevaTaytto": false,
                "hakemukset": [{
                    "hakijaOid": "1.2.246.562.24.28860135981",
                    "hakemusOid": "1.2.246.562.11.00003935856",
                    "pisteet": null,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": "Pekka III",
                    "sukunimi": "Testauspastori",
                    "prioriteetti": 1,
                    "jonosija": 1,
                    "tasasijaJonosija": 1,
                    "tila": "PERUUNTUNUT",
                    "tilanKuvaukset": {},
                    "onkoMuuttunutViimeSijoittelussa": true,
                    "tilaHistoria": [{"tila": "PERUUNTUNUT", "luotu": 1433336039261}, {
                        "tila": "PERUUNTUNUT",
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

    httpBackend.when('GET', /.*resources\/proxy\/valintatulosservice\/haku\/.*\/hakukohde\/1\.2\.246\.562\.20\.37731636579\?valintatapajonoOid=1433334427784-5861045456369717641/)
        .respond(hakukohteet1);

    httpBackend.when('GET', /.*resources\/proxy\/valintatulosservice\/haku\/.*\/hakukohde\/1\.2\.246\.562\.11\.00000000220\?valintatapajonoOid=14255456271064587270246623295085/)
        .respond(hakukohteet2);

    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.37731636579/)
        .respond(dippainssiSijoittelu);

    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.11\.00000000220/)
        .respond(sijoitteluKesken);
    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.90697286251\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.18097797874/).respond({
        "kaikkiJonotSijoiteltu": true,
        "valintatapajonot": [
            {
                "tayttojono": null,
                "varasijojaTaytetaanAsti": null,
                "varasijojaKaytetaanAlkaen": null,
                "varasijaTayttoPaivat": 0,
                "varasijat": 0,
                "varalla": 0,
                "hyvaksytty": 2,
                "hakeneet": 4,
                "hakemukset": [
                    {
                        "todellinenJonosija": 1,
                        "pistetiedot": [],
                        "hakuOid": null,
                        "valintatapajonoOid": "1427374494574-2003796769000462860",
                        "tarjoajaOid": "1.2.246.562.10.10464399921",
                        "hakukohdeOid": "1.2.246.562.20.18097797874",
                        "sijoitteluajoId": 1433854337781,
                        "varasijanNumero": null,
                        "hyvaksyttyHarkinnanvaraisesti": false,
                        "tilaHistoria": [
                            {
                                "luotu": 1433331089168,
                                "tila": "HYLATTY"
                            }
                        ],
                        "tilanKuvaukset": {
                            "FI": "Peruuntunut, ottanut vastaan toisen opiskelupaikan"
                        },
                        "tila": "PERUUNTUNUT",
                        "tasasijaJonosija": 1,
                        "jonosija": 1,
                        "prioriteetti": 2,
                        "sukunimi": "Kelpo-Suonio",
                        "etunimi": "Veikko VIII",
                        "paasyJaSoveltuvuusKokeenTulos": null,
                        "pisteet": null,
                        "hakemusOid": "1.2.246.562.11.00002071778",
                        "hakijaOid": "1.2.246.562.24.96271318661"
                    },
                    {
                        "todellinenJonosija": 2,
                        "pistetiedot": [],
                        "hakuOid": null,
                        "valintatapajonoOid": "1427374494574-2003796769000462860",
                        "tarjoajaOid": "1.2.246.562.10.10464399921",
                        "hakukohdeOid": "1.2.246.562.20.18097797874",
                        "sijoitteluajoId": 1433854337781,
                        "varasijanNumero": null,
                        "hyvaksyttyHarkinnanvaraisesti": false,
                        "tilaHistoria": [
                            {
                                "luotu": 1433331089168,
                                "tila": "HYLATTY"
                            }
                        ],
                        "tilanKuvaukset": {
                            "FI": "Peruuntunut, ottanut vastaan toisen opiskelupaikan"
                        },
                        "tila": "PERUUNTUNUT",
                        "tasasijaJonosija": 1,
                        "jonosija": 2,
                        "prioriteetti": 5,
                        "sukunimi": "Sallilahti",
                        "etunimi": "Emma V",
                        "paasyJaSoveltuvuusKokeenTulos": null,
                        "pisteet": null,
                        "hakemusOid": "1.2.246.562.11.00002380171",
                        "hakijaOid": "1.2.246.562.24.27210964812"
                    },
                    {
                        "todellinenJonosija": 3,
                        "pistetiedot": [],
                        "hakuOid": null,
                        "valintatapajonoOid": "1427374494574-2003796769000462860",
                        "tarjoajaOid": "1.2.246.562.10.10464399921",
                        "hakukohdeOid": "1.2.246.562.20.18097797874",
                        "sijoitteluajoId": 1433854337781,
                        "varasijanNumero": null,
                        "hyvaksyttyHarkinnanvaraisesti": false,
                        "tilaHistoria": [
                            {
                                "luotu": 1433331089168,
                                "tila": "HYVAKSYTTY"
                            }
                        ],
                        "tilanKuvaukset": null,
                        "onkoMuuttunutViimeSijoittelussa": true,
                        "tila": "HYVAKSYTTY",
                        "tasasijaJonosija": 1,
                        "jonosija": 3,
                        "prioriteetti": 1,
                        "sukunimi": "Hippim\u00e4ki",
                        "etunimi": "Nelli X",
                        "paasyJaSoveltuvuusKokeenTulos": null,
                        "pisteet": 9.92,
                        "hakemusOid": "1.2.246.562.11.00002227962",
                        "hakijaOid": "1.2.246.562.24.79882755575"
                    },
                    {
                        "todellinenJonosija": 4,
                        "pistetiedot": [],
                        "hakuOid": null,
                        "valintatapajonoOid": "1427374494574-2003796769000462860",
                        "tarjoajaOid": "1.2.246.562.10.10464399921",
                        "hakukohdeOid": "1.2.246.562.20.18097797874",
                        "sijoitteluajoId": 1433854337781,
                        "varasijanNumero": null,
                        "hyvaksyttyHarkinnanvaraisesti": false,
                        "tilaHistoria": [
                            {
                                "luotu": 1433331089169,
                                "tila": "HYLATTY"
                            },
                            {
                                "luotu": 1433489226226,
                                "tila": "HYVAKSYTTY"
                            }
                        ],
                        "tilanKuvaukset": null,
                        "tila": "HYVAKSYTTY",
                        "tasasijaJonosija": 1,
                        "jonosija": 4,
                        "prioriteetti": 2,
                        "sukunimi": "Hoppuvirta",
                        "etunimi": "Kristiina XX",
                        "paasyJaSoveltuvuusKokeenTulos": null,
                        "pisteet": 9.75,
                        "hakemusOid": "1.2.246.562.11.00001941430",
                        "hakijaOid": "1.2.246.562.24.14015124844"
                    }
                ],
                "poissaOlevaTaytto": true,
                "kaikkiEhdonTayttavatHyvaksytaan": false,
                "eiVarasijatayttoa": false,
                "valintaesitysHyvaksytty": valintaesitysHyvaksytty,
                "alinHyvaksyttyPistemaara": 6.58,
                "aloituspaikat": 108,
                "prioriteetti": 0,
                "nimi": "Varsinaisen valinnanvaiheen valintatapajono",
                "oid": "1427374494574-2003796769000462860",
                "tila": null,
                "tasasijasaanto": "ARVONTA"
            }
        ],
        "tarjoajaOid": "1.2.246.562.10.10464399921",
        "tila": null,
        "oid": "1.2.246.562.20.18097797874",
        "sijoitteluajoId": 1433854337781
    })
    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.95390561488\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.44161747595/).respond({
      "kaikkiJonotSijoiteltu": false,
      "valintatapajonot": [
        {
          "tayttojono": null,
          "varasijojaTaytetaanAsti": null,
          "varasijojaKaytetaanAlkaen": null,
          "varasijaTayttoPaivat": 0,
          "varasijat": 0,
          "varalla": 0,
          "hyvaksytty": 5,
          "hakeneet": 8,
          "hakemukset": [
            {
              "todellinenJonosija": 1,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYVAKSYTTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYVAKSYTTY",
              "tasasijaJonosija": 1,
              "jonosija": 1,
              "prioriteetti": 4,
              "sukunimi": "Alajoki",
              "etunimi": "Benjamin",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -1,
              "hakemusOid": "1.2.246.562.11.00003194447",
              "hakijaOid": "1.2.246.562.24.55536433785"
            },
            {
              "todellinenJonosija": 2,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYVAKSYTTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYVAKSYTTY",
              "tasasijaJonosija": 1,
              "jonosija": 2,
              "prioriteetti": 6,
              "sukunimi": "Alajoki",
              "etunimi": "Eero",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -2,
              "hakemusOid": "1.2.246.562.11.00002857141",
              "hakijaOid": "1.2.246.562.24.59123585000"
            },
            {
              "todellinenJonosija": 3,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYVAKSYTTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYVAKSYTTY",
              "tasasijaJonosija": 1,
              "jonosija": 3,
              "prioriteetti": 3,
              "sukunimi": "Alajoki",
              "etunimi": "Olavi",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -3,
              "hakemusOid": "1.2.246.562.11.00003297742",
              "hakijaOid": "1.2.246.562.24.68014983799"
            },
            {
              "todellinenJonosija": 4,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYVAKSYTTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYVAKSYTTY",
              "tasasijaJonosija": 1,
              "jonosija": 4,
              "prioriteetti": 3,
              "sukunimi": "Alalahti",
              "etunimi": "Akseli",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -5,
              "hakemusOid": "1.2.246.562.11.00003216642",
              "hakijaOid": "1.2.246.562.24.77495737092"
            },
            {
              "todellinenJonosija": 5,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYVAKSYTTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYVAKSYTTY",
              "tasasijaJonosija": 1,
              "jonosija": 5,
              "prioriteetti": 3,
              "sukunimi": "Alalahti",
              "etunimi": "Maija",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -7,
              "hakemusOid": "1.2.246.562.11.00002766342",
              "hakijaOid": "1.2.246.562.24.96931075215"
            },
            {
              "todellinenJonosija": 6,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYLATTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYLATTY",
              "tasasijaJonosija": 1,
              "jonosija": 6,
              "prioriteetti": 2,
              "sukunimi": "Alaj\u00e4rvi",
              "etunimi": "Ilona",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -4,
              "hakemusOid": "1.2.246.562.11.00003086173",
              "hakijaOid": "1.2.246.562.24.88000104119"
            },
            {
              "todellinenJonosija": 7,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYLATTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYLATTY",
              "tasasijaJonosija": 1,
              "jonosija": 7,
              "prioriteetti": 2,
              "sukunimi": "Alalahti",
              "etunimi": "Atte",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -6,
              "hakemusOid": "1.2.246.562.11.00003600601",
              "hakijaOid": "1.2.246.562.24.72070423946"
            },
            {
              "todellinenJonosija": 8,
              "pistetiedot": [],
              "hakuOid": null,
              "valintatapajonoOid": "1425545626196-6437662849831338165",
              "tarjoajaOid": "1.2.246.562.10.72985435253",
              "hakukohdeOid": "1.2.246.562.20.44161747595",
              "sijoitteluajoId": 1434513756673,
              "varasijanNumero": null,
              "hyvaksyttyHarkinnanvaraisesti": false,
              "tilaHistoria": [
                {
                  "luotu": 1434427283518,
                  "tila": "HYLATTY"
                }
              ],
              "tilanKuvaukset": null,
              "tila": "HYLATTY",
              "tasasijaJonosija": 1,
              "jonosija": 8,
              "prioriteetti": 2,
              "sukunimi": "Alaniemi",
              "etunimi": "Isla",
              "paasyJaSoveltuvuusKokeenTulos": null,
              "pisteet": -8,
              "hakemusOid": "1.2.246.562.11.00002651295",
              "hakijaOid": "1.2.246.562.24.99005406636"
            }
          ],
          "poissaOlevaTaytto": false,
          "kaikkiEhdonTayttavatHyvaksytaan": false,
          "eiVarasijatayttoa": false,
          "alinHyvaksyttyPistemaara": -7,
          "aloituspaikat": 6,
          "prioriteetti": 0,
          "nimi": "DIA-DI valintaryhm\u00e4 1",
          "oid": "1425545626196-6437662849831338165",
          "tila": null,
          "tasasijasaanto": "ALITAYTTO"
        }
      ],
      "tarjoajaOid": "1.2.246.562.10.72985435253",
      "tila": null,
      "oid": "1.2.246.562.20.44161747595",
      "sijoitteluajoId": 1434513756673
    });

    var lisahaku = {
        "sijoitteluajoId": 1439890957880,
        "oid": "1.2.246.562.20.31450195396",
        "tila": null,
        "tarjoajaOid": "1.2.246.562.10.520877937010",
        "valintatapajonot": [{
            "tasasijasaanto": null,
            "tila": null,
            "oid": "5e7e8b1a-7fa2-4833-a941-f993b749d437",
            "nimi": null,
            "prioriteetti": 0,
            "aloituspaikat": 0,
            "alinHyvaksyttyPistemaara": null,
            "eiVarasijatayttoa": null,
            "kaikkiEhdonTayttavatHyvaksytaan": null,
            "poissaOlevaTaytto": null,
            "hakemukset": [{
                "hakijaOid": null,
                "hakemusOid": "1.2.246.562.11.00000000848",
                "pisteet": null,
                "paasyJaSoveltuvuusKokeenTulos": null,
                "etunimi": null,
                "sukunimi": null,
                "prioriteetti": 1,
                "jonosija": 1,
                "tasasijaJonosija": null,
                "tila": "KESKEN",
                "tilanKuvaukset": {},
                "tilaHistoria": [],
                "hyvaksyttyHarkinnanvaraisesti": false,
                "varasijanNumero": null,
                "sijoitteluajoId": 1439890957880,
                "hakukohdeOid": "1.2.246.562.20.31450195396",
                "tarjoajaOid": "1.2.246.562.10.520877937010",
                "valintatapajonoOid": "5e7e8b1a-7fa2-4833-a941-f993b749d437",
                "hakuOid": null,
                "onkoMuuttunutViimeSijoittelussa": false,
                "pistetiedot": [],
                "todellinenJonosija": 1
            }, {
                "hakijaOid": null,
                "hakemusOid": "1.2.246.562.11.00000000864",
                "pisteet": null,
                "paasyJaSoveltuvuusKokeenTulos": null,
                "etunimi": null,
                "sukunimi": null,
                "prioriteetti": 1,
                "jonosija": 1,
                "tasasijaJonosija": null,
                "tila": "KESKEN",
                "tilanKuvaukset": {},
                "tilaHistoria": [],
                "hyvaksyttyHarkinnanvaraisesti": false,
                "varasijanNumero": null,
                "sijoitteluajoId": 1439890957880,
                "hakukohdeOid": "1.2.246.562.20.31450195396",
                "tarjoajaOid": "1.2.246.562.10.520877937010",
                "valintatapajonoOid": "5e7e8b1a-7fa2-4833-a941-f993b749d437",
                "hakuOid": null,
                "onkoMuuttunutViimeSijoittelussa": false,
                "pistetiedot": [],
                "todellinenJonosija": 1
            }],
            "hakeneet": 2,
            "hyvaksytty": 0,
            "varalla": 0,
            "varasijat": 0,
            "varasijaTayttoPaivat": 0,
            "varasijojaKaytetaanAlkaen": null,
            "varasijojaTaytetaanAsti": null,
            "tayttojono": null
        }],
        "kaikkiJonotSijoiteltu": true
    };
    httpBackend.when('GET', /.*resources\/sijoittelu\/LISAHAKU\/sijoitteluajo\/latest\/hakukohde\/LISAHAKUKOHDE/).respond(lisahaku);

    // Hyväksymistilan muutos
    httpBackend.when('POST', /.*resources\/tila\/haku\/LISAHAKU\/hakukohde\/LISAHAKUKOHDE\/hakemus\/.*/).respond();

    function tilaIs(tila) {
        return function(data) {
            return JSON.parse(data)[0].tila === tila;
        }
    }

    // Tilasiirtymäkutsut:
    // Taustajärjestelmä voi tuottaa tämän virheen oikeasti sitovassa vastaanotossa
    httpBackend.when('POST', /.*resources\/proxy\/valintatulosservice\/haku\/LISAHAKU\/hakukohde\/LISAHAKUKOHDE\?selite=&hyvaksyttyJonoOid=&hakemusOid=.*/, tilaIs("PERUNUT")).respond(403, '{"message": "VTS aikaisempi vastaanotto"}');
    // Taustajärjestelmä voi oikessa ympäristössä tuottaa tämän virheen siirryttäessä tilaan joka muutetaan VTS:ssä
    httpBackend.when('POST', /.*resources\/proxy\/valintatulosservice\/haku\/LISAHAKU\/hakukohde\/LISAHAKUKOHDE\?selite=&hyvaksyttyJonoOid=&hakemusOid=.*/, tilaIs("PERUUTETTU")).respond(400, '{"message": "VTS vastaanottovirhe"}');
    httpBackend.when('POST', /.*resources\/proxy\/valintatulosservice\/haku\/LISAHAKU\/hakukohde\/LISAHAKUKOHDE\?selite=&hyvaksyttyJonoOid=&hakemusOid=.*/).respond();

    var lisahakuTila = [{
        "id": {
            "timeSecond": 1439893585,
            "inc": 1122706712,
            "machine": -458217670,
            "time": 1439893585000,
            "date": 1439893585000,
            "timestamp": 1439893585,
            "new": false
        },
        "valintatapajonoOid": "5e7e8b1a-7fa2-4833-a941-f993b749d437",
        "hakemusOid": "1.2.246.562.11.00000000848",
        "hakukohdeOid": "1.2.246.562.20.31450195396",
        "julkaistavissa": false,
        "hyvaksyttyVarasijalta": false,
        "hyvaksyPeruuntunut": false,
        "hakijaOid": null,
        "hakuOid": "1.2.246.562.29.97467487498",
        "hakutoive": 1,
        "tila": "KESKEN",
        "ilmoittautumisTila": "EI_TEHTY",
        "logEntries": [{
            "luotu": 1439893585759,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "julkaistavissa: false -> true",
            "selite": ""
        }, {
            "luotu": 1439896286961,
            "muokkaaja": "1.2.246.562.24.72453542949",
            "muutos": "julkaistavissa: true -> false",
            "selite": ""
        }],
        "read": 1439898044625,
        "viimeinenMuutos": 1439896286961
    }];
    httpBackend.when('GET', /.*resources\/proxy\/valintatulosservice\/ilmanhakijantilaa\/haku\/LISAHAKU\/hakukohde\/LISAHAKUKOHDE.*/).respond(lisahakuTila);
}
