var app = angular.module('valintalaskenta');
app.factory('HenkiloModel', function ($resource, $q, $routeParams, Henkilot, HenkiloPerustietosByHenkiloOidList) {
    function getHakuAppHakemukset(hakuOid, start, n, q) {
        return Henkilot.query({
            appState: ["ACTIVE", "INCOMPLETE"],
            asId: hakuOid,
            start: start,
            rows: n,
            q: q
        }).$promise.then(function(result) {
            var personOids = result.results.map(function (h) { return h.personOid; });
            return HenkiloPerustietosByHenkiloOidList.post(personOids).then(function (henkilot) {
                result.henkilotByOid = _.groupBy(henkilot, function (henkilo) {
                    return henkilo.oidHenkilo;
                });
                return result;
            });
        }).then(function(result) {
            return {
                hakemukset: result.results.map(function(h) {
                    var henkilo = result.henkilotByOid[h.personOid][0];
                    return {
                        oid: h.oid,
                        name: henkilo.sukunimi + ", " + henkilo.etunimet
                    };
                }),
                totalCount: result.totalCount
            };
        });
    }

    function addToHakemukset(model) {
        var searchWordShould = model.searchWord;
        return function(result) {
            if (model.searchWord === searchWordShould) {
                if (model.totalCount === result.totalCount) {
                    model.hakemukset = model.hakemukset.concat(result.hakemukset);
                    return true;
                } else {
                    return model.refresh().then(function () {
                        return false;
                    });
                }
            } else {
                return false;
            }
        }
    }

    function setHakemukset(model) {
        var searchWordShould = model.searchWord;
        return function(result) {
            if (model.searchWord === searchWordShould) {
                model.hakemukset = result.hakemukset;
                model.totalCount = result.totalCount;
                return true;
            } else {
                return false;
            }
        }
    }

    function getNextPage() {
        var self = this;
        if (this.readyToQueryForNextPage) {
            this.readyToQueryForNextPage = false;
            getHakuAppHakemukset(this.hakuOid, this.hakemukset.length, this.pageSize, $.trim(this.searchWord))
                .then(addToHakemukset(this))
                .then(function () {
                    self.readyToQueryForNextPage = true;
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
            getHakuAppHakemukset(this.hakuOid, 0, this.pageSize, q)
                .then(setHakemukset(this))
                .then(function () {
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
    controller('HenkiloController',['$scope', '$location', '$routeParams', 'HenkiloModel',
        function ($scope, $location, $routeParams, HenkiloModel) {
    "use strict";

    var debounceTimer = null;
    $scope.model = HenkiloModel;
    $scope.model.refreshIfNeeded($routeParams.hakuOid);
    $scope.hakemusOid = $routeParams.hakemusOid;
    $scope.henkiloittainVisible = true;
    if ($routeParams.scrollTo) {
        $location.hash($routeParams.scrollTo);
    }

    $scope.$watch('model.searchWord', function() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout($scope.model.refresh.bind($scope.model), 500);
    });

    $scope.lazyLoading = $scope.model.getNextPage.bind($scope.model);

    $scope.toggleHenkiloittainVisible = function () {
        $scope.henkiloittainVisible = !$scope.henkiloittainVisible;
    };

    $scope.showHakemus = function (hakemus) {
        $location.path('/haku/' + $routeParams.hakuOid + '/henkiloittain/' + hakemus.oid + "/henkilotiedot/id_" + hakemus.oid);
    };
}]);
