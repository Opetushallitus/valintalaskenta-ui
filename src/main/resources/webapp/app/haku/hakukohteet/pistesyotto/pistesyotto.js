var app = angular.module('valintalaskenta')
app.factory('PistesyottoModel', function (
  $q,
  $window,
  HakukohdeHenkilotFull,
  AtaruApplications,
  HakukohdeAvaimet,
  KoostettuHakemusAdditionalData,
  Valintakoetulokset,
  Ilmoitus,
  IlmoitusTila,
  HakukohdeAvainTyyppiService,
  _,
  R,
  HakuModel
) {
  'use strict'

  var model
  model = new (function () {
    this.hakeneet = []
    this.avaimet = []
    this.errors = []
    this.filter = 'OSALLISTUU'
    this.tunnisteet = []
    this.laskentaonly = true
    this.hakeneetIsLoaded = false

    this.refresh = function (hakukohdeOid, hakuOid) {
      model.hakeneet.length = 0
      model.avaimet.length = 0
      model.errors.length = 0
      model.hakukohdeOid = hakukohdeOid
      model.hakuOid = hakuOid
      model.tunnisteet.length = 0
      model.hakeneetIsLoaded = false

      $q.all([
        HakukohdeAvaimet.get({ hakukohdeOid: hakukohdeOid }).$promise,
        KoostettuHakemusAdditionalData.get({
          hakuOid: hakuOid,
          hakukohdeOid: hakukohdeOid,
        }),
      ]).then(
        function (results) {
          model.avaimet = results[0]
          HakukohdeAvainTyyppiService.createAvainTyyppiValues(
            model.avaimet,
            model.tunnisteet
          )
          model.lastmodified = results[1].lastmodified
          HakuModel.promise
            .then(function (hakuModel) {
              if (hakuModel.hakuOid.ataruLomakeAvain) {
                console.log('Getting applications from ataru.')
                return AtaruApplications.get({
                  hakuOid: hakuOid,
                  hakukohdeOid: hakukohdeOid,
                }).$promise.then(function (ataruHakemukset) {
                  if (!ataruHakemukset.length)
                    console.log("Couldn't find any applications in Ataru.")
                  return ataruHakemukset
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
                  return result
                })
              }
            })
            .then(function (hakemukset) {
              model.hakeneet = results[1].valintapisteet.map(function (
                pistetieto
              ) {
                var h = pistetieto.applicationAdditionalDataDTO
                var hakemus = hakemukset.filter(function (hakemus) {
                  return hakemus.personOid === h.personOid
                })[0]
                h.firstNames = hakemus.etunimet
                  ? hakemus.etunimet
                  : hakemus.answers.henkilotiedot.Etunimet
                h.lastName = hakemus.sukunimi
                  ? hakemus.sukunimi
                  : hakemus.answers.henkilotiedot.Sukunimi
                h.personOid = hakemus.personOid
                h.filterData = {}
                if (
                  pistetieto.hakukohteidenOsallistumistiedot &&
                  pistetieto.hakukohteidenOsallistumistiedot[hakukohdeOid] &&
                  pistetieto.hakukohteidenOsallistumistiedot[hakukohdeOid]
                    .valintakokeidenOsallistumistiedot
                ) {
                  h.osallistuu =
                    pistetieto.hakukohteidenOsallistumistiedot[
                      hakukohdeOid
                    ].valintakokeidenOsallistumistiedot
                } else {
                  h.osallistuu = {}
                }
                model.avaimet.forEach(function (avain) {
                  if (
                    h.osallistuu[avain.tunniste] &&
                    h.osallistuu[avain.tunniste].osallistumistieto !==
                      'EI_KUTSUTTU'
                  ) {
                    h.filterData[avain.tunniste] =
                      h.additionalData[avain.tunniste]
                    h.filterData[avain.osallistuminenTunniste] =
                      h.additionalData[avain.osallistuminenTunniste]
                  }
                })
                return h
              })
              model.hakeneetIsLoaded = true
            })
        },
        function (error) {
          model.errors.push(error)
        }
      )
    }

    this.refreshIfNeeded = function (hakukohdeOid, hakuOid) {
      if (hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
        model.refresh(hakukohdeOid, hakuOid)
      }
    }

    var blockSubmit = false
    this.submit = function () {
      if (!blockSubmit) {
        blockSubmit = true
        // haku-app ei halua ylimääräistä tietoa
        var hakeneet = R.filter(function (h) {
          return h.muuttunut
        }, angular.copy(model.hakeneet))
        hakeneet.forEach(function (hakija) {
          // Filteröidään pois arvot, joita ei voi syöttää, koska haku-app mergaa
          model.avaimet.forEach(function (avain) {
            if (
              !(
                hakija.osallistuu[avain.tunniste] &&
                hakija.osallistuu[avain.tunniste].osallistumistieto ===
                  'OSALLISTUI'
              )
            ) {
              delete hakija.additionalData[avain.tunniste]
              delete hakija.additionalData[avain.osallistuminenTunniste]
            }
          })
          var keys = _.keys(hakija.additionalData)
          keys.forEach(function (tunniste) {
            if (!_.contains(model.tunnisteet, tunniste)) {
              delete hakija.additionalData[tunniste]
            }
          })
          delete hakija.filterData
          delete hakija.osallistuu
        })
        KoostettuHakemusAdditionalData.put(
          { hakuOid: model.hakuOid, hakukohdeOid: model.hakukohdeOid },
          { lastmodified: model.lastmodified, hakeneet: hakeneet }
        ).then(
          function (success) {
            var callback = function () {
              $window.location.reload()
            }
            if (R.isEmpty(success.data)) {
              var ilmoitusteksti = 'Pisteiden tallennus onnistui.'
              Ilmoitus.avaa(
                'Tallennus onnistui',
                ilmoitusteksti,
                IlmoitusTila.INFO,
                callback
              )
            } else {
              var ilmoitusteksti =
                'Pisteet tallennettu osittain. Seuraavilla hakemuksilla oli uudempia pistetietoja:'
              var rows = success.data.map(function (dto) {
                return dto.applicantName + ' ' + dto.applicationOID
              })
              Ilmoitus.avaa(
                'Tallennus onnistui',
                ilmoitusteksti,
                IlmoitusTila.WARNING,
                callback,
                rows
              )
            }
            blockSubmit = false
          },
          function (error) {
            Ilmoitus.avaa(
              'Tallennus epäonnistui',
              'Pisteiden tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.',
              IlmoitusTila.ERROR,
              function () {
                $window.location.reload()
              }
            )
            console.log(error)
            blockSubmit = false
          }
        )
      }
    }

    this.updateFilterData = function () {
      model.hakeneet.forEach(function (hakija) {
        angular.copy(hakija.additionalData, hakija.filterData)
      })
    }
  })()

  return model
})

