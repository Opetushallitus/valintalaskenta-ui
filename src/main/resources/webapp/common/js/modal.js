"use strict";

angular.module('valintalaskenta')

.directive('modal', ['$modal', function ($modal) {

    return {
        scope: true,
        restrict: 'E',
        transclude: true,
        replace: false,
        template: '<div ng-transclude></div>',
        controller: function ($scope) {
            $scope.show = function () {
                $modal.open({
                    scope: $scope,
                    templateUrl: $scope.modalTemplate,
                    windowClass: $scope.windowClass,
                    controller: function ($scope, $modalInstance) {
                        $scope.sulje = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
            };

            this.show = function () {
                $scope.show();
            }
        },
        link: function ($scope, $elems, $attrs) {
            $scope.modalTemplate = $attrs.modalTemplate;
            $scope.windowClass = $attrs.windowClass;
        }
    };
}])

.directive('modalOpen', [ function () {
    return {
        require: '^modal', // We need this directive to be inside an accordion
        restrict: 'E',
        transclude: true, // It transcludes the contents of the directive into the template
        replace: true, // The element containing the directive will be replaced with the template
        link: function (scope, element, attrs, modalCtrl) {
            scope.show = function () {
                modalCtrl.show();
            }
        },
        template: '<a href="" ng-click="show()" ng-transclude></a>'
    };
}])



//MODAALISET IKKUNAT
.factory('Ilmoitus', ['$modal', 'IlmoitusTila', function($modal, IlmoitusTila) {
    return {
        avaa: function(otsikko, ilmoitus, tila, callback, errorRows) {
            $modal.open({
                backdrop: 'static',
                templateUrl: '../common/modaalinen/ilmoitus.html',
                controller: function($scope, $window, $modalInstance) {
                    $scope.ilmoitus = ilmoitus;
                    $scope.otsikko = otsikko;
                    if(!tila) {
                        tila = IlmoitusTila.INFO;
                    }
                    $scope.tila = tila;
                    $scope.ok = callback || function() {
                        $modalInstance.dismiss('ok');
                    };
                    $scope.errorRows = errorRows
                },
                resolve: {

                }
            }).result.then(function() {
                }, function() {
                });

        },
        avaaCancel: function(otsikko, ilmoitus, tila, ok, cancel) {
            $modal.open({
                backdrop: 'static',
                templateUrl: '../common/modaalinen/ilmoitus.html',
                controller: function($scope, $window, $modalInstance) {
                    $scope.showCancel = true;
                    $scope.ilmoitus = ilmoitus;
                    $scope.otsikko = otsikko;
                    if(!tila) {
                        tila = IlmoitusTila.INFO;
                    }
                    $scope.tila = tila;
                    $scope.ok = function() {
                        $modalInstance.dismiss('ok');
                        ok();
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                        cancel();
                    };
                },
                resolve: {

                }
            }).result.then(function() {
            }, function() {
            });
        }
    };
}])
.factory('TallennaValinnat', ['$modal', function($modal) {
    return {
        avaa: function(otsikko, ilmoitus, action) {
            return $modal.open({
                backdrop: 'static',
                templateUrl: '../common/modaalinen/tallennavalinnat-ilmoitus.html',
                controller: function($scope, $window, $modalInstance, LocalisationService) {
                    $scope.errorRows = [];
                    $scope.ilmoitus = ilmoitus;
                    $scope.otsikko = otsikko;
                    $scope.state="info";
                    $scope.t = LocalisationService.tl;
                    $scope.ok = function() {
                        $scope.working = true;
                        $scope.peruuta = null;
                        action().then(
                            function(message) {
                                $scope.working = null;
                                $scope.ilmoitus = message;
                                $scope.errorRows = [];
                                $scope.state = "success";
                                $scope.ok = function() {
                                    $modalInstance.dismiss('cancel');
                                }
                            },
                            function(o) {
                                $scope.working = null;
                                $scope.ilmoitus = o.message;
                                $scope.errorRows = (o.errorRows || []);
                                $scope.state = "danger";
                                $scope.ok = function() {
                                    $modalInstance.dismiss('cancel');
                                }
                            }
                        );
                    };
                    $scope.peruuta = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {

                }
            }).result;
        }
    };
}])
.factory('Latausikkuna', ['$log', '$modal', 'DokumenttiProsessinTila',
        function($log, $modal, DokumenttiProsessinTila) {
    return {

        avaaKustomoitu: function(id, otsikko, lisatiedot, ikkunaHtml, laajennettuMalli, naytaLatauspainike) {
            var timer = null;
            var cancelTimerWhenClosing = function() {
                DokumenttiProsessinTila.ilmoita({id: id, poikkeus:"peruuta prosessi"});
            };
            if(_.isUndefined(naytaLatauspainike)) {
                naytaLatauspainike = true;
            }
            $modal.open({
                backdrop: 'static',
                templateUrl: ikkunaHtml,
                controller: function($log, $scope, $window, $modalInstance, $interval, laajennos, DokumenttiProsessinTila) {
                    cancelTimerWhenClosing = function() {
                        $interval.cancel(timer);
                    };
                    $scope.lisatiedot = lisatiedot;
                    $scope.otsikko = otsikko;
                    $scope.prosessi = {};
                    $scope.kutsuLaajennettuaMallia = function() {
                        $log.error($scope.prosessi.dokumenttiId);
                        laajennos($scope.prosessi.dokumenttiId);
                    };
                    $scope.nautaLatauspainike = function() {
                        return naytaLatauspainike;
                    };
                    $scope.update = function() {
                        DokumenttiProsessinTila.lue({id: id.id}, function(data) {
                            if(data.keskeytetty == true) {
                                cancelTimerWhenClosing();
                            }
                            $scope.prosessi = data;
                            if(data.dokumenttiId != null) {
                                $interval.cancel(timer);
                            }
                        });
                    };
                    $scope.onVirheita = function() {
                        if($scope.prosessi == null) {
                            return false;
                        } else {
                            return $scope.prosessi.keskeytetty;
                        }
                    };
                    $scope.onKesken = function() {
                        if($scope.prosessi == null) {
                            return true;
                        } else {
                            return $scope.prosessi.dokumenttiId == null;
                        }
                    };
                    $scope.getProsentit = function(t) {
                        if(t == null) {
                            return 0;
                        }
                        return t.prosentteina * 100;
                    };
                    $scope.sulje = function() {
                        DokumenttiProsessinTila.ilmoita({id: id.id, poikkeus:"Käyttäjän sulkema"});
                        $modalInstance.dismiss('cancel');
                    };
                    timer = $interval(function () {
                        $scope.update();
                    }, 1000);

                    $scope.ok = function() {
                        if($scope.onKesken()) {
                            return;
                        } else {
                            $window.location.href = "/dokumenttipalvelu-service/resources/dokumentit/lataa/" + $scope.prosessi.dokumenttiId;
                        }
                    };
                },
                resolve: {
                    laajennos: function() {
                        return laajennettuMalli;
                    }
                }
            }).result.then(function() {
                    cancelTimerWhenClosing();
                }, function() {
                    DokumenttiProsessinTila.ilmoita({id: id, poikkeus:"peruuta prosessi"});
                    cancelTimerWhenClosing();
                });

        },
        avaa: function(id, otsikko, lisatiedot, naytaLatausikkuna) {
            this.avaaKustomoitu(id,otsikko,lisatiedot,'../common/modaalinen/latausikkuna.html',{},naytaLatausikkuna);
        }
    };
}]);
