app.factory('SijoitteluntulosModel', function(Sijoittelu, SijoitteluajoLatest, SijoitteluajoHakukohde) {

	var model = new function() {

		this.sijoittelu = {};
		this.latestSijoitteluajo = {};
		this.sijoitteluTulokset = {};
		

		this.refresh = function(hakuOid) {

			//HAKUOID KOVAKOODATTU SYKSYNHAUKSI
			//Sijoittelu.get({hakuOid: "syksynhaku"},function(result) {
			//	model.sijoittelu = result;
			//});

			//HAKUOID KOVAKOODATTU SYKSYNHAUKSI
			SijoitteluajoLatest.get({hakuOid: hakuOid}, function(result) {
				model.latestSijoitteluajo = result[0];

				var currentSijoitteluajoOid = model.latestSijoitteluajo.sijoitteluajoId;
				for(var i = 0 ; i < model.latestSijoitteluajo.hakukohteet.length ; i++) {
					var currentHakukohdeOid = model.latestSijoitteluajo.hakukohteet[i].oid;

					SijoitteluajoHakukohde.get({
						sijoitteluajoOid: currentSijoitteluajoOid,
						hakukohdeOid: currentHakukohdeOid
					}, function(result) {
						model.sijoitteluTulokset = result;
					});
				}
			
			});

		};

		//refresh if haku or hakukohde has changed
		this.refresIfNeeded = function(hakuOid, isHakukohdeChanged) {
			if(model.sijoittelu.hakuOid !== hakuOid || isHakukohdeChanged) {
				model.refresh(hakuOid);
			}
		};

		this.formatMillis = function(millis) {
            if(millis === null) {
                date = new Date(millis);
                return date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
            }
		};
		/*
		function sortHakemuksetByTasasijaAndTasasijaJonosija(hakemukset) {
			for(var i = 0 ; i < hakemukset ; ++i) {
				console.log(hakemukset[i]);
			}
		}
		*/
	};

	return model;

});


function SijoitteluntulosController($scope, $routeParams, HakukohdeModel, SijoitteluntulosModel) {
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model = SijoitteluntulosModel;
    $scope.model.refresIfNeeded($routeParams.hakuOid, HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid));
}
