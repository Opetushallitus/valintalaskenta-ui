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
            page.openPage(done);
        })

        afterEach(function () {
            if (this.currentTest.state == 'failed') {
                takeScreenshot()
            }
        })

        it('sijoittelu kesken', seqDone(
            wait.forAngular(),
            expect(true).to.equal(true)
        ))
    })
})