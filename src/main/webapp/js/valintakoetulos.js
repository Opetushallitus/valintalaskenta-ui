app.factory('ValintakoetulosModel', function(Valintakoetulokset) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.koetulokset = [];
		this.flatKoetulokset = [];
		
		this.refresh = function(hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
			Valintakoetulokset.get({hakukohdeoid: hakukohdeOid}, function(result) {
			    model.koetulokset = result;

			    model.koetulokset = [
                                    				{
                                                        "hakuOid":     "hakuOid1"
                                                        ,"hakemusOid":  "oid1"
                                                        ,"hakijaOid":   "hakijaOid1"
                                                        ,"hakutoiveet":
                                                            [
                                                                {
                                                                    "hakukohdeOid": "1.2.246.562.14.53803369791"
                                                                    ,"valinnanVaiheet":
                                                                    [
                                                                        {
                                                                            "valinnanVaiheOid": "valinnanVaiheOid1"
                                                                            ,"valinnanVaiheJarjestysluku": 1
                                                                            ,"valintakokeet":
                                                                            [
                                                                                {
                                                                                    "valintakoeOid": "valintakoeOid1"
                                                                                    ,"valintakoeTunniste": "t1"
                                                                                    ,"osallistuminen": "OSALLISTUU"
                                                                                }
                                                                            ]
                                                                        }

                                                                    ]
                                                                },{
                                                                    "hakukohdeOid": "1.2.246.562.14.2q34123"
                                                                    ,"valinnanVaiheet":
                                                                    [
                                                                        {
                                                                            "valinnanVaiheOid": "valinnanVaiheOid1"
                                                                            ,"valinnanVaiheJarjestysluku": 1
                                                                        }

                                                                    ]
                                                                }
                                                            ]
                                    				},
                                                    {
                                                        "hakuOid":     "hakuOid2"
                                                        ,"hakemusOid":  "oid2"
                                                        ,"hakijaOid":   "hakijaOid2"
                                                        ,"hakutoiveet":
                                                            [
                                                                {
                                                                    "hakukohdeOid": "1.2.246.562.14.53803369791"
                                                                    ,"valinnanVaiheet":
                                                                    [
                                                                        {
                                                                            "valinnanVaiheOid": "valinnanVaiheOid1"
                                                                            ,"valinnanVaiheJarjestysluku": 1
                                                                            ,"valintakokeet":
                                                                            [
                                                                                {
                                                                                    "valintakoeOid": "valintakoeOid1"
                                                                                    ,"valintakoeTunniste": "t1"
                                                                                    ,"osallistuminen": "OSALLISTUU"
                                                                                },{
                                                                                    "valintakoeOid": "valintakoeOid2"
                                                                                    ,"valintakoeTunniste": "t2"
                                                                                    ,"osallistuminen": "OSALLISTUU"
                                                                                }
                                                                            ]
                                                                        }

                                                                    ]
                                                                }
                                                            ]
                                    				},
                                    				{
                                                        "hakuOid":     "hakuOid2"
                                                        ,"hakemusOid":  "oid2"
                                                        ,"hakijaOid":   "hakijaOid3"
                                                        ,"hakutoiveet":
                                                            [
                                                                {
                                                                    "hakukohdeOid": "1.2.246.562.14.53803369791"
                                                                    ,"valinnanVaiheet":
                                                                    [
                                                                        {
                                                                            "valinnanVaiheOid": "valinnanVaiheOid1"
                                                                            ,"valinnanVaiheJarjestysluku": 1
                                                                            ,"valintakokeet":
                                                                            [
                                                                                {
                                                                                    "valintakoeOid": "valintakoeOid1"
                                                                                    ,"valintakoeTunniste": "t1"
                                                                                    ,"osallistuminen": "EI_OSALLISTU"
                                                                                }
                                                                            ]
                                                                        }

                                                                    ]
                                                                }
                                                            ]
                                    				},
                                    				{
                                                        "hakuOid":     "hakuOid2"
                                                        ,"hakemusOid":  "oid2"
                                                        ,"hakijaOid":   "hakijaOid4"
                                                        ,"hakutoiveet":
                                                            [
                                                                {
                                                                    "hakukohdeOid": "1.2.246.562.14.53803369791"
                                                                    ,"valinnanVaiheet":
                                                                    [
                                                                        {
                                                                            "valinnanVaiheOid": "valinnanVaiheOid1"
                                                                            ,"valinnanVaiheJarjestysluku": 1
                                                                            ,"valintakokeet":
                                                                            [
                                                                                {
                                                                                    "valintakoeOid": "valintakoeOid1"
                                                                                    ,"valintakoeTunniste": "t1"
                                                                                    ,"osallistuminen": "MAARITTELEMATON"
                                                                                }
                                                                            ]
                                                                        }

                                                                    ]
                                                                }
                                                            ]
                                    				}
                                    			];

                flatKoetulokset();
			});
		}

		// helpommin käsiteltävään muotoon tulokset. samoin privaattina
		// funktiona, niin ei turhaan pysty kutsumaan tätä suoraan ulkopuolelta.
		function flatKoetulokset() {
		    model.flatKoetulokset = [];
            model.koetulokset.forEach(function(koetulos){
                koetulos.hakutoiveet.forEach(function(hakutoive) {
                    if(hakutoive.hakukohdeOid === model.hakukohdeOid) {
                        hakutoive.valinnanVaiheet.forEach(function(valinnanvaihe) {
                            valinnanvaihe.valintakokeet.forEach(function(valintakoe) {
                                var entry = {};
                                entry.hakuOid = koetulos.hakueOid;
                                entry.hakemusOid = koetulos.hakemusOid;
                                entry.hakijaOid = koetulos.hakijaOid;

                                entry.valintakoeOid = valintakoe.valintakoeOid;
                                entry.valintakoeTunniste = valintakoe.valintakoeTunniste;
                                entry.osallistuminen = valintakoe.osallistuminen;

                                model.flatKoetulokset.push(entry);
                            });
                        });
                    }
                });
            });
		}

	};

	return model;
});


function ValintakoetulosController($scope, $location, $routeParams, ValintakoetulosModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = ValintakoetulosModel;
    $scope.hakukohdeModel = HakukohdeModel;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    $scope.model.refresh($scope.hakukohdeOid);

    $scope.predicate = 'hakijaOid';

}