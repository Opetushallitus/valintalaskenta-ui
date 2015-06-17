describe('Sijoittelun tulokset välilehti', function () {
    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    })

    describe('Opiskelijan valintatulokset sijoittelu välilehdellä', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.11735171271", "1.2.246.562.20.37731636579");
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures)()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(valintaperusteetFixtures)()
            addTestHook(valintatulosFixture)()
            addTestHook(commonFixtures())()
            page.openPage(done);
        })

        it('sijoittelu normi case', seqDone(
            wait.forAngular,
            click(sijoitteluntulokset.iirisHenkilotiedot),
            visible(sijoitteluntulokset.modaali),
            function () {
                expect(sijoitteluntulokset.koulunNimi().is(':visible')).to.equal(true)
                assertText(sijoitteluntulokset.valintatilanne, "Kesken")
                assertText(sijoitteluntulokset.valintatulosTableIndex(1, 1), "Aalto-yliopisto, Insinööritieteiden korkeakoulu")
                assertText(sijoitteluntulokset.valintatulosTableIndex(1, 2), "Energia- ja LVI-tekniikka, diplomi-insinööri KOULUTUS")
                assertText(sijoitteluntulokset.valintatulosTableIndex(2, 1), "Aalto-yliopisto, Insinööritieteiden korkeakoulu")
                assertText(sijoitteluntulokset.valintatulosTableIndex(2, 2), "Tietotekniikka, diplomi-insinööri KOULUTUS")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(1), "Opiskelupaikka vastaanotettu")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(2), "Et ottanut opiskelupaikkaa vastaan määräaikaan mennessä")
            }
        ))
    })

    describe('Opiskelijan valintatulokset, kun valinta kesken', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.11735171271", "1.2.246.562.11.00000000220");
        beforeEach(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures)()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(valintaperusteetFixtures)()
            addTestHook(valintatulosFixture)()
            addTestHook(commonFixtures())()
            page.openPage(done);
        })

        afterEach(function () {
            if (this.currentTest.state == 'failed') {
                takeScreenshot()
            }
        })

        it('sijoittelu kesken', seqDone(
            wait.forAngular,
            click(sijoitteluntulokset.teppoHenkilotiedot),
            visible(sijoitteluntulokset.modaali),
            function () {
                expect(true).to.equal(true)
                assertText(sijoitteluntulokset.valintatulosTableIndex(1, 1), "Aalto-yliopisto, Insinööritieteiden korkeakoulu")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(1), "Hyväksytty")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(2), "Peruuntunut")
            }
        ))
    })

    describe('Sijoittelun tulokset -välilehdellä Kk haussa', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.95390561488", "1.2.246.562.20.44161747595");
        var HAKU = "1.2.246.562.29.95390561488";
        var HAKUKOHDE = "1.2.246.562.20.44161747595";
        beforeEach(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures)()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(valintaperusteetFixtures)()
            addTestHook(commonFixtures())()
            page.openPage(done);
        })

        it('Vastaanottotieto alasvetovalikko', seqDone(
            wait.forAngular,
            click(sijoitteluntulokset.hyvaksyValintaesitys),
            enabled(sijoitteluntulokset.vastaanottotieto),
            function() {
                assertText(sijoitteluntulokset.vastaanottotietoOption(1), "Kesken");
                assertText(sijoitteluntulokset.vastaanottotietoOption(2), "Ehdollisesti vastaanottanut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(3), "Vastaanottanut sitovasti");
                assertText(sijoitteluntulokset.vastaanottotietoOption(4), "Ei vastaanotettu määräaikana");
                assertText(sijoitteluntulokset.vastaanottotietoOption(5), "Perunut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(6), "Peruutettu");
                expect(sijoitteluntulokset.vastaanottotieto().children().length).to.equal(7);
            }
        ))
    })

    describe('Sijoittelun tulokset -välilehti 2. asteen haussa OPH oikeuksilla', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.90697286251", "1.2.246.562.20.18097797874");
        var HAKU = "1.2.246.562.29.90697286251";
        var HAKUKOHDE = "1.2.246.562.20.18097797874";
        beforeEach(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures)()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(valintaperusteetFixtures)()
            addTestHook(commonFixtures())()
            page.openPage(done);
        })

        it('Vastaanottotieto alasvetovalikko', seqDone(
            wait.forAngular,
            click(sijoitteluntulokset.hyvaksyValintaesitys),
            enabled(sijoitteluntulokset.vastaanottotieto),
            function() {
                assertText(sijoitteluntulokset.vastaanottotietoOption(1), "Kesken");
                assertText(sijoitteluntulokset.vastaanottotietoOption(2), "Vastaanottanut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(3), "Ei vastaanotettu määräaikana");
                assertText(sijoitteluntulokset.vastaanottotietoOption(4), "Perunut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(5), "Peruutettu");
                expect(sijoitteluntulokset.vastaanottotieto().children().length).to.equal(6);
            }
        ))
    })

    describe('Sijoittelun tulokset -välilehti 2. asteen haussa ilman OPH oikeuksia', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.90697286251", "1.2.246.562.20.18097797874");
        var HAKU = "1.2.246.562.29.90697286251";
        var HAKUKOHDE = "1.2.246.562.20.18097797874";
        beforeEach(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures)()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(valintaperusteetFixtures)()
            addTestHook(commonFixtures(["USER_lktesti", "VIRKAILIJA", "LANG_fi", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_CRUD", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_EPERUSTEET", "APP_EPERUSTEET_READ", "APP_EPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_2ASTEENVASTUU", "APP_HENKILONHALLINTA_2ASTEENVASTUU_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_CRUD", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_CRUD", "APP_TIEDONSIIRTO_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.328060821310", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_READ", "APP_SUORITUSREKISTERI_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_LETTER", "APP_ASIAKIRJAPALVELU_CREATE_LETTER_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_READ", "APP_ANOMUSTENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_VALINTAKAYTTAJA", "APP_RAPORTOINTI_VALINTAKAYTTAJA_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_READ", "APP_ASIAKIRJAPALVELU_READ_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_VALINTA", "APP_TIEDONSIIRTO_VALINTA_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_READ", "APP_HAKEMUS_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_READ", "APP_HAKUJENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_READ", "APP_RAPORTOINTI_READ_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_VIEW", "APP_RYHMASAHKOPOSTI_VIEW_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_SEND", "APP_RYHMASAHKOPOSTI_SEND_1.2.246.562.10.328060821310", "APP_SIJOITTELU", "APP_SIJOITTELU_READ_UPDATE", "APP_SIJOITTELU_READ_UPDATE_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_OPO", "APP_RAPORTOINTI_OPO_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_OPO", "APP_HAKEMUS_OPO_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310"]))()
            page.openPage(done);
        })

        it('Vastaanottotieto alasvetovalikko', seqDone(
            wait.forAngular,
            click(sijoitteluntulokset.hyvaksyValintaesitys),
            enabled(sijoitteluntulokset.vastaanottotieto),
            function() {
                assertText(sijoitteluntulokset.vastaanottotietoOption(1), "Kesken");
                assertText(sijoitteluntulokset.vastaanottotietoOption(2), "Vastaanottanut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(3), "Ei vastaanotettu määräaikana");
                assertText(sijoitteluntulokset.vastaanottotietoOption(4), "Perunut");
                expect(sijoitteluntulokset.vastaanottotieto().children().length).to.equal(5);
            }
        ))
    })
})
