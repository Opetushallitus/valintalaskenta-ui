app.factory('SijoitteluntulosModel', function(Sijoittelu, SijoitteluajoLatest, SijoitteluajoHakukohde, HakemuksenTila, $timeout) {

	var model = new function() {

        this.hakuOid=null;
        this.hakukohdeOid=null;
		this.sijoittelu = {};
		this.latestSijoitteluajo = {};
		this.sijoitteluTulokset = {};
		this.hakemuksenTilat = ["ILMOITETTU", "VASTAANOTTANUT_LASNA", "VASTAANOTTANUT_POISSAOLEVA", "PERUNUT"];

        this.refresh = function(hakuOid, hakukohdeOid) {
            model.hakuOid=hakuOid;
            model.hakukohdeOid=hakukohdeOid;
            SijoitteluajoLatest.get({hakuOid: hakuOid}, function(result) {
                if(result && result.length > 0) {
                    model.latestSijoitteluajo = result[0];
                    var currentSijoitteluajoOid = model.latestSijoitteluajo.sijoitteluajoId;

                        SijoitteluajoHakukohde.get({
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
		this.refresIfNeeded = function(hakuOid, hakukohdeOid, isHakukohdeChanged) {
			if(model.sijoittelu.hakuOid !== hakuOid || isHakukohdeChanged) {
				model.refresh(hakuOid, hakukohdeOid);
			}
		};

        this.udpateHakemuksenTila = function(newtila, valintatapajonoOid, hakemusOid) {
            var tilaParams = {
                hakuoid: model.hakuOid,
                hakukohdeOid: model.hakukohdeOid,
                valintatapajonoOid: valintatapajonoOid,
                hakemusOid: hakemusOid
            }

            var tilaObj = {tila: newtila};
            
            HakemuksenTila.post(tilaParams, tilaObj, function(result) {});
        }

	};

	return model;

});


function SijoitteluntulosController($scope, $routeParams, HakukohdeModel, SijoitteluntulosModel) {

    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;
    $scope.model.refresIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
    
    $scope.updateHakemuksenTila = function(tila,valintatapajonoOid, hakemusOid) {
        $scope.model.udpateHakemuksenTila(tila,valintatapajonoOid, hakemusOid);
    }

    $scope.sijoitteluntulosExcelExport = SIJOITTELU_EXCEL_URL_BASE + "resources/export/sijoitteluntulos.xls?hakuOid=" + $routeParams.hakuOid;
}
