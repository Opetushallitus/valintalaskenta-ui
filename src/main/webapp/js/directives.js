
/**
 * JQuery Nestable drag'n'drop tree.
 */
app.directive('jqNestable', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var options = scope.$eval(attrs.jqNestable) || {}
            $(element[0]).nestable({
                group: 1,
                listNodeName: 'ul',
                rootClass: 'gradingformula',
                handleClass: 'icon',
                dragClass: 'gradingformula-dragged',
                placeClass: 'placeholder',
                emptyClass: 'empty',
                listClass: 'list',
                itemClass: 'item',
                maxDepth: 25,
                canDrop: function(pointEl) {
                    console.log(pointEl)
                    return true
                }
            })

            if(typeof options.onChange === 'function') {
                $(element[0]).on('change', function(e, dragged) {
                    // TODO: Voisi innostuessaan tehdä jotain geneerisempää
                    // Haetaan pudotetun elementin scope ja sieltä paikallinen muuttuja 'funktio', asetettu laskentakaavalomake.html:ssä.
                    var draggedFunction = dragged.scope().funktio
                    // Haetaan edellinen parent model
                    var oldParentFunktio = dragged.scope().parent
                    // Haetaan uuden parentin scopesta muuttuja funktio
                    var newParentEl = dragged.parent().parent()
                    var newParentFunktio = newParentEl.scope().funktio
                    var index = dragged.index()
                    options.onChange(draggedFunction, oldParentFunktio, newParentFunktio, index)

                    // Korjataan haamuelementti
                    dragged.remove()

                    $(newParentEl).scope().$apply()
                })
            }
        }
    }
});

app.directive('toggletoolbar', function() {
    return {
      restrict: 'A',
      controller: function($scope) {    
        $scope.toolbarContainer = {};
        $scope.contentContainer = {};
        $scope.toolbarContent = {};
        $scope.toolbarBtnContainer = {};

        $scope.expandedToolbar = true;

         //toolbar size
        $scope.largeToolbarSize = "grid16-5";
        $scope.smallToolbarSize = "grid16-1";

        //content size
        $scope.largeContentSize = "grid16-15";
        $scope.smallContentSize = "grid16-11";

        this.setToolbarContainer = function(element) {
            $scope.toolbarContainer = element;
        }

        this.setContentContainer = function(element) {
            $scope.contentContainer = element;
        }

        this.setToolbarContent = function(element) {
            $scope.toolbarContent = element;
        }

        this.setToolbarBtnContainer = function(element) {
            $scope.toolbarBtnContainer = element;
            element.bind('click', function() {
                toggleClasses();
                toggleVisibility();
                $scope.expandedToolbar = !$scope.expandedToolbar;
            });
        }

        function toggleVisibility() {
            if($scope.expandedToolbar) {
              $scope.toolbarContent.hide();
              $scope.toolbarBtnContainer.removeClass("width-10").addClass("width-100");
            } else {
              $scope.toolbarContent.show();
              $scope.toolbarBtnContainer.removeClass("width-100").addClass("width-10");
            }
        }

        function toggleClasses() {
            if($scope.expandedToolbar) {
              $scope.toolbarContainer.removeClass($scope.largeToolbarSize).addClass($scope.smallToolbarSize);
              $scope.contentContainer.removeClass($scope.smallContentSize).addClass($scope.largeContentSize); 
            } else {
              $scope.toolbarContainer.removeClass($scope.smallToolbarSize).addClass($scope.largeToolbarSize);
              $scope.contentContainer.removeClass($scope.largeContentSize).addClass($scope.smallContentSize);
            }    
        }

      }
    }
});



app.directive('toolbarcontainer', function() {
    return {
        restrict: 'A',
        require: '^toggletoolbar',
        link: function(scope, element, attrs, ctrl) {
            ctrl.setToolbarContainer(element);
        }
    }
});

app.directive('contentcontainer', function() {
    return {
        restrict: 'A',
        require: '^toggletoolbar',
        link: function(scope, element, attrs, ctrl) {
            ctrl.setContentContainer(element);
        }
    }
});

app.directive('toolbarcontent', function() {
    return {
        restrict: 'A',
        require: '^toggletoolbar',
        link: function(scope, element, attrs, ctrl) {
            ctrl.setToolbarContent(element);
        }
    }
});

app.directive('toolbarbtncontainer', function() {
    return {
        restrict: 'A',
        require: '^toggletoolbar',
        link: function(scope, element, attrs, ctrl) {
            ctrl.setToolbarBtnContainer(element);
        }
    }
});


app.directive('uiSortable', function() {
    var options;
    options = {};
    return {
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        var onStart, onUpdate, opts, _start, _update;
        opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
        if (ngModel != null) {
          onStart = function(e, ui) {
            return ui.item.data('ui-sortable-start', ui.item.index());
          };
          onUpdate = function(e, ui) {
            var end, start;
            start = ui.item.data('ui-sortable-start');
            end = ui.item.index();
            ngModel.$modelValue.splice(end, 0, ngModel.$modelValue.splice(start, 1)[0]);

            return scope.$apply();
          };
          _start = opts.start;
          opts.start = function(e, ui) {
            onStart(e, ui);
            if (typeof _start === "function") {
              _start(e, ui);
            }
            return scope.$apply();
          };
          _update = opts.update;
          opts.update = function(e, ui) {
            onUpdate(e, ui);
            if (typeof _update === "function") {
              _update(e, ui);
            }
            return scope.$apply();
          };
        }
        return element.sortable(opts);
      }
    };
  }
);

// tabs
app.directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        var panes = $scope.panes = [];

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        }

        this.addPane = function(pane) {
          if (panes.length == 0) $scope.select(pane);
          panes.push(pane);
        }
      },
      template:
        '<div class="tabsheet-container">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
});

app.directive('pane', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
});

app.directive('auth', function($q, $animator, AuthService, HakukohdeModel) {
    return {
      link : function($scope, element, attrs) {
        //the attrs object is where the ngAnimate attribute is defined
        var animator = $animator($scope, attrs);
        var show = $q.deferred;
        animator.hide(element);

        switch(attrs.auth) {

            case "crudOph":
                AuthService.crudOph().then(function(){
                    animator.show(element);
                });
                break;

            case "updateOph":
                AuthService.updateOph().then(function(){
                    animator.show(element);
                })
                break;

            case "readOph":
                AuthService.readOph().then(function(){
                    animator.show(element);
                })
                break;
        }

        attrs.$observe('authOrg', function() {
            if(attrs.authOrg) {
                switch(attrs.auth) {
                    case "crud":
                        AuthService.crudOrg(attrs.authOrg).then(function(){
                            animator.show(element);
                        }, function(){
                            animator.hide(element);
                        });
                        break;

                    case "update":
                        AuthService.updateOrg(attrs.authOrg).then(function(){
                            animator.show(element);
                        }, function(){
                            animator.hide(element);
                        });
                        break;

                    case "read":
                        AuthService.readOrg(attrs.authOrg).then(function(){
                            animator.show(element);
                        }, function(){
                            animator.hide(element);
                        });
                        break;
                }
            }
        });
      }
    };
});

