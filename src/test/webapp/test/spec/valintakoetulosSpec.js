function asyncPrint(s) {
  return function () {
    console.log(s)
  }
}

describe('Valintakoetulos', function () {
  var page = valintakoetulosPage()
  var HAKU = '1.2.246.562.20.37731636579'
  var HAKUKOHDE = 'HAKUKOHDE1'
  var VALINTAKOE1 = 'VALINTAKOE1'
  var VALINTAKOE2 = 'VALINTAKOE2'
  var VALINTAKOE3 = 'VALINTAKOE3'
  var HAKEMUS1 = 'HAKEMUS1'
  var HAKEMUS2 = 'HAKEMUS2'
  var PERSON1OID = 'PERSON1OID'
  var PERSON2OID = 'PERSON2OID'
  beforeEach(function (done) {
    addTestHook(tarjontaFixtures)()
    addTestHook(httpFixtures().hakukohteenAvaimet)()
    addTestHook(httpFixtures().hakukohdeHAKUKOHDE1)()
    addTestHook(koodistoFixtures)()
    addTestHook(parametritFixtures)()
    addTestHook(organisaatioFixtures)()
    addTestHook(commonFixtures())()
    addTestHook(
      valintakokeetFixtures([
        {
          valintakoeOid: VALINTAKOE1,
        },
        {
          valintakoeOid: VALINTAKOE2,
        },
        {
          valintakoeOid: VALINTAKOE3,
          kutsutaankoKaikki: true,
        },
      ])
    )()
    addTestHook(
      valintalaskentaValintakokeetFixtures([
        {
          hakuOid: HAKU,
          hakukohdeOid: HAKUKOHDE,
          valintakoeOid: VALINTAKOE1,
          hakemusOid: HAKEMUS1,
        },
        {
          hakuOid: HAKU,
          hakukohdeOid: HAKUKOHDE,
          valintakoeOid: VALINTAKOE2,
          hakemusOid: HAKEMUS2,
        },
      ])
    )()
    addTestHook(listfullFixtures([]))()
    addTestHook(
      hakemusByOidsFixtures([
        {
          hakemusOid: HAKEMUS1,
          kutsumanimi: 'Erkki',
          etunimi: 'Erkki',
          sukunimi: 'Hakija1',
          personOid: PERSON1OID,
          asiointikieli: { kieliKoodi: 'fi', kieliTyyppi: 'suomi' },
        },
        {
          hakemusOid: HAKEMUS2,
          kutsumanimi: 'Elli',
          etunimi: 'Elli',
          sukunimi: 'Hakija2',
          personOid: PERSON2OID,
          asiointikieli: { kieliKoodi: 'fi', kieliTyyppi: 'suomi' },
        },
      ])
    )()
    page.openPage(done)
  })

  afterEach(function () {
    if (this.currentTest.state == 'failed') {
      takeScreenshot()
    }
  })

  describe('Hakukohteen ulkopuolinen hakija', function () {
    it(
      'Hakija1 valintakokeessa VALINTAKOE1',
      seqDone(wait.forAngular, function () {
        expect(page.findNthHakijaWithPanelTitle(1, VALINTAKOE1)).to.contain(
          'Hakija1'
        )
      })
    )
    it(
      'Hakija2 valintakokeessa VALINTAKOE2',
      seqDone(wait.forAngular, function () {
        expect(page.findNthHakijaWithPanelTitle(1, VALINTAKOE2)).to.contain(
          'Hakija2'
        )
      })
    )
    it(
      'Hakijat näkyy hakijoittain näkymässä ja kutsutaan oikeisiin valintakokeisiin',
      seqDone(
        wait.forAngular,
        select(page.nakymaDropDown, 'Hakijoittain'),
        click(page.vainKutsuttavat),
        //wait.forAngular,
        function () {
          expect(
            page.findNthHakija(0).find('td:nth(0) a').text().trim()
          ).to.contain('Hakija1')
          expect(
            page.findNthHakija(1).find('td:nth(0) a').text().trim()
          ).to.contain('Hakija2')
          expect(
            page.findNthHakija(0).find('td:nth(1)').text().trim()
          ).to.contain('Kutsutaan')
          expect(
            page.findNthHakija(1).find('td:nth(2)').text().trim()
          ).to.contain('Kutsutaan')
        }
      )
    )
  })
})
