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
    $scope.size = 10;
    $scope.gap = 2;

    $scope.range = function (n) {
        return new Array(n);
    };
    var kuvio = Math.random()*10;
    $scope.x = function (n) {
        var jee = n % $scope.width * ($scope.size + $scope.gap);
        return jee + Math.sin(n/kuvio+Math.PI)+2;
    }

    $scope.y = function (n) {
        var jee = Math.floor(n / $scope.width) * ($scope.size + $scope.gap);
        return jee + Math.sin(n/kuvio+Math.PI)+2;
    }

    $scope.fill = function (n, laskettu, virheet) {
        if (n < laskettu) {
            return '#aaffaa'
        } else if (n < laskettu + virheet) {
            return '#ffaaaa'
        } else {
            return '#aaaaff'
        }
    }

    $scope.blockSize = function(n) {
        return $scope.size+Math.sin(n/kuvio)-2;
    }

}]);

angular.module('valvomo').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/valvomo', {controller: 'ValvomoController', templateUrl: TEMPLATE_URL_BASE + 'haku/hallinta/valvomo.html'}).
        otherwise({redirectTo: '/haku/'});
}]);