app.factory('SijoitteluntulosModel', function(Sijoittelu, SijoitteluajoLatest, SijoitteluajoHakukohde, HakemuksenTila, $timeout) {

	var model = new function() {

		this.sijoittelu = {};
		this.latestSijoitteluajo = {};
		this.sijoitteluTulokset = {};
		this.hakemuksenTilat = ["ILMOITETTU", "VASTAANOTTANUT_LASNA", "VASTAANOTTANUT_POISSAOLEVA", "PERUNUT"];

        this.refresh = function(hakuOid) {
            
            SijoitteluajoLatest.get({hakuOid: hakuOid}, function(result) {
                if(result && result.length > 0) {
                    model.latestSijoitteluajo = result[0];
                    var currentSijoitteluajoOid = model.latestSijoitteluajo.sijoitteluajoId;
                    for(var i = 0 ; i < model.latestSijoitteluajo.hakukohteet.length ; i++) {
                        var currentHakukohdeOid = model.latestSijoitteluajo.hakukohteet[i].oid;

                        SijoitteluajoHakukohde.get({
                            sijoitteluajoOid: currentSijoitteluajoOid,
                            hakukohdeOid: currentHakukohdeOid
                        }, function(result) {
                            model.sijoitteluTulokset = result;

                            var valintatapajonot = model.sijoitteluTulokset.valintatapajonot;

                            for(var j = 0 ; j < valintatapajonot.length ; ++j) {
                                var valintatapajonoOid = valintatapajonot[j].oid;
                                var hakemukset = valintatapajonot[j].hakemukset;
                                
                                for(var k = 0 ; k < hakemukset.length ; ++k ){
                                    var hakemus = hakemukset[k];
                                    
                                    var tilaParams = {
                                        hakukohdeOid: currentHakukohdeOid, 
                                        valintatapajonoOid: valintatapajonoOid, 
                                        hakemusOid: hakemus.hakemusOid
                                    }

                                    //make rest calls in separate scope to prevent hakemusOid to be overridden 
                                    model.setHakemuksenTila(hakemus, tilaParams);

                                }
                            }

                        });

                    }
                }
            });
        };

        this.setHakemuksenTila = function(hakemus, tilaParams) {
            HakemuksenTila.get(tilaParams, function(result) {
                if(!result.tila) {
                    hakemus.hakemuksentila = "";
                } else {
                    hakemus.hakemuksentila = result.tila;
                }

                console.log(hakemus.hakemusOid + " : " + hakemus.hakemuksentila);
            });
        }

		//refresh if haku or hakukohde has changed
		this.refresIfNeeded = function(hakuOid, isHakukohdeChanged) {
			if(model.sijoittelu.hakuOid !== hakuOid || isHakukohdeChanged) {
				model.refresh(hakuOid);
			}
		};

        this.udpateHakemuksenTila = function(newtila, hakukohdeOid, valintatapajonoOid, hakemusOid) {
            var tilaParams = {
                hakukohdeOid: hakukohdeOid,
                valintatapajonoOid: valintatapajonoOid,
                hakemusOid: hakemusOid
            }

            var tilaObj = {tila: newtila};
            
            HakemuksenTila.post(tilaParams, tilaObj, function(result) {
               console.log(result);
            });
        }

	};

	return model;

});


function SijoitteluntulosController($scope, $routeParams, HakukohdeModel, SijoitteluntulosModel) {
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;
    $scope.model.refresIfNeeded($routeParams.hakuOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));

    
    $scope.updateHakemuksenTila = function(tila, valintatapajonoOid, hakemusOid) {
        $scope.model.udpateHakemuksenTila(tila, HakukohdeModel.getHakukohdeOid(), valintatapajonoOid, hakemusOid);
    }

    $scope.sijoitteluntulosExcelExport = "http://localhost:8180/sijoittelu-service/resources/" + "export/sijoitteluntulos.xls?hakuOid=" + $routeParams.hakuOid;
}
