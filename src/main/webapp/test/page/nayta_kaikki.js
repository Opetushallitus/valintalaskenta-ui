
function nayta_kaikkiPage() {
  function isLocalhost() {
    return location.host.indexOf('localhost') > -1
  }

  var opiskelijatiedotPage = openPage("/valintalaskenta-ui/app/haku/hakukohteet/pistesyotto/nayta_kaikki/index.html#/haku/h/hakukohde/h0", function () {
    return S(".virkailija-table-1").length === 1
  })

  var pageFunctions = {
    search: function() {
      return S("#search");
    },
    allStudentsTable: function () {
      return S(".virkailija-table-1").first()
    },
    nthNameInTable: function (n) {
      return S(".virkailija-table-1 tr:nth-child("+n+") td:nth-child(1)").text().trim();
    },
    openPage: function (done) {
      return opiskelijatiedotPage()
        .then(wait.until(function () {
          var pageReady = pageFunctions.allStudentsTable().length === 1
          if (pageReady) {
            done()
          }
          return pageReady
        }))
    }
  };
  return pageFunctions;
}
