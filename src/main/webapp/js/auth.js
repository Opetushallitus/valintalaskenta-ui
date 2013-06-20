//var VALINTAPERUSTEET = "APP_VALINTAPERUSTEET";
//var VALINTOJENTOTEUTTAMIEN = "APP_VALINTOJENTOTEUTTAMINEN";
//var SIJOITTELU = "APP_SIJOITTELU";

var READ = "_READ";
var UPDATE = "_READ_UPDATE";
var CRUD = "_CRUD";
var OPH_ORG = "1.2.246.562.10.00000000001";

app.factory('AuthService', function($q, $http) {
  return {
      readOrg : function(service, orgOid) {
        var deferred = $q.defer();
        $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function(result) {
            var found = false;
            result.split("/").forEach(function(org){
                if( myrolesResource.indexOf(service + READ + "_" + org) > -1 ||
                    myrolesResource.indexOf(service + UPDATE + "_" + org) > -1 ||
                    myrolesResource.indexOf(service + CRUD + "_" + org) > -1) {
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

      updateOrg : function(service, orgOid) {

        var deferred = $q.defer();
        $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function(result) {
            var found = false;

            result.split("/").forEach(function(org){
                if( myrolesResource.indexOf(service + UPDATE + "_" + org) > -1 ||
                    myrolesResource.indexOf(service + CRUD + "_" + org) > -1) {
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

      crudOrg : function(service, orgOid) {
        var deferred = $q.defer();
        $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids").success(function(result) {
            var found = false;
            result.split("/").forEach(function(org){
                if(myrolesResource.indexOf(service + CRUD + "_" + org) > -1) {
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

      readOph : function(service) {
        var deferred = $q.defer();

        if(myrolesResource.indexOf(service + READ + "_" + OPH_ORG) > -1 || myrolesResource.indexOf(service + UPDATE + "_" + OPH_ORG) > -1 || myrolesResource.indexOf(service + CRUD + "_" + OPH_ORG) > -1) {
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
      },

      updateOph : function(service) {
        var deferred = $q.defer();

        if(myrolesResource.indexOf(service + UPDATE + "_" + OPH_ORG) > -1 || myrolesResource.indexOf(service + CRUD + "_" + OPH_ORG) > -1) {
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
      },

      crudOph : function(service) {
        var deferred = $q.defer();
        if(myrolesResource.indexOf(service + CRUD + "_" + OPH_ORG) > -1) {
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
      },

  };
});