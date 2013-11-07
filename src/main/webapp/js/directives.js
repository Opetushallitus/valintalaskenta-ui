
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


app.directive('itemOnScreen', function ($timeout) {
    return {
        scope: true,
        link: function ( scope, element, attrs ) {
            var oldBottom = 0;
            var oldDocument = 0;
            var checkHeight = function(){
              var docViewTop = $(window).scrollTop();
              var docViewBottom = docViewTop + $(window).height();
              var elemTop = $(element).offset().top;

              var elemBottom = elemTop + $(element).height();

              if(elemBottom < docViewBottom && oldBottom != elemBottom) {
                  scope.$apply(function() {
                      scope.lazyLoading();
                      oldBottom = elemBottom;
                  });

                  $timeout(checkHeight,10);
              }
              else {
                $(window).scroll(function(e) {
                    var documentHeight = $(document).height();
                    if($(window).scrollTop() + $(window).height() >= documentHeight * .9 && oldDocument != documentHeight) {
                        scope.$apply(function() {
                            scope.lazyLoading();
                            oldDocument = documentHeight;
                        });
                    }
                });
              }
            };
            $timeout(checkHeight,10);
        }
    };
});

app.directive('centralize', function() {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var elemWidth = element.context.offsetWidth;
            var elemHeight = element.context.offsetHeight;
            var top = Math.max(0, (($(window).height() - elemHeight) / 2) + $(window).scrollTop());
            var left = Math.max(0, (($(window).width() - elemWidth) / 2) + $(window).scrollLeft());
            $(element).css({
                margin:0, 
                top: (top > 0 ? top : 0)+'px', 
                left: (left > 0 ? left : 0)+'px'
            });
            
        }
    }
});

app.directive('smoothToggle', function($animate) {
  return function(scope, element, attrs) { 
    scope.$watch(attrs.smoothToggle, function(newVal) {
      if(newVal) {
        element.addClass('ng-show');
      } else {
        element.removeClass('ng-show');
      }
    });
  }
});


app.directive('auth', function($animate, $timeout, AuthService, HakukohdeModel) {
    return {
      link : function($scope, element, attrs) {

          $animate.addClass(element, 'ng-hide');

          var success = function() {
              if(additionalCheck()) {
                  $animate.removeClass(element, 'ng-hide');
              }
          }
          var additionalCheck = function() {
              if(attrs.authAdditionalCheck) {
                  var temp = $scope.$eval(attrs.authAdditionalCheck);
                  return temp;
              }
              return true;
          }
          $timeout(function() {
            switch(attrs.auth) {

                case "crudOph":
                    AuthService.crudOph(attrs.authService).then(success);
                    break;

                case "updateOph":
                    AuthService.updateOph(attrs.authService).then(success);
                    break;

                case "readOph":
                    AuthService.readOph(attrs.authService).then(success);
                    break;
            }
          },0);
          
          attrs.$observe('authOrg', function() {
              if(attrs.authOrg) {
                  switch(attrs.auth) {
                      case "crud":
                          AuthService.crudOrg(attrs.authService, attrs.authOrg).then(success);
                          break;

                      case "update":
                          AuthService.updateOrg(attrs.authService, attrs.authOrg).then(success);
                          break;

                      case "read":
                          AuthService.readOrg(attrs.authService, attrs.authOrg).then(success);
                          break;
                  }
              }
          });

      }
    };
});

var FLOAT_REGEXP = /^\-?([0-9]+(\.[0-9]+)?)$/;
app.directive('arvovalidaattori', function(){
    return {
        require: '?ngModel',
//        scope: {temp: '=ngModel'},
        link: function(scope, elm, attrs, ctrl) {

            var validator = function(viewValue) {
              var osallistui = $(elm.next()[0]).val() == 'OSALLISTUI';

              if (osallistui && FLOAT_REGEXP.test(viewValue)) {
                  var min = parseFloat($(elm).attr("min"));
                  var max = parseFloat($(elm).attr("max"));
                  var floatVal = parseFloat(viewValue);
                  if(!isNaN(min) && !isNaN(max) && floatVal) {
                      if(min <= floatVal && max >= floatVal) {
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
                        console.log("5");
                        $(elm).siblings("span").empty();
                        ctrl.$setValidity('arvovalidaattori', true);
                  }
                  return viewValue;

              } else {
                  // it is invalid, return undefined (no model update)
                  if(osallistui) {
                    $(elm).siblings("span").text("Arvo ei ole laillinen!");
                    ctrl.$setValidity('arvovalidaattori', false);

                    return undefined;
                  } else {
                    $(elm).siblings("span").empty();
                    ctrl.$setValidity('arvovalidaattori', true);

                    return viewValue;
                  }
              }
            };

            scope.$watch(attrs.ngModel, function() {
                validator(ctrl.$viewValue);
            });

        }
    };
});