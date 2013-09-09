app.factory('SijoitteluntulosModel', function($q, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila, $timeout, SijoitteluAjo, VastaanottoTilat) {

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

                        VastaanottoTilat.get({hakukohdeOid: hakukohdeOid,
                                              valintatapajonoOid: valintatapajonoOid}, function(result) {

                            for(var k = 0 ; k < hakemukset.length ; ++k ){
                                var hakemus = hakemukset[k];

                                //make rest calls in separate scope to prevent hakemusOid to be overridden
                                hakemus.vastaanottoTila = "";
                                hakemus.muokattuVastaanottoTila ="";
                                result.some(function(vastaanottotila){
                                    if(vastaanottotila.hakemusOid === hakemus.hakemusOid) {
                                        hakemus.vastaanottoTila = vastaanottotila.tila;
                                        hakemus.muokattuVastaanottoTila = vastaanottotila.tila;
                                        return true;
                                    }
                                });
                            }

                        }, function(error) {
                            model.errors.push(error);
                        });



                    }

                    SijoitteluAjo.get( {
                            hakuOid: hakuOid,
                            sijoitteluajoOid: result.sijoitteluajoId
                        }, function(result) {
                             model.latestSijoitteluajo.startMils = result.startMils;
                             model.latestSijoitteluajo.endMils = result.endMils;
                             model.latestSijoitteluajo.sijoitteluajoId = result.sijoitteluajoId;
                        },function(error) {
                            model.errors.push(error);
                        }
                    );

                }, function(error) {
                     model.errors.push(error);
                }).$promise.then(function(result){
                    console.log(result);
                });
        };

        this.setVastaanottoTila = function(hakemus, tilaParams) {
            VastaanottoTila.get(tilaParams, function(result) {
                if(!result.tila) {
                    hakemus.vastaanottoTila = "";
                    hakemus.muokattuVastaanottoTila ="";
                } else {
                    hakemus.vastaanottoTila = result.tila;
                    hakemus.muokattuVastaanottoTila =   result.tila;
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
                        if(hakemus.vastaanottoTila != hakemus.muokattuVastaanottoTila) {
                            hakemus.selite = "Massamuokkaus";
                            model.updateVastaanottoTila(hakemus, valintatapajonoOid);
                        }
                    }
                }
            }
        };

        this.updateVastaanottoTila = function(hakemus, valintatapajonoOid) {
            var tilaParams = {
                hakuoid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                valintatapajonoOid: valintatapajonoOid,
                hakemusOid: hakemus.hakemusOid,
                selite: hakemus.selite
            }
            hakemus.selite = "";
            var tilaObj = {tila: hakemus.muokattuVastaanottoTila};
            
            VastaanottoTila.post(tilaParams, tilaObj, function(result) {
                //model.refresh(model.hakuOid, model.hakukohdeOid);
                model.setVastaanottoTila(hakemus,tilaParams);
            });
        }

	};

	return model;

});


function SijoitteluntulosController($rootScope, $scope, $timeout, $routeParams, $window, $http, HakukohdeModel, SijoitteluntulosModel, Hyvaksymiskirjeet, Jalkiohjauskirjeet, SijoitteluXls, AuthService) {
   $scope.hakuOid =  $routeParams.hakuOid;
   $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;
    //$scope.model.refresIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));

    $scope.model.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);



    $scope.updateVastaanottoTila = function(hakemus, valintatapajonoOid) {
        $scope.model.updateVastaanottoTila(hakemus, valintatapajonoOid);
        hakemus.showMuutaHakemus = !hakemus.showMuutaHakemus;
    }

    $scope.submit = function(valintatapajonoOid) {
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
            hakemus.muokattuVastaanottoTila = "ILMOITETTU";
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
