app.factory('HakukohteetModel', function(Haku, HakuHakukohdeChildren) {
    var model;
    model = new function(){

        this.hakuOid = {};
        this.hakukohteet = [
                            "1.2.246.562.14.299022856910", "1.2.246.562.14.11033627743", "1.2.246.562.14.14450225579", "1.2.246.562.14.11950062056", "1.2.246.562.14.93911772304"
                          ];

        this.refresh = function(hakuOid) {
            model.hakuOid = hakuOid;
            HakuHakukohdeChildren.get({"hakuOid": hakuOid}, function(result) {
                model.hakukohteet = result;
            });
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