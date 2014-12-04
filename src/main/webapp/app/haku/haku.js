angular.module('valintalaskenta')

    .factory('HakuModel', ['$q', '$log', 'Haku', 'TarjontaHaut', 'Korkeakoulu',
        function ($q, $log, Haku, TarjontaHaut, Korkeakoulu) {
            "use strict";

            var model;
            model = new function () {
                this.deferred = undefined;
                this.hakuOid = "";
                this.haut = [];
                this.lisahaku = false;
                this.nivelvaihe = false;
                this.korkeakoulu = false;
                this.erillishaku = false;

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

                this.init = function (oid) {
                    if (model.haut.length === 0 || oid !== model.hakuOid) {
                        model.deferred = $q.defer();

                        TarjontaHaut.get({}, function (resultWrapper) {
                            model.haut = resultWrapper.result;
                            
                            model.haut.forEach(function (haku) {
                                if (haku.oid === oid) {
                                    model.hakuOid = haku;

                                    model.korkeakoulu = Korkeakoulu.isKorkeakoulu(haku.kohdejoukkoUri);

                                }
                                var kohdejoukkoUri = haku.kohdejoukkoUri;
                                var kohdejoukkoUriRegExp = /(haunkohdejoukko_17).*/;
                                var nivelvaihe = kohdejoukkoUriRegExp.exec(kohdejoukkoUri);
                                nivelvaihe ? haku.nivelvaihe = true : haku.nivelvaihe = false;

                                var hakutyyppi = haku.hakutyyppiUri;
                                var lisahakutyyppiRegExp = /(hakutyyppi_03).*/;
                                var match = lisahakutyyppiRegExp.exec(hakutyyppi);
                                match ? haku.lisahaku = true : haku.lisahaku = false;
                                
                                var hakutapa = haku.hakutapaUri;
                                var erillishakutapaRegExp = /(hakutapa_02).*/;
                                var matchErillishaku = erillishakutapaRegExp.exec(hakutapa);
                                matchErillishaku ? haku.erillishaku = true : haku.erillishaku = false;
                                
                            });
                            model.deferred.resolve();

                        }, function (error) {
                            model.deferred.reject('Hakulistan hakeminen epäonnistui');
                            $log.error(error);
                        });

                        return model.deferred.promise;
                    }

                };

            }();


            return model;
        }])

    .controller('HakuController', ['$log', '$scope', '$location', '$routeParams', 'HakuModel', 'ParametriService', 'UserModel', 'CustomHakuUtil',
        function ($log, $scope, $location, $routeParams, HakuModel, ParametriService, UserModel, CustomHakuUtil) {
            "use strict";
            $scope.hakumodel = HakuModel;
            HakuModel.init($routeParams.hakuOid);

            UserModel.refreshIfNeeded();
            $scope.customHakuUtil = CustomHakuUtil;
            CustomHakuUtil.refreshIfNeeded($routeParams.hakuOid);

            //determining if haku-listing should be filtered based on users organizations
            UserModel.organizationsDeferred.promise.then(function () {
                if (UserModel.isOphUser || UserModel.hasOtherThanKKUserOrgs && UserModel.isKKUser) {
                    $scope.hakufiltering = "all";
                } else if (UserModel.isKKUser && !UserModel.hasOtherThanKKUserOrgs) {
                    $scope.hakufiltering = "kkUser";
                } else if (!UserModel.isKKUser && UserModel.hasOtherThanKKUserOrgs) {
                    $scope.hakufiltering = "toinenAsteUser";
                } else {
                    $scope.hakufiltering = "all";
                }
            });

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

        }])
    
    .controller('CustomHakuFilterController', ['$scope', function ($scope) {
        $scope.$on('rajaaHakuja', function () {
           $scope.show();
        });
    }])
    
    .filter('kkHakuFilter', ['_', function (_) {
        return function (haut) {
            return _.filter(haut, function (haku) {
                if (haku.kohdejoukkoUri) {
                    return haku.kohdejoukkoUri.indexOf('_12') > -1;
                }
            });
        };
    }])
    .filter('toinenAsteHakuFilter', ['_', function (_) {
        return function (haut) {
            return _.filter(haut, function (haku) {
                if (haku.kohdejoukkoUri) {
                    return haku.kohdejoukkoUri.indexOf('_12') === -1;
                }
            });
        };
    }])

    .filter('CustomHakuFilter', ['CustomHakuUtil', '_',
        function (CustomHakuUtil, _) {
            return function (haut) {
                var result = haut;
                _.each(CustomHakuUtil.hakuKeys, function (key) {
                    if (CustomHakuUtil[key].value !== null && CustomHakuUtil[key].value !== undefined) {
                        result = CustomHakuUtil[key].filter(result);
                    }
                });
                return result;

            };
        }])

    .service('CustomHakuUtil', ['$q', '_', 'HakujenHakutyypit', 'HakujenKohdejoukot', 'HakujenHakutavat', 'HakujenHakukaudet', 'HakuModel',
        function ($q, _, HakujenHakutyypit, HakujenKohdejoukot, HakujenHakutavat, HakujenHakukaudet, HakuModel) {

            var that = this;

            this.hakuKeys = ['hakuvuosi', 'hakukausi', 'kohdejoukko', 'hakutapa', 'hakutyyppi'];

            this.deferred = undefined; // deferred here is meant just to prevent multiple refresh-calls

            this.hakutyyppiOpts = undefined;
            this.kohdejoukkoOpts = undefined;
            this.hakutapaOpts = undefined;
            this.hakukausiOpts = undefined;
            this.hakuvuodetOpts = undefined;

            this.refresh = function (hakuOid) {
                that.deferred = $q.defer();

                HakujenHakutyypit.query(function (result) {
                    that.hakutyyppiOpts = _.map(result, function (hakutyyppi) { //parse hakuoptions
                        return {
                            koodiUri: hakutyyppi['koodiUri'],
                            nimi: _.findWhere(hakutyyppi.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                HakujenKohdejoukot.query(function (result) {
                    that.kohdejoukkoOpts = _.map(result, function (kohdejoukko) { //parse hakuoptions
                        return {
                            koodiUri: kohdejoukko['koodiUri'],
                            nimi: _.findWhere(kohdejoukko.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                HakujenHakutavat.query(function (result) {
                    that.hakutapaOpts = _.map(result, function (tapa) { //parse hakuoptions
                        return {
                            koodiUri: tapa['koodiUri'],
                            nimi: _.findWhere(tapa.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                HakujenHakukaudet.query(function (result) {
                    that.hakukausiOpts = _.map(result, function (kausi) { //parse hakuoptions
                        return {
                            koodiUri: kausi['koodiUri'],
                            nimi: _.findWhere(kausi.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                if(_.isEmpty(HakuModel.deferred)) {
                    HakuModel.init(hakuOid);
                }

                HakuModel.deferred.promise.then(function () {
                    that.hakuvuodetOpts = _.uniq(_.pluck(HakuModel.haut, 'hakukausiVuosi'));
                });

                that.deferred.resolve();
            };

            this.refreshIfNeeded = function (hakuOid) {
                if (_.isEmpty(that.deferred)) {
                    that.refresh(hakuOid);
                }
            };


            this.hakuvuosi = {
                value: undefined,
                filter: function (haut) {
                    return !_.isNumber(that.hakuvuosi.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakukausiVuosi === that.hakuvuosi.value;
                    });
                }
            };

            this.hakukausi = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.hakukausi.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakukausiUri.indexOf(that.hakukausi.value) > -1;
                    });
                }
            };

            this.kohdejoukko = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.kohdejoukko.value) ? haut : _.filter(haut, function (haku) {
                        return haku.kohdejoukkoUri.indexOf(that.kohdejoukko.value) > -1;
                    });
                }
            };

            this.hakutapa = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.hakutapa.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakutapaUri.indexOf(that.hakutapa.value) > -1;
                    });
                }
            };

            this.hakutyyppi = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.hakutyyppi.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakutyyppiUri.indexOf(that.hakutyyppi.value) > -1;
                    });
                }
            };

        }]);
