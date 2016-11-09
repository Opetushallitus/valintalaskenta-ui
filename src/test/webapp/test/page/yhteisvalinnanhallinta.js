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
    haunNimi: "collapsible[heading='Haun tiedot'] .row .row:first div:nth(1)",
    kirjeetOsionAvaus: "collapsible div[ng-click]:contains('Kirjeet ja sijoittelun tulokset'):first",
    paivitaKirjeidenTilanne: "div.panel:contains('Tuloskirjeiden muodostuksen tilanne') button:first",
    valmiitTulosKirjeet: "div.panel:contains('Tuloskirjeiden muodostuksen tilanne') th:contains('Valmiit')",
    hyvaksymisKirjeetFiLinkki: "div.panel:contains('Tuloskirjeiden muodostuksen tilanne') table:first a:first",
    ePostiFiLinkki: "div.panel:contains('Tuloskirjeiden muodostuksen tilanne') table:first a:nth(1)"
})
