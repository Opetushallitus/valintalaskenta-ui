function nayta_kaikkiPage() {
  function isLocalhost() {
    return location.host.indexOf('localhost') > -1
  }

  var opiskelijatiedotPage = openPage("/valintalaskenta-ui/app/haku/hakukohteet/pistesyotto/nayta_kaikki/nayta_kaikki.html", function () {
    return S(".virkailija-table-1").length === 1
  })

  var pageFunctions = {
    allStudentsTable: function () {
      return S(".virkailija-table-1").first()
    },
    openPage: function (done) {
      return opiskelijatiedotPage()
        .then(wait.until(function () {
          var pageReady = pageFunctions.allStudentsTable.length === 1
          if (pageReady) {
            done()
          }
          return pageReady
        }))
    }
  };
  return pageFunctions;
}
