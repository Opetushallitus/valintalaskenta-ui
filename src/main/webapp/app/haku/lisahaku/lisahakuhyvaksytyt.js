"use strict";

app.factory('HyvaksytytModel', function(HakukohdeHenkilot, Hakemus, HakemusKey, $q, Ilmoitus, Sijoittelu, LatestSijoitteluajoHakukohde, VastaanottoTila,
                                        $timeout, SijoitteluAjo, VastaanottoTilat, IlmoitusTila,
                                        HaunTiedot, SijoitteluTila, TarjontaHakukohde) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];
        this.errors = [];
        this.sijoittelu = {};
        this.latestSijoitteluajo = {};
        this.sijoitteluTulokset = {};
        this.sijoitteluMap = {};

        this.getJonoOid = function(hakukohdeOid, hakuOid) {
            LatestSijoitteluajoHakukohde.get({
                hakukohdeOid: hakukohdeOid,
                hakuOid: hakuOid
            }, function (result) {
                if (result.sijoitteluajoId) {
                    result.valintatapajonot.forEach(function (valintatapajono, index) {
                        model.valintatapajonoOid = valintatapajono.oid;
                    });
                }
            }, function (error) {
                model.errors.push(error.data.message);
            });
        };

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakuOid = hakuOid;
            model.valintatapajonoOid = "";
            model.sijoittelu = {};
            model.latestSijoitteluajo = {};
            model.sijoitteluTulokset = {};
            model.sijoitteluMap = {};
            TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
                model.tarjoajaOid = result.tarjoajaOid;
            });
            HakukohdeHenkilot.get({aoOid: hakukohdeOid, rows:100000}, function(result) {
                model.hakeneet = result.results;
                if(model.hakeneet) {

                    LatestSijoitteluajoHakukohde.get({
                        hakukohdeOid: hakukohdeOid,
                        hakuOid: hakuOid
                    }, function (result) {
                        if (result.sijoitteluajoId) {
                            model.latestSijoitteluajo.sijoitteluajoId = result.sijoitteluajoId;

                            model.sijoitteluTulokset = result;

                            var valintatapajonot = model.sijoitteluTulokset.valintatapajonot;

                            valintatapajonot.forEach(function (valintatapajono, index) {
                                valintatapajono.index = index;
                                valintatapajono.valittu = true;
                                var valintatapajonoOid = valintatapajono.oid;
                                var hakemukset = valintatapajono.hakemukset;
                                model.valintatapajonoOid = valintatapajono.oid;
                                hakemukset.forEach(function (hakemus, index) {

                                    if (hakemus.tila === "HYVAKSYTTY") {
                                        model.sijoitteluMap[hakemus.hakemusOid] = {};
                                        model.sijoitteluMap[hakemus.hakemusOid].tila = "HYVAKSYTTY";
                                    }
                                });

                                VastaanottoTilat.get({hakukohdeOid: hakukohdeOid,
                                    valintatapajonoOid: valintatapajonoOid}, function (result) {

                                    model.hakeneet.forEach(function (currentHakemus) {


                                        //make rest calls in separate scope to prevent hakemusOid to be overridden during rest call
                                        currentHakemus.vastaanottoTila = "";
                                        currentHakemus.muokattuVastaanottoTila = "";
                                        currentHakemus.muokattuIlmoittautumisTila = "";

                                        result.some(function (vastaanottotila) {
                                            if (vastaanottotila.hakemusOid === currentHakemus.oid) {
                                                currentHakemus.logEntries = vastaanottotila.logEntries;
                                                currentHakemus.julkaistavissa = vastaanottotila.julkaistavissa;
                                                if (!vastaanottotila.tila || vastaanottotila.tila == null) {
                                                    vastaanottotila.tila = "KESKEN";
                                                }
                                                currentHakemus.vastaanottoTila = vastaanottotila.tila;
                                                currentHakemus.muokattuVastaanottoTila = vastaanottotila.tila;
                                                if (currentHakemus.vastaanottoTila === "VASTAANOTTANUT") {
                                                }

                                                if (!vastaanottotila.ilmoittautumisTila || vastaanottotila.ilmoittautumisTila == null) {
                                                    vastaanottotila.ilmoittautumisTila = "EI_TEHTY";
                                                }
                                                currentHakemus.ilmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                                currentHakemus.muokattuIlmoittautumisTila = vastaanottotila.ilmoittautumisTila;
                                                return true;
                                            }
                                        });
                                    });

                                }, function (error) {
                                    model.errors.push(error);
                                });

                            });

                        }

                        model.hakeneet.forEach(function (currentHakemus) {
                            if(model.sijoitteluMap[currentHakemus.oid]) {
                                currentHakemus.lisahakuHyvaksytty = "Kyllä"
                            }
                        });

                    }, function (error) {
                        model.errors.push(error.data.message);
                    });
                }
                
            }, function(error) {
                model.errors.push(error);
            });


		};

      this.updateHakemus = function(hakemusOid, hyvaksytty) {
          var tilaParams = {
              hakuoid: model.hakuOid,
              hakukohdeOid: model.hakukohdeOid,
              hakemusOid: hakemusOid,
              tarjoajaOid: model.tarjoajaOid
          };

          SijoitteluTila.post(tilaParams, hyvaksytty, function (result) {

              model.hakeneet.forEach(function(hakija) {
                  if(hakija.oid === hakemusOid) {
                      if(hyvaksytty == 'true') {
                        hakija.lisahakuHyvaksytty = "Kyllä";
                      } else {
                        hakija.lisahakuHyvaksytty = null;
                      }
                  }
              });
              if(!model.valintatapajonoOid) {
                  model.getJonoOid(model.hakuOid, model.hakukohdeOid);
              }
              Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
          }, function (error) {
              Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
          });
      };

		this.refreshIfNeeded = function(hakukohdeOid, hakuOid) {
            if(hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }
        };


	}();

	return model;
});

