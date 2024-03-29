angular
  .module('valintalaskenta')

  .factory('HakukohteetModel', [
    '$q',
    '$routeParams',
    '$log',
    '$http',
    'AuthService',
    'TarjontaHaku',
    'HakuModel',
    function (
      $q,
      $routeParams,
      $log,
      $http,
      AuthService,
      TarjontaHaku,
      HakuModel
    ) {
      'use strict'

      var model

      model = new (function () {
        this.hakukohteet = []
        this.hakuOid = undefined
        this.filtered = []
        this.totalCount = 0
        this.pageSize = 15
        this.searchWord = ''
        this.lastSearch = null
        this.lastHakuOid = null
        this.julkaistutHakukohteet = 'JULKAISTU'
        this.valmiitJaJulkaistutHakukohteet = 'JULKAISTU,VALMIS'
        this.readyToQueryForNextPage = true
        this.deferred = undefined
        this.hakukohteetVisible = !$routeParams.hakukohdeOid

        this.getCount = function () {
          if (this.hakukohteet === undefined) {
            return 0
          }
          return model.hakukohteet.length
        }
        this.getTotalCount = function () {
          return model.totalCount
        }
        this.getNextPage = function (restart) {
          var hakuOid = $routeParams.hakuOid
          if (restart) {
            model.hakukohteet.length = 0
            this.filtered = []
          }
          var startIndex = model.getCount()
          var lastTotalCount = model.getTotalCount()
          var notLastPage = startIndex < lastTotalCount
          var hakukohdeTilas =
            HakuModel.hakuOid.kohdejoukonTarkenne ===
            'haunkohdejoukontarkenne_3#1'
              ? model.valmiitJaJulkaistutHakukohteet
              : model.julkaistutHakukohteet
          if (notLastPage || restart) {
            if (model.readyToQueryForNextPage) {
              model.readyToQueryForNextPage = false
              AuthService.getOrganizations('APP_VALINTOJENTOTEUTTAMINEN', [
                'READ',
                'READ_UPDATE',
                'CRUD',
              ]).then(function (roleModel) {
                var organisationOids = _.filter(roleModel, function (o) {
                  return o.startsWith('1.2.246.562.10.')
                })

                var hakukohdeRyhmaOids = _.filter(roleModel, function (o) {
                  return o.startsWith('1.2.246.562.28.')
                })

                var searchParams = {
                  hakuOid: hakuOid,
                  startIndex: startIndex,
                  count: model.pageSize,
                  searchTerms: model.lastSearch,
                  hakukohdeTilas: hakukohdeTilas,
                  organisationOids: organisationOids.toString(),
                  organisationGroupOids: hakukohdeRyhmaOids.toString(),
                }

                TarjontaHaku.get(searchParams, function (result) {
                  if (restart) {
                    // eka sivu
                    model.hakukohteet = result.tulokset
                    model.totalCount = result.kokonaismaara
                  } else {
                    // seuraava sivu
                    if (startIndex !== model.getCount()) {
                      //
                      // Ei tehda mitaan
                      //
                      model.readyToQueryForNextPage = true
                      return
                    } else {
                      model.hakukohteet = model.hakukohteet.concat(
                        result.tulokset
                      )
                      if (model.getTotalCount() !== result.kokonaismaara) {
                        model.lastSearch = null
                        model.readyToQueryForNextPage = true
                        model.getNextPage(true)
                      }
                    }
                  }
                  model.readyToQueryForNextPage = true
                })
              })
            }
          }
        }

        this.refresh = function () {
          var word = $.trim(this.searchWord)

          model.lastSearch = word
          model.getNextPage(true)
        }

        this.refreshIfNeeded = function (hakuOid) {
          if (hakuOid !== model.lastHakuOid) {
            model.searchWord = ''
            model.lastHakuOid = hakuOid
            model.refresh()
          }
        }
      })()

      return model
    },
  ])

angular.module('valintalaskenta').controller('HakukohteetController', [
  '$rootScope',
  '$scope',
  '$location',
  '$routeParams',
  'HakukohteetModel',
  '_',
  'HakuModel',
  'HakukohdeNimiService',
  'Utility',
  function (
    $rootScope,
    $scope,
    $location,
    $routeParams,
    HakukohteetModel,
    _,
    HakuModel,
    HakukohdeNimiService,
    Utility
  ) {
    'use strict'
    HakuModel.init($routeParams.hakuOid).then(function () {
      $scope.hakuOid = $routeParams.hakuOid
      $scope.hakukohdeOid = $routeParams.hakukohdeOid

      $scope.hakuModel = HakuModel
      $scope.hakuModel.refresh($scope.hakuOid)
      $scope.hakukohdeNimiService = HakukohdeNimiService

      $scope.model = HakukohteetModel
      $scope.model.refreshIfNeeded($routeParams.hakuOid)

      $scope.searchWordChanged = Utility.debounce(function () {
        HakukohteetModel.refresh()
      }, 500)

      $scope.toggleHakukohteetVisible = function () {
        $scope.model.hakukohteetVisible = !$scope.model.hakukohteetVisible
      }

      $scope.showHakukohde = function (hakukohde) {
        $rootScope.selectedHakukohdeNimi = HakukohdeNimiService.getHakukohdeNimi(
          hakukohde
        )
        $scope.model.hakukohteetVisible = false
        HakukohteetModel.hakukohteetVisible = $scope.hakukohteetVisible
        $location.path(
          '/haku/' +
            $routeParams.hakuOid +
            '/hakukohde/' +
            hakukohde.oid +
            '/perustiedot'
        )
      }

      // uuden sivun lataus
      $scope.lazyLoading = function () {
        $scope.model.getNextPage(false)
      }
    })
  },
])
