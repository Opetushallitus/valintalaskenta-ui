
function pistesyottoPage() {
  function isLocalhost() {
    return location.host.indexOf('localhost') > -1
  }

  var _pistesyottoPage = openPage(
      "/valintalaskenta-ui/app/index.html#/haku/HAKUOID/hakukohde/HAKUKOHDEOID/pistesyotto", function () {
    return S(".virkailija-table-1").length === 1
  });

  var pageFunctions = {
    allStudentsTable: function () {
      return S(".virkailija-table-1").first()
    },
        /*
    nthNameInTable: function (n) {
      return S(".virkailija-table-1 tr:nth-child("+n+") td:nth-child(1)").text().trim();
    },*/
    openPage: function (done) {
      return _pistesyottoPage()
        .then(wait.until(function () {
          var pageReady = pageFunctions.allStudentsTable().length === 1;
          if (pageReady) {
            done()
          }
          return pageReady
        }))
    }
  };
  return pageFunctions;
}
