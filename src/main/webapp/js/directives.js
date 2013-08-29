
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
                    return true;
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
app.directive('lazyLoading', function () {
    return {
        scope: true,
        link: function ( scope, element, attrs ) {
        	$(element).scroll(function(e) {
        		// approximation (max scroll is in reality less than the actual
        		var maximumScroll = $(element)[0].scrollHeight - $(element).height();
        		var currentScroll = $(element).scrollTop();
        		var percentage = (currentScroll/maximumScroll);
        		if(percentage >= 1) {
        			scope.$apply(function() {
        				scope.lazyLoading();	
        			});
        			
        		}
        	});
        }
    };
});
app.directive('modal', function($animate, $rootScope) {
    return {
        restrict: "E",
        scope: false,
        link: function($scope, element, attrs) {
            //console.log(element);
            var visible = false;
            //hide all modal-elements initially
            $animate.addClass(element, 'ng-hide');

            //hide all modal-dialogs when closeModals broadcasted
            $rootScope.$on('closeModals', function() {
                $animate.addClass(element.next(), 'ng-hide');
                visible = !visible;
            });

            $scope.$on($scope.$id, function(event, param) {
                //var elem = angular.element(param.srcElement).next();
                //close all modal before open new
                $rootScope.$broadcast('closeModals');

                //var hasClass = angular.element(param.srcElement).next().hasClass('ng-hide');  
                if (!visible) {
                    $animate.removeClass(angular.element(param.srcElement).next(), 'ng-hide');
                    visible = true;
                } else {
                    $animate.addClass(angular.element(param.srcElement).next(), 'ng-hide');
                    visible = false;
                }

                //console.log($window);
                /*
                var top = ($window.outerHeight - $(element).outerHeight()) / 2;
                var left = ($window.outerWidth - $(element).outerWidth()) / 2;
                
                
                $animate.css(element, {margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});  
                */
            });
        },
        controller: function($scope, $element) {
            this.closeModal = function() {
                $animate.removeClass(element, 'ng-hide');

            }
        }
    }
}); 

app.directive('close', function() {
    return {
        restrict: "A",
        require: "modal",
        link: function(scope, element, attrs, ctrl) {
            $(element).on('click', function() {
                ctrl.closeModal();
            });
        }
    }
});

app.directive('auth', function($animate, AuthService, HakukohdeModel) {
    return {
      link : function($scope, element, attrs) {

          $animate.addClass(element, 'ng-hide');
        switch(attrs.auth) {

            case "crudOph":
                AuthService.crudOph(attrs.authService).then(function(){
                    $animate.removeClass(element, 'ng-hide');
                });
                break;

            case "updateOph":
                AuthService.updateOph(attrs.authService).then(function(){
                    $animate.removeClass(element, 'ng-hide');
                })
                break;

            case "readOph":
                AuthService.readOph(attrs.authService).then(function(){
                    $animate.removeClass(element, 'ng-hide');
                })
                break;
        }

        attrs.$observe('authOrg', function() {
            if(attrs.authOrg) {
                switch(attrs.auth) {
                    case "crud":
                        AuthService.crudOrg(attrs.authService, attrs.authOrg).then(function(){
                            $animate.removeClass(element, 'ng-hide');
                        }, function(){
                            $animate.addClass(element, 'ng-hide');
                        });
                        break;

                    case "update":
                        AuthService.updateOrg(attrs.authService, attrs.authOrg).then(function(){
                            $animate.removeClass(element, 'ng-hide');
                        }, function(){
                            $animate.addClass(element, 'ng-hide');
                        });
                        break;

                    case "read":
                        AuthService.readOrg(attrs.authService, attrs.authOrg).then(function(){
                            $animate.removeClass(element, 'ng-hide');
                        }, function(){
                            $animate.addClass(element, 'ng-hide');
                        });
                        break;
                }
            }
        });
      }
    };
});

var INTEGER_REGEXP = /^\-?\d*$/;
app.directive('arvovalidaattori', function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

        	ctrl.$parsers.unshift(function(viewValue) {
			  if (INTEGER_REGEXP.test(viewValue)) {
				  var min = parseInt($(elm).attr("min"), 10);
				  var max = parseInt($(elm).attr("max"), 10);
				  var intVal = parseInt(viewValue, 10);
				  if(!isNaN(min) && !isNaN(max) && intVal) {
					  if(min <= intVal && max >= intVal) {
						// it is valid
						$(elm).siblings("span").empty();
						ctrl.$setValidity('arvovalidaattori', true);
					  } else {
						  // not in range
						  $(elm).siblings("span").text("Arvo ei ole välillä " + min + " - " + max);
						  ctrl.$setValidity('arvovalidaattori', false);
					  }
				  } else {
					// it is valid
						$(elm).siblings("span").empty();
						ctrl.$setValidity('arvovalidaattori', true);
				  }

				  return viewValue;
			  } else {
				  // it is invalid, return undefined (no model update)

				  $(elm).siblings("span").text("Arvo ei ole laillinen!");
				  ctrl.$setValidity('arvovalidaattori', false);
			      return undefined;
			  }
            });
        }
    };
});
