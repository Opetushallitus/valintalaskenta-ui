angular
  .module('valintalaskenta')
  .factory('ValintaryhmaLista', [
    '$resource',
    '$q',
    'ValintaryhmatJaHakukohteet',
    'AuthService',
    'HakuModel',
    function (
      $resource,
      $q,
      ValintaryhmatJaHakukohteet,
      AuthService,
      HakuModel
    ) {
      //and return interface for manipulating the model
      var modelInterface = {
        //models
        hakukohteet: [],
        valintaperusteList: [],
        search: {
          q: null,
          valintaryhmatAuki: null,
          haku: null,
        },
        tilasto: {
          valintaryhmia: 0,
          valintaryhmiaNakyvissa: 0,
        },

        refresh: function (hakuOid) {
          var deferred = $q.defer()

          ValintaryhmatJaHakukohteet.get(
            {
              q: this.search.q,
              hakukohteet: true,
              hakuOid: hakuOid,
            },
            function (result) {
              modelInterface.valintaperusteList = result
              modelInterface.update()
              deferred.resolve()
            },
            function (error) {
              deferred.reject(
                'Valintaryhmapuun tietojen hakeminen epäonnistui',
                error
              )
            }
          )

          return deferred.promise
        },
        expandTree: function () {
          modelInterface.forEachValintaryhma(function (item) {
            item.isVisible = true
          })
        },
        forEachValintaryhma: function (f) {
          var recursion = function (item, f) {
            f(item)
            if (item.alavalintaryhmat)
              for (var i = 0; i < item.alavalintaryhmat.length; i++)
                recursion(item.alavalintaryhmat[i], f)
          }
          for (var i = 0; i < modelInterface.valintaperusteList.length; i++)
            recursion(modelInterface.valintaperusteList[i], f)
        },
        getValintaryhma: function (oid) {
          var valintaryhma = null
          modelInterface.forEachValintaryhma(function (item) {
            if (item.oid == oid) valintaryhma = item
          })
          return valintaryhma
        },
        update: function () {
          var list = modelInterface.valintaperusteList
          modelInterface.valintaperusteList = []
          modelInterface.tilasto.valintaryhmia = 0
          modelInterface.tilasto.valintaryhmiaNakyvissa = 0

          var recursion = function (item) {
            if (item.tyyppi == 'VALINTARYHMA') {
              modelInterface.tilasto.valintaryhmia++
            }

            if (item.alavalintaryhmat) {
              for (var i = 0; i < item.alavalintaryhmat.length; i++)
                recursion(item.alavalintaryhmat[i])
            }

            if (item.tyyppi === 'HAKUKOHDE') {
              modelInterface.tilasto.hakukohteita++
              modelInterface.hakukohteet.push(item)
            }
          }

          for (var i = 0; i < list.length; i++) {
            recursion(list[i])
          }

          modelInterface.hakukohteet.forEach(function (hakukohde) {
            hakukohde.sisaltaaHakukohteita = true
            var parent = hakukohde.ylavalintaryhma
            while (typeof parent !== 'undefined' && parent !== null) {
              parent.sisaltaaHakukohteita = true
              parent = parent.ylavalintaryhma
            }
          })

          modelInterface.valintaperusteList = list
        },
        expandNode: function (node) {
          if (node.alavalintaryhmat && node.alavalintaryhmat.length > 0) {
            if (node.isVisible != true) {
              node.isVisible = true
            } else {
              node.isVisible = false
            }
          }
        },
      }
      return modelInterface
    },
  ])

  .controller('ValintaryhmaController', [
    '$scope',
    '$routeParams',
    '$modal',
    '_',
    'HakuModel',
    'ValintaryhmaLista',
    'UserModel',
    function (
      $scope,
      $routeParams,
      $modal,
      _,
      HakuModel,
      ValintaryhmaLista,
      UserModel
    ) {
      $scope.predicate = 'nimi'
      $scope.domain = ValintaryhmaLista

      var promise = ValintaryhmaLista.refresh($routeParams.hakuOid)
      promise.then(function (result) {
        _.forEach($scope.domain.valintaperusteList, function (
          valintaperusteHierarkia
        ) {
          $scope.reverseSearch(valintaperusteHierarkia)
        })
      })

      $scope.hakukohteet = []

      $scope.hakumodel = HakuModel

      $scope.expandNode = function (node) {
        if (
          (node.alavalintaryhmat && node.alavalintaryhmat.length > 0) ||
          (node.hakukohdeViitteet && node.hakukohdeViitteet.length > 0)
        ) {
          if (node.isVisible != true) {
            node.isVisible = true

            // aukaisee alitason, jos ei ole liikaa tavaraa
            var iter = function (ala) {
              ala.forEach(function (ala) {
                if (!ala.alavalintaryhmat || ala.alavalintaryhmat.length < 4) {
                  ala.isVisible = true
                  iter(ala.alavalintaryhmat)
                }
              })
            }
            if (node.alavalintaryhmat.length < 4) {
              iter(node.alavalintaryhmat)
            }
          } else {
            node.isVisible = false
          }
        }
      }

      $scope.changeValintaryhma = function (valintaryhma) {
        $scope.hakukohteetVisible ? ($scope.hakukohteetVisible = false) : ''
        $scope.selectedValintaryhma = valintaryhma
        $scope.hakukohteet.length = 0
        $scope.fetchValintaryhmat(valintaryhma)
      }

      $scope.showHakukohteet = function (valintaryhma) {
        $scope.hakukohteetVisible = !$scope.hakukohteetVisible
      }

      $scope.fetchValintaryhmat = function (valintaryhma) {
        $scope.recurseValintaryhmat(valintaryhma, [$scope.findHakukohteet])
      }

      $scope.reverseSearch = function (valintaryhma) {
        _.forEach(valintaryhma.alavalintaryhmat, function (alaValintaryhma) {
          $scope.reverseSearch(alaValintaryhma)
        })

        if (valintaryhma.tyyppi === 'HAKUKOHDE') {
          valintaryhma.showValintaryhma = true
        } else if (
          $scope.isChildValintaryhmaVisible(valintaryhma.alavalintaryhmat) ||
          valintaryhma.hakukohdeViitteet.length > 0
        ) {
          valintaryhma.showValintaryhma = true
        } else if (
          _.isEmpty(valintaryhma.alavalintaryhmat) &&
          _.isEmpty(valintaryhma.hakukohdeViitteet)
        ) {
          valintaryhma.showValintaryhma = false
        } else {
          valintaryhma.showValintaryhma = false
        }

        if (
          !$scope.voiKaynnistaaLaskennan(valintaryhma) &&
          !$scope.isChildValintaryhmaVisible(valintaryhma.alavalintaryhmat)
        ) {
          valintaryhma.showValintaryhma = false
        }
      }

      $scope.isChildValintaryhmaVisible = function (alavalintaryhmat) {
        return _.some(alavalintaryhmat, function (alaValintaryhma) {
          return alaValintaryhma.showValintaryhma
        })
      }

      //suorita funcList:n funktiot kaikilla valintaryhmille
      $scope.recurseValintaryhmat = function (valintaryhma, funcList) {
        _.forEach(funcList, function (func) {
          func(valintaryhma)
        })
        _.forEach(valintaryhma.alavalintaryhmat, function (valintaryhma) {
          $scope.recurseValintaryhmat(valintaryhma, funcList)
        })
      }

      $scope.findHakukohteet = function (valintaryhma) {
        _.forEach(valintaryhma.hakukohdeViitteet, function (hakukohde) {
          $scope.hakukohteet.push(hakukohde)
        })
      }

      var dayInMillis = 24 * 60 * 60 * 1000 - 1
      $scope.voiKaynnistaaLaskennan = function (valintaryhma) {
        if (!valintaryhma) {
          return false
        }
        if (UserModel.isOphUser) {
          return true
        }

        hasOrganizationAccess =
          valintaryhma.vastuuorganisaatio &&
          UserModel.organizationOidsAndChilds.indexOf(
            valintaryhma.vastuuorganisaatio.oid
          ) != -1
        hasExpired =
          valintaryhma.viimeinenKaynnistyspaiva &&
          new Date().getTime() >
            valintaryhma.viimeinenKaynnistyspaiva + dayInMillis

        return hasOrganizationAccess && !hasExpired
      }

      $scope.kaynnistaValintalaskenta = function (valintaryhma) {
        var hakukohdeOids = []
        _.forEach($scope.hakukohteet, function (hakukohde) {
          hakukohdeOids.push(hakukohde.oid)
        })
        var erillishaku = HakuModel.hakuOid.erillishaku
        var valintalaskentaInstance = $modal.open({
          backdrop: 'static',
          templateUrl: '../common/modaalinen/valintaryhmaseurantaikkuna.html',
          controller: SeurantaIkkunaCtrl,
          size: 'lg',
          resolve: {
            oids: function () {
              return {
                hakuOid: $routeParams.hakuOid,
                tyyppi: 'VALINTARYHMA',
                erillishaku: erillishaku,
                nimentarkennus: valintaryhma.nimi,
                hakukohteet: hakukohdeOids,
                valintaryhmaOid: valintaryhma.oid,
              }
            },
          },
        })
      }

      $scope.kaynnistaValintakoelaskenta = function (valintaryhma) {
        var hakukohdeOids = []
        _.forEach($scope.hakukohteet, function (hakukohde) {
          hakukohdeOids.push(hakukohde.oid)
        })
        var erillishaku = HakuModel.hakuOid.erillishaku
        var valintalaskentaInstance = $modal.open({
          backdrop: 'static',
          templateUrl: '../common/modaalinen/valintakoelaskenta.html',
          controller: SeurantaIkkunaCtrl,
          size: 'lg',
          resolve: {
            oids: function () {
              return {
                hakuOid: $routeParams.hakuOid,
                tyyppi: 'VALINTARYHMA',
                erillishaku: erillishaku,
                nimentarkennus: valintaryhma.nimi,
                valintaryhmaOid: valintaryhma.oid,
                valintakoelaskenta: true,
                hakukohteet: hakukohdeOids,
              }
            },
          },
        })
      }
    },
  ])
