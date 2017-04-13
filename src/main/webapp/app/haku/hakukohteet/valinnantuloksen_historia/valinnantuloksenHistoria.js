'use strict';

angular.module('valintalaskenta')
    .factory('valinnantuloksenHistoriaService', ['$http', '$q', function($http, $q) {
        var fetch = function(valintatapajonoOid, hakemusOid) {
            return $http.get(
                window.url('valinta-tulos-service.muutoshistoria'),
                {params: {valintatapajonoOid: valintatapajonoOid, hakemusOid: hakemusOid}}
            ).then(function(response) {
                return response.data;
            });
        };
        return {
            pool: {},
            get: function(valintatapajonoOid, hakemusOid) {
                var historia = this.pool[valintatapajonoOid + "_" + hakemusOid];
                if (historia) {
                    return $q.resolve(historia);
                } else {
                    var pool = this.pool;
                    return fetch(valintatapajonoOid, hakemusOid).then(function(historia) {
                        pool[valintatapajonoOid + "_" + hakemusOid] = historia;
                        return historia;
                    });
                }
            }
        };
    }])
    .controller('ValinnantuloksenHistoriaModalController', [
        '$scope',
        '$modalInstance',
        'historia',
        function($scope, $modalInstance, historia) {
            $scope.historia =  historia;
            $scope.close = function () {
                $modalInstance.close();
            }
        }])
    .directive('valinnantuloksenHistoria', [function() {
        return {
            restrict: 'E',
            scope: {
                historia: '='
            },
            templateUrl: 'haku/hakukohteet/valinnantuloksen_historia/valinnantuloksenHistoria.html'
        };
    }]);
