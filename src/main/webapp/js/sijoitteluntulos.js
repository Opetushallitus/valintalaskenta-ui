app.factory('SijoitteluntulosModel', function($q, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila, $timeout, SijoitteluAjo, VastaanottoTilat) {

	var model = new function() {

        this.hakuOid=null;
        this.hakukohdeOid=null;
		this.sijoittelu = {};
		this.latestSijoitteluajo = {};
		this.sijoitteluTulokset = {};
	    this.errors = [];

        this.hakemusErittelyt = []; //dataa perustietonäkymälle

        this.refresh = function(hakuOid, hakukohdeOid) {
            model.errors = [];
            model.errors.length = 0;
            model.hakuOid=hakuOid;
            model.hakukohdeOid=hakukohdeOid;
            model.sijoittelu = {};
            model.latestSijoitteluajo = {};
            model.sijoitteluTulokset = {};
            model.hakemusErittelyt.length = 0;

            LatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid
                }, function(result) {
                    model.sijoitteluTulokset = result;

                    var valintatapajonot = model.sijoitteluTulokset.valintatapajonot;
                    if(valintatapajonot) {
                        valintatapajonot.forEach(function(valintatapajono, index) {

                            var valintatapajonoOid = valintatapajono.oid;
                            var hakemukset = valintatapajono.hakemukset;
                        
                            //pick up data to be shown in basicinformation vie
                            var hakemuserittely = {
                                hyvaksytyt: [],
                                paikanVastaanottaneet: [],
                                hyvaksyttyHarkinnanvaraisesti: [],
                                varasijoilla: []
                            }

                            model.hakemusErittelyt.push(hakemuserittely);

                            if(hakemukset) {
                                hakemukset.forEach(function(hakemus) {
                                    if(hakemus.tila === "HYVAKSYTTY") {
                                        hakemuserittely.hyvaksytyt.push(hakemus);
                                    }

                                    if(hakemus.hyvaksyttyHarkinnanvaraisesti) {
                                        hakemuserittely.hyvaksyttyHarkinnanvaraisesti.push(hakemus);
                                    }

                                    if(hakemus.varasijanNumero != undefined) {
                                        hakemuserittely.varasijoilla.push(hakemus);
                                    }
                                });
                            }

                            console.log(model.hakemusErittelyt);
                            
                            VastaanottoTilat.get({hakukohdeOid: hakukohdeOid,
                                                  valintatapajonoOid: valintatapajonoOid}, function(result) {
                                
                                if(hakemukset) {
                                    hakemukset.forEach(function(currentHakemus) {

                                        //make rest calls in separate scope to prevent hakemusOid to be overridden during rest call
                                        currentHakemus.vastaanottoTila = "";
                                        currentHakemus.muokattuVastaanottoTila ="";

                                        result.some(function(vastaanottotila){
                                            if(vastaanottotila.hakemusOid === currentHakemus.hakemusOid) {
                                                currentHakemus.vastaanottoTila = vastaanottotila.tila;
                                                currentHakemus.muokattuVastaanottoTila = vastaanottotila.tila;
                                                if(currentHakemus.vastaanottoTila === "VASTAANOTTANUT_POISSAOLEVA" || currentHakemus.vastaanottoTila === "VASTAANOTTANUT_LASNA"){
                                                    hakemuserittely.paikanVastaanottaneet.push(currentHakemus);
                                                }
                                                return true;
                                            }
                                        });
                                    });
                                }
                                
                            }, function(error) {
                                model.errors.push(error);
                            });

                            
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
		this.refreshIfNeeded = function(hakuOid, hakukohdeOid, isHakukohdeChanged) {
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

    $scope.limit = 20;
    $scope.lazyLoading = function() {
        $scope.showLoading = true;
        $timeout(function(){
            $scope.limit += 50;
            $scope.showLoading = false;
        }, 10);
    }

}
