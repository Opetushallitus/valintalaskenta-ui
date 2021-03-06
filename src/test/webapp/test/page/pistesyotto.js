function pistesyottoPage() {
  function isLocalhost() {
    return location.host.indexOf('localhost') > -1
  }

  var _pistesyottoPage = openPage(
    '/valintalaskenta-ui/app/index.html#/haku/HAKUOID/hakukohde/HAKUKOHDEOID/pistesyotto',
    function () {
      return S('.virkailija-table-1').length === 1
    }
  )

  var pageFunctions = {
    allStudentsTable: function () {
      return S('.virkailija-table-1').first()
    },
    openPage: function (done) {
      return _pistesyottoPage().then(
        wait.until(function () {
          var pageReady = pageFunctions.allStudentsTable().length === 1
          if (pageReady) {
            done()
          }
          return pageReady
        })
      )
    },
  }
  return pageFunctions
}
pistesyottoselectors = initSelectors({
  osallistuminenSelectBox: '.virkailija-table-1 select:nth(1)',
  pistearvoInputBox: '.virkailija-table-1 input:nth(1)',
  formError: 'form .alert:first',
  tallennaButton: 'button.btn-primary:nth(1)',
  page2link: '.pagination a:contains(2)',
})
