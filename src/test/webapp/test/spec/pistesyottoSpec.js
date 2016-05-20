
describe('Pistesyöttö', function() {
    var page = pistesyottoPage();

    var HAKU = "HAKU1";
    var HAKUKOHDE = "HAKUKOHDE1";
    var VALINTAKOE1 = "VALINTAKOE1";
    var VALINTAKOE2 = "VALINTAKOE2";
    var VALINTAKOE3 = "VALINTAKOE3";
    var HAKEMUS1 = "HAKEMUS1";
    var HAKEMUS2 = "HAKEMUS2";

    beforeEach(function() {
        addTestHook(tarjontaFixtures)();
        addTestHook(koodistoFixtures)();
        addTestHook(listfullFixtures([]))();
        addTestHook(commonFixtures())();
        addTestHook(ohjausparametritFixtures())();
        addTestHook(dokumenttipalveluFixtures)();
        addTestHook(organisaatioFixtures)();
        addTestHook(hakuAppKaksiHenkiloaPisteFixtures)();
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
    });

    afterEach(function() {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Pistesyöttö, kun koetulostentallennus=false', function() {
        beforeEach(function(done) {
            addTestHook(parametritFixtures)();
            page.openPage(done);
            wait.forAngular;
        });
        it('Kenttien muokkaus ei sallittu', seqDone(
            disabled(pistesyottoselectors.formSelectBox)
        ))
        it('Tallenna nappi on disabloitu', seqDone(
            disabled(pistesyottoselectors.tallennaButton)
        ))
    })

    describe('Pistesyöttö, kun koetulostentallennus=true', function() {
        beforeEach(function(done) {
            addTestHook(parametritFixturesWithOverrides({koetulostentallennus: true}))();
            page.openPage(done);
            wait.forAngular;
        });
        it('Kenttien muokkaus ei sallittu', seqDone(
            enabled(pistesyottoselectors.formSelectBox)
        ))
        it('Tallenna nappi on enabloitu', seqDone(
            enabled(pistesyottoselectors.tallennaButton)
        ))
    })
});
