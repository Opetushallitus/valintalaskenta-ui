function commonFixtures(roles) {
    return function () {
        roles = roles || ["USER_robotti", "APP_HENKILONHALLINTA_CRUD", "APP_OID", "APP_HENKILONHALLINTA", "APP_ORGANISAATIOHALLINTA", "APP_KOODISTO_READ", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_READ", "APP_TARJONTA_CRUD", "APP_HENKILONHALLINTA_OPHREKISTERI", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOODISTO", "APP_ANOMUSTENHALLINTA", "APP_OMATTIEDOT", "APP_TARJONTA", "APP_HAKUJENHALLINTA", "APP_OMATTIEDOT_READ_UPDATE", "APP_RAPORTOINTI", "APP_ANOMUSTENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD", "VIRKAILIJA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_KOOSTEROOLIENHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_OID_READ", "APP_HENKILONHALLINTA_READ", "APP_SIJOITTELU", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_LOKALISOINTI_CRUD_1.2.246.562.10.00000000001", "APP_YHTEYSTIETOTYYPPIENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEET_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.00000000001", "APP_KOODISTO_READ_1.2.246.562.10.00000000001", "APP_OMATTIEDOT_CRUD_1.2.246.562.10.00000000001", "APP_TARJONTA_READ_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_AITU_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_LOKALISOINTI", "APP_SISALLONHALLINTA", "APP_TARJONTA_CRUD_1.2.246.562.10.00000000001", "APP_ORGANISAATIOHALLINTA_READ", "APP_TIEDONSIIRTO_CRUD_1.2.246.562.10.00000000001", "APP_OMATTIEDOT_CRUD", "APP_OID_CRUD", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_KOODISTO_CRUD_1.2.246.562.10.00000000001", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.00000000001", "APP_SISALLONHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_ANOMUSTENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_CRUD", "APP_KOODISTO_CRUD", "APP_AITU_CRUD_1.2.246.562.10.00000000001", "APP_ANOMUSTENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_VALINTOJENTOTEUTTAMINEN", "APP_SUORITUSREKISTERI_CRUD", "APP_HAKEMUS_READ_UPDATE", "APP_HAKUJENHALLINTA_READ", "APP_RYHMASAHKOPOSTI_VIEW_1.2.246.562.10.00000000001", "APP_HAKULOMAKKEENHALLINTA", "APP_TIEDONSIIRTO_CRUD", "APP_SISALLONHALLINTA_CRUD", "APP_HAKEMUS", "APP_HAKEMUS_CRUD_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_HAKEMUS_CRUD", "APP_OSOITE_CRUD", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.00000000001", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.00000000001", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_OSOITE_CRUD_1.2.246.562.10.00000000001", "APP_RYHMASAHKOPOSTI", "APP_SIJOITTELU_CRUD_1.2.246.562.10.00000000001", "APP_LOKALISOINTI_CRUD", "APP_RYHMASAHKOPOSTI_SEND_1.2.246.562.10.00000000001", "APP_OID_READ_1.2.246.562.10.00000000001", "APP_HENKILONHALLINTA_OPHREKISTERI_1.2.246.562.10.00000000001", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_KOOSTEROOLIENHALLINTA_CRUD", "APP_AITU", "APP_SUORITUSREKISTERI", "APP_TIEDONSIIRTO", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_VALINTAPERUSTEET", "APP_TARJONTA_READ", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_OID_CRUD_1.2.246.562.10.00000000001", "APP_HAKEMUS_READ_UPDATE_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.00000000001", "APP_KOOSTEROOLIENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_SIJOITTELU_CRUD", "APP_HAKUJENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_RYHMASAHKOPOSTI_SEND", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_RYHMASAHKOPOSTI_VIEW", "APP_OSOITE", "APP_HAKEMUS_LISATIETOCRUD_1.2.246.562.10.00000000001", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE_1.2.246.562.10.00000000001", "APP_IPOSTI_SEND", "APP_VALINTAPERUSTEETKK_CRUD", "APP_ASIAKIRJAPALVELU_READ", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE", "APP_IPOSTI_READ_1.2.246.562.10.00000000001", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.00000000001", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_ASIAKIRJAPALVELU_ASIOINTITILICRUD_1.2.246.562.10.00000000001", "APP_RAPORTOINTI_CRUD", "APP_IPOSTI_SEND_1.2.246.562.10.00000000001", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.00000000001", "APP_IPOSTI", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_IPOSTI_READ", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_ASIAKIRJAPALVELU_CREATE_LETTER_1.2.246.562.10.00000000001", "APP_ASIAKIRJAPALVELU", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_TARJONTA_KK_CRUD", "APP_ASIAKIRJAPALVELU_CREATE_LETTER", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.00000000001", "APP_TARJONTA_KK", "APP_HAKEMUS_LISATIETOCRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.00000000001", "APP_ASIAKIRJAPALVELU_ASIOINTITILICRUD", "APP_KKHAKUVIRKAILIJA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_RAPORTOINTI_CRUD_1.2.246.562.10.00000000001", "APP_ASIAKIRJAPALVELU_READ_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.00000000001", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL_1.2.246.562.10.00000000001", "APP_TIEDONSIIRTO_VALINTA_1.2.246.562.10.00000000001", "APP_TIEDONSIIRTO_VALINTA", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI_1.2.246.562.10.00000000001", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI", "APP_HAKULOMAKKEENHALLINTA_LOMAKEPOHJANVAIHTO", "APP_HAKULOMAKKEENHALLINTA_LOMAKEPOHJANVAIHTO_1.2.246.562.10.00000000001", "APP_SIJOITTELU_PERUUNTUNEIDEN_HYVAKSYNTA_1.2.246.562.10.00000000001"];
        var httpBackend = testFrame().httpBackend
        httpBackend.when('GET', /.*\/cas\/myroles/).respond(roles);
        httpBackend.when('GET', /.*\/buildversion.txt\?auth/).respond();
        httpBackend.when('GET', /.*\/lokalisointi\/.*/).respond([]);
        httpBackend.when('GET', /.*\/localisation?.*/).respond([]);
        httpBackend.when('GET', /.*maxinactiveinterval.*/).respond();
        httpBackend.whenGET(/\.html$/).passThrough();
    }
}

