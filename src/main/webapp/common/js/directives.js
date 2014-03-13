"use strict";
app.directive('lazyLoading', function () {
    return {
        scope: true,
        link: function (scope, element, attrs) {
            $(element).scroll(function (e) {
                // approximation (max scroll is in reality less than the actual
                var maximumScroll = $(element)[0].scrollHeight - $(element).height();
                var currentScroll = $(element).scrollTop();
                var percentage = (currentScroll / maximumScroll);

                if (percentage >= 1) {
                    scope.$apply(function () {
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
        link: function (scope, element, attrs) {
            var oldBottom = 0;
            var oldDocument = 0;
            var checkHeight = function () {
                var docViewTop = $(window).scrollTop();
                var docViewBottom = docViewTop + $(window).height();
                var elemTop = $(element).offset().top;

                var elemBottom = elemTop + $(element).height();

                if (elemBottom < docViewBottom && oldBottom != elemBottom) {
                    scope.$apply(function () {
                        scope.lazyLoading();
                        oldBottom = elemBottom;
                    });

                    $timeout(checkHeight, 10);
                }
                else {
                    $(window).scroll(function (e) {
                        var documentHeight = $(document).height();
                        if ($(window).scrollTop() + $(window).height() >= documentHeight * .9 && oldDocument != documentHeight) {
                            scope.$apply(function () {
                                scope.lazyLoading();
                                oldDocument = documentHeight;
                            });
                        }
                    });
                }
            };
            $timeout(checkHeight, 10);
        }
    };
});

app.directive('centralize', function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var elemWidth = element.context.offsetWidth;
            var elemHeight = element.context.offsetHeight;
            var top = Math.max(0, (($(window).height() - elemHeight) / 2) + $(window).scrollTop());
            var left = Math.max(0, (($(window).width() - elemWidth) / 2) + $(window).scrollLeft());
            $(element).css({
                margin: 0,
                top: (top > 0 ? top : 0) + 'px',
                left: (left > 0 ? left : 0) + 'px'
            });

        }
    }
});

app.directive('privileges', function ($q, $rootScope, $animate, ParametriService) {
	return {
        link: function ($scope, element, attrs) {
			$animate.addClass(element, 'ng-hide');
			ParametriService.value(function(data) {
				$rootScope.privileges = data;
			});
			$rootScope.$watch('privileges', function(newValue, oldValue) {
            	if(newValue) {
	            	if(newValue[attrs.privileges]) {
	            		$animate.removeClass(element, 'ng-hide');
	            	}
            	}
           	});
            
        }
	};
});

app.directive('auth', function ($animate, $timeout, AuthService, ParametriService) {
    return {
        link: function ($scope, element, attrs) {

            $animate.addClass(element, 'ng-hide');

            var success = function () {
                if (attrs.authAdditionalCheck) {

                    ParametriService.promise().then(function (data) {
                        if (data[attrs.authAdditionalCheck]) {
                            $animate.removeClass(element, 'ng-hide');
                        }
                    });

                } else {
                    $animate.removeClass(element, 'ng-hide');
                }
            }

            $timeout(function () {
                switch (attrs.auth) {

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
            }, 0);

            attrs.$observe('authOrg', function () {
                if (attrs.authOrg) {
                    switch (attrs.auth) {
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
app.directive('arvovalidaattori', function () {
    return {
        require: '?ngModel',
//        scope: {temp: '=ngModel'},
        link: function (scope, elm, attrs, ctrl) {

            var validator = function (viewValue) {
                if (viewValue) {
                    viewValue = viewValue.replace(",", ".");
                }
                var osallistui = scope.$eval(attrs.osallistuminen) == 'OSALLISTUI';

                if (osallistui && FLOAT_REGEXP.test(viewValue)) {
                    var min = parseFloat($(elm).attr("min"));
                    var max = parseFloat($(elm).attr("max"));
                    var floatVal = parseFloat(viewValue);
                    if (!isNaN(min) && !isNaN(max) && floatVal) {
                        if (min <= floatVal && max >= floatVal) {
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
                    if (osallistui) {
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

            scope.$watch(attrs.ngModel, function () {
                validator(ctrl.$viewValue);
            });

            scope.$watch(attrs.osallistuminen, function () {
                validator(ctrl.$viewValue);
            });

        }
    };
});

app.directive('sijoitteluVastaanottoTila', function () {
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
        controller: function ($scope, VastaanottoTila, HakemuksenVastaanottoTila, $modal) {

            $scope.show = function () {
                $modal.open({
                    scope: $scope,
                    templateUrl: '../common/html/sijoitteluVastaanottoTilaModal.html',
                    controller: function ($scope, $window, $modalInstance, Ilmoitus) {
                        $scope.update = function () {
                            var tilaParams = {
                                hakuoid: $scope.hakuOid,
                                hakukohdeOid: $scope.hakukohdeOid,
                                valintatapajonoOid: $scope.valintatapajonoOid,
                                hakemusOid: $scope.hakemus.hakemusOid,
                                selite: $scope.hakemus.selite
                            }
                            $scope.selite = "";
                            if ($scope.hakemus.muokattuVastaanottoTila == "") {
                                $scope.hakemus.muokattuVastaanottoTila = null;
                            }
                            var tilaObj = {
                                valintatapajonoOid: $scope.valintatapajonoOid,
                                hakemusOid: $scope.hakemus.hakemusOid,
                                tila: $scope.hakemus.muokattuVastaanottoTila
                            };

                            VastaanottoTila.post(tilaParams, [tilaObj], function (result) {

                                setVastaanottoTila($scope.hakemus, tilaParams);
                            }, function (error) {
                                $scope.error = error;
                            });
                        }

                        var setVastaanottoTila = function (hakemus, tilaParams) {
                            HakemuksenVastaanottoTila.get(tilaParams, function (result) {
                                if (!result.tila) {
                                    hakemus.vastaanottoTila = "";
                                    hakemus.muokattuVastaanottoTila = "";
                                } else {
                                    hakemus.vastaanottoTila = result.tila;
                                    hakemus.muokattuVastaanottoTila = result.tila;
                                }
                                $modalInstance.close(result)
                                Ilmoitus.avaa("Tallennus onnistui", "Sijoittelun vastaanottotila muutettu.");
                            }, function (error) {
                                $scope.error = error;
                            });
                        }

                        $scope.sulje = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {

                    }
                }).result.then(function () {
                    }, function () {
                    });
            }

        }
    };
});

app.directive('harkinnanvarainenTila', function () {
    return {
        restrict: 'E',
        scope: {
            hakuOid: '=',
            hakukohdeOid: '=',
            enabled: '=',
            hakemus: '='
        },
        templateUrl: '../common/html/harkinnanvarainenTila.html',
        controller: function ($scope, $modal, HarkinnanvaraisestiHyvaksytty, HarkinnanvarainenHyvaksynta) {

            $scope.show = function () {
                $modal.open({
                    scope: $scope,
                    templateUrl: '../common/html/harkinnanvarainenTilaModal.html',
                    controller: function ($scope, $window, $modalInstance, Ilmoitus) {
                        $scope.update = function () {

                            var postParams = {
                                hakuOid: $scope.hakuOid,
                                hakukohdeOid: $scope.hakukohdeOid,
                                hakemusOid: $scope.hakemus.hakemusOid,
                                harkinnanvaraisuusTila: $scope.hakemus.muokattuHarkinnanvaraisuusTila
                            }

                            HarkinnanvarainenHyvaksynta.post({}, [postParams], function () {

                                setTila(postParams);
                            }, function (error) {
                                $scope.error = error;
                            });
                        }

                        var setTila = function (params) {

                            HarkinnanvaraisestiHyvaksytty.get(params, function (result) {

                                result.forEach(function (harkinnanvarainen) {
                                    if ($scope.hakukohdeOid == harkinnanvarainen.hakukohdeOid) {
                                        $scope.hakemus.muokattuHarkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                                        $scope.hakemus.harkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                                    }
                                });

                                $modalInstance.close(result)
                                Ilmoitus.avaa("Tallennus onnistui", "Harkinnavaraisuuden tila muutettu.");
                            }, function (error) {
                                $scope.error = error;
                            });
                        }

                        $scope.sulje = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {

                    }
                }).result.then(function () {
                    }, function () {
                    });
            }

        }
    };
});

app.directive('jarjestyskriteeriMuokkaus', function () {
    return {
        restrict: 'E',
        scope: {
            valintatapajonoOid: '=',
            hakemusOid: '=',
            enabled: '=',
            jonosija: '='
        },
        templateUrl: '../common/html/muutaJarjestyskriteeri.html',
        controller: function ($scope, $route, JarjestyskriteeriMuokattuJonosija, $modal) {

            if ($scope.jonosija.tuloksenTila == 'HYVAKSYTTY_HARKINNANVARAISESTI') {
                $scope.harkinnanvarainen = true;
            }

            $scope.show = function () {
                if ($scope.enabled) {
                    $modal.open({
                        scope: $scope,
                        templateUrl: '../common/html/muutaJarjestyskriteeriModal.html',
                        controller: function ($scope, $window, $modalInstance, Ilmoitus) {

                            $scope.jonosija.muokkaus = {};
                            $scope.jonosija.muokkaus.prioriteetit = [];
                            for (var i in $scope.jonosija.jarjestyskriteerit) {
                                if (i == 0) {
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

                            $scope.update = function () {

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

                                JarjestyskriteeriMuokattuJonosija.post(updateParams, postParams, function (result) {
                                    $modalInstance.close(result)
                                    Ilmoitus.avaa("Tallennus onnistui", "Järjestyskriteerin tila muutettu.");
                                    // resurssi palauttaa hakemukset muutoksen jälkeen todennäköisesti eri järjestyksessä
                                    $route.reload();
                                }, function (error) {
                                    $scope.error = error;
                                });
                            }

                            $scope.sulje = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {

                        }
                    }).result.then(function () {
                        }, function () {
                        });
                }

            }


        }
    };
});

app.directive('showPersonInformation', function () {
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
        controller: function ($modal, $scope) {
            $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

            $scope.show = function () {
                $modal.open({
                    scope: $scope,
                    templateUrl: '../common/html/personInformationModal.html',
                    controller: function ($scope, $window, $modalInstance) {

                        $scope.sulje = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {

                    }
                }).result.then(function () {
                    }, function () {
                    });
            }

        }
    };
});

// https://github.com/kseamon/fast-bind/blob/master/src/directives/bind-once/bind-once.js
app.directive('fastBindOnce', ['$parse', function ($parse) {
    return {
        compile: function compile(element, attributes) {
            var expr = $parse(attributes.fastBindOnce);

            return function link(scope, element) {
                element.text(expr(scope));
            };
        }
    };
}]);

app.directive('stayOnFocus', ['$parse', function () {
    var selectedElement;
    var selectedInput;
    var index = 0;
    var max = 0;

    return {
        controller: function ($scope, $document, $timeout) {
            index = 0;
            $timeout(function () {
                selectedInput = selectedElement.find('input');
                max = selectedInput.length - 1;
                if(selectedInput && selectedInput[index]) {
                    selectedInput[index].focus();
                }

                var checkKeys = function (evt) {
                    var focused = selectedElement.find(':focus');
                    if(!focused.is('input')) {
                        console.log("return");
                        return;
                    }
                    selectedInput.each(function(i){
                        if(focused[0] == selectedInput[i]) {
                            index = i;
                            return false;
                        }
                    });

                    var select = 0;
                    switch (evt.keyCode) {
//                        case 37:
//                            index-=1;
//                            if(index < 0) {
//                                index = 0;
//                            }
//                            break;
                        case 38:

                            select -= 1;
                            break;
//                        case 39:
//                            index+=1;
//                            if(index > max) {
//                                index = max;
//                            }
//                            break;
                        case 40:

                            select = 1;
                            break;
                    }

                    if(select) {

                        selectedInput = selectedElement.find('input');
                        max = selectedInput.length - 1;
                        var startPos = index;

                        var selectNext = function() {
                            var mult = 1;
                            if(evt.shiftKey) {
                                mult = 10;
                            } else if(evt.altKey) {
                                mult = 50;
                            }
                            index += select * mult;

                            if(index < 0) {
                                index = max;
                            }
                            if(index > max) {
                                index = 0;
                            }

                            return selectedInput[index];
                        };
                        var loopy;
                        do {
                            loopy = false;
                            var next = selectNext();
                            _.filter(next.classList, function(clazz){
                                if(clazz == 'ng-hide'){
                                    loopy = true;
                                }
                            });

                            if(index == startPos) {
                                console.log("loopparna");
                                return;
                            }
                        } while(loopy)

                        next.focus();
                    }
                };

                $document.bind('keydown', checkKeys);

                $scope.$on(
                    "$destroy",
                    function (event) {
                        $document.unbind("keydown", checkKeys);
                    }
                );
            });
        },
        link: function (scope, elem, attr) {
            selectedElement = $(elem);
        }
    };
}]);