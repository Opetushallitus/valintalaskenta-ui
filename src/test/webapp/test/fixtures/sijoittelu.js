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
                    "tila": "HYLATTY",
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

    var json2 = {
        "valintaesitys": [{
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432"
        }],
        "lastModified": "Tue, 10 Oct 2017 13:04:29 GMT",
        "sijoittelunTulokset": {
            "sijoitteluajoId": 1507703751404,
            "oid": "1.2.246.562.20.66977493197",
            "tila": null,
            "tarjoajaOid": null,
            "valintatapajonot": [{
                "tasasijasaanto": "YLITAYTTO",
                "tila": null,
                "oid": "14962115489146641379218558169432",
                "nimi": "Valintaryhmä I",
                "prioriteetti": 0,
                "aloituspaikat": 67,
                "alkuperaisetAloituspaikat": 67,
                "alinHyvaksyttyPistemaara": -14,
                "eiVarasijatayttoa": false,
                "kaikkiEhdonTayttavatHyvaksytaan": false,
                "poissaOlevaTaytto": false,
                "valintaesitysHyvaksytty": false,
                "hakemukset": [{
                    "hakijaOid": "1.2.246.562.24.28860135980",
                    "hakemusOid": "1.2.246.562.11.00007967463",
                    "pisteet": -1,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 1,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "muokattuVastaanottoTila": ["HYVAKSYTTY"],
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 1
                }, {
                    "hakijaOid": "1.2.246.562.11.00000000220",
                    "hakemusOid": "1.2.246.562.11.00007843723",
                    "pisteet": -2,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 5,
                    "jonosija": 2,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "muokattuVastaanottoTila": ["HYVAKSYTTY"],
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 2
                }, {
                    "hakijaOid": "1.2.246.562.24.48965063490",
                    "hakemusOid": "1.2.246.562.11.00007865109",
                    "pisteet": -3,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 3,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "muokattuVastaanottoTila": ["HYVAKSYTTY"],
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 3
                }, {
                    "hakijaOid": "1.2.246.562.24.83695868962",
                    "hakemusOid": "1.2.246.562.11.00008008868",
                    "pisteet": -4,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 4,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 4
                }, {
                    "hakijaOid": "1.2.246.562.24.28932744351",
                    "hakemusOid": "1.2.246.562.11.00008001881",
                    "pisteet": -5,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 5,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 5
                }, {
                    "hakijaOid": "1.2.246.562.24.42362763137",
                    "hakemusOid": "1.2.246.562.11.00007967434",
                    "pisteet": -7,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 6,
                    "jonosija": 6,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 6
                }, {
                    "hakijaOid": "1.2.246.562.24.36683016197",
                    "hakemusOid": "1.2.246.562.11.00007896291",
                    "pisteet": -8,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 7,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 7
                }, {
                    "hakijaOid": "1.2.246.562.24.23415056859",
                    "hakemusOid": "1.2.246.562.11.00007963056",
                    "pisteet": -9,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 3,
                    "jonosija": 8,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 8
                }, {
                    "hakijaOid": "1.2.246.562.24.67996377055",
                    "hakemusOid": "1.2.246.562.11.00007875571",
                    "pisteet": -10,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 2,
                    "jonosija": 9,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 9
                }, {
                    "hakijaOid": "1.2.246.562.24.25521097027",
                    "hakemusOid": "1.2.246.562.11.00007949737",
                    "pisteet": -11,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 10,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 10
                }, {
                    "hakijaOid": "1.2.246.562.24.52861377467",
                    "hakemusOid": "1.2.246.562.11.00007974142",
                    "pisteet": -12,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 11,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 11
                }, {
                    "hakijaOid": "1.2.246.562.24.77680567365",
                    "hakemusOid": "1.2.246.562.11.00007944622",
                    "pisteet": -12,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 5,
                    "jonosija": 11,
                    "tasasijaJonosija": 2,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 12
                }, {
                    "hakijaOid": "1.2.246.562.24.63256874603",
                    "hakemusOid": "1.2.246.562.11.00007955750",
                    "pisteet": -13,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 4,
                    "jonosija": 13,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 13
                }, {
                    "hakijaOid": "1.2.246.562.24.37762777932",
                    "hakemusOid": "1.2.246.562.11.00007984174",
                    "pisteet": -14,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 2,
                    "jonosija": 14,
                    "tasasijaJonosija": 1,
                    "tila": "HYVAKSYTTY",
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 14
                }, {
                    "hakijaOid": "1.2.246.562.24.71873073248",
                    "hakemusOid": "1.2.246.562.11.00007954939",
                    "pisteet": null,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 2,
                    "jonosija": 15,
                    "tasasijaJonosija": 1,
                    "tila": "HYLATTY",
                    "tilanKuvaukset": {"FI": "Ei kelpoinen"},
                    "tilaHistoria": [{"tila": "HYLATTY", "luotu": 1504270125285}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 15
                }, {
                    "hakijaOid": "1.2.246.562.24.76967358874",
                    "hakemusOid": "1.2.246.562.11.00007926624",
                    "pisteet": null,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 15,
                    "tasasijaJonosija": 2,
                    "tila": "HYLATTY",
                    "tilanKuvaukset": {"EN": "Very bad"},
                    "tilaHistoria": [{"tila": "HYLATTY", "luotu": 1504270125285}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 16
                }, {
                    "hakijaOid": "1.2.246.562.24.54684086001",
                    "hakemusOid": "1.2.246.562.11.00007978465",
                    "pisteet": null,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 15,
                    "tasasijaJonosija": 3,
                    "tila": "HYLATTY",
                    "tilanKuvaukset": {"SV": "Inte hyvä"},
                    "tilaHistoria": [{"tila": "HYLATTY", "luotu": 1504270125286}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 17
                }],
                "hakeneet": 17,
                "hyvaksytty": null,
                "varalla": null,
                "varasijat": 0,
                "varasijaTayttoPaivat": 0,
                "varasijojaKaytetaanAlkaen": null,
                "varasijojaTaytetaanAsti": 1502658000000,
                "tayttojono": null
            }],
            "hakijaryhmat": [{
                "prioriteetti": 0,
                "paikat": 0,
                "oid": "14809439994932678090911501736357",
                "nimi": "Ensikertalaisten hakijaryhmä",
                "hakukohdeOid": "1.2.246.562.20.66977493197",
                "kiintio": 0,
                "kaytaKaikki": false,
                "tarkkaKiintio": false,
                "kaytetaanRyhmaanKuuluvia": true,
                "hakijaryhmatyyppikoodiUri": "hakijaryhmantyypit_ensikertalaiset",
                "valintatapajonoOid": null,
                "hakemusOid": ["1.2.246.562.11.00007841097", "1.2.246.562.11.00007841848", "1.2.246.562.11.00007841958", "1.2.246.562.11.00007842588", "1.2.246.562.11.00007842737", "1.2.246.562.11.00007842779", "1.2.246.562.11.00007843024", "1.2.246.562.11.00007843079", "1.2.246.562.11.00007843370", "1.2.246.562.11.00007843697", "1.2.246.562.11.00007843723", "1.2.246.562.11.00007844120", "1.2.246.562.11.00007844256", "1.2.246.562.11.00007844434", "1.2.246.562.11.00007844586", "1.2.246.562.11.00007844683", "1.2.246.562.11.00007844751", "1.2.246.562.11.00007844942", "1.2.246.562.11.00007845899", "1.2.246.562.11.00007846092", "1.2.246.562.11.00007846186", "1.2.246.562.11.00007846885", "1.2.246.562.11.00007847185", "1.2.246.562.11.00007847350", "1.2.246.562.11.00007847606", "1.2.246.562.11.00007847981", "1.2.246.562.11.00007848090", "1.2.246.562.11.00007848197", "1.2.246.562.11.00007849044", "1.2.246.562.11.00007849523", "1.2.246.562.11.00007849714", "1.2.246.562.11.00007850266", "1.2.246.562.11.00007850392", "1.2.246.562.11.00007850774", "1.2.246.562.11.00007851414", "1.2.246.562.11.00007851579", "1.2.246.562.11.00007851744", "1.2.246.562.11.00007851922", "1.2.246.562.11.00007851951", "1.2.246.562.11.00007852293", "1.2.246.562.11.00007852439", "1.2.246.562.11.00007852484", "1.2.246.562.11.00007852549", "1.2.246.562.11.00007852659", "1.2.246.562.11.00007852879", "1.2.246.562.11.00007853289", "1.2.246.562.11.00007853344", "1.2.246.562.11.00007853357", "1.2.246.562.11.00007853360", "1.2.246.562.11.00007853438", "1.2.246.562.11.00007853690", "1.2.246.562.11.00007853700", "1.2.246.562.11.00007853726", "1.2.246.562.11.00007853865", "1.2.246.562.11.00007854068", "1.2.246.562.11.00007854453", "1.2.246.562.11.00007855245", "1.2.246.562.11.00007855313", "1.2.246.562.11.00007855740", "1.2.246.562.11.00007855779", "1.2.246.562.11.00007855834", "1.2.246.562.11.00007855915", "1.2.246.562.11.00007856176", "1.2.246.562.11.00007856781", "1.2.246.562.11.00007856833", "1.2.246.562.11.00007857007", "1.2.246.562.11.00007857023", "1.2.246.562.11.00007857162", "1.2.246.562.11.00007857382", "1.2.246.562.11.00007857670", "1.2.246.562.11.00007857751", "1.2.246.562.11.00007858019", "1.2.246.562.11.00007859597", "1.2.246.562.11.00007860463", "1.2.246.562.11.00007860573", "1.2.246.562.11.00007860887", "1.2.246.562.11.00007861336", "1.2.246.562.11.00007861394", "1.2.246.562.11.00007861666", "1.2.246.562.11.00007861857", "1.2.246.562.11.00007861899", "1.2.246.562.11.00007861912", "1.2.246.562.11.00007862377", "1.2.246.562.11.00007862458", "1.2.246.562.11.00007862720", "1.2.246.562.11.00007863237", "1.2.246.562.11.00007863499", "1.2.246.562.11.00007863839", "1.2.246.562.11.00007864003", "1.2.246.562.11.00007864786", "1.2.246.562.11.00007865109", "1.2.246.562.11.00007865484", "1.2.246.562.11.00007865510", "1.2.246.562.11.00007865604", "1.2.246.562.11.00007865688", "1.2.246.562.11.00007865769", "1.2.246.562.11.00007865808", "1.2.246.562.11.00007865866", "1.2.246.562.11.00007866205", "1.2.246.562.11.00007866331", "1.2.246.562.11.00007866506", "1.2.246.562.11.00007866577", "1.2.246.562.11.00007866959", "1.2.246.562.11.00007867453", "1.2.246.562.11.00007868148", "1.2.246.562.11.00007868478", "1.2.246.562.11.00007869273", "1.2.246.562.11.00007869422", "1.2.246.562.11.00007869558", "1.2.246.562.11.00007869639", "1.2.246.562.11.00007869668", "1.2.246.562.11.00007870055", "1.2.246.562.11.00007870327", "1.2.246.562.11.00007870440", "1.2.246.562.11.00007870615", "1.2.246.562.11.00007870877", "1.2.246.562.11.00007871371", "1.2.246.562.11.00007871397", "1.2.246.562.11.00007871449", "1.2.246.562.11.00007871876", "1.2.246.562.11.00007872260", "1.2.246.562.11.00007872723", "1.2.246.562.11.00007872781", "1.2.246.562.11.00007873269", "1.2.246.562.11.00007873308", "1.2.246.562.11.00007873382", "1.2.246.562.11.00007874239", "1.2.246.562.11.00007875212", "1.2.246.562.11.00007875241", "1.2.246.562.11.00007875393", "1.2.246.562.11.00007875571", "1.2.246.562.11.00007875827", "1.2.246.562.11.00007876473", "1.2.246.562.11.00007876761", "1.2.246.562.11.00007876868", "1.2.246.562.11.00007876923", "1.2.246.562.11.00007876994", "1.2.246.562.11.00007877197", "1.2.246.562.11.00007877252", "1.2.246.562.11.00007877362", "1.2.246.562.11.00007877731", "1.2.246.562.11.00007877870", "1.2.246.562.11.00007878594", "1.2.246.562.11.00007878756", "1.2.246.562.11.00007879179", "1.2.246.562.11.00007879357", "1.2.246.562.11.00007879742", "1.2.246.562.11.00007880414", "1.2.246.562.11.00007881329", "1.2.246.562.11.00007881345", "1.2.246.562.11.00007881785", "1.2.246.562.11.00007882014", "1.2.246.562.11.00007882140", "1.2.246.562.11.00007882234", "1.2.246.562.11.00007882250", "1.2.246.562.11.00007882302", "1.2.246.562.11.00007882360", "1.2.246.562.11.00007882409", "1.2.246.562.11.00007882483", "1.2.246.562.11.00007882535", "1.2.246.562.11.00007883026", "1.2.246.562.11.00007883220", "1.2.246.562.11.00007883437", "1.2.246.562.11.00007883550", "1.2.246.562.11.00007883631", "1.2.246.562.11.00007883686", "1.2.246.562.11.00007884041", "1.2.246.562.11.00007884863", "1.2.246.562.11.00007884960", "1.2.246.562.11.00007885480", "1.2.246.562.11.00007885558", "1.2.246.562.11.00007885642", "1.2.246.562.11.00007885875", "1.2.246.562.11.00007886311", "1.2.246.562.11.00007886683", "1.2.246.562.11.00007886874", "1.2.246.562.11.00007887446", "1.2.246.562.11.00007887831", "1.2.246.562.11.00007888254", "1.2.246.562.11.00007888306", "1.2.246.562.11.00007888490", "1.2.246.562.11.00007888652", "1.2.246.562.11.00007889075", "1.2.246.562.11.00007889402", "1.2.246.562.11.00007889619", "1.2.246.562.11.00007889703", "1.2.246.562.11.00007890035", "1.2.246.562.11.00007890213", "1.2.246.562.11.00007890459", "1.2.246.562.11.00007890501", "1.2.246.562.11.00007890514", "1.2.246.562.11.00007890530", "1.2.246.562.11.00007890543", "1.2.246.562.11.00007890611", "1.2.246.562.11.00007890666", "1.2.246.562.11.00007890695", "1.2.246.562.11.00007891319", "1.2.246.562.11.00007891322", "1.2.246.562.11.00007891351", "1.2.246.562.11.00007891377", "1.2.246.562.11.00007891429", "1.2.246.562.11.00007891872", "1.2.246.562.11.00007891885", "1.2.246.562.11.00007891940", "1.2.246.562.11.00007891995", "1.2.246.562.11.00007892143", "1.2.246.562.11.00007892208", "1.2.246.562.11.00007892460", "1.2.246.562.11.00007892538", "1.2.246.562.11.00007892923", "1.2.246.562.11.00007893087", "1.2.246.562.11.00007893171", "1.2.246.562.11.00007893618", "1.2.246.562.11.00007894565", "1.2.246.562.11.00007894581", "1.2.246.562.11.00007894620", "1.2.246.562.11.00007894691", "1.2.246.562.11.00007894730", "1.2.246.562.11.00007895195", "1.2.246.562.11.00007895221", "1.2.246.562.11.00007895425", "1.2.246.562.11.00007895593", "1.2.246.562.11.00007895836", "1.2.246.562.11.00007896217", "1.2.246.562.11.00007896291", "1.2.246.562.11.00007896518", "1.2.246.562.11.00007896958", "1.2.246.562.11.00007897397", "1.2.246.562.11.00007897973", "1.2.246.562.11.00007899049", "1.2.246.562.11.00007899586", "1.2.246.562.11.00007899890", "1.2.246.562.11.00007900530", "1.2.246.562.11.00007900569", "1.2.246.562.11.00007900666", "1.2.246.562.11.00007900763", "1.2.246.562.11.00007901089", "1.2.246.562.11.00007901319", "1.2.246.562.11.00007901335", "1.2.246.562.11.00007901490", "1.2.246.562.11.00007901513", "1.2.246.562.11.00007901571", "1.2.246.562.11.00007901717", "1.2.246.562.11.00007902004", "1.2.246.562.11.00007902211", "1.2.246.562.11.00007902376", "1.2.246.562.11.00007902619", "1.2.246.562.11.00007903540", "1.2.246.562.11.00007903676", "1.2.246.562.11.00007903773", "1.2.246.562.11.00007904125", "1.2.246.562.11.00007904206", "1.2.246.562.11.00007904248", "1.2.246.562.11.00007904455", "1.2.246.562.11.00007904565", "1.2.246.562.11.00007904837", "1.2.246.562.11.00007904934", "1.2.246.562.11.00007905069", "1.2.246.562.11.00007905137", "1.2.246.562.11.00007905153", "1.2.246.562.11.00007905399", "1.2.246.562.11.00007905409", "1.2.246.562.11.00007905849", "1.2.246.562.11.00007906259", "1.2.246.562.11.00007906495", "1.2.246.562.11.00007906518", "1.2.246.562.11.00007906644", "1.2.246.562.11.00007907287", "1.2.246.562.11.00007907290", "1.2.246.562.11.00007907300", "1.2.246.562.11.00007907371", "1.2.246.562.11.00007907627", "1.2.246.562.11.00007907672", "1.2.246.562.11.00007907766", "1.2.246.562.11.00007908024", "1.2.246.562.11.00007908778", "1.2.246.562.11.00007908985", "1.2.246.562.11.00007909285", "1.2.246.562.11.00007910342", "1.2.246.562.11.00007910371", "1.2.246.562.11.00007911095", "1.2.246.562.11.00007911613", "1.2.246.562.11.00007912434", "1.2.246.562.11.00007912764", "1.2.246.562.11.00007914319", "1.2.246.562.11.00007914665", "1.2.246.562.11.00007914979", "1.2.246.562.11.00007915444", "1.2.246.562.11.00007915525", "1.2.246.562.11.00007916074", "1.2.246.562.11.00007916346", "1.2.246.562.11.00007916443", "1.2.246.562.11.00007916472", "1.2.246.562.11.00007916579", "1.2.246.562.11.00007916582", "1.2.246.562.11.00007916948", "1.2.246.562.11.00007916951", "1.2.246.562.11.00007917293", "1.2.246.562.11.00007917442", "1.2.246.562.11.00007917743", "1.2.246.562.11.00007918412", "1.2.246.562.11.00007918687", "1.2.246.562.11.00007918836", "1.2.246.562.11.00007919217", "1.2.246.562.11.00007919259", "1.2.246.562.11.00007919424", "1.2.246.562.11.00007920109", "1.2.246.562.11.00007920426", "1.2.246.562.11.00007921179", "1.2.246.562.11.00007921357", "1.2.246.562.11.00007921467", "1.2.246.562.11.00007921593", "1.2.246.562.11.00007921616", "1.2.246.562.11.00007921881", "1.2.246.562.11.00007921917", "1.2.246.562.11.00007922398", "1.2.246.562.11.00007922411", "1.2.246.562.11.00007922589", "1.2.246.562.11.00007922767", "1.2.246.562.11.00007922806", "1.2.246.562.11.00007923177", "1.2.246.562.11.00007923216", "1.2.246.562.11.00007923685", "1.2.246.562.11.00007924930", "1.2.246.562.11.00007924956", "1.2.246.562.11.00007925175", "1.2.246.562.11.00007925531", "1.2.246.562.11.00007925706", "1.2.246.562.11.00007925793", "1.2.246.562.11.00007926624", "1.2.246.562.11.00007926844", "1.2.246.562.11.00007926909", "1.2.246.562.11.00007927607", "1.2.246.562.11.00007927678", "1.2.246.562.11.00007927869", "1.2.246.562.11.00007928020", "1.2.246.562.11.00007928826", "1.2.246.562.11.00007929074", "1.2.246.562.11.00007930199", "1.2.246.562.11.00007931237", "1.2.246.562.11.00007931790", "1.2.246.562.11.00007932126", "1.2.246.562.11.00007932294", "1.2.246.562.11.00007932809", "1.2.246.562.11.00007932812", "1.2.246.562.11.00007933086", "1.2.246.562.11.00007933675", "1.2.246.562.11.00007934043", "1.2.246.562.11.00007934085", "1.2.246.562.11.00007934111", "1.2.246.562.11.00007934373", "1.2.246.562.11.00007934470", "1.2.246.562.11.00007934988", "1.2.246.562.11.00007936038", "1.2.246.562.11.00007936274", "1.2.246.562.11.00007936672", "1.2.246.562.11.00007936698", "1.2.246.562.11.00007937163", "1.2.246.562.11.00007937435", "1.2.246.562.11.00007937684", "1.2.246.562.11.00007938078", "1.2.246.562.11.00007938094", "1.2.246.562.11.00007938609", "1.2.246.562.11.00007938890", "1.2.246.562.11.00007939022", "1.2.246.562.11.00007939239", "1.2.246.562.11.00007939323", "1.2.246.562.11.00007939792", "1.2.246.562.11.00007940053", "1.2.246.562.11.00007940448", "1.2.246.562.11.00007940765", "1.2.246.562.11.00007940901", "1.2.246.562.11.00007941104", "1.2.246.562.11.00007941395", "1.2.246.562.11.00007941434", "1.2.246.562.11.00007941612", "1.2.246.562.11.00007941777", "1.2.246.562.11.00007942187", "1.2.246.562.11.00007942284", "1.2.246.562.11.00007942569", "1.2.246.562.11.00007943092", "1.2.246.562.11.00007943940", "1.2.246.562.11.00007944622", "1.2.246.562.11.00007944949", "1.2.246.562.11.00007945346", "1.2.246.562.11.00007945760", "1.2.246.562.11.00007945838", "1.2.246.562.11.00007946099", "1.2.246.562.11.00007946594", "1.2.246.562.11.00007946727", "1.2.246.562.11.00007947098", "1.2.246.562.11.00007947425", "1.2.246.562.11.00007947438", "1.2.246.562.11.00007947878", "1.2.246.562.11.00007947904", "1.2.246.562.11.00007948123", "1.2.246.562.11.00007948738", "1.2.246.562.11.00007949067", "1.2.246.562.11.00007949588", "1.2.246.562.11.00007949656", "1.2.246.562.11.00007949737", "1.2.246.562.11.00007950056", "1.2.246.562.11.00007950739", "1.2.246.562.11.00007950755", "1.2.246.562.11.00007951660", "1.2.246.562.11.00007951929", "1.2.246.562.11.00007952070", "1.2.246.562.11.00007952096", "1.2.246.562.11.00007952737", "1.2.246.562.11.00007952818", "1.2.246.562.11.00007953163", "1.2.246.562.11.00007953419", "1.2.246.562.11.00007953503", "1.2.246.562.11.00007953613", "1.2.246.562.11.00007953655", "1.2.246.562.11.00007953862", "1.2.246.562.11.00007953888", "1.2.246.562.11.00007954023", "1.2.246.562.11.00007954191", "1.2.246.562.11.00007954272", "1.2.246.562.11.00007954751", "1.2.246.562.11.00007954939", "1.2.246.562.11.00007955394", "1.2.246.562.11.00007955491", "1.2.246.562.11.00007955527", "1.2.246.562.11.00007955750", "1.2.246.562.11.00007955802", "1.2.246.562.11.00007955925", "1.2.246.562.11.00007955970", "1.2.246.562.11.00007956021", "1.2.246.562.11.00007956597", "1.2.246.562.11.00007956636", "1.2.246.562.11.00007957282", "1.2.246.562.11.00007957318", "1.2.246.562.11.00007957444", "1.2.246.562.11.00007957648", "1.2.246.562.11.00007958841", "1.2.246.562.11.00007958896", "1.2.246.562.11.00007958919", "1.2.246.562.11.00007958964", "1.2.246.562.11.00007959235", "1.2.246.562.11.00007959507", "1.2.246.562.11.00007959510", "1.2.246.562.11.00007959691", "1.2.246.562.11.00007959837", "1.2.246.562.11.00007960402", "1.2.246.562.11.00007960910", "1.2.246.562.11.00007961252", "1.2.246.562.11.00007961265", "1.2.246.562.11.00007961346", "1.2.246.562.11.00007962154", "1.2.246.562.11.00007962471", "1.2.246.562.11.00007963056", "1.2.246.562.11.00007963959", "1.2.246.562.11.00007966590", "1.2.246.562.11.00007966778", "1.2.246.562.11.00007966985", "1.2.246.562.11.00007966998", "1.2.246.562.11.00007967081", "1.2.246.562.11.00007967227", "1.2.246.562.11.00007967434", "1.2.246.562.11.00007967447", "1.2.246.562.11.00007967463", "1.2.246.562.11.00007967531", "1.2.246.562.11.00007968187", "1.2.246.562.11.00007969597", "1.2.246.562.11.00007969827", "1.2.246.562.11.00007970696", "1.2.246.562.11.00007970793", "1.2.246.562.11.00007971459", "1.2.246.562.11.00007971721", "1.2.246.562.11.00007972063", "1.2.246.562.11.00007972393", "1.2.246.562.11.00007972416", "1.2.246.562.11.00007973363", "1.2.246.562.11.00007973392", "1.2.246.562.11.00007973570", "1.2.246.562.11.00007973790", "1.2.246.562.11.00007973936", "1.2.246.562.11.00007974090", "1.2.246.562.11.00007974142", "1.2.246.562.11.00007974472", "1.2.246.562.11.00007974553", "1.2.246.562.11.00007974757", "1.2.246.562.11.00007975086", "1.2.246.562.11.00007975141", "1.2.246.562.11.00007975196", "1.2.246.562.11.00007975798", "1.2.246.562.11.00007975840", "1.2.246.562.11.00007976030", "1.2.246.562.11.00007976085", "1.2.246.562.11.00007976153", "1.2.246.562.11.00007976315", "1.2.246.562.11.00007976959", "1.2.246.562.11.00007977424", "1.2.246.562.11.00007977709", "1.2.246.562.11.00007977783", "1.2.246.562.11.00007977822", "1.2.246.562.11.00007977835", "1.2.246.562.11.00007978407", "1.2.246.562.11.00007978465", "1.2.246.562.11.00007978559", "1.2.246.562.11.00007979082", "1.2.246.562.11.00007979260", "1.2.246.562.11.00007979383", "1.2.246.562.11.00007979859", "1.2.246.562.11.00007980039", "1.2.246.562.11.00007980482", "1.2.246.562.11.00007981106", "1.2.246.562.11.00007981711", "1.2.246.562.11.00007981973", "1.2.246.562.11.00007982079", "1.2.246.562.11.00007982668", "1.2.246.562.11.00007983256", "1.2.246.562.11.00007984174", "1.2.246.562.11.00007984433", "1.2.246.562.11.00007984501", "1.2.246.562.11.00007986046", "1.2.246.562.11.00007986101", "1.2.246.562.11.00007986509", "1.2.246.562.11.00007987647", "1.2.246.562.11.00007987715", "1.2.246.562.11.00007987799", "1.2.246.562.11.00007988206", "1.2.246.562.11.00007989331", "1.2.246.562.11.00007990197", "1.2.246.562.11.00007990414", "1.2.246.562.11.00007990980", "1.2.246.562.11.00007991141", "1.2.246.562.11.00007991358", "1.2.246.562.11.00007992124", "1.2.246.562.11.00007992425", "1.2.246.562.11.00007992658", "1.2.246.562.11.00007992849", "1.2.246.562.11.00007993398", "1.2.246.562.11.00007993547", "1.2.246.562.11.00007993589", "1.2.246.562.11.00007993660", "1.2.246.562.11.00007993699", "1.2.246.562.11.00007994232", "1.2.246.562.11.00007994795", "1.2.246.562.11.00007994850", "1.2.246.562.11.00007994944", "1.2.246.562.11.00007995367", "1.2.246.562.11.00007995710", "1.2.246.562.11.00007995888", "1.2.246.562.11.00007995956", "1.2.246.562.11.00007996104", "1.2.246.562.11.00007997051", "1.2.246.562.11.00007997161", "1.2.246.562.11.00007997459", "1.2.246.562.11.00007997611", "1.2.246.562.11.00007997640", "1.2.246.562.11.00007997983", "1.2.246.562.11.00007998186", "1.2.246.562.11.00007998348", "1.2.246.562.11.00007998607", "1.2.246.562.11.00007999583", "1.2.246.562.11.00007999868", "1.2.246.562.11.00007999981", "1.2.246.562.11.00008000002", "1.2.246.562.11.00008000552", "1.2.246.562.11.00008000659", "1.2.246.562.11.00008001360", "1.2.246.562.11.00008001386", "1.2.246.562.11.00008001425", "1.2.246.562.11.00008001700", "1.2.246.562.11.00008001881", "1.2.246.562.11.00008001975", "1.2.246.562.11.00008002055", "1.2.246.562.11.00008002149", "1.2.246.562.11.00008002246", "1.2.246.562.11.00008002440", "1.2.246.562.11.00008002835", "1.2.246.562.11.00008002848", "1.2.246.562.11.00008003261", "1.2.246.562.11.00008003368", "1.2.246.562.11.00008003588", "1.2.246.562.11.00008003779", "1.2.246.562.11.00008004134", "1.2.246.562.11.00008005227", "1.2.246.562.11.00008005230", "1.2.246.562.11.00008005625", "1.2.246.562.11.00008005858", "1.2.246.562.11.00008006051", "1.2.246.562.11.00008006239", "1.2.246.562.11.00008006475", "1.2.246.562.11.00008006815", "1.2.246.562.11.00008007021", "1.2.246.562.11.00008008088", "1.2.246.562.11.00008008237", "1.2.246.562.11.00008008318", "1.2.246.562.11.00008008790", "1.2.246.562.11.00008008868", "1.2.246.562.11.00008009142", "1.2.246.562.11.00008009401", "1.2.246.562.11.00008009414", "1.2.246.562.11.00008010403", "1.2.246.562.11.00008011004", "1.2.246.562.11.00008011062", "1.2.246.562.11.00008011211", "1.2.246.562.11.00008011525", "1.2.246.562.11.00008011897", "1.2.246.562.11.00008011923", "1.2.246.562.11.00008012566", "1.2.246.562.11.00008012650", "1.2.246.562.11.00008012980", "1.2.246.562.11.00008014454", "1.2.246.562.11.00008014551", "1.2.246.562.11.00008014784", "1.2.246.562.11.00008014810", "1.2.246.562.11.00008015068", "1.2.246.562.11.00008015291", "1.2.246.562.11.00008015314", "1.2.246.562.11.00008015929", "1.2.246.562.11.00008015945", "1.2.246.562.11.00008016067", "1.2.246.562.11.00008016203", "1.2.246.562.11.00008016465", "1.2.246.562.11.00008016614", "1.2.246.562.11.00008017215", "1.2.246.562.11.00008017286", "1.2.246.562.11.00008017354", "1.2.246.562.11.00008017396", "1.2.246.562.11.00008017451", "1.2.246.562.11.00008018052", "1.2.246.562.11.00008018146", "1.2.246.562.11.00008018476", "1.2.246.562.11.00008018696", "1.2.246.562.11.00008018722", "1.2.246.562.11.00008019190", "1.2.246.562.11.00008019307", "1.2.246.562.11.00008019336", "1.2.246.562.11.00008019569", "1.2.246.562.11.00008019598", "1.2.246.562.11.00008019747", "1.2.246.562.11.00008020082", "1.2.246.562.11.00008020383", "1.2.246.562.11.00008020406", "1.2.246.562.11.00008020451", "1.2.246.562.11.00008020736", "1.2.246.562.11.00008020765", "1.2.246.562.11.00008021081", "1.2.246.562.11.00008021272", "1.2.246.562.11.00008021340", "1.2.246.562.11.00008021515", "1.2.246.562.11.00008021764", "1.2.246.562.11.00008021887", "1.2.246.562.11.00008022158", "1.2.246.562.11.00008022174", "1.2.246.562.11.00008023115", "1.2.246.562.11.00008023364", "1.2.246.562.11.00008023788", "1.2.246.562.11.00008023830", "1.2.246.562.11.00008023869", "1.2.246.562.11.00008023982", "1.2.246.562.11.00008024033", "1.2.246.562.11.00008024567", "1.2.246.562.11.00008025346", "1.2.246.562.11.00008025359", "1.2.246.562.11.00008025582", "1.2.246.562.11.00008025825", "1.2.246.562.11.00008025883"]
            }],
            "kaikkiJonotSijoiteltu": false,
            "ensikertalaisuusHakijaryhmanAlimmatHyvaksytytPisteet": null
        },
        "valintatulokset": [{
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007978465",
            "henkiloOid": "1.2.246.562.24.54684086001",
            "valinnantila": "HYLATTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-01T15:48:45.286+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007954939",
            "henkiloOid": "1.2.246.562.24.71873073248",
            "valinnantila": "HYLATTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-01T15:48:45.285+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007963056",
            "henkiloOid": "1.2.246.562.24.23415056859",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007955750",
            "henkiloOid": "1.2.246.562.24.63256874603",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007843723",
            "henkiloOid": "1.2.246.562.24.45785786691",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007926624",
            "henkiloOid": "1.2.246.562.24.76967358874",
            "valinnantila": "HYLATTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-01T15:48:45.285+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007896291",
            "henkiloOid": "1.2.246.562.24.36683016197",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007944622",
            "henkiloOid": "1.2.246.562.24.77680567365",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007984174",
            "henkiloOid": "1.2.246.562.24.37762777932",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00008001881",
            "henkiloOid": "1.2.246.562.24.28932744351",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007865109",
            "henkiloOid": "1.2.246.562.24.48965063490",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007967434",
            "henkiloOid": "1.2.246.562.24.42362763137",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007967463",
            "henkiloOid": "1.2.246.562.24.45971810423",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007974142",
            "henkiloOid": "1.2.246.562.24.52861377467",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007875571",
            "henkiloOid": "1.2.246.562.24.67996377055",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007949737",
            "henkiloOid": "1.2.246.562.24.25521097027",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00008008868",
            "henkiloOid": "1.2.246.562.24.83695868962",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }],
        "kirjeLahetetty": [],
        "lukuvuosimaksut": [{
            "personOid": "1.2.246.562.24.54684086001",
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "maksuntila": "MAKSETTU",
            "muokkaaja": "1.2.246.562.24.83767019241",
            "luotu": "2017-09-06T11:27:27Z"
        }]
    }

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
                "hakijaOid": "1.2.246.562.11.00000000220",
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

    var hakukohteet2 = [
        {
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

    //valinta-tulos-service/auth/sijoitteluntulos/1.2.246.562.29.95390561488/sijoitteluajo/latest/hakukohde/1.2.246.562.20.44161747595
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.66977493197/).respond(json2);
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.25463238029/).respond(json2);
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/HAKUKOHDE_OID_NO_VIITE_YES_SYOTTO/).respond(json2);
    //httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.11\.00000000220/).respond(json2);
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.95390561488\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.44161747595/).respond(json2);
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.90697286251\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.18097797874/).respond(json2);
    //valinta-tulos-service/auth/sijoitteluntulos/1.2.246.562.29.90697286251/sijoitteluajo/latest/hakukohde/1.2.246.562.20.18097797874

    httpBackend.when('GET', /.*resources\/proxy\/valintatulosservice\/haku\/.*\/hakukohde\/1\.2\.246\.562\.20\.37731636579\?valintatapajonoOid=1433334427784-5861045456369717641/)
        .respond(hakukohteet1);

    httpBackend.when('GET', /.*resources\/proxy\/valintatulosservice\/haku\/.*\/hakukohde\/1\.2\.246\.562\.11\.00000000220\?valintatapajonoOid=14255456271064587270246623295085/)
        .respond(hakukohteet2);

    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest$/)
        .respond({sijoitteluajoId: 1433338214458,
                  hakuOid: "1.2.246.562.29.11735171271",
                  startMils: 1433338214458,
                  endMils: 1433338214468,
                  hakukohteet: [dippainssiSijoittelu]});
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/koostesijoittelu\/jatkuva\?hakuOid=1\.2\.246\.562\.29\.11735171271/)
        .respond({"hakuOid":"1.2.246.562.29.11735171271","ajossa":false});

    //httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.37731636579/)
    httpBackend.when('GET', /.*\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.37731636579/)
        .respond(json2);

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
    httpBackend.when('POST', /.*resources\/proxy\/valintatulosservice\/haku\/LISAHAKU\/hakukohde\/LISAHAKUKOHDE?selite=&hyvaksyttyJonoOid=&hakemusOid=.*/).respond();

    httpBackend.when('POST', /.*\/oppijanumerorekisteri-service\/henkilo\/henkiloPerustietosByHenkiloOidList/).respond(
        [
            {
                "oidHenkilo": "1.2.246.562.24.28860135980",
                "etunimet": "Iiris VII",
                "sukunimi": "Vitsijärvi"
            },
            {
                "oidHenkilo": "1.2.246.562.24.28860135981",
                "etunimet": "Pekka III",
                "sukunimi": "Testauspastori"
            },
            {
                "etunimet": "Isla",
                "sukunimi": "Alaniemi",
                "oidHenkilo": "1.2.246.562.11.00002651295"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Atte",
                "oidHenkilo": "1.2.246.562.24.72070423946"
            },
            {
                "sukunimi": "Alaj\u00e4rvi",
                "etunimet": "Ilona",
                "oidHenkilo": "1.2.246.562.24.88000104119"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Maija",
                "oidHenkilo": "1.2.246.562.24.96931075215"
            },
            {
                "sukunimi": "Alajoki",
                "etunimet": "Benjamin",
                "oidHenkilo": "1.2.246.562.24.55536433785"
            },
            {
                "sukunimi": "Alajoki",
                "etunimet": "Eero",
                "oidHenkilo": "1.2.246.562.24.59123585000"
            },
            {
                "sukunimi": "Alajoki",
                "etunimet": "Olavi",
                "oidHenkilo": "1.2.246.562.24.68014983799"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Akseli",
                "oidHenkilo": "1.2.246.562.24.77495737092"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Maija",
                "oidHenkilo": "1.2.246.562.24.96931075215"
            },
            {
                "sukunimi": "Kelpo-Suonio",
                "etunimet": "Veikko VIII",
                "oidHenkilo": "1.2.246.562.24.96271318661"
            },
            {
                "sukunimi": "Sallilahti",
                "etunimet": "Emma V",
                "oidHenkilo": "1.2.246.562.24.27210964812"
            },
            {
                "sukunimi": "Hippim\u00e4ki",
                "etunimet": "Nelli X",
                "oidHenkilo": "1.2.246.562.24.79882755575"
            },
            {
                "sukunimi": "Hoppuvirta",
                "etunimet": "Kristiina XX",
                "oidHenkilo": "1.2.246.562.24.14015124844"
            },
            {
                "oidHenkilo": "1.2.246.562.11.00000000220",
                "etunimet": "Teppo",
                "sukunimi": "Testaaja"
            },
            {
                "sukunimi": "Alaniemi",
                "etunimet": "Isla",
                "oidHenkilo": "1.2.246.562.24.99005406636"
            }
        ]
    );

    //GET /auth/sijoittelu/jono/{jonoOid}
    var isJonoSijoiteltu = {
        "IsSijoiteltu": false
    }
    httpBackend.when('GET', /.*\/auth\/sijoittelu\/jono\/.*/).respond(isJonoSijoiteltu)

    var hakuOid = '1.2.3.4';
    var sijoitteluajoId = '1.2.3.4';
    //GET /auth/sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}
    ///.*\/auth\/sijoittelu\/hakuoid\/sijoitteluajo\/sijoitteluAjoId.*/
    // httpBackend.when('GET', /.*auth\/sijoittelu\/1\.2\.3\.4\/sijoitteluajo\/1\.2\.3\.4/).respond("foobar")
    //
    // //GET /auth/sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}/hakukohde/{hakukohdeOid}
    // var hakukohdeOid = '1.2.3.4.5.6.7';
    // httpBackend.when('GET', String.raw`.*/auth/sijoittelu/${hakuOid}/sijoitteluajo/${sijoitteluajoId}/hakukohde/${hakukohdeOid}`).respond("asddsa");
    //
    // //GET /auth/sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}/perustiedot
    // httpBackend.when('GET', String.raw`.*/auth/sijoittelu/${hakuOid}/sijoitteluajo/${sijoitteluajoId}/perustiedot`).respond("hurrdurr perustiedot");
    //
    // var jonoOid = '1.2'
    // //GET /sijoittelu/jono/{jonoOid}
    // httpBackend.when('GET', String.raw`.*/sijoittelu/jono/${jonoOid}`).respond(JSON.stringify(isJonoSijoiteltu)).respond("herpderp");
    //
    // //GET /sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}/hakukohde/{hakukohdeOid}
    // httpBackend.when('GET', String.raw`.*/sijoittelu/${hakuOid}/sijoitteluajo/${sijoitteluajoId}/hakukohde/${hakukohdeOid}`).respond("hurrdurr");

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
};


