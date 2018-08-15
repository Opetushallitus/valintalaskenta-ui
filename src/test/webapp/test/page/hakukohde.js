function hakukohdePage(hakuOid) {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1;
    }
    var openHakukohdePage = openPage(
        "/valintalaskenta-ui/app/index.html#/haku/" + hakuOid + "/hakukohde", function () {
            return S("#hakukohdelista").length === 1;
        });

    var pageFunctions = {
        hakukohdeTable: function () {
            var tmp = S("#hakukohdelista").first();
            return tmp;
        },
        openPage: function (done) {
            return openHakukohdePage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.hakukohdeTable().length === 1;
                    if (pageReady) {
                        done();
                    }
                    return pageReady;
                }))
        }
    };
    return pageFunctions;
}

hakukohdeSelectors = initSelectors({
    title: function() {
        return "h1";
    }
});