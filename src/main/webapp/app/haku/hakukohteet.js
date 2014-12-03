angular.module('valintalaskenta')

    .factory('HakukohteetModel', ['$q', '$routeParams', '$log', '$http', 'Haku', 'AuthService', 'TarjontaHaku', 'TarjontaHakukohde', 'HakukohdeKoodistoNimi', '_',
        function ($q, $routeParams, $log, $http, Haku, AuthService, TarjontaHaku, TarjontaHakukohde, HakukohdeKoodistoNimi, _) {
            "use strict";

            var model;

            model = new function () {
                this.hakukohteet = [];
                this.filtered = [];
                this.totalCount = 0;
                this.pageSize = 15;
                this.searchWord = "";
                this.lastSearch = null;
                this.lastHakuOid = null;
                this.omatHakukohteet = true;
                this.valmiitHakukohteet = "JULKAISTU";
                this.readyToQueryForNextPage = true;

                // Väliaikainen nimikäsittely, koska opetuskieli ei ole tiedossa. Käytetään tarjoajanimen kieltä
                this.getKieli = function (hakukohde) {
                    if (hakukohde) {
                        // Kovakoodatut kielet, koska tarjonta ei palauta opetuskieltä
                        var languages = ["kieli_fi", "kieli_sv", "kieli_en"];


                        var result = _.find(languages, function (language) {
                            return _.contains(hakukohde.opetusKielet, language);
                        });

                        return result;

                        /*
                         for (var lang in kielet) {
                         if (hakukohde.tarjoajaNimi && hakukohde.tarjoajaNimi[kielet[lang]] &&
                         !_.isEmpty(hakukohde.tarjoajaNimi[kielet[lang]]) &&
                         hakukohde.hakukohdeNimi && hakukohde.hakukohdeNimi[kielet[lang]] &&
                         !_.isEmpty(hakukohde.hakukohdeNimi[kielet[lang]])) {
                         return kielet[lang];
                         }
                         }
                         */
                    }
                    return "";
                };

                this.getTarjoajaNimi = function (hakukohde) {
                    var language = model.getKieli(hakukohde);
                    var languageId = _.last(language.split("_"));
                    return hakukohde.tarjoajaNimet[languageId];
                };

                this.getHakukohdeNimi = function (hakukohde) {
                    var result;
                    var language = model.getKieli(hakukohde);
                    if(language != undefined) {
                        var languageId = _.last(language.split("_"));
                        if (hakukohde.hakukohdeKoodistoNimi) {
                            result = _.find(hakukohde.hakukohdeKoodistoNimi.metadata, function (item) {
                                return item.kieli === languageId.toUpperCase();
                            }).nimi;
                        } else {
                            result = hakukohde.hakukohteenNimet[language];
                        }
                        return result;
                    }
                };

                this.getKieliCode = function () {
                };
                this.getCount = function () {
                    if (this.hakukohteet === undefined) {
                        return 0;
                    }
                    return this.hakukohteet.length;
                };
                this.getTotalCount = function () {
                    return this.totalCount;
                };
                this.getHakukohteet = function () {
                    return this.hakukohteet;
                };
                this.getNextPage = function (restart) {
                    var hakuOid = $routeParams.hakuOid;
                    if (restart) {
                        model.hakukohteet.length = 0;
                        this.filtered = [];
                    }
                    var startIndex = this.getCount();
                    var lastTotalCount = this.getTotalCount();
                    var notLastPage = startIndex < lastTotalCount;

                    if (notLastPage || restart) {

                        var self = this;
                        if (model.readyToQueryForNextPage) {
                            model.readyToQueryForNextPage = false;
                            AuthService.getOrganizations("APP_VALINTOJENTOTEUTTAMINEN", ['READ', 'READ_UPDATE', 'CRUD']).then(function (roleModel) {

                                var searchParams = {
                                    hakuOid: hakuOid,
                                    startIndex: startIndex,
                                    count: model.pageSize,
                                    searchTerms: model.lastSearch
                                };

                                if (model.omatHakukohteet) {
                                    searchParams.organisationOids = roleModel.toString();
                                }

                                searchParams.hakukohdeTilas = model.valmiitHakukohteet;

                                TarjontaHaku.query(searchParams, function (resultWrapper) {
                                    var promises = [];
                                    var hakukohteet = [];
                                    _.forEach(resultWrapper.result, function (resultObj) {
                                        var hakukohdeOid = resultObj.oid;

                                        var hakukohdeDefer = $q.defer();
                                        promises.push(hakukohdeDefer.promise);
                                        TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (resultWrapper) {
                                            var hakukohde = resultWrapper.result;
                                            if (hakukohde.hakukohteenNimiUri) {
                                                var nimiUri = hakukohde.hakukohteenNimiUri;
                                                var hakukohdeUri = nimiUri.slice(0, nimiUri.indexOf('#'));
                                                var koodistoVersio = hakukohdeUri.split('_')[0];
                                                $http.get(KOODISTO_URL_BASE + 'json/' + koodistoVersio + '/koodi/' + hakukohdeUri, {cache: true}).then(function (result) {
                                                    hakukohde.hakukohdeKoodistoNimi = result.data;
                                                    hakukohdeDefer.resolve();
                                                    hakukohteet.push(hakukohde);
                                                }, function (error) {
                                                    $log.error('Hakukohteen ' + resultWrapper.result.oid + ' hakukohteenNimiUrille ' + resultWrapper.result.hakukohteenNimiUri + ' ei löytynyt');
                                                    hakukohdeDefer.reject();
                                                });
                                            } else {
                                                hakukohteet.push(hakukohde);
                                                hakukohdeDefer.resolve();
                                            }
                                        }, function (error) {
                                            hakukohdeDefer.reject();
                                        });

                                    });

                                    $q.all(promises).then(function () {
                                        model.hakukohteet = hakukohteet;
                                    });
                                    /*
                                     var result = resultWrapper.result;
                                     if (restart) { // eka sivu
                                     self.hakukohteet = result.tulokset;
                                     self.totalCount = result.kokonaismaara;
                                     } else { // seuraava sivu
                                     if (startIndex !== self.getCount()) {
                                     //
                                     // Ei tehda mitaan
                                     //
                                     model.readyToQueryForNextPage = true;
                                     return;
                                     } else {
                                     self.hakukohteet = self.hakukohteet.concat(result.tulokset);
                                     if (self.getTotalCount() !== result.kokonaismaara) {
                                     // palvelimen tietomalli on paivittynyt joten koko lista on ladattava uudestaan!
                                     // ... tai vaihtoehtoisesti kayttajalle naytetaan epasynkassa olevaa listaa!!!!!
                                     self.lastSearch = null;
                                     model.readyToQueryForNextPage = true;
                                     self.getNextPage(true);
                                     }
                                     }
                                     }
                                     */
                                    model.readyToQueryForNextPage = true;
                                });
                            });
                        }
                    }
                };

                this.refresh = function () {

                    var word = $.trim(this.searchWord);

                    model.lastSearch = word;
                    model.getNextPage(true);

                };

                this.refreshIfNeeded = function (hakuOid) {
                    if (hakuOid !== model.lastHakuOid) {
                        model.searchWord = "";
                        model.lastHakuOid = hakuOid;
                        model.refresh();
                    }
                };
            }();

            return model;
        }]);


