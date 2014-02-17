"use strict"
angular.module('resources.valvomo', [])
    .factory('ValvomoResource', ['$resource', function ($resource) {

        return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/:resurssi/status", {}, {
            get: {method: "GET", isArray: true}
        })

    }]);

angular.module('valvomo', ['resources.valvomo', 'ngRoute']);

angular.module('valvomo').controller('ValvomoController',
    ['$scope', '$routeParams', '$interval', '$timeout', '$window', 'ValvomoResource',
        function ($scope, $routeParams, $interval, $timeout, $window, ValvomoResource) {
    $scope.sijoittelu = [];
    $scope.valintalaskenta = [];
    $scope.valintakoelaskenta = [];
    $scope.hakuimport = [];
    $scope.valittu = $routeParams.selectedTab || 'valintalaskenta';

            console.log($routeParams.selectedTab || 'valintalaskenta');
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
    $scope.gap = 0;

    $scope.range = function (n) {
        return new Array(n);
    };
    var kuvio = Math.random()*10;
    var temp = 3;
    $scope.x = function (n) {
        var jee = n % $scope.width * ($scope.size + $scope.gap);
        return jee + Math.sin(n/kuvio+Math.PI)+temp/2;
    }

    $scope.y = function (n) {
        var jee = Math.floor(n / $scope.width) * ($scope.size + $scope.gap);
        return jee + Math.sin(n/kuvio+Math.PI)+temp/2;
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
        return $scope.size+Math.sin(n/kuvio)-temp;
    }


}]);

angular.module('valvomo').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/valvomo', {controller: 'ValvomoController', templateUrl: TEMPLATE_URL_BASE + 'haku/hallinta/valvomo.html'}).
        when('/valvomo/:selectedTab', {controller: 'ValvomoController', templateUrl: TEMPLATE_URL_BASE + 'haku/hallinta/valvomo.html'}).
        otherwise({redirectTo: '/haku/'});
}]);