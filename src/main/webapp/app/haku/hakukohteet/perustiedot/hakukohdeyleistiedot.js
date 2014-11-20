
angular.module('valintalaskenta').factory('HakukohdeModel', ['$q', '$log', 'TarjontaHakukohde', 'HakukohdeNimi',
    function ($q, $log, TarjontaHakukohde, HakukohdeNimi) {
    "use strict";


    var model;

    model = new function () {

        this.hakukohde = {};
        this.ensisijaiset = [];
        this.refreshingModel = false;

        // Väliaikainen nimikäsittely, koska opetuskieli ei ole tiedossa. Käytetään tarjoajanimen kieltä
        this.getKieli = function (hakukohde) {
            if (hakukohde) {
                // Kovakoodatut kielet, koska tarjonta ei palauta opetuskieltä
                var kielet = ["kieli_fi", "kieli_sv", "kieli_en"];

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


		this.getKieliCode = function () {
			var kieli = this.getKieli(model.hakukohde);
			if(kieli === "kieli_fi") {
				return "FI";
			} else if(kieli === "kieli_sv") {
				return "SV";
			} else if(kieli === "kieli_en") {
				return "EN";
			}
			return "FI";
		};

        this.getTarjoajaNimi = function () {
            var kieli = this.getKieli(model.hakukohde);

            if (!_.isEmpty(kieli)) {
                return model.hakukohde.tarjoajaNimi[kieli];
            } else {
                for (var lang in model.hakukohde.tarjoajaNimi) {
                    if (!_.isEmpty(model.hakukohde.tarjoajaNimi[lang]))
                        return model.hakukohde.tarjoajaNimi[lang];
                }
            }
        };

        this.getHakukohdeNimi = function () {

            var kieli = this.getKieli(model.hakukohde);

            if (!_.isEmpty(kieli)) {
                return model.hakukohde.hakukohdeNimi[kieli];
            } else {
                for (var lang in model.hakukohde.hakukohdeNimi) {
                    if (!_.isEmpty(model.hakukohde.hakukohdeNimi[lang]))
                        return model.hakukohde.hakukohdeNimi[lang];
                }
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
            console.log('resfresh');
            TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (resultWrapper) {
                model.hakukohde = resultWrapper.result;

                console.log('tarjontahakukohde', model.hakukohde);
                //HakukohdeNimi.get({hakukohdeoid: hakukohdeOid}, function (hakukohdeObject) {
                //    console.log('hakukohdenimi', hakukohdeObject);
                //    model.hakukohde.tarjoajaOid = hakukohdeObject.tarjoajaOid;
                //    defer.resolve();
                //}, function(error) {
                //    defer.reject("hakukohteen nimen hakeminen epäonnistui");
                //});
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
            } else  {
                var def = $q.defer();
                promise = def.promise;
                def.resolve();
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
        'SijoitteluntulosModel', 'Korkeakoulu',
        function ($scope, $location, $routeParams, HakukohdeModel, HakuModel, SijoitteluntulosModel, Korkeakoulu) {
    "use strict";


    $scope.hakuOid = $routeParams.hakuOid;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakukohdeModel;
    $scope.hakumodel = HakuModel;

    $scope.model.refreshIfNeeded($scope.hakukohdeOid);

    $scope.isKorkeakoulu = function () {
        return Korkeakoulu.isKorkeakoulu($scope.sijoitteluntulosModel.haku.kohdejoukkoUri);
    };


    $scope.sijoitteluntulosModel = SijoitteluntulosModel;
    $scope.sijoitteluntulosModel.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
}]);

angular.module('valintalaskenta').
    controller('HakukohdeNimiController', ['$scope', 'HakukohdeModel',
        function ($scope, HakukohdeModel) {
    "use strict";


    $scope.hakukohdeModel = HakukohdeModel;
}]);


