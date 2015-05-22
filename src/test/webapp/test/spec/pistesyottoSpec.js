
describe('Pistesyöttö', function() {
    var page = pistesyottoPage();

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
        addTestHook(listfullFixtures([]))();
        addTestHook(avaimetFixtures)();
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
        page.openPage(done)
    });

    afterEach(function() {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Pistesyöttö', function() {
        /*
        it('tallentaa yksittäisen hakijan pisteet', seqDone(
            wait.forAngular,
            function() {
                expect(page.allStudentsTable().length).to.equal(1)
            }
        ))
        */
    })
});