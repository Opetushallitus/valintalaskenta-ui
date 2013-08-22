
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

app.directive('modal', function() {
    return {
        restrict: "C",
        link: function($scope, element, attrs) {
            $scope.elem = $(element);

            //$(element).wrap('<div style="display: none" class="modal-backdrop"></div>');
            

            //hide element initially
            $(element).addClass("hidden");
            
            $scope.$on($scope.$id, function() {
                $(element).toggleClass("hidden");    
                var top = ($(window).height() - $(element).outerHeight()) / 2;
                var left = ($(window).width() - $(element).outerWidth()) / 2;
                $(element).css({margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});  
            });
        },
        controller: function($scope) {
            this.closeModal = function() {
                $scope.elem.toggleClass("hidden");
            }
        }
    }
}); 

app.directive('close', function() {
    return {
        restrict: "A",
        require: "^modal",
        link: function(scope, element, attrs, ctrl) {
            $(element).on('click', function() {
                ctrl.closeModal();
            });
        }
    }
});

app.directive('auth', function($q, $animator, AuthService, HakukohdeModel) {
    return {
      link : function($scope, element, attrs) {
        //the attrs object is where the ngAnimate attribute is defined
        var animator = $animator($scope, attrs);

        animator.hide(element);
        if(!attrs.authService) return;
        switch(attrs.auth) {

            case "crudOph":
                AuthService.crudOph(attrs.authService).then(function(){
                    animator.show(element);
                });
                break;

            case "updateOph":
                AuthService.updateOph(attrs.authService).then(function(){
                    animator.show(element);
                })
                break;

            case "readOph":
                AuthService.readOph(attrs.authService).then(function(){
                    animator.show(element);
                })
                break;
        }

        attrs.$observe('authOrg', function() {
            if(attrs.authOrg) {
                switch(attrs.auth) {
                    case "crud":
                        AuthService.crudOrg(attrs.authService, attrs.authOrg).then(function(){
                            animator.show(element);
                        }, function(){
                            animator.hide(element);
                        });
                        break;

                    case "update":
                        AuthService.updateOrg(attrs.authService, attrs.authOrg).then(function(){
                            animator.show(element);
                        }, function(){
                            animator.hide(element);
                        });
                        break;

                    case "read":
                        AuthService.readOrg(attrs.authService, attrs.authOrg).then(function(){
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

