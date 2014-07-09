"use strict";

var READ = "READ";
var UPDATE = "READ_UPDATE";
var CRUD = "CRUD";
var OPH_ORG = "1.2.246.562.10.00000000001";

app.factory('MyRolesModel', function ($q, $http, $timeout) {
    var deferred = $q.defer();

    // retrytetään niin kauan, että oikeuksia saadaan.
    var refresh = function () {

        $http.get(CAS_URL).success(function (result) {
            // kyllä nyt jotain oikeuksia pitäis olla, jos tänne on tultu
            if (result.length > 0) {
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

        instance.promise = function () {
            return instance.deferred.promise;
        };

        return instance;
    }();

    return parametrit;
});


app.factory('AuthService', function ($q, $http, $timeout, MyRolesModel) {

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
    }

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
    }

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