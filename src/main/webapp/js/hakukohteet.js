app.factory('HakukohteetModel', function(Haku, HakuHakukohdeChildren, $http) {
    var model;
    model = new function(){

        this.hakuOid = {};
        this.hakukohteet = [];

        this.refresh = function(hakuOid) {
            model.hakuOid = hakuOid;
            $http.get(TARJONTA_URL_BASE + "haku/"+hakuOid+"/hakukohde").success(function(result) {
                model.hakukohteet = result;
            });
//            HakuHakukohdeChildren.get({"hakuOid": hakuOid}, function(result) {
//                model.hakukohteet = result;
//            });
        };

        this.refreshIfNeeded = function(hakuOid) {
            if(hakuOid && hakuOid != "undefined" && hakuOid != model.hakuOid) {
                model.refresh(hakuOid);
            }
        };
    };

    return model;
});

function HakukohteetController($scope, $location, $routeParams, HakukohteetModel) {

   $scope.hakuOid = $routeParams.hakuOid;
   $scope.hakukohdeOid = $routeParams.hakukohdeOid;

   // Muistetaan millä alasivulla ollaan, kun vaihdetaan hakukohdetta.
   $scope.subpage = $location.path().split('/')[5] || 'perustiedot';

   $scope.model = HakukohteetModel;
   $scope.model.refreshIfNeeded($routeParams.hakuOid);
}