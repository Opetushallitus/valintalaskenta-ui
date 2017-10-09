app.factory('PistesyottoNaytaKaikkiModel', function ($q, HakukohdeAvaimet, KoostettuHakemusAdditionalData) {
    "use strict";

    var model;
    model = new function () {

        this.hakeneet = [];
        this.avaimet = [];

        this.refresh = function (hakukohdeOid, hakuOid) {

            model.hakeneet.length = 0;
            model.avaimet.length = 0;

            model.hakuOid = hakuOid;
            model.hakukohdeOid = hakukohdeOid;

            model.avaimet = HakukohdeAvaimet.get({hakukohdeOid: hakukohdeOid});

            KoostettuHakemusAdditionalData.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid})
                .then(function (koostetutPistetiedot) {
                    model.hakeneet = koostetutPistetiedot.map(function (pistetieto) {
                        return pistetieto.applicationAdditionalDataDTO;
                    });
                }, function (error) {
                    model.errors.push(error);
                });
        };

        this.refreshIfNeeded = function (hakukohdeOid, hakuOid) {

            if (hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }

        };


    }();

    return model;
});


angular.module('valintalaskenta').
    controller('PistesyottoNaytaKaikkiController', ['$scope', '$log', '$routeParams',
        'PistesyottoNaytaKaikkiModel', 'LocalisationService',
        function ($scope, $log, $routeParams, PistesyottoNaytaKaikkiModel, LocalisationService) {
    "use strict";

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = PistesyottoNaytaKaikkiModel;
    $scope.hakuOid = $routeParams.hakuOid;


    PistesyottoNaytaKaikkiModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = ['lastName','firstNames'];
    $scope.osallistumislokaalit = [
        {value:"hakukohteetpistesyotto.merkitsematta",default_text:"Merkitsem\u00E4tt\u00E4"},
        {value:"hakukohteetpistesyotto.osallistui",default_text:"Osallistui"},
        {value:"hakukohteetpistesyotto.eiosallistunut",default_text:"Ei osallistunut"},
        {value:"hakukohteetpistesyotto.eivaadita",default_text:"Ei vaadita"}
    ];
    $scope.lokaali = function(avain) {
        return _.find($scope.osallistumislokaalit, function(o) { return o.value == avain; }).default_text;
    };
    LocalisationService.getTranslationsForArray($scope.osallistumislokaalit);
    $scope.osallistumistilat = {
        "MERKITSEMATTA": $scope.lokaali("hakukohteetpistesyotto.merkitsematta"),
        "OSALLISTUI": $scope.lokaali("hakukohteetpistesyotto.osallistui"),
        "EI_OSALLISTUNUT": $scope.lokaali("hakukohteetpistesyotto.eiosallistunut"),
        "EI_VAADITA": $scope.lokaali("hakukohteetpistesyotto.eivaadita")
    };

    $scope.hakijaFilter = "";

}]);
