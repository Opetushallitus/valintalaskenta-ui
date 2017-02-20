angular.module('valintalaskenta')

  .controller('ErillishakuController', ['$scope', '$modal', '$log', '$location', '$routeParams', '$timeout', '$upload', '$q', '$filter',
              'FilterService', 'Ilmoitus', 'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti', 'TulosXls', 'HakukohdeModel',
              'HakuModel', 'HakuUtility', '$http', 'AuthService', 'UserModel','_', 'LocalisationService', 'ErillishakuVienti',
              'ErillishakuProxy','ErillishakuTuonti','VastaanottoTila', '$window', 'HakukohdeNimiService', 'Hyvaksymiskirjeet',
              'Kirjepohjat','Kirjeet', 'VastaanottoUtil', 'NgTableParams', 'TallennaValinnat', 'HakukohdeHenkilotFull', 'ValinnanTulos',
    function ($scope, $modal, $log, $location, $routeParams, $timeout,  $upload, $q, $filter, FilterService, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti, TulosXls, HakukohdeModel, HakuModel, HakuUtility, $http, AuthService, UserModel, _, LocalisationService,
              ErillishakuVienti, ErillishakuProxy, ErillishakuTuonti, VastaanottoTila, $window, HakukohdeNimiService, Hyvaksymiskirjeet, Kirjepohjat, Kirjeet,
              VastaanottoUtil, NgTableParams, TallennaValinnat, HakukohdeHenkilotFull, ValinnanTulos) {
      "use strict";

      $scope.muokatutHakemukset = {};
      $scope.hakukohdeOid = $routeParams.hakukohdeOid;
      $scope.hakuOid =  $routeParams.hakuOid;
      $scope.url = window.url;
      $scope.hakukohdeModel = HakukohdeModel;
      $scope.hakuModel = HakuModel;
      $scope.tableParams = {};
      $scope.showInvalidsOnly = false;
      $scope.valintatuloksentilat = [];
      $scope.korkeakoulu;
      $scope.pageSize = 50;
      $scope.deleting = null;
      $scope.valintatapajonoLastModified = {};

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
            {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"},
            {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"}
          ];
        }
        $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset($scope.valintatuloksentilat);
        LocalisationService.getTranslationsForArray($scope.valintatuloksentilat).then(function () {
          HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
          $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset($scope.valintatuloksentilat);
        });
      });

      $scope.hakemuksentilat = [
        {value: null, text_prop: "", default_text: ""},
        {value: "HYLATTY", text_prop: "sijoitteluntulos.hylatty", default_text:"Hyl\u00E4tty"},
        {value: "VARALLA", text_prop: "sijoitteluntulos.varalla", default_text:"Varalla"},
        {value: "PERUUNTUNUT", text_prop: "sijoitteluntulos.peruuntunut", default_text:"Peruuntunut"},
        {value: "VARASIJALTA_HYVAKSYTTY", text_prop: "sijoitteluntulos.varasijalta", default_text:"Varasijalta hyv\u00E4ksytty"},
        {value: "HYVAKSYTTY", text_prop: "sijoitteluntulos.hyvaksytty", default_text:"Hyv\u00E4ksytty"},
        {value: "PERUNUT", text_prop: "sijoitteluntulos.perunut", default_text:"Perunut"},
        {value: "PERUUTETTU", text_prop: "sijoitteluntulos.peruutettu", default_text:"Peruutettu"}
      ];

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
      $scope.maksuvelvollisuus = [
        {value: "NOT_CHECKED", text_prop: "maksuvelvollisuus.not_checked", default_text:"Ei tarkistettu"},
        {value: "NOT_REQUIRED", text_prop: "maksuvelvollisuus.not_required", default_text:"Ei maksuvelvollinen"},
        {value: "REQUIRED", text_prop: "maksuvelvollisuus.required", default_text:"Maksuvelvollinen"}
      ];
      $scope.valintaTuloksenTilaToHakemuksenTila = {
        "EHDOLLISESTI_VASTAANOTTANUT": "HYVAKSYTTY",
        "VASTAANOTTANUT_SITOVASTI": "HYVAKSYTTY",
        "EI_VASTAANOTETTU_MAARA_AIKANA": "PERUNUT",
        "PERUNUT": "PERUNUT",
        "PERUUTETTU": "PERUUTETTU",
        "OTTANUT_VASTAAN_TOISEN_PAIKAN": "PERUUNTUNUT"
      };

      $scope.objectIsEmpty = function(obj) {
        return _.isEmpty(obj);
      };

      $scope.validateHakemuksenTilat = function(hakemus) {
        if (hakemus.hakemuksentila == null && hakemus.valintatuloksentila == "KESKEN") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "HYLATTY" && hakemus.valintatuloksentila == "KESKEN") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "VARALLA" && hakemus.valintatuloksentila == "KESKEN") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "PERUUNTUNUT" && hakemus.valintatuloksentila == "KESKEN") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "PERUUNTUNUT" && hakemus.valintatuloksentila == "OTTANUT_VASTAAN_TOISEN_PAIKAN") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "PERUNUT" && hakemus.valintatuloksentila == "EI_VASTAANOTETTU_MAARA_AIKANA") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "VARASIJALTA_HYVAKSYTTY" && hakemus.valintatuloksentila == "KESKEN") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "VARASIJALTA_HYVAKSYTTY" && hakemus.valintatuloksentila == "EHDOLLISESTI_VASTAANOTTANUT") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "VARASIJALTA_HYVAKSYTTY" && hakemus.valintatuloksentila == "VASTAANOTTANUT_SITOVASTI") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "HYVAKSYTTY" && hakemus.valintatuloksentila == "KESKEN") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "HYVAKSYTTY" && hakemus.valintatuloksentila == "EHDOLLISESTI_VASTAANOTTANUT") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "HYVAKSYTTY" && hakemus.valintatuloksentila == "VASTAANOTTANUT_SITOVASTI") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "PERUNUT" && hakemus.valintatuloksentila == "PERUNUT") hakemus.isValid = true;
        else if (hakemus.hakemuksentila == "PERUUTETTU" && hakemus.valintatuloksentila == "PERUUTETTU") hakemus.isValid = true;
        else hakemus.isValid = false
      };

      $scope.toggleShowInvalidsOnly = function(tableParams) {
        $scope.showInvalidsOnly = !$scope.showInvalidsOnly;
        tableParams.reload();
      };

      $scope.invalidsAmount = function(hakemukset) {
        return _(hakemukset).filter(function(hakemus) {
          return hakemus.isValid == false;
        }).length;
      };

      $scope.changeVastaanottoTieto = function(hakemus, valintatapajono) {
        $scope.setHakemuksenTilaToVastaanottoTila(hakemus);
        $scope.addMuokattuHakemus(hakemus, valintatapajono)
      };

      $scope.setHakemuksenTilaToVastaanottoTila = function(hakemus) {
        if (hakemus.valintatuloksentila != "KESKEN") {
          if ($scope.hakemusIsVarasijaltaHyvaksytty(hakemus)) {
            hakemus.hakemuksentila = "VARASIJALTA_HYVAKSYTTY"
          } else {
            hakemus.hakemuksentila = $scope.valintaTuloksenTilaToHakemuksenTila[hakemus.valintatuloksentila];
          }
        }
      };

      $scope.parseHakemuksenTila = function(hakemus) {
        var text = "";
        if (hakemus.valintatuloksentila == "EI_VASTAANOTETTU_MAARA_AIKANA" && hakemus.hakemuksentila == "PERUNUT") {
          text =  "Peruuntunut"
        } else {
          _($scope.hakemuksentilat).filter(function(tila) {
            if (hakemus.hakemuksentila == tila.value) text = tila.text || tila.default_text;
          });
        }
        return text;
      };

      $scope.hakemusIsVarasijaltaHyvaksytty = function(hakemus) {
        return (hakemus.hakemuksentila == "VARALLA" || hakemus.hakemuksentila == "VARASIJALTA_HYVAKSYTTY")
          && (hakemus.valintatuloksentila == "EHDOLLISESTI_VASTAANOTTANUT" || hakemus.valintatuloksentila == "VASTAANOTTANUT_SITOVASTI");
      };

      LocalisationService.getTranslationsForArray($scope.hakemuksentilat).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
      });

      $scope.showEhdollinenHyvaksynta = function() {
        return !HakuUtility.isToinenAsteKohdeJoukko(HakuModel.hakuOid.kohdejoukkoUri);
      };

      LocalisationService.getTranslationsForArray($scope.ilmoittautumistilat).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
      });
      LocalisationService.getTranslationsForArray($scope.maksuvelvollisuus).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
      });
      $scope.isVaaraVastaanottotila = function(tila) {
        return tila === 'VASTAANOTTANUT';
      };

      $scope.isVastaanottanut = function(tila) {
        return tila === 'VASTAANOTTANUT_SITOVASTI';
      };

      var isKeinotekoinenOid = function (oid) {
        return !oid ? false : /MISSING/.test(oid);
      };

      var addKeinotekoinenOidIfMissing = function (valintatapajono, i) {
        if (!valintatapajono.oid) {
          valintatapajono.oid = "MISSING_OID_" + (i + 1);
          createTableParamsForValintatapaJono(valintatapajono);
        }

        return valintatapajono;
      };

      var populateValintatapajonoOidsIfMissing = function (erillishaku) {
        erillishaku.forEach(function (e) {
          e.valintatapajonot.forEach(addKeinotekoinenOidIfMissing);
        });

        return erillishaku;
      };

      var toLowerStripUnderscore = function(str) {
        return str.toLowerCase().replace('_', ' ');
      };

      var multiFilter = function(value, index, array) {
        if (_.isEmpty($scope.filters)) return true;
        return _.some(_.map($scope.filters,function(val, key) {
          if (value[key] == null) return false;
          return toLowerStripUnderscore(value[key]).indexOf(toLowerStripUnderscore(val)) > -1;
        }));
      };

      var createTableParamsForValintatapaJono = function (valintatapajono) {
        if (valintatapajono.oid) {
          $scope.tableParams[valintatapajono.oid] = new NgTableParams({
            page: 1,
            count: 50,
            filters: {
              'sukunimi': '',
              'etunimi': ''
            },
            sorting: {
              'sukunimi': 'asc',
              'etunimi': 'desc'
            }
          }, {
            total: valintatapajono.hakemukset.length,
            getData: function($defer, params) {
              var filters = FilterService.fixFilterWithNestedProperty(params.filter());

              // remove empty filters
              _.map(filters, function(val, key) {
                if (!val) delete filters[key];
              });

              // Implement first and last name filtering with only 1 search box.
              // Has to be done with $scope.filters since custom filter functions cannot take filters as params AFAIK.
              if ('sukunimi' in filters) filters.etunimi = filters.sukunimi;
              $scope.filters = filters;

              var orderedData = params.sorting() ?
                $filter('orderBy')(valintatapajono.hakemukset, params.orderBy()) :
                valintatapajono.hakemukset;

              orderedData = $scope.showInvalidsOnly ?
                _(orderedData)
                  .filter(function(o) {
                    return !o.isValid;
                  }) : orderedData;

              orderedData = params.filter() ?
                $filter('filter')(orderedData, multiFilter) :
                orderedData;

              $scope.filters = {};
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
        }
      };

      var processErillishaku = function(erillishaku, oidToMaksuvelvollisuus) {
        var hakemukset = _.chain(erillishaku)
          .map(function (e) {
            return e.valintatapajonot;
          })
          .flatten()
          .map(function (v) {
            createTableParamsForValintatapaJono(v);
            return v.hakemukset;
          })
          .flatten();

        // Populate valintatapajonoOids if they are missing to "MISSING_OID"
        erillishaku = populateValintatapajonoOidsIfMissing(erillishaku);

        fetchAndPopulateVastaanottoAikaraja($routeParams.hakuOid, $routeParams.hakukohdeOid, hakemukset.value());

        hakemukset.each(function (hakemus) {
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
          var maksuvelvollisuus = oidToMaksuvelvollisuus[hakemus.hakemusOid];
          if(maksuvelvollisuus) {
            hakemus.maksuvelvollisuus = maksuvelvollisuus;
          } else {
            hakemus.maksuvelvollisuus = 'NOT_CHECKED';
          }
          $scope.validateHakemuksenTilat(hakemus);
        });

        $scope.erillishaku = erillishaku;
        getErillishaunValinnantulokset();
      };

      var getErillishaunValinnantulokset = function () {
          $scope.erillishaku.forEach(function (e) {
              e.valintatapajonot.forEach(function(v) {
                  ValinnanTulos.get({valintatapajonoOid: v.oid}).then(function(response) {
                      var forBreakpoint = response;
                      $scope.valintatapajonoLastModified[v.oid] = response.headers("Last-Modified");
                  }, function(error) {
                      var forBreakpoint = error;
                  });
              });
          });

          return erillishaku;
      };

      var getHakumodelValintatapaJonot = function(valinnanvaiheet, oidToMaksuvelvollisuus) {
        if (valinnanvaiheet) {
          processErillishaku(valinnanvaiheet, oidToMaksuvelvollisuus);
        } else {
          ErillishakuProxy.hae({
            hakuOid: $routeParams.hakuOid,
            hakukohdeOid: $routeParams.hakukohdeOid
          }, function (erillishaku) {
            processErillishaku(erillishaku, oidToMaksuvelvollisuus)
          });
        }
      };
      var hakemuksetToMaksuvelvollisuus = function(hakemukset) {
        var hakukohdeOid = $routeParams.hakukohdeOid;
        var oidToMaksuvelvollisuus = _.reduce(_.map(hakemukset, function(hakemus) {
          var eligibility = _.find(hakemus.preferenceEligibilities, {'aoId': hakukohdeOid});
          var maksuvelvollisuus = 'NOT_CHECKED';
          if(eligibility && eligibility.maksuvelvollisuus) {
            maksuvelvollisuus = eligibility.maksuvelvollisuus;
          }
          return {'oid': hakemus.oid, 'maksuvelvollisuus': maksuvelvollisuus}
        }), function(result, hakemus) {
          result[hakemus.oid] = hakemus.maksuvelvollisuus;
          return result;
        }, {});
        return oidToMaksuvelvollisuus;
      }

      $scope.hakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function () {
        $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOids', function () {
          AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOids[0]).then(function () {
            $scope.updateOrg = true;
          });
        });

        var hk = HakukohdeHenkilotFull.get({aoOid: $routeParams.hakukohdeOid, rows: 100000, asId: $routeParams.hakuOid})
        var vv = $scope.hakukohdeModel.valinnanVaiheetPromise.promise
        // Do this here to ensure valinnanVaiheetPromise is defined
        $q.all([hk,vv]).then(function(resolved) {
          var hakemukset = resolved[0];
          getHakumodelValintatapaJonot($scope.hakukohdeModel.valinnanvaiheet, hakemuksetToMaksuvelvollisuus(hakemukset));
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
          return item.oid === valintatapajono.oid || !item.oid;
        });

        if(!_.isEmpty(jono)) {
          return _.find(jono.hakemukset, function (item) {
            return item.hakijaOid === hakija.hakijaOid;
          });
        }
      };

      $scope.valintatapajonoVientiXlsx = function(valintatapajonoOid, valintatapajononNimi) {
        ValintatapajonoVienti.vie({
            valintatapajonoOid: isKeinotekoinenOid(valintatapajonoOid) ? null : valintatapajonoOid,
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
        if (valintatulos.showTilaPartial === null || valintatulos.showTilaPartial === false) {
          valintatulos.showTilaPartial = true;
        } else {
          valintatulos.showTilaPartial = false;
        }
      };
      $scope.showHenkiloPartial = function(valintatulos) {
        if (valintatulos.showHenkiloPartial === null || valintatulos.showHenkiloPartial === false) {
          valintatulos.showHenkiloPartial = true;
        } else {
          valintatulos.showHenkiloPartial = false;
        }
      };

      $scope.hakemusToErillishakuRivi = function (hakemus) {
        return {
          etunimi: hakemus.etunimi,
          sukunimi: hakemus.sukunimi,
          henkilotunnus: hakemus.henkilotunnus,
          sahkoposti: hakemus.sahkoposti,
          syntymaAika: hakemus.syntymaaika,
          personOid: hakemus.hakijaOid,
          hakemuksenTila: hakemus.hakemuksentila,
          ehdollisestiHyvaksyttavissa: hakemus.ehdollisestiHyvaksyttavissa,
          maksuvelvollisuus: hakemus.maksuvelvollisuus ? hakemus.maksuvelvollisuus : 'NOT_CHECKED',
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
            valintatapajonoOid: isKeinotekoinenOid(valintatapajono.oid) ? null : valintatapajono.oid,
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
        return muokatutHakemukset[valintatapajonoOid] || [];
      };

      $scope.hakemuksetByValintatapajonoOid = hakemuksetByValintatapajonoOid;

      $scope.submitIlmanLaskentaa = function (valintatapajono) {
        var hakemukset = hakemuksetByValintatapajonoOid($scope.muokatutHakemukset, valintatapajono.oid);
        $scope.erillishaunTuontiJson(valintatapajono.oid, valintatapajono.nimi, _.map(hakemukset, $scope.hakemusToErillishakuRivi));
      };

      var addToMuokattuHakemusList = function (joMuokatut, hakemus, valintatapajonoOid) {
        joMuokatut.push(hakemus);
        joMuokatut = _.uniq(joMuokatut);
        $scope.muokatutHakemukset[valintatapajonoOid] = joMuokatut;
      };

      $scope.addMuokattuHakemus = function (hakemus, valintatapajono) {
        var joMuokatut = hakemuksetByValintatapajonoOid($scope.muokatutHakemukset, valintatapajono.oid);

        if (joMuokatut && joMuokatut.length > 0) {
          addToMuokattuHakemusList(joMuokatut, hakemus, valintatapajono.oid);
        } else {
          $scope.muokatutHakemukset[valintatapajono.oid] = [hakemus];
        }

        $scope.validateHakemuksenTilat(hakemus);
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
      };

      $scope.erillisHakuTuontiParams = function(valintatapajonoOid, valintatapajononNimi) {
        return {
          hakutyyppi: $scope.getHakutyyppi(),
          hakukohdeOid: $scope.hakukohdeOid,
          hakuOid: $routeParams.hakuOid,
          valintatapajononNimi: valintatapajononNimi,
          tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
          valintatapajonoOid: isKeinotekoinenOid(valintatapajonoOid) ? null : valintatapajonoOid
        };
      };

      $scope.erillishaunTuontiJson = function(valintatapajonoOid, valintatapajononNimi, json) {
        ErillishakuTuonti.tuo($scope.erillisHakuTuontiParams(valintatapajonoOid, valintatapajononNimi),
          {rivit: json}, function (id) {
            Latausikkuna.avaaKustomoitu(id, "Tallennetaan muutokset.", "", "../common/modaalinen/erillishakutallennus.html",
              function() {
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
            valintatapajonoOid: isKeinotekoinenOid(valintatapajonoOid) ? null : valintatapajonoOid
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
        var params = {
          hakuOid : hakuOid,
          hakukohdeOid : hakukohdeOid
        };
        if(!isKeinotekoinenOid(valintatapajonoOid)) {
          params.valintatapajonoOid=valintatapajonoOid;
        }
        if(valintatapajononNimi) {
          params.valintatapajononNimi=valintatapajononNimi;
        }
        fileReader.onload = function(e) {
          $scope.upload = $upload.http({
            url: window.url("valintalaskentakoostepalvelu.valintatapajonolaskenta.tuonti", params),
            method: "POST",
            headers: {'Content-Type': 'application/octet-stream'},
            data: e.target.result
          }).progress(function(evt) {

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

        var params = {
          hakuOid : hakuOid,
          hakukohdeOid : hakukohdeOid,
          hakutyyppi : hakutyyppi
        };
        if(!isKeinotekoinenOid(valintatapajonoOid)) {
          params.valintatapajonoOid=valintatapajonoOid;
        }
        if(valintatapajononNimi) {
          params.valintatapajononNimi=valintatapajononNimi;
        }
        fileReader.onload = function(e) {
          $scope.upload = $upload.http({
            url: window.url("valintalaskentakoostepalvelu.erillishaku.tuonti", params),
            method: "POST",
            headers: {'Content-Type': 'application/octet-stream'},
            data: e.target.result
          }).progress(function(evt) {
          }).success(function(id, status, headers, config) {
            Latausikkuna.avaaKustomoitu(id, "Erillishaun hakukohteen tuonti", "", "../common/modaalinen/tuontiikkuna.html",
              function(dokumenttiId) {
                // tee paivitys
                $window.location.reload();
              }
            );
          }).error(function(data) {
            console.log(data);
          });
        };
      };

      $scope.updateHyvaksymiskirjeLahetettyPvm = function (hakemus, valintatapajono) {
        if (hakemus.hyvaksymiskirjeLahetetty) {
          hakemus.hyvaksymiskirjeLahetettyPvm = new Date();
        }
        else {
          hakemus.hyvaksymiskirjeLahetettyPvm = null;
        }
        $scope.addMuokattuHakemus(hakemus, valintatapajono);
      };

      $scope.luoHyvaksymiskirjeetPDF = function(hakemusOids, sijoitteluajoId) {
        var hakukohde = $scope.hakukohdeModel.hakukohde;
        var tag = null;
        if (hakukohde.hakukohdeNimiUri) {
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
            $scope.addMuokattuHakemus(vastaavaHakemus, valintatapajono);
          }
        });
      };

      $scope.selectIlmoitettuToAll = function (valintatapajono) {
        var counter = 0;
        _(valintatapajono.hakemukset).forEach(function(hakemus) {
          if (!hakemus.julkaistavissa && hakemus.hakemuksentila) {
            counter ++;
            hakemus.julkaistavissa = true;
            if (!hakemus.valintatuloksentila) hakemus.valintatuloksentila = "KESKEN";
            if (!hakemus.ilmoittautumistila) hakemus.ilmoittautumistila = "EI_TEHTY";
            $scope.addMuokattuHakemus(hakemus, valintatapajono);
          }
        });
        $scope.submitIlmoitettuToall(valintatapajono, counter);
      };

      $scope.submitIlmoitettuToall = function (valintatapajono, hakemuksetSize) {
        var hakemukset = hakemuksetByValintatapajonoOid($scope.muokatutHakemukset, valintatapajono.oid);
        TallennaValinnat.avaa("Hyväksy jonon valintaesitys", "Olet hyväksymässä " + hakemuksetSize + " kpl. hakemuksia.", function (success, failure) {
          success();
          $scope.saveIlmoitettuToAll(valintatapajono.oid, valintatapajono.nimi, _.map(hakemukset, $scope.hakemusToErillishakuRivi));
        });
      };

      $scope.saveIlmoitettuToAll = function(valintatapajonoOid, valintatapajononNimi, json) {
        ErillishakuTuonti.tuo($scope.erillisHakuTuontiParams(valintatapajonoOid, valintatapajononNimi),
          {rivit: json}, function () {
            Ilmoitus.avaa("Erillishaun hakukohteen tallennus", "Tallennus onnistui. Paina OK ladataksesi sivu uudelleen.", "",
              function() {
                $window.location.reload();
              }
            );
          }, function () {
            Ilmoitus.avaa("Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
          });
      };

      $scope.disableButton = function(button) {
        angular.element(button).off('click');
        angular.element(button).attr('disabled', true);
      };

      $scope.removeHakemusRow = function(hakemus, eventTarget, valintatapajono) {
        $(eventTarget).closest('tr').find('td > div').slideUp();
        $timeout(function() {
          valintatapajono.hakemukset = _(valintatapajono.hakemukset).filter(function(o) {
            return o.hakemusOid != hakemus.hakemusOid;
          });
          $scope.tableParams[valintatapajono.oid].reload();
        }, 500);
      };

      $scope.removeHakemus = function(hakemus, valintatapajono, $event) {
        $timeout.cancel($scope.deleting);
        $scope.deleting = null;
        $scope.disableButton(angular.element($event.target).prev());
        $scope.removeHakemusRow(hakemus, $event.target, valintatapajono);
        hakemus.poistetaankoRivi = true;

        console.log($scope.hakemusToErillishakuRivi(hakemus));
        ErillishakuTuonti.tuo($scope.erillisHakuTuontiParams(valintatapajono.oid, valintatapajono.nimi),
          {rivit: [$scope.hakemusToErillishakuRivi(hakemus)]}, function(res) {
            console.log(res);
          }, function(e) {
            console.log(e);
          });
      };

      $scope.handleRemoveHakemus = function(hakemus, valintatapajono, $event) {
        if (!$scope.deleting) {
          angular.element($event.target).hide().next().show();
          angular.element($event.target).parent('td').siblings().addClass('deleting-row');
          $scope.deleting = $timeout(function() {
            $scope.deleting = null;
            angular.element($event.target).next().hide();
            angular.element($event.target).show();
            angular.element($event.target).parent('td').siblings().removeClass('deleting-row');
          }, 3000);
        }
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
