function hakukohdePage(hakuOid) {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1;
    }
    var openHakukohdePage = openPage(
        "/valintalaskenta-ui/app/index.html#/haku/" + hakuOid + "/hakukohde",
        function () {
            return S("#hakukohdelista").length === 1;
        });

    var pageFunctions = {
        hakukohdelista: function () {
            return S("#hakukohdelista");
        },
        title: function () {
            return S("h1").first();
        },
        openPage: function (done) {
            return openHakukohdePage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.hakukohdelista().length === 1;
                    if (pageReady) {
                        done();
                    }
                    return pageReady;
                }))
        }
    };
    return pageFunctions;
}