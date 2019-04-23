angular.module('valintalaskenta')

.controller('HistoriaKeysModalCtrl', ['$scope', '$modalInstance','kaava', function ($scope, $modalInstance, kaava) {
        $scope.kaava = kaava;
        
        $scope.close = function () {
            $modalInstance.close();
        };
    }]);
