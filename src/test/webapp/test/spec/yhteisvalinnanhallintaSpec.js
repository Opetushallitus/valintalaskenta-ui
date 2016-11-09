describe('Yhteisvalinnan hallinta', function() {
    var page = yhteisvalinnanHallintaPage("1.2.246.562.29.11735171271");

    before(function (done) {
        addTestHook(tarjontaFixtures)()
        addTestHook(parametritFixtures)()
        addTestHook(koodistoFixtures)()
        addTestHook(sijoitteluAjoFixtures)()
        addTestHook(ohjausparametritFixtures())()
        addTestHook(dokumenttipalveluFixtures)()
        addTestHook(organisaatioFixtures)()
        addTestHook(commonFixtures())()
        page.openPage(done)
        wait.forAngular
    })

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    })

    describe('Haun tiedot osio', function () {
        before(seqDone(
            click(yhteisvalinnanHallintaSelectors.haunTiedotOsionAvaus),
            wait.forAngular
        ))
        it('sisältää haun tiedot', seqDone(
            function () {
                assertText(yhteisvalinnanHallintaSelectors.haunNimi, "valintatulokset-sijoitteluun haku")
            }
        ))
    })
});
