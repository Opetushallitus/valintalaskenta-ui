app.factory('HakukohteetModel', function ($q, $routeParams, Haku, HakuHakukohdeChildren, HakukohdeNimi, AuthService, TarjontaHaku) {
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
            // Kovakoodatut kielet, koska tarjonta ei palauta opetuskieltä
            var kielet = ["kieli_fi", "kieli_sv", "kieli_en"];

            for (var lang in kielet) {
                if (hakukohde.tarjoajaNimi && hakukohde.tarjoajaNimi[kielet[lang]]) {
                    return kielet[lang];
                }
            }
            return kielet[0];
        }

        this.getTarjoajaNimi = function (hakukohde) {

            if (hakukohde.tarjoajaNimi && hakukohde.tarjoajaNimi[this.getKieli(hakukohde)]) {
                return hakukohde.tarjoajaNimi[this.getKieli(hakukohde)];
            }

            for (var lang in hakukohde.tarjoajaNimi) {
                return hakukohde.tarjoajaNimi[lang];
            }
        };

        this.getHakukohdeNimi = function (hakukohde) {

            if (hakukohde.hakukohdeNimi && hakukohde.hakukohdeNimi[this.getKieli(hakukohde)]) {
                return hakukohde.hakukohdeNimi[this.getKieli(hakukohde)];
            }

            for (var lang in hakukohde.tarjoajaNimi) {
                return hakukohde.hakukohdeNimi[lang];
            }
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


                        TarjontaHaku.query(searchParams, function (result) {

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

        this.refreshIfNeeded = function () {
            var hakuOid = $routeParams.hakuOid;
            if (hakuOid != model.lastHakuOid) {
                model.searchWord = "";
                model.lastHakuOid = hakuOid;
                model.refresh();
            }
        };
    };

    return model;
});


function HakukohteetController($rootScope, $scope, $location, $timeout, $routeParams, HakukohteetModel, GlobalStates, HakuModel) {
    $scope.hakuOid = $routeParams.hakuOid;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakukohteetVisible = GlobalStates.hakukohteetVisible;
    $scope.hakuModel = HakuModel;

    $scope.model = HakukohteetModel;
    $scope.model.refreshIfNeeded();

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
    }

    $scope.showHakukohde = function (hakukohde, lisahaku) {
        $rootScope.selectedHakukohdeNimi = hakukohde.hakukohdeNimi.fi;
        $scope.hakukohteetVisible = false;
        GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
        $location.path((lisahaku ? '/lisahaku/' : '/haku/') + $routeParams.hakuOid + '/hakukohde/' + hakukohde.hakukohdeOid + '/perustiedot');
    }

    // uuden sivun lataus
    $scope.lazyLoading = function () {
        $scope.model.getNextPage(false);
    }
}

app.factory('GlobalStates', function () {
    var model = new function () {
        this.hakukohteetVisible = true;
    }
    return model;
});