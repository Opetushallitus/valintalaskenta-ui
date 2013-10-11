
app.factory('HenkiloTiedotModel', function(Hakemus, ValintalaskentaHakemus, ValintalaskentaHakemus, HakukohdeNimi, ValinnanvaiheListFromValintaperusteet, HakukohdeValinnanvaihe, SijoittelunVastaanottotilat, LatestSijoittelunTilat, ValintakoetuloksetHakemuksittain) {
	var model = new function() {
		this.hakemus = {};
		this.valintalaskentaHakemus = {};
		this.valintakokeet = [];

		this.hakutoiveet = [];
		this.errors = [];

		this.refresh = function(hakuOid, hakemusOid) {
			model.errors.length = 0;
			model.hakutoiveet.length = 0;
			model.valintakokeet.length = 0;


			Hakemus.get({oid: hakemusOid}, function(result) {
				model.hakemus = result;
				
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

				//fetch sijoittelun tilat and extend hakutoiveet
                   LatestSijoittelunTilat.get({hakemusOid: model.hakemus.oid, hakuOid: hakuOid}, function(result) {
                   		extendHakutoiveetWithSijoitteluTila(result);
                    }, function(error) {
                        model.errors.push(error);
                    });


                    ValintakoetuloksetHakemuksittain.get({hakemusOid: model.hakemus.oid}, function(result) {
                       result.forEach(function (hakemus) {
                         hakemus.hakutoiveet.forEach(function (hakutoive) {
                               var hakukohdeoid =  hakutoive.hakukohdeOid;
                               var oppilaitos;
                               var koulutuksenNimi;
                               var hakutoiveNumero;
                               model.hakutoiveet.forEach(function(ht) {
                                 if(ht.hakukohdeOid == hakukohdeoid)   {
                                  koulutuksenNimi = ht.koulutuksenNimi;
                                  oppilaitos = ht.oppilaitos;
                                  hakutoiveNumero = ht.hakutoiveNumero;
                                 }
                               });

                                 hakutoive.valinnanVaiheet.forEach(function(valinnanVaihe) {
                                  valinnanVaihe.valintakokeet.forEach(function(valintakoe) {
                                    valintakoe.hakukohdeOid = hakukohdeoid;
                                    valintakoe.oppilaitos = oppilaitos;
                                    valintakoe.koulutuksenNimi = koulutuksenNimi;
                                    valintakoe.hakutoiveNumero = hakutoiveNumero;
                                    model.valintakokeet.push(valintakoe);
                                  });
                            });
                         });
                       });
                    }, function(error) {
                        model.errors.push(error);
                    });



/*
				SijoitteluajoLatest.get({hakuOid: hakuOid}, function(result) {
					if(result.length > 0) {
						var latestSijoitteluAjoId = result[0].sijoitteluajoId;
						LatestSijoittelunTilat.get({sijoitteluajoOid: latestSijoitteluAjoId, hakemusOid: model.hakemus.oid}, function(result) {
							extendHakutoiveetWithSijoitteluTila(result);
						}, function(error) {
							model.errors.push(error);	
						});	
					}
				}, function(error) {
					model.errors.push(error);
				});
*/

				//fetch sijoittelun vastaanottotilat and extend hakutoiveet
				SijoittelunVastaanottotilat.get({hakemusOid: model.hakemus.oid}, function(result) {
					if(result.length > 0) {
						result.forEach(function(vastaanottotila) {
							model.hakutoiveet.some(function(hakutoive) {
								if(hakutoive.hakukohdeOid === vastaanottotila.hakukohdeOid) {
									hakutoive.vastaanottotila = vastaanottotila.tila;
									return true;
								}
							});
						});
					}
				}, function(error) {
					model.errors.push(error)
				});

				
				//Extend hakutoiveet with tulos 
				ValintalaskentaHakemus.get({hakuoid: hakuOid, hakemusoid: hakemusOid}, function(result) {
					model.valintalaskentaHakemus = result;

					//iterate hakutoiveet
					model.hakutoiveet.forEach(function(hakutoive, index, array) {
						var hakukohdeOid = hakutoive.hakukohdeOid;

						//iterate laskentatulos for each hakutoive and extend hakutoiveObjects accordingly
						model.valintalaskentaHakemus.hakukohteet.forEach(function(hakukohdetulos, index, array) {
							if(hakukohdetulos.hakukohdeoid === hakukohdeOid) {
								var jk1 = hakukohdetulos.valinnanvaihe[0].valintatapajono[0].jonosijat[0].jarjestyskriteerit[0];
								hakutoive.pisteet = jk1.arvo;
								hakutoive.valintalaskentatila = jk1.tila;
							}
						});

					});
					
				
				}, function(error) {
					model.errors.push(error);
				});
	
				
			}, function(error) {
				model.errors.push(error);
			});
			
			//extend each hakutoive with sijoitteluntila -property
			function extendHakutoiveetWithSijoitteluTila(sijoittelunTilat) {
				sijoittelunTilat.forEach(function(tila, index, array) {
					model.hakutoiveet.some(function(hakutoive, index, array) {
						if(tila.hakukohdeOid === hakutoive.hakukohdeOid) {
							angular.extend(hakutoive, {sijoittelunTila: tila.tila});
							return true;
						}
					});
				});
			}


			
			

		}

		this.refreshIfNeeded = function(hakuOid, hakemusOid) {
			if(model.hakemus.oid !== hakemusOid || model.valintalaskentaHakemus.hakuoid !== hakemusOid) {
				model.refresh(hakuOid, hakemusOid);
			}
		}

	}
	return model;
});

function HenkiloTiedotController($scope,$routeParams,HenkiloTiedotModel) {
	$scope.model = HenkiloTiedotModel;
	$scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid);
	
}