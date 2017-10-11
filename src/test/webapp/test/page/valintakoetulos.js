
function valintakoetulosPage() {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1
    }

    var valintakoetuloksetPage = openPage("/valintalaskenta-ui/app/index.html#/haku/HAKU1/hakukohde/HAKUKOHDE1/valintakoetulos", function () {
        return S("#kokeittainNakyma").length === 1
    });

    var pageFunctions = {
        kokeittainNakyma: function () {
            return S("#kokeittainNakyma").first()
        },
        vainKutsuttavat: function() {
            return S("#osallistuu");
        },
        findTableWithPanelTitle: function (panelTitle) {
            return S("#kokeittainNakyma div.panel-title:contains(" + panelTitle+ ")").parent().parent().find("table");// tr:nth(1) td:nth(1)").text().trim();
        },
        findNthHakijaWithPanelTitle: function (n, panelTitle) {
            return pageFunctions.findTableWithPanelTitle(panelTitle).find("tr:nth("+n+") td:nth(1)").text().trim();
        },
        nakymaDropDown: function() {
            return S("#nakymaDropDown");
        },
        findNthHakija: function (n) {
            return S("#hakijoittainNakyma tbody tr:nth("+n+")");
        },
        openPage: function (done) {
            return valintakoetuloksetPage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.kokeittainNakyma().length === 1;
                    if (pageReady) {
                        done()
                    }
                    return pageReady
                }))
        }
    };
    return pageFunctions;
}
