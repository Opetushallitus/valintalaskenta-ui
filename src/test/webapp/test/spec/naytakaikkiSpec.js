function asyncPrint(s) {
    return function () {
        console.log(s)
    }
}

describe('Näytä kaikki', function () {
    var page = nayta_kaikkiPage();

    beforeEach(function (done) {
        addTestHook(hakuAppKaksiHenkiloaFixtures)();
        addTestHook(valintaperusteetFixtures)();
        addTestHook(organisaatioFixtures)();
        addTestHook(commonFixtures())();
        page.openPage(done)
    });

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Näyttää', function () {
        it('kaikki tiedot', seqDone(
            wait.forAngular,
            function () {
                expect(page.nthNameInTable(1)).to.contain('Ilman');
                expect(page.nthNameInTable(2)).to.contain('Yksikkötestihenkilö');
                expect(page.allStudentsTable().length).to.equal(1)
            }
        )),
            it('filtteröidyt tiedot', seqDone(
                wait.forAngular,
                input(page.search, "Yksikkötestihenkilö"),
                function () {
                    expect(page.nthNameInTable(1)).to.contain('Yksikkötestihenkilö');
                    expect(page.allStudentsTable().length).to.equal(1)
                }
            ))
    })
});
