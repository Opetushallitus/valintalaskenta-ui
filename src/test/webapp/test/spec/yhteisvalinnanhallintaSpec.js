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
        addTestHook(kirjeFixtures)()
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
        it('sisältää haun tiedot', function () {
            assertText(yhteisvalinnanHallintaSelectors.haunNimi, "valintatulokset-sijoitteluun haku")
        })
    })

    describe('Kirjeet ja sijoittelun tulokset osio', function () {
        before(seqDone(
            click(yhteisvalinnanHallintaSelectors.kirjeetOsionAvaus),
            wait.forAngular,
            click(yhteisvalinnanHallintaSelectors.paivitaKirjeidenTilanne),
            wait.forAngular
        ))
        it('näyttää kuudelle eri lähetyserälle valmiiden määrän', function () {
          expect(yhteisvalinnanHallintaSelectors.valmiitTulosKirjeet().length).to.equal(6)
        })
        it('sisältää linkin viestintäpalveluun', function () {
            assertText(yhteisvalinnanHallintaSelectors.hyvaksymisKirjeetFiLinkki, "264")
        })
        it('sisältää linkin sähköpostin esikatseluun', function () {
          assertText(yhteisvalinnanHallintaSelectors.ePostiFiLinkki, "Esikatsele")
        })
        it('sisältää linkin sähköpostin lähetysraporttiin', function () {
            assertText(yhteisvalinnanHallintaSelectors.groupEmailFiLinkki, "1245")
        })
    })
});
