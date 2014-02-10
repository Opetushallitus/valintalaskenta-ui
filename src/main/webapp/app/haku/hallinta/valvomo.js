"use strict"
angular.module('resources.valvomo', [])
    .factory('ValvomoResource', ['$resource', function ($resource) {

        return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/:resurssi/status", {}, {
            get: {method: "GET", isArray: true}
        })

    }]);

angular.module('valvomo', ['resources.valvomo', 'ngRoute']);

angular.module('valvomo').controller('ValvomoController', ['$scope', '$interval', 'ValvomoResource', function ($scope, $interval, ValvomoResource) {
    $scope.sijoittelu = [];
    $scope.valintalaskenta = [];
    $scope.valintakoelaskenta = [];
    $scope.valittu = 'valintalaskenta';

    var update = function (valittu) {
        ValvomoResource.
            get({resurssi: valittu}, function (result) {

                result.forEach(function (prosessi, index) {
                    if (!angular.equals(prosessi, $scope[valittu][index])) {
                        $scope[valittu][index] = prosessi;
                    }
                });

            });
    };

    update($scope.valittu);

    $scope.valitse = function (valittu) {
        $scope.valittu = valittu;
        update(valittu);
    }

    var timer = $interval(function () {
        update($scope.valittu);
    }, 10000);

    $scope.$on(
        "$destroy",
        function (event) {
            $interval.cancel(timer);
        }
    );

    $scope.width = 100;
    $scope.size = 5;
    $scope.gap = 2;

    $scope.range = function (n) {
        return new Array(n);
    };

    $scope.x = function (n) {
        var jee = n % $scope.width * ($scope.size + $scope.gap);
        return jee;
    }

    $scope.y = function (n) {
        var jee = Math.floor(n / $scope.width) * ($scope.size + $scope.gap);
        return jee;
    }

    $scope.fill = function (n, laskettu, virheet) {
        if (n < laskettu) {
            return '#00ff00'
        } else if (n < laskettu + virheet) {
            return '#ff0000'
        } else {
            return '#0000ff'
        }
    }

}]);

angular.module('valvomo').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/valvomo', {controller: 'ValvomoController', templateUrl: TEMPLATE_URL_BASE + 'haku/hallinta/valvomo.html'}).
        otherwise({redirectTo: '/haku/'});
}]);