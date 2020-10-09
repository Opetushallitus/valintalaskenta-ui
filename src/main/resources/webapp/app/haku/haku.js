angular
  .module('valintalaskenta')

  .factory('HakuModel', [
    '$q',
    '$log',
    'AuthService',
    'UserModel',
    'TarjontaHaut',
    'Korkeakoulu',
    '_',
    '$rootScope',
    function (
      $q,
      $log,
      AuthService,
      UserModel,
      TarjontaHaut,
      Korkeakoulu,
      _,
      $rootScope
    ) {
      'use strict'

      var model
      model = new (function () {
        this.deferred = $q.defer()
        this.promise = this.deferred.promise
        this.hakuOid = ''
        this.haut = []
        this.nivelvaihe = false
        this.korkeakoulu = false
        this.erillishaku = false

        this.getHakuNimi = function (haku) {
          var name = haku.nimi
          var lang = $rootScope.userLang || ''
          return (
            name['kieli_' + lang.toLowerCase()] ||
            name.kieli_fi ||
            name.kieli_sv ||
            name.kieli_en
          )
        }

        this.getNimi = function () {
          if (this.hakuOid.nimi.kieli_fi !== undefined) {
            return this.hakuOid.nimi.kieli_fi
          }
          if (this.hakuOid.nimi.kieli_sv !== undefined) {
            return this.hakuOid.nimi.kieli_sv
          }
          if (this.hakuOid.nimi.kieli_en !== undefined) {
            return this.hakuOid.nimi.kieli_en
          }
          return 'Nimetön hakukohde'
        }

        this.refreshIfNeeded = function (hakuOid) {
          if (
            _.isEmpty(model.deferred) ||
            (hakuOid !== undefined && model.hakuOid !== hakuOid)
          ) {
            return model.init(hakuOid)
          } else {
            return model.deferred.promise
          }
        }

        this.init = function (oid) {
          if (model.haut.length === 0 || oid !== model.hakuOid.oid) {
            $q.all({
              organizations: AuthService.getOrganizations(
                'APP_VALINTOJENTOTEUTTAMINEN',
                ['READ', 'READ_UPDATE', 'CRUD']
              ),
              userModel: UserModel.refreshIfNeeded(),
            }).then(
              function (o) {
                var virkailijaTyyppi
                if (
                  UserModel.isOphUser ||
                  (UserModel.hasOtherThanKKUserOrgs && UserModel.isKKUser)
                ) {
                  virkailijaTyyppi = 'all'
                } else if (
                  UserModel.isKKUser &&
                  !UserModel.hasOtherThanKKUserOrgs
                ) {
                  virkailijaTyyppi = 'kkUser'
                } else if (
                  !UserModel.isKKUser &&
                  UserModel.hasOtherThanKKUserOrgs
                ) {
                  virkailijaTyyppi = 'toinenAsteUser'
                } else {
                  virkailijaTyyppi = 'all'
                }

                var organizationOids = _.filter(o.organizations, function (o) {
                  return o.startsWith('1.2.246.562.10.')
                })

                TarjontaHaut.get(
                  {
                    virkailijaTyyppi: virkailijaTyyppi,
                    organizationOids: organizationOids,
                  },
                  function (haut) {
                    model.haut = haut
                    model.haut.forEach(function (haku) {
                      if (haku.oid === oid) {
                        model.hakuOid = haku
                        model.korkeakoulu = Korkeakoulu.isKorkeakoulu(
                          haku.kohdejoukkoUri
                        )
                      }

                      haku.uiNimi = model.getHakuNimi(haku)

                      var kohdejoukkoUri = haku.kohdejoukkoUri
                      var nivelKohdejoukkoUriRegExp = /(haunkohdejoukko_17).*/
                      var nivelvaihe = nivelKohdejoukkoUriRegExp.exec(
                        kohdejoukkoUri
                      )
                      nivelvaihe
                        ? (haku.nivelvaihe = true)
                        : (haku.nivelvaihe = false)

                      var erityisKohdejoukkoUriRegExp = /(haunkohdejoukko_20).*/
                      var erityis = erityisKohdejoukkoUriRegExp.exec(
                        kohdejoukkoUri
                      )
                      erityis
                        ? (haku.erityisopetus = true)
                        : (haku.erityisopetus = false)

                      var hakutyyppi = haku.hakutyyppiUri
                      var hakutapa = haku.hakutapaUri

                      var erillishakutapaRegExp = /(hakutapa_02).*/
                      var jatkuvahakuRegExp = /(hakutapa_03).*/
                      var lisahakutyyppiRegExp = /(hakutyyppi_03).*/

                      var matchErillishaku = erillishakutapaRegExp.exec(
                        hakutapa
                      )
                      var matchJatkuvahaku = jatkuvahakuRegExp.exec(hakutapa)
                      var matchLisahaku = lisahakutyyppiRegExp.exec(hakutyyppi)

                      ;(matchErillishaku ||
                        matchJatkuvahaku ||
                        matchLisahaku) &&
                      !haku.sijoittelu
                        ? (haku.erillishaku = true)
                        : (haku.erillishaku = false)
                    })
                    model.deferred.resolve(model)
                  },
                  function (error) {
                    model.deferred.reject('Hakulistan hakeminen epäonnistui')
                    $log.error(error)
                  }
                )
              },
              function (error) {
                model.deferred.reject(
                  'Käyttäjän tietojen lataaminen epäonnistui'
                )
                $log.error(error)
              }
            )
          }
          return model.deferred.promise
        }
      })()

      return model
    },
  ])

  .controller('HakuController', [
    '$log',
    '$scope',
    '$location',
    '$routeParams',
    'HakuModel',
    'ParametriService',
    'UserModel',
    'CustomHakuUtil',
    function (
      $log,
      $scope,
      $location,
      $routeParams,
      HakuModel,
      ParametriService,
      UserModel,
      CustomHakuUtil
    ) {
      'use strict'
      UserModel.refreshIfNeeded()
      $scope.customHakuUtil = CustomHakuUtil

      // done after UserModel refresh to ensure UserModel is available for HakuModel's internals
      $scope.hakumodel = HakuModel
      HakuModel.init($routeParams.hakuOid)

      CustomHakuUtil.refreshIfNeeded($routeParams.hakuOid)

      //determining if haku-listing should be filtered based on users organizations
      UserModel.organizationsDeferred.promise.then(function () {
        if (
          UserModel.isOphUser ||
          (UserModel.hasOtherThanKKUserOrgs && UserModel.isKKUser)
        ) {
          $scope.hakufiltering = 'all'
        } else if (UserModel.isKKUser && !UserModel.hasOtherThanKKUserOrgs) {
          $scope.hakufiltering = 'kkUser'
        } else if (!UserModel.isKKUser && UserModel.hasOtherThanKKUserOrgs) {
          $scope.hakufiltering = 'toinenAsteUser'
        } else {
          $scope.hakufiltering = 'all'
        }
      })

      ParametriService($routeParams.hakuOid)

      $scope.$watch('hakumodel.hakuOid', function () {
        if (
          $scope.hakumodel.hakuOid &&
          $scope.hakumodel.hakuOid.oid !== $routeParams.hakuOid
        ) {
          ParametriService(HakuModel.hakuOid.oid)
          $location.path('/haku/' + HakuModel.hakuOid.oid + '/hakukohde/')
        }
      })
    },
  ])

  .controller('CustomHakuFilterController', [
    '$scope',
    function ($scope) {
      $scope.$on('rajaaHakuja', function () {
        $scope.show()
      })
    },
  ])

  .filter('kkHakuFilter', [
    '_',
    function (_) {
      return function (haut) {
        return _.filter(haut, function (haku) {
          if (haku.kohdejoukkoUri) {
            return haku.kohdejoukkoUri.indexOf('_12') > -1
          }
        })
      }
    },
  ])
  .filter('toinenAsteHakuFilter', [
    '_',
    function (_) {
      return function (haut) {
        return _.filter(haut, function (haku) {
          if (haku.kohdejoukkoUri) {
            return haku.kohdejoukkoUri.indexOf('_12') === -1
          }
        })
      }
    },
  ])

  .filter('CustomHakuFilter', [
    'CustomHakuUtil',
    '_',
    function (CustomHakuUtil, _) {
      return function (haut) {
        var result = haut
        _.each(CustomHakuUtil.hakuKeys, function (key) {
          if (
            CustomHakuUtil[key].value !== null &&
            CustomHakuUtil[key].value !== undefined
          ) {
            result = CustomHakuUtil[key].filter(result)
          }
        })
        return result
      }
    },
  ])

  .service('CustomHakuUtil', [
    '$q',
    '_',
    'HakujenHakutyypit',
    'HakujenKohdejoukot',
    'HakujenHakutavat',
    'HakujenHakukaudet',
    'HakuModel',
    'EhdollisenHyvaksymisenEhdot',
    '$rootScope',
    function (
      $q,
      _,
      HakujenHakutyypit,
      HakujenKohdejoukot,
      HakujenHakutavat,
      HakujenHakukaudet,
      HakuModel,
      EhdollisenHyvaksymisenEhdot,
      $rootScope
    ) {
      var that = this

      this.hakuKeys = [
        'hakuvuosi',
        'hakukausi',
        'kohdejoukko',
        'hakutapa',
        'hakutyyppi',
      ]

      this.deferred = undefined // deferred here is meant just to prevent multiple refresh-calls

      this.hakutyyppiOpts = undefined
      this.kohdejoukkoOpts = undefined
      this.hakutapaOpts = undefined
      this.hakukausiOpts = undefined
      this.hakuvuodetOpts = undefined
      this.ehdollisestiHyvaksyttavissaOlevatOpts = undefined

      function metaInUserLang(meta) {
        return (
          _.findWhere(meta, { kieli: $rootScope.userLang.toUpperCase() }) ||
          _.findWhere(meta, { kieli: 'FI' })
        )
      }

      function filterByLang(result) {
        return _.map(result, function (koodi) {
          return {
            koodiUri: koodi.koodiUri,
            nimi: metaInUserLang(koodi.metadata).nimi,
          }
        })
      }

      this.refresh = function (hakuOid) {
        that.deferred = $q.defer()

        HakujenHakutyypit.query(function (result) {
          that.hakutyyppiOpts = filterByLang(result)
        })

        HakujenKohdejoukot.query(function (result) {
          that.kohdejoukkoOpts = filterByLang(result)
        })

        HakujenHakutavat.query(function (result) {
          that.hakutapaOpts = filterByLang(result)
        })

        HakujenHakukaudet.query(function (result) {
          that.hakukausiOpts = filterByLang(result)
        })

        EhdollisenHyvaksymisenEhdot.query(function (result) {
          that.ehdollisestiHyvaksyttavissaOlevatOpts = filterByLang(result)
        })

        if (_.isEmpty(HakuModel.deferred)) {
          HakuModel.init(hakuOid)
        }

        HakuModel.deferred.promise.then(function () {
          that.hakuvuodetOpts = _.uniq(
            _.pluck(HakuModel.haut, 'hakukausiVuosi')
          )
        })

        that.deferred.resolve(that)
      }

      this.refreshIfNeeded = function (hakuOid) {
        if (_.isEmpty(that.deferred)) {
          that.refresh(hakuOid)
        }
      }

      this.hakuvuosi = {
        value: undefined,
        filter: function (haut) {
          return !_.isNumber(that.hakuvuosi.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakukausiVuosi === that.hakuvuosi.value
              })
        },
      }

      this.hakukausi = {
        value: undefined,
        filter: function (haut) {
          return !_.isString(that.hakukausi.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakukausiUri.indexOf(that.hakukausi.value) > -1
              })
        },
      }

      this.kohdejoukko = {
        value: undefined,
        filter: function (haut) {
          return !_.isString(that.kohdejoukko.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.kohdejoukkoUri.indexOf(that.kohdejoukko.value) > -1
              })
        },
      }

      this.hakutapa = {
        value: undefined,
        filter: function (haut) {
          return !_.isString(that.hakutapa.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakutapaUri.indexOf(that.hakutapa.value) > -1
              })
        },
      }

      this.hakutyyppi = {
        value: undefined,
        filter: function (haut) {
          return !_.isString(that.hakutyyppi.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakutyyppiUri.indexOf(that.hakutyyppi.value) > -1
              })
        },
      }
    },
  ])
