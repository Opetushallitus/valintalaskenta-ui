describe('Perustiedot', function() {

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    })

    describe('Perustiedot-taulukko', function () {
        var page = perustiedotPage("1.2.246.562.29.11735171271", "1.2.246.562.20.37731636579");

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
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            addTestHook(valintatulosFixture)()
            addTestHook(commonFixtures())()
            addTestHook(perustiedotFixtures())()
            addTestHook(vastaanottoPostiSentFixture())()

            page.openPage(done);
        });

        it('sisältää kaikki valintatapajonot', seqDone(
            wait.forAngular,
            function () {
                assertText(perustiedotSelectors.valintatapajonoAtIndex(1), "Valintaryhmä I")
            }
        ))

        it('ainoastaan hyväksytyt hakemukset lasketaan mukaan vastaanottaneisiin', seqDone(
            wait.forAngular,
            function () {
                assertText(perustiedotSelectors.hyvaksytytAtIndex(1), "14")
                assertText(perustiedotSelectors.vastaanottaneetAtIndex(1), "0")
            }
        ))
    })
});
