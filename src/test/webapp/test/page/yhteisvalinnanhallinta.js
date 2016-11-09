function yhteisvalinnanHallintaPage(hakuOid) {
    var openYhteisvalinnanHallintaPage = openPage(
        "/valintalaskenta-ui/app/index.html#/haku/" + hakuOid + "/yhteisvalinnanhallinta", function () {
            return S("collapsible[heading='Haun tiedot']").length === 1
        })

    var pageFunctions = {
        haunTiedotCollapsible: function () {
            return S("collapsible[heading='Haun tiedot']").first()
        },
        openPage: function (done) {
            return openYhteisvalinnanHallintaPage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.haunTiedotCollapsible().length === 1;
                    if (pageReady) {
                        done()
                    }
                    return pageReady
                }))
        }
    };
    return pageFunctions;
}

yhteisvalinnanHallintaSelectors = initSelectors({
    haunTiedotOsionAvaus: "collapsible div[ng-click]:contains('Haun tiedot'):first",
    haunNimi: "collapsible[heading='Haun tiedot'] .row .row:first div:nth(1)"
})
