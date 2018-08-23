describe('Hakukohde valinta näkymä', function() {
    var hakuOid = "1.2.246.562.29.11735171271";
    var hakukohdeOid = "1.2.246.562.20.25463238029";
    var page = hakukohdePage(hakuOid);

    beforeEach(function (done) {
        addTestHook(parametritFixtures)();
        addTestHook(tarjontaFixtures)();
        addTestHook(organisaatioFixtures)();
        addTestHook(koodistoFixtures)();
        addTestHook(commonFixtures())();
        addTestHook(listfullFixtures([]))();
        addTestHook(sijoitteluAjoFixtures)();
        addTestHook(perustiedotFixtures())();
        addTestHook(hakuAppEligibilitiesByHakuOidAndHakukohdeOidFixtures())();
        addTestHook(valintakokeetFixtures([
            {
                valintakoeOid: hakukohdeOid
            }]))();
        page.openPage(done);
    });

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot();
        }
    });

    describe('Kun paina hakukohten jolla ei ole hakukohde_viite rivia', function () {
        it('ei näyttää "Valintakoekutsut" välilehden', seqDone(
            wait.forAngular,
//            click(hakukohde.hakukohdeToolbarToggle), // for some reason, it's already expanded
            visible(hakukohde.hakukohdeItem(0)),
            click(hakukohde.hakukohdeItem(0)),
            visible(hakukohde.hakukohdeNav),
            function () {
                expect(hakukohde.title().html()).to.contain("Valintojen toteuttaminen");
                expect(hakukohde.hakukohdeToolbar().length).to.equal(1);
                expect(page.hakukohdeCount()).to.equal(1);
                expect(hakukohde.valintakoekutsutTab().length).to.equal(0);
            }
        ));
    });

});
