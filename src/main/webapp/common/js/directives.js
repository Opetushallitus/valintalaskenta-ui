"use strict";
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


app.directive('auth', function($animate, $timeout, AuthService) {
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

                      default:
                          AuthService.check(attrs.auth.split(" "), attrs.authService, attrs.authOrg).then(success);
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
              if(viewValue) {
                viewValue = viewValue.replace(",", ".");
              }
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

app.directive('sijoitteluVastaanottoTila', function() {
    return {
        restrict: 'E',
        scope: {
            hakuOid: '=',
            hakukohdeOid: '=',
            valintatapajonoOid: '=',
            enabled: '=',
            hakemus: '='
        },
        templateUrl: '../common/html/sijoitteluVastaanottoTila.html',
        controller: function($scope, VastaanottoTila){
            // Errors.html haluaa errorit modeliin
            $scope.model = {errors: []};

            $scope.show = function() {
                if($scope.enabled) {
                    $scope.showForm = !$scope.showForm;
                }
            }

            $scope.update = function() {
                var tilaParams = {
                    hakuoid: $scope.hakuOid,
                    hakukohdeOid: $scope.hakukohdeOid,
                    valintatapajonoOid: $scope.valintatapajonoOid,
                    hakemusOid: $scope.hakemus.hakemusOid,
                    selite: $scope.hakemus.selite
                }
                $scope.selite = "";
                if($scope.hakemus.muokattuVastaanottoTila == "") {
                    $scope.hakemus.muokattuVastaanottoTila = null;
                }
                var tilaObj = {tila: $scope.hakemus.muokattuVastaanottoTila};

                VastaanottoTila.post(tilaParams, tilaObj, function() {
                    setVastaanottoTila($scope.hakemus,tilaParams);
                }, function(error) {
                    $scope.model.errors.push(error);
                });
            }

            var setVastaanottoTila = function(hakemus, tilaParams) {
                VastaanottoTila.get(tilaParams, function(result) {
                    if(!result.tila) {
                        hakemus.vastaanottoTila = "";
                        hakemus.muokattuVastaanottoTila ="";
                    } else {
                        hakemus.vastaanottoTila = result.tila;
                        hakemus.muokattuVastaanottoTila =   result.tila;
                    }
                    $scope.show();
                }, function(error) {
                    $scope.model.errors.push(error);
                });
            }

        }
    };
});

app.directive('harkinnanvarainenTila', function() {
    return {
        restrict: 'E',
        scope: {
            hakuOid: '=',
            hakukohdeOid: '=',
            enabled: '=',
            hakemus: '='
        },
        templateUrl: '../common/html/harkinnanvarainenTila.html',
        controller: function($scope, HarkinnanvaraisestiHyvaksytty, HarkinnanvarainenHyvaksynta){
            // Errors.html haluaa errorit modeliin
            $scope.model = {errors: []};

            $scope.show = function() {
                if($scope.enabled) {
                    $scope.showForm = !$scope.showForm;
                }
            }

            $scope.update = function() {

                var updateParams = {
                    hakuOid: $scope.hakuOid,
                    hakukohdeOid: $scope.hakukohdeOid,
                    hakemusOid: $scope.hakemus.hakemusOid
                }

                var postParams = {
                    harkinnanvaraisuusTila: $scope.hakemus.muokattuHarkinnanvaraisuusTila
                };

                HarkinnanvarainenHyvaksynta.post(updateParams, postParams, function() {
                    setTila(updateParams);
                }, function(error) {
                    $scope.model.errors.push(error);
                });
            }

            var setTila = function(updateParams) {

                HarkinnanvaraisestiHyvaksytty.get(updateParams, function (result) {

                    result.forEach(function(harkinnanvarainen){
                        if ($scope.hakukohdeOid == harkinnanvarainen.hakukohdeOid) {
                            $scope.hakemus.muokattuHarkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                            $scope.hakemus.harkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                        }
                    });

                    $scope.show();

                }, function (error) {
                    model.errors.push(error);
                });
            }

        }
    };
});

app.directive('jarjestyskriteeriMuokkaus', function() {
    return {
        restrict: 'E',
        scope: {
            valintatapajonoOid: '=',
            hakemusOid: '=',
            enabled: '=',
            jonosija: '='
        },
        templateUrl: '../common/html/muutaJarjestyskriteeri.html',
        controller: function($scope, $route, JarjestyskriteeriMuokattuJonosija){
            // Errors.html haluaa errorit modeliin
            $scope.model = {errors: []};

            if($scope.jonosija.tuloksenTila == 'HYVAKSYTTY_HARKINNANVARAISESTI') {
                $scope.harkinnanvarainen = true;
            }

            $scope.show = function() {
                if($scope.enabled) {
                    $scope.jonosija.muokkaus = {};
                    $scope.jonosija.muokkaus.prioriteetit = [];
                    for(var i in $scope.jonosija.jarjestyskriteerit) {
                        if(i == 0) {
                            var obj = {name: "Yhteispisteet", value: i};
                            $scope.jonosija.muokkaus.jarjestyskriteeriPrioriteetti = obj;
                            $scope.jonosija.muokkaus.prioriteetit.push(obj);
                        }
                        else {
                            var obj = {name: i, value: i};
                            $scope.jonosija.muokkaus.prioriteetit.push(obj);
                        }
                    }

                    $scope.jonosija.muokkaus.tila = $scope.jonosija.tuloksenTila;
                    $scope.jonosija.muokkaus.arvo = $scope.jonosija.jarjestyskriteerit[0].arvo;

                    $scope.showForm = !$scope.showForm;
                }
            }

            $scope.update = function() {

                var updateParams = {
                    valintatapajonoOid: $scope.valintatapajonoOid,
                    hakemusOid: $scope.hakemusOid,
                    jarjestyskriteeriprioriteetti: $scope.jonosija.muokkaus.jarjestyskriteeriPrioriteetti.value
                }

                var postParams = {
                    tila: $scope.jonosija.muokkaus.tila,
                    arvo: $scope.jonosija.muokkaus.arvo,
                    selite: $scope.jonosija.muokkaus.selite
                };

                JarjestyskriteeriMuokattuJonosija.post(updateParams, postParams, function() {
                    // resurssi palauttaa hakemukset muutoksen jälkeen todennäköisesti eri järjestyksessä
                    $route.reload();
                }, function (error) {
                    $scope.model.errors.push(error);
                });


            }
        }
    };
});

app.directive('showPersonInformation', function() {
    return {
        restrict: 'E',
        scope: {
            sukunimi: '@',
            etunimi: '@',
            hakemusOid: '@',
            hakuOid: '@',
            henkiloOid: '@'
        },
        templateUrl: '../common/html/personInformationPartial.html',
        controller: function($scope){
            $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

            $scope.show = function() {
                $scope.showInfo = !$scope.showInfo;
            }

        }
    };
});