app.factory('ValintalaskentatulosModel', function(ValinnanvaiheListByHakukohde, JarjestyskriteeriArvo,JarjestyskriteeriTila) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.valinnanvaiheet = [];
		
		this.refresh = function(hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			     model.valinnanvaiheet = result;
			});
		}

		this.updateJarjestyskriteerinArvo = function(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, kriteerinArvo) {
			var updateParams = {
				valintatapajonoOid: valintatapajonoOid,
        		hakemusOid: hakemusOid,
        		jarjestyskriteeriprioriteetti: jarjestyskriteeriprioriteetti
			}

			JarjestyskriteeriArvo.post(updateParams, kriteerinArvo, function(result) {});
		}
        this.updateJarjestyskriteerinTila = function(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, tila) {
            var updateParams = {
                valintatapajonoOid: valintatapajonoOid,
                hakemusOid: hakemusOid,
                jarjestyskriteeriprioriteetti: jarjestyskriteeriprioriteetti
            }

            JarjestyskriteeriTila.post(updateParams, tila, function(result) {});
        }

	};

	return model;
});


function ValintalaskentatulosController($scope, $location, $routeParams, ValintalaskentatulosModel, HakukohdeModel, $http) {

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ValintalaskentatulosModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refresh($scope.hakukohdeOid);
    $scope.valintalaskentatulosExcelExport = SERVICE_EXCEL_URL_BASE + "export/valintalaskentatulos.xls?hakukohdeOid=" + $routeParams.hakukohdeOid;



    $scope.showHistory = function(valintatapajonoOid, hakemusOid) {
        $location.path('/valintatapajono/' + valintatapajonoOid + '/hakemus/' + hakemusOid + '/valintalaskentahistoria');
    };


    $scope.hyvaksyHarkinnanvaisesti = function(valintatapajonoOid, hakemusOid) {
        var tila ="HYVAKSYTTY_HARKINNANVARAISESTI";
        var prioriteetti =0;
        $scope.model.updateJarjestyskriteerinTila(valintatapajonoOid, hakemusOid, prioriteetti, tila)
    };

    $scope.updateJarjestyskriteerinArvo = function(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, kriteerinArvo) {
    	$scope.model.updateJarjestyskriteerinArvo(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, kriteerinArvo);
    };


   $scope.showTilaPartial = function(valintatulos) {
         if(valintatulos.showTilaPartial == null || valintatulos.showTilaPartial == false) {
             valintatulos.showTilaPartial = true;
         } else {
             valintatulos.showTilaPartial = false;
         }
     };
    $scope.showHenkiloPartial = function(valintatulos) {
        if(valintatulos.showHenkiloPartial == null || valintatulos.showHenkiloPartial == false) {
            valintatulos.showHenkiloPartial = true;
        } else {
            valintatulos.showHenkiloPartial = false;
        }
    };

}