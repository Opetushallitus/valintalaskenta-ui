angular
  .module('valintalaskenta')
  .factory('HakukohdeModel', [
    '$q',
    '$log',
    '$http',
    'TarjontaHakukohde',
    'HakukohdeNimiService',
    'ValintaperusteetHakukohdeValintaryhma',
    'KayttaaValintalaskentaa',
    '_',
    'HakuModel',
    'HakukohdeValintakoe',
    function (
      $q,
      $log,
      $http,
      TarjontaHakukohde,
      HakukohdeNimiService,
      ValintaperusteetHakukohdeValintaryhma,
      KayttaaValintalaskentaa,
      _,
      HakuModel,
      HakukohdeValintakoe
    ) {
      'use strict'

      var model

      model = new (function () {
        this.hakukohdeOid = undefined
        this.hakukohdeNimi = undefined
        this.tarjoajaNimi = undefined
        this.hakukohde = {}
        this.hasViite = false
        this.deferred = undefined
        this.valintaryhma = {}
        this.kaytetaanValintalaskentaa = false
        this.haku = HakuModel

        this.refresh = function (hakukohdeOid) {
          model.hakukohdeOid = hakukohdeOid
          TarjontaHakukohde.get(
            { hakukohdeoid: hakukohdeOid },
            function (hakukohde) {
              model.hakukohde = hakukohde
              model.organisationOidsForAuthorisation = model.hakukohde.tarjoajaOids.concat(
                model.hakukohde.organisaatioRyhmaOids
              )
              model.setHakukohdeNames()
              model.setHakukohdeValintaRyhma(hakukohdeOid)
              model.fetchKaytetaanValintalaskentaa(hakukohdeOid).then(
                function (kaytetaanValintalaskentaa) {
                  model.kaytetaanValintalaskentaa = kaytetaanValintalaskentaa
                  model.deferred.resolve()
                },
                function (error) {
                  $log.error(
                    'hakukohteen valintalaskennan kayton hakeminen epäonnistui',
                    error
                  )
                  model.deferred.reject(
                    'hakukohteen valintalaskennan kayton hakeminen epäonnistui'
                  )
                }
              )
            },
            function (error) {
              $log.error('Hakukohteen tietojen hakeminen epäonnistui', error)
              model.deferred.reject(
                'hakukohteen tietojen hakeminen epäonnistui'
              )
            }
          )

          HakukohdeValintakoe.get(
            { hakukohdeOid: hakukohdeOid },
            function (value) {
              model.hasViite = true
            },
            function (error) {
              model.hasViite = false
            }
          )

          return model.deferred
        }

        //This will fail if hakukohdeOid -parameter doesn't exist
        this.refreshIfNeeded = function (hakukohdeOid) {
          if (
            _.isEmpty(model.deferred) ||
            model.isHakukohdeChanged(hakukohdeOid)
          ) {
            model.deferred = $q.defer()
            model.refresh(hakukohdeOid)
            return model.deferred.promise
          } else {
            return model.deferred.promise
          }
        }

        //helper method needed in other controllers
        this.isHakukohdeChanged = function (hakukohdeOid) {
          if (model.hakukohdeOid !== hakukohdeOid) {
            return true
          } else {
            return false
          }
        }

        this.setHakukohdeNames = function () {
          model.hakukohdeNimi = HakukohdeNimiService.getHakukohdeNimi(
            model.hakukohde
          )
          model.tarjoajaNimi = HakukohdeNimiService.getTarjoajaNimi(
            model.hakukohde
          )
        }

        this.setHakukohdeValintaRyhma = function (hakukohdeOid) {
          ValintaperusteetHakukohdeValintaryhma.get(
            { hakukohdeoid: hakukohdeOid },
            function (result) {
              model.valintaryhma = result
            },
            function (error) {
              $log.error(
                'Hakukohteen valintaryhmän tietojen hakeminen epäonnistui',
                error
              )
            }
          )
        }

        this.fetchKaytetaanValintalaskentaa = function (hakukohdeOid) {
          return model.haku.promise.then(function () {
            if (model.haku.hakuOid.sijoittelu) {
              return false
            } else {
              return KayttaaValintalaskentaa.get({
                hakukohdeOid: hakukohdeOid,
              }).$promise.then(function (result) {
                return result.kayttaaValintalaskentaa
              })
            }
          })
        }
      })()

      return model
    },
  ])

  .controller('HakukohdeController', [
    '$scope',
    '$location',
    '$routeParams',
    'HakukohdeModel',
    'HaunTiedot',
    'SijoitteluntulosModel',
    'Korkeakoulu',
    'HakukohdeHenkilotFull',
    'ValinnanTulos',
    '_',
    'HakuHelper',
    '$q',
    function (
      $scope,
      $location,
      $routeParams,
      HakukohdeModel,
      HaunTiedot,
      SijoitteluntulosModel,
      Korkeakoulu,
      HakukohdeHenkilotFull,
      ValinnanTulos,
      _,
      HakuHelper,
      $q
    ) {
      'use strict'

      $scope.hakuOid = $routeParams.hakuOid
      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.model = HakukohdeModel

      var refreshSijoitteluntulosModel = function () {
        $scope.sijoitteluntulosModel = SijoitteluntulosModel
        $scope.sijoitteluntulosModel.refreshIfNeeded(
          $routeParams.hakuOid,
          $routeParams.hakukohdeOid,
          HakukohdeModel.isHakukohdeChanged($routeParams.hakukohdeOid)
        )
      }

      $scope.isKorkeakoulu = function () {
        return (
          $scope.haku && Korkeakoulu.isKorkeakoulu($scope.haku.kohdejoukkoUri)
        )
      }

      $scope.isErillishakuIlmanValintalaskentaa = function () {
        return (
          $scope.haku &&
          $scope.haku.erillishaku &&
          !HakukohdeModel.kaytetaanValintalaskentaa
        )
      }

      $scope.showErillishakuTaulukko = function () {
        return $scope.isErillishakuIlmanValintalaskentaa()
      }

      $scope.erillishaunHakemusErittelyt = {
        hyvaksytyt: [],
        ehdollisestiVastaanottaneet: [],
        paikanVastaanottaneet: [],
      }

      var updateErillishaunHakemusErittelyt = function (hakemukset) {
        _.forEach(hakemukset, function (hakemus) {
          if (
            'HYVAKSYTTY' === hakemus.valinnantila ||
            'VARASIJALTA_HYVAKSYTTY' === hakemus.valinnantila
          ) {
            $scope.erillishaunHakemusErittelyt.hyvaksytyt.push(hakemus)
          }
          if ('VASTAANOTTANUT_SITOVASTI' === hakemus.vastaanottotila) {
            $scope.erillishaunHakemusErittelyt.paikanVastaanottaneet.push(
              hakemus
            )
          } else if (
            'EHDOLLISESTI_VASTAANOTTANUT' === hakemus.vastaanottotila
          ) {
            $scope.erillishaunHakemusErittelyt.ehdollisestiVastaanottaneet.push(
              hakemus
            )
          }
        })
      }

      var refreshErillishaku = function () {
        ValinnanTulos.get({ hakukohdeOid: $routeParams.hakukohdeOid }).then(
          function (response) {
            updateErillishaunHakemusErittelyt(response.data)
          },
          function (error) {
            console.log(error)
          }
        )
      }

      var refreshHaunTiedot = function () {
        console.log('*** refresh haun tiedot')
        return HaunTiedot.get({ hakuOid: $scope.hakuOid }).$promise.then(
          function (haku) {
            $scope.haku = HakuHelper.setErillishaku(haku)
            return $scope.haku
          }
        )
      }

      if ($routeParams.hakukohdeOid) {
        HakukohdeHenkilotFull.get(
          { aoOid: $scope.hakukohdeOid, rows: 100000, asId: $scope.hakuOid },
          function (result) {}
        )
        $q.all([
          $scope.model.refreshIfNeeded($routeParams.hakukohdeOid),
          refreshHaunTiedot(),
        ]).then(function (alldone) {
          $scope.showErillishakuTaulukko()
            ? refreshErillishaku()
            : refreshSijoitteluntulosModel()
        })
      }
    },
  ])

  .controller('HakukohdeNimiController', [
    '$scope',
    '$routeParams',
    'HakukohdeModel',
    function ($scope, $routeParams, HakukohdeModel) {
      HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid)
      $scope.hakukohdeModel = HakukohdeModel
    },
  ])
