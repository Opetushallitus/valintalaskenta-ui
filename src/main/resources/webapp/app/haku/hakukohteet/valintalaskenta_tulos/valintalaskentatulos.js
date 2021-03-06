﻿var app = angular.module('valintalaskenta')
app.factory('ValintalaskentatulosModel', function (
  $routeParams,
  ValinnanvaiheListByHakukohde,
  JarjestyskriteeriMuokattuJonosija,
  ValinnanVaiheetIlmanLaskentaa,
  HakukohdeHenkilotFull,
  Ilmoitus,
  IlmoitusTila,
  $q,
  ValintaperusteetHakukohde,
  ValintatapajonoSijoitteluStatus,
  ValintatapajonoSijoitteluUpdate,
  ngTableParams,
  FilterService,
  $filter,
  HakuModel,
  AtaruApplications
) {
  'use strict'

  var model
  model = new (function () {
    this.hakukohdeOid = {}
    this.valinnanvaiheet = []
    this.errors = []

    this.refresh = function (hakukohdeOid, hakuOid) {
      model.valinnanvaiheet = []
      model.ilmanlaskentaa = []
      model.errors = []
      model.errors.length = 0
      model.hakukohdeOid = hakukohdeOid
      model.tarjoajaOid = ''
      model.hakeneet = []
      model.ilmanLaskentaaOids = []

      return $q
        .all([
          ValintaperusteetHakukohde.get({ hakukohdeoid: hakukohdeOid })
            .$promise,
          ValinnanvaiheListByHakukohde.get({ hakukohdeoid: hakukohdeOid })
            .$promise,
          ValinnanVaiheetIlmanLaskentaa.get({ hakukohdeoid: hakukohdeOid })
            .$promise,
        ])
        .then(function (data) {
          data[2].forEach(function (vv) {
            vv.jonot = vv.jonot.filter(function (jono) {
              return jono.aktiivinen
            })
          })
          model.tarjoajaOid = data[0].tarjoajaOid
          model.valinnanvaiheet = data[1]
          model.ilmanlaskentaa = data[2]
          if (model.ilmanlaskentaa.length > 0) {
            return model
              .loadHakijat(hakukohdeOid, hakuOid)
              .then(function (isAtaruHaku) {
                model.updateValinnanvaiheetPersonNames(isAtaruHaku)
                model.updateHakijatNames(isAtaruHaku)
                model.createTulosjonot(hakuOid, isAtaruHaku)
              })
          } else {
            return model
              .loadHakijat(hakukohdeOid, hakuOid)
              .then(function (isAtaruHaku) {
                model.updateValinnanvaiheetPersonNames(isAtaruHaku)
              })
          }
        })
        .then(model.renderTulokset)
        .catch(function (error) {
          model.errors.push(error)
          return $q.reject('hakukohteen tietojen hakeminen epäonnistui')
        })
    }

    this.updateValinnanvaiheetPersonNames = function (isAtaruHaku) {
      model.valinnanvaiheet.forEach(function (vaihe) {
        vaihe.valintatapajonot.forEach(function (jono) {
          jono.jonosijat.forEach(function (jonosija) {
            var hakemus = model.hakeneet.filter(function (hakemus) {
              return hakemus.oid === jonosija.hakemusOid
            })[0]
            if (hakemus) {
              jonosija.etunimi = isAtaruHaku
                ? hakemus.etunimet
                : hakemus.answers.henkilotiedot.Etunimet
              jonosija.sukunimi = isAtaruHaku
                ? hakemus.sukunimi
                : hakemus.answers.henkilotiedot.Sukunimi
            } else {
              console.log(
                'No hakemus found for hakijaOid: ' +
                  jonosija.hakijaOid +
                  ', hakemusOid: ' +
                  jonosija.hakemusOid
              )
            }
          })
        })
      })
    }

    this.updateHakijatNames = function (isAtaruHaku) {
      model.hakeneet.forEach(function (hakija) {
        hakija.etunimi = isAtaruHaku
          ? hakija.etunimet
          : hakija.answers.henkilotiedot.Etunimet
        hakija.sukunimi = isAtaruHaku
          ? hakija.sukunimi
          : hakija.answers.henkilotiedot.Sukunimi
      })
    }

    this.loadHakijat = function (hakukohdeOid, hakuOid) {
      return HakuModel.promise.then(function (hakuModel) {
        if (hakuModel.hakuOid.ataruLomakeAvain) {
          console.log('Getting applications from ataru.')
          return AtaruApplications.get({
            hakuOid: hakuOid,
            hakukohdeOid: hakukohdeOid,
          }).$promise.then(function (ataruHakemukset) {
            if (!ataruHakemukset.length)
              console.log("Couldn't find any applications in Ataru.")
            model.hakeneet = ataruHakemukset
            return true
          })
        } else {
          console.log('Getting applications from hakuApp.')
          return HakukohdeHenkilotFull.get({
            aoOid: hakukohdeOid,
            rows: 100000,
            asId: hakuOid,
          }).$promise.then(function (result) {
            if (!result.length)
              console.log("Couldn't find any applications in Hakuapp.")
            model.hakeneet = result
            return false
          })
        }
      })
    }

    this.createTulosjonot = function (hakuOid, isAtaruHaku) {
      model.ilmanlaskentaa.forEach(function (vaihe) {
        vaihe.valintatapajonot = []
        vaihe.hakuOid = hakuOid
        vaihe.jonot.forEach(function (jono) {
          var laskentaJono = _.chain(model.valinnanvaiheet)
            .filter(function (current) {
              return current.valinnanvaiheoid === vaihe.oid
            })
            .map(function (current) {
              return current.valintatapajonot
            })
            .first()
            .find(function (tulosjono) {
              return tulosjono.oid === jono.oid
            })
            .value()

          model.ilmanLaskentaaOids.push(jono.oid)
          var tulosjono = {}
          tulosjono.oid = jono.oid
          tulosjono.valintatapajonooid = jono.oid
          tulosjono.prioriteetti = jono.prioriteetti
          tulosjono.aloituspaikat = jono.aloituspaikat

          var valmisSijoitteluun
          if (laskentaJono) {
            if (_.isBoolean(laskentaJono.valmisSijoiteltavaksi)) {
              valmisSijoitteluun = laskentaJono.valmisSijoiteltavaksi
            } else {
              valmisSijoitteluun = false
            }
          } else {
            if (_.isBoolean(jono.automaattinenSijoitteluunSiirto)) {
              valmisSijoitteluun = jono.automaattinenSijoitteluunSiirto
            } else {
              valmisSijoitteluun = false
            }
          }

          if (
            _.isUndefined(laskentaJono) ||
            laskentaJono.kaytetaanKokonaispisteita === null
          ) {
            tulosjono.kaytetaanKokonaispisteita = false
          } else {
            tulosjono.kaytetaanKokonaispisteita =
              laskentaJono.kaytetaanKokonaispisteita
          }

          if (jono.siirretaanSijoitteluun === null) {
            tulosjono.siirretaanSijoitteluun = true
          } else {
            tulosjono.siirretaanSijoitteluun = jono.siirretaanSijoitteluun
          }

          tulosjono.valmisSijoiteltavaksi = valmisSijoitteluun

          if (jono.tasapistesaanto === null) {
            tulosjono.tasasijasaanto = 'ARVONTA'
          } else {
            tulosjono.tasasijasaanto = jono.tasapistesaanto
          }
          if (jono.eiVarasijatayttoa === null) {
            tulosjono.eiVarasijatayttoa = false
          } else {
            tulosjono.eiVarasijatayttoa = jono.eiVarasijatayttoa
          }
          if (jono.kaikkiEhdonTayttavatHyvaksytaan === null) {
            tulosjono.kaikkiEhdonTayttavatHyvaksytaan = false
          } else {
            tulosjono.kaikkiEhdonTayttavatHyvaksytaan =
              jono.kaikkiEhdonTayttavatHyvaksytaan
          }
          if (jono.poissaOlevaTaytto === null) {
            tulosjono.poissaOlevaTaytto = false
          } else {
            tulosjono.poissaOlevaTaytto = jono.poissaOlevaTaytto
          }
          if (jono.kaytetaanValintalaskentaa === null) {
            tulosjono.kaytetaanValintalaskentaa = true
          } else {
            tulosjono.kaytetaanValintalaskentaa = jono.kaytetaanValintalaskentaa
          }

          tulosjono.nimi = jono.nimi
          tulosjono.jonosijat = []

          var jonosijat = _.chain(model.valinnanvaiheet)
            .filter(function (current) {
              return current.valinnanvaiheoid === vaihe.oid
            })
            .map(function (current) {
              return current.valintatapajonot
            })
            .first()
            .filter(function (tulosjono) {
              return tulosjono.oid === jono.oid
            })
            .map(function (tulosjono) {
              return tulosjono.jonosijat
            })
            .first()
            .value()

          model.hakeneet.forEach(function (hakija) {
            var jonosija = _.findWhere(jonosijat, { hakemusOid: hakija.oid })
            if (jonosija) {
              var krit = jonosija.jarjestyskriteerit[0]
              if (krit.tila !== 'HYVAKSYTTAVISSA') {
                delete jonosija.kokonaispisteet
                delete jonosija.jonosija
              } else {
                if (tulosjono.kaytetaanKokonaispisteita) {
                  jonosija.kokonaispisteet = krit.arvo
                  delete jonosija.jonosija
                } else {
                  jonosija.jonosija = -krit.arvo
                  delete jonosija.kokonaispisteet
                }
              }
              tulosjono.jonosijat.push(jonosija)
            } else {
              jonosija = {}
              jonosija.hakemusOid = hakija.oid
              jonosija.hakijaOid = hakija.personOid
              jonosija.prioriteetti = isAtaruHaku
                ? model.ataruHakutoivePrioriteetti(hakija)
                : model.hakutoivePrioriteetti(hakija)
              jonosija.harkinnanvarainen = false
              jonosija.historiat = null
              jonosija.syotetytArvot = []
              jonosija.funktioTulokset = []
              jonosija.muokattu = false
              jonosija.sukunimi = isAtaruHaku
                ? hakija.sukunimi
                : hakija.answers.henkilotiedot.Sukunimi
              jonosija.etunimi = isAtaruHaku
                ? hakija.etunimi
                : hakija.answers.henkilotiedot.Etunimet
              jonosija.jarjestyskriteerit = [
                {
                  arvo: null,
                  tila: '',
                  kuvaus: {},
                  prioriteetti: 0,
                  nimi: '',
                },
              ]
              tulosjono.jonosijat.push(jonosija)
            }
          })

          tulosjono.tableParams = new ngTableParams(
            {
              page: 1, // show first page
              count: 50, // count per page
              filters: {
                sukunimi: '',
              },
              sorting: {
                jonosija: 'asc',
                kokonaispisteet: 'desc',
                sukunimi: 'asc',
              },
            },
            {
              total: tulosjono.jonosijat.length, // length of data
              getData: function ($defer, params) {
                var filters = FilterService.fixFilterWithNestedProperty(
                  params.filter()
                )

                if (tulosjono.kaytetaanKokonaispisteita) {
                  _.each(tulosjono.jonosijat, function (jonosija) {
                    if (_.isUndefined(jonosija.kokonaispisteet)) {
                      jonosija.kokonaispisteet = Number.MIN_VALUE
                    }
                  })
                }

                var orderedData = params.sorting()
                  ? $filter('orderBy')(tulosjono.jonosijat, params.orderBy())
                  : tulosjono.jonosijat
                orderedData = params.filter()
                  ? $filter('filter')(orderedData, filters)
                  : orderedData

                if (tulosjono.kaytetaanKokonaispisteita) {
                  _.each(tulosjono.jonosijat, function (jonosija) {
                    if (jonosija.kokonaispisteet === Number.MIN_VALUE) {
                      delete jonosija.kokonaispisteet
                    }
                  })
                }

                params.total(orderedData.length) // set total for recalc pagination
                $defer.resolve(
                  orderedData.slice(
                    (params.page() - 1) * params.count(),
                    params.page() * params.count()
                  )
                )
              },
            }
          )

          vaihe.valintatapajonot.push(tulosjono)
        })
      })

      model.valinnanvaiheet.forEach(function (vaihe, index) {
        vaihe.valintatapajonot = _.filter(vaihe.valintatapajonot, function (
          jono
        ) {
          return _.indexOf(model.ilmanLaskentaaOids, jono.oid) === -1
        })

        if (vaihe.valintatapajonot.length <= 0) {
          model.valinnanvaiheet.splice(index, 1)
        }
      })
    }

    this.ataruHakutoivePrioriteetti = function (hakija) {
      var index = hakija.hakutoiveet.findIndex(
        (h) => h.hakukohdeOid === model.hakukohdeOid
      )
      if (index < 0) {
        throw (
          'Hakemuksen ' +
          hakija.oid +
          ' hakutoiveista ei löytynyt hakukohdetta: ' +
          model.hakukohdeOid
        )
      }
      return index + 1
    }

    this.hakutoivePrioriteetti = function (hakija) {
      if (!hakija) {
        return -1
      }
      var toive = _.invert(hakija.answers.hakutoiveet)[model.hakukohdeOid]

      if (toive) {
        return parseInt(toive.substring(10, 11))
      } else {
        return -1
      }
    }

    this.renderTulokset = function () {
      model.valinnanvaiheet.forEach(function (vaihe, index) {
        vaihe.valintatapajonot.forEach(function (jono, i) {
          jono.tableParams = new ngTableParams(
            {
              page: 1, // show first page
              count: 50, // count per page
              filters: {
                sukunimi: '',
              },
              sorting: {
                jonosija: 'asc',
                kokonaispisteet: 'desc',
                sukunimi: 'asc',
              },
            },
            {
              total: jono.jonosijat.length, // length of data
              getData: function ($defer, params) {
                var filters = FilterService.fixFilterWithNestedProperty(
                  params.filter()
                )

                if (jono.kaytetaanKokonaispisteita) {
                  _.each(jono.jonosijat, function (jonosija) {
                    if (_.isUndefined(jonosija.kokonaispisteet)) {
                      jonosija.kokonaispisteet = Number.MIN_VALUE
                    }
                  })
                }

                var orderedData = params.sorting()
                  ? $filter('orderBy')(jono.jonosijat, params.orderBy())
                  : jono.jonosijat
                orderedData = params.filter()
                  ? $filter('filter')(orderedData, filters)
                  : orderedData

                if (jono.kaytetaanKokonaispisteita) {
                  _.each(jono.jonosijat, function (jonosija) {
                    if (jonosija.kokonaispisteet === Number.MIN_VALUE) {
                      delete jonosija.kokonaispisteet
                    }
                  })
                }

                params.total(orderedData.length) // set total for recalc pagination
                $defer.resolve(
                  orderedData.slice(
                    (params.page() - 1) * params.count(),
                    params.page() * params.count()
                  )
                )
              },
            }
          )
        })
      })
    }

    this.submit = function (vaiheoid, jonooid) {
      var vv = _.findWhere(model.ilmanlaskentaa, { oid: vaiheoid })
      if (vv) {
        var vaihe = {}
        angular.copy(vv, vaihe)
        angular.copy(vv.valintatapajonot, vaihe.valintatapajonot)
        vaihe.valinnanvaiheoid = vaihe.oid
        var yksijono = _.findWhere(vaihe.valintatapajonot, {
          valintatapajonooid: jonooid,
        })

        vaihe.valintatapajonot = [yksijono]
        // Suodatetaan pois hakemukset joille ei ole merkitty jonosijaa ja asetetaan pisteiksi jonosijan negaatio
        var suodatetutSijat = _.chain(yksijono.jonosijat)
          .filter(function (sija) {
            return !_.isUndefined(sija.tuloksenTila) && sija.tuloksenTila !== ''
          })
          .map(function (sija) {
            var isValidNumber = function (value) {
              return !_.isNaN(value) && _.isNumber(value)
            }
            var kaytetaanKokonaispisteita =
              vaihe.valintatapajonot[0].kaytetaanKokonaispisteita

            if (
              kaytetaanKokonaispisteita &&
              isValidNumber(sija.kokonaispisteet)
            ) {
              sija.jarjestyskriteerit[0].arvo = sija.kokonaispisteet
            } else if (
              !kaytetaanKokonaispisteita &&
              isValidNumber(sija.jonosija)
            ) {
              sija.jarjestyskriteerit[0].arvo = -sija.jonosija
            } else {
              delete sija.jarjestyskriteerit[0].arvo
            }

            if (_.isUndefined(sija.prioriteetti) || sija.prioriteetti === 0) {
              sija.prioriteetti = model.hakutoivePrioriteetti(sija.hakemusOid)
            }
            sija.jarjestyskriteerit[0].tila = sija.tuloksenTila
            return sija
          })
          .value()

        vaihe.valintatapajonot[0].jonosijat = suodatetutSijat

        ValinnanvaiheListByHakukohde.post(
          {
            hakukohdeoid: model.hakukohdeOid,
            tarjoajaOid: model.tarjoajaOid,
          },
          vaihe,
          function (result) {
            model.refresh($routeParams.hakukohdeOid, $routeParams.hakuOid)
            Ilmoitus.avaa(
              'Tallennus onnistui',
              'Valintatulosten tallennus onnistui.'
            )
          },
          function (error) {
            var errorMessage =
              error.status === 400
                ? error.data && error.data.error
                  ? error.data.error
                  : 'Tallennus epäonnistui, tarkista syöttämäsi arvot.'
                : 'Valintatulosten tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.'
            Ilmoitus.avaa(
              'Tallennus epäonnistui',
              errorMessage,
              IlmoitusTila.ERROR
            )
          }
        )
      }
    }

    this.muutaSijoittelunStatus = function (jono, status) {
      ValintatapajonoSijoitteluUpdate.post(
        { valintatapajonoOid: jono.oid, status: status },
        function (updatedJono) {
          if (updatedJono.prioriteetti === -1) {
            // A query for a single jono doesn't return a true prioriteetti value, but -1 as a placeholder, so let's re-set the vlaue
            updatedJono.prioriteetti = jono.prioriteetti
          }

          ValintatapajonoSijoitteluStatus.put(
            {
              valintatapajonoOid: jono.oid,
              status: status,
            },
            updatedJono,
            function () {
              status == 'true'
                ? (jono.valmisSijoiteltavaksi = true)
                : (jono.valmisSijoiteltavaksi = false)
              Ilmoitus.avaa('Tallennus onnistui', 'Tallennus onnistui.')
            },
            function () {
              Ilmoitus.avaa(
                'Tallennus epäonnistui',
                'Tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.',
                IlmoitusTila.ERROR
              )
            }
          )
        },
        function () {
          Ilmoitus.avaa(
            'Tallennus epäonnistui',
            'Tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.',
            IlmoitusTila.ERROR
          )
        }
      )
    }
  })()
  return model
})

