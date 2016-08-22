
angular.module('valintalaskenta')

    .controller('HakukohdeNavigationController', ['$scope', '$location', '$routeParams', 'HakuModel', 'HakukohdeModel',
        function($scope, $location, $routeParams, HakuModel, HakukohdeModel) {
            $scope.hakuOid = $routeParams.hakuOid;
            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.hakuModel = HakuModel;
            $scope.hakukohdeModel = HakukohdeModel;
            $scope.showNav = false;

            HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function() {
                $scope.hakukohdeModel.valinnanVaiheetPromise.promise.then(function() {
                    $scope.showNav = true;
                });
            });

            $scope.navClass = function (page, level) {
                var currentRoute = $location.path().split('/')[level];
                return page === currentRoute ? 'current' : '';
            };
        }]);

