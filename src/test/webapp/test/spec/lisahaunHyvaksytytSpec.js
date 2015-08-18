describe('Lisähaun hakeneet välilehti', function () {
    var lomake = lisahakuSelectors;

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('avautuessaan', function () {
        var page = lisahaunHyvaksytytPage();
        before(function (done) {
            [
                tarjontaFixtures,
                lisahakuApplications,
                parametritFixtures,
                koodistoFixtures,
                valintakokeetFixtures(),
                sijoitteluAjoFixtures,
                ohjausparametritFixtures,
                organisaatioFixtures,
                commonFixtures()
            ].map(addTestHook).forEach(function(f) { f(); });
            page.openPage(done);
        });

        it('henkilötaulukko latautuu', seqDone(
            wait.forAngular,
            visible(lomake.hakeneetTaulukko)
        ));

        it("hyväksymisvalikon tila on 'Määrittelemätön'", seqDone(
            assertTextLazy(lomake.tilaDropdownSelectedOption(0), "Määrittelemätön")
        ));

        it("hyväksymisvalikon 'Määrittelemätön'-tilan valinta on estetty", seqDone(
            disabled(lomake.tilaDropdownSelectedOption(0), "Määrittelemätön")
        ));

        it("julkaisunappi ei ole näkyvissä", seqDone(
            invisible(lomake.julkaistuCheckbox(0))
        ));

        it("vastaanottotieto ei ole näkyvissä", seqDone(
            invisible(lomake.vastaanottoDropdown(0))
        ));

        it("ilmoittautumistieto ei ole näkyvissä", seqDone(
            invisible(lomake.ilmoittautumisDropdown(0))
        ));

        describe("hakijan hyväksyminen", function() {
            before(lisahakuPartials.withSuccessModal(
                select(lomake.tilaDropdown(0), "true")));

            it("näyttää tulosten julkaisunapin", seqDone(
                visible(lomake.julkaistuCheckbox(0))
            ));

            it("julkaisunappi on valitsematta", seqDone(
                unchecked(lomake.julkaistuCheckbox(0))
            ));

            it("vastaanottotieto ei ole näkyvissä", seqDone(
                invisible(lomake.vastaanottoDropdown(0))
            ));

            it("ilmoittautumistieto ei ole näkyvissä", seqDone(
                invisible(lomake.ilmoittautumisDropdown(0))
            ));

            describe("tietojen julkaisu", function() {
                before(lisahakuPartials.withSuccessModal(
                    click(lomake.julkaistuCheckbox(0))));

                it("näyttää vastaanottovalikon", seqDone(
                    visible(lomake.vastaanottoDropdown(0))
                ));

                it("vastaanottovalikossa ei ole tilaa 'Vastaanottanut ehdollisesti'", seqDone(
                    assertNoTextContent(lomake.vastaanottoDropdownOptions(0), "Vastaanottanut ehdollisesti")
                ));

                it("vastaanottovalikon tila on 'Kesken'", seqDone(
                    assertTextLazy(lomake.vastaanottoDropdownSelecedOption(0), "Kesken")
                ));

                it("ilmoittautumistieto ei ole näkyvissä", seqDone(
                    invisible(lomake.ilmoittautumisDropdown(0))
                ));

                describe("paikan sitova vastaanotto", function() {
                    before(lisahakuPartials.withSuccessModal(
                        select(lomake.vastaanottoDropdown(0), "1")));

                    it("näyttää ilmoittautmisvalikon", seqDone(
                        visible(lomake.ilmoittautumisDropdown(0))
                    ));

                    it("ilmoittautumisvalikon tila on 'Ei tehty'", seqDone(
                        assertTextLazy(lomake.ilmoittautumisDropdownSelecedOption(0), "Ei tehty")
                    ));
                });
            });
        });

        describe("hakijan hylkääminen", function() {
            before(lisahakuPartials.withSuccessModal(
                select(lomake.tilaDropdown(1), "false")));

            it("näyttää tulosten julkaisunapin", seqDone(
                visible(lomake.julkaistuCheckbox(1))
            ));

            it("julkaisunappi on valitsematta", seqDone(
                unchecked(lomake.julkaistuCheckbox(1))
            ));

            it("vastaanottotieto ei ole näkyvissä", seqDone(
                invisible(lomake.vastaanottoDropdown(1))
            ));

            it("ilmoittautumistieto ei ole näkyvissä", seqDone(
                invisible(lomake.ilmoittautumisDropdown(1))
            ));

            describe("tietojen julkaisu", function() {
                before(lisahakuPartials.withSuccessModal(
                    click(lomake.julkaistuCheckbox(1))));

                it("vastaanottotieto ei ole näkyvissä", seqDone(
                    invisible(lomake.vastaanottoDropdown(1))
                ));

                it("ilmoittautumistieto ei ole näkyvissä", seqDone(
                    invisible(lomake.ilmoittautumisDropdown(1))
                ));
            });
        });
    });
});