angular.module('valintalaskenta').controller('ValintalaskentatulosController', [
  '$scope',
  '$location',
  '$routeParams',
  '$timeout',
  '$upload',
  '$filter',
  'Ilmoitus',
  'IlmoitusTila',
  'Latausikkuna',
  'ValintatapajonoVienti',
  'ValintalaskentatulosModel',
  'TulosXls',
  'HakukohdeModel',
  'HakuModel',
  '$http',
  '$log',
  '$modal',
  'AuthService',
  'UserModel',
  'LocalisationService',
  function (
    $scope,
    $location,
    $routeParams,
    $timeout,
    $upload,
    $filter,
    Ilmoitus,
    IlmoitusTila,
    Latausikkuna,
    ValintatapajonoVienti,
    ValintalaskentatulosModel,
    TulosXls,
    HakukohdeModel,
    HakuModel,
    $http,
    $log,
    $modal,
    AuthService,
    UserModel,
    LocalisationService
  ) {
    'use strict'

    $scope.hakukohdeOid = $routeParams.hakukohdeOid
    $scope.hakuOid = $routeParams.hakuOid
    $scope.url = window.url
    $scope.model = ValintalaskentatulosModel
    $scope.hakukohdeModel = HakukohdeModel
    $scope.reviewUrlKey = 'haku-app.virkailija.hakemus.esikatselu'

    HakuModel.refreshIfNeeded($scope.hakuOid).then(function (hakuModel) {
      $scope.reviewUrlKey = hakuModel.hakuOid.ataruLomakeAvain
        ? 'ataru.application.review'
        : 'haku-app.virkailija.hakemus.esikatselu'
    })

    var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded(
      $routeParams.hakukohdeOid
    )

    var promise = $scope.model.refresh($scope.hakukohdeOid, $scope.hakuOid)

    promise.then(function () {
      $scope.isKkHaku = HakuModel.korkeakoulu
      $scope.erityisopetus = HakuModel.hakuOid.erityisopetus
      AuthService.crudOph('APP_VALINTOJENTOTEUTTAMINEN').then(function () {
        $scope.updateOph = true
        $scope.jkmuokkaus = true
      })
    })

    hakukohdeModelpromise.then(function () {
      AuthService.crudOrg(
        'APP_VALINTOJENTOTEUTTAMINEN',
        HakukohdeModel.organisationOidsForAuthorisation
      ).then(function () {
        $scope.crudOrg = true
        $scope.jkmuokkaus = true
      })
    })

    $scope.valintatapajonoVientiXlsx = function (valintatapajonoOid) {
      ValintatapajonoVienti.vie(
        {
          valintatapajonoOid: valintatapajonoOid,
          hakukohdeOid: $scope.hakukohdeOid,
          hakuOid: $routeParams.hakuOid,
          tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
        },
        {},
        function (id) {
          Latausikkuna.avaa(
            id,
            'Valintatapajonon vienti taulukkolaskentaan',
            ''
          )
        },
        function () {
          Ilmoitus.avaa(
            'Valintatapajonon vienti epäonnistui! Ota yhteys ylläpitoon.',
            IlmoitusTila.ERROR
          )
        }
      )
    }

    $scope.valintatapajonoTuontiXlsx = function (valintatapajonoOid, $files) {
      var file = $files[0]
      var fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      var hakukohdeOid = $scope.hakukohdeOid
      var hakuOid = $routeParams.hakuOid
      var tarjoajaOid = $scope.hakukohdeModel.hakukohde.tarjoajaOids[0]
      fileReader.onload = function (e) {
        $scope.upload = $upload
          .http({
            url: window.url(
              'valintalaskentakoostepalvelu.valintatapajonolaskenta.tuonti',
              {
                tarjoajaOid: tarjoajaOid,
                hakuOid: hakuOid,
                hakukohdeOid: hakukohdeOid,
                valintatapajonoOid: valintatapajonoOid,
              }
            ),
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            data: e.target.result,
          })
          .progress(function (evt) {
            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          })
          .success(function (id, status, headers, config) {
            /*
                    Latausikkuna.avaaKustomoitu(id, "Valintatapajonon tuonti", "", "../common/modaalinen/tuontiikkuna.html",
                        function(dokumenttiId) {
                            // tee paivitys
                            $scope.model.refresh(hakukohdeOid, hakuOid);
                        }
                    );
                    */
            var valintatulostentuonti = $modal.open({
              backdrop: 'static',
              templateUrl: '../common/modaalinen/dokumenttiseurantaikkuna.html',
              controller: DokumenttiSeurantaIkkunaCtrl,
              size: 'lg',
              resolve: {
                oids: function () {
                  return {
                    hakuOid: $routeParams.hakuOid,
                    tyyppi: 'HAKUKOHDE',
                    hakukohteet: [$routeParams.hakukohdeOid],
                    id: id,
                    kaynnista: function () {
                      $log.info('Käynnistetään')
                    },
                    ok: function () {
                      $scope.model.refresh(hakukohdeOid, hakuOid)
                    },
                  }
                },
              },
            })
          })
          .error(function (data) {
            //error
            Ilmoitus.avaa(
              'Tuonti epäonnistui',
              'Valintatulosten tuonti epäonnistui. ' +
                $filter('json')(data) +
                '. Ole hyvä ja yritä hetken päästä uudelleen.',
              IlmoitusTila.ERROR
            )
          })
      }
    }

    $scope.jonoLength = function (length) {
      return LocalisationService.tl('valintalaskentatulos.jonosija')
        ? LocalisationService.tl('valintalaskentatulos.jonosija') +
            ' (' +
            length +
            ')'
        : 'Jonosija' + ' (' + length + ')'
    }

    $scope.valintalaskentaTulosXLS = function () {
      TulosXls.query({ hakukohdeOid: $routeParams.hakukohdeOid })
    }

    $scope.showHistory = function (valintatapajonoOid, hakemusOid) {
      $location.path(
        '/valintatapajono/' +
          valintatapajonoOid +
          '/hakemus/' +
          hakemusOid +
          '/valintalaskentahistoria'
      )
    }

    $scope.showTilaPartial = function (valintatulos) {
      if (
        valintatulos.showTilaPartial === null ||
        valintatulos.showTilaPartial === false
      ) {
        valintatulos.showTilaPartial = true
      } else {
        valintatulos.showTilaPartial = false
      }
    }
    $scope.showHenkiloPartial = function (valintatulos) {
      if (
        valintatulos.showHenkiloPartial === null ||
        valintatulos.showHenkiloPartial === false
      ) {
        valintatulos.showHenkiloPartial = true
      } else {
        valintatulos.showHenkiloPartial = false
      }
    }

    $scope.jonoIsEmpty = function (jono) {
      if (!jono.jonosijat) {
        return true
      }
      return jono.jonosijat.length < 1
    }

    $scope.submit = function (vaiheoid, jonooid) {
      ValintalaskentatulosModel.submit(vaiheoid, jonooid)
    }

    $scope.muutaSijoittelunStatus = function (jono, tila) {
      $modal.open({
        backdrop: 'static',
        templateUrl: '../common/modaalinen/sijoitteluunsiirto.html',
        size: 'lg',
        controller: function ($scope, $window, $modalInstance) {
          $scope.jonoKuvaus = jono.oid + ' (' + jono.nimi + ')'
          $scope.uusiTila = tila
          $scope.jono = jono
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel')
          }
          $scope.isLisays = function () {
            return $scope.uusiTila === 'true'
          }
          $scope.muutaStatus = function (jono, tila) {
            ValintalaskentatulosModel.muutaSijoittelunStatus(jono, tila)
            $modalInstance.dismiss('ok')
          }
        },
        resolve: {},
      })
    }

    $scope.changeTila = function (jonosija, value) {
      if (_.isNumber(value)) {
        $timeout(function () {
          jonosija.tuloksenTila = 'HYVAKSYTTAVISSA'
        })
      } else {
        $timeout(function () {
          jonosija.tuloksenTila = ''
          delete jonosija.jonosija
          delete jonosija.kokonaispisteet
        })
      }
    }

    $scope.changeSija = function (jonosija, value) {
      if (value !== 'HYVAKSYTTAVISSA') {
        $timeout(function () {
          delete jonosija.jonosija
          delete jonosija.kokonaispisteet
        })
      }
    }

    $scope.changeKaytetaanKokonaispisteita = function (jono) {
      var ok = function () {
        _.each(jono.jonosijat, function (jonosija) {
          jonosija.tuloksenTila = ''
          if (jono.kaytetaanKokonaispisteita) {
            delete jonosija.jonosija
          } else {
            delete jonosija.kokonaispisteet
          }
        })
      }
      var cancel = function () {
        jono.kaytetaanKokonaispisteita = !jono.kaytetaanKokonaispisteita
      }
      if (jono.kaytetaanKokonaispisteita) {
        Ilmoitus.avaaCancel(
          'Käytetään kokonaispisteitä',
          'Jos siirryt käyttämään kokonaispisteitä, jonosijat poistetaan.',
          IlmoitusTila.INFO,
          ok,
          cancel
        )
      } else {
        Ilmoitus.avaaCancel(
          'Käytetään kokonaispisteitä',
          'Jos siirryt käyttämään jonosijoja, kokonaispisteet poistetaan.',
          IlmoitusTila.INFO,
          ok,
          cancel
        )
      }
    }
  },
])
