
function henkilotiedotPage(hakuOid, hakemusOid) {
  function isLocalhost() {
    return location.host.indexOf('localhost') > -1
  }
  console.log("henkilotiedotpage: " + hakuOid + ", hakemusOid " + hakemusOid);
  var henkilotiedotPage = openPage("/valintalaskenta-ui/app/index.html#/haku/"+hakuOid+"/henkiloittain/"+hakemusOid+"/henkilotiedot", function () {
    return S(".virkailija-table-1").length === 1
  });

  var pageFunctions = {
    search: function() {
      return S("#search");
    },
    table: function () {
      return S(".virkailija-table-1").first()
    },
    nthNameInTable: function (n) {
      return S(".virkailija-table-1 tr:nth-child("+n+") td:nth-child(1)").text().trim();
    },
    openPage: function (done) {
      return henkilotiedotPage()
        .then(wait.until(function () {
          var pageReady = pageFunctions.table().length === 1;
          pageReady = true;
          if (pageReady) {
            done()
          }
          return pageReady
        }))
    }
  };
  return pageFunctions;
}
