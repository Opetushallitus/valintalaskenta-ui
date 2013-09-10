app.factory('HarkinnanvaraisetModel', function(HakukohdeHenkilot, Hakemus, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];
        this.errors = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
		    model.hakeneet = [];
            model.avaimet = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            HakukohdeHenkilot.get({aoOid: hakukohdeOid}, function(result) {
                model.hakeneet = result.results;

                model.hakeneet.forEach(function(hakija){
                    Hakemus.get({oid: hakija.applicationOid}, function(result) {
                     hakija.hakemus=result;

                    for(var i =0; i<10; i++) {
                        var oid = hakija.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];
                      //  console.log("Hakutoive[" + i +"] " + oid);
                        if(oid === model.hakukohdeOid) {
                            var harkinnanvarainen = hakija.hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];
                            hakija.hakenutHarkinnanvaraisesti =harkinnanvarainen;
                        }
                    }
                    });
                });
            }, function(error) {
                model.errors.push(error);
            });
		}

       this.updateJarjestyskriteerinTila = function(hakemusOid,  tila) {
                var updateParams = {
                    hakuOid : model.hakuOid,
                    hakukohdeOid:  model.hakukohdeOid,
                    hakemusOid: hakemusOid,
                }
                JarjestyskriteeriTila.post(updateParams, tila, function(result) {});
            };


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
        var tila ="HYVAKSYTTY_HARKINNANVARAISESTI";
        $scope.model.updateJarjestyskriteerinTila(hakemusOid, tila)
    };

}