var serviceUrls = {
    hakukohde: function (oid) {
        return new RegExp(".*/valintaperusteet-service/resources/hakukohde/" + oid + "/valintaryhma$")
    },

    hakukohdeTila: function (oid) {
        return new RegExp(".*resources/tila/hakukohde/" + oid + "$")
    },

    hakukohdeAvaimet: function () {
        return new RegExp(".*valintaperusteet-service/resources/hakukohde/avaimet/h0$")
    }
}

var httpFixtures = function () {
    var fixtures = {}

    fixtures.hakukohdeHAKUKOHDE1 = function () {
        fixtures.get(serviceUrls.hakukohde("HAKUKOHDE1"), restData.hakukohde.peruskaava)
    }

    fixtures.hakukohde37731636579 = function () {
        fixtures.get(serviceUrls.hakukohde("1.2.246.562.20.37731636579"), restData.hakukohde.peruskaava)
    }

    fixtures.hakukohde00000000220 = function () {
        fixtures.get(serviceUrls.hakukohde("1.2.246.562.11.00000000220"), restData.hakukohde.peruskaava)
    }

    fixtures.hakukohde44161747595 = function () {
        fixtures.get(serviceUrls.hakukohde("1.2.246.562.20.44161747595"), restData.hakukohde.peruskaava)
    }

    fixtures.hakukohde18097797874 = function () {
        fixtures.get(serviceUrls.hakukohde("1.2.246.562.20.18097797874"), restData.hakukohde.peruskaava)
    }

    fixtures.hakukohde44161747595Tila = function () {
        fixtures.get(serviceUrls.hakukohdeTila("1.2.246.562.20.44161747595/1425545626196-6437662849831338165"), restData.hakukohde.tila)
    }

    fixtures.hakukohde18097797874Tila = function () {
        fixtures.get(serviceUrls.hakukohdeTila("1.2.246.562.20.18097797874/1427374494574-2003796769000462860"), restData.hakukohde.tila)
    }

    fixtures.hakukohteenAvaimet = function () {
        fixtures.get(serviceUrls.hakukohdeAvaimet(), restData.hakukohde.avaimet)
    }

    fixtures.get = function (url, response) {
        return testFrame().httpBackend.when('GET', url).respond(response)
    }

    return fixtures
}

