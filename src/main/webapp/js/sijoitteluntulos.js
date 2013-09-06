app.factory('SijoitteluntulosModel', function(Sijoittelu, LatestSijoitteluajoHakukohde, HakemuksenTila, $timeout) {

	var model = new function() {

        this.hakuOid=null;
        this.hakukohdeOid=null;
		this.sijoittelu = {};
		this.latestSijoitteluajo = {};
		this.sijoitteluTulokset = {};
	    this.errors = [];

        this.refresh = function(hakuOid, hakukohdeOid) {
            model.errors.length = 0;
            model.hakuOid=hakuOid;
            model.hakukohdeOid=hakukohdeOid;
            model.sijoittelu = {};
            model.latestSijoitteluajo = {};
            model.sijoitteluTulokset = {};

             LatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid
                }, function(result) {
                    model.sijoitteluTulokset = result;

                    var valintatapajonot = model.sijoitteluTulokset.valintatapajonot;

                    for(var j = 0 ; j < valintatapajonot.length ; ++j) {
                        var valintatapajonoOid = valintatapajonot[j].oid;
                        var hakemukset = valintatapajonot[j].hakemukset;

                        for(var k = 0 ; k < hakemukset.length ; ++k ){
                            var hakemus = hakemukset[k];

                            var tilaParams = {
                                hakuoid: hakuOid,
                                hakukohdeOid: hakukohdeOid,
                                valintatapajonoOid: valintatapajonoOid,
                                hakemusOid: hakemus.hakemusOid
                            }

                            //make rest calls in separate scope to prevent hakemusOid to be overridden
                            model.setHakemuksenTila(hakemus, tilaParams);

                        }
                    }

                }, function(error) {
                     model.errors.push(error);
                 });



            /*
            SijoitteluajoLatest.get({hakuOid: hakuOid}, function(result) {
                if(result && result.length > 0) {
                    model.latestSijoitteluajo = result[0];
                    var currentSijoitteluajoOid = model.latestSijoitteluajo.sijoitteluajoId;

                        LatestSijoitteluajoHakukohde.get({
                            sijoitteluajoOid: currentSijoitteluajoOid,
                            hakukohdeOid: hakukohdeOid
                        }, function(result) {
                            model.sijoitteluTulokset = result;

                            var valintatapajonot = model.sijoitteluTulokset.valintatapajonot;

                            for(var j = 0 ; j < valintatapajonot.length ; ++j) {
                                var valintatapajonoOid = valintatapajonot[j].oid;
                                var hakemukset = valintatapajonot[j].hakemukset;
                                
                                for(var k = 0 ; k < hakemukset.length ; ++k ){
                                    var hakemus = hakemukset[k];
                                    
                                    var tilaParams = {
                                        hakuoid: hakuOid,
                                        hakukohdeOid: hakukohdeOid,
                                        valintatapajonoOid: valintatapajonoOid, 
                                        hakemusOid: hakemus.hakemusOid
                                    }

                                    //make rest calls in separate scope to prevent hakemusOid to be overridden 
                                    model.setHakemuksenTila(hakemus, tilaParams);

                                }
                            }

                        });


                }
            }, function(error) {
                model.errors.push(error);
            });

            */
        };

        this.setHakemuksenTila = function(hakemus, tilaParams) {
            HakemuksenTila.get(tilaParams, function(result) {
                if(!result.tila) {
                    hakemus.hakemuksentila = "";
                    hakemus.muokattuTila ="";
                } else {
                    hakemus.hakemuksentila = result.tila;
                    hakemus.muokattuTila =   result.tila;
                }
            }, function(error) {
                model.errors.push(error);
            });
        }

		//refresh if haku or hakukohde has changed
		this.refresIfNeeded = function(hakuOid, hakukohdeOid, isHakukohdeChanged) {
			if(model.sijoittelu.hakuOid !== hakuOid || isHakukohdeChanged) {
				model.refresh(hakuOid, hakukohdeOid);
			}
		};

        this.updateHakemuksienTila = function(valintatapajonoOid){
            for(var j = 0 ; j < model.sijoitteluTulokset.valintatapajonot.length ; ++j) {
                if(model.sijoitteluTulokset.valintatapajonot[j].oid  === valintatapajonoOid) {
                    for(var k = 0 ; k < model.sijoitteluTulokset.valintatapajonot[j].hakemukset.length ; ++k ){
                        var hakemus = model.sijoitteluTulokset.valintatapajonot[j].hakemukset[k];
                        if(hakemus.hakemuksentila != hakemus.muokattuTila) {
                            model.updateHakemuksenTila(hakemus.muokattuTila, valintatapajonoOid, hakemus.hakemusOid, "Massamuokkaus");
                        }
                    }
                }
            }
        };

        this.updateHakemuksenTila = function(newtila, valintatapajonoOid, hakemusOid, selite) {
            var tilaParams = {
                hakuoid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                valintatapajonoOid: valintatapajonoOid,
                hakemusOid: hakemusOid,
                selite: selite
            }

            var tilaObj = {tila: newtila};
            
            HakemuksenTila.post(tilaParams, tilaObj, function(result) {
                model.refresh(model.hakuOid, model.hakukohdeOid);
            }, function(error) {
                alert("Virhe: " + error.data.message);
            });
        }

	};

	return model;

});


function SijoitteluntulosController($rootScope, $scope, $routeParams, $window, $http, HakukohdeModel, SijoitteluntulosModel, Hyvaksymiskirjeet, Jalkiohjauskirjeet, SijoitteluXls, AuthService) {
   $scope.hakuOid =  $routeParams.hakuOid;
   $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;
    $scope.model.refresIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
    
    $scope.updateHakemuksenTila = function(hakemus, valintatapajonoOid) {
        $scope.model.updateHakemuksenTila(hakemus.muokattuTila, valintatapajonoOid, hakemus.hakemusOid, hakemus.selite);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    }

    $scope.submit = function(valintatapajonoOid) {
        console.log("submit");
        $scope.model.updateHakemuksienTila(valintatapajonoOid);
    }

    $scope.createHyvaksymiskirjeetPDF = function() {
    	Hyvaksymiskirjeet.query({sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId, hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid}, function(resurssi) {
    		$window.location.href = resurssi.latausUrl;
    	}, function(response) {
    		alert(response.data.viesti);
    	});
    	
    }
    $scope.createJalkiohjauskirjeetPDF = function() {
    	Jalkiohjauskirjeet.query({sijoitteluajoId: $scope.model.latestSijoitteluajo.sijoitteluajoId, hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid}, function(resurssi) {
    		$window.location.href = resurssi.latausUrl;
    	}, function(response) {
    		alert(response.data.viesti);
    	});
    }
    
    $scope.sijoittelunTulosXLS = function() {
    	SijoitteluXls.query({hakuOid: $routeParams.hakuOid, hakukohdeOid:$routeParams.hakukohdeOid, sijoitteluajoId: $scope.model.sijoitteluTulokset.sijoitteluajoId});
    }
    
    $scope.showMuutaHakemus = function(hakemus) {
        if(($scope.updateOrg && hakemus.tila == 'HYVAKSYTTY') || $scope.updateOph) {
            hakemus.muokattuTila = "ILMOITETTU";
            hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
        }
        $scope.$broadcast('centralizeElement');
    }

    $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOid', function() {
        AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOid).then(function(){
            $scope.updateOrg = true;
        });

        AuthService.crudOph("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOid).then(function(){
            $scope.updateOph = true;
        });
    });

    $scope.showSijoitteluPartial = function(hakemus) {
        hakemus.showSijoitteluPartial = !hakemus.showSijoitteluPartial;
    };
}
