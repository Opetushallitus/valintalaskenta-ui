
angular.module('valintalaskenta')

    .controller('HakukohdeNavigationController', ['$scope', '$location', '$routeParams', 'HakuModel', 'HakukohdeModel',
        function($scope, $location, $routeParams, HakuModel, HakukohdeModel) {
            $scope.hakuOid = $routeParams.hakuOid;
            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.hakuModel = HakuModel;
            $scope.hakukohdeModel = HakukohdeModel;

            HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

            $scope.navClass = function (page, level) {
                var currentRoute = $location.path().split('/')[level];
                return page === currentRoute ? 'current' : '';
            };
        }]);

