//var VALINTAPERUSTEET = "APP_VALINTAPERUSTEET";
//var VALINTOJENTOTEUTTAMIEN = "APP_VALINTOJENTOTEUTTAMINEN";
//var SIJOITTELU = "APP_SIJOITTELU";

var READ = "_READ";
var UPDATE = "_READ_UPDATE";
var CRUD = "_CRUD";
var OPH_ORG = "1.2.246.562.10.00000000001";

app.factory('MyRolesModel', function ($http) {

    var factory = (function() {
        var instance = {};
        instance.myroles = [];

        instance.refresh = function() {
            if(instance.myroles.length == 0) {
                $http.get(CAS_URL).success(function(result) {
                    instance.myroles = result;
                });
            }
        }

        return instance;
    })();

    return factory;

});



app.factory('AuthService', function($q, $http, $timeout, MyRolesModel, loadingService) {

    // organisation check
    var readAccess = function(service,org) {
        if( MyRolesModel.myroles.indexOf(service + READ + "_" + org) > -1 ||
            MyRolesModel.myroles.indexOf(service + UPDATE + "_" + org) > -1 ||
            MyRolesModel.myroles.indexOf(service + CRUD + "_" + org) > -1) {
            return true;
        }
    };

    var updateAccess = function(service,org) {
        if( MyRolesModel.myroles.indexOf(service + UPDATE + "_" + org) > -1 ||
            MyRolesModel.myroles.indexOf(service + CRUD + "_" + org) > -1) {
            return true;
        }
    };

    var crudAccess = function(service,org) {
        if( MyRolesModel.myroles.indexOf(service + CRUD + "_" + org) > -1) {
            return true;
        }
    };

    var accessCheck = function(service, orgOid, accessFunction) {
        var deferred = $q.defer();
        var waitTime = 10;

        var check = function() {
            MyRolesModel.refresh();
            waitTime = waitTime + 500;
            if (MyRolesModel.myroles.length === 0) {
                $timeout(check, waitTime);
            } else {
                $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function(result) {
                    var found = false;
                    result.split("/").forEach(function(org){
                        if(accessFunction(service,org)){
                            found = true;
                        }
                    });
                    if(found) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
            }
        }

        $timeout(check, waitTime);

        return deferred.promise;
    }

    // OPH check
    var ophRead = function(service) {
        return (MyRolesModel.myroles.indexOf(service + READ + "_" + OPH_ORG) > -1
          || MyRolesModel.myroles.indexOf(service + UPDATE + "_" + OPH_ORG) > -1
          || MyRolesModel.myroles.indexOf(service + CRUD + "_" + OPH_ORG) > -1);
    }

    var ophUpdate = function(service) {
        return (MyRolesModel.myroles.indexOf(service + UPDATE + "_" + OPH_ORG) > -1
          || MyRolesModel.myroles.indexOf(service + CRUD + "_" + OPH_ORG) > -1);
    }

    var ophCrud = function(service) {
        return (MyRolesModel.myroles.indexOf(service + CRUD + "_" + OPH_ORG) > -1);
    }

    var ophAccessCheck = function(service, accessFunction) {
        var deferred = $q.defer();
        var waitTime = 10;

        var check = function() {
            MyRolesModel.refresh();
            waitTime = waitTime + 500;
            if (MyRolesModel.myroles.length === 0) {
                $timeout(check, waitTime);
            } else {
                if(accessFunction(service)) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }
        }

        $timeout(check, waitTime);

        return deferred.promise;
    }

  return {
      readOrg : function(service, orgOid) {
        return accessCheck(service, orgOid, readAccess);
      },

      updateOrg : function(service, orgOid) {
        return accessCheck(service, orgOid, updateAccess);
      },

      crudOrg : function(service, orgOid) {
        return accessCheck(service, orgOid, crudAccess);
      },

      readOph : function(service) {
        return ophAccessCheck(service, ophRead);
      },

      updateOph : function(service) {
        return ophAccessCheck(service, ophUpdate);
      },

      crudOph : function(service) {
        return ophAccessCheck(service, ophCrud);
      },

  };
});