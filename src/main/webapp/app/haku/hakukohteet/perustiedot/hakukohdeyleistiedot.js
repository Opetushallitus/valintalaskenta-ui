
angular.module('valintalaskenta').factory('HakukohdeModel', ['$q', '$log', 'TarjontaHakukohde', 'HakukohdeNimi', function ($q, $log, TarjontaHakukohde, HakukohdeNimi) {
    "use strict";


    var model;

    model = new function () {

        this.hakukohde = {};
        this.ensisijaiset = [];
        this.refreshingModel = false;

        // Väliaikainen nimikäsittely, koska opetuskieli ei ole tiedossa. Käytetään tarjoajanimen kieltä
        this.getKieli = function () {
            // Kovakoodatut kielet, koska tarjonta ei palauta opetuskieltä
            var kielet = ["kieli_fi", "kieli_sv", "kieli_en"];

            for (var lang in kielet) {
                if (model.hakukohde.tarjoajaNimi && model.hakukohde.tarjoajaNimi[kielet[lang]]) {
                    return kielet[lang];
                }
            }
            return kielet[0];
        };
		this.getKieliCode = function () {
			var kieli = this.getKieli();
			if(kieli === "kieli_fi") {
				return "FI";
			} else if(kieli === "kieli_sv") {
				return "SV";
			} else if(kieli === "kieli_ev") {
				return "EN";
			}
			return "FI";
		};
        this.getTarjoajaNimi = function () {

            if (model.hakukohde.tarjoajaNimi && model.hakukohde.tarjoajaNimi[this.getKieli()]) {
                return model.hakukohde.tarjoajaNimi[this.getKieli()];
            }

            for (var lang in model.hakukohde.tarjoajaNimi) {
                return model.hakukohde.tarjoajaNimi[lang];
            }
        };

        this.getHakukohdeNimi = function () {

            if (model.hakukohde.hakukohdeNimi && model.hakukohde.hakukohdeNimi[this.getKieli()]) {
                return model.hakukohde.hakukohdeNimi[this.getKieli()];
            }

            for (var lang in model.hakukohde.tarjoajaNimi) {
                return model.hakukohde.hakukohdeNimi[lang];
            }
        };

        this.haeEnsisijaiset = function(hakemukset, hakukohdeOid) {

            var result = [];
            _.each(hakemukset, function(hakemus) {
                var toive = (_.invert(hakemus.answers.hakutoiveet))[hakukohdeOid];

                if(toive && parseInt(toive.substring(10,11)) === 1) {
                    result.push(hakemus);
                }
            });
            return result;
        };

        this.refresh = function (hakukohdeOid) {

            var defer = $q.defer();

            TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (result) {
                model.hakukohde = result;
                HakukohdeNimi.get({hakukohdeoid: hakukohdeOid}, function (hakukohdeObject) {
                    model.hakukohde.tarjoajaOid = hakukohdeObject.tarjoajaOid;
                    defer.resolve();
                }, function(error) {
                    defer.reject("hakukohteen nimen hakeminen epäonnistui");
                });
            }, function(error) {
                defer.reject("hakukohteen tietojen hakeminen epäonnistui");
            });

            return defer.promise;

        };

        this.refreshIfNeeded = function (hakukohdeOid) {
            var promise;
            if (model.isHakukohdeChanged(hakukohdeOid) && (hakukohdeOid !== undefined) && !model.refreshing) {
                model.refreshingModel = true;
                promise = model.refresh(hakukohdeOid);
                promise.then(function() {
                    model.refreshingModel = false;
                }, function(error) {
                    model.refreshingModel = false;
                    $log.error("Error fetching applications");
                });
            }
            return promise;
        };



        //helper method needed in other controllers
        this.isHakukohdeChanged = function (hakukohdeOid) {
            if (model.hakukohde.oid !== hakukohdeOid) {
                return true;
            } else {
                return false;
            }
        };

        this.getHakukohdeOid = function () {
            return model.hakukohde.oid;
        };

    }();

    return model;
}]);

angular.module('valintalaskenta').
    controller('HakukohdeController', ['$scope', '$location', '$routeParams', 'HakukohdeModel', 'HakuModel',
        'SijoitteluntulosModel',
        function ($scope, $location, $routeParams, HakukohdeModel, HakuModel, SijoitteluntulosModel) {
    "use strict";


    $scope.hakuOid = $routeParams.hakuOid;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakukohdeModel;
    $scope.hakumodel = HakuModel;

    $scope.model.refreshIfNeeded($scope.hakukohdeOid);

    $scope.sijoitteluntulosModel = SijoitteluntulosModel;
    $scope.sijoitteluntulosModel.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
}]);

angular.module('valintalaskenta').
    controller('HakukohdeNimiController', ['$scope', 'HakukohdeModel',
        function ($scope, HakukohdeModel) {
    "use strict";


    $scope.hakukohdeModel = HakukohdeModel;
}]);


