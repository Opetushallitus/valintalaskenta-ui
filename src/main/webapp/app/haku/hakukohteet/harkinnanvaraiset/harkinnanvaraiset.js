app.factory('HarkinnanvaraisetModel', function(HakukohdeHenkilot, Ilmoitus, Hakemus, HarkinnanvarainenHyvaksynta, HarkinnanvaraisestiHyvaksytyt) {
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
			return _.map(this.filterValitut(), function(hakija){ return hakija.oid; });
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
                          harkinnanvaraisuusTila: hakemus.muokattuHarkinnanvaraisuusTila
                      };
                      HarkinnanvarainenHyvaksynta.post(updateParams, postParams, function(result) {
							Ilmoitus.avaa("Harkinnanvaraisesti hyväksyttyjen tallennus", "Muutokset on tallennettu.");
                      }, function() {
                      		Ilmoitus.avaa("Harkinnanvaraisesti hyväksyttyjen tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.");
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

  function HarkinnanvaraisetController($scope, $location, $log, $routeParams, Ilmoitus, Latausikkuna, Koekutsukirjeet, OsoitetarratHakemuksille, HarkinnanvaraisetModel, HakukohdeModel, Pohjakuolutukset) {
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
          $scope.model.submit();
      };
      
      $scope.muodostaOsoitetarrat = function() {
      	$log.info($scope.model.valitutHakemusOids());
    	  OsoitetarratHakemuksille.post({
    		  
    	  },
    	  {
    		  tag: "harkinnanvaraiset",
      		hakemusOids: $scope.model.valitutHakemusOids()
      		},
      		function(id) {
      			Latausikkuna.avaa(id, "Osoitetarrat valituille harkinnanvaraisille", "");
      	});
      };
      
  	
	  	$scope.tinymceOptions = {
	  		handle_event_callback: function (e) {
	  			
	  		}
	  	};
      
      function isBlank(str) {
	    return (!str || /^\s*$/.test(str));
	  };
	  
      $scope.muodostaKoekutsut = function() {
      	var letterBodyText = $scope.tinymceModel;
		if(!isBlank(letterBodyText)) {
			Koekutsukirjeet.post({
			hakukohdeOid:$routeParams.hakukohdeOid, 
			valintakoeOids: null},{
				tag: "harkinnanvaraiset",
				hakemusOids: $scope.model.valitutHakemusOids(),
				letterBodyText: letterBodyText
			},
			function(id) {
				Latausikkuna.avaa(id, "Koekutsukirjeet valituille harkinnanvaraisille", "");
	    	},function() {
	    	
	    	});
		} else {
			Ilmoitus.avaa("Koekutsuja ei voida muodostaa!","Koekutsuja ei voida muodostaa, ennen kuin kutsun sisältö on annettu. Kirjoita kutsun sisältö ensin yllä olevaan kenttään.");
		}
      };

  }
