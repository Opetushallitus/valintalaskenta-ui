angular
  .module('valintalaskenta')

  .controller('navigationController', [
    '$scope',
    '$location',
    '$routeParams',
    'HakuModel',
    function ($scope, $location, $routeParams, HakuModel) {
      $scope.hakuOid = $routeParams.hakuOid
      $scope.hakuModel = HakuModel

      $scope.navClass = function (page, level) {
        var currentRoute = $location.path().split('/')[level]
        return page === currentRoute ? 'current' : ''
      }
    },
  ])
