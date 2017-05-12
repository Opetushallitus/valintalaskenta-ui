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
            addTestHook(valintatulosFixture)()
            addTestHook(commonFixtures())()
            addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())()
            page.openPage(done);
        })

        it('sisältää kaikki valintatapajonot', seqDone(
            wait.forAngular,
            function () {
                expect(true).to.equal(true)
                assertText(perustiedotSelectors.valintatapajonoAtIndex(1), "valintatapajono1")
                assertText(perustiedotSelectors.valintatapajonoAtIndex(2), "valintatapajono2")
            }
        ))

        it('ainoastaan hyväksytyt hakemukset lasketaan mukaan vastaanottaneisiin', seqDone(
            wait.forAngular,
            function () {
                expect(true).to.equal(true)
                assertText(perustiedotSelectors.hyvaksytytAtIndex(1), "2")
                assertText(perustiedotSelectors.hyvaksytytAtIndex(2), "0")
                assertText(perustiedotSelectors.vastaanottaneetAtIndex(1), "1")
                assertText(perustiedotSelectors.vastaanottaneetAtIndex(2), "0")
            }
        ))
    })
});
