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

app.directive('resolveNamesFromTarjonta', function ($http, $q) {
    function replaceOid(oid, message, kielistysObject) {
        if (kielistysObject.kieli_fi) {
            return message.replace(oid, kielistysObject.kieli_fi + ' (' + oid + ')')
        } else if (kielistysObject.kieli_sv) {
            return message.replace(oid, kielistysObject.kieli_sv + ' (' + oid + ')')
        } else if (kielistysObject.kieli_en) {
            return message.replace(oid, kielistysObject.kieli_en + ' (' + oid + ')')
        }
        return message
    }
    
    function fetchHaku(haku, hakuQ) {
        if (haku) {
            $http.get('/tarjonta-service/rest/v1/haku/' + encodeURIComponent(haku), {cache: true}).then(function (result) {
                if (result && result.data && result.data.result && result.data.result.nimi) {
                    hakuQ.resolve(result.data.result.nimi)
                } else {
                    hakuQ.resolve(null)
                }
            }, function (error) {
                hakuQ.reject(error)
            })
        } else {
            hakuQ.resolve(null)
        }
        return hakuQ.promise
    }

    function fetchHakukohde(hakukohde, hakukohdeQ) {
        if (hakukohde) {
            $http.get('/tarjonta-service/rest/v1/hakukohde/' + encodeURIComponent(hakukohde), {cache: true}).then(function (result) {
                if (result && result.data && result.data.result && result.data.result.hakukohteenNimet) {
                    hakukohdeQ.resolve(result.data.result.hakukohteenNimet)
                } else {
                    hakukohdeQ.resolve(null)
                }
            }, function (error) {
                hakukohdeQ.reject(error)
            })
        } else {
            hakukohdeQ.resolve(null)
        }
        return hakukohdeQ.promise
    }

    function link(scope, element, attrs) {
        if (attrs.message) {
            element.text(attrs.message);

            var hakuMatch = /^.*(1\.2\.246\.562\.29\.[0-9]+).*$/g.exec(attrs.message);
            var hakuOid = hakuMatch && hakuMatch.length > 1 ? hakuMatch[1] : null;

            var hakukohdeMatch = /^.*(1.2.246.562.20.[0-9]+).*$/g.exec(attrs.message);
            var hakukohdeOid = hakukohdeMatch && hakukohdeMatch.length > 1 ? hakukohdeMatch[1] : null;

            $q.all({
                haku: fetchHaku(hakuOid, $q.defer()),
                hakukohde: fetchHakukohde(hakukohdeOid, $q.defer())
            }).then(function (results) {
                var haunNimet = results.haku,
                    hakukohteenNimet = results.hakukohde,
                    message = attrs.message;

                if (haunNimet) {
                    message = replaceOid(hakuOid, message, haunNimet)
                }

                if (hakukohteenNimet) {
                    message = replaceOid(hakukohdeOid, message, hakukohteenNimet)
                }

                element.text(message)
            }, function (errors) {
                console.log("cannot resolve from tarjonta", JSON.stringify(errors))
            })
        }
    }

    return {
        link: link
    }
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
                if (FLOAT_REGEXP.test(viewValue)) {
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

                } else {
                    // it is invalid, return undefined (no model update)
                    if (viewValue) {
                        $(elm).siblings("span").text("Arvo ei ole laillinen!");
                        ctrl.$setValidity('arvovalidaattori', false);
                        return undefined;
                    } else {
                        $(elm).siblings("span").empty();
                        ctrl.$setValidity('arvovalidaattori', true);

                    }
                }
                return viewValue;
            };
            ctrl.$parsers.push(validator);
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
        controller: function ($scope, VastaanottoTila, HakemuksenVastaanottoTila, $modal, LocalisationService) {

            $scope.t = LocalisationService.tl;
            $scope.show = function () {
                if ($scope.enabled) {
                    $modal.open({
                        scope: $scope,
                        templateUrl: '../common/html/sijoitteluVastaanottoTilaModal.html',
                        controller: function ($scope, $window, $modalInstance, Ilmoitus, Korkeakoulu, AuthService) {

                            $scope.t = LocalisationService.tl;
                            $scope.update = function () {
                                if ($scope.hakemus) {
                                    var tilaParams = {
                                        hakuOid: $scope.hakuOid,
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
                                        hakukohdeOid: $scope.hakukohdeOid,
                                        hakuOid: $scope.hakuOid,
                                        hakijaOid: $scope.hakemus.hakijaOid,
                                        tila: $scope.hakemus.muokattuVastaanottoTila,
                                        ilmoittautumisTila: $scope.hakemus.muokattuIlmoittautumisTila,
                                        julkaistavissa: true,
                                        hyvaksyttyVarasijalta: $scope.hakemus.hyvaksyttyVarasijalta
                                    };

                                    VastaanottoTila.post(tilaParams, [tilaObj], function (result) {
                                        setVastaanottoTila($scope.hakemus, tilaParams);
                                    }, function (error) {
                                        $scope.error = error;
                                        if (error && error.data && error.data.statuses) {
                                            $scope.errorRows = _.map(error.data.statuses, function(status) {
                                                if (status.message) {
                                                    return status.message.replace(/,/g, ', ');
                                                } else {
                                                    return status;
                                                }
                                            });
                                        }
                                    });
                                }
                            };

                            var setVastaanottoTila = function (hakemus, tilaParams) {
                                HakemuksenVastaanottoTila.get(tilaParams, function (result) {
                                    if (!result || !_.isArray(result) || result.length === 0) {
                                        hakemus.vastaanottoTila = "";
                                        hakemus.muokattuVastaanottoTila = "";
                                    } else {
                                        if (result.length > 1) {
                                            console.log('Warning: got multiple results from HakemuksenVastaanottoTila.get:', result)
                                        }
                                        var firstResult = result[0];
                                        hakemus.vastaanottoTila = firstResult.tila;
                                        hakemus.muokattuVastaanottoTila = firstResult.tila;
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
        controller: function ($scope, $route, JarjestyskriteeriMuokattuJonosija, $modal, LocalisationService) {

            if ($scope.jonosija.tuloksenTila == 'HYVAKSYTTY_HARKINNANVARAISESTI') {
                $scope.harkinnanvarainen = true;
            }

            $scope.t = LocalisationService.tl;

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
                                    $scope.jonosija.muokkaus.jarjestyskriteeriPrioriteetti = obj;
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

app.directive("valintatulos", function ($rootScope) {
    var resultState = {
        "Hyvaksytty": "Hyväksytty",
            "Kesken": "Opiskelijavalinta kesken",
            "HarkinnanvaraisestiHyvaksytty": "Hyväksytty",
            "Varalla": "__varasija__. varasijalla",
            "VarallaPvm": "__varasija__._varasijalla. Varasijoja täytetään __varasijaPvm__ asti.",
            "Peruutettu": "Peruutettu",
            "Perunut": "Peruit opiskelupaikan",
            "Peruuntunut": "Peruuntunut",
            "VarasijaltaHyvaksytty": "Hyväksytty varasijalta",
            "VastaanottanutSitovasti": "Opiskelupaikka vastaanotettu",
            "Hylatty": "Et saanut opiskelupaikkaa.",
            "EhdollisestiVastaanottanut": "Opiskelupaikka vastaanotettu ehdollisesti",
            "EiVastaanotettuMaaraAikana": "Et ottanut opiskelupaikkaa vastaan määräaikaan mennessä"
    };

    function underscoreToCamelCase(str) {
        return str.toLowerCase().replace(/^(.)|_(.)/g, function (match, char1, char2) {
            return (char1 ? char1 : "" + char2 ? char2 : "").toUpperCase()
        });
    }

    return {
        restrict: 'E',
        scope: {
            valintatulos: '&data',
            isFinal: '&final'
        },
        templateUrl: '../common/html/valintatulos.html',
        link: function ($scope, element) {
            $scope.formatDate = function (dt) {
                if (dt == null)
                    return "";
                else
                    //return moment(dt).format('LL').replace(/,/g, "")
                    return moment(dt).format('D.M.YYYY ').replace(/,/g, "")
            };

            $scope.$watch("isFinal()", function (value) {
                $scope.status = value ? "Lopullinen" : "Kesken";
            });

            $scope.valintatulosText = function (valintatulos) {
                var key = underscoreToCamelCase(valintatulos.valintatila);
                var lang = ($rootScope.userLang || 'FI').toUpperCase();
                if (["VASTAANOTTANUT_SITOVASTI", "EI_VASTAANOTETTU_MAARA_AIKANA", "EHDOLLISESTI_VASTAANOTTANUT"].indexOf(valintatulos.vastaanottotila) >= 0) {
                    key = underscoreToCamelCase(valintatulos.vastaanottotila)
                    return resultState[key]
                } else if (!_.isEmpty(valintatulos.tilanKuvaukset) && !_.isEmpty(valintatulos.tilanKuvaukset[lang])) {
                    var tilankuvaus = valintatulos.tilanKuvaukset[lang];
                    if (valintatulos.valintatila === "HYLATTY") {
                        return resultState[key] + " " + tilankuvaus;
                    } else if(hyvaksytty(valintatulos) && valintatulos.ehdollisestiHyvaksyttavissa) {
                        return resultState[key] + " (ehdollinen)"
                    } else {
                        return tilankuvaus;
                    }
                } else if (valintatulos.valintatila === "VARALLA" && valintatulos.varasijojaTaytetaanAsti != null) {
                    return valintatulos.varasijanumero + ". varasijalla. Varasijoja täytetään " + $scope.formatDate(valintatulos.varasijojaTaytetaanAsti) + " asti.";
                } else {
                    if(valintatulos.valintatila === 'VARALLA') {
                        return valintatulos.varasijanumero + ". varasijalla";
                    } else if(hyvaksytty(valintatulos) && valintatulos.ehdollisestiHyvaksyttavissa) {
                        return resultState[key] + " (ehdollinen)"
                    } else {
                        return resultState[key];
                    }
                }
            };

            $scope.valintatulosStyle = function(valintatulos) {
                if (hyvaksytty(valintatulos))
                    return "accepted"
            }

            function hyvaksytty(valintatulos) {
                return valintatulos.valintatila == "HYVAKSYTTY" || valintatulos.valintatila == "HARKINNANVARAISESTI_HYVAKSYTTY" || valintatulos.valintatila == "VARASIJALTA_HYVAKSYTTY"
            }
        }
    }
});

app.directive('showPersonInfoWithVtsData', ["ValintaTulosProxy", function (ValintaTulosProxy) {
    var allResultsAvailable = function(valintatulos) {
        return !valintatulos.hakutoiveet.reduce(function (acc, h) {
            return acc || h.valintatila === "KESKEN" || h.valintatila === "VARALLA"
        }, false);
    };

    var fetchVTSData = function (scope, hakuOid, hakemusOid) {
        ValintaTulosProxy.get(
            {
                hakuOid: hakuOid,
                hakemusOid: hakemusOid
            }, function (response) {
                scope.valintatulos = response;
                scope.isFinal = allResultsAvailable(response);
            }, function (error) {
                console.log("ValintaTulosProxy error");
            });
    };

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
                fetchVTSData($scope, $scope.hakuOid, $scope.hakemusOid);
                $modal.open({
                    scope: $scope,
                    templateUrl: '../common/html/personInformationModalWithVTSData.html',
                    controller: function ($scope, $window, $modalInstance) {
                        $scope.sulje = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {}
                });
            }
        }
    };
}]);

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
        controller: function ($scope, LocalisationService) {
            $scope.itemsInDropdown = [{value:100000, text: LocalisationService.tl('kaikki') || 'Kaikki'}];
            [20, 50, 100, 200, 500].forEach(function(number) {
                $scope.itemsInDropdown.push({
                    value: number,
                    text: number + ' ' + (LocalisationService.tl('kpl') || 'kpl')
                });
            });
            $scope.t = LocalisationService.tl;
        }

    };
});


app.directive('muokattuVastaanottoTila', function () {
    "use strict";

    function poistaLisahaustaEhdollinenVastaanotto(isLisahaku) {
        return function(tila) {
            return isLisahaku && tila.value !== "EHDOLLISESTI_VASTAANOTTANUT" || !isLisahaku;
        }
    }

    return {
        restrict: 'E',
        scope: {
            haku: '=',
            hakemus: '=',
            onHakemusUpdate: '&'
        },
        templateUrl: '../common/html/muokattuvastaanottotila.html',
        controller: function ($scope, AuthService, Korkeakoulu) {
            var updateEditable = function(hakemus, isKk, updateOph) {
                $scope.isEditable =
                    (hakemus.muokattuVastaanottoTila !== "OTTANUT_VASTAAN_TOISEN_PAIKAN"
                    && (isKk || updateOph || hakemus.muokattuVastaanottoTila !== "PERUUTETTU"));
                return $scope.isEditable;
            };
            var updateTilat = function(isKk, isLisahaku, updateOph, isEditable) {
                if (isKk) {
                    $scope.hakemuksenMuokattuVastaanottoTilat = [
                        {value: "KESKEN", text_prop: "sijoitteluntulos.kesken", default_text:"Kesken"},
                        {value: "EHDOLLISESTI_VASTAANOTTANUT", text_prop: "sijoitteluntulos.ehdollisestivastaanottanut", default_text:"Ehdollisesti vastaanottanut"},
                        {value: "VASTAANOTTANUT_SITOVASTI", text_prop: "sijoitteluntulos.vastaanottanutsitovasti", default_text:"Vastaanottanut sitovasti"},
                        {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text_prop: "sijoitteluntulos.eivastaanotettu", default_text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
                        {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"},
                        {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"},
                        {value: "OTTANUT_VASTAAN_TOISEN_PAIKAN", text_prop: 'sijoitteluntulos.ottanutvastaantoisenpaikan', default_text:"Ottanut vastaan toisen paikan", disable: isEditable}
                    ].filter(poistaLisahaustaEhdollinenVastaanotto(isLisahaku));
                } else {
                    $scope.hakemuksenMuokattuVastaanottoTilat = [
                        {value: "KESKEN", text_prop: "sijoitteluntulos.kesken", default_text:"Kesken"},
                        {value: "VASTAANOTTANUT_SITOVASTI", text_prop: "sijoitteluntulos.vastaanottanut", default_text:"Vastaanottanut"},
                        {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text_prop: "sijoitteluntulos.eivastaanotettu", default_text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
                        {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"}
                    ];
                    if (updateOph) {
                        $scope.hakemuksenMuokattuVastaanottoTilat.push(
                            {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"}
                        );
                    }
                }
            };
            $scope.handleTilaChange = function(hakemus) {
                $scope.resetIlmoittautumisTila(hakemus);
                if($scope.onHakemusUpdate) {
                    $scope.onHakemusUpdate({hakemus: hakemus});
                }
            };
            $scope.resetIlmoittautumisTila = function(hakemus) {
                if(hakemus.muokattuVastaanottoTila !== 'VASTAANOTTANUT_SITOVASTI') {
                    hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
                } else if (!hakemus.muokattuIlmoittautumisTila) {
                    hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
                }
            };
            $scope.isEditable = false;
            $scope.hakemuksenMuokattuVastaanottoTilat = [];
            AuthService.updateOph("APP_VALINTOJENTOTEUTTAMINEN")
                .then(function() { return true; },
                      function() { return false; })
                .then(function(updateOph) {
                    $scope.$watchGroup(
                        ['haku', 'hakemus'],
                        function(newVals, oldVals, scope) {
                            var haku = newVals[0];
                            var hakemus = newVals[1];
                            if (haku !== undefined && hakemus !== undefined) {
                                var isKk = Korkeakoulu.isKorkeakoulu(haku.kohdejoukkoUri);
                                var isLisahaku = /^hakutyyppi_03/.test(haku.hakutyyppiUri);
                                var isEditable = updateEditable(hakemus, isKk, updateOph);
                                updateTilat(isKk, isLisahaku, updateOph, isEditable);
                            }
                        });
                });
        }
    };
});



app.directive('showSijoittelunTila', function () {
    return {
        restrict: 'E',
        scope: {
            hakemus: '=',
            userLang: '=',
            onEdit: '&'
        },
        templateUrl: '../common/html/showSijoittelunTila.html',
        controller: function ($modal, $scope, AuthService) {
            var l = function (newval, oldval) {
                if (newval !== oldval) {
                    var peruuntunut = "PERUUNTUNUT" === $scope.hakemus.tila;
                    var hyvaksyttyPeruuntuneena = ("HYVAKSYTTY" === $scope.hakemus.tila) && $scope.hakemus.hyvaksyPeruuntunut;
                    $scope.showHyvaksyPeruuntunut = $scope.onEdit &&
                        ((peruuntunut && $scope.canHyvaksyPeruuntunut) ||
                        hyvaksyttyPeruuntuneena ||
                        $scope.showHyvaksyPeruuntunut);
                    $scope.id = $scope.hakemus.valintatapajonoOid + "-" + $scope.hakemus.hakemusOid.replace(/\./g, "");
                }
            };
            $scope.canHyvaksyPeruuntunut = false;
            $scope.showHyvaksyPeruuntunut = false;
            $scope.id = "";
            $scope.$watchCollection('hakemus', l);
            AuthService.peruuntuneidenHyvaksyntaOph("APP_SIJOITTELU")
                .then(function () { $scope.canHyvaksyPeruuntunut = true; l(true, false); },
                      function () { $scope.canHyvaksyPeruuntunut = false; l(false, true); });
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

app.directive('pisteidenSyottaminen', function () {
  return {
    restrict: 'E',
    scope: {
      hakija: '=',
      avain: '=',
      laskentaonly: '=',
      inputdisabled: '='
    },
    templateUrl: '../common/html/pisteidenSyottaminen.html',
    controller: function ($scope, $modal) {
        $scope.changeOsallistuminen = function (hakija, tunniste, value, vaatiiOsallistumisen) {
            if (value) {
                hakija.additionalData[tunniste] = "OSALLISTUI";
            } else {
              if (vaatiiOsallistumisen) {
                hakija.additionalData[tunniste] = "MERKITSEMATTA";
              } else {
                hakija.additionalData[tunniste] = "EI_VAADITA";
              }
            }
        };

        $scope.changeArvo = function (hakija, tunniste, value, tyyppi) {
          hakija.additionalData[tunniste] = "";
          if (value === "OSALLISTUI") {
            if (tyyppi === "boolean") {
              hakija.additionalData[tunniste] = "true";
            } else {
              hakija.additionalData[tunniste] = undefined;
            }
          }
        };
    }
  };
});

app.directive('linkToHenkiloInHenkilopalvelu', function () {
    return {
        restrict: 'EA',
        scope: {
            henkiloOid: '@',
            text: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.baseUrl = AUTHENTICATION_HENKILOUI_URL_BASE;
            $scope.txt = $scope.text || $scope.henkiloOid;
        },
        template: '<a ng-if="henkiloOid" href="{{baseUrl}}/html/henkilo/{{henkiloOid}}/?permissionCheckService=HAKU_APP" target="_blank">{{txt}}</a>'
    };
});
