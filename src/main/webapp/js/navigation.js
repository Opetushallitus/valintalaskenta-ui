

function navigationController($scope, $location, $routeParams, HakukohdeModel, ParametriService) {
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;

    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.navClass = function (page, level) {
        var currentRoute = $location.path().split('/')[level];
        return page === currentRoute ? 'current' : '';
    };

    $scope.displaytabs = ParametriService;
};

