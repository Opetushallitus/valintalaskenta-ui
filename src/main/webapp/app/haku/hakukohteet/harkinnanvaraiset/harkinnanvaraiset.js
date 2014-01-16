     app.factory('HarkinnanvaraisetModel', function(HakukohdeHenkilot, Hakemus, HarkinnanvarainenHyvaksynta, HarkinnanvaraisestiHyvaksytyt) {
    var model;
    model = new function() {

      this.hakeneet = [];
      this.avaimet = [];
          this.errors = [];

      this.refresh = function(hakukohdeOid, hakuOid) {
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
                  //console.debug(hakemus.muokattuHarkinnanvaraisuusTila + " vs. " + hakemus.harkinnanvaraisuusTila);
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

  function HarkinnanvaraisetController($scope, $location, $routeParams, HarkinnanvaraisetModel, HakukohdeModel) {
      $scope.hakukohdeOid = $routeParams.hakukohdeOid;
      $scope.model = HarkinnanvaraisetModel;
      $scope.hakuOid =  $routeParams.hakuOid;;
      $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
      $scope.hakukohdeModel = HakukohdeModel;
      $scope.arvoFilter = "SYOTETTAVA_ARVO";
      $scope.muutettu = false;

      $scope.pohjakoulutukset = {
            0: "Ulkomailla suoritettu koulutus",
            1: "Perusopetuksen oppimäärä",
            2: "Perusopetuksen osittain yksilöllistetty oppimäärä",
            3: "Perusopetuksen yksilöllistetty oppimäärä, opetus järjestetty toiminta-alueittain",
            6: "Perusopetuksen pääosin tai kokonaan yksilöllistetty oppimäärä",
            7: "Oppivelvollisuuden suorittaminen keskeytynyt (ei päättötodistusta)",
            9: "Lukion päättötodistus, ylioppilastutkinto tai abiturientti",
      }

      HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

      HarkinnanvaraisetModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

      $scope.predicate = 'sukunimi';

      $scope.submit = function() {
          HakeneetModel.submit();
      }

      $scope.submit = function(hakemusOid) {
          $scope.model.submit();
      };

  }
