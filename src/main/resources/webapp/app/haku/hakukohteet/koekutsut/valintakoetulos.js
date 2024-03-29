﻿var app = angular.module('valintalaskenta')
app.factory('ValintakoetulosModel', function (
  $q,
  $log,
  $routeParams,
  Valintakoetulokset,
  Valintakoe,
  HakukohdeValintakoe,
  HenkilotByOid,
  Hakemukset,
  HakuModel,
  AtaruApplications
) {
  'use strict'
  var model
  model = new (function () {
    this.loading = true
    this.hakuOid = undefined
    this.hakukohdeOid = {}
    this.koetulokset = []
    this.valintakokeet = {}
    this.valintakokeetHakijoittain = {}
    this.valintakokeetHakijoittainArray = []
    this.errors = []
    this.filter = 'OSALLISTUU'

    this.refresh = function (hakukohdeOid, hakuOid) {
      model.loading = true
      model.hakukohdeOid = {}
      model.koetulokset = []
      model.valintakokeet = {}
      model.valintakokeetHakijoittain = {}
      model.valintakokeetHakijoittainArray = []
      model.koetyypit = []
      model.errors = []
      model.errors.length = 0
      model.hakukohdeOid = hakukohdeOid
      model.hakuOid = hakuOid
      model.hakukohteenValintakokeet = []
      model.reviewUrlKey = 'haku-app.virkailija.hakemus.esikatselu'

      $q.all([
        HakukohdeValintakoe.get({ hakukohdeOid: hakukohdeOid }).$promise,
        Hakemukset.get(hakuOid, hakukohdeOid),
        Valintakoetulokset.get({ hakukohdeoid: hakukohdeOid }).$promise,
        HakuModel.refreshIfNeeded(hakuOid),
      ])
        .then(function (data) {
          var valintakokeet = data[0]
          var hakemukset = data[1]
          var valintakoetulokset = data[2]
          var haku = data[3]

          model.reviewUrlKey = haku.hakuOid.ataruLomakeAvain
            ? 'ataru.application.review'
            : 'haku-app.virkailija.hakemus.esikatselu'

          processValintakokeet(valintakokeet)

          model.koetulokset = valintakoetulokset

          // Tarkastetaan onko hakukohteen ulkopuolisia osallistujia ja haetaan ne tarvittaessa
          // Kaikki hakemukset tarvitaan myös ei osallistujat koska ei osallistujat näytetään myös taulukossa
          var osallistujienHakemusOidit = _.map(valintakoetulokset, function (
            tulos
          ) {
            return tulos.hakemusOid
          })
          var haettujenHakemustenOidit = _.map(hakemukset, function (hakemus) {
            return hakemus.oid
          })
          var puuttuvienHakemustenOidit = _.difference(
            osallistujienHakemusOidit,
            haettujenHakemustenOidit
          )
          var kaikkiTarvittavatHakemukset = $q.defer()
          if (
            puuttuvienHakemustenOidit &&
            puuttuvienHakemustenOidit.length > 0
          ) {
            fetchPuuttuvatHakemukset(
              haku,
              puuttuvienHakemustenOidit,
              kaikkiTarvittavatHakemukset,
              hakemukset
            )
          } else {
            kaikkiTarvittavatHakemukset.resolve(hakemukset)
          }
          return kaikkiTarvittavatHakemukset.promise.then(function (
            kaikkiHakemukset
          ) {
            var byHakemusOid = _.object(
              _.map(kaikkiHakemukset, function (val) {
                return [val.oid, val]
              })
            )
            paivitaKutsutaanKaikki(kaikkiHakemukset)
            paivitaKokeeseenOsallistujat(byHakemusOid)
            model.loading = false
          })
        })
        .catch(function (e) {
          model.errors.push(e.data)
          model.loading = false
        })
    }

    function processValintakokeet(valintakokeet) {
      model.hakukohteenValintakokeet = valintakokeet
      model.valintakokeet = _.chain(valintakokeet)
        .map(function (entry) {
          return {
            aktiivinen: entry.aktiivinen != false,
            valittu: true,
            valintakoeOid: entry.oid,
            valintakoeTunniste: entry.nimi,
            tunniste: entry.selvitettyTunniste,
            kutsutaankoKaikki: entry.kutsutaankoKaikki,
            lahetetaankoKoekutsut: entry.lahetetaankoKoekutsut,
            hakijat: [],
          }
        })
        .indexBy('tunniste')
        .value()
    }

    function fetchPuuttuvatHakemukset(
      hakuModel,
      puuttuvienHakemustenOidit,
      kaikkiTarvittavatHakemukset,
      hakemukset
    ) {
      if (hakuModel.hakuOid.ataruLomakeAvain) {
        AtaruApplications.get(
          { hakemusOids: puuttuvienHakemustenOidit },
          function (puuttuvatHakemukset) {
            kaikkiTarvittavatHakemukset.resolve(
              _.union(puuttuvatHakemukset, hakemukset)
            )
          },
          function () {
            model.errors.push(
              'Hakukohteen ulkopuolisten osallistujien haku Atarusta epäonnistui'
            )
            kaikkiTarvittavatHakemukset.resolve(hakemukset)
          }
        )
      } else {
        HenkilotByOid.hae(
          puuttuvienHakemustenOidit,
          function (puuttuvatHakemukset) {
            kaikkiTarvittavatHakemukset.resolve(
              _.union(puuttuvatHakemukset, hakemukset)
            )
          },
          function () {
            model.errors.push(
              'Hakukohteen ulkopuolisten osallistujien haku epäonnistui'
            )
            kaikkiTarvittavatHakemukset.resolve(hakemukset)
          }
        )
      }
    }

    function paivitaKutsutaanKaikki(kaikkiHakemukset) {
      _.each(model.hakukohteenValintakokeet, function (entry) {
        if (entry.kutsutaankoKaikki) {
          _.each(kaikkiHakemukset, function (hakija) {
            var e = {}
            e.osallistuminen = 'OSALLISTUU'
            e.hakuOid = $routeParams.hakuOid
            e.hakemusOid = hakija.oid
            e.hakijaOid = hakija.personOid
            e.etunimi = hakija.etunimet
              ? hakija.etunimet
              : hakija.answers.henkilotiedot.Kutsumanimi
            e.sukunimi = hakija.sukunimi
              ? hakija.sukunimi
              : hakija.answers.henkilotiedot.Sukunimi
            e.asiointikieli = hakija.asiointiKieli
              ? hakija.asiointiKieli.kieliTyyppi
              : hakija.answers.lisatiedot.asiointikieli
            e.valittu = true
            e.aktiivinen = entry.aktiivinen
            e.valintakoeOid = entry.oid
            e.lahetetaankoKoekutsut = true
            e.valintakoeTunniste = entry.nimi // OVT-6961?
            e.tunniste = entry.selvitettyTunniste // OVT-6961?
            model.valintakokeet[entry.selvitettyTunniste].hakijat.push(e)
            if (model.valintakokeetHakijoittain[e.hakemusOid] === undefined) {
              model.valintakokeetHakijoittain[e.hakemusOid] = {
                hakemusOid: e.hakemusOid,
                etunimi: e.etunimi,
                sukunimi: e.sukunimi,
              }
              model.valintakokeetHakijoittain[e.hakemusOid].kokeet = []
              model.valintakokeetHakijoittain[e.hakemusOid].kokeet[
                e.valintakoeTunniste
              ] = e
            } else {
              model.valintakokeetHakijoittain[e.hakemusOid].kokeet[
                e.valintakoeTunniste
              ] = e
            }
            if (model.koetyypit.indexOf(e.valintakoeTunniste) === -1) {
              model.koetyypit.push(e.valintakoeTunniste)
            }
          })
        }
      })
    }

    function paivitaKokeeseenOsallistujat(byHakemusOid) {
      _.each(model.koetulokset, function (koetulos) {
        _.each(koetulos.hakutoiveet, function (hakutoive) {
          if (hakutoive.hakukohdeOid === model.hakukohdeOid) {
            _.each(hakutoive.valinnanVaiheet, function (valinnanvaihe) {
              _.each(valinnanvaihe.valintakokeet, function (valintakoe) {
                if (
                  model.valintakokeet[valintakoe.valintakoeTunniste] ===
                  undefined
                ) {
                  model.errors.push(
                    'tunnistamaton valintakoe ' + valintakoe.valintakoeTunniste
                  )
                  return
                }
                if (
                  model.valintakokeet[valintakoe.valintakoeTunniste]
                    .kutsutaankoKaikki
                ) {
                  return
                }
                var entry = {}
                var hakija = byHakemusOid[koetulos.hakemusOid]
                if (!hakija) {
                  return
                }
                entry.etunimi = hakija.etunimet
                  ? hakija.etunimet
                  : hakija.answers.henkilotiedot.Kutsumanimi
                entry.sukunimi = hakija.sukunimi
                  ? hakija.sukunimi
                  : hakija.answers.henkilotiedot.Sukunimi
                entry.osallistuminen =
                  valintakoe.osallistuminenTulos.osallistuminen
                entry.hakuOid = koetulos.hakueOid
                entry.hakemusOid = koetulos.hakemusOid
                entry.hakijaOid = koetulos.hakijaOid
                entry.createdAt = koetulos.createdAt
                entry.valittu = true
                entry.tunniste = valintakoe.valintakoeTunniste
                entry.aktiivinen = valintakoe.aktiivinen
                entry.valintakoeOid = valintakoe.valintakoeOid
                entry.lahetetaankoKoekutsut = valintakoe.lahetetaankoKoekutsut
                entry.lisatiedot =
                  valintakoe.osallistuminenTulos &&
                  valintakoe.osallistuminenTulos.kuvaus &&
                  valintakoe.osallistuminenTulos.kuvaus.FI
                    ? valintakoe.osallistuminenTulos.kuvaus.FI
                    : ''
                if (hakija) {
                  entry.asiointikieli = hakija.asiointiKieli
                    ? hakija.asiointiKieli.kieliTyyppi
                    : hakija.answers.lisatiedot.asiointikieli
                }
                entry.valintakoeTunniste = valintakoe.valintakoeTunniste

                model.valintakokeet[entry.valintakoeTunniste].hakijat.push(
                  entry
                )
                if (
                  model.valintakokeetHakijoittain[entry.hakemusOid] ===
                  undefined
                ) {
                  model.valintakokeetHakijoittain[entry.hakemusOid] = {
                    hakemusOid: entry.hakemusOid,
                    etunimi: entry.etunimi,
                    sukunimi: entry.sukunimi,
                  }
                  model.valintakokeetHakijoittain[entry.hakemusOid].kokeet = []
                  model.valintakokeetHakijoittain[entry.hakemusOid].kokeet[
                    entry.valintakoeTunniste
                  ] = entry
                } else {
                  model.valintakokeetHakijoittain[entry.hakemusOid].kokeet[
                    entry.valintakoeTunniste
                  ] = entry
                }
                model.valintakokeetHakijoittainArray.push(
                  model.valintakokeetHakijoittain[entry.hakemusOid]
                )
                //add identifier to list
                if (model.koetyypit.indexOf(entry.valintakoeTunniste) === -1) {
                  model.koetyypit.push(entry.valintakoeTunniste)
                }
              })
            })
          }
        })
      })
    }

    this.filterValitut = function (hakijat) {
      return _.filter(hakijat, function (hakija) {
        return hakija.valittu
      })
    }
    this.filterOsallistujat = function (hakijat) {
      if (hakijat) {
        return _.filter(hakijat, function (hakija) {
          return hakija.osallistuminen === 'OSALLISTUU'
        })
      }
      return []
    }
    this.isAllValittu = function (valintakoe) {
      return _.reduce(
        valintakoe.hakijat,
        function (memo, hakija) {
          if (hakija.osallistuminen !== 'OSALLISTUU') {
            return memo
          }
          return memo && hakija.valittu
        },
        true
      )
    }
    this.check = function (valintakoe) {
      valintakoe.valittu = this.isAllValittu(valintakoe)
    }
    this.checkAll = function (valintakoe) {
      var kaikkienUusiTila = valintakoe.valittu
      _.each(this.filterOsallistujat(valintakoe.hakijat), function (hakija) {
        hakija.valittu = kaikkienUusiTila
      })
      valintakoe.valittu = this.isAllValittu(valintakoe)
    }
    this.valintakoeTunnisteet = function () {
      return _.map(model.valintakokeet, function (valintakoe) {
        return valintakoe.tunniste
      })
    }
    this.aktiivisetJaLahetettavatValintakoeOids = function () {
      return _.map(
        _.filter(model.valintakokeet, function (valintakoe) {
          return valintakoe.aktiivinen && valintakoe.lahetetaankoKoekutsut
        }),
        function (valintakoe) {
          return valintakoe.valintakoeOid
        }
      )
    }
    this.valitutHakemusOids = function (valintakoe) {
      return _.map(
        this.filterValitut(this.filterOsallistujat(valintakoe.hakijat)),
        function (hakija) {
          return hakija.hakemusOid
        }
      )
    }
  })()

  return model
})

