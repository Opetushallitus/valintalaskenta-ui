angular.module('valintalaskenta')

    .factory('HakukohteetModel', ['$q', '$routeParams', '$log', '$http', 'Haku', 'AuthService', 'TarjontaHaku',
        function ($q, $routeParams, $log, $http, Haku, AuthService, TarjontaHaku) {
            "use strict";

            var model;

            model = new function () {
                this.hakukohteet = [];
                this.hakuOid = undefined;
                this.filtered = [];
                this.totalCount = 0;
                this.pageSize = 15;
                this.searchWord = "";
                this.lastSearch = null;
                this.lastHakuOid = null;
                this.omatHakukohteet = true;
                this.valmiitHakukohteet = "JULKAISTU";
                this.readyToQueryForNextPage = true;
                this.deferred = undefined;


                this.getCount = function () {
                    if (this.hakukohteet === undefined) {
                        return 0;
                    }
                    return model.hakukohteet.length;
                };
                this.getTotalCount = function () {
                    return model.totalCount;
                };
                this.getHakukohteet = function () {
                    return model.hakukohteet;
                };
                this.getNextPage = function (restart) {
                    var hakuOid = $routeParams.hakuOid;
                    if (restart) {
                        model.hakukohteet.length = 0;
                        this.filtered = [];
                    }
                    var startIndex = model.getCount();
                    var lastTotalCount = model.getTotalCount();
                    var notLastPage = startIndex < lastTotalCount;
                    if (notLastPage || restart) {
                        if (model.readyToQueryForNextPage) {
                            model.readyToQueryForNextPage = false;
                            AuthService.getOrganizations("APP_VALINTOJENTOTEUTTAMINEN", ['READ', 'READ_UPDATE', 'CRUD']).then(function (roleModel) {

                                var searchParams = {
                                    hakuOid: hakuOid,
                                    startIndex: startIndex,
                                    count: model.pageSize,
                                    searchTerms: model.lastSearch,
                                    hakukohdeTilas: model.valmiitHakukohteet
                                };

                                if (model.omatHakukohteet) {
                                    searchParams.organisationOids = roleModel.toString();
                                }

                                TarjontaHaku.get(searchParams, function (result) {

                                    if (restart) { // eka sivu
                                        model.hakukohteet = result.tulokset;
                                        model.totalCount = result.kokonaismaara;
                                    } else { // seuraava sivu
                                        if (startIndex !== model.getCount()) {
                                            //
                                            // Ei tehda mitaan
                                            //
                                            model.readyToQueryForNextPage = true;
                                            return;
                                        } else {
                                            model.hakukohteet = model.hakukohteet.concat(result.tulokset);
                                            if (model.getTotalCount() !== result.kokonaismaara) {
                                                model.lastSearch = null;
                                                model.readyToQueryForNextPage = true;
                                                model.getNextPage(true);
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
        }]);


angular.module('valintalaskenta').
    controller('HakukohteetController', ['$rootScope', '$scope', '$location', '$routeParams', 'HakukohteetModel', '_', 'GlobalStates', 'HakuModel',
        'NimiService',
                                function ($rootScope, $scope, $location, $routeParams, HakukohteetModel, _, GlobalStates, HakuModel,
                                          NimiService) {
            "use strict";
            $scope.hakuOid = $routeParams.hakuOid;
            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.hakukohteetVisible = GlobalStates.hakukohteetVisible;
            $scope.hakuModel = HakuModel;
            $scope.nimiService = NimiService;

            $scope.model = HakukohteetModel;
            $scope.model.refreshIfNeeded($routeParams.hakuOid);


            $scope.searchWordChanged = function () {
                if($scope.model.searchWord.length >= 1) {
                    HakukohteetModel.refresh();
                }
            };

            $scope.toggleHakukohteetVisible = function () {
                $scope.hakukohteetVisible = !$scope.hakukohteetVisible;
                GlobalStates.hakukohteetVisible = $scope.hakukohteetVisible;
            };

            $scope.showHakukohde = function (hakukohde, lisahaku) {
                $rootScope.selectedHakukohdeNimi = NimiService.getHakukohdeNimi(hakukohde);
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