app.factory('ValintalaskentatulosModel', function(ValinnanvaiheListByHakukohde, JarjestyskriteeriMuokattuJonosija) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.valinnanvaiheet = [];
        this.errors = [];
		
		this.refresh = function(hakukohdeOid) {
		    model.hakukohdeOid = {};
            model.valinnanvaiheet = [];
            model.errors = [];
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			     model.valinnanvaiheet = result;
			}, function(error) {
                model.errors.push(error);
            });
		}

	};

	return model;
});


function ValintalaskentatulosController($scope, $location, $routeParams, $timeout, ValintalaskentatulosModel, TulosXls, HakukohdeModel, $http, AuthService) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ValintalaskentatulosModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refresh($scope.hakukohdeOid);
    
    $scope.valintalaskentaTulosXLS = function() {
    	TulosXls.query({hakukohdeOid:$routeParams.hakukohdeOid});
    }

    $scope.showHistory = function(valintatapajonoOid, hakemusOid) {
        $location.path('/valintatapajono/' + valintatapajonoOid + '/hakemus/' + hakemusOid + '/valintalaskentahistoria');
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

    AuthService.crudOph("APP_VALINTOJENTOTEUTTAMINEN").then(function(){
        $scope.updateOph = true;
    });

    $scope.limit = 20;
    $scope.lazyLoading = function() {
        $scope.showLoading = true;
        $timeout(function(){
            $scope.limit += 50;
            $scope.showLoading = false;
        }, 10);
    }

}
