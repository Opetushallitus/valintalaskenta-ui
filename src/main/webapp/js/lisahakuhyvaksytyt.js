app.factory('HyvaksytytModel', function(HakukohdeHenkilot, Hakemus, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];
        this.errors = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            HakukohdeHenkilot.get({aoOid: hakukohdeOid}, function(result) {
                model.hakeneet = result.results;
                if(model.hakeneet) {
                    model.hakeneet.forEach(function(hakija){

                        Hakemus.get({oid: hakija.applicationOid}, function(result) {
                            hakija.hakemus=result;
                            HakemusKey.get({
                                oid: hakija.applicationOid,
                                "key": "lisahaku-hyvaksytty"
                            }, function(res) {
                                if(res["lisahaku-hyvaksytty"] === model.hakukohdeOid) {
                                    hakija.lisahakuHyvaksytty = "Kyllä";
                                }
                            });
                        })
                    });    
                }
                
            }, function(error) {
                model.errors.push(error);
            });
		}

       this.updateHakemus = function(hakemusOid) {
            HakemusKey.put({
               "oid": hakemusOid,
               "key": "lisahaku-hyvaksytty",
               "value": model.hakukohdeOid
           });
           model.hakeneet.forEach(function(hakija) {
               if(hakija.applicationOid == hakemusOid) {
                   hakija.lisahakuHyvaksytty = "Kyllä";
               }
           });
       }

        this.removeHakemusFromHyvaksytyt = function(hakemusOid) {
            HakemusKey.put({
                "oid": hakemusOid,
                "key": "lisahaku-hyvaksytty",
                "value": ""
            });
            model.hakeneet.forEach(function(hakija) {
                if(hakija.applicationOid == hakemusOid) {
                    hakija.lisahakuHyvaksytty = null;
                }
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

function LisahakuhyvaksytytController($scope, $location, $routeParams, HyvaksytytModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HyvaksytytModel;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.arvoFilter = "SYOTETTAVA_ARVO";
    $scope.muutettu = false;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HyvaksytytModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'sukunimi';

    $scope.submit = function() {
        //HakeneetModel.submit();
    }

    $scope.lisahakuValitse = function(hakemusOid) {
        $scope.model.updateHakemus(hakemusOid);
    };

    $scope.lisahakuPoistavalinta = function(hakemusOid) {
        $scope.model.removeHakemusFromHyvaksytyt(hakemusOid);
    };
}
