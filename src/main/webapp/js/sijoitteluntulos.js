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
            model.sijoittelu = {};
            model.latestSijoitteluajo = {};
            model.sijoitteluTulokset = {};
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


function SijoitteluntulosController($scope, $routeParams, $window, $http, HakukohdeModel, SijoitteluntulosModel, Hyvaksymiskirjeet, Jalkiohjauskirjeet, Osoitetarrat) {
   $scope.hakuOid =  $routeParams.hakuOid;;
   $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;

    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;
    $scope.model.refresIfNeeded($routeParams.hakuOid, $routeParams.hakukohdeOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
    
    $scope.updateHakemuksenTila = function(tila, valintatapajonoOid, hakemusOid) {
        $scope.model.udpateHakemuksenTila(tila, valintatapajonoOid, hakemusOid);
    }
    
    $scope.addressLabelPDF = function() {
    	var json = {"addressLabels":[{"firstName":"Etunimi","lastName":"Sukunimi","addressline":"Osoiterivi1","addressline2":"Osoiterivi2","addressline3":"Osoiterivi3","postalCode":"00500","city":"Helsinki","region":"Kallio","country":"Suomi","countryCode":"FI"}]};
    	
    	Osoitetarrat.lataaPDF(json);
    }
    
    $scope.hyvaksymiskirjePDF = function() {
    	var json = {"letters":[{"addressLabel":{"firstName":"Simo","lastName":"Vaatehuone","addressline":"kuustosenkuja 6","addressline2":"","addressline3":"","postalCode":"66000","city":"Seinäjoki","region":"Etelä-Pohjanmaa","country":"Suomi","countryCode":"FI_fi"},"languageCode":"FI_fi","koulu":"Musiikkilukio","koulutus":"Yo","tulokset":[]}]};
    	
    	Hyvaksymiskirjeet.lataaPDF(json);
    	
    }
    $scope.jalkiohjauskirjePDF = function() {
    	var json = {"letters":[{"addressLabel":{},"languageCode":"FI_fi","tulokset":[]}]};
    	
    	Jalkiohjauskirjeet.lataaPDF(json);
    }

    $scope.sijoitteluntulosExcelExport = SIJOITTELU_EXCEL_URL_BASE + "resources/export/sijoitteluntulos.xls?hakuOid=" + $routeParams.hakuOid + "&hakukohdeOid=" +$routeParams.hakukohdeOid;
}