angular.module('valintalaskenta').controller('PistesyottoController', [
  'R',
  '$scope',
  '$window',
  '$log',
  '$timeout',
  '$routeParams',
  '$upload',
  'PistesyottoVienti',
  'PistesyottoModel',
  'Ilmoitus',
  'IlmoitusTila',
  'Latausikkuna',
  'HakuModel',
  'HakukohdeModel',
  'ParametriService',
  function (
    R,
    $scope,
    $window,
    $log,
    $timeout,
    $routeParams,
    $upload,
    PistesyottoVienti,
    PistesyottoModel,
    Ilmoitus,
    IlmoitusTila,
    Latausikkuna,
    HakuModel,
    HakukohdeModel,
    ParametriService
  ) {
    'use strict'

    $scope.hakukohdeOid = $routeParams.hakukohdeOid
    $scope.model = PistesyottoModel
    $scope.hakuOid = $routeParams.hakuOid

    $scope.url = window.url
    $scope.hakukohdeModel = HakukohdeModel
    $scope.koeFilter = null
    $scope.hakijaFilter = ''
    $scope.osallistuminenFilter = ''
    $scope.pageSize = 50
    $scope.currentPage = 1
    $scope.muutettu = false
    $scope.reviewUrlKey = 'haku-app.virkailija.hakemus.esikatselu'

    HakuModel.refreshIfNeeded($scope.hakuOid).then(function (hakuModel) {
      $scope.reviewUrlKey = hakuModel.hakuOid.ataruLomakeAvain
        ? 'ataru.application.review'
        : 'haku-app.virkailija.hakemus.esikatselu'
    })
    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid)
    PistesyottoModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid)

    $scope.predicate = ['lastName', 'firstNames']

    $scope.submit = function () {
      PistesyottoModel.submit()
    }

    ParametriService($routeParams.hakuOid).then(function (privileges) {
      $scope.inputdisabled = !privileges['koetulostentallennus']
    })

    $scope.pistesyottoTuontiXlsx = function ($files) {
      var file = $files[0]
      var fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      var hakukohdeOid = $scope.hakukohdeOid
      var hakuOid = $routeParams.hakuOid
      fileReader.onload = function (e) {
        $scope.upload = $upload
          .http({
            url: window.url('valintalaskentakoostepalvelu.pistesyotto.tuonti', {
              hakuOid: hakuOid,
              hakukohdeOid: hakukohdeOid,
            }),
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            data: e.target.result,
          })
          .progress(function (evt) {
            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          })
          .success(function (failedIds, status, headers, config) {
            if (status === 204) {
              //no content
              var otsikko = 'Pistetietojen tuonti onnistui'
              var ilmoitus = 'Pistetietojen tuonti onnistui'
              var tila = IlmoitusTila.INFO
              var callback = function () {
                $window.location.reload()
              }
              Ilmoitus.avaa(otsikko, ilmoitus, tila, callback)
            } else {
              var otsikko =
                'Pisteet tallennettu osittain. Seuraavilla hakemuksilla oli uudempia pistetietoja'
              var ilmoitus =
                'Pisteet tallennettu osittain. Seuraavilla hakemuksilla oli uudempia pistetietoja'
              var tila = IlmoitusTila.WARNING
              var callback = function () {
                $window.location.reload()
              }
              var rows = failedIds.map(function (dto) {
                return dto.applicantName + ' ' + dto.applicationOID
              })
              Ilmoitus.avaa(otsikko, ilmoitus, tila, callback, rows)
            }
          })
          .error(function (data) {
            if (data) {
              console.error(data)
              var rows = data.map(function (dto) {
                return (
                  dto.applicantName +
                  ' ' +
                  dto.applicationOID +
                  ' : ' +
                  dto.errorMessage
                )
              })
              Ilmoitus.avaa(
                'Tallennus epäonnistui',
                'Pistetietojen tuonti epäonnistui. Tarkista syöte.',
                IlmoitusTila.ERROR,
                null,
                rows
              )
            } else {
              Ilmoitus.avaa(
                'Tallennus epäonnistui',
                'Pistetietojen tuonti epäonnistui. Ota yhteys ylläpitoon.',
                IlmoitusTila.ERROR,
                null,
                null
              )
            }
          })
      }
    }
    $scope.pistesyottoVientiXlsx = function () {
      PistesyottoVienti.vie(
        {
          hakukohdeOid: $scope.hakukohdeOid,
          hakuOid: $routeParams.hakuOid,
        },
        {},
        function (id) {
          Latausikkuna.avaa(
            id,
            'Pistesyöttötietojen vienti taulukkolaskentaan',
            ''
          )
        },
        function () {
          Ilmoitus.avaa(
            'Pistesyöttötietojen vienti epäonnistui! Ota yhteys ylläpitoon.',
            IlmoitusTila.ERROR
          )
        }
      )
    }

    $scope.showTiedotPartial = function (hakija) {
      hakija.showTiedotPartial = !hakija.showTiedotPartial
    }

    $scope.osallistuvatFilter = function (actual) {
      var show = false

      if ($scope.koeFilter === null) {
        PistesyottoModel.avaimet.forEach(function (avain) {
          if (
            actual.osallistuu[avain.tunniste] &&
            actual.osallistuu[avain.tunniste].osallistumistieto !==
              'EI_KUTSUTTU'
          ) {
            show = true
          }
        })
      } else if (
        $scope.koeFilter &&
        actual.osallistuu[$scope.koeFilter.tunniste] &&
        actual.osallistuu[$scope.koeFilter.tunniste].osallistumistieto !==
          'EI_KUTSUTTU'
      ) {
        show = true
      }

      if (show && $scope.osallistuminenFilter) {
        if ($scope.koeFilter === null) {
          show = false
          PistesyottoModel.avaimet.forEach(function (avain) {
            if (
              actual.osallistuu[avain.tunniste] &&
              actual.osallistuu[avain.tunniste].osallistumistieto !==
                'EI_KUTSUTTU' &&
              actual.filterData[avain.tunniste + '-OSALLISTUMINEN'] ===
                $scope.osallistuminenFilter
            ) {
              show = true
            }
          })
        } else if (
          actual.filterData &&
          actual.filterData[$scope.koeFilter.tunniste + '-OSALLISTUMINEN'] !==
            $scope.osallistuminenFilter
        ) {
          show = false
        }
      }

      return show
    }

    $scope.filteredResult = []

    $scope.updateFilteredResult = function () {
      $scope.filteredResult = $scope.$eval(
        'model.hakeneet | orderBy:predicate:reverse | filter:hakijaFilter | filter:osallistuvatFilter'
      )
    }

    $scope.$watch('model.hakeneetIsLoaded', function () {
      $scope.updateFilteredResult()
    })

    $scope.$watchGroup(
      ['hakijaFilter', 'koeFilter', 'osallistuminenFilter'],
      function () {
        $scope.updateFilteredResult()
      }
    )

    $scope.updateFilterData = function () {
      PistesyottoModel.updateFilterData()
    }

    $scope.arvonta = $routeParams.arvonta

    $scope.arvoPisteet = function () {
      PistesyottoModel.hakeneet.forEach(function (hakija) {
        PistesyottoModel.avaimet.forEach(function (avain) {
          if (hakija.osallistuu[avain.tunniste] === 'OSALLISTUU') {
            var min = parseFloat(avain.min, 0)
            var max = parseFloat(avain.max, 0)
            var random = Math.random() * (max - min) + min
            random = random.toFixed(1)

            hakija.additionalData[avain.tunniste] = '' + random
            hakija.additionalData[avain.tunniste + '-OSALLISTUMINEN'] =
              'OSALLISTUI'
          }
        })
      })
    }
  },
])
