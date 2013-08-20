app.factory('HakeneetModel', function(HakukohdeHenkilot, Hakemus, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.hakukohdeOid = hakukohdeOid;
            HakukohdeHenkilot.get({hakuOid: hakuOid,hakukohdeOid: hakukohdeOid}, function(result) {
            model.hakeneet = result;

            /*
                model.hakeneet.forEach(function(hakija){
                    Hakemus.get({oid: hakija.applicationOid}, function(result) {
                     hakija.hakemus=result;
                    });
                });
            */

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

function HakeneetController($scope, $location, $routeParams, HarkinnanvaraisetModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HarkinnanvaraisetModel;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);
}
