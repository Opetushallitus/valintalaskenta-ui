describe('Hakukohde valinta näkymä', function() {
    var hakuOid = "1.2.246.562.29.11735171271";
    var page = hakukohdePage(hakuOid);

    beforeEach(function (done) {
        addTestHook(parametritFixtures)();
        addTestHook(commonFixtures())();
        page.openPage(done);
    });

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Kun paina hakukohten jolla ei ole hakukohde_viite rivia', function () {
        it('ei näyttää "Valintakoekutsut" välilehden', seqDone(
            wait.forAngular,
            function () {
   //             expect(page.hakukohdelista().length).toBe(1);
                expect(page.title().html()).to.contain("Valintojen toteuttaminen");
            }
        ));
    });

});
