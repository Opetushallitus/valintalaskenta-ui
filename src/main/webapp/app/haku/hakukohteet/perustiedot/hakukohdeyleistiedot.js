
angular.module('valintalaskenta').factory('HakukohdeModel', ['$q', '$log', '$http', 'TarjontaHakukohde', 'HakukohdeNimi', '_', 'HakukohdeKoodistoNimi',
    function ($q, $log, $http, TarjontaHakukohde, HakukohdeNimi, _, HakukohdeKoodistoNimi) {
    "use strict";


    var model;

    model = new function () {
        this.hakukohdeOid = undefined;
        this.hakukohdeNimi = undefined;
        this.tarjoajaNimi = undefined;
        this.hakukohde = {};
        this.ensisijaiset = [];
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
            return model.hakukohde.tarjoajaNimet[languageId];
        };

        this.getHakukohdeNimi = function (hakukohde) {
            var language = model.getKieli(hakukohde);
            return model.hakukohde.hakukohteenNimet[language];
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
            model.hakukohdeOid = hakukohdeOid;
            model.deferred = $q.defer();
            TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (resultWrapper) {
                var hakukohde = resultWrapper.result;
                model.hakukohde = hakukohde;
                model.setHakukohdeNames();
            }, function(error) {
                $log.error('Hakukohteen tietojen hakeminen epäonnistui', error);
                model.deferred.reject("hakukohteen tietojen hakeminen epäonnistui");
            });
            return model.deferred;

        };

        this.refreshIfNeeded = function (hakukohdeOid) {
            if(hakukohdeOid !== undefined && model.isHakukohdeChanged(hakukohdeOid) ) {
                model.refresh(hakukohdeOid);
                return model.deferred.promise;
            }

            if(_.isEmpty(model.deferred)) {
                model.deferred = $q.defer();
                if(hakukohdeOid !== undefined && model.isHakukohdeChanged(hakukohdeOid) ) {
                    return model.refresh(hakukohdeOid);
                }
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

        this.setHakukohdeNames = function () {
            model.hakukohdeNimi = model.getHakukohdeNimi(model.hakukohde);
            model.tarjoajaNimi = model.getTarjoajaNimi(model.hakukohde);
        };

        this.getHakukohdeOid = function () {
            return model.hakukohdeOid;
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

    $scope.model.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.isKorkeakoulu = function () {
        return Korkeakoulu.isKorkeakoulu($scope.sijoitteluntulosModel.haku.kohdejoukkoUri);
    };


    $scope.sijoitteluntulosModel = SijoitteluntulosModel;
    $scope.sijoitteluntulosModel.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
}])

.controller('HakukohdeNimiController', ['$scope', '$routeParams', 'HakukohdeModel', function ($scope, $routeParams, HakukohdeModel) {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
        $scope.hakukohdeModel = HakukohdeModel;
    }]);

