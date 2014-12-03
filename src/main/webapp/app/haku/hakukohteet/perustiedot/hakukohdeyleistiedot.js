
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
                var result = _.find(languages, function (language) {
                    return _.contains(hakukohde.opetusKielet, language);
                });
                return result;
            }
            return "";
        };


		this.getKieliCode = function () {
			var language = this.getKieli(model.hakukohde);
			return _.last(language.split("_")).toUpperCase();
		};

        this.getTarjoajaNimi = function () {
            var language = model.getKieli(model.hakukohde);
            var languageId = _.last(language.split("_"));
            return model.hakukohde.tarjoajaNimet[languageId];
        };

        this.getHakukohdeNimi = function (hakukohde) {
            var result;
            var language = model.getKieli(hakukohde);
            var languageId = _.last(language.split("_"));
            if(hakukohde.hakukohdeKoodistoNimi) {
                result = _.find(hakukohde.hakukohdeKoodistoNimi.metadata, function (item) {
                    return item.kieli === languageId.toUpperCase();
                }).nimi;
            } else {
                result = hakukohde.hakukohteenNimet[language];
            }
            return result;
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
                if(hakukohde.hakukohteenNimiUri) {
                    var nimiUri = hakukohde.hakukohteenNimiUri;
                    var hakukohdeUri = nimiUri.slice(0, nimiUri.indexOf('#'));
                    var koodistoVersio = hakukohdeUri.split('_')[0];
                    $http.get(KOODISTO_URL_BASE + 'json/' + koodistoVersio + '/koodi/' + hakukohdeUri, {cache: true}).then(function (result) {
                        hakukohde.hakukohdeKoodistoNimi = result.data;
                        model.setHakukohdeNames(hakukohde);
                    }, function (error) {
                        $log.error('Hakukohteen ' + resultWrapper.result.oid + ' hakukohteenNimiUrille ' + resultWrapper.result.hakukohteenNimiUri + ' ei löytynyt');
                    });
                } else {
                    model.setHakukohdeNames(hakukohde);
                }
            }, function(error) {
                $log.error('Hakukohteen tietojen hakeminen epäonnistui', error);
                model.deferred.reject("hakukohteen tietojen hakeminen epäonnistui");
            });
            return model.deferred.promise;

        };

        this.refreshIfNeeded = function (hakukohdeOid) {
            if(_.isEmpty(model.deferred) || model.isHakukohdeChanged(hakukohdeOid) && hakukohdeOid !== undefined) {
                return model.refresh(hakukohdeOid);
            }
            return model.deferred.promise;
        };



        //helper method needed in other controllers
        this.isHakukohdeChanged = function (hakukohdeOid) {
            if (model.hakukohdeOid !== hakukohdeOid) {
                return true;
            } else {
                return false;
            }
        };

        this.setHakukohdeNames = function (hakukohde) {
            model.hakukohdeNimi = model.getHakukohdeNimi(hakukohde);
            model.tarjoajaNimi = model.getTarjoajaNimi(hakukohde);
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

