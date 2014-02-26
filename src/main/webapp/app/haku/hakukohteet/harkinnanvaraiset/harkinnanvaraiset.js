app.factory('HarkinnanvaraisetModel', function(HakukohdeHenkilot, Hakemus, HarkinnanvarainenHyvaksynta, HarkinnanvaraisestiHyvaksytyt) {
    var model;
    model = new function() {
      this.valittu = true;
      this.hakeneet = [];
      this.harkinnanvaraisestiHyvaksytyt = [];
      this.avaimet = [];
          this.errors = [];
        this.filterHarkinnanvaraiset = function() {
        	return _.filter(this.hakeneet,function(hakija) {
  				return hakija.hakenutHarkinnanvaraisesti != "false";
  			});
        };
        this.filterValitut = function() {
  			return _.filter(this.filterHarkinnanvaraiset(),function(hakija) {
  				return hakija.valittu;
  			});
  		};
  		this.isAllValittu = function() {
  			return this.filterHarkinnanvaraiset().length == this.filterValitut().length;
  		};
  		this.check = function() {
  			this.valittu = this.isAllValittu();
  		};
  		this.checkAll = function() {
  			var kaikkienUusiTila = this.valittu;
  			_.each(this.filterHarkinnanvaraiset(), function(hakija) {
  				hakija.valittu = kaikkienUusiTila;
  			});
  			this.valittu = this.isAllValittu();
  		};
  		this.valitutHakemusOids = function() {
			return _.map(this.filterValitut(), function(hakija){ return hakija.hakemusOid; });
		};
  		
          
      this.refresh = function(hakukohdeOid, hakuOid) {	
    	  	  model.valittu = true;
    	  	  model.hakeneet = [];
              model.harkinnanvaraisestiHyvaksytyt = [];
              model.errors = [];
              model.errors.length = 0;
              model.hakuOid = hakuOid;
              model.hakukohdeOid = hakukohdeOid;
              HakukohdeHenkilot.get({aoOid: hakukohdeOid, rows:100000}, function(result) {
                  model.hakeneet = result.results;

                  if(model.hakeneet) {
                      model.hakeneet.forEach(function(hakija){
                    	  hakija.valittu = true;
                          Hakemus.get({oid: hakija.oid}, function(result) {
                               hakija.hakemus=result;
                               if(hakija.hakemus.answers) {
                                  for(var i =0; i<10; i++) {
                                      var oid = hakija.hakemus.answers.hakutoiveet["preference" + i + "-Koulutus-id"];
                                      if(oid === model.hakukohdeOid) {
                                          var harkinnanvarainen = hakija.hakemus.answers.hakutoiveet["preference" + i + "-discretionary"];
                                          var discretionary = hakija.hakemus.answers.hakutoiveet["preference" + i + "-Harkinnanvarainen"];  // this should be removed at some point
                                          hakija.hakenutHarkinnanvaraisesti = harkinnanvarainen || discretionary;
                                      }
                                  }
                              }
                          })
                      });
                     HarkinnanvaraisestiHyvaksytyt.get({hakukohdeOid: hakukohdeOid, hakuOid: hakuOid}, function(result) {
                          model.hakeneet.forEach(function(hakija){
                              for (var i=0; i<result.length; i++) {
                                  var harkinnanvarainen = result[i];
                                  if(harkinnanvarainen.hakemusOid == hakija.oid) {
                                      hakija.muokattuHarkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                                      hakija.harkinnanvaraisuusTila = harkinnanvarainen.harkinnanvaraisuusTila;
                                  }
                              }
                          });
                      }, function(error) {
                        model.errors.push(error);
                      });
                  }
              }, function(error) {
                  model.errors.push(error);
              });


      }

          this.submit = function() {
              for (var i=0; i<model.hakeneet.length; i++) {
                  var hakemus = model.hakeneet[i];
                  if(hakemus.muokattuHarkinnanvaraisuusTila != hakemus.harkinnanvaraisuusTila)  {
                      var updateParams = {
                          hakuOid: model.hakuOid,
                          hakukohdeOid: model.hakukohdeOid,
                          hakemusOid: hakemus.oid
                      }
                      var postParams = {
                          harkinnanvaraisuusTila: hakemus.muokattuHarkinnanvaraisuusTila,
                      };
                      HarkinnanvarainenHyvaksynta.post(updateParams, postParams, function(result) {

                      });
                  }
              }
          }
      this.refreshIfNeeded = function(hakukohdeOid, hakuOid) {
              if(hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                  model.refresh(hakukohdeOid, hakuOid);
              }
          }

    };

    return model;
  });

  function HarkinnanvaraisetController($scope, $location, $routeParams, KoekutsukirjeetHakemuksille, OsoitetarratHakemuksille, Dokumenttipalvelu, HarkinnanvaraisetModel, HakukohdeModel, Pohjakuolutukset) {
      $scope.hakukohdeOid = $routeParams.hakukohdeOid;
      $scope.model = HarkinnanvaraisetModel;
      $scope.hakuOid =  $routeParams.hakuOid;;
      $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
      $scope.hakukohdeModel = HakukohdeModel;
      $scope.arvoFilter = "SYOTETTAVA_ARVO";
      $scope.muutettu = false;

      $scope.pohjakoulutukset = Pohjakuolutukset;

      HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

      HarkinnanvaraisetModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

      $scope.predicate = 'sukunimi';

      $scope.submit = function() {
          HakeneetModel.submit();
      };

      $scope.submit = function(hakemusOid) {
          $scope.model.submit();
      };
      
      $scope.muodostaOsoitetarrat = function() {
    	  OsoitetarratHakemuksille.post({
    		  
    	  },
    	  {
    		  tag: "harkinnanvaraiset",
      		hakemusOids: $scope.model.valitutHakemusOids()
      		},
      		function(resurssi) {
      			Dokumenttipalvelu.paivita($scope.update);
      	});
      };
      
  	
	  	$scope.tinymceOptions = {
	  		handle_event_callback: function (e) {
	  			
	  		}
	  	};
      
      $scope.muodostaKoekutsut = function() {
    	  KoekutsukirjeetHakemuksille.post({
  			hakukohdeOid:$routeParams.hakukohdeOid},
  			{
  				tag: "harkinnanvaraiset",
  				hakemusOids: $scope.model.valitutHakemusOids(),
  				letterBodyText: $scope.tinymceModel
  			},
  			function() {
  				Dokumenttipalvelu.paivita($scope.update);
	      	},function() {
	      		Dokumenttipalvelu.paivita($scope.update);
	      	});
      };
      // kayttaa dokumenttipalvelua
		$scope.DOKUMENTTIPALVELU_URL_BASE = DOKUMENTTIPALVELU_URL_BASE; 
		$scope.dokumenttiLimit = 5;
		$scope.dokumentit = [];
		$scope.update = function(data) {
			// paivitetaan ainoastaan tarpeen vaatiessa
			if(data.length != $scope.dokumentit.length) {
				$scope.dokumentit = data;
			}
		}
		Dokumenttipalvelu.aloitaPollaus($scope.update);
		$scope.$on('$destroy', function() {Dokumenttipalvelu.lopetaPollaus();});
		$scope.showMoreDokumentit = function() {
			$scope.dokumenttiLimit = $scope.dokumenttiLimit + 10;
		};
		// kayttaa dokumenttipalvelua
  }
