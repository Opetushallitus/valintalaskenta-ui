"use strict";

app.directive('modal', function ($modal) {

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
});

app.directive('modalOpen', function () {
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
});
