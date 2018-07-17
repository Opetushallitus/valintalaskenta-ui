"use strict";


var app = angular.module('valintalaskenta')
    .constant('READ', 'READ')
    .constant('UPDATE', 'READ_UPDATE')
    .constant('CRUD', 'CRUD')
    .constant('MUSIIKKI', 'TOISEN_ASTEEN_MUSIIKKIALAN_VALINTAKAYTTAJA')
    .constant('OPH_ORG', "1.2.246.562.10.00000000001")
    .constant('PERUUNTUNEIDEN_HYVAKSYNTA', 'PERUUNTUNEIDEN_HYVAKSYNTA');


app.factory('MyRolesModel', function ($q, $http, $timeout) {
    var deferred = $q.defer();

    var refresh = function () {
        $http.get(window.url("cas.myroles")).then(function (result) {
            if (result.data.length > 0) {
                deferred.resolve(result.data);
            } else {
                $timeout(function () {
                    refresh();
                }, 1000);
            }
        }, function () {
            $timeout(function () {
                refresh();
            }, 1000);
        });
    };

    refresh();

    return deferred.promise;
});

app.factory('ParametriService', function ($q, Parametrit) {
    var hakuOid = null;
    var p = null;
    return function (newHakuOid) {
        if (hakuOid != newHakuOid) {
            p = Parametrit.list({hakuOid: newHakuOid}).$promise.then(
                function (x) { return x; },
                function (e) { console.log(e); alert("Parametri-service ei vastaan: " + JSON.stringify(e)); }
            );
            hakuOid = newHakuOid;
        }
        return p;
    };
});


app.factory('AuthService', function ($q, $http, $timeout, MyRolesModel, _,
                                     CRUD, READ, UPDATE, OPH_ORG, MUSIIKKI, PERUUNTUNEIDEN_HYVAKSYNTA) {

    // organisation check
    var roleCheck = function (service, org, model, roles) {
        if (!service) {
          console.error('roleCheck called with undefined auth-service');
        }
        var found = false;
        roles.forEach(function (role) {
            if (model.indexOf(service + "_" + role + "_" + org) > -1) {
                found = true;
            }
        });
        if (!found) {
          console.log('Could not find any of the roles ' + roles + ' for service ' + service + ' and org ' + org);
        }
        return found;
    };

    var accessCheck = function (service, orgOid, roles) {
        if (!orgOid) {
          console.warn('accessCheck called with undefined orgOid');
        }

        var deferred = $q.defer();

        MyRolesModel.then(function (model) {
            $http.get(window.url("organisaatio-service.organisaatio.parentoids", orgOid))
                .success(function (result) {
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

        musiikkiOrg: function (service, orgOid) {
            return accessCheck(service, orgOid, [MUSIIKKI]);
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

        peruuntuneidenHyvaksyntaOph: function (service) {
            return ophAccessCheck(service, [PERUUNTUNEIDEN_HYVAKSYNTA]);
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

app.directive('auth', function ($animate, $timeout, $routeParams, AuthService, ParametriService, UserModel, _, HakukohdeModel, HakuModel) {
    return {
        link: function ($scope, element, attrs) {
            $animate.addClass(element, 'ng-hide');
            UserModel.refreshIfNeeded();

            var success = function () {
                if (attrs.authAdditionalCheck) {

                    ParametriService($routeParams.hakuOid).then(function (privileges) {
                        attrs.$observe('korkeakouluCheck', function(value) {
                            if (value === 'true') {
                                $animate.addClass(element, 'ng-hide');
                            }
                        });
                        if (privileges[attrs.authAdditionalCheck]) {
                            $animate.removeClass(element, 'ng-hide');
                        }
                    });

                } else {
                    $animate.removeClass(element, 'ng-hide');
                }

            };

            var failure = function () {
              console.warn('Auth check failure for ' + attrs.auth + ' for element ' + element[0].outerHTML);
              $animate.addClass(element, 'ng-hide');
            };

          function handleAuth(orgOid) {
              switch (attrs.auth) {
                case "crudOph":
                  AuthService.crudOph(attrs.authService).then(success, failure);
                  break;

                case "updateOph":
                  AuthService.updateOph(attrs.authService).then(success, failure);
                  break;

                case "readOph":
                  AuthService.readOph(attrs.authService).then(success, failure);
                  break;

                case "crud":
                  AuthService.crudOrg(attrs.authService, orgOid).then(success, failure);
                  break;

                case "update":
                  AuthService.updateOrg(attrs.authService, orgOid).then(success, failure);
                  break;

                case "read":
                  AuthService.readOrg(attrs.authService, orgOid).then(success, failure);
                  break;

                default:
                  console.info('handleAuth switch case went to default case for parameter ' + attrs.auth);
                  AuthService.check(attrs.auth.split(" "), attrs.authService, orgOid).then(success, failure);
                  break;
            }
          }

          if (attrs.authKkUser) {
            UserModel.organizationsDeferred.promise.then(function () {
              if (UserModel.isKKUser || UserModel.isOphUser) {
                $animate.removeClass(element, 'ng-hide');
              } else {
                  $timeout(function () {
                    handleAuth()
                  }, 0);

                        attrs.$observe('authOrg', function () {
                            if (attrs.authOrg) {
                                switch (attrs.auth) {
                                    case "crud":
                                        AuthService.crudOrg(attrs.authService, attrs.authOrg).then(success, failure);
                                        break;

                                    case "update":
                                        AuthService.updateOrg(attrs.authService, attrs.authHakukohdeOrg).then(success, failure);
                                        break;

                                    case "read":
                                        AuthService.readOrg(attrs.authService, attrs.authOrg).then(success, failure);
                                        break;

                                    default:
                                        AuthService.check(attrs.auth.split(" "), attrs.authService, attrs.authOrg).then(success, failure);
                                        break;
                                }
                            }
                        });

                    }

                    if ($routeParams.hakukohdeOid) {
                        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function () {

                            if(HakukohdeModel.hakukohde && HakukohdeModel.hakukohde.tarjoajaOids) {
                                _.forEach(HakukohdeModel.hakukohde.tarjoajaOids, function (orgOid) {
                                  handleAuth(orgOid)
                                });
                            }
                        });
                    }

                });
            } else if ($routeParams.hakukohdeOid) {
                HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function () {
                    $timeout(function () {
                      handleAuth()
                    }, 0);

                    if(HakukohdeModel.hakukohde && HakukohdeModel.hakukohde.tarjoajaOids) {
                        _.forEach(HakukohdeModel.hakukohde.tarjoajaOids, function (orgOid) {
                          handleAuth(orgOid)
                        });
                    }
                });
            } else if (attrs.authTarjoajaOrgUser) {
              HakuModel.refreshIfNeeded($routeParams.hakuOid).then(function () {
                var tarjoajaOid = HakuModel.hakuOid.organisaatioOids[0];
                handleAuth(tarjoajaOid);
              });
            } else {
                $timeout(function () {
                  handleAuth()
                }, 0);

                attrs.$observe('authOrg', function () {
                    if (attrs.authOrg) {
                      handleAuth(attrs.authOrg);
                    }
                });
            }

        }
    }
});