var restData = {
    hakukohde: {
        peruskaava: {
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
        },
        avaimet: [
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
        ],
        "tila": [{
            "id": {
                "timeSecond": 1435671316,
                "inc": 965577643,
                "machine": -458213667,
                "timestamp": 1435671316,
                "time": 1435671316000,
                "date": 1435671316000,
                "new": false
            },
            "valintatapajonoOid": "1425545626196-6437662849831338165",
            "hakemusOid": "1.2.246.562.11.00002651295",
            "hakukohdeOid": "1.2.246.562.20.44161747595",
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hakijaOid": "1.2.246.562.24.99005406636",
            "hakuOid": "1.2.246.562.29.95390561488",
            "hakutoive": 2,
            "tila": "KESKEN",
            "ilmoittautumisTila": "EI_TEHTY",
            "read": 1437464563179,
            "logEntries": [{
                "id": null,
                "luotu": 1435671316718,
                "muokkaaja": "1.2.246.562.24.53599635991",
                "muutos": "KESKEN",
                "selite": "Massamuokkaus"
            }]
        }, {
            "id": {
                "timeSecond": 1437392281,
                "inc": 1088874422,
                "machine": -458189833,
                "timestamp": 1437392281,
                "time": 1437392281000,
                "date": 1437392281000,
                "new": false
            },
            "valintatapajonoOid": "1425545626196-6437662849831338165",
            "hakemusOid": "1.2.246.562.11.00002756527",
            "hakukohdeOid": "1.2.246.562.20.44161747595",
            "julkaistavissa": true,
            "hyvaksyttyVarasijalta": false,
            "hakijaOid": null,
            "hakuOid": "1.2.246.562.29.95390561488",
            "hakutoive": 2,
            "tila": "KESKEN",
            "ilmoittautumisTila": "EI_TEHTY",
            "read": 1437464563179,
            "logEntries": [{
                "id": null,
                "luotu": 1437392281348,
                "muokkaaja": "1.2.246.562.24.83767019241",
                "muutos": "EHDOLLISESTI_VASTAANOTTANUT",
                "selite": "Massamuokkaus"
            }]
        }, {
            "id": {
                "timeSecond": 1437392281,
                "inc": 1088874422,
                "machine": -458189833,
                "timestamp": 1437392281,
                "time": 1437392281000,
                "date": 1437392281000,
                "new": false
            },
            "valintatapajonoOid": "1425545626196-6437662849831338165",
            "hakemusOid": "1.2.246.562.11.00002071778",
            "hakukohdeOid": "1.2.246.562.20.44161747595",
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": true,
            "hakijaOid": null,
            "hakuOid": "1.2.246.562.29.95390561488",
            "hakutoive": 2,
            "tila": "KESKEN",
            "ilmoittautumisTila": "EI_TEHTY",
            "read": 1437464563179,
            "logEntries": [{
                "id": null,
                "luotu": 1437392281348,
                "muokkaaja": "1.2.246.562.24.83767019241",
                "muutos": "EHDOLLISESTI_VASTAANOTTANUT",
                "selite": "Massamuokkaus"
            }]
        }, {
            "id": {
                "timeSecond": 1437392281,
                "inc": 1088874422,
                "machine": -458189833,
                "timestamp": 1437392281,
                "time": 1437392281000,
                "date": 1437392281000,
                "new": false
            },
            "valintatapajonoOid": "1425545626196-6437662849831338165",
            "hakemusOid": "1.2.246.562.11.00001941430",
            "hakukohdeOid": "1.2.246.562.20.44161747595",
            "julkaistavissa": false,
            "hyvaksyttyVarasijalta": false,
            "hyvaksyPeruuntunut": true,
            "hakijaOid": null,
            "hakuOid": "1.2.246.562.29.95390561488",
            "hakutoive": 2,
            "tila": "KESKEN",
            "ilmoittautumisTila": "EI_TEHTY",
            "read": 1437464563179,
            "logEntries": [{
                "id": null,
                "luotu": 1437392281348,
                "muokkaaja": "1.2.246.562.24.83767019241",
                "muutos": "EHDOLLISESTI_VASTAANOTTANUT",
                "selite": "Massamuokkaus"
            }]
        }]
    }
}
