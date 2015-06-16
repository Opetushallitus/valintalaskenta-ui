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

    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/1\.2\.246\.562\.29\.11735171271/).respond(haku)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/haku\/HAKU1/).respond(haku)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/(1\.2\.246\.562\.20\.37731636579|1\.2\.246\.562\.11\.00000000220)/).respond(hakukohde)
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/hakukohde\/HAKUKOHDE1/).respond(haku)
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
        }]
    })
}