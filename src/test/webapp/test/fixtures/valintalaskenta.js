
// valintalaskenta-laskenta-service/resources/harkinnanvarainenhyvaksynta/haku/1.2.246.562.29.90697286251/hakemus/1.2.246.562.11.00001897296

function harkinnanvarainenhyvaksyntaFixtures() {
    var httpBackend = testFrame().httpBackend
    httpBackend.when('GET', /.*resources\/harkinnanvarainenhyvaksynta\/.*/).respond(
        []
    );
}
function valintalaskentaValintakokeetHakemukselleFixtures(hakija) {
    return function() {
        var httpBackend = testFrame().httpBackend
        httpBackend.when('GET', /.*\/valintalaskenta-laskenta-service\/resources\/valintakoe\/hakemus\/.*/).respond(
           {
                    hakuOid: hakija.hakuOid,
                    hakemusOid: hakija.hakemusOid,
                    hakijaOid: "1.2.246.562.24.72944276232",
                    etunimi: "",
                    sukunimi: "",
                    createdAt: 1433445508260,
                    hakutoiveet: [
                        {
                            hakukohdeOid: "1.2.246.562.20.24986103166",
                            valinnanVaiheet: [
                                {
                                    valinnanVaiheOid: "14273747304876432917204444892445",
                                    valinnanVaiheJarjestysluku: 0,
                                    valintakokeet: [
                                        {
                                            valintakoeOid: "14273747305352486173611023968797",
                                            valintakoeTunniste: "kielikoe_fi",
                                            nimi: "Kielikoe",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: true,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        },
                                        {
                                            valintakoeOid: "14273747305311647553378676302457",
                                            valintakoeTunniste: "1_2_246_562_20_24986103166_urheilija_lisapiste",
                                            nimi: "UrheilijalisÃ¤piste",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: false,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            hakukohdeOid: "1.2.246.562.20.61608097517",
                            valinnanVaiheet: [
                                {
                                    valinnanVaiheOid: "1427374459751-5842707357495671872",
                                    valinnanVaiheJarjestysluku: 0,
                                    valintakokeet: [
                                        {
                                            valintakoeOid: "1427374459803-6250818312739864291",
                                            valintakoeTunniste: "kielikoe_fi",
                                            nimi: "Kielikoe",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: true,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        },
                                        {
                                            valintakoeOid: "14273744597933655916167001355340",
                                            valintakoeTunniste: "1_2_246_562_20_61608097517_urheilija_lisapiste",
                                            nimi: "UrheilijalisÃ¤piste",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: false,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            hakukohdeOid: "1.2.246.562.20.76237731328",
                            valinnanVaiheet: [
                                {
                                    valinnanVaiheOid: "14273744489082082993092097760498",
                                    valinnanVaiheJarjestysluku: 0,
                                    valintakokeet: [
                                        {
                                            valintakoeOid: "1427374448964-3742128394629529473",
                                            valintakoeTunniste: "kielikoe_fi",
                                            nimi: "Kielikoe",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: true,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        },
                                        {
                                            valintakoeOid: "1427374448960-3288451201142847287",
                                            valintakoeTunniste: "1_2_246_562_20_76237731328_urheilija_lisapiste",
                                            nimi: "UrheilijalisÃ¤piste",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: false,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            hakukohdeOid: "1.2.246.562.20.270241078010",
                            valinnanVaiheet: [
                                {
                                    valinnanVaiheOid: "14273744794583255399478865758161",
                                    valinnanVaiheJarjestysluku: 0,
                                    valintakokeet: [
                                        {
                                            valintakoeOid: "1427374479494-2725567192584897353",
                                            valintakoeTunniste: "kielikoe_fi",
                                            nimi: "Kielikoe",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: true,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        },
                                        {
                                            valintakoeOid: "14273744795035384153736336671904",
                                            valintakoeTunniste: "1_2_246_562_20_270241078010_urheilija_lisapiste",
                                            nimi: "UrheilijalisÃ¤piste",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: false,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            hakukohdeOid: "1.2.246.562.20.34911042264",
                            valinnanVaiheet: [
                                {
                                    valinnanVaiheOid: "14273745244854358789382412437199",
                                    valinnanVaiheJarjestysluku: 0,
                                    valintakokeet: [
                                        {
                                            valintakoeOid: "14273745245646792367760399790762",
                                            valintakoeTunniste: "kielikoe_fi",
                                            nimi: "Kielikoe",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: true,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        },
                                        {
                                            valintakoeOid: "14273745245721447808201284937726",
                                            valintakoeTunniste: "1_2_246_562_20_34911042264_urheilija_lisapiste",
                                            nimi: "UrheilijalisÃ¤piste",
                                            aktiivinen: true,
                                            osallistuminenTulos: {
                                                osallistuminen: "EI_OSALLISTU",
                                                kuvaus: null,
                                                laskentaTila: "HYVAKSYTTAVISSA",
                                                laskentaTulos: false
                                            },
                                            lahetetaankoKoekutsut: false,
                                            kutsutaankoKaikki: null,
                                            kutsuttavienMaara: null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
           }
        );
    }
}
function valintalaskentaHakemukselleFixtures(hakija) {
    return function() {
        var httpBackend = testFrame().httpBackend
        httpBackend.when('GET', /.*\/valintalaskenta-laskenta-service\/resources\/hakemus\/.*/).respond(
            {
                hakuoid: hakija.hakuOid,
                hakemusoid: hakija.hakemusOid,
                hakukohteet: [
                    {
                        hakuoid: hakija.hakuOid,
                        tarjoajaoid: "1.2.246.562.10.2013120512465870055633",
                        valinnanvaihe: [
                            {
                                jarjestysnumero: 1,
                                valinnanvaiheoid: "14273745244705912359679338288678",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433445517427,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "1427374524623-2854281967348639262",
                                        nimi: "Harkinnanvaraisten kÃ¤sittelyvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 0,
                                        siirretaanSijoitteluun: false,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: false,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: null,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: "Kielikokeessa hylÃ¤tyt pois koekutsuista ja ulkomailla suoritettu koulutus tai oppivelvollisuuden suorittaminen keskeytynyt"
                                                    }
                                                ],
                                                prioriteetti: 2,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [ ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "1427374524623-2854281967348639262"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 2,
                                valinnanvaiheoid: "14286720635599159224615572910507",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433445534078,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "14286732267651686564821516005369",
                                        nimi: "Varsinaisen valinnanvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 48,
                                        siirretaanSijoitteluun: true,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: true,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: 25,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: null
                                                    },
                                                    {
                                                        arvo: 4,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 1,
                                                        nimi: "HakutoivejÃ¤rjestystasapistetilanne, 2. aste, pk ja yo"
                                                    },
                                                    {
                                                        arvo: 6.8529,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 2,
                                                        nimi: "Kaikkien aineiden keskiarvo, PK"
                                                    }
                                                ],
                                                prioriteetti: 2,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    },
                                                    {
                                                        tunniste: "1_2_246_562_20_34911042264_urheilija_lisapiste",
                                                        arvo: null,
                                                        laskennallinenArvo: "0.0",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [
                                                    {
                                                        tunniste: "sukupuoli",
                                                        arvo: "0.0",
                                                        nimiFi: "Sukupuoli",
                                                        nimiSv: "KÃ¶n",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "ilmanopiskelupaikkaa",
                                                        arvo: "8.0",
                                                        nimiFi: "Ilman opiskelupaikkaa",
                                                        nimiSv: "Utan utbildningsplats",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "pohjakoulutus",
                                                        arvo: "6.0",
                                                        nimiFi: "Perusopetuksen tai lisÃ¤koulutuksen suorittaminen",
                                                        nimiSv: "GenomfÃ¶rt grundlÃ¤ggande utbildning eller tillÃ¤ggsutbildning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "hakutoivejarjestys",
                                                        arvo: "0.0",
                                                        nimiFi: "HakutoivejÃ¤rjestys",
                                                        nimiSv: "AnsÃ¶kningsmÃ¥lsordning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "koulumenestys_pk",
                                                        arvo: "6.0",
                                                        nimiFi: "Yleinen koulumenestys",
                                                        nimiSv: "AllmÃ¤n skolframgÃ¥ng",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_arvosanat",
                                                        arvo: "5.0",
                                                        nimiFi: "Painotettavat arvosanat",
                                                        nimiSv: "Betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "tyokokemus",
                                                        arvo: "0.0",
                                                        nimiFi: "TyÃ¶kokemus",
                                                        nimiSv: "Arbetserfarenhet",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_ka",
                                                        arvo: "8.1667",
                                                        nimiFi: "Painotettavien arvosanojen keskiarvo",
                                                        nimiSv: "Medeltalet av betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "keskiarvo_pk",
                                                        arvo: "6.8529",
                                                        nimiFi: "Kaikkien aineiden keskiarvo",
                                                        nimiSv: "Medeltalet av alla Ã¤mnen",
                                                        nimiEn: ""
                                                    }
                                                ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "14286732267651686564821516005369"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 0,
                                valinnanvaiheoid: "14273745244854358789382412437199",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433445508260,
                                valintatapajonot: [ ],
                                valintakokeet: [
                                    {
                                        valintakoeOid: "14273745245646792367760399790762",
                                        valintakoeTunniste: "kielikoe_fi",
                                        nimi: "Kielikoe",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: true,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    },
                                    {
                                        valintakoeOid: "14273745245721447808201284937726",
                                        valintakoeTunniste: "1_2_246_562_20_34911042264_urheilija_lisapiste",
                                        nimi: "UrheilijalisÃ¤piste",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: false,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    }
                                ],
                                valinnanvaihe: 0
                            }
                        ],
                        prioriteetti: 0,
                        kaikkiJonotSijoiteltu: true,
                        harkinnanvaraisuus: false,
                        hakijaryhma: [ ],
                        oid: "1.2.246.562.20.34911042264"
                    },
                    {
                        hakuoid: hakija.hakuOid,
                        tarjoajaoid: "1.2.246.562.10.2013120512465870055633",
                        valinnanvaihe: [
                            {
                                jarjestysnumero: 1,
                                valinnanvaiheoid: "14273744794392154402821305811900",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433443840406,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "1427374479549-7228841803408179522",
                                        nimi: "Harkinnanvaraisten kÃ¤sittelyvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 0,
                                        siirretaanSijoitteluun: false,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: false,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: null,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: "Kielikokeessa hylÃ¤tyt pois koekutsuista ja ulkomailla suoritettu koulutus tai oppivelvollisuuden suorittaminen keskeytynyt"
                                                    }
                                                ],
                                                prioriteetti: 4,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [ ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "1427374479549-7228841803408179522"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 2,
                                valinnanvaiheoid: "14286722023926883084625909939906",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433443855884,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "1428673076294-3578607154696779141",
                                        nimi: "Varsinaisen valinnanvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 73,
                                        siirretaanSijoitteluun: true,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: true,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: 25,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: null
                                                    },
                                                    {
                                                        arvo: 2,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 1,
                                                        nimi: "HakutoivejÃ¤rjestystasapistetilanne, 2. aste, pk ja yo"
                                                    },
                                                    {
                                                        arvo: 6.8529,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 2,
                                                        nimi: "Kaikkien aineiden keskiarvo, PK"
                                                    }
                                                ],
                                                prioriteetti: 4,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "1_2_246_562_20_270241078010_urheilija_lisapiste",
                                                        arvo: null,
                                                        laskennallinenArvo: "0.0",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    },
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [
                                                    {
                                                        tunniste: "sukupuoli",
                                                        arvo: "0.0",
                                                        nimiFi: "Sukupuoli",
                                                        nimiSv: "KÃ¶n",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "ilmanopiskelupaikkaa",
                                                        arvo: "8.0",
                                                        nimiFi: "Ilman opiskelupaikkaa",
                                                        nimiSv: "Utan utbildningsplats",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "pohjakoulutus",
                                                        arvo: "6.0",
                                                        nimiFi: "Perusopetuksen tai lisÃ¤koulutuksen suorittaminen",
                                                        nimiSv: "GenomfÃ¶rt grundlÃ¤ggande utbildning eller tillÃ¤ggsutbildning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "hakutoivejarjestys",
                                                        arvo: "0.0",
                                                        nimiFi: "HakutoivejÃ¤rjestys",
                                                        nimiSv: "AnsÃ¶kningsmÃ¥lsordning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "koulumenestys_pk",
                                                        arvo: "6.0",
                                                        nimiFi: "Yleinen koulumenestys",
                                                        nimiSv: "AllmÃ¤n skolframgÃ¥ng",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_arvosanat",
                                                        arvo: "5.0",
                                                        nimiFi: "Painotettavat arvosanat",
                                                        nimiSv: "Betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "tyokokemus",
                                                        arvo: "0.0",
                                                        nimiFi: "TyÃ¶kokemus",
                                                        nimiSv: "Arbetserfarenhet",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_ka",
                                                        arvo: "8.1667",
                                                        nimiFi: "Painotettavien arvosanojen keskiarvo",
                                                        nimiSv: "Medeltalet av betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "keskiarvo_pk",
                                                        arvo: "6.8529",
                                                        nimiFi: "Kaikkien aineiden keskiarvo",
                                                        nimiSv: "Medeltalet av alla Ã¤mnen",
                                                        nimiEn: ""
                                                    }
                                                ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "1428673076294-3578607154696779141"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 0,
                                valinnanvaiheoid: "14273744794583255399478865758161",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433445508260,
                                valintatapajonot: [ ],
                                valintakokeet: [
                                    {
                                        valintakoeOid: "1427374479494-2725567192584897353",
                                        valintakoeTunniste: "kielikoe_fi",
                                        nimi: "Kielikoe",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: true,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    },
                                    {
                                        valintakoeOid: "14273744795035384153736336671904",
                                        valintakoeTunniste: "1_2_246_562_20_270241078010_urheilija_lisapiste",
                                        nimi: "UrheilijalisÃ¤piste",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: false,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    }
                                ],
                                valinnanvaihe: 0
                            }
                        ],
                        prioriteetti: 0,
                        kaikkiJonotSijoiteltu: true,
                        harkinnanvaraisuus: false,
                        hakijaryhma: [ ],
                        oid: "1.2.246.562.20.270241078010"
                    },
                    {
                        hakuoid: hakija.hakuOid,
                        tarjoajaoid: "1.2.246.562.10.2013120512505714939003",
                        valinnanvaihe: [
                            {
                                jarjestysnumero: 1,
                                valinnanvaiheoid: "14273744597255736556115379776961",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433438799113,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "1427374459835-1247060372947627353",
                                        nimi: "Harkinnanvaraisten kÃ¤sittelyvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 0,
                                        siirretaanSijoitteluun: false,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: false,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: null,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: "Kielikokeessa hylÃ¤tyt pois koekutsuista ja ulkomailla suoritettu koulutus tai oppivelvollisuuden suorittaminen keskeytynyt"
                                                    }
                                                ],
                                                prioriteetti: 1,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [ ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "1427374459835-1247060372947627353"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 2,
                                valinnanvaiheoid: "1428672043505-4325757457360745583",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433438813283,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "14286731511578076145187590584808",
                                        nimi: "Varsinaisen valinnanvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 16,
                                        siirretaanSijoitteluun: true,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: true,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: 27,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: null
                                                    },
                                                    {
                                                        arvo: 5,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 1,
                                                        nimi: "HakutoivejÃ¤rjestystasapistetilanne, 2. aste, pk ja yo"
                                                    },
                                                    {
                                                        arvo: 6.8529,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 2,
                                                        nimi: "Kaikkien aineiden keskiarvo, PK"
                                                    }
                                                ],
                                                prioriteetti: 1,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    },
                                                    {
                                                        tunniste: "1_2_246_562_20_61608097517_urheilija_lisapiste",
                                                        arvo: null,
                                                        laskennallinenArvo: "0.0",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [
                                                    {
                                                        tunniste: "sukupuoli",
                                                        arvo: "0.0",
                                                        nimiFi: "Sukupuoli",
                                                        nimiSv: "KÃ¶n",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "ilmanopiskelupaikkaa",
                                                        arvo: "8.0",
                                                        nimiFi: "Ilman opiskelupaikkaa",
                                                        nimiSv: "Utan utbildningsplats",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "pohjakoulutus",
                                                        arvo: "6.0",
                                                        nimiFi: "Perusopetuksen tai lisÃ¤koulutuksen suorittaminen",
                                                        nimiSv: "GenomfÃ¶rt grundlÃ¤ggande utbildning eller tillÃ¤ggsutbildning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "hakutoivejarjestys",
                                                        arvo: "2.0",
                                                        nimiFi: "HakutoivejÃ¤rjestys",
                                                        nimiSv: "AnsÃ¶kningsmÃ¥lsordning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "koulumenestys_pk",
                                                        arvo: "6.0",
                                                        nimiFi: "Yleinen koulumenestys",
                                                        nimiSv: "AllmÃ¤n skolframgÃ¥ng",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_arvosanat",
                                                        arvo: "5.0",
                                                        nimiFi: "Painotettavat arvosanat",
                                                        nimiSv: "Betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "tyokokemus",
                                                        arvo: "0.0",
                                                        nimiFi: "TyÃ¶kokemus",
                                                        nimiSv: "Arbetserfarenhet",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_ka",
                                                        arvo: "8.1667",
                                                        nimiFi: "Painotettavien arvosanojen keskiarvo",
                                                        nimiSv: "Medeltalet av betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "keskiarvo_pk",
                                                        arvo: "6.8529",
                                                        nimiFi: "Kaikkien aineiden keskiarvo",
                                                        nimiSv: "Medeltalet av alla Ã¤mnen",
                                                        nimiEn: ""
                                                    }
                                                ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "14286731511578076145187590584808"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 0,
                                valinnanvaiheoid: "1427374459751-5842707357495671872",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433445508260,
                                valintatapajonot: [ ],
                                valintakokeet: [
                                    {
                                        valintakoeOid: "1427374459803-6250818312739864291",
                                        valintakoeTunniste: "kielikoe_fi",
                                        nimi: "Kielikoe",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: true,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    },
                                    {
                                        valintakoeOid: "14273744597933655916167001355340",
                                        valintakoeTunniste: "1_2_246_562_20_61608097517_urheilija_lisapiste",
                                        nimi: "UrheilijalisÃ¤piste",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: false,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    }
                                ],
                                valinnanvaihe: 0
                            }
                        ],
                        prioriteetti: 0,
                        kaikkiJonotSijoiteltu: true,
                        harkinnanvaraisuus: false,
                        hakijaryhma: [ ],
                        oid: "1.2.246.562.20.61608097517"
                    },
                    {
                        hakuoid: hakija.hakuOid,
                        tarjoajaoid: "1.2.246.562.10.2013120512465870055633",
                        valinnanvaihe: [
                            {
                                jarjestysnumero: 1,
                                valinnanvaiheoid: "1427374448899-3044289511380063229",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433440788126,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "1427374449002-1698046391876091997",
                                        nimi: "Harkinnanvaraisten kÃ¤sittelyvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 0,
                                        siirretaanSijoitteluun: false,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: false,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: null,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: "Kielikokeessa hylÃ¤tyt pois koekutsuista ja ulkomailla suoritettu koulutus tai oppivelvollisuuden suorittaminen keskeytynyt"
                                                    }
                                                ],
                                                prioriteetti: 5,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [ ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "1427374449002-1698046391876091997"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 2,
                                valinnanvaiheoid: "14286723605031570021597617299942",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433440796189,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "14286733615476462737768979210691",
                                        nimi: "Varsinaisen valinnanvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 16,
                                        siirretaanSijoitteluun: true,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: true,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: 25,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: null
                                                    },
                                                    {
                                                        arvo: 1,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 1,
                                                        nimi: "HakutoivejÃ¤rjestystasapistetilanne, 2. aste, pk ja yo"
                                                    },
                                                    {
                                                        arvo: 6.8529,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 2,
                                                        nimi: "Kaikkien aineiden keskiarvo, PK"
                                                    }
                                                ],
                                                prioriteetti: 5,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    },
                                                    {
                                                        tunniste: "1_2_246_562_20_76237731328_urheilija_lisapiste",
                                                        arvo: null,
                                                        laskennallinenArvo: "0.0",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [
                                                    {
                                                        tunniste: "sukupuoli",
                                                        arvo: "0.0",
                                                        nimiFi: "Sukupuoli",
                                                        nimiSv: "KÃ¶n",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "ilmanopiskelupaikkaa",
                                                        arvo: "8.0",
                                                        nimiFi: "Ilman opiskelupaikkaa",
                                                        nimiSv: "Utan utbildningsplats",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "pohjakoulutus",
                                                        arvo: "6.0",
                                                        nimiFi: "Perusopetuksen tai lisÃ¤koulutuksen suorittaminen",
                                                        nimiSv: "GenomfÃ¶rt grundlÃ¤ggande utbildning eller tillÃ¤ggsutbildning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "hakutoivejarjestys",
                                                        arvo: "0.0",
                                                        nimiFi: "HakutoivejÃ¤rjestys",
                                                        nimiSv: "AnsÃ¶kningsmÃ¥lsordning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "koulumenestys_pk",
                                                        arvo: "6.0",
                                                        nimiFi: "Yleinen koulumenestys",
                                                        nimiSv: "AllmÃ¤n skolframgÃ¥ng",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_arvosanat",
                                                        arvo: "5.0",
                                                        nimiFi: "Painotettavat arvosanat",
                                                        nimiSv: "Betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "tyokokemus",
                                                        arvo: "0.0",
                                                        nimiFi: "TyÃ¶kokemus",
                                                        nimiSv: "Arbetserfarenhet",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_ka",
                                                        arvo: "8.1667",
                                                        nimiFi: "Painotettavien arvosanojen keskiarvo",
                                                        nimiSv: "Medeltalet av betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "keskiarvo_pk",
                                                        arvo: "6.8529",
                                                        nimiFi: "Kaikkien aineiden keskiarvo",
                                                        nimiSv: "Medeltalet av alla Ã¤mnen",
                                                        nimiEn: ""
                                                    }
                                                ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "14286733615476462737768979210691"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 0,
                                valinnanvaiheoid: "14273744489082082993092097760498",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433445508260,
                                valintatapajonot: [ ],
                                valintakokeet: [
                                    {
                                        valintakoeOid: "1427374448964-3742128394629529473",
                                        valintakoeTunniste: "kielikoe_fi",
                                        nimi: "Kielikoe",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: true,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    },
                                    {
                                        valintakoeOid: "1427374448960-3288451201142847287",
                                        valintakoeTunniste: "1_2_246_562_20_76237731328_urheilija_lisapiste",
                                        nimi: "UrheilijalisÃ¤piste",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: false,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    }
                                ],
                                valinnanvaihe: 0
                            }
                        ],
                        prioriteetti: 0,
                        kaikkiJonotSijoiteltu: true,
                        harkinnanvaraisuus: false,
                        hakijaryhma: [ ],
                        oid: "1.2.246.562.20.76237731328"
                    },
                    {
                        hakuoid: hakija.hakuOid,
                        tarjoajaoid: "1.2.246.562.10.2013120512465870055633",
                        valinnanvaihe: [
                            {
                                jarjestysnumero: 1,
                                valinnanvaiheoid: "1427374730475-1239035551603126386",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433437981208,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "14273747305575509194753657639309",
                                        nimi: "Harkinnanvaraisten kÃ¤sittelyvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 0,
                                        siirretaanSijoitteluun: false,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: false,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: null,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: "Kielikokeessa hylÃ¤tyt pois koekutsuista ja ulkomailla suoritettu koulutus tai oppivelvollisuuden suorittaminen keskeytynyt"
                                                    }
                                                ],
                                                prioriteetti: 3,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [ ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "14273747305575509194753657639309"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 2,
                                valinnanvaiheoid: "14286720116035453143228570262255",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433437989880,
                                valintatapajonot: [
                                    {
                                        valintatapajonooid: "1428673295602-3961255129103687440",
                                        nimi: "Varsinaisen valinnanvaiheen valintatapajono",
                                        prioriteetti: 0,
                                        aloituspaikat: 28,
                                        siirretaanSijoitteluun: true,
                                        tasasijasaanto: "ARVONTA",
                                        eiVarasijatayttoa: false,
                                        kaikkiEhdonTayttavatHyvaksytaan: false,
                                        poissaOlevaTaytto: null,
                                        kaytetaanValintalaskentaa: true,
                                        valmisSijoiteltavaksi: true,
                                        jonosijat: [
                                            {
                                                jonosija: 1,
                                                hakemusOid: "1.2.246.562.11.00001897296",
                                                hakijaOid: "1.2.246.562.24.72944276232",
                                                jarjestyskriteerit: [
                                                    {
                                                        arvo: 25,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 0,
                                                        nimi: null
                                                    },
                                                    {
                                                        arvo: 3,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 1,
                                                        nimi: "HakutoivejÃ¤rjestystasapistetilanne, 2. aste, pk ja yo"
                                                    },
                                                    {
                                                        arvo: 6.8529,
                                                        tila: "HYVAKSYTTAVISSA",
                                                        kuvaus: { },
                                                        prioriteetti: 2,
                                                        nimi: "Kaikkien aineiden keskiarvo, PK"
                                                    }
                                                ],
                                                prioriteetti: 3,
                                                sukunimi: "Ala-Suonio",
                                                etunimi: "Inka XX",
                                                harkinnanvarainen: false,
                                                tuloksenTila: "HYVAKSYTTAVISSA",
                                                historiat: null,
                                                syotetytArvot: [
                                                    {
                                                        tunniste: "kielikoe_fi",
                                                        arvo: null,
                                                        laskennallinenArvo: "false",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    },
                                                    {
                                                        tunniste: "1_2_246_562_20_24986103166_urheilija_lisapiste",
                                                        arvo: null,
                                                        laskennallinenArvo: "0.0",
                                                        osallistuminen: "MERKITSEMATTA"
                                                    }
                                                ],
                                                funktioTulokset: [
                                                    {
                                                        tunniste: "sukupuoli",
                                                        arvo: "0.0",
                                                        nimiFi: "Sukupuoli",
                                                        nimiSv: "KÃ¶n",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "ilmanopiskelupaikkaa",
                                                        arvo: "8.0",
                                                        nimiFi: "Ilman opiskelupaikkaa",
                                                        nimiSv: "Utan utbildningsplats",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "pohjakoulutus",
                                                        arvo: "6.0",
                                                        nimiFi: "Perusopetuksen tai lisÃ¤koulutuksen suorittaminen",
                                                        nimiSv: "GenomfÃ¶rt grundlÃ¤ggande utbildning eller tillÃ¤ggsutbildning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "hakutoivejarjestys",
                                                        arvo: "0.0",
                                                        nimiFi: "HakutoivejÃ¤rjestys",
                                                        nimiSv: "AnsÃ¶kningsmÃ¥lsordning",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "koulumenestys_pk",
                                                        arvo: "6.0",
                                                        nimiFi: "Yleinen koulumenestys",
                                                        nimiSv: "AllmÃ¤n skolframgÃ¥ng",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_arvosanat",
                                                        arvo: "5.0",
                                                        nimiFi: "Painotettavat arvosanat",
                                                        nimiSv: "Betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "tyokokemus",
                                                        arvo: "0.0",
                                                        nimiFi: "TyÃ¶kokemus",
                                                        nimiSv: "Arbetserfarenhet",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "painotettavat_ka",
                                                        arvo: "8.1667",
                                                        nimiFi: "Painotettavien arvosanojen keskiarvo",
                                                        nimiSv: "Medeltalet av betonade vitsord",
                                                        nimiEn: ""
                                                    },
                                                    {
                                                        tunniste: "keskiarvo_pk",
                                                        arvo: "6.8529",
                                                        nimiFi: "Kaikkien aineiden keskiarvo",
                                                        nimiSv: "Medeltalet av alla Ã¤mnen",
                                                        nimiEn: ""
                                                    }
                                                ],
                                                muokattu: false,
                                                hylattyValisijoittelussa: false
                                            }
                                        ],
                                        aktiivinen: true,
                                        hakija: [ ],
                                        varasijat: 0,
                                        varasijaTayttoPaivat: 0,
                                        varasijojaKaytetaanAlkaen: null,
                                        varasijojaTaytetaanAsti: null,
                                        tayttojono: null,
                                        sijoitteluajoId: null,
                                        oid: "1428673295602-3961255129103687440"
                                    }
                                ],
                                valintakokeet: [ ],
                                valinnanvaihe: 0
                            },
                            {
                                jarjestysnumero: 0,
                                valinnanvaiheoid: "14273747304876432917204444892445",
                                hakuOid: "1.2.246.562.29.90697286251",
                                nimi: null,
                                createdAt: 1433445508260,
                                valintatapajonot: [ ],
                                valintakokeet: [
                                    {
                                        valintakoeOid: "14273747305352486173611023968797",
                                        valintakoeTunniste: "kielikoe_fi",
                                        nimi: "Kielikoe",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: true,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    },
                                    {
                                        valintakoeOid: "14273747305311647553378676302457",
                                        valintakoeTunniste: "1_2_246_562_20_24986103166_urheilija_lisapiste",
                                        nimi: "UrheilijalisÃ¤piste",
                                        aktiivinen: true,
                                        osallistuminenTulos: {
                                            osallistuminen: "EI_OSALLISTU",
                                            kuvaus: null,
                                            laskentaTila: "HYVAKSYTTAVISSA",
                                            laskentaTulos: false
                                        },
                                        lahetetaankoKoekutsut: false,
                                        kutsutaankoKaikki: null,
                                        kutsuttavienMaara: null
                                    }
                                ],
                                valinnanvaihe: 0
                            }
                        ],
                        prioriteetti: 0,
                        kaikkiJonotSijoiteltu: true,
                        harkinnanvaraisuus: false,
                        hakijaryhma: [ ],
                        oid: "1.2.246.562.20.24986103166"
                    }
                ],
                hakijaOid: null,
                etunimi: null,
                sukunimi: null,
                avaimet: [ ],
                avainMetatiedotDTO: [ ]
            }
        );
    }
}


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