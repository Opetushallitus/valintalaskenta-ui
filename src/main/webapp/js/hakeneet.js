app.factory('HakeneetModel', function(HakukohdeModel) {
	var model;
	model = new function() {

		this.hakeneet = [];

		this.refresh = function(hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
            model.hakeneet = [
                    {
                        "etunimi":"testi1",
                        "sukunimi":"data4",
                        "hakemusOid":"123.123.123.121",
                        "hakijaOid":"123.123.123.121"
                    },{
                        "etunimi":"testi2",
                        "sukunimi":"data3",
                        "hakemusOid":"123.123.123.122",
                        "hakijaOid":"123.123.123.122"
                    },{
                        "etunimi":"testi3",
                        "sukunimi":"data2",
                        "hakemusOid":"123.123.123.123",
                        "hakijaOid":"123.123.123.123"
                    },{
                        "etunimi":"testi4",
                        "sukunimi":"data1",
                        "hakemusOid":"123.123.123.124",
                        "hakijaOid":"123.123.123.124"
                    },
                    ];
		}

		this.refreshIfNeeded = function(hakukohdeOid) {

            if(hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                model.refresh(hakukohdeOid);
            }
        }

	};

	return model;
});


function HakeneetController($scope, $location, $routeParams, HakeneetModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakeneetModel;
    $scope.hakukohdeModel = HakukohdeModel;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HakeneetModel.refreshIfNeeded($scope.hakukohdeOid);

    $scope.predicate = 'sukunimi';
}