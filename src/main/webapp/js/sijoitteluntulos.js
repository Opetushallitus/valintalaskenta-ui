app.factory('SijoitteluntulosModel', function(Sijoittelu, SijoitteluajoLatest, SijoitteluajoHakukohde) {

	var model = new function() {

		this.sijoittelu = {};
		this.latestSijoitteluajo = {};
		this.sijoitteluTulokset = {};
		

		this.refresh = function() {

			//HAKUOID KOVAKOODATTU SYKSYNHAUKSI
			Sijoittelu.get({hakuOid: "syksynhaku"},function(result) {
				model.sijoittelu = result;
			});

			SijoitteluajoLatest.get({hakuOid: "syksynhaku"}, function(result) {
				model.latestSijoitteluajo = result[0];

				var currentSijoitteluajoOid = model.latestSijoitteluajo.sijoitteluajoId;
				for(var i = 0 ; i < model.latestSijoitteluajo.hakukohteet.length ; i++) {
					var currentHakukohdeOid = model.latestSijoitteluajo.hakukohteet[i].oid;

					SijoitteluajoHakukohde.get({
						sijoitteluajoOid: currentSijoitteluajoOid,
						hakukohdeOid: currentHakukohdeOid
					}, function(result) {
						model.sijoitteluTulokset = result;
						console.log(model.sijoitteluTulokset.valintatapajonot);
					});
				}
			
			});

		};

		this.refresIfNeeded = function(hakuOid) {
			if(model.sijoittelu.hakuOid !== hakuOid) {
				model.refresh();
			}
		} 
	};

	return model;

});


function SijoitteluntulosController($scope, $routeParams, HakukohdeModel, SijoitteluntulosModel) {
    $scope.hakukohdeModel = HakukohdeModel;

    $scope.model = SijoitteluntulosModel;
    $scope.model.refresIfNeeded($routeParams.hakuOid);
   	
   	

}
