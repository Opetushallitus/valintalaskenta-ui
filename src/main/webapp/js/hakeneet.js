app.factory('HakeneetModel', function(HakukohdeHenkilot, Hakemus, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];
        this.dbProblems = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.hakukohdeOid = hakukohdeOid;
            model.hakuOid = hakuOid;

            HakukohdeHenkilot.get({hakuOid: hakuOid,hakukohdeOid: hakukohdeOid}, function(result) {
            model.hakeneet = result;

            /*
                model.hakeneet.forEach(function(hakija){
                    Hakemus.get({oid: hakija.applicationOid}, function(result) {
                     hakija.hakemus=result;
                    });
                });
            */

            }, function(error) {
                model.dbProblems.push(error);
            });
		}


		this.refreshIfNeeded = function(hakukohdeOid, hakuOid) {
            if(hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }
        }
	};

	return model;
});

function HakeneetController($scope, $location, $routeParams, HakeneetModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);
    $scope.hakukohdeModel = HakukohdeModel;

    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid,$scope.hakuOid);
    $scope.model = HakeneetModel;
}
