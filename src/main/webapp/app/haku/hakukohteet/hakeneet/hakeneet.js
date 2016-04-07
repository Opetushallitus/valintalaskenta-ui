app.factory('HakeneetModel', function (HakukohdeHenkilotFull, $q) {
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
            this.loaded = $q.defer();

            HakukohdeHenkilotFull.get({aoOid: hakukohdeOid, rows: 100000, asId: model.hakuOid}, function (result) {
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

                                if (hakija.preferenceEligibilities) {
                                    for (var j = 0; j < hakija.preferenceEligibilities.length; j++) {
                                        if (hakija.preferenceEligibilities[j].aoId === hakukohdeOid) {
                                            hakija.hakukelpoisuus = hakija.preferenceEligibilities[j].status;
                                        }

                                    }
                                }
                                break;
                            }
                        }
                        model.loaded.resolve();
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
        'HakuModel', 'Korkeakoulu', 'ngTableParams','$filter','FilterService',
        function ($scope, $location, $routeParams, HakeneetModel, HakukohdeModel, HakuModel, Korkeakoulu, ngTableParams, $filter, FilterService) {
    'use strict';
    HakuModel.refreshIfNeeded($routeParams.hakuOid);
    $scope.hakuModel = HakuModel;
    $scope.korkeakoulu = Korkeakoulu;

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);
    $scope.hakukohdeModel = HakukohdeModel;

    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid, $scope.hakuOid);
    $scope.model = HakeneetModel;
    $scope.promise = $scope.model.loaded.promise;

    // Kielistys joskus
    $scope.tila = {
        "ACTIVE": "Aktiivinen",
        "INCOMPLETE": "Puutteellinen"
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 50,          // count per page
        filters: {
            'answers.henkilotiedot.Sukunimi' : ''
        },
        sorting: {
            'answers.henkilotiedot.Sukunimi': 'asc'     // initial sorting
        }
    }, {
        total: $scope.model.hakeneet.length, // length of data
        getData: function ($defer, params) {
            $scope.promise.then(function (result) {
                var filters = FilterService.fixFilterWithNestedProperty(params.filter());

                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.model.hakeneet, params.orderBy()) :
                    $scope.model.hakeneet;
                orderedData = params.filter() ?
                    $filter('filter')(orderedData, filters) :
                    orderedData;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

            });
        }
    });

}]);
