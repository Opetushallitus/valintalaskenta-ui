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
            hakukohdeModel: '=',
            valintatapajonoOid: '=',
            enabled: '=',
            hakemus: '=',
            hakutoiveet: '=',
            haku: '='
        },
        templateUrl: '../common/html/sijoitteluVastaanottoTila.html',
        link: function ($scope) {

        },
        controller: function ($scope, VastaanottoTila, HakemuksenVastaanottoTila, $modal) {

            $scope.show = function () {
                if ($scope.enabled) {
                    $modal.open({
                        scope: $scope,
                        templateUrl: '../common/html/sijoitteluVastaanottoTilaModal.html',
                        controller: function ($scope, $window, $modalInstance, Ilmoitus, Korkeakoulu, AuthService) {

                            $scope.update = function () {
                                if ($scope.hakemus) {
                                    var tilaParams = {
                                        hakuoid: $scope.hakuOid,
                                        hakukohdeOid: $scope.hakukohdeOid,
                                        valintatapajonoOid: $scope.valintatapajonoOid,
                                        hakemusOid: $scope.hakemus.hakemusOid,
                                        selite: $scope.hakemus.selite
                                    };

                                    $scope.selite = "";
                                    if ($scope.hakemus.muokattuVastaanottoTila === "") {
                                        $scope.hakemus.muokattuVastaanottoTila = "KESKEN";
                                    }
                                    if ($scope.hakemus.muokattuIlmoittautumisTila === "") {
                                        $scope.hakemus.muokattuIlmoittautumisTila = "EI_TEHTY";
                                    }
                                    if ($scope.hakemus.hyvaksyttyVarasijalta === "") {
                                        $scope.hakemus.hyvaksyttyVarasijalta = false;
                                    }
                                    var tilaObj = {
                                        valintatapajonoOid: $scope.valintatapajonoOid,
                                        hakemusOid: $scope.hakemus.hakemusOid,
                                        tila: $scope.hakemus.muokattuVastaanottoTila,
                                        ilmoittautumisTila: $scope.hakemus.muokattuIlmoittautumisTila,
                                        julkaistavissa: true,
                                        hyvaksyttyVarasijalta: $scope.hakemus.hyvaksyttyVarasijalta
                                    };

                                    VastaanottoTila.post(tilaParams, [tilaObj], function (result) {
                                        setVastaanottoTila($scope.hakemus, tilaParams);
                                    }, function (error) {
                                        $scope.error = error;
                                    });
                                }
                            };

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
                            };

                            $scope.sulje = function () {
                                $modalInstance.dismiss('cancel');
                            };


                            $scope.showEhdollisesti = function () {
                                var returnValue = false;

                                if ($scope.hakemus && $scope.hakemus.showEhdollisesti) {
                                    returnValue = $scope.hakemus.showEhdollisesti;
                                }
                                return returnValue;
                            };

                            $scope.showSitovasti = function () {
                                var returnValue = false;

                                if ($scope.hakemus && $scope.hakemus.showSitovasti) {
                                    returnValue = $scope.hakemus.showSitovasti;
                                }
                                return returnValue;
                            };

                            $scope.isKorkeakoulu = function () {
                                return Korkeakoulu.isKorkeakoulu($scope.haku.kohdejoukkoUri);
                            };


                        },
                        resolve: {

                        }
                    }).result.then(function () {
                        }, function () {
                        });

                }
            };

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
                            var kriteerit = $scope.jonosija.jarjestyskriteerit;
                            for (var i = 0; i < kriteerit.length; i++) {
                                var numero = Number(i + 1);
                                var name =  numero + ". " + kriteerit[i].nimi;
                                var obj = {name: name, value: i};
                                if (i == 0) {
                                    //var obj = {name: "Yhteispisteet", value: i};
                                    $scope.jonosija.muokkaus.jarjestyskriteeriPrioriteetti = obj;
                                    //$scope.jonosija.muokkaus.prioriteetit.push(obj);
                                }
                                $scope.jonosija.muokkaus.prioriteetit.push(obj);
                            }

                            $scope.jonosija.muokkaus.tila = $scope.jonosija.tuloksenTila;
                            $scope.jonosija.muokkaus.arvo = $scope.jonosija.jarjestyskriteerit[0].arvo;
                            if($scope.jonosija.jarjestyskriteerit[0].kuvaus.FI) {
                                $scope.jonosija.muokkaus.selite = $scope.jonosija.jarjestyskriteerit[0].kuvaus.FI;
                            }


                            $scope.alustaTilat = function() {
                                var prio = $scope.jonosija.muokkaus.jarjestyskriteeriPrioriteetti.value;
                                $scope.jonosija.muokkaus.tila = $scope.jonosija.jarjestyskriteerit[prio].tila;
                                $scope.jonosija.muokkaus.arvo = $scope.jonosija.jarjestyskriteerit[prio].arvo;
                                if($scope.jonosija.jarjestyskriteerit[prio].kuvaus.FI) {
                                    $scope.jonosija.muokkaus.selite = $scope.jonosija.jarjestyskriteerit[prio].kuvaus.FI;
                                } else {
                                    $scope.jonosija.muokkaus.selite = "";
                                }
                            }

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

                            $scope.remove = function () {

                                var updateParams = {
                                    valintatapajonoOid: $scope.valintatapajonoOid,
                                    hakemusOid: $scope.hakemusOid,
                                    jarjestyskriteeriprioriteetti: $scope.jonosija.muokkaus.jarjestyskriteeriPrioriteetti.value
                                };

                                JarjestyskriteeriMuokattuJonosija.remove(updateParams, function (result) {
                                    $modalInstance.close(result);
                                    Ilmoitus.avaa("Poisto onnistui", "Muokattu järjestyskritteri on poistettu.");
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

app.directive('ngDebounce', function($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 99,
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input');

            var debounce;
            elm.bind('input', function() {
                $timeout.cancel(debounce);
                debounce = $timeout( function() {
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(elm.val());
                    });
                }, attr.ngDebounce || 1000);
            });
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }

    }
});

