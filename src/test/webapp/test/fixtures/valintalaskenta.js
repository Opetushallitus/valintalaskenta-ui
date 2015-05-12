function valintalaskentaValintakokeetFixtures(hakijat) {
    return function() {
        var httpBackend = testFrame().httpBackend
        httpBackend.when('GET', /.*\/valintalaskenta-laskenta-service\/resources\/valintakoe\/hakutoive\/.*/).respond(
            _.map(hakijat, function(hakija) {
                    return {
                        hakuOid: hakija.hakuOid,
                        hakemusOid: hakija.hakemusOid,
                        hakijaOid: "1.2.246.562.24.75614211265",
                        etunimi: "",
                        sukunimi: "",
                        createdAt: 1410441125829,
                        hakutoiveet: [
                            {
                                hakukohdeOid: hakija.hakukohdeOid,
                                valinnanVaiheet: [
                                    {
                                        valinnanVaiheOid: "13951276457237010959300003160042",
                                        valinnanVaiheJarjestysluku: 1,
                                        valintakokeet: [
                                            {
                                                valintakoeOid: hakija.valintakoeOid,
                                                valintakoeTunniste: hakija.valintakoeOid,
                                                nimi: hakija.valintakoeOid,
                                                aktiivinen: true,
                                                osallistuminenTulos: {
                                                    osallistuminen: "OSALLISTUU",
                                                    kuvaus: null,
                                                    laskentaTila: "HYVAKSYTTAVISSA",
                                                    laskentaTulos: false
                                                },
                                                lahetetaankoKoekutsut: true,
                                                kutsutaankoKaikki: null,
                                                kutsuttavienMaara: null
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
            })
        );
    }
}