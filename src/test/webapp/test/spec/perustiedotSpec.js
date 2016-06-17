describe('Perustiedot', function() {

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    })

    describe('Vastaanottaneiden lukumäärä', function () {
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
            page.openPage(done);
        })

        it('kun yksi valintatapajono', seqDone(
            wait.forAngular,
            function () {
                expect(true).to.equal(true)
                assertText(perustiedotSelectors.vastaanottaneetAtIndex(1), "1")
            }
        ))
    })
});