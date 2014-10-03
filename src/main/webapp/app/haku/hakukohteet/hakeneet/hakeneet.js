app.factory('HakeneetModel', function (HakukohdeHenkilotFull) {
    'use strict';
    var model;
    model = new function () {

        this.hakeneet = [];
        this.errors = [];

        this.refresh = function (hakukohdeOid, hakuOid) {
            model.hakeneet = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakuOid = hakuOid;

            HakukohdeHenkilotFull.get({aoOid: hakukohdeOid, rows: 100000}, function (result) {
                model.hakeneet = result;

                model.hakeneet.forEach(function (hakija) {
                    if(hakija.answers) {
                        for (var i = 1; i < 10; i++) {
                            if (!hakija.answers.hakutoiveet) {
                                break;
                            }
                            var oid = hakija.answers.hakutoiveet["preference" + i + "-Koulutus-id"];

                            if (oid === undefined) {
                                break;
                            }

                            if (oid === hakukohdeOid) {
                                hakija.hakutoiveNumero = i;

                                for (var j = 0; j < hakija.preferenceEligibilities.length; j++) {
                                    if (hakija.preferenceEligibilities[j].aoId === hakukohdeOid) {
                                        hakija.hakukelpoisuus = hakija.preferenceEligibilities[j].status;
                                    }

                                }
                                break;
                            }

                        }
                    }
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
    controller('HakeneetController', ['$scope', '$location', '$routeParams', 'HakeneetModel', 'HakukohdeModel',
        function ($scope, $location, $routeParams, HakeneetModel, HakukohdeModel) {
    'use strict';

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);
    $scope.hakukohdeModel = HakukohdeModel;

    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid, $scope.hakuOid);
    $scope.model = HakeneetModel;
    $scope.pageSize = 50;
    $scope.currentPage = 1;
    // Kielistys joskus
    $scope.tila = {
        "ACTIVE": "Aktiivinen",
        "INCOMPLETE": "Puutteellinen"
    };
}]);
