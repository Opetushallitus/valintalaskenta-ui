app.factory('HakeneetModel', function(HakukohdeHenkilot, Hakemus, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];
        this.errors = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
		    model.hakeneet = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakuOid = hakuOid;

            HakukohdeHenkilot.get({aoOid: hakukohdeOid}, function(result) {
                model.hakeneet = result.results;
                
                /*
                    model.hakeneet.forEach(function(hakija){
                        Hakemus.get({oid: hakija.applicationOid}, function(result) {
                         hakija.hakemus=result;
                        });
                    });
                */

            }, function(error) {
                model.errors.push(error);
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
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);
    $scope.hakukohdeModel = HakukohdeModel;

    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid,$scope.hakuOid);
    $scope.model = HakeneetModel;
}