function sijoitteluAjoPeruuntunutFixtures(valintaesitysHyvaksytty) {
    var httpBackend = testFrame().httpBackend

    var dippainssiSijoittelu = {
        "sijoitteluajoId": 1433338214458,
        "oid": "1.2.246.562.20.37731636579",
        "tila": null,
        "tarjoajaOid": "1.2.246.562.10.72985435253",
        "valintatapajonot": [
            {
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
                "hakemukset": [
                    {
                    "hakijaOid": "1.2.246.562.24.28860135981",
                    "hakemusOid": "1.2.246.562.11.00003935856",
                    "pisteet": null,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": "Pekka III",
                    "sukunimi": "Testauspastori",
                    "prioriteetti": 1,
                    "jonosija": 1,
                    "tasasijaJonosija": 1,
                    "tila": "HYLATTY",
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

    var json2 = {
        "valintaesitys": [{
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432"
        }],
        "lastModified": "Tue, 10 Oct 2017 13:04:29 GMT",
        "sijoittelunTulokset": {
            "sijoitteluajoId": 1507703751404,
            "oid": "1.2.246.562.20.66977493197",
            "tila": null,
            "tarjoajaOid": null,
            "valintatapajonot": [
                {
                "tasasijasaanto": "YLITAYTTO",
                "tila": null,
                "oid": "14962115489146641379218558169432",
                "nimi": "Valintaryhmä I",
                "prioriteetti": 0,
                "aloituspaikat": 67,
                "alkuperaisetAloituspaikat": 67,
                "alinHyvaksyttyPistemaara": -14,
                "eiVarasijatayttoa": false,
                "kaikkiEhdonTayttavatHyvaksytaan": false,
                "poissaOlevaTaytto": false,
                "valintaesitysHyvaksytty": false,
                "hakemukset": [{
                    "hakijaOid": "1.2.246.562.24.28860135980",
                    "hakemusOid": "1.2.246.562.11.00007967463",
                    "pisteet": -1,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 1,
                    "jonosija": 1,
                    "tasasijaJonosija": 1,
                    "tila": "PERUUNTUNUT",
                    "muokattuVastaanottoTila": ["HYVAKSYTTY"],
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 1
                }, {
                    "hakijaOid": "1.2.246.562.11.00000000220",
                    "hakemusOid": "1.2.246.562.11.00007843723",
                    "pisteet": -2,
                    "paasyJaSoveltuvuusKokeenTulos": null,
                    "etunimi": null,
                    "sukunimi": null,
                    "prioriteetti": 5,
                    "jonosija": 2,
                    "tasasijaJonosija": 1,
                    "tila": "PERUUNTUNUT",
                    "muokattuVastaanottoTila": ["HYVAKSYTTY"],
                    "tilanKuvaukset": {},
                    "tilaHistoria": [{"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {
                        "tila": "PERUUNTUNUT",
                        "luotu": 1504696763096
                    }, {"tila": "HYVAKSYTTY", "luotu": 1505382940535}, {"tila": "PERUUNTUNUT", "luotu": 1504696763096}],
                    "hyvaksyttyHarkinnanvaraisesti": false,
                    "varasijanNumero": null,
                    "sijoitteluajoId": null,
                    "hakukohdeOid": null,
                    "tarjoajaOid": null,
                    "valintatapajonoOid": "14962115489146641379218558169432",
                    "hakuOid": null,
                    "onkoMuuttunutViimeSijoittelussa": false,
                    "hyvaksyttyHakijaryhmista": [],
                    "siirtynytToisestaValintatapajonosta": false,
                    "pistetiedot": [],
                    "todellinenJonosija": 2
                }],
                "hakeneet": 17,
                "hyvaksytty": null,
                "varalla": null,
                "varasijat": 0,
                "varasijaTayttoPaivat": 0,
                "varasijojaKaytetaanAlkaen": null,
                "varasijojaTaytetaanAsti": 1502658000000,
                "tayttojono": null
            }],
            "hakijaryhmat": [
                {
                "prioriteetti": 0,
                "paikat": 0,
                "oid": "14809439994932678090911501736357",
                "nimi": "Ensikertalaisten hakijaryhmä",
                "hakukohdeOid": "1.2.246.562.20.66977493197",
                "kiintio": 0,
                "kaytaKaikki": false,
                "tarkkaKiintio": false,
                "kaytetaanRyhmaanKuuluvia": true,
                "hakijaryhmatyyppikoodiUri": "hakijaryhmantyypit_ensikertalaiset",
                "valintatapajonoOid": null,
                "hakemusOid": ["1.2.246.562.11.00007841097", "1.2.246.562.11.00007841848", "1.2.246.562.11.00007841958", "1.2.246.562.11.00007842588", "1.2.246.562.11.00007842737", "1.2.246.562.11.00007842779", "1.2.246.562.11.00007843024", "1.2.246.562.11.00007843079", "1.2.246.562.11.00007843370", "1.2.246.562.11.00007843697", "1.2.246.562.11.00007843723", "1.2.246.562.11.00007844120", "1.2.246.562.11.00007844256", "1.2.246.562.11.00007844434", "1.2.246.562.11.00007844586", "1.2.246.562.11.00007844683", "1.2.246.562.11.00007844751", "1.2.246.562.11.00007844942", "1.2.246.562.11.00007845899", "1.2.246.562.11.00007846092", "1.2.246.562.11.00007846186", "1.2.246.562.11.00007846885", "1.2.246.562.11.00007847185", "1.2.246.562.11.00007847350", "1.2.246.562.11.00007847606", "1.2.246.562.11.00007847981", "1.2.246.562.11.00007848090", "1.2.246.562.11.00007848197", "1.2.246.562.11.00007849044", "1.2.246.562.11.00007849523", "1.2.246.562.11.00007849714", "1.2.246.562.11.00007850266", "1.2.246.562.11.00007850392", "1.2.246.562.11.00007850774", "1.2.246.562.11.00007851414", "1.2.246.562.11.00007851579", "1.2.246.562.11.00007851744", "1.2.246.562.11.00007851922", "1.2.246.562.11.00007851951", "1.2.246.562.11.00007852293", "1.2.246.562.11.00007852439", "1.2.246.562.11.00007852484", "1.2.246.562.11.00007852549", "1.2.246.562.11.00007852659", "1.2.246.562.11.00007852879", "1.2.246.562.11.00007853289", "1.2.246.562.11.00007853344", "1.2.246.562.11.00007853357", "1.2.246.562.11.00007853360", "1.2.246.562.11.00007853438", "1.2.246.562.11.00007853690", "1.2.246.562.11.00007853700", "1.2.246.562.11.00007853726", "1.2.246.562.11.00007853865", "1.2.246.562.11.00007854068", "1.2.246.562.11.00007854453", "1.2.246.562.11.00007855245", "1.2.246.562.11.00007855313", "1.2.246.562.11.00007855740", "1.2.246.562.11.00007855779", "1.2.246.562.11.00007855834", "1.2.246.562.11.00007855915", "1.2.246.562.11.00007856176", "1.2.246.562.11.00007856781", "1.2.246.562.11.00007856833", "1.2.246.562.11.00007857007", "1.2.246.562.11.00007857023", "1.2.246.562.11.00007857162", "1.2.246.562.11.00007857382", "1.2.246.562.11.00007857670", "1.2.246.562.11.00007857751", "1.2.246.562.11.00007858019", "1.2.246.562.11.00007859597", "1.2.246.562.11.00007860463", "1.2.246.562.11.00007860573", "1.2.246.562.11.00007860887", "1.2.246.562.11.00007861336", "1.2.246.562.11.00007861394", "1.2.246.562.11.00007861666", "1.2.246.562.11.00007861857", "1.2.246.562.11.00007861899", "1.2.246.562.11.00007861912", "1.2.246.562.11.00007862377", "1.2.246.562.11.00007862458", "1.2.246.562.11.00007862720", "1.2.246.562.11.00007863237", "1.2.246.562.11.00007863499", "1.2.246.562.11.00007863839", "1.2.246.562.11.00007864003", "1.2.246.562.11.00007864786", "1.2.246.562.11.00007865109", "1.2.246.562.11.00007865484", "1.2.246.562.11.00007865510", "1.2.246.562.11.00007865604", "1.2.246.562.11.00007865688", "1.2.246.562.11.00007865769", "1.2.246.562.11.00007865808", "1.2.246.562.11.00007865866", "1.2.246.562.11.00007866205", "1.2.246.562.11.00007866331", "1.2.246.562.11.00007866506", "1.2.246.562.11.00007866577", "1.2.246.562.11.00007866959", "1.2.246.562.11.00007867453", "1.2.246.562.11.00007868148", "1.2.246.562.11.00007868478", "1.2.246.562.11.00007869273", "1.2.246.562.11.00007869422", "1.2.246.562.11.00007869558", "1.2.246.562.11.00007869639", "1.2.246.562.11.00007869668", "1.2.246.562.11.00007870055", "1.2.246.562.11.00007870327", "1.2.246.562.11.00007870440", "1.2.246.562.11.00007870615", "1.2.246.562.11.00007870877", "1.2.246.562.11.00007871371", "1.2.246.562.11.00007871397", "1.2.246.562.11.00007871449", "1.2.246.562.11.00007871876", "1.2.246.562.11.00007872260", "1.2.246.562.11.00007872723", "1.2.246.562.11.00007872781", "1.2.246.562.11.00007873269", "1.2.246.562.11.00007873308", "1.2.246.562.11.00007873382", "1.2.246.562.11.00007874239", "1.2.246.562.11.00007875212", "1.2.246.562.11.00007875241", "1.2.246.562.11.00007875393", "1.2.246.562.11.00007875571", "1.2.246.562.11.00007875827", "1.2.246.562.11.00007876473", "1.2.246.562.11.00007876761", "1.2.246.562.11.00007876868", "1.2.246.562.11.00007876923", "1.2.246.562.11.00007876994", "1.2.246.562.11.00007877197", "1.2.246.562.11.00007877252", "1.2.246.562.11.00007877362", "1.2.246.562.11.00007877731", "1.2.246.562.11.00007877870", "1.2.246.562.11.00007878594", "1.2.246.562.11.00007878756", "1.2.246.562.11.00007879179", "1.2.246.562.11.00007879357", "1.2.246.562.11.00007879742", "1.2.246.562.11.00007880414", "1.2.246.562.11.00007881329", "1.2.246.562.11.00007881345", "1.2.246.562.11.00007881785", "1.2.246.562.11.00007882014", "1.2.246.562.11.00007882140", "1.2.246.562.11.00007882234", "1.2.246.562.11.00007882250", "1.2.246.562.11.00007882302", "1.2.246.562.11.00007882360", "1.2.246.562.11.00007882409", "1.2.246.562.11.00007882483", "1.2.246.562.11.00007882535", "1.2.246.562.11.00007883026", "1.2.246.562.11.00007883220", "1.2.246.562.11.00007883437", "1.2.246.562.11.00007883550", "1.2.246.562.11.00007883631", "1.2.246.562.11.00007883686", "1.2.246.562.11.00007884041", "1.2.246.562.11.00007884863", "1.2.246.562.11.00007884960", "1.2.246.562.11.00007885480", "1.2.246.562.11.00007885558", "1.2.246.562.11.00007885642", "1.2.246.562.11.00007885875", "1.2.246.562.11.00007886311", "1.2.246.562.11.00007886683", "1.2.246.562.11.00007886874", "1.2.246.562.11.00007887446", "1.2.246.562.11.00007887831", "1.2.246.562.11.00007888254", "1.2.246.562.11.00007888306", "1.2.246.562.11.00007888490", "1.2.246.562.11.00007888652", "1.2.246.562.11.00007889075", "1.2.246.562.11.00007889402", "1.2.246.562.11.00007889619", "1.2.246.562.11.00007889703", "1.2.246.562.11.00007890035", "1.2.246.562.11.00007890213", "1.2.246.562.11.00007890459", "1.2.246.562.11.00007890501", "1.2.246.562.11.00007890514", "1.2.246.562.11.00007890530", "1.2.246.562.11.00007890543", "1.2.246.562.11.00007890611", "1.2.246.562.11.00007890666", "1.2.246.562.11.00007890695", "1.2.246.562.11.00007891319", "1.2.246.562.11.00007891322", "1.2.246.562.11.00007891351", "1.2.246.562.11.00007891377", "1.2.246.562.11.00007891429", "1.2.246.562.11.00007891872", "1.2.246.562.11.00007891885", "1.2.246.562.11.00007891940", "1.2.246.562.11.00007891995", "1.2.246.562.11.00007892143", "1.2.246.562.11.00007892208", "1.2.246.562.11.00007892460", "1.2.246.562.11.00007892538", "1.2.246.562.11.00007892923", "1.2.246.562.11.00007893087", "1.2.246.562.11.00007893171", "1.2.246.562.11.00007893618", "1.2.246.562.11.00007894565", "1.2.246.562.11.00007894581", "1.2.246.562.11.00007894620", "1.2.246.562.11.00007894691", "1.2.246.562.11.00007894730", "1.2.246.562.11.00007895195", "1.2.246.562.11.00007895221", "1.2.246.562.11.00007895425", "1.2.246.562.11.00007895593", "1.2.246.562.11.00007895836", "1.2.246.562.11.00007896217", "1.2.246.562.11.00007896291", "1.2.246.562.11.00007896518", "1.2.246.562.11.00007896958", "1.2.246.562.11.00007897397", "1.2.246.562.11.00007897973", "1.2.246.562.11.00007899049", "1.2.246.562.11.00007899586", "1.2.246.562.11.00007899890", "1.2.246.562.11.00007900530", "1.2.246.562.11.00007900569", "1.2.246.562.11.00007900666", "1.2.246.562.11.00007900763", "1.2.246.562.11.00007901089", "1.2.246.562.11.00007901319", "1.2.246.562.11.00007901335", "1.2.246.562.11.00007901490", "1.2.246.562.11.00007901513", "1.2.246.562.11.00007901571", "1.2.246.562.11.00007901717", "1.2.246.562.11.00007902004", "1.2.246.562.11.00007902211", "1.2.246.562.11.00007902376", "1.2.246.562.11.00007902619", "1.2.246.562.11.00007903540", "1.2.246.562.11.00007903676", "1.2.246.562.11.00007903773", "1.2.246.562.11.00007904125", "1.2.246.562.11.00007904206", "1.2.246.562.11.00007904248", "1.2.246.562.11.00007904455", "1.2.246.562.11.00007904565", "1.2.246.562.11.00007904837", "1.2.246.562.11.00007904934", "1.2.246.562.11.00007905069", "1.2.246.562.11.00007905137", "1.2.246.562.11.00007905153", "1.2.246.562.11.00007905399", "1.2.246.562.11.00007905409", "1.2.246.562.11.00007905849", "1.2.246.562.11.00007906259", "1.2.246.562.11.00007906495", "1.2.246.562.11.00007906518", "1.2.246.562.11.00007906644", "1.2.246.562.11.00007907287", "1.2.246.562.11.00007907290", "1.2.246.562.11.00007907300", "1.2.246.562.11.00007907371", "1.2.246.562.11.00007907627", "1.2.246.562.11.00007907672", "1.2.246.562.11.00007907766", "1.2.246.562.11.00007908024", "1.2.246.562.11.00007908778", "1.2.246.562.11.00007908985", "1.2.246.562.11.00007909285", "1.2.246.562.11.00007910342", "1.2.246.562.11.00007910371", "1.2.246.562.11.00007911095", "1.2.246.562.11.00007911613", "1.2.246.562.11.00007912434", "1.2.246.562.11.00007912764", "1.2.246.562.11.00007914319", "1.2.246.562.11.00007914665", "1.2.246.562.11.00007914979", "1.2.246.562.11.00007915444", "1.2.246.562.11.00007915525", "1.2.246.562.11.00007916074", "1.2.246.562.11.00007916346", "1.2.246.562.11.00007916443", "1.2.246.562.11.00007916472", "1.2.246.562.11.00007916579", "1.2.246.562.11.00007916582", "1.2.246.562.11.00007916948", "1.2.246.562.11.00007916951", "1.2.246.562.11.00007917293", "1.2.246.562.11.00007917442", "1.2.246.562.11.00007917743", "1.2.246.562.11.00007918412", "1.2.246.562.11.00007918687", "1.2.246.562.11.00007918836", "1.2.246.562.11.00007919217", "1.2.246.562.11.00007919259", "1.2.246.562.11.00007919424", "1.2.246.562.11.00007920109", "1.2.246.562.11.00007920426", "1.2.246.562.11.00007921179", "1.2.246.562.11.00007921357", "1.2.246.562.11.00007921467", "1.2.246.562.11.00007921593", "1.2.246.562.11.00007921616", "1.2.246.562.11.00007921881", "1.2.246.562.11.00007921917", "1.2.246.562.11.00007922398", "1.2.246.562.11.00007922411", "1.2.246.562.11.00007922589", "1.2.246.562.11.00007922767", "1.2.246.562.11.00007922806", "1.2.246.562.11.00007923177", "1.2.246.562.11.00007923216", "1.2.246.562.11.00007923685", "1.2.246.562.11.00007924930", "1.2.246.562.11.00007924956", "1.2.246.562.11.00007925175", "1.2.246.562.11.00007925531", "1.2.246.562.11.00007925706", "1.2.246.562.11.00007925793", "1.2.246.562.11.00007926624", "1.2.246.562.11.00007926844", "1.2.246.562.11.00007926909", "1.2.246.562.11.00007927607", "1.2.246.562.11.00007927678", "1.2.246.562.11.00007927869", "1.2.246.562.11.00007928020", "1.2.246.562.11.00007928826", "1.2.246.562.11.00007929074", "1.2.246.562.11.00007930199", "1.2.246.562.11.00007931237", "1.2.246.562.11.00007931790", "1.2.246.562.11.00007932126", "1.2.246.562.11.00007932294", "1.2.246.562.11.00007932809", "1.2.246.562.11.00007932812", "1.2.246.562.11.00007933086", "1.2.246.562.11.00007933675", "1.2.246.562.11.00007934043", "1.2.246.562.11.00007934085", "1.2.246.562.11.00007934111", "1.2.246.562.11.00007934373", "1.2.246.562.11.00007934470", "1.2.246.562.11.00007934988", "1.2.246.562.11.00007936038", "1.2.246.562.11.00007936274", "1.2.246.562.11.00007936672", "1.2.246.562.11.00007936698", "1.2.246.562.11.00007937163", "1.2.246.562.11.00007937435", "1.2.246.562.11.00007937684", "1.2.246.562.11.00007938078", "1.2.246.562.11.00007938094", "1.2.246.562.11.00007938609", "1.2.246.562.11.00007938890", "1.2.246.562.11.00007939022", "1.2.246.562.11.00007939239", "1.2.246.562.11.00007939323", "1.2.246.562.11.00007939792", "1.2.246.562.11.00007940053", "1.2.246.562.11.00007940448", "1.2.246.562.11.00007940765", "1.2.246.562.11.00007940901", "1.2.246.562.11.00007941104", "1.2.246.562.11.00007941395", "1.2.246.562.11.00007941434", "1.2.246.562.11.00007941612", "1.2.246.562.11.00007941777", "1.2.246.562.11.00007942187", "1.2.246.562.11.00007942284", "1.2.246.562.11.00007942569", "1.2.246.562.11.00007943092", "1.2.246.562.11.00007943940", "1.2.246.562.11.00007944622", "1.2.246.562.11.00007944949", "1.2.246.562.11.00007945346", "1.2.246.562.11.00007945760", "1.2.246.562.11.00007945838", "1.2.246.562.11.00007946099", "1.2.246.562.11.00007946594", "1.2.246.562.11.00007946727", "1.2.246.562.11.00007947098", "1.2.246.562.11.00007947425", "1.2.246.562.11.00007947438", "1.2.246.562.11.00007947878", "1.2.246.562.11.00007947904", "1.2.246.562.11.00007948123", "1.2.246.562.11.00007948738", "1.2.246.562.11.00007949067", "1.2.246.562.11.00007949588", "1.2.246.562.11.00007949656", "1.2.246.562.11.00007949737", "1.2.246.562.11.00007950056", "1.2.246.562.11.00007950739", "1.2.246.562.11.00007950755", "1.2.246.562.11.00007951660", "1.2.246.562.11.00007951929", "1.2.246.562.11.00007952070", "1.2.246.562.11.00007952096", "1.2.246.562.11.00007952737", "1.2.246.562.11.00007952818", "1.2.246.562.11.00007953163", "1.2.246.562.11.00007953419", "1.2.246.562.11.00007953503", "1.2.246.562.11.00007953613", "1.2.246.562.11.00007953655", "1.2.246.562.11.00007953862", "1.2.246.562.11.00007953888", "1.2.246.562.11.00007954023", "1.2.246.562.11.00007954191", "1.2.246.562.11.00007954272", "1.2.246.562.11.00007954751", "1.2.246.562.11.00007954939", "1.2.246.562.11.00007955394", "1.2.246.562.11.00007955491", "1.2.246.562.11.00007955527", "1.2.246.562.11.00007955750", "1.2.246.562.11.00007955802", "1.2.246.562.11.00007955925", "1.2.246.562.11.00007955970", "1.2.246.562.11.00007956021", "1.2.246.562.11.00007956597", "1.2.246.562.11.00007956636", "1.2.246.562.11.00007957282", "1.2.246.562.11.00007957318", "1.2.246.562.11.00007957444", "1.2.246.562.11.00007957648", "1.2.246.562.11.00007958841", "1.2.246.562.11.00007958896", "1.2.246.562.11.00007958919", "1.2.246.562.11.00007958964", "1.2.246.562.11.00007959235", "1.2.246.562.11.00007959507", "1.2.246.562.11.00007959510", "1.2.246.562.11.00007959691", "1.2.246.562.11.00007959837", "1.2.246.562.11.00007960402", "1.2.246.562.11.00007960910", "1.2.246.562.11.00007961252", "1.2.246.562.11.00007961265", "1.2.246.562.11.00007961346", "1.2.246.562.11.00007962154", "1.2.246.562.11.00007962471", "1.2.246.562.11.00007963056", "1.2.246.562.11.00007963959", "1.2.246.562.11.00007966590", "1.2.246.562.11.00007966778", "1.2.246.562.11.00007966985", "1.2.246.562.11.00007966998", "1.2.246.562.11.00007967081", "1.2.246.562.11.00007967227", "1.2.246.562.11.00007967434", "1.2.246.562.11.00007967447", "1.2.246.562.11.00007967463", "1.2.246.562.11.00007967531", "1.2.246.562.11.00007968187", "1.2.246.562.11.00007969597", "1.2.246.562.11.00007969827", "1.2.246.562.11.00007970696", "1.2.246.562.11.00007970793", "1.2.246.562.11.00007971459", "1.2.246.562.11.00007971721", "1.2.246.562.11.00007972063", "1.2.246.562.11.00007972393", "1.2.246.562.11.00007972416", "1.2.246.562.11.00007973363", "1.2.246.562.11.00007973392", "1.2.246.562.11.00007973570", "1.2.246.562.11.00007973790", "1.2.246.562.11.00007973936", "1.2.246.562.11.00007974090", "1.2.246.562.11.00007974142", "1.2.246.562.11.00007974472", "1.2.246.562.11.00007974553", "1.2.246.562.11.00007974757", "1.2.246.562.11.00007975086", "1.2.246.562.11.00007975141", "1.2.246.562.11.00007975196", "1.2.246.562.11.00007975798", "1.2.246.562.11.00007975840", "1.2.246.562.11.00007976030", "1.2.246.562.11.00007976085", "1.2.246.562.11.00007976153", "1.2.246.562.11.00007976315", "1.2.246.562.11.00007976959", "1.2.246.562.11.00007977424", "1.2.246.562.11.00007977709", "1.2.246.562.11.00007977783", "1.2.246.562.11.00007977822", "1.2.246.562.11.00007977835", "1.2.246.562.11.00007978407", "1.2.246.562.11.00007978465", "1.2.246.562.11.00007978559", "1.2.246.562.11.00007979082", "1.2.246.562.11.00007979260", "1.2.246.562.11.00007979383", "1.2.246.562.11.00007979859", "1.2.246.562.11.00007980039", "1.2.246.562.11.00007980482", "1.2.246.562.11.00007981106", "1.2.246.562.11.00007981711", "1.2.246.562.11.00007981973", "1.2.246.562.11.00007982079", "1.2.246.562.11.00007982668", "1.2.246.562.11.00007983256", "1.2.246.562.11.00007984174", "1.2.246.562.11.00007984433", "1.2.246.562.11.00007984501", "1.2.246.562.11.00007986046", "1.2.246.562.11.00007986101", "1.2.246.562.11.00007986509", "1.2.246.562.11.00007987647", "1.2.246.562.11.00007987715", "1.2.246.562.11.00007987799", "1.2.246.562.11.00007988206", "1.2.246.562.11.00007989331", "1.2.246.562.11.00007990197", "1.2.246.562.11.00007990414", "1.2.246.562.11.00007990980", "1.2.246.562.11.00007991141", "1.2.246.562.11.00007991358", "1.2.246.562.11.00007992124", "1.2.246.562.11.00007992425", "1.2.246.562.11.00007992658", "1.2.246.562.11.00007992849", "1.2.246.562.11.00007993398", "1.2.246.562.11.00007993547", "1.2.246.562.11.00007993589", "1.2.246.562.11.00007993660", "1.2.246.562.11.00007993699", "1.2.246.562.11.00007994232", "1.2.246.562.11.00007994795", "1.2.246.562.11.00007994850", "1.2.246.562.11.00007994944", "1.2.246.562.11.00007995367", "1.2.246.562.11.00007995710", "1.2.246.562.11.00007995888", "1.2.246.562.11.00007995956", "1.2.246.562.11.00007996104", "1.2.246.562.11.00007997051", "1.2.246.562.11.00007997161", "1.2.246.562.11.00007997459", "1.2.246.562.11.00007997611", "1.2.246.562.11.00007997640", "1.2.246.562.11.00007997983", "1.2.246.562.11.00007998186", "1.2.246.562.11.00007998348", "1.2.246.562.11.00007998607", "1.2.246.562.11.00007999583", "1.2.246.562.11.00007999868", "1.2.246.562.11.00007999981", "1.2.246.562.11.00008000002", "1.2.246.562.11.00008000552", "1.2.246.562.11.00008000659", "1.2.246.562.11.00008001360", "1.2.246.562.11.00008001386", "1.2.246.562.11.00008001425", "1.2.246.562.11.00008001700", "1.2.246.562.11.00008001881", "1.2.246.562.11.00008001975", "1.2.246.562.11.00008002055", "1.2.246.562.11.00008002149", "1.2.246.562.11.00008002246", "1.2.246.562.11.00008002440", "1.2.246.562.11.00008002835", "1.2.246.562.11.00008002848", "1.2.246.562.11.00008003261", "1.2.246.562.11.00008003368", "1.2.246.562.11.00008003588", "1.2.246.562.11.00008003779", "1.2.246.562.11.00008004134", "1.2.246.562.11.00008005227", "1.2.246.562.11.00008005230", "1.2.246.562.11.00008005625", "1.2.246.562.11.00008005858", "1.2.246.562.11.00008006051", "1.2.246.562.11.00008006239", "1.2.246.562.11.00008006475", "1.2.246.562.11.00008006815", "1.2.246.562.11.00008007021", "1.2.246.562.11.00008008088", "1.2.246.562.11.00008008237", "1.2.246.562.11.00008008318", "1.2.246.562.11.00008008790", "1.2.246.562.11.00008008868", "1.2.246.562.11.00008009142", "1.2.246.562.11.00008009401", "1.2.246.562.11.00008009414", "1.2.246.562.11.00008010403", "1.2.246.562.11.00008011004", "1.2.246.562.11.00008011062", "1.2.246.562.11.00008011211", "1.2.246.562.11.00008011525", "1.2.246.562.11.00008011897", "1.2.246.562.11.00008011923", "1.2.246.562.11.00008012566", "1.2.246.562.11.00008012650", "1.2.246.562.11.00008012980", "1.2.246.562.11.00008014454", "1.2.246.562.11.00008014551", "1.2.246.562.11.00008014784", "1.2.246.562.11.00008014810", "1.2.246.562.11.00008015068", "1.2.246.562.11.00008015291", "1.2.246.562.11.00008015314", "1.2.246.562.11.00008015929", "1.2.246.562.11.00008015945", "1.2.246.562.11.00008016067", "1.2.246.562.11.00008016203", "1.2.246.562.11.00008016465", "1.2.246.562.11.00008016614", "1.2.246.562.11.00008017215", "1.2.246.562.11.00008017286", "1.2.246.562.11.00008017354", "1.2.246.562.11.00008017396", "1.2.246.562.11.00008017451", "1.2.246.562.11.00008018052", "1.2.246.562.11.00008018146", "1.2.246.562.11.00008018476", "1.2.246.562.11.00008018696", "1.2.246.562.11.00008018722", "1.2.246.562.11.00008019190", "1.2.246.562.11.00008019307", "1.2.246.562.11.00008019336", "1.2.246.562.11.00008019569", "1.2.246.562.11.00008019598", "1.2.246.562.11.00008019747", "1.2.246.562.11.00008020082", "1.2.246.562.11.00008020383", "1.2.246.562.11.00008020406", "1.2.246.562.11.00008020451", "1.2.246.562.11.00008020736", "1.2.246.562.11.00008020765", "1.2.246.562.11.00008021081", "1.2.246.562.11.00008021272", "1.2.246.562.11.00008021340", "1.2.246.562.11.00008021515", "1.2.246.562.11.00008021764", "1.2.246.562.11.00008021887", "1.2.246.562.11.00008022158", "1.2.246.562.11.00008022174", "1.2.246.562.11.00008023115", "1.2.246.562.11.00008023364", "1.2.246.562.11.00008023788", "1.2.246.562.11.00008023830", "1.2.246.562.11.00008023869", "1.2.246.562.11.00008023982", "1.2.246.562.11.00008024033", "1.2.246.562.11.00008024567", "1.2.246.562.11.00008025346", "1.2.246.562.11.00008025359", "1.2.246.562.11.00008025582", "1.2.246.562.11.00008025825", "1.2.246.562.11.00008025883"]
            }],
            "kaikkiJonotSijoiteltu": false,
            "ensikertalaisuusHakijaryhmanAlimmatHyvaksytytPisteet": null
        },
        "valintatulokset": [
            {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007978465",
            "henkiloOid": "1.2.246.562.24.54684086001",
            "valinnantila": "HYLATTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-01T15:48:45.286+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007954939",
            "henkiloOid": "1.2.246.562.24.71873073248",
            "valinnantila": "HYLATTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-01T15:48:45.285+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007963056",
            "henkiloOid": "1.2.246.562.24.23415056859",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007955750",
            "henkiloOid": "1.2.246.562.24.63256874603",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007843723",
            "henkiloOid": "1.2.246.562.24.45785786691",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": true,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007926624",
            "henkiloOid": "1.2.246.562.24.76967358874",
            "valinnantila": "HYLATTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-01T15:48:45.285+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007896291",
            "henkiloOid": "1.2.246.562.24.36683016197",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007944622",
            "henkiloOid": "1.2.246.562.24.77680567365",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007984174",
            "henkiloOid": "1.2.246.562.24.37762777932",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00008001881",
            "henkiloOid": "1.2.246.562.24.28932744351",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007865109",
            "henkiloOid": "1.2.246.562.24.48965063490",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007967434",
            "henkiloOid": "1.2.246.562.24.42362763137",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007967463",
            "henkiloOid": "1.2.246.562.24.45971810423",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007974142",
            "henkiloOid": "1.2.246.562.24.52861377467",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007875571",
            "henkiloOid": "1.2.246.562.24.67996377055",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00007949737",
            "henkiloOid": "1.2.246.562.24.25521097027",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }, {
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "valintatapajonoOid": "14962115489146641379218558169432",
            "hakemusOid": "1.2.246.562.11.00008008868",
            "henkiloOid": "1.2.246.562.24.83695868962",
            "valinnantila": "HYVAKSYTTY",
            "ehdollisestiHyvaksyttavissa": false,
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": false,
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": "EI_TEHTY",
            "valinnantilanViimeisinMuutos": "2017-09-14T12:55:40.535+03:00"
        }],
        "kirjeLahetetty": [],
        "lukuvuosimaksut": [{
            "personOid": "1.2.246.562.24.54684086001",
            "hakukohdeOid": "1.2.246.562.20.66977493197",
            "maksuntila": "MAKSETTU",
            "muokkaaja": "1.2.246.562.24.83767019241",
            "luotu": "2017-09-06T11:27:27Z"
        }]
    }

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
                "hakijaOid": "1.2.246.562.11.00000000220",
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

    var hakukohteet2 = [
        {
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


    httpBackend.when('PATCH', /.*valinta-tulos-service\/auth\/valinnan-tulos\/14962115489146641379218558169432/).respond(200, {});
    httpBackend.when('POST', /.*valinta-tulos-service\/auth\/hyvaksymiskirje/).respond(200, {});

    //valinta-tulos-service/auth/sijoitteluntulos/1.2.246.562.29.95390561488/sijoitteluajo/latest/hakukohde/1.2.246.562.20.44161747595
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.66977493197/).respond(json2);
    //httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.11\.00000000220/).respond(json2);
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.95390561488\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.44161747595/).respond(json2);
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/sijoitteluntulos\/1\.2\.246\.562\.29\.90697286251\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.18097797874/).respond(json2);
    //valinta-tulos-service/auth/sijoitteluntulos/1.2.246.562.29.90697286251/sijoitteluajo/latest/hakukohde/1.2.246.562.20.18097797874

    httpBackend.when('GET', /.*resources\/proxy\/valintatulosservice\/haku\/.*\/hakukohde\/1\.2\.246\.562\.20\.37731636579\?valintatapajonoOid=1433334427784-5861045456369717641/)
        .respond(hakukohteet1);

    httpBackend.when('GET', /.*resources\/proxy\/valintatulosservice\/haku\/.*\/hakukohde\/1\.2\.246\.562\.11\.00000000220\?valintatapajonoOid=14255456271064587270246623295085/)
        .respond(hakukohteet2);

    httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest$/)
        .respond({sijoitteluajoId: 1433338214458,
            hakuOid: "1.2.246.562.29.11735171271",
            startMils: 1433338214458,
            endMils: 1433338214468,
            hakukohteet: [dippainssiSijoittelu]});
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/koostesijoittelu\/jatkuva\?hakuOid=1\.2\.246\.562\.29\.11735171271/)
        .respond({"hakuOid":"1.2.246.562.29.11735171271","ajossa":false});

    //httpBackend.when('GET', /.*\/sijoittelu\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1\.2\.246\.562\.20\.37731636579/)
    httpBackend.when('GET', /.*\/sijoitteluntulos\/1\.2\.246\.562\.29\.11735171271\/sijoitteluajo\/latest\/hakukohde\/1.2.246.562.20.37731636579/)
        .respond(json2);



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

    httpBackend.when('POST', /.*\/oppijanumerorekisteri-service\/henkilo\/henkiloPerustietosByHenkiloOidList/).respond(
        [
            {
                "oidHenkilo": "1.2.246.562.24.28860135980",
                "etunimet": "Iiris VII",
                "sukunimi": "Vitsijärvi"
            },
            {
                "oidHenkilo": "1.2.246.562.24.28860135981",
                "etunimet": "Pekka III",
                "sukunimi": "Testauspastori"
            },
            {
                "etunimet": "Isla",
                "sukunimi": "Alaniemi",
                "oidHenkilo": "1.2.246.562.11.00002651295"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Atte",
                "oidHenkilo": "1.2.246.562.24.72070423946"
            },
            {
                "sukunimi": "Alaj\u00e4rvi",
                "etunimet": "Ilona",
                "oidHenkilo": "1.2.246.562.24.88000104119"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Maija",
                "oidHenkilo": "1.2.246.562.24.96931075215"
            },
            {
                "sukunimi": "Alajoki",
                "etunimet": "Benjamin",
                "oidHenkilo": "1.2.246.562.24.55536433785"
            },
            {
                "sukunimi": "Alajoki",
                "etunimet": "Eero",
                "oidHenkilo": "1.2.246.562.24.59123585000"
            },
            {
                "sukunimi": "Alajoki",
                "etunimet": "Olavi",
                "oidHenkilo": "1.2.246.562.24.68014983799"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Akseli",
                "oidHenkilo": "1.2.246.562.24.77495737092"
            },
            {
                "sukunimi": "Alalahti",
                "etunimet": "Maija",
                "oidHenkilo": "1.2.246.562.24.96931075215"
            },
            {
                "sukunimi": "Kelpo-Suonio",
                "etunimet": "Veikko VIII",
                "oidHenkilo": "1.2.246.562.24.96271318661"
            },
            {
                "sukunimi": "Sallilahti",
                "etunimet": "Emma V",
                "oidHenkilo": "1.2.246.562.24.27210964812"
            },
            {
                "sukunimi": "Hippim\u00e4ki",
                "etunimet": "Nelli X",
                "oidHenkilo": "1.2.246.562.24.79882755575"
            },
            {
                "sukunimi": "Hoppuvirta",
                "etunimet": "Kristiina XX",
                "oidHenkilo": "1.2.246.562.24.14015124844"
            },
            {
                "oidHenkilo": "1.2.246.562.11.00000000220",
                "etunimet": "Teppo",
                "sukunimi": "Testaaja"
            },
            {
                "sukunimi": "Alaniemi",
                "etunimet": "Isla",
                "oidHenkilo": "1.2.246.562.24.99005406636"
            }
        ]
    );

    //GET /auth/sijoittelu/jono/{jonoOid}
    var isJonoSijoiteltu = {
        "IsSijoiteltu": false
    }
    httpBackend.when('GET', /.*\/auth\/sijoittelu\/jono\/.*/).respond(isJonoSijoiteltu)

    var hakuOid = '1.2.3.4';
    var sijoitteluajoId = '1.2.3.4';
    //GET /auth/sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}
    ///.*\/auth\/sijoittelu\/hakuoid\/sijoitteluajo\/sijoitteluAjoId.*/
    // httpBackend.when('GET', String.raw`.*/auth/sijoittelu/${hakuOid}/sijoitteluajo/${sijoitteluajoId}`).respond("foobar")
    //
    // //GET /auth/sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}/hakukohde/{hakukohdeOid}
    // var hakukohdeOid = '1.2.3.4.5.6.7';
    // httpBackend.when('GET', String.raw`.*/auth/sijoittelu/${hakuOid}/sijoitteluajo/${sijoitteluajoId}/hakukohde/${hakukohdeOid}`).respond("asddsa");
    //
    // //GET /auth/sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}/perustiedot
    // httpBackend.when('GET', String.raw`.*/auth/sijoittelu/${hakuOid}/sijoitteluajo/${sijoitteluajoId}/perustiedot`).respond("hurrdurr perustiedot");
    //
    // var jonoOid = '1.2'
    // //GET /sijoittelu/jono/{jonoOid}
    // httpBackend.when('GET', String.raw`.*/sijoittelu/jono/${jonoOid}`).respond(JSON.stringify(isJonoSijoiteltu)).respond("herpderp");
    //
    // //GET /sijoittelu/{hakuOid}/sijoitteluajo/{sijoitteluajoId}/hakukohde/{hakukohdeOid}
    // httpBackend.when('GET', String.raw`.*/sijoittelu/${hakuOid}/sijoitteluajo/${sijoitteluajoId}/hakukohde/${hakukohdeOid}`).respond("hurrdurr");

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
