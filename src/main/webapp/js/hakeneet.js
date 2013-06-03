app.factory('HakeneetModel', function(HakukohdeAvaimet) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];

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

            var params = [hakukohdeOid];
            HakukohdeAvaimet.post(params, function(result) {
                //model.avaimet = result;
                model.avaimet = [
                                {
                                "tunniste": "tunniste3",
                                "kuvaus": "123",
                                "funktiotyyppi": "LUKUARVOFUNKTIO",
                                "lahde": "SYOTETTAVA_ARVO",
                                "onPakollinen": true,
                                "min": 123,
                                "max": 789,
                                "arvot": null
                             },
                                {
                                "tunniste": "tunniste2",
                                "kuvaus": "1",
                                "funktiotyyppi": "LUKUARVOFUNKTIO",
                                "lahde": "SYOTETTAVA_ARVO",
                                "onPakollinen": true,
                                "min": null,
                                "max": null,
                                "arvot":       [
                                   "8",
                                   "10",
                                   "9"
                                ]
                             },
                                {
                                "tunniste": "tunniste1",
                                "kuvaus": "123",
                                "funktiotyyppi": "LUKUARVOFUNKTIO",
                                "lahde": "SYOTETTAVA_ARVO",
                                "onPakollinen": true,
                                "min": null,
                                "max": null,
                                "arvot":       [
                                   "3",
                                   "2",
                                   "1"
                                ]
                             },
                                {
                                "tunniste": "tunniste4",
                                "kuvaus": "123",
                                "funktiotyyppi": "TOTUUSARVOFUNKTIO",
                                "lahde": "SYOTETTAVA_ARVO",
                                "onPakollinen": true,
                                "min": 0,
                                "max": 400,
                                "arvot": null
                             }
                          ];
                model.avaimet.forEach(function(avain){
                    avain.tyyppi = function(){
                        if(avain.funktiotyyppi == "TOTUUSARVOFUNKTIO") {
                            return "checkbox";
                        }
                        return avain.arvot && avain.arvot.length > 0 ? "combo" : "input";
                    };
                });
                model.hakeneet.forEach(function(hakija){
                    model.avaimet.forEach(function(avain){
                        if(!hakija[avain.tunniste]){
                            hakija[avain.tunniste] = "";
                        }
                    });
                });
            });
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
