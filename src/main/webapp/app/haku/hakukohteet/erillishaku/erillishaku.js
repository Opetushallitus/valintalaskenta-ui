angular.module('valintalaskenta')

  .controller('ErillishakuController', ['$scope', '$modal', '$log', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus', 'IlmoitusTila', 'Latausikkuna',
              'ValintatapajonoVienti', 'TulosXls', 'HakukohdeModel', 'HakuModel', 'HakuUtility', '$http', 'AuthService', 'UserModel','_', 'LocalisationService',
              'ErillishakuVienti', 'ErillishakuProxy','ErillishakuTuonti','VastaanottoTila', '$window', 'HakukohdeNimiService', 'Hyvaksymiskirjeet', 'Kirjepohjat','Kirjeet',
              'VastaanottoUtil',
    function ($scope, $modal, $log, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti, TulosXls, HakukohdeModel, HakuModel, HakuUtility, $http, AuthService, UserModel, _, LocalisationService,
              ErillishakuVienti, ErillishakuProxy, ErillishakuTuonti, VastaanottoTila, $window, HakukohdeNimiService, Hyvaksymiskirjeet, Kirjepohjat, Kirjeet,
              VastaanottoUtil) {
      "use strict";

      $scope.muokatutHakemukset = {};
      $scope.hakukohdeOid = $routeParams.hakukohdeOid;
      $scope.hakuOid =  $routeParams.hakuOid;
      $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
      $scope.hakukohdeModel = HakukohdeModel;
      $scope.hakuModel = HakuModel;

      $scope.valintatuloksentilat = [];
      $scope.korkeakoulu;

      function valintatuloksenTilojenKielistykset(valintatuloksentilat) {
        return valintatuloksentilat.reduce(function(o, tila) {
          o[tila.value] = tila.text || tila.default_text;
          return o;
        }, {});
      }

      HakuModel.promise.then(function(model) {
        $scope.korkeakoulu = model.korkeakoulu;
        if ($scope.korkeakoulu) {
          $scope.valintatuloksentilat = [
            {value: "KESKEN", text_prop: "sijoitteluntulos.kesken", default_text:"Kesken"},
            {value: "EHDOLLISESTI_VASTAANOTTANUT", text_prop: "sijoitteluntulos.ehdollisestivastaanottanut", default_text:"Ehdollisesti vastaanottanut"},
            {value: "VASTAANOTTANUT_SITOVASTI", text_prop: "sijoitteluntulos.vastaanottanutsitovasti", default_text:"Vastaanottanut sitovasti"},
            {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text_prop: "sijoitteluntulos.eivastaanotettu", default_text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
            {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"},
            {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"},
            {value: "OTTANUT_VASTAAN_TOISEN_PAIKAN", text_prop: 'sijoitteluntulos.ottanutvastaantoisenpaikan', default_text:"Ottanut vastaan toisen paikan", disable: true}
          ];
        } else {
          $scope.valintatuloksentilat = [
            {value: "KESKEN", text_prop: "sijoitteluntulos.kesken", default_text:"Kesken"},
            {value: "VASTAANOTTANUT_SITOVASTI", text_prop: "sijoitteluntulos.vastaanottanut", default_text:"Vastaanotettu"},
            {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text_prop: "sijoitteluntulos.eivastaanotettu", default_text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
            {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"}
          ];
        }
        $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset($scope.valintatuloksentilat);
        LocalisationService.getTranslationsForArray($scope.valintatuloksentilat).then(function () {
          HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
          $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset($scope.valintatuloksentilat);
        });
      });

      $scope.hakemuksentilat = [
        {value: "HYLATTY", text_prop: "sijoitteluntulos.hylatty", default_text:"Hyl\u00E4tty"},
        {value: "VARALLA", text_prop: "sijoitteluntulos.varalla", default_text:"Varalla"},
        {value: "PERUUNTUNUT", text_prop: "sijoitteluntulos.peruuntunut", default_text:"Peruuntunut"},
        {value: "VARASIJALTA_HYVAKSYTTY", text_prop: "sijoitteluntulos.varasijalta", default_text:"Varasijalta hyv\u00E4ksytty"},
        {value: "HYVAKSYTTY", text_prop: "sijoitteluntulos.hyvaksytty", default_text:"Hyv\u00E4ksytty"},
        {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"},
        {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"}
      ];

      LocalisationService.getTranslationsForArray($scope.hakemuksentilat).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
      });
      $scope.showEhdollinenHyvaksynta = function() {
        return !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
      };

      $scope.ilmoittautumistilat = [
        {value: "EI_TEHTY", text_prop: "sijoitteluntulos.enrollmentinfo.notdone", default_text:"Ei tehty"},
        {value: "LASNA_KOKO_LUKUVUOSI", text_prop: "sijoitteluntulos.enrollmentinfo.present", default_text:"Läsnä (koko lukuvuosi)"},
        {value: "POISSA_KOKO_LUKUVUOSI", text_prop: "sijoitteluntulos.enrollmentinfo.notpresent", default_text:"Poissa (koko lukuvuosi)"},
        {value: "EI_ILMOITTAUTUNUT", text_prop: "sijoitteluntulos.enrollmentinfo.noenrollment", default_text:"Ei ilmoittautunut"},
        {value: "LASNA_SYKSY", text_prop: "sijoitteluntulos.enrollmentinfo.presentfall", default_text:"Läsnä syksy, poissa kevät"},
        {value: "POISSA_SYKSY", text_prop: "sijoitteluntulos.enrollmentinfo.notpresentfall", default_text:"Poissa syksy, läsnä kevät"},
        {value: "LASNA", text_prop: "sijoitteluntulos.enrollmentinfo.presentspring", default_text:"Läsnä, keväällä alkava koulutus"},
        {value: "POISSA", text_prop: "sijoitteluntulos.enrollmentinfo.notpresentspring", default_text:"Poissa, keväällä alkava koulutus"},
        {value: "", default_text: ""}
      ];

      LocalisationService.getTranslationsForArray($scope.ilmoittautumistilat).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
      });
      $scope.isVaaraVastaanottotila = function(tila) {
        return tila === 'VASTAANOTTANUT';
      }
      $scope.isVastaanottanut = function(tila) {
        return tila === 'VASTAANOTTANUT_SITOVASTI';
      }

      ErillishakuProxy.hae({hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid},function(erillishaku) {
        var hakemukset = _.chain(erillishaku).map(function(e){return e.valintatapajonot}).flatten().map(function(v){return v.hakemukset;}).flatten();
        fetchAndPopulateVastaanottoAikaraja($routeParams.hakuOid, $routeParams.hakukohdeOid, hakemukset.value());
        hakemukset.each(function(hakemus) {
          hakemus.onkoVastaanottanut = hakemus.valintatuloksentila === 'VASTAANOTTANUT_SITOVASTI';
          if (hakemus.hyvaksymiskirjeLahetetty) {
            hakemus.hyvaksymiskirjeLahetettyPvm = hakemus.hyvaksymiskirjeLahetetty;
            hakemus.hyvaksymiskirjeLahetetty = true;
          }
          else {
            hakemus.hyvaksymiskirjeLahetetty = false;
          }
          if (hakemus.valintatuloksentila === "" || !_.isString(hakemus.valintatuloksentila)) {
            hakemus.valintatuloksentila = 'KESKEN';
          }
        });

        $scope.erillishaku = erillishaku;
      });

      var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

      $scope.pageSize = 50;

      $scope.hakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function () {
        $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOids', function () {
          AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOids[0]).then(function () {
            $scope.updateOrg = true;
          });
        });
      });

      AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
        $scope.jkmuokkaus = true;
      });

      $scope.user = UserModel;
      UserModel.refreshIfNeeded().then(function(){
        $scope.jkmuokkaus = UserModel.isKKUser;
        $scope.jkmuokkaus = true;
      });

      $scope.getHakijanSijoitteluTulos = function (valintatapajono, hakija) {
        var jono = _.find($scope.model.erillishakuSijoitteluajoTulos.valintatapajonot, function (item) {
          return item.oid === valintatapajono.oid;
        });

        if(!_.isEmpty(jono)) {
          return _.find(jono.hakemukset, function (item) {
            return item.hakijaOid === hakija.hakijaOid;
          });
        }
      };

      $scope.valintatapajonoVientiXlsx = function(valintatapajonoOid, valintatapajononNimi) {
        ValintatapajonoVienti.vie({
            valintatapajonoOid: valintatapajonoOid,
            valintatapajononNimi: valintatapajononNimi,
            hakukohdeOid: $scope.hakukohdeOid,
            hakuOid: $routeParams.hakuOid},
          {}, function (id) {
            Latausikkuna.avaa(id, "Valintatapajonon vienti taulukkolaskentaan", "");
          }, function () {
            Ilmoitus.avaa("Valintatapajonon vienti epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
          });
      };



      $scope.valintalaskentaTulosXLS = function() {
        TulosXls.query({hakukohdeOid:$routeParams.hakukohdeOid});
      };

      $scope.showHistory = function(valintatapajonoOid, hakemusOid) {
        $location.path('/valintatapajono/' + valintatapajonoOid + '/hakemus/' + hakemusOid + '/valintalaskentahistoria');
      };

      $scope.showTilaPartial = function(valintatulos) {
        if(valintatulos.showTilaPartial === null || valintatulos.showTilaPartial === false) {
          valintatulos.showTilaPartial = true;
        } else {
          valintatulos.showTilaPartial = false;
        }
      };
      $scope.showHenkiloPartial = function(valintatulos) {
        if(valintatulos.showHenkiloPartial === null || valintatulos.showHenkiloPartial === false) {
          valintatulos.showHenkiloPartial = true;
        } else {
          valintatulos.showHenkiloPartial = false;
        }
      };

      $scope.hakemusToErillishakuRivi = function (hakemus) {
        //$log.info(hakemus);
        return {
          etunimi: hakemus.etunimi,
          sukunimi: hakemus.sukunimi,
          henkilotunnus: hakemus.henkilotunnus,
          sahkoposti: hakemus.sahkoposti,
          syntymaAika: hakemus.syntymaaika,
          personOid: hakemus.hakijaOid,
          hakemuksenTila: hakemus.hakemuksentila,
          ehdollisestiHyvaksyttavissa: hakemus.ehdollisestiHyvaksyttavissa,
          hyvaksymiskirjeLahetetty: hakemus.hyvaksymiskirjeLahetetty ? hakemus.hyvaksymiskirjeLahetettyPvm : null,
          vastaanottoTila: hakemus.valintatuloksentila,
          ilmoittautumisTila: hakemus.ilmoittautumistila,
          poistetaankoRivi: hakemus.poistetaankoRivi,
          julkaistaankoTiedot: hakemus.julkaistavissa,
          hakemusOid: hakemus.hakemusOid
        };
      };

      $scope.hakemusToValintatulos = function (valintatapajono) {
        return function(hakemus) {
          return {
            tila: hakemus.valintatuloksentila,
            ilmoittautumisTila: hakemus.ilmoittautumistila,
            hakukohdeOid: $scope.hakukohdeOid,
            hakuOid: $routeParams.hakuOid,
            valintatapajonoOid: valintatapajono.oid,
            hakemusOid: hakemus.hakemusOid,
            hakijaOid: hakemus.hakijaOid,
            julkaistavissa: hakemus.julkaistavissa,
            ehdollisestiHyvaksyttavissa: hakemus.ehdollisestiHyvaksyttavissa,
            hyvaksymiskirjeLahetetty: hakemus.hyvaksymiskirjeLahetetty ? hakemus.hyvaksymiskirjeLahetettyPvm : null,
            hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta
          };
        };
      };

      var hakemuksetByValintatapajonoOid = function (muokatutHakemukset, valintatapajonoOid) {
        if (valintatapajonoOid) {
          return muokatutHakemukset[valintatapajonoOid] || [];
        } else {
          console.error('Muokattuja hakemuksia haetaan ilman valintatapajono oidia');
          return [];
        }
      };

      $scope.hakemuksetByValintatapajonoOid = hakemuksetByValintatapajonoOid;

      $scope.submitIlmanLaskentaa = function (valintatapajono) {
        var hakemukset = hakemuksetByValintatapajonoOid($scope.muokatutHakemukset, valintatapajono.oid);
        $scope.erillishaunTuontiJson(valintatapajono.oid, valintatapajono.nimi, _.map(hakemukset, $scope.hakemusToErillishakuRivi));
      };

      $scope.submitLaskennalla = function (valintatapajono) {
        var hakemukset = hakemuksetByValintatapajonoOid($scope.muokatutHakemukset, valintatapajono.oid);
        VastaanottoTila.post({
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
          hyvaksyttyJonoOid: "",
          selite: "Massamuokkaus"
        }, _.map(hakemukset, $scope.hakemusToValintatulos(valintatapajono)), function (result) {
          delete $scope.muokatutHakemukset[valintatapajono.oid];
          Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
        }, function (error) {
          var statuses = (error && error.data && error.data.statuses) ? error.data.statuses : [];
          var errorCount = statuses.length;
          var errorMsg = errorCount + "/" + hakemukset.length + " hakemuksen päivitys epäonnistui. ";
          if (statuses.filter(function(status) { return status.status === 409; }).length > 0) {
              errorMsg += "Tietoihin on tehty samanaikaisia muutoksia, päivitä sivu ja yritä uudelleen";
          } else {
              errorMsg += "Yritä uudelleen tai ota yhteyttä ylläpitoon.";
          }
          var errorRows = _.map(statuses, function(status) { return status.hakemusOid + ": " + status.message; });
          Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! " + errorMsg, IlmoitusTila.ERROR, null, errorRows);
        });
      };

      $scope.addMuokattuHakemus = function (hakemus, valintatapajono) {
        var joMuokatut = hakemuksetByValintatapajonoOid($scope.muokatutHakemukset, valintatapajono.oid);
        if (joMuokatut && joMuokatut.length > 0) {
          joMuokatut.push(hakemus);
          joMuokatut = _.uniq(joMuokatut);
          $scope.muokatutHakemukset[valintatapajono.oid] = joMuokatut;
        } else {
          $scope.muokatutHakemukset[valintatapajono.oid] = [hakemus];
        }
      };

      $scope.muutaSijoittelunStatus = function (jono, status) {
        ValintalaskentatulosModel.muutaSijoittelunStatus(jono, status);
      };

      $scope.changeTila = function (jonosija, value) {
        if (_.isNumber(value)) {
          $timeout(function(){
            jonosija.tuloksenTila = "HYVAKSYTTAVISSA";
          });
        } else {
          $timeout(function(){
            jonosija.tuloksenTila = "";
            delete jonosija.jonosija;
          });
        }

      };

      $scope.changeSija = function (jonosija, value) {
        if (value !== 'HYVAKSYTTAVISSA') {
          $timeout(function(){
            delete jonosija.jonosija;
          });
        }

      };
      $scope.getHakutyyppi = function() {
        if($scope.hakuModel.korkeakoulu) {
          return "KORKEAKOULU";
        } else {
          return "TOISEN_ASTEEN_OPPILAITOS";
        }
      }
      $scope.erillishaunTuontiJson = function(valintatapajonoOid, valintatapajononNimi, json) {

        var hakutyyppi = $scope.getHakutyyppi();
        ErillishakuTuonti.tuo({
            hakutyyppi: hakutyyppi,
            hakukohdeOid: $scope.hakukohdeOid,
            hakuOid: $routeParams.hakuOid,
            valintatapajononNimi: valintatapajononNimi,
            tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
            valintatapajonoOid: valintatapajonoOid
          },
          {rivit: json}, function (id) {
            Latausikkuna.avaaKustomoitu(id, "Erillishaun hakukohteen tuonti", "", "../common/modaalinen/tuontiikkuna.html",
              function(dokumenttiId) {
                // tee paivitys
                $window.location.reload();
              }
            );
          }, function () {
            Ilmoitus.avaa("Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
          });

      };
      $scope.erillishaunVientiXlsx = function(valintatapajonoOid, valintatapajononNimi) {
        var hakutyyppi = $scope.getHakutyyppi();
        ErillishakuVienti.vie({
            hakutyyppi: hakutyyppi,
            hakukohdeOid: $scope.hakukohdeOid,
            hakuOid: $routeParams.hakuOid,
            valintatapajononNimi: valintatapajononNimi,
            tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
            valintatapajonoOid: valintatapajonoOid
          },
          {}, function (id) {
            Latausikkuna.avaa(id, "Erillishaun hakukohteen vienti taulukkolaskentaan", "");
          }, function () {
            Ilmoitus.avaa("Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
          });
      };
      $scope.valintatapajonoTuontiXlsx = function(valintatapajonoOid, $files, valintatapajononNimi) {
        var file = $files[0];
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        var hakukohdeOid = $scope.hakukohdeOid;
        var hakuOid = $routeParams.hakuOid;
        var url =
          VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintatapajonolaskenta/tuonti?hakuOid=" +hakuOid + "&hakukohdeOid=" +hakukohdeOid;
        if(valintatapajonoOid) {
          url = url + "&valintatapajonoOid="+valintatapajonoOid;
        }
        if(valintatapajononNimi) {
          url = url + "&valintatapajononNimi=" + valintatapajononNimi;
        }
        fileReader.onload = function(e) {
          $scope.upload = $upload.http({
            url: url,
            method: "POST",
            headers: {'Content-Type': 'application/octet-stream'},
            data: e.target.result
          }).progress(function(evt) {
            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(id, status, headers, config) {
            Latausikkuna.avaaKustomoitu(id, "Valintatapajonon tuonti", "", "../common/modaalinen/tuontiikkuna.html",
              function(dokumenttiId) {
                // tee paivitys
                $scope.model.refresh(hakukohdeOid, hakuOid);
              }
            );
          }).error(function(data) {
            //error
          });
        };
      };
      $scope.erillishaunTuontiXlsx = function($files, valintatapajonoOid, valintatapajononNimi) {
        var file = $files[0];
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        var hakukohdeOid = $scope.hakukohdeOid;
        var hakuOid = $routeParams.hakuOid;
        var tarjoajaOid = $scope.hakukohdeModel.hakukohde.tarjoajaOids[0];
        var hakutyyppi = $scope.getHakutyyppi();
        var url =
          VALINTALASKENTAKOOSTE_URL_BASE + "resources/erillishaku/tuonti?hakuOid=" +hakuOid + "&hakukohdeOid=" + hakukohdeOid +"&hakutyyppi="+hakutyyppi;
        if(valintatapajonoOid) {
          url = url + "&valintatapajonoOid="+valintatapajonoOid;
        }
        if(valintatapajononNimi) {
          url = url + "&valintatapajononNimi=" + valintatapajononNimi;
        }
        fileReader.onload = function(e) {
          $scope.upload = $upload.http({
            url: url,
            method: "POST",
            headers: {'Content-Type': 'application/octet-stream'},
            data: e.target.result
          }).progress(function(evt) {
            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(id, status, headers, config) {
            Latausikkuna.avaaKustomoitu(id, "Erillishaun hakukohteen tuonti", "", "../common/modaalinen/tuontiikkuna.html",
              function(dokumenttiId) {
                // tee paivitys
                $window.location.reload();
              }
            );
          }).error(function(data) {
            //error
          });
        };
      };
      $scope.updateHyvaksymiskirjeLahetettyPvm = function (hakemus) {
        if (hakemus.hyvaksymiskirjeLahetetty) {
          hakemus.hyvaksymiskirjeLahetettyPvm = new Date();
        }
        else {
          hakemus.hyvaksymiskirjeLahetettyPvm = null;
        }
        $scope.addMuokattuHakemus(hakemus);
      };
      $scope.luoHyvaksymiskirjeetPDF = function(hakemusOids, sijoitteluajoId) {
        var hakukohde = $scope.hakukohdeModel.hakukohde;
        var tag = null;
        if(hakukohde.hakukohdeNimiUri) {
          tag = hakukohde.hakukohdeNimiUri.split('#')[0];
        } else {
          tag = $routeParams.hakukohdeOid;
        }
        Kirjeet.hyvaksymiskirjeet({
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
          sijoitteluajoId : sijoitteluajoId,
          hakemusOids: hakemusOids,
          tarjoajaOid: hakukohde.tarjoajaOids[0],
          hakukohdeNimiUri: hakukohde.hakukohdeNimiUri,
          hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi,
          tag: tag,
          langcode: HakukohdeNimiService.getOpetusKieliCode(hakukohde),
          templateName: "hyvaksymiskirje"
        });
      };
      $scope.selectEiVastanotettuMaaraaikanaToAll = function(valintatapajono) {
        var valintatulokset = _.map(valintatapajono.hakemukset, function(hakemus) {
          return {
            julkaistavissa: hakemus.julkaistavissa,
            ehdollisestiHyvaksyttavissa: hakemus.ehdollisestiHyvaksyttavissa,
            hyvaksymiskirjeLahetetty: hakemus.hyvaksymiskirjeLahetetty,
            hyvaksymiskirjeLahetettyPvm: hakemus.hyvaksymiskirjeLahetettyPvm,
            tila: hakemus.valintatuloksenTila,
            tilaHakijalle: hakemus.valintatuloksenTilaHakijalle,
            hakemusOid: hakemus.hakemusOid,
            hakijaOid: hakemus.hakijaOid
          }
        });
        VastaanottoUtil.merkitseMyohastyneeksi(valintatulokset);
        _.forEach(valintatulokset, function(valintatulos) {
          if (valintatulos.muokattuVastaanottoTila && valintatulos.muokattuVastaanottoTila !== valintatulos.tila) {
            var vastaavaHakemus = _.find(valintatapajono.hakemukset, function(hakemus) { return hakemus.hakemusOid === valintatulos.hakemusOid; });
            vastaavaHakemus.valintatuloksentila = valintatulos.muokattuVastaanottoTila;
            $scope.addMuokattuHakemus(vastaavaHakemus);
          }
        });
      };

      function fetchAndPopulateVastaanottoAikaraja(hakuOid, hakukohdeOid, kaikkiHakemukset) {
        var oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon = _.map(_.filter(kaikkiHakemukset, function(h) {
            return h.valintatuloksentila === "KESKEN" && h.julkaistavissa && 
              (h.hakemuksentila === 'HYVAKSYTTY' || h.hakemuksentila === 'VARASIJALTA_HYVAKSYTTY' || h.hakemuksentila === 'PERUNUT');
        }), function(relevanttiHakemus) {
            return relevanttiHakemus.hakemusOid;
        });

        var dataLoadedCallback = _.noop;
        VastaanottoUtil.fetchAndPopulateVastaanottoDeadlineDetailsAsynchronously(hakuOid, hakukohdeOid, kaikkiHakemukset,
          oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon, dataLoadedCallback);
      }
    }]);
