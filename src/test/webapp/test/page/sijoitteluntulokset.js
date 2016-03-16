function sijoitteluntuloksetPage(hakuOid, hakukohdeOid) {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1
    }

    var openSijoitteluPage = openPage(
        "/valintalaskenta-ui/app/index.html#/haku/" + hakuOid + "/hakukohde/" + hakukohdeOid + "/sijoitteluntulos", function () {
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
    teppoHenkilotiedot: "span:contains('Testaaja')",
    teponOtaniemenHyvaksymymisTila: "span:contains('Hyvaksytty')",
    teponAmisHyvaksymymisTila: "span:contains('Peruuntunut')",
    koulunNimi: "[ng-bind='tulos.tarjoajaNimi']",
    modaali: ".modal-content",
    valintatilanne: ".result-list tr th span",
    hyvaksyPeruuntunut: function(jonoOid, hakemusOid) {
        return "#hyvaksyPeruuntunut-" + jonoOid + "-" + hakemusOid.replace(/\./g, "")
    },
    julkaistavissa: function(n) {
        return "tr.ng-scope:nth-child(" + n + ") > td:nth-child(7) > div:nth-child(1) > input:nth-child(1)";
    },
    valintatulosTableIndex: function (trIndex, spanIndex) {
        return ".result-list tr:eq(" + trIndex + ") td span:eq(" + spanIndex + ")"
    },
    valintatulosTilaIndex: function (trIndex) {
        return ".result-list tr:eq(" + trIndex + ") td:eq(1) span"
    },
    tallenna: "a:contains('Tallenna')",
    tallennaOk: "#saveChoicesBtn",
    hyvaksyValintaesitys: "a.btn:nth-child(1)",
    jalkiohjaus: ".testJalkiohjaus",
    vastaanottotieto: ".virkailija-table-1 tr.ng-scope:nth-child(3) muokattu-vastaanotto-tila select",
    vastaanottotietoOption: function(i) {
        return ".virkailija-table-1 tr.ng-scope:nth-child(3) muokattu-vastaanotto-tila select option:eq(" + i + ")";
    }
})
