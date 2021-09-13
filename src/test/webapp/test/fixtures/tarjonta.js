function tarjontaFixtures() {
    var httpBackend = testFrame().httpBackend
    var haku = {
        "result": {
            "modified": 1433338186652,
            "modifiedBy": "1.2.246.562.24.41327169638",
            "oid": "1.2.246.562.29.11735171271",
            "hakukausiUri": "kausi_k#1",
            "hakukausiVuosi": 2015,
            "hakutapaUri": "hakutapa_01#1",
            "hakutyyppiUri": "hakutyyppi_01#1",
            "kohdejoukkoUri": "haunkohdejoukko_12#1",
            "koulutuksenAlkamisVuosi": 2015,
            "koulutuksenAlkamiskausiUri": "kausi_s#1",
            "tila": "JULKAISTU",
            "ylioppilastutkintoAntaaHakukelpoisuuden": false,
            "hakukohdeOidsYlioppilastutkintoAntaaHakukelpoisuuden": [],
            "sijoittelu": true,
            "jarjestelmanHakulomake": true,
            "hakuaikas": [{
                "hakuaikaId": "2072127",
                "alkuPvm": 1433246223826,
                "loppuPvm": 1433246280000,
                "nimet": {"kieli_sv": "", "kieli_en": "", "kieli_fi": "eka haku"}
            }],
            "hakukohdeOids": ["1.2.246.562.20.37731636579"],
            "nimi": {"kieli_sv": "", "kieli_en": "", "kieli_fi": "valintatulokset-sijoitteluun haku"},
            "maxHakukohdes": 1,
            "organisaatioOids": ["1.2.246.562.10.00000000001"],
            "tarjoajaOids": ["1.2.246.562.10.00000000001"],
            "usePriority": true,
            "sisaltyvatHaut": [],
            "organisaatioryhmat": [],
            "koulutusmoduuliTyyppi": "TUTKINTO"
        }, "accessRights": {"update": false, "delete": false, "create": false}, "status": "OK"
    }
    var hakukohde = {
        "result": {
            "modified": 1433333069944,
            "modifiedBy": "1.2.246.562.24.41327169638",
            "oid": "1.2.246.562.20.37731636579",
            "version": 1,
            "hakukohteenNimet": {"kieli_fi": "Energia- ja LVI-tekniikka, diplomi-insinööri KOULUTUS"},
            "tarjoajaNimet": {
                "fi": "Aalto-yliopisto, Insinööritieteiden korkeakoulu",
                "sv": "Aalto-universitetet, Högskolan för ingenjörsvetenskaper",
                "en": "Aalto University, School of Engineering"
            },
            "koulutusmoduuliToteutusTarjoajatiedot": {"1.2.246.562.17.22478815107": {"tarjoajaOids": ["1.2.246.562.10.72985435253"]}},
            "tarjoajaOids": ["1.2.246.562.10.72985435253"],
            "hakuOid": "1.2.246.562.29.11735171271",
            "hakuaikaId": "2072127",
            "hakukelpoisuusvaatimusUris": ["pohjakoulutusvaatimuskorkeakoulut_123"],
            "hakukohdeKoulutusOids": ["1.2.246.562.17.22478815107"],
            "alinHyvaksyttavaKeskiarvo": 0.0,
            "alinValintaPistemaara": 0,
            "ylinValintapistemaara": 0,
            "aloituspaikatLkm": 0,
            "edellisenVuodenHakijatLkm": 0,
            "valintojenAloituspaikatLkm": 0,
            "tila": "JULKAISTU",
            "koulutusAsteTyyppi": "KORKEAKOULUTUS",
            "toteutusTyyppi": "KORKEAKOULUTUS",
            "koulutusmoduuliTyyppi": "TUTKINTO",
            "lisatiedot": {"kieli_sv": "", "kieli_en": "", "kieli_fi": ""},
            "hakukelpoisuusVaatimusKuvaukset": {"kieli_sv": "", "kieli_en": "", "kieli_fi": ""},
            "aloituspaikatKuvaukset": {},
            "kaytetaanJarjestelmanValintaPalvelua": true,
            "kaytetaanHaunPaattymisenAikaa": false,
            "kaytetaanHakukohdekohtaistaHakuaikaa": false,
            "hakukohteenLiitteet": [],
            "yhteystiedot": [],
            "liitteidenToimitusOsoite": {
                "version": 0,
                "osoiterivi1": "PL 11110",
                "postinumero": "posti_00076",
                "postinumeroArvo": "00076",
                "postitoimipaikka": "AALTO"
            },
            "valintakokeet": [],
            "kaksoisTutkinto": false,
            "opetusKielet": ["kieli_fi", "kieli_sv"],
            "valintaPerusteKuvausKielet": [],
            "soraKuvausKielet": [],
            "painotettavatOppiaineet": [],
            "hakuMenettelyKuvaukset": {},
            "peruutusEhdotKuvaukset": {},
            "ryhmaliitokset": [],
            "organisaatioRyhmaOids": [],
            "ylioppilastutkintoAntaaHakukelpoisuuden": false
        }, "accessRights": {}, "status": "OK"
    }

    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/1\.2\.246\.562\.29\.11735171271$/).respond(haku)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/HAKU1/).respond(haku)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/(1\.2\.246\.562\.20\.25463238029|1\.2\.246\.562\.20\.37731636579|1\.2\.246\.562\.11\.00000000220|1\.2\.246\.562\.20\.66977493197)/).respond(hakukohde)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/1\.2\.246\.562\.29\.90697286251/).respond({
        "status": "OK",
        "result": {
            "organisaatioryhmat": [],
            "sisaltyvatHaut": [
                "1.2.246.562.29.50116113601"
            ],
            "usePriority": true,
            "tarjoajaOids": [
                "1.2.246.562.10.00000000001"
            ],
            "organisaatioOids": [
                "1.2.246.562.10.00000000001"
            ],
            "maxHakukohdes": 5,
            "nimi": {
                "kieli_fi": "Yhteishaku ammatilliseen ja lukioon, kev\u00e4t 2015",
                "kieli_en": "Joint application to upper secondary education, spring 2015",
                "kieli_sv": "GEA till yrkes- och gymnasieutbildning v\u00e5ren 2015"
            },
            "haunTunniste": "1.2.246.562.5.2013080813081926341927",
            "hakuaikas": [
                {
                    "nimet": {
                        "kieli_fi": "",
                        "kieli_en": "",
                        "kieli_sv": ""
                    },
                    "loppuPvm": 1426597220518,
                    "alkuPvm": 1424757600000,
                    "hakuaikaId": "703390"
                }
            ],
            "jarjestelmanHakulomake": true,
            "sijoittelu": true,
            "hakukohdeOidsYlioppilastutkintoAntaaHakukelpoisuuden": [],
            "ylioppilastutkintoAntaaHakukelpoisuuden": false,
            "tila": "JULKAISTU",
            "koulutuksenAlkamiskausiUri": "kausi_s#1",
            "koulutuksenAlkamisVuosi": 2015,
            "kohdejoukkoUri": "haunkohdejoukko_11#1",
            "hakutyyppiUri": "hakutyyppi_01#1",
            "hakutapaUri": "hakutapa_01#1",
            "hakukausiVuosi": 2015,
            "hakukausiUri": "kausi_k#1",
            "oid": "1.2.246.562.29.90697286251",
            "modifiedBy": "1.2.246.562.24.41327169638",
            "modified": 1434445296264
        },
        "accessRights": {
            "create": false,
            "delete": false,
            "update": false
        }
    })
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/1\.2\.246\.562\.29\.95390561488/).respond({
        "status": "OK",
        "result": {
            "koulutusmoduuliTyyppi": "TUTKINTO",
            "sisaltyvatHaut": [
                "1.2.246.562.29.88144464125"
            ],
            "usePriority": true,
            "tarjoajaOids": [
                "1.2.246.562.10.00000000001"
            ],
            "organisaatioOids": [
                "1.2.246.562.10.00000000001"
            ],
            "maxHakukohdes": 6,
            "nimi": {
                "kieli_fi": "Korkeakoulujen yhteishaku kev\u00e4t 2015",
                "kieli_en": "Joint application to higher education spring 2015",
                "kieli_sv": "H\u00f6gskolornas gemensamma ans\u00f6kan v\u00e5ren 2015"
            },
            "hakuaikas": [
                {
                    "nimet": {
                        "kieli_fi": "Hakuaika 1",
                        "kieli_en": "Application period 1",
                        "kieli_sv": "Ans\u00f6kningstid 1"
                    },
                    "loppuPvm": 1426510847012,
                    "alkuPvm": 1420610439587,
                    "hakuaikaId": "220208"
                },
                {
                    "nimet": {
                        "kieli_fi": "Hakuaika 2",
                        "kieli_en": "Application period 2",
                        "kieli_sv": "Ans\u00f6kningstid 2"
                    },
                    "loppuPvm": 1432296045519,
                    "alkuPvm": 1426572039988,
                    "hakuaikaId": "220207"
                }
            ],
            "jarjestelmanHakulomake": true,
            "sijoittelu": true,
            "ylioppilastutkintoAntaaHakukelpoisuuden": true,
            "tila": "JULKAISTU",
            "koulutuksenAlkamiskausiUri": "kausi_s#1",
            "koulutuksenAlkamisVuosi": 2015,
            "kohdejoukkoUri": "haunkohdejoukko_12#1",
            "hakutyyppiUri": "hakutyyppi_01#1",
            "hakutapaUri": "hakutapa_01#1",
            "hakukausiVuosi": 2015,
            "hakukausiUri": "kausi_k#1",
            "oid": "1.2.246.562.29.95390561488",
            "modifiedBy": "1.2.246.562.24.41327169638",
            "modified": 1432555113320
        },
        "accessRights": {
            "create": false,
            "delete": false,
            "update": false
        }
    })
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/HAKUKOHDEOID/).respond(hakukohde)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/HAKUKOHDE1/).respond(hakukohde)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/HAKUKOHDE_OID_NO_VIITE_YES_SYOTTO/).respond(hakukohde)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/1\.2\.246\.562\.20\.18097797874/).respond({
        "status": "OK",
        "result": {
            "ylioppilastutkintoAntaaHakukelpoisuuden": false,
            "organisaatioRyhmaOids": [],
            "ryhmaliitokset": [],
            "peruutusEhdotKuvaukset": null,
            "hakuMenettelyKuvaukset": null,
            "painotettavatOppiaineet": [],
            "soraKuvausKielet": [],
            "valintaPerusteKuvausKielet": [],
            "opetusKielet": [
                "kieli_fi"
            ],
            "kaksoisTutkinto": false,
            "valintakokeet": [
                {
                    "lisanaytot": null,
                    "kuvaukset": null,
                    "pisterajat": [],
                    "valintakoeAjankohtas": [],
                    "valintakokeenKuvaus": {
                        "teksti": "",
                        "versio": 1,
                        "arvo": "FI",
                        "monikielisetNimet": [
                            {
                                "nimi": "Finnish",
                                "kieli": "EN"
                            },
                            {
                                "nimi": "suomi",
                                "kieli": "FI"
                            },
                            {
                                "nimi": "finska",
                                "kieli": "SV"
                            }
                        ],
                        "nimi": "suomi",
                        "uri": "kieli_fi"
                    },
                    "version": 0,
                    "oid": "802031"
                }
            ],
            "liitteidenToimitusOsoite": {
                "postitoimipaikka": "ALAVUS",
                "postinumeroArvo": "63300",
                "postinumero": "posti_63300",
                "osoiterivi1": "Kirkkotie 12",
                "version": 0
            },
            "yhteystiedot": [],
            "hakukohteenLiitteet": [],
            "kaytetaanHakukohdekohtaistaHakuaikaa": false,
            "kaytetaanHaunPaattymisenAikaa": false,
            "kaytetaanJarjestelmanValintaPalvelua": false,
            "aloituspaikatKuvaukset": null,
            "lisatiedot": {
                "kieli_fi": ""
            },
            "koulutuslaji": "N",
            "koulutusmoduuliTyyppi": "TUTKINTO_OHJELMA",
            "toteutusTyyppi": "LUKIOKOULUTUS",
            "koulutusAsteTyyppi": "LUKIOKOULUTUS",
            "liitteidenToimitusPvm": 1426597200000,
            "valintaperustekuvausKoodiUri": "valintaperustekuvausryhma_1#1",
            "tila": "JULKAISTU",
            "sahkoinenToimitusOsoite": "",
            "valintojenAloituspaikatLkm": 108,
            "edellisenVuodenHakijatLkm": 0,
            "aloituspaikatLkm": 108,
            "ylinValintapistemaara": 0,
            "alinValintaPistemaara": 0,
            "alinHyvaksyttavaKeskiarvo": 6.5,
            "hakukohdeKoulutusOids": [
                "1.2.246.562.17.66475582756"
            ],
            "hakukelpoisuusvaatimusUris": [
                "hakukelpoisuusvaatimusta_5#1"
            ],
            "hakuaikaId": "703390",
            "hakuOid": "1.2.246.562.29.90697286251",
            "tarjoajaOids": [
                "1.2.246.562.10.10464399921"
            ],
            "koulutusmoduuliToteutusTarjoajatiedot": {
                "1.2.246.562.17.66475582756": {
                    "tarjoajaOids": [
                        "1.2.246.562.10.10464399921"
                    ]
                }
            },
            "tarjoajaNimet": {
                "fi": "Alavuden lukio"
            },
            "hakukohteenNimet": {
                "kieli_fi": "Lukio",
                "kieli_sv": "Gymnasium"
            },
            "hakukohteenNimiUri": "hakukohteet_000#1",
            "hakukohteenNimi": "Lukio, Syksy 2015, valmis",
            "version": 2,
            "oid": "1.2.246.562.20.18097797874",
            "modifiedBy": "1.2.246.562.24.90339285276",
            "modified": 1414590976073
        },
        "accessRights": null
    })
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/1\.2\.246\.562\.20\.44161747595/).respond({
        "status": "OK",
        "result": {
            "ylioppilastutkintoAntaaHakukelpoisuuden": true,
            "organisaatioRyhmaOids": [
                "1.2.246.562.28.70142948556",
                "1.2.246.562.28.22210028309",
                "1.2.246.562.28.73315409214"
            ],
            "ryhmaliitokset": [
                {
                    "ryhmaOid": "1.2.246.562.28.70142948556"
                },
                {
                    "ryhmaOid": "1.2.246.562.28.22210028309"
                },
                {
                    "ryhmaOid": "1.2.246.562.28.73315409214"
                }
            ],
            "peruutusEhdotKuvaukset": null,
            "hakuMenettelyKuvaukset": null,
            "painotettavatOppiaineet": [],
            "soraKuvausKielet": [],
            "valintaPerusteKuvausKielet": [
                "kieli_sv",
                "kieli_fi"
            ],
            "opetusKielet": [
                "kieli_fi",
                "kieli_sv"
            ],
            "kaksoisTutkinto": false,
            "valintaPerusteKuvausTunniste": 625891,
            "yhteystiedot": [],
            "kaytetaanHakukohdekohtaistaHakuaikaa": false,
            "kaytetaanHaunPaattymisenAikaa": false,
            "kaytetaanJarjestelmanValintaPalvelua": false,
            "aloituspaikatKuvaukset": {
                "kieli_fi": "50"
            },
            "koulutusmoduuliTyyppi": "TUTKINTO",
            "toteutusTyyppi": "KORKEAKOULUTUS",
            "koulutusAsteTyyppi": "KORKEAKOULUTUS",
            "ulkoinenTunniste": "ENG10103",
            "tila": "JULKAISTU",
            "valintojenAloituspaikatLkm": 0,
            "edellisenVuodenHakijatLkm": 0,
            "aloituspaikatLkm": 50,
            "ylinValintapistemaara": 0,
            "alinValintaPistemaara": 0,
            "alinHyvaksyttavaKeskiarvo": 0.0,
            "hakukohdeKoulutusOids": [
                "1.2.246.562.17.85833549059"
            ],
            "hakukelpoisuusvaatimusUris": [
                "pohjakoulutusvaatimuskorkeakoulut_123"
            ],
            "hakuaikaId": "220207",
            "hakuOid": "1.2.246.562.29.95390561488",
            "tarjoajaOids": [
                "1.2.246.562.10.72985435253"
            ],
            "koulutusmoduuliToteutusTarjoajatiedot": {
                "1.2.246.562.17.85833549059": {
                    "tarjoajaOids": [
                        "1.2.246.562.10.72985435253"
                    ]
                }
            },
            "tarjoajaNimet": {
                "en": "Aalto University, School of Engineering",
                "sv": "Aalto-universitetet, H\u00f6gskolan f\u00f6r ingenj\u00f6rsvetenskaper",
                "fi": "Aalto-yliopisto, Insin\u00f6\u00f6ritieteiden korkeakoulu"
            },
            "hakukohteenNimet": {
                "kieli_fi": "Rakennettu ymp\u00e4rist\u00f6, tekniikan kandidaatti ja diplomi-insin\u00f6\u00f6ri, DIA-yhteisvalinta",
                "kieli_en": "",
                "kieli_sv": "Den byggda milj\u00f6n, teknologie kandidat och diplomingenj\u00f6r, DIA gemensamma antagningen"
            },
            "version": 31,
            "oid": "1.2.246.562.20.44161747595",
            "modifiedBy": "1.2.246.562.24.42485718933",
            "modified": 1426500225570
        },
        "accessRights": null
    })
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/find\?addHakukohdes=false/).respond({
        "result": [{
            "modified": 1424774405023,
            "modifiedBy": "1.2.246.562.24.40071393049",
            "oid": "1.2.246.562.29.40250457997",
            "hakukausiUri": "kausi_s#1",
            "hakukausiVuosi": 2013,
            "hakutapaUri": "hakutapa_02#1",
            "hakutyyppiUri": "hakutyyppi_01#1",
            "kohdejoukkoUri": "haunkohdejoukko_10#1",
            "koulutuksenAlkamisVuosi": 0,
            "koulutuksenAlkamiskausiUri": "kausi_s#1",
            "tila": "PERUTTU",
            "ylioppilastutkintoAntaaHakukelpoisuuden": false,
            "sijoittelu": false,
            "jarjestelmanHakulomake": false,
            "hakuaikas": [{
                "hakuaikaId": "928566",
                "alkuPvm": 1377982844974,
                "loppuPvm": 1380488419033,
                "nimet": {"kieli_sv": "", "kieli_en": "", "kieli_fi": ""}
            }],
            "hakukohdeOids": [],
            "nimi": {"kieli_sv": "", "kieli_en": "", "kieli_fi": "MJK-instituutti, taloushallinnon ammattitutkinto"},
            "maxHakukohdes": 0,
            "organisaatioOids": ["1.2.246.562.10.44151458419"],
            "tarjoajaOids": ["1.2.246.562.10.44151458419"],
            "usePriority": false,
            "sisaltyvatHaut": []
        }, {
            "modified": 1410521781556,
            "modifiedBy": "1.2.246.562.24.37685858527",
            "oid": "1.2.246.562.5.2013060313080811526781",
            "hakukausiUri": "kausi_s#1",
            "hakukausiVuosi": 2013,
            "hakutapaUri": "hakutapa_01#1",
            "hakutyyppiUri": "hakutyyppi_01#1",
            "kohdejoukkoUri": "haunkohdejoukko_11#1",
            "koulutuksenAlkamisVuosi": 2014,
            "koulutuksenAlkamiskausiUri": "kausi_k#1",
            "tila": "JULKAISTU",
            "ylioppilastutkintoAntaaHakukelpoisuuden": false,
            "sijoittelu": true,
            "jarjestelmanHakulomake": true,
            "hakuaikas": [{
                "hakuaikaId": "6",
                "alkuPvm": 1380081600000,
                "loppuPvm": 1380892500000,
                "nimet": {"kieli_fi": "HAKUAIKA"}
            }],
            "hakukohdeOids": [],
            "haunTunniste": "1.2.246.562.5.2013060313080811526781",
            "nimi": {
                "kieli_sv": "Gemensam ansökan till yrkes- och gymnasieutbildning",
                "kieli_en": "",
                "kieli_fi": "Ammatillisen koulutuksen ja lukiokoulutuksen yhteishaku"
            },
            "maxHakukohdes": 5,
            "organisaatioOids": ["1.2.246.562.10.00000000001"],
            "tarjoajaOids": ["1.2.246.562.10.00000000001"],
            "usePriority": true,
            "sisaltyvatHaut": []
        }, {
            "modified": 1410521781556,
            "modifiedBy": "1.2.246.562.24.37685858527",
            "oid": "1.2.246.562.29.90697286251",
            "hakukausiUri": "kausi_s#1",
            "hakukausiVuosi": 2013,
            "hakutapaUri": "hakutapa_01#1",
            "hakutyyppiUri": "hakutyyppi_01#1",
            "kohdejoukkoUri": "haunkohdejoukko_11#1",
            "koulutuksenAlkamisVuosi": 2014,
            "koulutuksenAlkamiskausiUri": "kausi_k#1",
            "tila": "JULKAISTU",
            "ylioppilastutkintoAntaaHakukelpoisuuden": false,
            "sijoittelu": true,
            "jarjestelmanHakulomake": true,
            "hakuaikas": [{
                "hakuaikaId": "6",
                "alkuPvm": 1380081600000,
                "loppuPvm": 1380892500000,
                "nimet": {"kieli_fi": "HAKUAIKA"}
            }],
            "hakukohdeOids": [],
            "haunTunniste": "1.2.246.562.5.2013060313080811526781",
            "nimi": {
                "kieli_sv": "Gemensam ansökan till yrkes- och gymnasieutbildning",
                "kieli_en": "",
                "kieli_fi": "Ammatillisen koulutuksen ja lukiokoulutuksen yhteishaku"
            },
            "maxHakukohdes": 5,
            "organisaatioOids": ["1.2.246.562.10.00000000001"],
            "tarjoajaOids": ["1.2.246.562.10.00000000001"],
            "usePriority": true,
            "sisaltyvatHaut": []
        },
        haku.result]
    })

    var hakukohdeTulos = {
        "kokonaismaara": 1,
        "tulokset": [{
            "hakukohdeOid": "1.2.246.562.20.25463238029",
            "tarjoajaOid": "1.2.246.562.10.60222091211",
            "tarjoajaNimi": {
                "fi": "Ahlmanin ammatti- ja aikuisopisto"
            },
            "hakukohdeNimi": {
                "fi": "Hotelli-, ravintola- ja catering-alan perustutkinto, yo",
                "sv": "Grundexamen inom hotell-, restaurang- och cateringbranschen, st",
                "en": "Hotelli-, ravintola- ja catering-alan perustutkinto, yo"
            },
            "hakukohdeTila": "JULKAISTU",
            "hakuVuosi": 0,
            "koulutusVuosi": 0,
            "opetuskielet": [
                "kieli_fi"
            ]},
            {
                "hakukohdeOid": "HAKUKOHDE_OID_NO_VIITE_YES_SYOTTO",
                "tarjoajaOid": "1.2.246.562.10.60222091211",
                "tarjoajaNimi": {
                    "fi": "Ahlmanin ammatti- ja aikuisopisto"
                },
                "hakukohdeNimi": {
                    "fi": "Hotelli-, ravintola- ja catering-alan perustutkinto, yes syöttö, yo",
                    "sv": "Grundexamen inom hotell-, restaurang- och cateringbranschen, yes syöttö, st",
                    "en": "Hotelli-, ravintola- ja catering-alan perustutkinto, yes syöttö, yo"
                },
                "hakukohdeTila": "JULKAISTU",
                "hakuVuosi": 0,
                "koulutusVuosi": 0,
                "opetuskielet": [
                    "kieli_fi"
                ]}
        ]
    };
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/HAKUOID\/hakukohdeTulos/).respond(hakukohdeTulos)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/1\.2\.246\.562\.29\.11735171271\/hakukohdeTulos/).respond(hakukohdeTulos)

    httpBackend.when('GET', /.*\/kouta-internal\/haku\/search/).respond([])
    httpBackend.when('GET', /.*\/kouta-internal\/hakukohde\/search/).respond(404, {})
    httpBackend.when('GET', /.*\/kouta-internal\/haku\/.*/).respond(500, {})
    httpBackend.when('GET', /.*\/kouta-internal\/hakukohde\/.*/).respond(500, {})
}
