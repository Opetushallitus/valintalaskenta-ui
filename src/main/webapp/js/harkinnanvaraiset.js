app.factory('HarkinnanvaraisetModel', function(HakukohdeHenkilot, Hakemus, HarkinnanvarainenHyvaksynta, HarkinnanvaraisestiHyvaksytyt) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];
        this.errors = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
		    model.hakeneet = [];
            model.harkinnanvaraisestiHyvaksytyt = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakuOid = hakuOid;
            model.hakukohdeOid = hakukohdeOid;
            HakukohdeHenkilot.get({aoOid: hakukohdeOid}, function(result) {
                model.hakeneet = result.results;

                model.hakeneet.forEach(function(hakija){
                    Hakemus.get({oid: hakija.oid}, function(result) {
                     hakija.hakemus=result;
                     if(hakija.hakemus.answers) {
                        for(var i =0; i<10; i++) {
                            var oid = hakija.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];
                            if(oid === model.hakukohdeOid) {

                                var harkinnanvarainen = hakija.hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];
                                var discretionary = hakija.hakemus.answers.hakutoiveet["preference" + i + "-Harkinnanvarainen"];
                                hakija.hakenutHarkinnanvaraisesti = harkinnanvarainen || discretionary;
                            }
                        }
                    }   
                    });
                });
            }, function(error) {
                model.errors.push(error);
            });

            HarkinnanvaraisestiHyvaksytyt.get({hakukohdeOid: hakukohdeOid, hakuOid: hakuOid}, function(result) {
                model.harkinnanvaraisestiHyvaksytyt = result;
            }, function(error) {
              model.errors.push(error);
            });



		}
		 this.hyvaksyHarkinnanvaraisesti = function(hakemusOid) {
                var updateParams = {
                    hakuOid: model.hakuOid,
                    hakukohdeOid: model.hakukohdeOid,
                    hakemusOid: hakemusOid
                }
                var postParams = {
                     hyvaksyttyHarkinnanvaraisesti: true,
                };
                HarkinnanvarainenHyvaksynta.post(updateParams, postParams, function(result) {

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

function HarkinnanvaraisetController($scope, $location, $routeParams, HarkinnanvaraisetModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HarkinnanvaraisetModel;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.arvoFilter = "SYOTETTAVA_ARVO";
    $scope.muutettu = false;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HarkinnanvaraisetModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'sukunimi';

    $scope.submit = function() {
        HakeneetModel.submit();
    }

    $scope.hyvaksyHarkinnanvaisesti = function(hakemusOid) {
        $scope.model.hyvaksyHarkinnanvaraisesti(hakemusOid)
    };

}
