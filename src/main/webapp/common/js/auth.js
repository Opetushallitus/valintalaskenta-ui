//var VALINTAPERUSTEET = "APP_VALINTAPERUSTEET";
//var VALINTOJENTOTEUTTAMIEN = "APP_VALINTOJENTOTEUTTAMINEN";
//var SIJOITTELU = "APP_SIJOITTELU";

var READ = "READ";
var UPDATE = "READ_UPDATE";
var CRUD = "CRUD";
var OPH_ORG = "1.2.246.562.10.00000000001";

app.factory('MyRolesModel', function ($q, $http) {
    var deferred = $q.defer();

    $http.get(CAS_URL).success(function (result) {
        deferred.resolve(result);
    });

    return deferred.promise;
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

                        if (role.indexOf(service + targetRole) > -1) {
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