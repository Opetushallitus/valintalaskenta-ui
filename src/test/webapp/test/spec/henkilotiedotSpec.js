describe('Henkilötiedot näkymä', function() {
    var HAKEMUS1 = "HAKEMUS1";
    var hakemus1Oid = "1.2.246.562.11.00003935855";
    var HAKEMUS2 = "HAKEMUS2";
    var hakuOid =  "1.2.246.562.29.11735171271";
    var page = henkilotiedotPage(hakemus1Oid, hakuOid);

  beforeEach(function(done) {
      addTestHook(tarjontaFixtures)();
      addTestHook(koodistoFixtures)();
      addTestHook(parametritFixtures)();
      addTestHook(listfullFixtures([]))();
      addTestHook(sijoitteluAjoFixtures)();
      addTestHook(harkinnanvarainenhyvaksyntaFixtures)();
      addTestHook(commonFixtures())();
      addTestHook(organisaatioFixtures)();

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
          expect(nayta_kaikkiPage().allStudentsTable().length).to.equal(1)
        }
    ))
  })
});
