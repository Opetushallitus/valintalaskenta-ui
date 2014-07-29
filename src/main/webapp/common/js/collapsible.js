app.directive('collapsible', [function() {
    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        template: function(tElement, tAttrs) {
            tAttrs.heading = tAttrs.heading || "";
            return "<div class='row'><div style='margin-top: 8px' ng-click='show = !show' class='col-md-12'>" +
                        "<i class='fa' ng-class='show ? \"fa-chevron-right\" : \"fa-chevron-down\"'></i><span style='padding-left: 10px; font-size: 16px; font-weight:bold'>" + tAttrs.heading + "</span>" +
                   "</div>" +
                   "<div class='col-md-12' style='padding-top: 15px' collapse='show' class='content' ng-transclude></div></div>";
        },
        link: function(scope, element, attrs) {
            scope.show = attrs.show || true;
        }
    }
}]);
