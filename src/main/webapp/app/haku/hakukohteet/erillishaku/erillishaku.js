﻿angular.module('valintalaskenta')

  .controller('ErillishakuController', ['$scope', '$modal', '$log', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
    'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti',
    'TulosXls', 'HakukohdeModel', 'HakuModel', '$http', 'AuthService', 'UserModel','_', 'LocalisationService','ErillishakuVienti',
    'ErillishakuProxy','ErillishakuTuonti','VastaanottoTila', '$window', 'HakukohdeNimiService', 'Hyvaksymiskirjeet', 'Kirjepohjat','Kirjeet',
    'VastaanottoUtil',
    function ($scope, $modal, $log, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti,TulosXls, HakukohdeModel, HakuModel, $http, AuthService, UserModel, _, LocalisationService,
              ErillishakuVienti,ErillishakuProxy,ErillishakuTuonti,VastaanottoTila, $window, HakukohdeNimiService, Hyvaksymiskirjeet, Kirjepohjat, Kirjeet,
              VastaanottoUtil) {
      "use strict";

      $scope.muokatutHakemukset = [];
      $scope.hakukohdeOid = $routeParams.hakukohdeOid;
      $scope.hakuOid =  $routeParams.hakuOid;
      $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
      $scope.hakukohdeModel = HakukohdeModel;
      $scope.hakuModel = HakuModel;

      $scope.valintatuloksentilat = [];
      $scope.korkeakoulu;

      function valintatuloksenTilojenKielistykset(valintatuloksentilat) {
        return valintatuloksentilat.reduce(function(o, tila) {
          o[tila.value] = tila.text_prop || tila.default_text;
          return o;
        }, {});
      }

      HakuModel.promise.then(function(model) {
        $scope.korkeakoulu = model.korkeakoulu;
        if ($scope.korkeakoulu) {
          $scope.valintatuloksentilat = [
            {value:"EI_VASTAANOTETTU_MAARA_AIKANA", default_text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
            {value:"KESKEN",    default_text:"Kesken"},
            {value:"PERUNUT",   default_text:"Perunut"},
            {value:"PERUUTETTU",default_text:"Peruutettu"},
            {value:"VASTAANOTTANUT_SITOVASTI", default_text:"Vastaanotettu sitovasti"},
            {value:"OTTANUT_VASTAAN_TOISEN_PAIKAN", default_text:"Ottanut vastaan toisen paikan", disable: true}
          ];
        } else {
          $scope.valintatuloksentilat = [
            {value:"EI_VASTAANOTETTU_MAARA_AIKANA", default_text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
            {value:"KESKEN",    default_text:"Kesken"},
            {value:"PERUNUT",   default_text:"Perunut"},
            {value:"VASTAANOTTANUT_SITOVASTI", default_text: "Vastaanotettu"}
          ];
        }
        $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset($scope.valintatuloksentilat);
        LocalisationService.getTranslationsForArray($scope.valintatuloksentilat).then(function () {
          HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
          $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset($scope.valintatuloksentilat);
        });
      });

      $scope.hakemuksentilat = [
        {value:"HYVAKSYTTY",default_text:"Hyv\u00E4ksytty"},
        {value:"VARASIJALTA_HYVAKSYTTY",default_text:"Varasijalta hyv\u00E4ksytty"},
        {value:"VARALLA",default_text:"Varalla"},
        {value:"PERUNUT",default_text:"Perunut"},
        {value:"PERUUTETTU",default_text:"Peruutettu"},
        {value:"PERUUNTUNUT",default_text:"Peruuntunut"},
        {value:"HYLATTY",default_text:"Hyl\u00E4tty"}
      ];

      LocalisationService.getTranslationsForArray($scope.hakemuksentilat).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
      });

      function isToinenAsteKohdeJoukko(kohdejoukkoUri) {
        if (kohdejoukkoUri) {
          var arr = ["_11", "_17", "_20"];
          return arr.some(function(s){return kohdejoukkoUri.indexOf(s) !== -1});
        }
        return false;
      }
      $scope.showEhdollinenHyvaksynta = function() {
        return !isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
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
            hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta
          };
        };
      };

      $scope.submitIlmanLaskentaa = function (valintatapajono) {
        $scope.erillishaunTuontiJson(valintatapajono.oid, valintatapajono.nimi, _.map($scope.muokatutHakemukset,$scope.hakemusToErillishakuRivi));
      };

      $scope.submitLaskennalla = function (valintatapajono) {
        VastaanottoTila.post({
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
          hyvaksyttyJonoOid: "",
          selite: "Massamuokkaus"
        }, _.map($scope.muokatutHakemukset,$scope.hakemusToValintatulos(valintatapajono)), function (result) {
          $scope.muokatutHakemukset = [];
          console.log(result);
          Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
        }, function (error) {
          var statuses = (error && error.data && error.data.statuses) ? error.data.statuses : []
          var errorCount = statuses.length;
          var errorMsg = errorCount + "/" + $scope.muokatutHakemukset.length + " hakemuksen päivitys epäonnistui. ";
          if (statuses.filter(function(status) { return status.status === 409; }).length > 0) {
              errorMsg += "Tietoihin on tehty samanaikaisia muutoksia, päivitä sivu ja yritä uudelleen";
          } else {
              errorMsg += "Yritä uudelleen tai ota yhteyttä ylläpitoon.";
          }
          var errorRows = _.map(statuses, function(status) { return status.hakemusOid + ": " + status.message; });
          Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! " + errorMsg, IlmoitusTila.ERROR, null, errorRows);
        });
      };

      $scope.addMuokattuHakemus = function (hakemus) {
        $scope.muokatutHakemukset.push(hakemus);
        $scope.muokatutHakemukset = _.uniq($scope.muokatutHakemukset);
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
      $scope.luoHyvaksymiskirjeetPDF = function() {
        var tag = null;
        var hakukohde = $scope.hakukohdeModel.hakukohde;
        if(hakukohde.hakukohdeNimiUri) {
          tag = hakukohde.hakukohdeNimiUri.split('#')[0];
        } else {
          tag = $routeParams.hakukohdeOid;
        }
        Kirjeet.hyvaksymiskirjeet({
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
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
