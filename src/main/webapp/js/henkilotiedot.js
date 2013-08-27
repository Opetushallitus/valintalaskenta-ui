
app.factory('HenkiloTiedotModel', function(Hakemus, ValintalaskentaHakemus, ValintalaskentaHakemus) {
	var model = new function() {
		this.hakemus = {};
		this.haku = {};
		this.errors = [];

		this.refresh = function(hakuOid, hakemusOid) {
			model.errors.length = 0;
			
			Hakemus.get({oid: hakemusOid}, function(result) {
				model.hakemus = result;
			});

			ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function(result) {
				model.haku = result;
			});
		}

		this.refreshIfNeeded = function(hakuOid, hakemusOid) {
			if(model.hakemus.oid !== hakemusOid || model.haku.oid !== hakemusOid) {
				model.refresh(hakuOid, hakemusOid);
			}
		}
	}
	return model;
});



function HenkiloTiedotController($scope,$routeParams,HenkiloTiedotModel) {
	$scope.model = HenkiloTiedotModel;

	$scope.model.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakemusOid);
	

}