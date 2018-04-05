
describe('Pistesyöttö', function() {
    var page = pistesyottoPage();

    var HAKU = "HAKU1";
    var HAKUKOHDE = "HAKUKOHDE1";
    var VALINTAKOE1 = "VALINTAKOE1";
    var VALINTAKOE2 = "VALINTAKOE2";
    var VALINTAKOE3 = "VALINTAKOE3";
    var HAKEMUS1 = "HAKEMUS1";
    var HAKEMUS2 = "HAKEMUS2";

    var initCommonFixtures = function() {
        addTestHook(tarjontaFixtures)();
        addTestHook(koodistoFixtures)();
        addTestHook(listfullFixtures([]))();
        addTestHook(commonFixtures())();
        addTestHook(ohjausparametritFixtures())();
        addTestHook(dokumenttipalveluFixtures)();
        addTestHook(organisaatioFixtures)();
        addTestHook(koostettuPistetietoGeneroitava(55))();
        //addTestHook(common)();
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
    };

    afterEach(function() {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Pistesyöttö, kun koetulostentallennus=false', function() {
        before(function(done) {
            initCommonFixtures();
            addTestHook(parametritFixtures)();
            wait.forAngular();
            page.openPage(done); //for some reason this doesn't seem to work with phantomjs, hence the call to done below
            wait.forMilliseconds(100);
            done();
        });
        it('Kenttien muokkaus ei sallittu', seqDone(
            disabled(pistesyottoselectors.osallistuminenSelectBox)
        ))
        it('Tallenna nappi on disabloitu', seqDone(
            disabled(pistesyottoselectors.tallennaButton)
        ))
    })

    describe('Pistesyöttö, kun koetulostentallennus=true', function() {
        before(function(done) {
            initCommonFixtures();
            addTestHook(parametritFixturesWithOverrides({koetulostentallennus: true}))();
            page.openPage(done);
            wait.forAngular;
        });
        describe('Ensimmäisellä sivulla', function() {
            it('Kenttien muokkaus on sallittu', seqDone(
                enabled(pistesyottoselectors.osallistuminenSelectBox)
            ))
            it('Tallenna nappi on enabloitu', seqDone(
                enabled(pistesyottoselectors.tallennaButton)
            ))
        });
        describe('Toisella sivulla', function() {
            before(seqDone(
                click(pistesyottoselectors.page2link),
                wait.forAngular
            ));
            describe('Alkutilassa', function() {
                it('Kenttien muokkaus on sallittu', seqDone(
                    enabled(pistesyottoselectors.osallistuminenSelectBox)
                ))
                it('Tallenna nappi on enabloitu', seqDone(
                    enabled(pistesyottoselectors.tallennaButton)
                ))
            });
            describe('Vaihdettaessa osallistuneeksi', function() {
                before(seqDone(
                    select(pistesyottoselectors.osallistuminenSelectBox, "OSALLISTUI"),
                    wait.forAngular
                ))
                describe('Vaihdon jälkeen', function() {
                    it('Pisteitä on mahdollista syöttää', seqDone(
                        enabled(pistesyottoselectors.pistearvoInputBox)
                    ));
                });
                describe('Syötettäessä kirjain pisteeksi', function() {
                    before(seqDone(
                        input(pistesyottoselectors.pistearvoInputBox, "a"),
                        wait.forAngular
                    ))
                    it('Näkyy virhe', function() {
                        assertText(pistesyottoselectors.formError, "Tarkista virheet!")
                    });
                    it('Tallenna nappi on disabloitu', seqDone(
                        disabled(pistesyottoselectors.tallennaButton)
                    ));
                });
                describe('Syötettäessä liian suuri pistearvo', function() {
                    before(seqDone(
                        input(pistesyottoselectors.pistearvoInputBox, "101"),
                        wait.forAngular
                    ))
                    it('Näkyy virhe', function() {
                        assertText(pistesyottoselectors.formError, "Tarkista virheet!")
                    });
                    it('Tallenna nappi on disabloitu', seqDone(
                        disabled(pistesyottoselectors.tallennaButton)
                    ));
                });
                describe('Syötettäessä validi pistearvo', function() {
                    before(seqDone(
                        input(pistesyottoselectors.pistearvoInputBox, "80"),
                        wait.forAngular
                    ))
                    it('Ei näy virhettä', function() {
                        assertText(pistesyottoselectors.formError, "Tarkista virheet!")
                    });
                    it('Tallenna nappi on enabloitu', seqDone(
                        enabled(pistesyottoselectors.tallennaButton)
                    ));
                });
            });
            describe('Vaihdettaessa merkitsemättömäksi', function() {
                before(seqDone(
                    select(pistesyottoselectors.osallistuminenSelectBox, "MERKITSEMATTA"),
                    wait.forAngular
                ))
                describe('Vaihdon jälkeen', function() {
                    it('Pisteitä on mahdollista syöttää', seqDone(
                        enabled(pistesyottoselectors.pistearvoInputBox)
                    ));
                });
                describe('Syötettäessä kirjain pisteeksi', function() {
                    before(seqDone(
                        input(pistesyottoselectors.pistearvoInputBox, "a"),
                        wait.forAngular
                    ))
                    it('Näkyy virhe', function() {
                        assertText(pistesyottoselectors.formError, "Tarkista virheet!")
                    });
                    it('Ei osallistumistieto muutu', function() {
                        assertValue(pistesyottoselectors.osallistuminenSelectBox, "MERKITSEMATTA")
                    });
                    it('Tallenna nappi on disabloitu', seqDone(
                        disabled(pistesyottoselectors.tallennaButton)
                    ));
                });
                describe('Syötettäessä validi pistearvo', function() {
                    before(seqDone(
                        input(pistesyottoselectors.pistearvoInputBox, "80"),
                        wait.forAngular
                    ))
                    it('Näkyy virhe', function() {
                        assertText(pistesyottoselectors.formError, "Tarkista virheet!")
                    });
                    it('Muuttuuu osallistuneeksi', function() {
                        assertValue(pistesyottoselectors.osallistuminenSelectBox, "OSALLISTUI")
                    });
                    it('Tallenna nappi on enabloitu', seqDone(
                        enabled(pistesyottoselectors.tallennaButton)
                    ));
                });
            });
        })
    })
});
