app.factory('ValintalaskentatulosModel', function(ValinnanvaiheListByHakukohde, JarjestyskriteeriMuokattuJonosija) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.valinnanvaiheet = [];
        this.errors = [];
		
		this.refresh = function(hakukohdeOid) {
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			     model.valinnanvaiheet = result;
			}, function(error) {
                model.errors.push(error);
            });
		}

		this.updateJarjestyskriteeri = function(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, kriteerinArvo, tila, selite) {
			var updateParams = {
				valintatapajonoOid: valintatapajonoOid,
        		hakemusOid: hakemusOid,
        		jarjestyskriteeriprioriteetti: jarjestyskriteeriprioriteetti,
        		selite: selite
			}

			var postParams = {
                tila: tila,
                arvo: kriteerinArvo
			};

			JarjestyskriteeriMuokattuJonosija.post(updateParams, postParams, function(result) {
			    model.refresh(model.hakukohdeOid);
			});

		}

	};

	return model;
});


function ValintalaskentatulosController($scope, $location, $routeParams, ValintalaskentatulosModel, TulosXls, HakukohdeModel, $http) {
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

    $scope.muutaJarjestyskriteerinArvo = function(tulos, valintatapajonoOid, self) {
    	$scope.model.updateJarjestyskriteeri(valintatapajonoOid, tulos.hakemusOid, tulos.jarjestyskriteeriPrioriteetti.value, tulos.jarjestyskriteeriArvo, tulos.jarjestyskriteeriTila, tulos.selite);

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

    $scope.showMuutaJarjestyskriteerinArvo = function(valintatulos) {
        valintatulos.prioriteetit = [];
        for(i in valintatulos.jarjestyskriteerit) {
            if(i == 0) {
                var obj = {name: "Yhteispisteet", value: i};
                valintatulos.jarjestyskriteeriPrioriteetti = obj;
                valintatulos.prioriteetit.push(obj);
            }
            else {
                var obj = {name: i, value: i};
                valintatulos.prioriteetit.push(obj);
            }
        }  

        if(valintatulos.showJarjestyskriteerit == null || valintatulos.showJarjestyskriteerit == false) {
            valintatulos.showJarjestyskriteerit = true;
        } else {
            valintatulos.showJarjestyskriteerit = false;
        }
        valintatulos.jarjestyskriteeriTila ="HYVAKSYTTY_HARKINNANVARAISESTI";

        $scope.$broadcast('centralizeElement');

    }

}