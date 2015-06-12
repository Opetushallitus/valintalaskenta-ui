function sijoitteluntuloksetPage() {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1
    }

    var openSijoitteluPage = openPage(
        "/valintalaskenta-ui/app/index.html#/haku/1.2.246.562.29.11735171271/hakukohde/1.2.246.562.20.37731636579/sijoitteluntulos", function () {
            return S(".tabsheets").length === 2
        })

    var pageFunctions = {
        filterForm: function () {
            return S('.tabsheets').length
        },
        openPage: function (done) {
            return openSijoitteluPage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.filterForm() === 2;
                    if (pageReady) {
                        done()
                    }
                    return pageReady
                }))
        }
    };
    return pageFunctions;
}

sijoitteluntulokset = initSelectors({
    sijoittelunTuloksetTab: "#test-sijoittelun-tulokset",
    tabSheet: ".tabsheets",
    valintaTulokset: "#valintaTulokset",
    iirisHenkilotiedot: "span:contains('Iiris VII')",
    koulunNimi: "[ng-bind='tulos.opetuspiste.name']",
    modaali: ".modal-content"

})