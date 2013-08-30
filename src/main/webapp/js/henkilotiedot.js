
app.factory('HenkiloTiedotModel', function(Hakemus, ValintalaskentaHakemus, ValintalaskentaHakemus, HakukohdeNimi, ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe) {
	var model = new function() {
		this.hakemus = {};
		this.valintalaskentaHakemus = {};
		
		this.hakutoiveet = [];
		this.errors = [];

		this.refresh = function(hakuOid, hakemusOid) {
			model.errors.length = 0;
			model.hakutoiveet.length = 0;

			Hakemus.get({oid: hakemusOid}, function(result) {
				model.hakemus = result;
				console.log("hakemus");
				console.log(model.hakemus);
				
				for(var i = 1; i < 10; i++) {
					var oid = model.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];
					if(oid === undefined) {
						break;
					}
					
					var hakutoiveIndex = i;
					var koulutus = model.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus"];
					var oppilaitos = model.hakemus.answers.hakutoiveet["preference" + i + "-Opetuspiste"];

					//create hakutoiveObject that can easily be iterated in view
					var hakutoive = {
						hakukohdeOid: oid,
						hakutoiveNumero: hakutoiveIndex,
						koulutuksenNimi: koulutus,
						oppilaitos: oppilaitos
					}
					model.hakutoiveet.push(hakutoive);
				}

				//Haetaan hakemuksen tulos tähän hakukohteeseen
				ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function(result) {
					model.valintalaskentaHakemus = result;

					//iterate hakutoiveet
					model.hakutoiveet.forEach(function(hakutoive, index, array) {
						var hakukohdeOid = hakutoive.hakukohdeOid;

						//iterate laskentatulos for each hakutoive
						model.valintalaskentaHakemus.hakukohteet.forEach(function(hakukohdetulos, index, array) {
							if(hakukohdetulos.hakukohdeoid === hakukohdeOid) {
								var jk1 = hakukohdetulos.valinnanvaihe[0].valintatapajono[0].jonosijat[0].jarjestyskriteerit[0];
								hakutoive.pisteet = jk1.arvo;
								hakutoive.tila = jk1.tila;
							}
							
						});

					});
					
					
				}, function(error) {
					model.errors.push(error);
				});
				
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