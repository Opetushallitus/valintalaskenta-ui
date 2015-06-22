function asyncPrint(s) {
  return function () {
    console.log(s)
  }
}

describe('Henkilötiedot', function() {
  var page = henkilotiedotPage();
    var HAKEMUS1 = "HAKEMUS1";
    var HAKEMUS2 = "HAKEMUS2";
    var HAKU1 = "{hakuOid}";

  beforeEach(function(done) {
      addTestHook(tarjontaFixtures)();
      addTestHook(koodistoFixtures)();
      addTestHook(parametritFixtures)();
      addTestHook(listfullFixtures([]))();
      addTestHook(sijoitteluAjoFixtures)();
      addTestHook(harkinnanvarainenhyvaksyntaFixtures)();
      addTestHook(commonFixtures())();

      addTestHook(hakemusByOidFixtures(
          {
              hakemusOid: HAKEMUS1,
              etunimi: "Erkki",
              sukunimi: "Hakija1",
              hakuOid: HAKU1,
              hakutoiveet: [
                  "1.2.246.562.20.24986103166", "1.2.246.562.20.61608097517", "1.2.246.562.20.76237731328", "1.2.246.562.20.270241078010", "1.2.246.562.20.34911042264"]

          }
      ))();
      addTestHook(valintalaskentaValintakokeetHakemukselleFixtures(
          {
              hakemusOid: HAKEMUS1,
              etunimi: "Erkki",
              sukunimi: "Hakija1",
              hakuOid: HAKU1
          }
      ))();
      addTestHook(valintalaskentaHakemukselleFixtures(
          {
              hakemusOid: HAKEMUS1,
              etunimi: "Erkki",
              sukunimi: "Hakija1",
              hakuOid: HAKU1
          }
      ))();
      addTestHook(hakemusByHakuOidFixtures([]))();
    page.openPage(done)
  });

  afterEach(function() {
    if (this.currentTest.state == 'failed') {
      takeScreenshot()
    }
  });

  describe('Näyttää', function() {
    it('henkilön valintalaskennan tulokset', seqDone(
        wait.forAngular,
        function() {
          expect(page.allStudentsTable().length).to.equal(1)
        }
    ))
  })
});
