"use strict";


angular.module('valintalaskenta')
    .constant('READ', 'READ')
    .constant('UPDATE', 'READ_UPDATE')
    .constant('CRUD', 'CRUD')
    .constant('OPH_ORG', "1.2.246.562.10.00000000001");


app.factory('MyRolesModel', function ($q, $http, $timeout) {
    var deferred = $q.defer();

    var kkCrud = ["USER_tampere", "VIRKAILIJA", "LANG_fi", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.727160772010", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.727160772010", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.727160772010", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_KKVASTUU", "APP_HENKILONHALLINTA_KKVASTUU_1.2.246.562.10.727160772010", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.727160772010", "APP_OID", "APP_OID_CRUD", "APP_OID_CRUD_1.2.246.562.10.727160772010", "APP_OMATTIEDOT", "APP_OMATTIEDOT_CRUD", "APP_OMATTIEDOT_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ_UPDATE", "APP_HENKILONHALLINTA_READ_UPDATE_1.2.246.562.10.727160772010", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.727160772010", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.727160772010", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.727160772010", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.727160772010"];
    var kkUpdate = ["USER_tampere", "VIRKAILIJA", "LANG_fi", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.727160772010", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.727160772010", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.727160772010", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_KKVASTUU", "APP_HENKILONHALLINTA_KKVASTUU_1.2.246.562.10.727160772010", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINENKK_READ_UPDATE_1.2.246.562.10.727160772010", "APP_OID", "APP_OID_CRUD", "APP_OID_CRUD_1.2.246.562.10.727160772010", "APP_OMATTIEDOT", "APP_OMATTIEDOT_CRUD", "APP_OMATTIEDOT_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ_UPDATE", "APP_HENKILONHALLINTA_READ_UPDATE_1.2.246.562.10.727160772010", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE_1.2.246.562.10.727160772010", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_READ_UPDATE", "APP_VALINTAPERUSTEETKK_READ_UPDATE_1.2.246.562.10.727160772010", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ_UPDATE", "APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.727160772010", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.727160772010"];
    var kkRead = ["USER_tampere", "VIRKAILIJA", "LANG_fi", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.727160772010", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.727160772010", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.727160772010", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_KKVASTUU", "APP_HENKILONHALLINTA_KKVASTUU_1.2.246.562.10.727160772010", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_READ", "APP_VALINTOJENTOTEUTTAMINENKK_READ_1.2.246.562.10.727160772010", "APP_OID", "APP_OID_CRUD", "APP_OID_CRUD_1.2.246.562.10.727160772010", "APP_OMATTIEDOT", "APP_OMATTIEDOT_CRUD", "APP_OMATTIEDOT_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ_UPDATE", "APP_HENKILONHALLINTA_READ_UPDATE_1.2.246.562.10.727160772010", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ", "APP_VALINTOJENTOTEUTTAMINEN_READ_1.2.246.562.10.727160772010", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_READ", "APP_VALINTAPERUSTEETKK_READ_1.2.246.562.10.727160772010", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.727160772010", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.727160772010"];


    // retrytetään niin kauan, että oikeuksia saadaan.
    var refresh = function () {

        $http.get(CAS_URL).success(function (result) {
            // kyllä nyt jotain oikeuksia pitäis olla, jos tänne on tultu
            if (result.length > 0) {

//                deferred.resolve(kkCrud);
                deferred.resolve(result);
            } else {
                $timeout(function () {
                    refresh();
                }, 1000);
            }
        }).error(function () {
            $timeout(function () {
                refresh();
            }, 1000);
        });
    };

    refresh();

    return deferred.promise;
});

app.factory('ParametriService', function ($q, Parametrit) {

    var parametrit = function () {
        var instance = {};
        var oldHakuOid;
        var privileges = {};
        instance.deferred = $q.defer();

        instance.refresh = function (hakuOid) {

            if (hakuOid != oldHakuOid) {

                Parametrit.list({hakuOid: hakuOid}, function (data) {
                    privileges = data;
                    instance.deferred.resolve(data);
                }, function (error) {
                    alert("parametri service ei vastaa: " + error);
                });

            }

        };

        instance.showHakeneet = function () {
            return privileges.hakeneet;
        };
        instance.showHarkinnanvaraiset = function () {
            return privileges.harkinnanvaraiset;
        };
        instance.showPistesyotto = function () {
            return privileges.pistesyotto;
        };
        instance.showValinnanhallinta = function () {
            return privileges.valinnanhallinta;
        };
        instance.showValintalaskenta = function () {
            return privileges.valintalaskenta;
        };
        instance.showValintakoekutsut = function () {
            return privileges.valintakoekutsut;
        };
        instance.showHakijaryhmat = function () {
            return privileges.hakijaryhmat;
        };

        instance.promise = function () {
            return instance.deferred.promise;
        };

        return instance;
    }();

    return parametrit;
});


app.factory('AuthService', function ($q, $http, $timeout, MyRolesModel, _, CRUD, READ, UPDATE, OPH_ORG) {

    // organisation check
    var roleCheck = function (service, org, model, roles) {
        var found = false;
        roles.forEach(function (role) {
            if (model.indexOf(service + "_" + role + "_" + org) > -1) {
                found = true;
            }
        });
        return found;
    };

    var accessCheck = function (service, orgOid, roles) {
        var deferred = $q.defer();

        MyRolesModel.then(function (model) {
            $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function (result) {
                var found = false;
                result.split("/").forEach(function (org) {
                    if (roleCheck(service, org, model, roles)) {
                        found = true;
                    }
                });
                if (found) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
        });

        return deferred.promise;
    };

    // OPH check -- voidaan ohittaa organisaatioiden haku
    var ophAccessCheck = function (service, roles) {
        var deferred = $q.defer();
        MyRolesModel.then(function (model) {
            if (roleCheck(service, OPH_ORG, model, roles)) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });

        return deferred.promise;
    };

    return {
        check: function (roles, service, orgOid) {
            return accessCheck(service, orgOid, roles);
        },

        readOrg: function (service, orgOid) {
            return accessCheck(service, orgOid, [READ, UPDATE, CRUD]);
        },

        updateOrg: function (service, orgOid) {
            return accessCheck(service, orgOid, [UPDATE, CRUD]);
        },

        crudOrg: function (service, orgOid) {
            return accessCheck(service, orgOid, [CRUD]);
        },

        readOph: function (service) {
            return ophAccessCheck(service, [READ, UPDATE, CRUD]);
        },

        updateOph: function (service) {
            return ophAccessCheck(service, [UPDATE, CRUD]);
        },

        crudOph: function (service) {
            return ophAccessCheck(service, [CRUD]);
        },

        getOrganizations: function (service, targetRoles) {
            var deferred = $q.defer();
            MyRolesModel.then(function (model) {

                var organizations = [];

                model.forEach(function (role) {
                    // TODO: refaktor..
                    targetRoles.forEach(function (targetRole) {
                        var org;
                        if (role.indexOf(service + "_" + targetRole) > -1) {
                            var split = role.split("_");
                            org = split[split.length - 1];
                        }

                        if (org && org.indexOf(".") != -1 && organizations.indexOf(org) == -1) {
                            organizations.push(org);
                        }
                    });
                });

                deferred.resolve(organizations);
            });
            return deferred.promise;
        }

    };
});

app.directive('privileges', function ($animate, $timeout, ParametriService) {
    return {
        link: function ($scope, element, attrs) {
         //   $animate.addClass(element, 'ng-hide');

            $timeout(function () {
                ParametriService.promise().then(function (data) {
                    if (data[attrs.privileges] || attrs.authKkUser) {

                      //  $animate.removeClass(element, 'ng-hide');
                    }
                });
            });

        }
    };
});

app.directive('auth', function ($animate, $timeout, AuthService, ParametriService, UserModel) {
    return {
        link: function ($scope, element, attrs) {
            $animate.addClass(element, 'ng-hide');
            UserModel.refreshIfNeeded();

            var success = function () {
                if (attrs.authAdditionalCheck) {

                    ParametriService.promise().then(function (data) {

                        if (attrs.korkeakouluCheck === 'true') {
                            $animate.addClass(element, 'ng-hide');
                        } else
                        if (data[attrs.authAdditionalCheck]) {
                            $animate.removeClass(element, 'ng-hide');
                        }
                    });

                } else {
                    $animate.removeClass(element, 'ng-hide');
                }

            };
            if (attrs.authKkUser) {
                UserModel.organizationsDeferred.promise.then(function () {
                    if (UserModel.isKKUser || UserModel.isOphUser) {
                        $animate.removeClass(element, 'ng-hide');
                    } else {
                        $timeout(function () {
                            switch (attrs.auth) {

                                case "crudOph":
                                    AuthService.crudOph(attrs.authService).then(success);
                                    break;

                                case "updateOph":
                                    AuthService.updateOph(attrs.authService).then(success);
                                    break;

                                case "readOph":
                                    AuthService.readOph(attrs.authService).then(success);
                                    break;
                            }
                        }, 0);

                        attrs.$observe('authOrg', function () {
                            if (attrs.authOrg) {
                                switch (attrs.auth) {
                                    case "crud":
                                        AuthService.crudOrg(attrs.authService, attrs.authOrg).then(success);
                                        break;

                                    case "update":
                                        AuthService.updateOrg(attrs.authService, attrs.authOrg).then(success);
                                        break;

                                    case "read":
                                        AuthService.readOrg(attrs.authService, attrs.authOrg).then(success);
                                        break;

                                    default:
                                        AuthService.check(attrs.auth.split(" "), attrs.authService, attrs.authOrg).then(success);
                                        break;
                                }
                            }
                        });

                    }

                });
            } else {
                $timeout(function () {
                    switch (attrs.auth) {

                        case "crudOph":
                            AuthService.crudOph(attrs.authService).then(success);
                            break;

                        case "updateOph":
                            AuthService.updateOph(attrs.authService).then(success);
                            break;

                        case "readOph":
                            AuthService.readOph(attrs.authService).then(success);
                            break;
                    }
                }, 0);

                attrs.$observe('authOrg', function () {
                    if (attrs.authOrg) {
                        switch (attrs.auth) {
                            case "crud":
                                AuthService.crudOrg(attrs.authService, attrs.authOrg).then(success);
                                break;

                            case "update":
                                AuthService.updateOrg(attrs.authService, attrs.authOrg).then(success);
                                break;

                            case "read":
                                AuthService.readOrg(attrs.authService, attrs.authOrg).then(success);
                                break;

                            default:
                                AuthService.check(attrs.auth.split(" "), attrs.authService, attrs.authOrg).then(success);
                                break;
                        }
                    }
                });
            }

        }
    }
});

