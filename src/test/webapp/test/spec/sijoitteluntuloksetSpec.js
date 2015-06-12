describe('Sijoittelun tulokset välilehti', function () {
    var page = sijoitteluntuloksetPage();
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
        page.openPage(done);
    })

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    })

    describe('Opiskelijan valinta tulokset sijoittelu välilehdellä', function () {
        it('sijoittelu', seqDone(
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
            }
        ))
    })
})