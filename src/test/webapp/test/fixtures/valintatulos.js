function valintatulosFixture() {
    var httpBackend = testFrame().httpBackend

    var valintatulos1 = {
        "hakuOid": "1.2.246.562.29.11735171271",
        "hakemusOid": "1.2.246.562.11.00003935855",
        "hakijaOid": "1.2.246.562.24.28860135980",
        "aikataulu": {"vastaanottoEnd": "2015-06-30T12:50:55Z"},
        "hakutoiveet": [
            {
                "hakukohdeOid": "1.2.246.562.20.37731636579",
                "hakukohdeNimi": "Energia- ja LVI-tekniikka, diplomi-insinööri KOULUTUS",
                "tarjoajaOid": "1.2.246.562.10.72985435253",
                "tarjoajaNimi": "Aalto-yliopisto, Insinööritieteiden korkeakoulu",
                "valintatapajonoOid": "1433334427784-5861045456369717641",
                "valintatila": "HYVAKSYTTY",
                "vastaanottotila": "VASTAANOTTANUT_SITOVASTI",
                "ilmoittautumistila": {
                    "ilmoittautumisaika": {},
                    "ilmoittautumistapa": {"nimi": {"fi": "Oili", "sv": "Oili", "en": "Oili"}, "url": "/oili/"},
                    "ilmoittautumistila": "EI_TEHTY",
                    "ilmoittauduttavissa": true
                },
                "vastaanotettavuustila": "EI_VASTAANOTETTAVISSA",
                "vastaanottoDeadline": "2015-06-30T12:50:55Z",
                "viimeisinHakemuksenTilanMuutos": "2015-06-03T13:05:59Z",
                "viimeisinValintatuloksenMuutos": "2015-06-03T13:34:44Z",
                "jonosija": 1,
                "julkaistavissa": true,
                "tilanKuvaukset": {}
            },
            {
                "hakukohdeOid": "1.2.246.562.20.37731636579",
                "hakukohdeNimi": "Tietotekniikka, diplomi-insinööri KOULUTUS",
                "tarjoajaOid": "1.2.246.562.10.72985435253",
                "tarjoajaNimi": "Aalto-yliopisto, Insinööritieteiden korkeakoulu",
                "valintatapajonoOid": "1433334427784-5861045456369717641",
                "valintatila": "KESKEN",
                "vastaanottotila": "EI_VASTAANOTETTU_MAARA_AIKANA",
                "ilmoittautumistila": {
                    "ilmoittautumisaika": {},
                    "ilmoittautumistapa": {"nimi": {"fi": "Oili", "sv": "Oili", "en": "Oili"}, "url": "/oili/"},
                    "ilmoittautumistila": "EI_TEHTY",
                    "ilmoittauduttavissa": true
                },
                "vastaanotettavuustila": "EI_VASTAANOTETTAVISSA",
                "vastaanottoDeadline": "2015-06-30T12:50:55Z",
                "viimeisinHakemuksenTilanMuutos": "2015-06-03T13:05:59Z",
                "viimeisinValintatuloksenMuutos": "2015-06-03T13:34:44Z",
                "jonosija": 1,
                "julkaistavissa": true,
                "tilanKuvaukset": {}
            }]
    };

    var valintatulos2 = {
        "hakuOid": "1.2.246.562.29.95390561488",
        "hakemusOid": "1.2.246.562.11.00000000220",
        "hakijaOid": "1.2.246.562.24.72066162004",
        "aikataulu": {},
        "hakutoiveet": [{
            "hakukohdeOid": "1.2.246.562.20.38908264799",
            "hakukohdeNimi": "Energia- ja ympäristötekniikka, tekniikan kandidaatti ja diplomi-insinööri, DIA-yhteisvalinta",
            "tarjoajaOid": "1.2.246.562.10.72985435253",
            "tarjoajaNimi": "Aalto-yliopisto, Insinööritieteiden korkeakoulu",
            "valintatapajonoOid": "14255456271064587270246623295085",
            "valintatila": "HYVAKSYTTY",
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": {
                "ilmoittautumisaika": {},
                "ilmoittautumistapa": {"nimi": {"fi": "Oili", "sv": "Oili", "en": "Oili"}, "url": "/oili/"},
                "ilmoittautumistila": "EI_TEHTY",
                "ilmoittauduttavissa": false
            },
            "vastaanotettavuustila": "VASTAANOTETTAVISSA_SITOVASTI",
            "viimeisinHakemuksenTilanMuutos": "2015-06-16T05:52:21Z",
            "viimeisinValintatuloksenMuutos": "2015-06-16T07:09:14Z",
            "jonosija": 2,
            "julkaistavissa": true,
            "tilanKuvaukset": {},
            "pisteet": -2.0
        }, {
            "hakukohdeOid": "1.2.246.562.20.89452120622",
            "hakukohdeNimi": "Bachelor of Business Administration, International Business, part-time studies",
            "tarjoajaOid": "1.2.246.562.10.24981747314",
            "tarjoajaNimi": "Centria-ammattikorkeakoulu, Kokkola-Pietarsaaren yksikkö, Pietarsaari",
            "valintatapajonoOid": "14247654840604632373462320234784",
            "valintatila": "PERUUNTUNUT",
            "vastaanottotila": "KESKEN",
            "ilmoittautumistila": {
                "ilmoittautumisaika": {},
                "ilmoittautumistapa": {"nimi": {"fi": "Oili", "sv": "Oili", "en": "Oili"}, "url": "/oili/"},
                "ilmoittautumistila": "EI_TEHTY",
                "ilmoittauduttavissa": false
            },
            "vastaanotettavuustila": "EI_VASTAANOTETTAVISSA",
            "viimeisinHakemuksenTilanMuutos": "2015-06-16T05:52:21Z",
            "julkaistavissa": false,
            "tilanKuvaukset": {}
        }]
    };

    httpBackend.when('GET', /.*valintalaskentakoostepalvelu\/resources\/proxy\/valintatulos\/haku\/1\.2\.246\.562\.29\.11735171271\/hakemusOid\/1\.2\.246\.562\.11\.00003935855/).respond(valintatulos1);
    httpBackend.when('GET', /.*valintalaskentakoostepalvelu\/resources\/proxy\/valintatulos\/haku\/1\.2\.246\.562\.29\.11735171271\/hakemusOid\/1\.2\.246\.562\.11\.00000000220/).respond(valintatulos2);
    httpBackend.when('GET', /.*valinta-tulos-service\/auth\/valinnan-tulos\/.*/).respond([]);
}
