
angular.module('valintalaskenta')

.controller('navigationController', ['$scope', '$location', '$routeParams', 'HakukohdeModel', 'HakuModel',
        function($scope, $location, $routeParams, HakukohdeModel, HakuModel) {
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

