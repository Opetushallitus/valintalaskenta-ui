lisahakuSelectors = initSelectors({
    hakeneetTaulukko: ".virkailija-table-1",
    tilaDropdown: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") select:nth(0)";
    },
    tilaDropdownSelectedOption: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") select:nth(0) option:selected";
    },
    modalSuccess: ".modal-dialog .alert-success",
    modalError: ".modal-dialog .alert-danger",
    modalOkButton: ".modal-dialog .btn",
    julkaistuCheckbox: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") input[type=checkbox]";
    },
    vastaanottoDropdown: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") select:nth(1)";
    },
    vastaanottoDropdownOptions: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") select:nth(1) option";
    },
    vastaanottoDropdownSelecedOption: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") select:nth(1) option:selected";
    },
    ilmoittautumisDropdown: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") select:nth(2)";
    },
    ilmoittautumisDropdownSelecedOption: function(n) {
        return ".virkailija-table-1 tbody tr:nth(" + n + ") select:nth(2) option:selected";
    }
});

lisahakuPartials = {
    // Annettun promisen suoritus tuottaa onnistuneen tallennusmodaalin joka suljetaan
    withSuccessModal: function(promise) {
        return seqDone(
            promise,
            visibleText(lisahakuSelectors.modalSuccess, "Muutokset on tallennettu."),
            click(lisahakuSelectors.modalOkButton),
            notExists(lisahakuSelectors.modalSuccess));
    },
    withErrorModal: function(promise, errorMessage) {
        return seqDone(
            promise,
            visibleText(lisahakuSelectors.modalError, errorMessage),
            click(lisahakuSelectors.modalOkButton),
            notExists(lisahakuSelectors.modalError));
    }
};

function lisahaunHyvaksytytPage() {
    var valintakoetuloksetPage = openPage("/valintalaskenta-ui/app/index.html#/lisahaku/LISAHAKU/hakukohde/LISAHAKUKOHDE/hyvaksytyt", function () {
        return S(".virkailija-table-1").length === 1
    });

    return {
        openPage: function(done) {
            return valintakoetuloksetPage().then(done)
        }
    };
}
