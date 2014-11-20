app.factory('HakukohteetModel', function ($q, $routeParams, Haku, AuthService,
                                          TarjontaHaku) {
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
                var kielet = ["fi", "sv", "en"];

                for (var lang in kielet) {
                    if (hakukohde.tarjoajaNimi && hakukohde.tarjoajaNimi[kielet[lang]] &&
                        !_.isEmpty(hakukohde.tarjoajaNimi[kielet[lang]]) &&
                        hakukohde.hakukohdeNimi && hakukohde.hakukohdeNimi[kielet[lang]] &&
                        !_.isEmpty(hakukohde.hakukohdeNimi[kielet[lang]])) {
                        return kielet[lang];
                    }
                }
            }
            return "";
        };


        this.getTarjoajaNimi = function (hakukohde) {
            var kieli = this.getKieli(hakukohde);

            if (!_.isEmpty(kieli)) {
                return hakukohde.tarjoajaNimi[kieli];
            } else {
                for (var lang in hakukohde.tarjoajaNimi) {
                    if (!_.isEmpty(hakukohde.tarjoajaNimi[lang]))
                        return hakukohde.tarjoajaNimi[lang];
                }
            }
        };

        this.getHakukohdeNimi = function (hakukohde) {
            var kieli = this.getKieli(hakukohde);

            if (!_.isEmpty(kieli)) {
                return hakukohde.hakukohdeNimi[kieli];
            } else {
                for (var lang in hakukohde.hakukohdeNimi) {
                    if (!_.isEmpty(hakukohde.hakukohdeNimi[lang]))
                        return hakukohde.hakukohdeNimi[lang];
                }
            }
        };

        this.getKieliCode = function() {
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
                this.hakukohteet = [];
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
                            searchTerms: model.lastSearch};

                        if (model.omatHakukohteet) {
                            searchParams.organisationOids = roleModel.toString();
                        }

                        searchParams.hakukohdeTilas = model.valmiitHakukohteet;


                        TarjontaHaku.query(searchParams, function (resultWrapper) {
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
});


angular.module('valintalaskenta').
    controller('HakukohteetController',['$rootScope', '$scope', '$location', '$routeParams', 'HakukohteetModel',
        'GlobalStates', 'HakuModel',
        function ($rootScope, $scope, $location, $routeParams, HakukohteetModel, GlobalStates, HakuModel) {
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
        $rootScope.selectedHakukohdeNimi = hakukohde.hakukohdeNimi.fi;
        $scope.hakukohteetVisible = false;
        GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
        $location.path((lisahaku ? '/lisahaku/' : '/haku/') + $routeParams.hakuOid + '/hakukohde/' + hakukohde.hakukohdeOid + (lisahaku ? '/perustiedot' : '/perustiedot'));
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