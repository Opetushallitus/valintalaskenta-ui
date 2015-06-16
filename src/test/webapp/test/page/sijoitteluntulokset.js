function sijoitteluntuloksetPage(hakuOid, hakemusOid) {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1
    }

    var openSijoitteluPage = openPage(
        "/valintalaskenta-ui/app/index.html#/haku/" + hakuOid + "/hakukohde/" + hakemusOid + "/sijoitteluntulos", function () {
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
    koulunNimi: "[ng-bind='tulos.tarjoajaNimi']",
    modaali: ".modal-content",
    valintatilanne: ".result-list tr th span",
    valintatulosTableIndex: function (trIndex, spanIndex) {
        return ".result-list tr:eq(" + trIndex + ") td span:eq(" + spanIndex + ")"
    }
})