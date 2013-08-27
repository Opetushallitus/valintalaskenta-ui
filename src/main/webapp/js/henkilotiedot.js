
app.factory('HenkiloTiedotModel', function(Hakemus, ValintalaskentaHakemus, ValintalaskentaHakemus, HakukohdeNimi, ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe) {
	var model = new function() {
		this.hakemus = {};
		this.valintalaskentaHakemus = {};
		
		this.selectedValinnanvaihe = {};
		this.selectedHakukohde = {};
		this.selectedValintatapajono = {};

		this.errors = [];

		this.refresh = function(hakuOid, hakemusOid) {
			model.errors.length = 0;
			
			Hakemus.get({oid: hakemusOid}, function(result) {
				model.hakemus = result;
				
			}, function(error) {
				model.errors.push(error);
			});

			ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function(result) {
				model.valintalaskentaHakemus = result;
				console.log(model.valintalaskentaHakemus);
				//oletetaan, että valintalaskentahakemukseen liitty aina vain yksi hakukohde
				if(result.hakukohteet.length > 0) {
					
					
					HakukohdeNimi.get({hakukohdeoid: model.valintalaskentaHakemus.hakukohteet[0].hakukohdeoid}, function(result) {
						model.selectedHakukohde = result;
					}, function(error) {
						model.errors.push(error);
					});

					ValinnanvaiheListFromValintaperusteet.get({hakukohdeoid: model.valintalaskentaHakemus.hakukohteet[0].hakukohdeoid}, function(result) {
						var matchingValinnanvaihe = findMatchingValinnanvaihe(result, model.valintalaskentaHakemus.hakukohteet[0].valinnanvaihe[0].valinnanvaiheoid);
						model.selectedValinnanvaihe = matchingValinnanvaihe;
					}, function(error) {
						model.errors.push(error);
					});
				

				} else {
					model.selectedHakukohde = {};
					model.selectedValinnanvaihe = {};
					model.selectedValintatapajono = {};
				}

				
			}, function(error) {
				model.errors.push(error);
			});


		}

		this.refreshIfNeeded = function(hakuOid, hakemusOid) {
			if(model.hakemus.oid !== hakemusOid || model.valintalaskentaHakemus.hakuoid !== hakemusOid) {
				model.refresh(hakuOid, hakemusOid);
			}
		}

		function findMatchingValinnanvaihe(list, valinnanvaiheoid) {

			var result = {};
			list.forEach(function(element) {
				if(element.oid === valinnanvaiheoid) {
					result = element;
				}
			});
			return result;
		}
	}
	return model;
});

function HenkiloTiedotController($scope,$routeParams,HenkiloTiedotModel) {
	$scope.model = HenkiloTiedotModel;

	$scope.model.refreshIfNeeded($routeParams.hakuOid, $routeParams.hakemusOid);
	
	

}