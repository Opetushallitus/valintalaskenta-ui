function hakemusByHakuOidFixtures(hakemukset) {
    return function() {
        var httpBackend = testFrame().httpBackend
        httpBackend.whenGET(/.*\/valintalaskentakoostepalvelu\/resources\/hakuAppHakemukset\/?.*/).respond(
            _.map(hakemukset, function(hakemus) {
                return {
                    "oid": hakemus.hakemusOid,
                    "personOid": "1.2.246.562.24.57650437995",
                    "firstNames": "Laskentaa",
                    "lastName": "Ilman",
                    "answers" : {
                        "henkilotiedot": {
                            "Etunimet" : hakemus.etunimi,
                            "Sukunimi" : hakemus.sukunimi
                        },
                        "lisatiedot" : {
                            "asiointikieli": "suomi"
                        },
                        "hakutoiveet":  _.object(_.map(hakemus.hakutoiveet, function(hakutoive, index) {
                            console.log(hakutoive);
                            console.log(index);
                        }))
                    },
                    "additionalData": {
                        "d3c46564-1700-4c73-eabd-808cf667dad8": "",
                        "d3c46564-1700-4c73-eabd-808cf667dad8-OSALLISTUMINEN": "MERKITSEMATTA",
                        "42f3fca6-14a0-1a3b-e042-627a30bef63d-OSALLISTUMINEN": "OSALLISTUI",
                        "42f3fca6-14a0-1a3b-e042-627a30bef63d": "30.00",
                        "ei_vaikuta": "",
                        "ei_vaikuta-OSALLISTUMINEN": "EI_VAADITA",
                        "efea9350-9bb6-5949-c2aa-b27f1c5784d9": "",
                        "efea9350-9bb6-5949-c2aa-b27f1c5784d9-OSALLISTUMINEN": "MERKITSEMATTA",
                        "vaikuttaa_laskentaan": "",
                        "vaikuttaa_laskentaan-OSALLISTUMINEN": "MERKITSEMATTA"
                    }
                };
            })
        );
    }
}
function hakemusByOidFixtures(hakemus) {
    return function() {
        var httpBackend = testFrame().httpBackend
        var response = {
            "oid": hakemus.hakemusOid,
            "personOid": "1.2.246.562.24.57650437995",
            "firstNames": "Laskentaa",
            "lastName": "Ilman",
            "answers" : {
            "henkilotiedot": {
                "Etunimet" : hakemus.etunimi,
                    "Sukunimi" : hakemus.sukunimi
            },
            "lisatiedot" : {
                "asiointikieli": "suomi"
            },
            "hakutoiveet":  _.object(_.flatten(_.map(hakemus.hakutoiveet, function(hakutoive, index) {
                console.log(hakutoive);
                console.log(index);
                return [
                    ["preference"+(index + 1)+"-Koulutus", "Hakutoive" + (index+1)],
                    ["preference"+(index + 1)+"-Koulutus-id", hakutoive]
                ];
            }),true))
        },
            "additionalData": {
            "d3c46564-1700-4c73-eabd-808cf667dad8": "",
                "d3c46564-1700-4c73-eabd-808cf667dad8-OSALLISTUMINEN": "MERKITSEMATTA",
                "42f3fca6-14a0-1a3b-e042-627a30bef63d-OSALLISTUMINEN": "OSALLISTUI",
                "42f3fca6-14a0-1a3b-e042-627a30bef63d": "30.00",
                "ei_vaikuta": "",
                "ei_vaikuta-OSALLISTUMINEN": "EI_VAADITA",
                "efea9350-9bb6-5949-c2aa-b27f1c5784d9": "",
                "efea9350-9bb6-5949-c2aa-b27f1c5784d9-OSALLISTUMINEN": "MERKITSEMATTA",
                "vaikuttaa_laskentaan": "",
                "vaikuttaa_laskentaan-OSALLISTUMINEN": "MERKITSEMATTA"
        }
        };
        httpBackend.whenGET(/.*\/valintalaskentakoostepalvelu\/resources\/hakuAppHakemukset\/.*/).respond(response);
    }
}
function hakemusByOidsFixtures(hakemukset) {
    return function() {
        var httpBackend = testFrame().httpBackend
        httpBackend.whenPOST(/.*\/valintalaskentakoostepalvelu\/resources\/hakuAppHakemukset\/list?.*/).respond(
            _.map(hakemukset, function(hakemus) {
            return {
                "oid": hakemus.hakemusOid,
                "personOid": hakemus.personOid,
                "firstNames": "Laskentaa",
                "lastName": "Ilman",
                "answers" : {
                    "henkilotiedot": {
                        "Etunimet" : hakemus.etunimi,
                        "Sukunimi" : hakemus.sukunimi
                    },
                    "lisatiedot" : {
                        "asiointikieli": "suomi"
                    }
                },
                "additionalData": {
                    "d3c46564-1700-4c73-eabd-808cf667dad8": "",
                    "d3c46564-1700-4c73-eabd-808cf667dad8-OSALLISTUMINEN": "MERKITSEMATTA",
                    "42f3fca6-14a0-1a3b-e042-627a30bef63d-OSALLISTUMINEN": "OSALLISTUI",
                    "42f3fca6-14a0-1a3b-e042-627a30bef63d": "30.00",
                    "ei_vaikuta": "",
                    "ei_vaikuta-OSALLISTUMINEN": "EI_VAADITA",
                    "efea9350-9bb6-5949-c2aa-b27f1c5784d9": "",
                    "efea9350-9bb6-5949-c2aa-b27f1c5784d9-OSALLISTUMINEN": "MERKITSEMATTA",
                    "vaikuttaa_laskentaan": "",
                    "vaikuttaa_laskentaan-OSALLISTUMINEN": "MERKITSEMATTA"
                }
            };
            })
        );
    }
}
function listfullFixtures(hakemukset) {
    return function() {
        var httpBackend = testFrame().httpBackend
        httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/hakuAppHakemukset\/listfull.*/).respond(
            _.map(hakemukset, function(hakemus) {
                return {
                    "oid": hakemus.hakemusOid,
                    "personOid": hakemus.personOid,
                    "firstNames": "Laskentaa",
                    "lastName": "Ilman",
                    "answers" : {
                        "henkilotiedot": {
                            "Etunimet" : hakemus.etunimi,
                            "Sukunimi" : hakemus.sukunimi
                        },
                        "lisatiedot" : {
                            "asiointikieli": "suomi"
                        }
                    },
                    "additionalData": {
                        "d3c46564-1700-4c73-eabd-808cf667dad8": "",
                        "d3c46564-1700-4c73-eabd-808cf667dad8-OSALLISTUMINEN": "MERKITSEMATTA",
                        "42f3fca6-14a0-1a3b-e042-627a30bef63d-OSALLISTUMINEN": "OSALLISTUI",
                        "42f3fca6-14a0-1a3b-e042-627a30bef63d": "30.00",
                        "ei_vaikuta": "",
                        "ei_vaikuta-OSALLISTUMINEN": "EI_VAADITA",
                        "efea9350-9bb6-5949-c2aa-b27f1c5784d9": "",
                        "efea9350-9bb6-5949-c2aa-b27f1c5784d9-OSALLISTUMINEN": "MERKITSEMATTA",
                        "vaikuttaa_laskentaan": "",
                        "vaikuttaa_laskentaan-OSALLISTUMINEN": "MERKITSEMATTA"
                    }
                };
            }));
    }
}
function hakuAppKaksiHenkiloaFixtures() {
    var httpBackend = testFrame().httpBackend
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/hakuAppHakemukset\/additionalData\/h\/h0/).respond({
        "valintapisteet": [
            {
            "oid": "1.2.246.562.11.00000000181",
            "personOid": "1.2.246.562.24.57650437995",
            "firstNames": "Laskentaa",
            "lastName": "Ilman",
            "additionalData": {
                "d3c46564-1700-4c73-eabd-808cf667dad8": "",
                "d3c46564-1700-4c73-eabd-808cf667dad8-OSALLISTUMINEN": "MERKITSEMATTA",
                "42f3fca6-14a0-1a3b-e042-627a30bef63d-OSALLISTUMINEN": "OSALLISTUI",
                "42f3fca6-14a0-1a3b-e042-627a30bef63d": "30.00",
                "ei_vaikuta": "",
                "ei_vaikuta-OSALLISTUMINEN": "EI_VAADITA",
                "efea9350-9bb6-5949-c2aa-b27f1c5784d9": "",
                "efea9350-9bb6-5949-c2aa-b27f1c5784d9-OSALLISTUMINEN": "MERKITSEMATTA",
                "vaikuttaa_laskentaan": "",
                "vaikuttaa_laskentaan-OSALLISTUMINEN": "MERKITSEMATTA"
            }
        },
            {
            "oid": "1.2.246.562.11.00000000182",
            "personOid": "1.2.246.562.24.57650437994",
            "firstNames": "Yrjö",
            "lastName": "Yksikkötestihenkilö",
            "additionalData": {
                "d3c46564-1700-4c73-eabd-808cf667dad8": "",
                "d3c46564-1700-4c73-eabd-808cf667dad8-OSALLISTUMINEN": "MERKITSEMATTA",
                "42f3fca6-14a0-1a3b-e042-627a30bef63d-OSALLISTUMINEN": "OSALLISTUI",
                "42f3fca6-14a0-1a3b-e042-627a30bef63d": "30.00",
                "ei_vaikuta": "",
                "ei_vaikuta-OSALLISTUMINEN": "EI_VAADITA",
                "efea9350-9bb6-5949-c2aa-b27f1c5784d9": "",
                "efea9350-9bb6-5949-c2aa-b27f1c5784d9-OSALLISTUMINEN": "MERKITSEMATTA",
                "vaikuttaa_laskentaan": "",
                "vaikuttaa_laskentaan-OSALLISTUMINEN": "MERKITSEMATTA"
            }
        }
        ]
    });
}

function hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures(hakemukset) {
  return function () {
    var httpBackend = testFrame().httpBackend
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/hakuAppHakemukset\/eligibilities\/.*\/.*/).respond([]);
  }
}
