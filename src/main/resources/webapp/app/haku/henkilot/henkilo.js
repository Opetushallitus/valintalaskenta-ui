var app = angular.module('valintalaskenta');
app.factory('HenkiloModel', function ($resource, $q, $routeParams, Henkilot, HenkiloPerustietosByHenkiloOidList, HakuModel, AtaruApplications) {
    function enrichWithName(hakemukset) {
        var personOids = hakemukset.map(function (h) { return h.personOid; });
        //return HenkiloPerustietosByHenkiloOidList.post(personOids).then(function (henkilot) {
            //var henkilotByOid = _.groupBy(henkilot, function (henkilo) {
           //     return henkilo.oidHenkilo;
           // });
            return hakemukset.map(function(h) {
                //var henkilo = henkilotByOid[h.personOid][0];
                return {
                  oid: h.oid,
                  name: hakemus.sukunimi + ", " + hakemus.etunimet
                };
            });
        //});
    }

    function getHakuAppHakemukset(hakuOid, start, n, q) {
        return Henkilot.query({
            appState: ["ACTIVE", "INCOMPLETE"],
            asId: hakuOid,
            start: start,
            rows: n,
            q: q
        }).$promise;
    }

    function getAtaruHakemukset(hakuOid, start, n, q) {
        return AtaruApplications.get({hakuOid: hakuOid, name: q}).$promise.then(function(hakemukset) {
            return {
                results: hakemukset.slice(start, start + n),
                totalCount: hakemukset.length
            };
        });
    }

    function getHakemukset(hakuOid, start, n, q) {
        return HakuModel.refreshIfNeeded(hakuOid).then(function(haku) {
            if (haku.hakuOid.ataruLomakeAvain) {
                return getAtaruHakemukset(hakuOid, start, n, q);
            } else {
                return getHakuAppHakemukset(hakuOid, start, n, q);
            }
        }).then(function(result) {
            return enrichWithName(result.results).then(function(hakemukset) {
                return {
                    hakemukset: hakemukset,
                    totalCount: result.totalCount
                };
            })
        });
    }

    function getNextPage() {
        var self = this;
        var searchWordShould = this.searchWord;
        if (this.readyToQueryForNextPage) {
            this.readyToQueryForNextPage = false;
            getHakemukset(this.hakuOid, this.hakemukset.length, this.pageSize, $.trim(this.searchWord))
                .then(function (result) {
                    if (searchWordShould === self.searchWord) {
                        if (result.totalCount === self.totalCount) {
                            self.hakemukset = self.hakemukset.concat(result.hakemukset);
                            self.readyToQueryForNextPage = true;
                        } else {
                            return self.refresh();
                        }
                    }
                });
        }
    }

    function refresh() {
        var self = this;
        var q = $.trim(this.searchWord);
        this.hakuOid = this.hakuOid || $routeParams.hakuOid;
        this.hakemukset = [];
        this.totalCount = 0;
        if (q.length > 2) {
            this.readyToQueryForNextPage = false;
            getHakemukset(this.hakuOid, 0, this.pageSize, q).then(function(result) {
                self.hakemukset = result.hakemukset;
                self.totalCount = result.totalCount;
                self.readyToQueryForNextPage = true;
            });
        }
    }

    function refreshIfNeeded(hakuOid) {
        if (this.hakuOid !== hakuOid) {
            this.hakuOid = hakuOid;
            this.refresh();
        }
    }

    return {
        hakemukset: [],
        totalCount: 0,
        pageSize: 30,
        searchWord: "",
        readyToQueryForNextPage: true,
        hakuOid: null,

        refresh: refresh,
        refreshIfNeeded: refreshIfNeeded,
        getNextPage: getNextPage
    };
});

angular.module('valintalaskenta').
    controller('HenkiloController',['$scope', '$location', '$routeParams', '$timeout', 'HenkiloModel',
        function ($scope, $location, $routeParams, $timeout, HenkiloModel) {
    "use strict";

    var debounce = null;
    $scope.model = HenkiloModel;
    $scope.model.refreshIfNeeded($routeParams.hakuOid);
    $scope.hakemusOid = $routeParams.hakemusOid;
    $scope.henkiloittainVisible = true;
    if ($routeParams.scrollTo) {
        $location.hash($routeParams.scrollTo);
    }

    $scope.searchWordChanged = function() {
        if (debounce) {
            $timeout.cancel(debounce);
        }
        debounce = $timeout($scope.model.refresh.bind($scope.model), 500);
    };

    $scope.lazyLoading = $scope.model.getNextPage.bind($scope.model);

    $scope.toggleHenkiloittainVisible = function () {
        $scope.henkiloittainVisible = !$scope.henkiloittainVisible;
    };

    $scope.showHakemus = function (hakemus) {
        $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemus.oid + "/henkilotiedot/id_" + hakemus.oid);
    };
}]);
