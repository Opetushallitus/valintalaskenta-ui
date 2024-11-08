function hakukohdePage(hakuOid) {
  return hakukohdePageGenerator(
    '/valintalaskenta-ui/app/index.html#/haku/' + hakuOid + '/hakukohde'
  )
}

function hakukohdeValintakoekutsutTabPage(hakuOid, hakukohdeOid) {
  return hakukohdePageGenerator(
    '/valintalaskenta-ui/app/index.html#/haku/' +
      hakuOid +
      '/hakukohde/' +
      hakukohdeOid +
      '/valintakoetulos'
  )
}

function hakukohdePageGenerator(path) {
  function isLocalhost() {
    return location.host.indexOf('localhost') > -1
  }
  var openHakukohdePage = openPage(path, function () {
    return hakukohde.hakukohdeToolbar().length === 1
  })

  var pageFunctions = {
    openPage: function (done) {
      return openHakukohdePage().then(
        wait.until(function () {
          var pageReady = hakukohde.hakukohdeToolbar().length === 1
          if (pageReady) {
            done()
          }
          return pageReady
        })
      )
    },
    hakukohdeCount: function () {
      return hakukohde.hakukohdeItems().length
    },
    isOnValintakoekutsutTab: function () {
      return templateUrl() == 'haku/hakukohteet/koekutsut/valintakoetulos.html'
    },
    isOnHakukohteenPerustiedotTab: function () {
      return (
        templateUrl() ==
        'haku/hakukohteet/perustiedot/hakukohdeperustiedot.html'
      )
    },
  }
  return pageFunctions
}

hakukohde = initSelectors({
  title: 'h1',
  hakukohdeToolbar: '#toolbarcontent',
  hakukohdeToolbarToggle: '#toolbartoggle-btn',
  hakukohdeItems: '#toolbarcontent li',
  hakukohdeItem: function (hakukohdeIndex) {
    return "#toolbarcontent li[tabindex='" + hakukohdeIndex + "'] a"
  },
  hakukohdeNav: '.hakukohdeNav',
  valintakoekutsutTab: ".hakukohdeNav a span:contains('Valintakoekutsut')",
  pistesyottoTab: ".hakukohdeNav a span:contains('Pistesyöttö')",
})