angular.module('valintalaskenta').
    controller('HakukohteetController', ['$rootScope', '$scope', '$location', '$routeParams', 'HakukohteetModel', 'HakukohdeModel',
        'GlobalStates', 'HakuModel',
        function ($rootScope, $scope, $location, $routeParams, HakukohteetModel, GlobalStates, HakuModel, HakukohdeModel) {
            "use strict";

            $scope.hakuOid = $routeParams.hakuOid;
            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.hakukohteetVisible = GlobalStates.hakukohteetVisible;
            $scope.hakuModel = HakuModel;

            $scope.model = HakukohteetModel;
            $scope.model.refreshIfNeeded($routeParams.hakuOid);

            $scope.$watch('model.searchWord', debounce(function () {
                HakukohteetModel.refresh();
            }, 500));

            function debounce(fn, delay) {
                var timer = null;
                return function () {
                    var context = this, args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                    }, delay);
                };
            }

            $scope.toggleHakukohteetVisible = function () {
                $scope.hakukohteetVisible = !$scope.hakukohteetVisible;
                GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
            };

            $scope.showHakukohde = function (hakukohde, lisahaku) {
                $rootScope.selectedHakukohdeNimi = $scope.model.getHakukohdeNimi(hakukohde);
                $scope.hakukohteetVisible = false;
                GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
                HakukohdeModel.hakukohde = hakukohde;
                $location.path((lisahaku ? '/lisahaku/' : '/haku/') + $routeParams.hakuOid + '/hakukohde/' + hakukohde.oid + (lisahaku ? '/perustiedot' : '/perustiedot'));
            };

            // uuden sivun lataus
            $scope.lazyLoading = function () {
                $scope.model.getNextPage(false);
            };
        }]);


app.factory('GlobalStates', function () {
    "use strict";

    var model = new function () {
        this.hakukohteetVisible = true;
    }();
    return model;
});