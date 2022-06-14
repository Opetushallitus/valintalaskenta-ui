var defaultParametritFixtures = {
  valintalaskenta: true,
  pistesyotto: true,
  hakeneet: true,
  valinnanhallinta: true,
  harkinnanvaraiset: true,
  valintakoekutsut: true,
  hakijaryhmat: true,
  koetulostentallennus: false,
  koekutsujenmuodostaminen: false
}

function parametritFixtures() {
    var httpBackend = testFrame().httpBackend;
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/parametrit\/.*/).respond(defaultParametritFixtures);
}
function parametritFixturesWithOverrides(overrides) {
  var withOverrides = _.extend({}, defaultParametritFixtures, overrides)
  return function () {
    var httpBackend = testFrame().httpBackend;
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/parametrit\/.*/).respond(withOverrides);
  }
}

function koostettuPistetietoKaksiHenkiloaFixtures() {
  var httpBackend = testFrame().httpBackend;
  httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/pistesyotto\/koostetutPistetiedot\/haku\/h\/hakukohde\/h0/).respond({
        "valintapisteet": [
            {
              "applicationAdditionalDataDTO": {
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
              }
            },
            {
              "applicationAdditionalDataDTO": {
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
            }
        ]
      });
}

function koostettuPistetietoGeneroitava(count, hakija1oid, hakija2oid) {
    var hakuAppPisteFixtures = {
        "valintapisteet": [{
        "applicationAdditionalDataDTO": {
            "oid": "1.2.246.562.11.00002265212",
            "personOid": hakija1oid,
            "firstNames": "Gösta Testi",
            "lastName": "Friman-Testi",
            "additionalData": {
                "kielikoe_fi-OSALLISTUMINEN": "EI_OSALLISTUNUT",
                "kielikoe_fi": "true",
                "1_2_246_562_20_87022967258_urheilija_lisapiste": "",
                "1_2_246_562_20_87022967258_urheilija_lisapiste-OSALLISTUMINEN": "EI_OSALLISTUNUT",
                "1_2_246_562_20_24435399589_urheilija_lisapiste": "",
                "1_2_246_562_20_24435399589_urheilija_lisapiste-OSALLISTUMINEN": "EI_OSALLISTUNUT"
            }
        },
        "hakukohteidenOsallistumistiedot": {
            "HAKUKOHDEOID": {
                "valintakokeidenOsallistumistiedot": {
                    "kielikoe_fi": {
                        "osallistuminen": "OSALLISTUI"
                    },
                    "1_2_246_562_20_87022967258_urheilija_lisapiste": {
                        "osallistuminen": "OSALLISTUI"
                    },
                    "1_2_246_562_20_24435399589_urheilija_lisapiste": {
                        "osallistuminen": "OSALLISTUI"
                    }
                }
            }
        }
    }]};
    for (var i = 1; i < count; i++) {
        hakuAppPisteFixtures.valintapisteet.push({
            "applicationAdditionalDataDTO": {
                "oid": "1.2.246.562.11.00002273123" + i,
                "personOid": hakija2oid,
                "firstNames": "Keimo Testi " + i,
                "lastName": "Ahonen-Testi",
                "additionalData": {
                    "kielikoe_fi-OSALLISTUMINEN": "EI_OSALLISTUNUT",
                    "kielikoe_fi": "true"
                }
            },
            "hakukohteidenOsallistumistiedot": {
                "HAKUKOHDEOID": {
                    "valintakokeidenOsallistumistiedot": {
                        "kielikoe_fi": {
                            "osallistuminen": "OSALLISTUI"
                        }
                    }
                }
            }
        })
    }

    return function() {
        var httpBackend = testFrame().httpBackend;
        httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/pistesyotto\/koostetutPistetiedot.*/).respond(hakuAppPisteFixtures);
    }
}

function kirjeFixtures() {
  var httpBackend = testFrame().httpBackend;
  httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/proxy\/viestintapalvelu\/count\/.*/).respond({
    "hyvaksymiskirje": {
      "fi":{"letterBatchId":264,"letterTotalCount":1,"letterReadyCount":1,"letterErrorCount":0,"letterPublishedCount":1,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": 1245},
      "sv":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null},
      "en":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null}
    },
    "hyvaksymiskirje_huoltajille": {
      "fi":{"letterBatchId":123,"letterTotalCount":1,"letterReadyCount":1,"letterErrorCount":0,"letterPublishedCount":1,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": 1245},
      "sv":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null},
      "en":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null}
    },
    "jalkiohjauskirje":{
      "fi":{"letterBatchId":186,"letterTotalCount":4,"letterReadyCount":4,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":true,"groupEmailId": null},
      "sv":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null},
      "en":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null}
    },
    "jalkiohjauskirje_huoltajille":{
      "fi":{"letterBatchId":286,"letterTotalCount":2,"letterReadyCount":2,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":true,"groupEmailId": null},
      "sv":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null},
      "en":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false,"groupEmailId": null}
    }
  });
}
function valintalaskentakoostepalveluFixtures() {
    var httpBackend = testFrame().httpBackend;
    console.log("valintalaskentakoostepalveluFixtures")

    //expect(JSON.parse(data)[0].hyvaksyPeruuntunut).to.be.true
    var data = [{
        "hyvaksyPeruuntunut": true
    }];
    httpBackend.whenPOST(/.*valintalaskentakoostepalvelu\/resources\/proxy\/valintatulosservice\/myohastyneet\/haku\/1\.2\.246\.562\.29\.90697286251\/hakukohde\/1\.2\.246\.562\.20\.18097797874/).respond(200,data);
    httpBackend.whenPOST(/.*valintalaskentakoostepalvelu\/resources\/proxy\/valintatulosservice\/myohastyneet\/haku\/1\.2\.246\.562\.29\.11735171271\/hakukohde\/HAKUKOHDE_OID_NO_VIITE_YES_SYOTTO/).respond(200,data);
    httpBackend.whenPOST(/.*valintalaskentakoostepalvelu\/resources\/proxy\/valintatulosservice\/tilahakijalle\/haku\/.*\/hakukohde\/.*\/valintatapajono\/.*/).respond(200,'[]');

}


//valintalaskentakoostepalvelu/resources/proxy/valintatulos/haku/1.2.246.562.29.11735171271/hakemusOid/1.2.246.562.11.00007967463