angular.module('valintalaskenta').
    controller('LisahakuhyvaksytytController', ['$scope', '$location', '$routeParams', 'HyvaksytytModel', 'HakukohdeModel',
        'AuthService', 'HakemusKey','LocalisationService','SijoitteluntulosModel', 'VastaanottoTila', 'Ilmoitus', 'IlmoitusTila',
        function ($scope, $location, $routeParams, HyvaksytytModel, HakukohdeModel, AuthService, HakemusKey, LocalisationService,
                  SijoitteluntulosModel, VastaanottoTila, Ilmoitus, IlmoitusTila) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HyvaksytytModel;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.arvoFilter = "SYOTETTAVA_ARVO";
    $scope.muutettu = false;
    $scope.pageSize = 50;
    $scope.currentPage = 1;

    $scope.hakemuksenMuokattuIlmoittautumisTilat = [
        {value: "EI_TEHTY", text: "sijoitteluntulos.enrollmentinfo.notdone", default_text:"Ei tehty"},
        {value: "LASNA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.present", default_text:"Läsnä (koko lukuvuosi)"},
        {value: "POISSA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.notpresent", default_text:"Poissa (koko lukuvuosi)"},
        {value: "EI_ILMOITTAUTUNUT", text: "sijoitteluntulos.enrollmentinfo.noenrollment", default_text:"Ei ilmoittautunut"},
        {value: "LASNA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.presentfall", default_text:"Läsnä syksy, poissa kevät"},
        {value: "POISSA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.notpresentfall", default_text:"Poissa syksy, läsnä kevät"},
        {value: "LASNA", text: "sijoitteluntulos.enrollmentinfo.presentspring", default_text:"Läsnä, keväällä alkava koulutus"},
        {value: "POISSA", text: "sijoitteluntulos.enrollmentinfo.notpresentspring", default_text:"Poissa, keväällä alkava koulutus"}
    ];
    LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuIlmoittautumisTilat);

    //korkeakoulujen 'ehdollisesti vastaanotettu' lisätään isKorkeakoulu() -funktiossa
    $scope.hakemuksenMuokattuVastaanottoTilat = [
        {value: "KESKEN", text: "Kesken"},
        {value: "VASTAANOTTANUT", text: "Vastaanottanut"},
        {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text: "Ei vastaanotettu määräaikana"},
        {value: "PERUNUT", text: "Perunut"},
        {value: "PERUUTETTU", text: "Peruutettu"}
    ];


    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HyvaksytytModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'sukunimi';

    $scope.lisahakuUpdate = function(hakemusOid, hyvaksytty) {
        $scope.model.updateHakemus(hakemusOid, hyvaksytty);
    };

    $scope.lisahakuValitse = function(hakemusOid) {
        $scope.model.updateHakemus(hakemusOid);
    };

    $scope.lisahakuPoistavalinta = function(hakemusOid) {
        $scope.model.removeHakemusFromHyvaksytyt(hakemusOid);
    };

    $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOid', function () {
        AuthService.updateOrg("APP_SIJOITTELU", $scope.hakukohdeOid).then(function () {
            $scope.updateOrg = true;
        });

    });

    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
    });

    $scope.resetIlmoittautumisTila = function(hakemus) {
        if(hakemus.muokattuVastaanottoTila !== 'VASTAANOTTANUT' && hakemus.muokattuVastaanottoTila !== 'EHDOLLISESTI_VASTAANOTTANUT') {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        } else if (!hakemus.muokattuIlmoittautumisTila) {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        }

        var tulos = {};
        tulos.tila = hakemus.muokattuVastaanottoTila;
        tulos.valintatapajonoOid = $scope.model.valintatapajonoOid;
        tulos.hakemusOid = hakemus.oid;
        tulos.hakijaOid = hakemus.personOid;
        tulos.hakutoive = 1;
        tulos.ilmoittautumisTila = hakemus.muokattuIlmoittautumisTila;
        tulos.hakuOid = $routeParams.hakuOid;
        tulos.julkaistavissa = hakemus.julkaistavissa;
        tulos.hyvaksyttyVarasijalta = false;

        var tilaParams = {
            hakuoid: $routeParams.hakuOid,
            hakukohdeOid: $routeParams.hakukohdeOid,
            hakemusOid: hakemus.oid
        };

        var tilaObj = [tulos];

        VastaanottoTila.post(tilaParams, tilaObj, function (result) {
            Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
        }, function (error) {
            Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });

    };

    $scope.setIlmoittautumisTila = function(hakemus) {
        var tilaParams = {
            hakuoid: $routeParams.hakuOid,
            hakukohdeOid: $routeParams.hakukohdeOid,
            hakemusOid: hakemus.oid
        };
        if(!hakemus.muokattuIlmoittautumisTila) {
            hakemus.muokattuIlmoittautumisTila = "EI_TEHTY";
        }

        if(!hakemus.muokattuVastaanottoTila) {
            hakemus.muokattuVastaanottoTila = "KESKEN"
        }

        var tulos = {};
        tulos.tila = hakemus.muokattuVastaanottoTila;
        tulos.valintatapajonoOid = $scope.model.valintatapajonoOid;
        tulos.hakemusOid = hakemus.oid;
        tulos.hakijaOid = hakemus.personOid;
        tulos.hakutoive = 1;
        tulos.ilmoittautumisTila = hakemus.muokattuIlmoittautumisTila;
        tulos.hakuOid = $routeParams.hakuOid;
        tulos.julkaistavissa = hakemus.julkaistavissa;
        tulos.hyvaksyttyVarasijalta = false;

        var tilaObj = [tulos];

        VastaanottoTila.post(tilaParams, tilaObj, function (result) {
            Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
        }, function (error) {
            Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
        });

    };

}]);
