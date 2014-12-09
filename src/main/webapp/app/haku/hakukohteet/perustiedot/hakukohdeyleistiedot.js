
angular.module('valintalaskenta').factory('HakukohdeModel', ['$q', '$log', '$http', 'TarjontaHakukohde', 'HakukohdeNimi', '_',
    function ($q, $log, $http, TarjontaHakukohde, HakukohdeNimi, _) {
    "use strict";


    var model;

    model = new function () {
        this.hakukohdeOid = undefined;
        this.hakukohdeNimi = undefined;
        this.tarjoajaNimi = undefined;
        this.hakukohde = {};
        this.deferred = undefined;


        this.getKieli = function (hakukohde) {
            if (hakukohde) {
                var languages = ["kieli_fi", "kieli_sv", "kieli_en"];
                var tarjoajaNimet = hakukohde.tarjoajaNimet;
                var hakukohdeNimet = hakukohde.hakukohteenNimet;
                
                var language = _.find(languages, function (lang) {
                    var languageId = _.last(lang.split("_"));
                    return (!_.isEmpty(hakukohdeNimet[lang]) && !_.isEmpty(tarjoajaNimet[languageId]));
                });

                return language;
            }
            return "kieli_fi";
        };


		this.getKieliCode = function (hakukohde) {
			var language = this.getKieli(hakukohde);
			return _.last(language.split("_")).toUpperCase();
		};

        this.getTarjoajaNimi = function (hakukohde) {
            var language = model.getKieli(hakukohde);
            var languageId = _.last(language.split("_"));
            var tarjoajaNimi = (model.hakukohde && model.hakukohde.tarjoajaNimet && model.hakukohde.tarjoajaNimet[languageId]) ? model.hakukohde.tarjoajaNimet[languageId] : "";
            return tarjoajaNimi;
        };

        this.getHakukohdeNimi = function (hakukohde) {
            var language = model.getKieli(hakukohde);
            var hakukohteenNimi = (model.hakukohde && model.hakukohde.hakukohteenNimet && model.hakukohde.hakukohteenNimet[language]) ? model.hakukohde.hakukohteenNimet[language] : "";
            return hakukohteenNimi;
        };

        this.refresh = function (hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
            TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (resultWrapper) {
                var hakukohde = resultWrapper.result;
                model.hakukohde = hakukohde;
                model.setHakukohdeNames();
                model.deferred.resolve();
            }, function(error) {
                $log.error('Hakukohteen tietojen hakeminen epäonnistui', error);
                model.deferred.reject("hakukohteen tietojen hakeminen epäonnistui");
            });
            return model.deferred;
        };


        //This will fail if hakukohdeOid -parameter doesn't exist
        this.refreshIfNeeded = function (hakukohdeOid) {
            if(_.isEmpty(model.deferred) || model.isHakukohdeChanged(hakukohdeOid)) {
                model.deferred = $q.defer();
                model.refresh(hakukohdeOid);
                return model.deferred.promise;
            } else {
                return model.deferred.promise;
            }
        };

        //helper method needed in other controllers
        this.isHakukohdeChanged = function (hakukohdeOid) {
            if (model.hakukohdeOid !== hakukohdeOid) {
                return true;
            } else {
                return false;
            }
        };

        this.setHakukohdeNames = function (hakukohdeNimi, tarjoajaNimi) {
            if(hakukohdeNimi || tarjoajaNimi) {
                model.hakukohdeNimi = hakukohdeNimi;
                model.tarjoajaNimi = tarjoajaNimi;
            } else {
                model.hakukohdeNimi = model.getHakukohdeNimi(model.hakukohde);
                model.tarjoajaNimi = model.getTarjoajaNimi(model.hakukohde);
            }

        };

    }();

    return model;
}])
    
.controller('HakukohdeController', ['$scope', '$location', '$routeParams', 'HakukohdeModel', 'HakuModel',
        'SijoitteluntulosModel', 'Korkeakoulu',
        function ($scope, $location, $routeParams, HakukohdeModel, HakuModel, SijoitteluntulosModel, Korkeakoulu) {
    "use strict";

    $scope.hakuOid = $routeParams.hakuOid;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakukohdeModel;
    $scope.hakumodel = HakuModel;
    if($routeParams.hakukohdeOid) {
        $scope.model.refreshIfNeeded($routeParams.hakukohdeOid);
    }

    $scope.isKorkeakoulu = function () {
        return Korkeakoulu.isKorkeakoulu($scope.sijoitteluntulosModel.haku.kohdejoukkoUri);
    };

    if($routeParams.hakukohdeOid) {
        $scope.sijoitteluntulosModel = SijoitteluntulosModel;
        $scope.sijoitteluntulosModel.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
    }
}])

.controller('HakukohdeNimiController', ['$scope', '$routeParams', 'HakukohdeModel', function ($scope, $routeParams, HakukohdeModel) {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.hakukohdeModel = HakukohdeModel;
    }]);

