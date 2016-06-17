function perustiedotPage(hakuOid, hakukohdeOid) {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1
    }

    var openPerustiedotPage = openPage(
        "/valintalaskenta-ui/app/index.html#/haku/" + hakuOid + "/hakukohde/" + hakukohdeOid + "/perustiedot", function () {
            return S(".virkailija-table-1").length === 1
        })

    var pageFunctions = {
        perustiedotTable: function () {
            return S(".virkailija-table-1").first()
        },
        openPage: function (done) {
            return openPerustiedotPage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.perustiedotTable().length === 1;
                    if (pageReady) {
                        done()
                    }
                    return pageReady
                }))
        }
    };
    return pageFunctions;
}

perustiedotSelectors = initSelectors({
    vastaanottaneetAtIndex: function (trIndex) {
        return ".virkailija-table-1 tr:eq(" + trIndex + ") td:eq(6)"
    }
})