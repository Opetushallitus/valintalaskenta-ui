app.factory('HakukohteetModel', function($q, Haku, HakuHakukohdeChildren, HakukohdeNimi, AuthService) {
    var model;
    model = new function(){

        this.hakuOid = {};
        this.hakukohteet = [];
        this.filtered = [];
        this.searchWord = "";
        this.filterToggle = false;

        this.refresh = function(hakuOid) {
            model.hakuOid = hakuOid;
            model.hakukohteet = [];
            model.filtered = [];
            HakuHakukohdeChildren.get({"hakuOid": hakuOid}, function(result) {
              var hakukohdeOids = result;

              hakukohdeOids.forEach(function(element, index) {
                
                  HakukohdeNimi.get({hakukohdeoid: element.oid}, function(hakukohdeObject) {
                    model.hakukohteet.push(hakukohdeObject);
                    AuthService.readOrg("APP_VALINTOJENTOTEUTTAMINEN", hakukohdeObject.tarjoajaOid).then(function() {
                        model.filtered.push(hakukohdeObject);
                    });

                  });
              });

            });
        };

        this.refreshIfNeeded = function(hakuOid) {
            if( (hakuOid) && (hakuOid !== "undefined") && (hakuOid != model.hakuOid) ) {
                model.searchWord = "";
                model.refresh(hakuOid);
            }
        };

        this.blender = function(filter){
            if(filter) {
                return model.filtered;
            } else {
                return model.hakukohteet;
            }
        }
    };

    return model;
});

function HakukohteetController($rootScope, $scope, $location, $timeout, $routeParams, HakukohteetModel) {

   $scope.hakuOid = $routeParams.hakuOid;
   $scope.hakukohdeOid = $routeParams.hakukohdeOid;

   // Muistetaan millä alasivulla ollaan, kun vaihdetaan hakukohdetta.
   
   $scope.subpage = $location.path().split('/')[5] || 'perustiedot';
   $scope.model = HakukohteetModel;
   $scope.model.refreshIfNeeded($scope.hakuOid, $scope.hakukohdeOid);

   $scope.showHakukohde = function(hakukohdeOid) {
      $location.path('/haku/' + $scope.hakuOid + '/hakukohde/' + hakukohdeOid + '/' + $scope.subpage);
      //$scope.$broadcast('hideHakukohdeLista');
   }
}