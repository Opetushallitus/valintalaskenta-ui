
angular.module('valintalaskenta')

    .controller('HakukohdeNavigationController', ['$scope', '$location', '$routeParams', 'HakuModel', 'HakukohdeModel', 'HakukohdeValintakoe',
        function($scope, $location, $routeParams, HakuModel, HakukohdeModel, HakukohdeValintakoe) {
            $scope.hakuOid = $routeParams.hakuOid;
            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.hakuModel = HakuModel;
            $scope.hakukohdeModel = HakukohdeModel;
            $scope.showNav = false;

            HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function() {
                function ifHakukohdeViiteDoesNotExistThenHideTheValintaKoekutsutTab() {
                    HakukohdeValintakoe.get({hakukohdeOid: $scope.hakukohdeOid})
                        .$promise
                        .then(
                            function(value) {
                                HakukohdeModel.valintakoekutsutTabVisible = true;
                            },
                            function(error) {
                                HakukohdeModel.valintakoekutsutTabVisible = false;
                            }
                        );
                }
                ifHakukohdeViiteDoesNotExistThenHideTheValintaKoekutsutTab();
                $scope.showNav = true;
            });

            $scope.navClass = function (page, level) {
                var currentRoute = $location.path().split('/')[level];
                return page === currentRoute ? 'current' : '';
            };
        }]);

