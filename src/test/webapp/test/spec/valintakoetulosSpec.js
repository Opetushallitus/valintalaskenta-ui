function asyncPrint(s) {
    return function () {
        console.log(s)
    }
}

describe('Valintakoetulos', function() {
    var page = valintakoetulosPage();
    var HAKU = "HAKU1";
    var HAKUKOHDE = "HAKUKOHDE1";
    var VALINTAKOE1 = "VALINTAKOE1";
    var VALINTAKOE2 = "VALINTAKOE2";
    var VALINTAKOE3 = "VALINTAKOE3";
    var HAKEMUS1 = "HAKEMUS1";
    var HAKEMUS2 = "HAKEMUS2";
    beforeEach(function(done) {
        addTestHook(tarjontaFixtures)();
        addTestHook(koodistoFixtures)();
        addTestHook(parametritFixtures)();
        addTestHook(valintakokeetFixtures([
            {
                valintakoeOid: VALINTAKOE1
            },
            {
                valintakoeOid: VALINTAKOE2
            },
            {
                valintakoeOid: VALINTAKOE3,
                kutsutaankoKaikki: true
            }]))();
        addTestHook(valintalaskentaValintakokeetFixtures([
            {
                hakuOid: HAKU,
                hakukohdeOid: HAKUKOHDE,
                valintakoeOid: VALINTAKOE1,
                hakemusOid: HAKEMUS1
            },
            {
                hakuOid: HAKU,
                hakukohdeOid: HAKUKOHDE,
                valintakoeOid: VALINTAKOE2,
                hakemusOid: HAKEMUS2
            }]))();
        addTestHook(listfullFixtures([]))();
        addTestHook(hakemusByOidsFixtures([
            {
                hakemusOid: HAKEMUS1,
                etunimi: "Erkki",
                sukunimi: "Hakija1"
            },
            {
                hakemusOid: HAKEMUS2,
                etunimi: "Elli",
                sukunimi: "Hakija2"
            }]))();
        page.openPage(done);
    });

    afterEach(function() {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Hakukohteen ulkopuolinen hakija', function() {
        it('Hakija1 valintakokeessa VALINTAKOE1', seqDone(
            wait.forAngular,
            function() {
                expect(page.findNthHakijaWithPanelTitle(1, VALINTAKOE1)).to.contain('Hakija1');
            }
        ))
        it('Hakija2 valintakokeessa VALINTAKOE2', seqDone(
            wait.forAngular,
            function() {
                expect(page.findNthHakijaWithPanelTitle(1, VALINTAKOE2)).to.contain('Hakija2');
            }
        ))
        it('Hakijat näkyy hakijoittain näkymässä ja kutsutaan oikeisiin valintakokeisiin', seqDone(
            wait.forAngular,
            select(page.nakymaDropDown, "Hakijoittain"),
            //wait.forAngular,
            function() {
                expect(page.findNthHakija(0).find("td:nth(0) a").text().trim()).to.contain('Hakija1');
                expect(page.findNthHakija(1).find("td:nth(0) a").text().trim()).to.contain('Hakija2');
                expect(page.findNthHakija(0).find("td:nth(1)").text().trim()).to.contain('Kutsutaan');
                expect(page.findNthHakija(1).find("td:nth(2)").text().trim()).to.contain('Kutsutaan');
            }
        ))
    })
});