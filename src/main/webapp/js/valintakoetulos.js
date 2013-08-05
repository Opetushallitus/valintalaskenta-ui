app.factory('ValintakoetulosModel', function(Valintakoetulokset) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.koetulokset = [];
		this.valintakokeet = {};
		
		this.refresh = function(hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
            
			Valintakoetulokset.get({hakukohdeoid: hakukohdeOid}, function(result) {
			    model.koetulokset = result;
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
                                entry.createdAt = koetulos.createdAt;
                                
                                entry.valintakoeOid = valintakoe.valintakoeOid;
                                entry.valintakoeTunniste = valintakoe.valintakoeTunniste;
                                entry.osallistuminen = valintakoe.osallistuminen;
                                
                                if (model.valintakokeet[entry.valintakoeOid] === undefined )
                                {
                                	model.valintakokeet[entry.valintakoeOid] = {valintakoeOid: entry.valintakoeOid, valintakoeTunniste: entry.valintakoeTunniste, hakijat: [entry]};    
                                } else {
                                	model.valintakokeet[entry.valintakoeOid].hakijat.push(entry);
                                	
                                }
                            });
                        });
                    }
                });
            });
		}

	};

	return model;
});


function ValintakoetulosController($scope, $window, $routeParams, ValintakoetulosModel, HakukohdeModel, Osoitetarrat) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ValintakoetulosModel;
    $scope.hakukohdeModel = HakukohdeModel;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    $scope.model.refresh($scope.hakukohdeOid);

    $scope.predicate = 'hakijaOid';

    $scope.valintakoeTulosXLS = function(valintakoeOid) {
    	$window.location.href = SERVICE_EXCEL_URL_BASE + "export/valintakoetulos.xls?hakukohdeOid=" + $routeParams.hakukohdeOid + "&valintakoeOid=" + valintakoeOid;
    }
    $scope.addressLabelPDF = function(valintakoeOid) {
    	Osoitetarrat.lataaPDF($routeParams.hakukohdeOid, valintakoeOid).aktivoi(function(resurssi) {
    		$window.location.href = resurssi.latausUrl;
    	});
    }
}   
