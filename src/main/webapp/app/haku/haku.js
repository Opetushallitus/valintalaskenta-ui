angular.module('valintalaskenta')

    .factory('HakuModel', ['$q', '$log', 'Haku', 'HaunTiedot', 'TarjontaHaut',
        function ($q, $log, Haku, HaunTiedot, TarjontaHaut) {
            "use strict";

            var model;
            model = new function () {
                this.hakuOid = "";
                this.haut = [];
                this.lisahaku = false;
                this.nivelvaihe = false;

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
                    if (model.haut.length === 0) {
                        TarjontaHaut.query({}, function (result) {
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

                        }, function (error) {
                            $log.error(error);
                        });
                    }

                };

            }();


            return model;
        }])

    .controller('HakuController', ['$log', '$scope', '$location', '$routeParams', 'HakuModel', 'ParametriService', 'UserModel', 'CustomHakuFilterUtil', 'CustomHakuFilterOptions',
        function ($log, $scope, $location, $routeParams, HakuModel, ParametriService, UserModel, CustomHakuFilterUtil, CustomHakuFilterOptions) {
            "use strict";
            $scope.hakumodel = HakuModel;
            HakuModel.init($routeParams.hakuOid);
            UserModel.refreshIfNeeded();
            $scope.customFilterUtil = CustomHakuFilterUtil;

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

            $scope.customHakuFilterOptions = CustomHakuFilterOptions;


            $scope.rajaaHakujaModal = function () {

            };

            $scope.hakukausiOpts = [
                {key: 'Kevät', value: '_k'},
                {key: 'Syksy', value: '_s'}
            ];

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


    .factory('CustomHakuFilterOptions', ['$q', 'HakujenHakutyypit', 'HakujenKohdejoukot', 'HakujenHakutavat', 'HakujenHakukaudet',
        function ($q, HakujenHakutyypit, HakujenKohdejoukot, HakujenHakutavat, HakujenHakukaudet) {
            var optionsModel = new function () {
                this.deferred = undefined;
                this.hakuVuosiOpts = undefined;
                this.hakukausiOpts = undefined;
                this.hakuKohdejoukkoOpts = undefined;
                this.hakutyyppiOpts = undefined;
                this.hakutapaOpts = undefined;

                this.refresh = function () {
                    optionsModel.deferred = $q.defer();
                    var promises = [];

                    var hakujentyypitDeferred = $q.defer();
                    promises.push(hakujentyypitDeferred.promise);

                    HakujenHakutyypit.get(function (result) {
                        optionsModel.hakutyyppiOpts = result;
                    });

                    HakujenKohdejoukot.get(function (result) {
                        optionsModel.hakuKohdejoukkoOpts = result;
                    });


                    $q.all(promises).then(function () {
                        optionsModel.deferred.resolve();
                    }, function (error) {
                        $log.error('CustomHakuFilterOptions päivitys epäonnistui', error)
                        optionsModel.deferred.reject();
                    });

                    return optionsModel.deferred.promise;
                };

                this.refreshIfNeeded = function () {
                    if (_.isEmpty(optionsModel.deferred)) {
                        return optionsModel.refresh();
                    } else {
                        return optionsModel.deferred.promise;
                    }
                };
            };

            return optionsModel;
        }])

    .filter('CustomHakuFilter', ['HakuModel', 'CustomHakuFilterUtil', '_',
        function (HakuModel, CustomHakuFilterUtil, _) {
            return function (haut) {
                var result = haut;
                _.each(_.keys(CustomHakuFilterUtil), function (filterKey) {
                    if (CustomHakuFilterParams[filterKey] !== null && CustomHakuFilterParams[filterKey] !== undefined) {
                        result = CustomHakuFilters[filterKey](result);
                    }
                });
                return result;

            };
        }])

    .service('CustomHakuFilterUtil', ['_', function (_) {

        var that = this;

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
                return !_.isNumber(that.hakuvuosi) ? haut : _.filter(haut, function (haku) {
                    return haku.hakukausiVuosi === that.hakuvuosi.value;
                });
            }
        };

        this.kohdejoukko = {
            value: undefined,
            filter: function (haut) {
                return !_.isString(that.kohdejoukko) ? haut : _.filter(haut, function (haku) {
                    return haku.kohdejoukkoUri === that.kohdejoukko.value;
                });
            }
        };

        this.hakutapa = {
            value: undefined,
            filter:function (haut) {
                return !_.isString(that.hakutapa) ? haut : _.filter(haut, function (haku) {
                    return haku.hakutapaUri === that.hakutapa.value;
                });
            }
        };

        this.hakutyyppi = {
            value: undefined,
            filter: function (haut) {
                return !_.isString(that.hakutyyppi) ? haut : _.filter(haut, function (haku) {
                    return haku.hakutyyppiUri === that.hakutyyppi;
                });
            }
        };

    }]);