angular.module('valintalaskenta').controller('ValintakoetulosController', [
  '$scope',
  '$routeParams',
  'Ilmoitus',
  'Latausikkuna',
  'ValintakoetulosModel',
  'HakukohdeModel',
  'Koekutsukirjeet',
  'Osoitetarrat',
  'ValintakoeXls',
  'IlmoitusTila',
  '$window',
  '$modal',
  'Kirjepohjat',
  '$log',
  'HakukohdeNimiService',
  'Kirjeet',
  'ParametriService',
  function (
    $scope,
    $routeParams,
    Ilmoitus,
    Latausikkuna,
    ValintakoetulosModel,
    HakukohdeModel,
    Koekutsukirjeet,
    Osoitetarrat,
    ValintakoeXls,
    IlmoitusTila,
    $window,
    $modal,
    Kirjepohjat,
    $log,
    HakukohdeNimiService,
    Kirjeet,
    ParametriService
  ) {
    'use strict'

    $scope.url = window.url

    $scope.pageSize = 50

    $scope.isBlank = function (str) {
      return !str || /^\s*$/.test(str)
    }
    $scope.createKoekutsukirjeetPDF = function (valintakoe) {
      var hakukohde = $scope.hakukohdeModel.hakukohde
      var hakukohdeOid = $routeParams.hakukohdeOid
      var tag = hakukohdeOid
      var templateName = 'koekutsukirje'
      var otsikko = null
      var hakemusOids = null
      if ($scope.model.isAllValittu(valintakoe)) {
        // luodaan uusimmasta kannan datasta. kayttoliittama voi olla epasynkassa
        otsikko = 'Muodostetaan koekutsukirjeet valintakokeelle'
      } else {
        hakemusOids = $scope.model.valitutHakemusOids(valintakoe)
        if (hakemusOids.length == 0) {
          return // ei tehda tyhjalle joukolle
        }
        otsikko = 'Muodostetaan koekutsukirjeet valituille hakemuksille'
      }
      Kirjeet.koekutsukirjeet({
        hakuOid: $routeParams.hakuOid,
        hakukohdeOid: $routeParams.hakukohdeOid,
        tarjoajaOid: hakukohde.tarjoajaOids[0],
        hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi,
        tag: tag,
        langcode: HakukohdeNimiService.getOpetusKieliCode(hakukohde),
        otsikko: otsikko,
        templateName: templateName,
        hakemusOids: hakemusOids,
        valintakoe: valintakoe.tunniste,
        valintakoeTunniste: valintakoe.valintakoeTunniste,
      })
    }

    $scope.valintakoeTulosXLS = function (valintakoe) {
      var hakemusOids = null
      if (!$scope.model.isAllValittu(valintakoe)) {
        hakemusOids = $scope.model.valitutHakemusOids(valintakoe)
      }
      ValintakoeXls.lataa(
        {
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
        },
        {
          hakemusOids: hakemusOids,
          valintakoeTunnisteet: [valintakoe.tunniste],
        },
        function (id) {
          Latausikkuna.avaa(
            id,
            'Muodostetaan valintakoetuloksille taulukkolaskentatiedosto',
            valintakoe.valintakoeTunniste
          )
        }
      )
    }
    $scope.addressLabelPDF = function (valintakoe) {
      var otsikko = null
      var hakemusOids = null
      if ($scope.model.isAllValittu(valintakoe)) {
        // luodaan uusimmasta kannan datasta. kayttoliittama voi olla epasynkassa
        otsikko = 'Muodostetaan osoitetarrat valintakokeelle'
      } else {
        hakemusOids = $scope.model.valitutHakemusOids(valintakoe)
        if (hakemusOids.length === 0) {
          return // ei tehda tyhjalle joukolle
        }
        otsikko = 'Muodostetaan osoitetarrat valituille hakemuksille'
      }
      Osoitetarrat.post(
        {
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
          valintakoeTunnisteet: [valintakoe.tunniste],
        },
        {
          tag: 'valintakoetulos',
          hakemusOids: hakemusOids,
        },
        function (id) {
          Latausikkuna.avaa(id, otsikko, valintakoe.valintakoeTunniste)
        }
      )
    }
    $scope.allAddressLabelPDF = function () {
      var kokeet = $scope.model.aktiivisetJaLahetettavatValintakoeOids()
      Osoitetarrat.post(
        {
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
          valintakoeOid: kokeet,
        },
        {
          tag: 'valintakoetulos',
          hakemusOids: null,
        },
        function (id) {
          Latausikkuna.avaa(
            id,
            'Osoitetarrat hakukohteen valintakokeille',
            'Kaikille hakukohteen valintakokeille'
          )
        },
        function () {}
      )
    }

    $scope.hakukohdeOid = $routeParams.hakukohdeOid
    $scope.hakuOid = $routeParams.hakuOid

    $scope.model = ValintakoetulosModel
    $scope.hakukohdeModel = HakukohdeModel

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid)

    $scope.model.refresh($scope.hakukohdeOid, $routeParams.hakuOid)

    ParametriService($routeParams.hakuOid).then(function (privileges) {
      $scope.inputdisabled = !privileges['koekutsujenmuodostaminen']
    })

    $scope.nakymanTila = 'Kokeittain'

    $scope.predicate = ['sukunimi', 'etunimi']

    $scope.allValintakoeTulosXLS = function () {
      ValintakoeXls.lataa(
        { hakukohdeOid: $routeParams.hakukohdeOid },
        {
          valintakoeTunnisteet: $scope.model.valintakoeTunnisteet(),
          hakemusOids: [],
        },
        function (id) {
          Latausikkuna.avaa(
            id,
            'Muodostetaan valintakoetuloksille taulukkolaskentatiedosto',
            ''
          )
        }
      )
    }

    $scope.updateNakymanTila = function () {
      $scope.currentPage = 1
      $scope.model.hakukohteenValintakokeet.forEach(function (v) {
        $scope.model.valintakokeet[v.oid].currentPage = 1
      })
    }
  },
])