app.directive('paginationPagesize', function () {
    return {
        restrict: 'E',
        scope: {
            pageSize: '='
        },
        templateUrl: '../common/html/items-dropdown.html',
        controller: function ($scope) {
            $scope.itemsInDropdown = [{value:100000, text:"Kaikki"}, {value:20, text:"20 kpl"}, {value:50, text:"50 kpl"},
                {value:100,text:"100 kpl"},{value:200, text:"200 kpl"}, {value:500, text:"500 kpl"}];
        }

    };
});


app.directive('muokattuVastaanottoTila', function () {
    "use strict";
    return {
        restrict: 'E',
        scope: {
            haku: '=',
            hakemus: '='
        },
        templateUrl: '../common/html/muokattuvastaanottotila.html',
        controller: function ($scope, AuthService, Korkeakoulu) {
            $scope.hakemuksenMuokattuVastaanottoTilat = [
                {value: "KESKEN", text_prop: "sijoitteluntulos.kesken", default_text:"Kesken"},
                {value: "VASTAANOTTANUT", text_prop: "sijoitteluntulos.vastaanottanut", default_text:"Vastaanottanut"},
                {value: "EHDOLLISESTI_VASTAANOTTANUT", text_prop: "sijoitteluntulos.ehdollisesti", default_text:"Ehdollisesti vastaanottanut"},
                {value: "VASTAANOTTANUT_SITOVASTI", text_prop: "sijoitteluntulos.vastaanottanutsitovasti", default_text:"Vastaanottanut sitovasti"},
                {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text_prop: "sijoitteluntulos.eivastaanotettumaaraaikana", default_text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
                {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"},
                {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"}
            ];


            AuthService.updateOph("APP_VALINTOJENTOTEUTTAMINEN").then(function(){
                $scope.updateOph = true;
            });

            $scope.isEditable = function () {
                var returnValue = false;

                if ($scope.isKorkeakoulu() || !$scope.hakemus || !$scope.isKorkeakoulu() &&
                    $scope.hakemus.muokattuVastaanottoTila === "PERUUTETTU" && $scope.updateOph ||
                    !$scope.isKorkeakoulu() && $scope.hakemus.muokattuVastaanottoTila !== "PERUUTETTU") {
                    returnValue = true;
                }
                return returnValue;
            };

            $scope.isKorkeakoulu = function () {
                return Korkeakoulu.isKorkeakoulu($scope.haku.kohdejoukkoUri);
            };
        }

    };
});



app.directive('showSijoittelunTila', function () {
    return {
        restrict: 'E',
        scope: {
            hakemus: '=',
            userLang: '='
        },
        templateUrl: '../common/html/showSijoittelunTila.html',
        controller: function ($modal, $scope) {


        }
    };
});

app.directive('showVastaanottanutTila', function () {
    return {
        restrict: 'E',
        scope: {
            logEntries: '='
        },
        templateUrl: '../common/html/showVastaanottanutTila.html',
        controller: function ($modal, $scope) {

        }
    };
});

app.directive('tilaFilter', function () {
    return {
        restrict: 'E',
        scope: {
            tilaFilterValue: '=',
            filterValues: '='
        },
        templateUrl: '../common/html/tilaFilter.html',
        controller: function ($modal, $scope) {

        }
    };
});