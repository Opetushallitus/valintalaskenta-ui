describe('Hakukohde valinta näkymä', function() {
    var hakuOid = "1.2.246.562.29.11735171271";

    beforeEach(function() {
        addTestHook(parametritFixtures)();
        addTestHook(vastaanottoPostiSentFixture())();
        addTestHook(tarjontaFixtures)();
        addTestHook(organisaatioFixtures)();
        addTestHook(koodistoFixtures)();
        addTestHook(commonFixtures())();
        addTestHook(listfullFixtures([]))();
        addTestHook(sijoitteluAjoFixtures)();
        addTestHook(perustiedotFixtures())();
        addTestHook(koostettuPistetietoGeneroitava(3))();
        addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())();
        addTestHook(valintakokeetFixtures([
            {
                valintakoeOid: "VALINTAKOE1"
            }
        ]))();
    });

    describe('Hakukohdelista', function() {
        var page = hakukohdePage(hakuOid);

        beforeEach(function (done) {
            page.openPage(done);
        });

        afterEach(function () {
            if (this.currentTest.state == 'failed') {
                takeScreenshot();
            }
        });

        it('näyttää kaksi hakukohdetta', seqDone(
            wait.forAngular,
            function() {
                expect(hakukohde.title().html()).to.contain("Valintojen toteuttaminen");
                expect(hakukohde.hakukohdeToolbar().length).to.equal(1);
                expect(page.hakukohdeCount()).to.equal(2);
            }
        ));

        describe('Kun valitaan hakukohde, jolla on hakukohde_viite-rivi', function () {
            it('näyttää "Valintakoekutsut" välilehden', seqDone(
                wait.forAngular,
                click(hakukohde.hakukohdeItem(0)),
                visible(hakukohde.hakukohdeNav),
                function () {
                    expect(hakukohde.valintakoekutsutTab().length).to.equal(1);
                    expect(hakukohde.pistesyottoTab().length).to.equal(1);
                }
            ));
        });

        describe('Kun valitaan hakukohde, jolla ei ole hakukohde_viite-riviä', function () {
            it('ei näytä "Valintakoekutsut" välilehden', seqDone(
                wait.forAngular,
                click(hakukohde.hakukohdeItem(1)),
                visible(hakukohde.hakukohdeNav),
                function () {
                    expect(hakukohde.valintakoekutsutTab().length).to.equal(0);
                    expect(hakukohde.pistesyottoTab().length).to.equal(1);
                }
            ));
        });
    });

    describe('Suora linkki Valintakoekutsut-välilehteen', function () {

        describe('Jos hakukohteella on hakukohde_viite-rivi', function() {
            var hakukohdeOid = "1.2.246.562.20.25463238029";
            var page = hakukohdeValintakoekutsutTabPage(hakuOid, hakukohdeOid);

            beforeEach(function(done) {
                page.openPage(done);
            });

            it('avaa Valintakoekutsut välihehden', seqDone(
                wait.forAngular,
                function () {
                    expect(page.isOnValintakoekutsutTab()).to.equal(true);
                    expect(hakukohde.valintakoekutsutTab().length).to.equal(1);
                }
            ));
        });

        describe('Jos hakukohteella ei ole hakukohde_viite-riviä', function() {
            var hakukohdeNoViiteOid = "HAKUKOHDE_OID_NO_VIITE_YES_SYOTTO";
            var page = hakukohdeValintakoekutsutTabPage(hakuOid, hakukohdeNoViiteOid);

            beforeEach(function(done) {
                page.openPage(done);
            });

            it('redirect "Hakukohteen perustiedot" välilehteen', seqDone(
                wait.forAngular,
                function() {
                    expect(page.isOnHakukohteenPerustiedotTab()).to.equal(true);
                    expect(hakukohde.valintakoekutsutTab().length).to.equal(0);
                }
            ));
        });
    });
});

