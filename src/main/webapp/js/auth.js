var READ = "APP_VALINTOJENTOTEUTTAMINEN_READ";
var UPDATE = "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE";
var CRUD = "APP_VALINTOJENTOTEUTTAMINEN_CRUD";
var OPH_ORG = "1.2.246.562.10.00000000001";

app.factory('AuthService', function($q, $http) {
  return {
      readOrg : function(orgOid) {
        var deferred = $q.defer();
        $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function(result) {
            var found = false;
            result.split("/").forEach(function(org){
                if( myrolesResource.indexOf(READ + "_" + org) > -1 ||
                    myrolesResource.indexOf(UPDATE + "_" + org) > -1 ||
                    myrolesResource.indexOf(CRUD + "_" + org) > -1) {
                    found = true;
                }
            });
            if(found) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });
        return deferred.promise;
      },

      updateOrg : function(orgOid) {

        var deferred = $q.defer();
        $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function(result) {
            var found = false;

            result.split("/").forEach(function(org){
                if( myrolesResource.indexOf(UPDATE + "_" + org) > -1 ||
                    myrolesResource.indexOf(CRUD + "_" + org) > -1) {
                    found = true;
                }
            });
            if(found) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });
        return deferred.promise;
      },

      crudOrg : function(orgOid) {
        var deferred = $q.defer();
        $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function(result) {
            var found = false;
            result.split("/").forEach(function(org){
                if(myrolesResource.indexOf(CRUD + "_" + org) > -1) {
                    found = true;
                }
            });
            if(found) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });
        return deferred.promise;
      },

      readOph : function() {
        var deferred = $q.defer();

        if(myrolesResource.indexOf(READ + "_" + OPH_ORG) > -1 || myrolesResource.indexOf(UPDATE + "_" + OPH_ORG) > -1 || myrolesResource.indexOf(CRUD + "_" + OPH_ORG) > -1) {
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
      },

      updateOph : function() {
        var deferred = $q.defer();

        if(myrolesResource.indexOf(UPDATE + "_" + OPH_ORG) > -1 || myrolesResource.indexOf(CRUD + "_" + OPH_ORG) > -1) {
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
      },

      crudOph : function() {
        var deferred = $q.defer();
        if(myrolesResource.indexOf(CRUD + "_" + OPH_ORG) > -1) {
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
      },

  };
});