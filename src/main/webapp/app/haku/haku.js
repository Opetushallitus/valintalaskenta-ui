app.factory('HakuModel', function ($q, $log, Haku, HaunTiedot, TarjontaHaut) {
    "use strict";

    var model;
    model = new function () {
        this.hakuOid = "";
        this.haut = [];
        this.lisahaku = false;
        this.getNimi = function () {
            if (this.hakuOid.nimi.kieli_fi !== undefined) {
                return this.hakuOid.nimi.kieli_fi;
            }
            if (this.hakuOid.nimi.kieli_sv !== undefined) {
                return this.hakuOid.nimi.kieli_sv;
            }
            if (this.hakuOid.nimi.kieli_en !== undefined) {
                return this.hakuOid.nimi.kieli_en;
            }
            return "Nimetön hakukohde";
        };
        this.nivelvaihe = false;
        this.init = function (oid) {
            if(model.haut.length === 0) {
                TarjontaHaut.query({}, function(result) {
                    model.haut = result;

                    model.haut.forEach(function (haku) {
                        if (haku.oid === oid) {
                            model.hakuOid = haku;
                        }
                        
                        var kohdejoukkoUri = haku.kohdejoukkoUri;
                        var kohdejoukkoUriRegExp = /(haunkohdejoukko_17).*/;
                        var nivelvaihe = kohdejoukkoUriRegExp.exec(kohdejoukkoUri);
                        nivelvaihe ? haku.nivelvaihe = true : haku.nivelvaihe = false;
                        
                        var hakutyyppi = haku.hakutyyppiUri;
                        var lisahakutyyppiRegExp = /(hakutyyppi_03).*/;
                        var match = lisahakutyyppiRegExp.exec(hakutyyppi);
                        match ? haku.lisahaku = true : haku.lisahaku = false;
                    });

                }, function(error) {
                    $log.error(error);
                });
            }

        };
    }();


    return model;
});

angular.module('valintalaskenta').
    controller('HakuController', ['$scope', '$location', '$routeParams', 'HakuModel', 'ParametriService',
        function ($scope, $location, $routeParams, HakuModel, ParametriService) {
    "use strict";

    $scope.hakumodel = HakuModel;
    HakuModel.init($routeParams.hakuOid);

    ParametriService.refresh($routeParams.hakuOid);

    $scope.$watch('hakumodel.hakuOid', function () {

        if ($scope.hakumodel.hakuOid && $scope.hakumodel.hakuOid.oid !== $routeParams.hakuOid) {
            if ($scope.hakumodel.hakuOid.lisahaku) {
                $location.path('/lisahaku/' + HakuModel.hakuOid.oid + '/hakukohde/');
            } else {
                $location.path('/haku/' + HakuModel.hakuOid.oid + '/hakukohde/');
            }
        }
    });
}]);