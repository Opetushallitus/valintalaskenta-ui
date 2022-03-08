angular
  .module('valintalaskenta')

  .factory('HarkinnanvaraisetModel', [
    '$log',
    '_',
    'HakukohdeHenkilotFull',
    'Ilmoitus',
    'Hakemus',
    'HarkinnanvarainenHyvaksynta',
    'HarkinnanvaraisestiHyvaksytyt',
    'IlmoitusTila',
    '$q',
    function (
      $log,
      _,
      HakukohdeHenkilotFull,
      Ilmoitus,
      Hakemus,
      HarkinnanvarainenHyvaksynta,
      HarkinnanvaraisestiHyvaksytyt,
      IlmoitusTila,
      $q
    ) {
      'use strict'
      var model
      model = new (function () {
        this.valittu = true
        this.hakeneet = []
        this.avaimet = []
        this.errors = []

        this.refresh = function (hakukohdeOid, hakuOid) {
          model.valittu = true
          model.hakeneet = []
          model.errors = []
          model.errors.length = 0
          model.hakuOid = hakuOid
          model.hakukohdeOid = hakukohdeOid
          this.loaded = $q.defer()

          HakukohdeHenkilotFull.get(
            { aoOid: hakukohdeOid, rows: 100000, asId: hakuOid },
            function (result) {
              model.hakeneet = []
              if (result) {
                result.forEach(function (hakija) {
                  hakija.valittu = true

                  for (var i = 0; i < 10; i++) {
                    var oid =
                      hakija.answers.hakutoiveet[
                        'preference' + i + '-Koulutus-id'
                      ]
                    if (oid === model.hakukohdeOid) {
                      var harkinnanvarainen =
                        hakija.answers.hakutoiveet[
                          'preference' + i + '-discretionary'
                        ]
                      var discretionary =
                        hakija.answers.hakutoiveet[
                          'preference' + i + '-Harkinnanvarainen'
                        ] // this should be removed at some point
                      hakija.hakenutHarkinnanvaraisesti =
                        harkinnanvarainen || discretionary
                    }
                  }

                  if (hakija.hakenutHarkinnanvaraisesti == 'true') {
                    hakija.firstNames = hakija.answers.henkilotiedot.Etunimet
                    hakija.lastName = hakija.answers.henkilotiedot.Sukunimi
                    model.hakeneet.push(hakija)
                  }
                })
                HarkinnanvaraisestiHyvaksytyt.get(
                  { hakukohdeOid: hakukohdeOid, hakuOid: hakuOid },
                  function (result) {
                    _.forEach(result, function (harkinnanvarainen) {
                      var hakija = _.find(model.hakeneet, function (h) {
                        return h.oid == harkinnanvarainen.hakemusOid
                      })
                      if (hakija) {
                        hakija.muokattuHarkinnanvaraisuusTila =
                          harkinnanvarainen.harkinnanvaraisuusTila
                        hakija.harkinnanvaraisuusTila =
                          harkinnanvarainen.harkinnanvaraisuusTila
                      }
                    })

                    model.loaded.resolve()
                  },
                  function (error) {
                    model.errors.push(error)
                  }
                )
              }
            },
            function (error) {
              model.errors.push(error)
            }
          )
        }

        this.submit = function () {
          var muokatutHakemukset = _.filter(model.hakeneet, function (hakemus) {
            return (
              hakemus.muokattuHarkinnanvaraisuusTila !==
              hakemus.harkinnanvaraisuusTila
            )
          })
          var postParams = _.map(muokatutHakemukset, function (hakemus) {
            return {
              hakuOid: model.hakuOid,
              hakukohdeOid: model.hakukohdeOid,
              hakemusOid: hakemus.oid,
              harkinnanvaraisuusTila: hakemus.muokattuHarkinnanvaraisuusTila,
            }
          })
          HarkinnanvarainenHyvaksynta.post(
            {},
            postParams,
            function (result) {
              Ilmoitus.avaa(
                'Harkinnanvaraisesti hyväksyttyjen tallennus',
                'Muutokset on tallennettu.'
              )
            },
            function () {
              Ilmoitus.avaa(
                'Harkinnanvaraisesti hyväksyttyjen tallennus',
                'Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.',
                IlmoitusTila.ERROR
              )
            }
          )
        }
        this.refreshIfNeeded = function (hakukohdeOid, hakuOid) {
          if (hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
            model.refresh(hakukohdeOid, hakuOid)
          }
        }
      })()

      return model
    },
  ])

  .factory('HarkinnanvaraisetAtaruModel', [
    '$log',
    '_',
    'AtaruApplications',
    'Ilmoitus',
    'Hakemus',
    'HarkinnanvaraisetHakemukset',
    'HarkinnanvarainenHyvaksynta',
    'HarkinnanvaraisestiHyvaksytyt',
    'IlmoitusTila',
    '$q',
    function (
      $log,
      _,
      AtaruApplications,
      Ilmoitus,
      Hakemus,
      HarkinnanvaraisetHakemukset,
      HarkinnanvarainenHyvaksynta,
      HarkinnanvaraisestiHyvaksytyt,
      IlmoitusTila,
      $q
    ) {
      'use strict'
      var model
      model = new (function () {
        this.valittu = true
        this.hakeneet = []
        this.avaimet = []
        this.errors = []

        this.refresh = function (hakukohdeOid, hakuOid) {
          model.valittu = true
          model.hakeneet = []
          model.errors = []
          model.errors.length = 0
          model.hakuOid = hakuOid
          model.hakukohdeOid = hakukohdeOid
          this.loaded = $q.defer()

          AtaruApplications.get({
            hakuOid: hakuOid,
            hakukohdeOid: hakukohdeOid,
          }).$promise.then(
            function (ataruHakemukset) {
              if (!ataruHakemukset.length)
                console.log("Couldn't find any applications in Ataru.")
              var result = ataruHakemukset.map(function (hakemus) {
                //hakemus.personOid = hakemus.henkiloOid;
                hakemus.henkiloOid = hakemus.personOid
                return hakemus
              })
              model.hakeneet = []

              if (result) {
                var applicationOids = result.map(function (hakemus) {
                  return hakemus.oid
                })
                HarkinnanvaraisetHakemukset.post(
                  {},
                  applicationOids
                ).$promise.then(
                  function (data) {
                    model.hakeneet = data
                      .map(function (harkinnanvaraisuus) {
                        var matchingapp = result.find(function (application) {
                          application.oid = harkinnanvaraisuus.hakemusOid
                        })
                        var syy = harkinnanvaraisuus.hakutoiveet.find(function (
                          hakutoive
                        ) {
                          return hakutoive.hakukohdeOid === model.hakukohdeOid
                        }).harkinnanvaraisuudenSyy
                        matchingApp.hakenutHarkinnanvaraisesti =
                          syy !== 'EI_HARKINNANVARAINEN'
                        matchingApp.harkinnanvaraisuudenSyy = syy
                      })
                      .filter(function (application) {
                        return matchingApp.hakenutHarkinnanvaraisesti
                      })
                  },
                  function (error) {
                    model.errors.push(error)
                  }
                )
              }
            },
            function (error) {
              model.errors.push(error)
            }
          )
        }

        this.submit = function () {
          var muokatutHakemukset = _.filter(model.hakeneet, function (hakemus) {
            return (
              hakemus.muokattuHarkinnanvaraisuusTila !==
              hakemus.harkinnanvaraisuusTila
            )
          })
          var postParams = _.map(muokatutHakemukset, function (hakemus) {
            return {
              hakuOid: model.hakuOid,
              hakukohdeOid: model.hakukohdeOid,
              hakemusOid: hakemus.oid,
              harkinnanvaraisuusTila: hakemus.muokattuHarkinnanvaraisuusTila,
            }
          })
          HarkinnanvarainenHyvaksynta.post(
            {},
            postParams,
            function (result) {
              Ilmoitus.avaa(
                'Harkinnanvaraisesti hyväksyttyjen tallennus',
                'Muutokset on tallennettu.'
              )
            },
            function () {
              Ilmoitus.avaa(
                'Harkinnanvaraisesti hyväksyttyjen tallennus',
                'Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.',
                IlmoitusTila.ERROR
              )
            }
          )
        }
        this.refreshIfNeeded = function (hakukohdeOid, hakuOid) {
          if (hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
            model.refresh(hakukohdeOid, hakuOid)
          }
        }
      })()

      return model
    },
  ])

  .controller('HarkinnanvaraisetController', [
    '$scope',
    '$location',
    '$log',
    '$routeParams',
    'Ilmoitus',
    'IlmoitusTila',
    'Latausikkuna',
    'Koekutsukirjeet',
    'OsoitetarratHakemuksille',
    'HarkinnanvaraisetModel',
    'HarkinnanvaraisetAtaruModel',
    'HakuModel',
    'HakukohdeModel',
    'Pohjakoulutukset',
    'ngTableParams',
    '$filter',
    'FilterService',
    'ParametriService',
    function (
      $scope,
      $location,
      $log,
      $routeParams,
      Ilmoitus,
      IlmoitusTila,
      Latausikkuna,
      Koekutsukirjeet,
      OsoitetarratHakemuksille,
      HarkinnanvaraisetModel,
      HarkinnanvaraisetAtaruModel,
      HakuModel,
      HakukohdeModel,
      Pohjakoulutukset,
      ngTableParams,
      $filter,
      FilterService,
      ParametriService
    ) {
      'use strict'

      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.hakuOid = $routeParams.hakuOid

      $scope.url = window.url
      $scope.hakukohdeModel = HakukohdeModel
      $scope.arvoFilter = 'SYOTETTAVA_ARVO'
      $scope.muutettu = false
      $scope.reviewUrlKey = 'haku-app.virkailija.hakemus.esikatselu'

      HakuModel.refreshIfNeeded($scope.hakuOid).then(function (hakuModel) {
        $scope.reviewUrlKey = hakuModel.hakuOid.ataruLomakeAvain
          ? 'ataru.application.review'
          : 'haku-app.virkailija.hakemus.esikatselu'
        $scope.model = hakuModel.hakuOid.ataruLomakeAvain
          ? HarkinnanvaraisetAtaruModel
          : HarkinnanvaraisetModel
      })

      Pohjakoulutukset.query(function (result) {
        $scope.pohjakoulutukset = {}

        result.forEach(function (koodi) {
          const numero = koodi.koodiUri.split('_')[1]
          const nimi = metaInUserLang(koodi.metadata).nimi
          $scope.pohjakoulutukset[numero] = nimi
        })
      })

      function metaInUserLang(meta) {
        return (
          _.findWhere(meta, { kieli: $scope.userLang.toUpperCase() }) ||
          _.findWhere(meta, { kieli: 'FI' })
        )
      }

      ParametriService($routeParams.hakuOid).then(function (privileges) {
        $scope.inputdisabled = !privileges['harkinnanvarainenpaatostallennus']
      })

      HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid)

      HarkinnanvaraisetModel.refreshIfNeeded(
        $scope.hakukohdeOid,
        $routeParams.hakuOid
      )

      $scope.promise = $scope.model.loaded.promise

      $scope.submit = function () {
        $scope.model.submit()
      }

      $scope.muodostaOsoitetarrat = function () {
        OsoitetarratHakemuksille.post(
          {},
          {
            tag: 'harkinnanvaraiset',
            hakemusOids: valitutHakemusOids(),
          },
          function (id) {
            Latausikkuna.avaa(
              id,
              'Osoitetarrat valituille harkinnanvaraisille',
              ''
            )
          }
        )
      }

      $scope.tinymceOptions = {
        handle_event_callback: function (e) {},
      }

      function isBlank(str) {
        return !str || /^\s*$/.test(str)
      }

      $scope.muodostaKoekutsut = function () {
        var letterBodyText = $scope.tinymceModel
        if (!isBlank(letterBodyText)) {
          var hakukohde = $scope.hakukohdeModel.hakukohde
          Koekutsukirjeet.post(
            {
              hakuOid: $routeParams.hakuOid,
              hakukohdeOid: $routeParams.hakukohdeOid,
              tarjoajaOid: hakukohde.tarjoajaOids[0],
              templateName: 'koekutsukirje',
              valintakoeTunnisteet: null,
            },
            {
              tag: 'harkinnanvaraiset',
              hakemusOids: valitutHakemusOids(),
              letterBodyText: letterBodyText,
            },
            function (id) {
              Latausikkuna.avaa(
                id,
                'Koekutsukirjeet valituille harkinnanvaraisille',
                ''
              )
            },
            function () {}
          )
        } else {
          Ilmoitus.avaa(
            'Koekutsuja ei voida muodostaa!',
            'Koekutsuja ei voida muodostaa, ennen kuin kutsun sisältö on annettu. Kirjoita kutsun sisältö ensin yllä olevaan kenttään.',
            IlmoitusTila.WARNING
          )
        }
      }

      $scope.tableParams = new ngTableParams(
        {
          page: 1, // show first page
          count: 50, // count per page
          filters: {
            lastName: '',
          },
          sorting: {
            lastName: 'asc', // initial sorting
          },
        },
        {
          total: $scope.model.hakeneet.length, // length of data
          getData: function ($defer, params) {
            $scope.promise.then(function (result) {
              var filters = FilterService.fixFilterWithNestedProperty(
                params.filter()
              )

              var orderedData = params.sorting()
                ? $filter('orderBy')($scope.model.hakeneet, params.orderBy())
                : $scope.model.hakeneet
              orderedData = params.filter()
                ? $filter('filter')(orderedData, filters)
                : orderedData

              params.total(orderedData.length) // set total for recalc pagination
              $defer.resolve(
                orderedData.slice(
                  (params.page() - 1) * params.count(),
                  params.page() * params.count()
                )
              )
            })
          },
        }
      )

      function valitutHakemusOids() {
        var oids = []
        angular.forEach($scope.model.hakeneet, function (item) {
          if (angular.isDefined(item.oid)) {
            if ($scope.checkboxes.items[item.oid]) {
              oids.push(item.oid)
            }
          }
        })
        return oids
      }

      $scope.checkboxes = { checked: false, items: {} }

      // watch for check all checkbox
      $scope.$watch('checkboxes.checked', function (value) {
        angular.forEach($scope.model.hakeneet, function (item) {
          if (angular.isDefined(item.oid)) {
            $scope.checkboxes.items[item.oid] = value
          }
        })
      })

      // watch for data checkboxes
      $scope.$watch(
        'checkboxes.items',
        function (values) {
          if (!$scope.model.hakeneet) {
            return
          }
          var checked = 0,
            unchecked = 0,
            total = $scope.model.hakeneet.length
          if (total === 0) return
          angular.forEach($scope.model.hakeneet, function (item) {
            checked += $scope.checkboxes.items[item.oid] || 0
            unchecked += !$scope.checkboxes.items[item.oid] || 0
          })
          if (unchecked == 0 || checked == 0) {
            $scope.checkboxes.checked = checked == total
          }
          // grayed checkbox
          angular
            .element(document.getElementById('select_all'))
            .prop('indeterminate', checked != 0 && unchecked != 0)
        },
        true
      )
    },
  ])
