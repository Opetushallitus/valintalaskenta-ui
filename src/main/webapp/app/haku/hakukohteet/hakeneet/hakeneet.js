﻿app.factory('HakeneetModel', function (HakukohdeHenkilot) {
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

            HakukohdeHenkilot.get({aoOid: hakukohdeOid, rows: 100000}, function (result) {
                model.hakeneet = result.results;
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
