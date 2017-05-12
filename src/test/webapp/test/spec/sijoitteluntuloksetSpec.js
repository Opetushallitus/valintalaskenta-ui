describe('Sijoittelun tulokset välilehti', function () {
    var commonFixturesEiOphOikeuksia = ["USER_lktesti", "VIRKAILIJA", "LANG_fi", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_CRUD", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_EPERUSTEET", "APP_EPERUSTEET_READ", "APP_EPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_2ASTEENVASTUU", "APP_HENKILONHALLINTA_2ASTEENVASTUU_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_CRUD", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_CRUD", "APP_TIEDONSIIRTO_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.328060821310", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_READ", "APP_SUORITUSREKISTERI_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_LETTER", "APP_ASIAKIRJAPALVELU_CREATE_LETTER_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_READ", "APP_ANOMUSTENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_VALINTAKAYTTAJA", "APP_RAPORTOINTI_VALINTAKAYTTAJA_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_READ", "APP_ASIAKIRJAPALVELU_READ_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_VALINTA", "APP_TIEDONSIIRTO_VALINTA_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_READ", "APP_HAKEMUS_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_READ", "APP_HAKUJENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_READ", "APP_RAPORTOINTI_READ_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_VIEW", "APP_RYHMASAHKOPOSTI_VIEW_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_SEND", "APP_RYHMASAHKOPOSTI_SEND_1.2.246.562.10.328060821310", "APP_SIJOITTELU", "APP_SIJOITTELU_READ_UPDATE", "APP_SIJOITTELU_READ_UPDATE_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_OPO", "APP_RAPORTOINTI_OPO_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_OPO", "APP_HAKEMUS_OPO_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310"]
    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    })

    describe('Opiskelijan valintatulokset, kun valinta on kesken', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.11735171271", "1.2.246.562.20.37731636579");
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde37731636579)()
            addTestHook(httpFixtures().hakukohde37731636579Tila)()
            addTestHook(valintatulosFixture)()
            addTestHook(commonFixtures())()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        describe('avattaessa Iiris Vitsijärven tulokset', function () {
            before(seqDone(
                wait.forAngular,
                click(sijoitteluntulokset.iirisHenkilotiedot),
                visible(sijoitteluntulokset.modaali)
            ))
            it('näkyy, että sijoittelu kesken', function() {
                expect(sijoitteluntulokset.koulunNimi().is(':visible')).to.equal(true)
                assertText(sijoitteluntulokset.valintatilanne, "Kesken")
                assertText(sijoitteluntulokset.valintatulosTableIndex(1, 1), "Aalto-yliopisto, Insinööritieteiden korkeakoulu")
                assertText(sijoitteluntulokset.valintatulosTableIndex(1, 2), "Energia- ja LVI-tekniikka, diplomi-insinööri KOULUTUS")
                assertText(sijoitteluntulokset.valintatulosTableIndex(2, 1), "Aalto-yliopisto, Insinööritieteiden korkeakoulu")
                assertText(sijoitteluntulokset.valintatulosTableIndex(2, 2), "Tietotekniikka, diplomi-insinööri KOULUTUS")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(1), "Opiskelupaikka vastaanotettu")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(2), "Et ottanut opiskelupaikkaa vastaan määräaikaan mennessä")
            })
        })
    })

    describe('Opiskelijan valintatulokset, kun valinta on lopullinen', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.11735171271", "1.2.246.562.11.00000000220");
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde00000000220)()
            addTestHook(httpFixtures().hakukohde00000000220Tila)()
            addTestHook(valintatulosFixture)()
            addTestHook(commonFixtures())()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('julkaistavissa-täppä on enabloitu', function() {
            enabled(sijoitteluntulokset.julkaistavissa(2))
        })

        describe('avattaessa Teppo Testaajan tulokset', function () {
            before(seqDone(
                wait.forAngular,
                click(sijoitteluntulokset.teppoHenkilotiedot),
                visible(sijoitteluntulokset.modaali)
            ))
            it('näkyy, että sijoittelu on lopullinen', function() {
                expect(sijoitteluntulokset.koulunNimi().is(':visible')).to.equal(true)
                assertText(sijoitteluntulokset.valintatilanne, "Lopullinen")
                assertText(sijoitteluntulokset.valintatulosTableIndex(1, 1), "Aalto-yliopisto, Insinööritieteiden korkeakoulu")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(1), "Hyväksytty")
                assertText(sijoitteluntulokset.valintatulosTilaIndex(2), "Peruuntunut")
            })
        })

        describe('vastaanottotilaa muutettaessa', function () {
            before(seqDone(
                wait.forAngular,
                click(sijoitteluntulokset.julkaistavissa(2)),
                select(sijoitteluntulokset.vastaanottoDropdown(2), "string:VASTAANOTTANUT_SITOVASTI")
            ))
            it('julkaistavissa-täppä muuttuu disabloiduksi', function() {
                disabled(sijoitteluntulokset.julkaistavissa(2))
            })
        })
    })

    describe('Sijoittelun tulokset -välilehdellä Kk haussa OPH oikeuksilla', function () {
        var HAKU = "1.2.246.562.29.95390561488";
        var HAKUKOHDE = "1.2.246.562.20.44161747595";
        var page = sijoitteluntuloksetPage(HAKU, HAKUKOHDE);
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde44161747595)()
            addTestHook(httpFixtures().hakukohde44161747595Tila)()
            addTestHook(commonFixtures())()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('Vastaanottotieto alasvetovalikko', seqDone(
            wait.forAngular,
            enabled(sijoitteluntulokset.vastaanottotieto),
            function() {
                assertText(sijoitteluntulokset.vastaanottotietoOption(0), "Kesken");
                assertText(sijoitteluntulokset.vastaanottotietoOption(1), "Ehdollisesti vastaanottanut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(2), "Vastaanottanut sitovasti");
                assertText(sijoitteluntulokset.vastaanottotietoOption(3), "Ei vastaanotettu määräaikana");
                assertText(sijoitteluntulokset.vastaanottotietoOption(4), "Perunut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(5), "Peruutettu");
                assertText(sijoitteluntulokset.vastaanottotietoOption(6), "Ottanut vastaan toisen paikan");
                expect(sijoitteluntulokset.vastaanottotieto().children().length).to.equal(7);
            }
        ))

        it('Valintaesitys on hyväksyttävissä', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.hyvaksyValintaesitys, '[class~="disabled"]', false)
        ))
        it('Jälkiohjaus nappi is visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, ':visible', true)
        ))
        it('Tulostus buttons are enabled', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, '.disabled', false),
            waitJqueryIs(sijoitteluntulokset.luoHyvaksymiskirjeet, '[class~="disabled"]', false),
            waitJqueryIs(sijoitteluntulokset.createHyvaksymisosoitteet, '[class~="disabled"]', false)
        ))
        it('Ehdollinen valinta is visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.ehdollinenValinta, ':visible', true)
        ))
    })

    describe('Sijoittelun tulokset -välilehdellä Kk haussa ilman OPH oikeuksia', function () {
        var HAKU = "1.2.246.562.29.95390561488";
        var HAKUKOHDE = "1.2.246.562.20.44161747595";
        var page = sijoitteluntuloksetPage(HAKU, HAKUKOHDE);
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde44161747595)()
            addTestHook(httpFixtures().hakukohde44161747595Tila)()
            addTestHook(commonFixtures(commonFixturesEiOphOikeuksia))()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('Jälkiohjaus nappi is visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, ':visible', true)
        ))
        it('Tulostus buttons are enabled', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, '.disabled', false),
            waitJqueryIs(sijoitteluntulokset.luoHyvaksymiskirjeet, '[class~="disabled"]', false),
            waitJqueryIs(sijoitteluntulokset.createHyvaksymisosoitteet, '[class~="disabled"]', false)
        ))
        it('Ehdollinen valinta is visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.ehdollinenValinta, ':visible', true)
        ))
    })

    describe('Sijoittelun tulokset -välilehti 2. asteen haussa OPH oikeuksilla', function () {
        var HAKU = "1.2.246.562.29.90697286251";
        var HAKUKOHDE = "1.2.246.562.20.18097797874";
        var page = sijoitteluntuloksetPage(HAKU, HAKUKOHDE);
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde18097797874)()
            addTestHook(httpFixtures().hakukohde18097797874Tila)()
            addTestHook(commonFixtures())()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('Vastaanottotieto alasvetovalikko', seqDone(
            wait.forAngular,
            enabled(sijoitteluntulokset.vastaanottotieto),
            function() {
                assertText(sijoitteluntulokset.vastaanottotietoOption(0), "Kesken");
                assertText(sijoitteluntulokset.vastaanottotietoOption(1), "Vastaanottanut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(2), "Ei vastaanotettu määräaikana");
                assertText(sijoitteluntulokset.vastaanottotietoOption(3), "Perunut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(4), "Peruutettu");
                expect(sijoitteluntulokset.vastaanottotieto().children().length).to.equal(5);
            }
        ))

        it('Valintaesitys on hyväksyttävissä', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.hyvaksyValintaesitys, '[class~="disabled"]', false)
        ))
        it('Jälkiohjaus nappi is visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, ':visible', true)
        ))
        it('Tulostus buttons are enabled', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, '[class~="disabled"]', false),
            waitJqueryIs(sijoitteluntulokset.luoHyvaksymiskirjeet, '[class~="disabled"]', false),
            waitJqueryIs(sijoitteluntulokset.createHyvaksymisosoitteet, '[class~="disabled"]', false)
        ))
        it('Ehdollinen valinta is not visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.ehdollinenValinta, ':visible', false)
        ))
    })

    describe('Sijoittelun tulokset -välilehti 2. asteen haussa ilman OPH oikeuksia, kun valintaesitys ei vielä hyväksyttävissä', function () {
        var HAKU = "1.2.246.562.29.90697286251";
        var HAKUKOHDE = "1.2.246.562.20.18097797874";
        var page = sijoitteluntuloksetPage(HAKU, HAKUKOHDE);
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde18097797874)()
            addTestHook(httpFixtures().hakukohde18097797874Tila)()
            addTestHook(commonFixtures(commonFixturesEiOphOikeuksia))()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('Valintaesitys ei vielä hyväksyttävissä', seqDone(
            wait.forAngular,
            disabled(sijoitteluntulokset.hyvaksyValintaesitys))
        )
        it('Jälkiohjaus nappi is not visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, ':visible', false)
        ))
        it('Tulostus buttons are disabled', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, '.disabled', true),
            waitJqueryIs(sijoitteluntulokset.luoHyvaksymiskirjeet, '[class~="disabled"]', true),
            waitJqueryIs(sijoitteluntulokset.createHyvaksymisosoitteet, '[class~="disabled"]', true)
        ))
        it('Ehdollinen valinta is not visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.ehdollinenValinta, ':visible', false)
        ))
    })

    describe('Sijoittelun tulokset -välilehti 2. asteen haussa ilman OPH oikeuksia, kun valintaesitys hyväksyttävissä', function () {
        var HAKU = "1.2.246.562.29.90697286251";
        var HAKUKOHDE = "1.2.246.562.20.18097797874";
        var page = sijoitteluntuloksetPage(HAKU, HAKUKOHDE);
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures((new Date()).getTime() - 1000))()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde18097797874)()
            addTestHook(httpFixtures().hakukohde18097797874Tila)()
            addTestHook(commonFixtures(["USER_lktesti", "VIRKAILIJA", "LANG_fi", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_CRUD", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_EPERUSTEET", "APP_EPERUSTEET_READ", "APP_EPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_2ASTEENVASTUU", "APP_HENKILONHALLINTA_2ASTEENVASTUU_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_CRUD", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_CRUD", "APP_TIEDONSIIRTO_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.328060821310", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_READ", "APP_SUORITUSREKISTERI_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_LETTER", "APP_ASIAKIRJAPALVELU_CREATE_LETTER_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_READ", "APP_ANOMUSTENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_VALINTAKAYTTAJA", "APP_RAPORTOINTI_VALINTAKAYTTAJA_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_READ", "APP_ASIAKIRJAPALVELU_READ_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_VALINTA", "APP_TIEDONSIIRTO_VALINTA_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_READ", "APP_HAKEMUS_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_READ", "APP_HAKUJENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_READ", "APP_RAPORTOINTI_READ_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_VIEW", "APP_RYHMASAHKOPOSTI_VIEW_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_SEND", "APP_RYHMASAHKOPOSTI_SEND_1.2.246.562.10.328060821310", "APP_SIJOITTELU", "APP_SIJOITTELU_READ_UPDATE", "APP_SIJOITTELU_READ_UPDATE_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_OPO", "APP_RAPORTOINTI_OPO_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_OPO", "APP_HAKEMUS_OPO_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310"]))()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('Vastaanottotieto alasvetovalikko', seqDone(
            enabled(sijoitteluntulokset.vastaanottotieto),
            function() {
                assertText(sijoitteluntulokset.vastaanottotietoOption(0), "Kesken");
                assertText(sijoitteluntulokset.vastaanottotietoOption(1), "Vastaanottanut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(2), "Ei vastaanotettu määräaikana");
                assertText(sijoitteluntulokset.vastaanottotietoOption(3), "Perunut");
                expect(sijoitteluntulokset.vastaanottotieto().children().length).to.equal(4);
            }
        ))
        it('Valintaesitys on hyväksyttävissä', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.hyvaksyValintaesitys, '[class~="disabled"]', false)
        ))
        it('Jälkiohjaus nappi is not visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, ':visible', false)
        ))
        it('Tulostus buttons are disabled', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, '.disabled', true),
            waitJqueryIs(sijoitteluntulokset.luoHyvaksymiskirjeet, '[class~="disabled"]', true),
            waitJqueryIs(sijoitteluntulokset.createHyvaksymisosoitteet, '[class~="disabled"]', true)
        ))
    })

    describe('Sijoittelun tulokset -välilehti 2. asteen haussa ilman OPH oikeuksia, kun valintaesitys hyväksytty', function () {
        var HAKU = "1.2.246.562.29.90697286251";
        var HAKUKOHDE = "1.2.246.562.20.18097797874";
        var page = sijoitteluntuloksetPage(HAKU, HAKUKOHDE);
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixturesWithValintaesitysHyvaksytty)()
            addTestHook(ohjausparametritFixtures((new Date()).getTime() - 1000))()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde18097797874)()
            addTestHook(httpFixtures().hakukohde18097797874Tila)()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            addTestHook(commonFixtures(["USER_lktesti", "VIRKAILIJA", "LANG_fi", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_CRUD", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_EPERUSTEET", "APP_EPERUSTEET_READ", "APP_EPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_2ASTEENVASTUU", "APP_HENKILONHALLINTA_2ASTEENVASTUU_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_CRUD", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_CRUD", "APP_TIEDONSIIRTO_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.328060821310", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_READ", "APP_SUORITUSREKISTERI_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_LETTER", "APP_ASIAKIRJAPALVELU_CREATE_LETTER_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_READ", "APP_ANOMUSTENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_VALINTAKAYTTAJA", "APP_RAPORTOINTI_VALINTAKAYTTAJA_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_READ", "APP_ASIAKIRJAPALVELU_READ_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_VALINTA", "APP_TIEDONSIIRTO_VALINTA_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_READ", "APP_HAKEMUS_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_READ", "APP_HAKUJENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_READ", "APP_RAPORTOINTI_READ_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_VIEW", "APP_RYHMASAHKOPOSTI_VIEW_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_SEND", "APP_RYHMASAHKOPOSTI_SEND_1.2.246.562.10.328060821310", "APP_SIJOITTELU", "APP_SIJOITTELU_READ_UPDATE", "APP_SIJOITTELU_READ_UPDATE_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_OPO", "APP_RAPORTOINTI_OPO_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_OPO", "APP_HAKEMUS_OPO_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310"]))()
            page.openPage(done);
        })

        it('Vastaanottotieto alasvetovalikko', seqDone(
            enabled(sijoitteluntulokset.vastaanottotieto),
            function() {
                assertText(sijoitteluntulokset.vastaanottotietoOption(0), "Kesken");
                assertText(sijoitteluntulokset.vastaanottotietoOption(1), "Vastaanottanut");
                assertText(sijoitteluntulokset.vastaanottotietoOption(2), "Ei vastaanotettu määräaikana");
                assertText(sijoitteluntulokset.vastaanottotietoOption(3), "Perunut");
                expect(sijoitteluntulokset.vastaanottotieto().children().length).to.equal(4);
            }
        ))
        it('Valintaesitys on hyväksyttävissä', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.hyvaksyValintaesitys, '[class~="disabled"]', false)
        ))
        it('Jälkiohjaus nappi is not visible', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, ':visible', false)
        ))
        it('Tulostus buttons are enabled', seqDone(
            wait.forAngular,
            waitJqueryIs(sijoitteluntulokset.jalkiohjaus, '.disabled', false),
            waitJqueryIs(sijoitteluntulokset.luoHyvaksymiskirjeet, '[class~="disabled"]', false),
            waitJqueryIs(sijoitteluntulokset.createHyvaksymisosoitteet, '[class~="disabled"]', false)
        ))
    })

    describe('Hakemuksen tila sijoittelun tulokset -välilehdellä PERUUNTUNUT jos käyttäjällä PERUUNTUNEIDEN_HYVAKSYNTA oikeus', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.90697286251", "1.2.246.562.20.18097797874");
        beforeEach(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde18097797874)()
            addTestHook(httpFixtures().hakukohde18097797874Tila)()
            addTestHook(commonFixtures())()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        var jonoOid = "1427374494574-2003796769000462860";
        var hakemusOid = "1.2.246.562.11.00002380171";
        it('voidaan hyväksyä', seqDone(
            wait.forAngular,
            visible(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            unchecked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            click(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            checked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            expectPost(
                /.*resources\/proxy\/valintatulosservice\/haku\/1\.2\.246\.562\.29\.90697286251\/hakukohde\/1\.2\.246\.562\.20\.18097797874\?selite=.*/,
               seq(
                    click(sijoitteluntulokset.tallenna),
                    click(sijoitteluntulokset.tallennaOk)
               )
            ),
            function(data) {
                expect(JSON.parse(data)[0].hyvaksyPeruuntunut).to.be.true
            }
        ))

        hakemusOid = "1.2.246.562.11.00002071778";
        it('hyväksyntä voidaan poistaa', seqDone(
            wait.forAngular,
            visible(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            checked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            click(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            unchecked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            expectPost(
                /.*resources\/proxy\/valintatulosservice\/haku\/1\.2\.246\.562\.29\.90697286251\/hakukohde\/1\.2\.246\.562\.20\.18097797874\?selite=.*/,
               seq(
                    click(sijoitteluntulokset.tallenna),
                    click(sijoitteluntulokset.tallennaOk)
               )
            ),
            function(data) {
                expect(JSON.parse(data)[0].hyvaksyPeruuntunut).to.be.false
            }
        ))

        hakemusOid = "1.2.246.562.11.00001941430";
        it('hyväksytyltä voidaan poistaa hyväksyntä', seqDone(
            wait.forAngular,
            visible(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            checked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            click(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            unchecked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            expectPost(
                /.*resources\/proxy\/valintatulosservice\/haku\/1\.2\.246\.562\.29\.90697286251\/hakukohde\/1\.2\.246\.562\.20\.18097797874\?selite=.*/,
               seq(
                    click(sijoitteluntulokset.tallenna),
                    click(sijoitteluntulokset.tallennaOk)
               )
            ),
            function(data) {
                expect(JSON.parse(data)[0].hyvaksyPeruuntunut).to.be.false
            }
        ))

        hakemusOid = "1.2.246.562.11.00002071778";
        it('estä Hyväksy peruuntunut muuttaminen jos julkaistavissa', seqDone(
            wait.forAngular,
            visible(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            checked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid)),
            click(sijoitteluntulokset.julkaistavissa(4)),
            disabled(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, hakemusOid))
        ))
    })

    describe('Hakemuksen tila sijoittelun tulokset -välilehdellä PERUUNTUNUT ilman PERUUNTUNEIDEN_HYVAKSYNTA oikeutta', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.90697286251", "1.2.246.562.20.18097797874");
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde18097797874)()
            addTestHook(httpFixtures().hakukohde18097797874Tila)()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            addTestHook(commonFixtures(["USER_lktesti", "VIRKAILIJA", "LANG_fi", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_CRUD", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_EPERUSTEET", "APP_EPERUSTEET_READ", "APP_EPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_2ASTEENVASTUU", "APP_HENKILONHALLINTA_2ASTEENVASTUU_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_CRUD", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_CRUD", "APP_TIEDONSIIRTO_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.328060821310", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_READ", "APP_SUORITUSREKISTERI_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI", "APP_VALINTOJENTOTEUTTAMINEN_TULOSTENTUONTI_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_LETTER", "APP_ASIAKIRJAPALVELU_CREATE_LETTER_1.2.246.562.10.328060821310", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_READ", "APP_ANOMUSTENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_VALINTAKAYTTAJA", "APP_RAPORTOINTI_VALINTAKAYTTAJA_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_READ", "APP_ASIAKIRJAPALVELU_READ_1.2.246.562.10.328060821310", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_VALINTA", "APP_TIEDONSIIRTO_VALINTA_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_READ", "APP_HAKEMUS_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_READ", "APP_HAKUJENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_READ", "APP_RAPORTOINTI_READ_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_VIEW", "APP_RYHMASAHKOPOSTI_VIEW_1.2.246.562.10.328060821310", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_SEND", "APP_RYHMASAHKOPOSTI_SEND_1.2.246.562.10.328060821310", "APP_SIJOITTELU", "APP_SIJOITTELU_READ_UPDATE", "APP_SIJOITTELU_READ_UPDATE_1.2.246.562.10.328060821310", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.328060821310", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.328060821310", "APP_RAPORTOINTI", "APP_RAPORTOINTI_OPO", "APP_RAPORTOINTI_OPO_1.2.246.562.10.328060821310", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.328060821310", "APP_TARJONTA", "APP_TARJONTA_READ", "APP_TARJONTA_READ_1.2.246.562.10.328060821310", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.328060821310", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.328060821310", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.328060821310", "APP_HAKEMUS", "APP_HAKEMUS_OPO", "APP_HAKEMUS_OPO_1.2.246.562.10.328060821310", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.328060821310"]))()
            page.openPage(done);
        })

        var jonoOid = "1427374494574-2003796769000462860";
        it('Hyväksy peruuntunut näkyy, mutta sitä ei voi muuttaa', seqDone(
            wait.forAngular,
            visible(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, "1.2.246.562.11.00001941430")),
            checked(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, "1.2.246.562.11.00001941430")),
            disabled(sijoitteluntulokset.hyvaksyPeruuntunut(jonoOid, "1.2.246.562.11.00001941430"))
        ))
    })

    describe('Hyväksymiskirjeen lähettämisen tieto, kun kirjettä ei ole lähetetty aiemmin', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.11735171271", "1.2.246.562.20.37731636579");
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde37731636579)()
            addTestHook(httpFixtures().hakukohde37731636579Tila)()
            addTestHook(valintatulosFixture)()
            addTestHook(commonFixtures())()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('Hyväksymiskirje lähetetty on täpättävissä ja näkyvissä', seqDone(
            wait.forAngular,
            click(sijoitteluntulokset.hyvaksymiskirjeLahetettyCheckbox(1)),
            function () {
                assertText(sijoitteluntulokset.hyvaksymiskirjeLahetettyTextAtIndex(1), "Hyväksymiskirje lähetetty:")
            }
        ))
    })

    describe('Hyväksymiskirjeen lähettämisen tieto, kun kirje on lähetetty aiemmin', function () {
        var page = sijoitteluntuloksetPage("1.2.246.562.29.11735171271", "1.2.246.562.11.00000000220");
        before(function (done) {
            addTestHook(tarjontaFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(parametritFixtures)()
            addTestHook(koodistoFixtures)()
            addTestHook(sijoitteluAjoFixtures)()
            addTestHook(ohjausparametritFixtures())()
            addTestHook(dokumenttipalveluFixtures)()
            addTestHook(organisaatioFixtures)()
            addTestHook(httpFixtures().hakukohteenAvaimet)()
            addTestHook(httpFixtures().hakukohde00000000220)()
            addTestHook(httpFixtures().hakukohde00000000220Tila)()
            addTestHook(valintatulosFixture)()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            addTestHook(commonFixtures())()
            page.openPage(done);
        })

        it('Hyväksymiskirje lähetetty on täpättävissä ja näkyvissä ja lähetyspäivämäärä on näkyvillä', seqDone(
            wait.forAngular,
            function () {
                assertText(sijoitteluntulokset.hyvaksymiskirjeLahetettyTextAtIndex(1), "Hyväksymiskirje lähetetty:")
                assertText(sijoitteluntulokset.hyvaksymiskirjeLahetettyPvm(1), "21.07.2015")
            }
        ))
    })
})
