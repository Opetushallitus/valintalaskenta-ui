describe('Sijoittelun tulokset välilehti', function () {

    var page = sijoitteluntuloksetPage();
    var HAKU = "HAKU1";
    var HAKUKOHDE = "HAKUKOHDE1";
    var VALINTAKOE1 = "VALINTAKOE1";
    var VALINTAKOE2 = "VALINTAKOE2";
    var VALINTAKOE3 = "VALINTAKOE3";
    var HAKEMUS1 = "HAKEMUS1";
    var HAKEMUS2 = "HAKEMUS2";
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
            function () {
                expect(sijoitteluntulokset.tabSheet().length).to.equal(2)
            }
        ))
    })
})