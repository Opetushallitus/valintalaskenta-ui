var app = angular.module('valintalaskenta')
app.factory('ValintalaskentaHakijaryhmaModel', function (
  HakukohdeHakijaryhma,
  HakukohdeValinnanvaihe,
  HakukohteenValintatuloksetIlmanTilaHakijalleTietoa,
  VtsLatestSijoitteluajoHakukohde,
  HakukohdeHenkilotFull,
  AtaruApplications,
  ngTableParams,
  $q,
  $filter,
  HakuModel
) {
  'use strict'
  return function (hakuOid, hakukohdeOid) {
    var sijoittelunTilaOrdinal = function (tila) {
      return [
        'VARALLA',
        'HYVAKSYTTY',
        'VARASIJALTA_HYVAKSYTTY',
        'HARKINNANVARAISESTI_HYVAKSYTTY',
      ].indexOf(tila)
    }
    var findHakemusSijoittelussa = function (
      hakemuksetSijoittelussa,
      valintatapajonot,
      hakija
    ) {
      if (_.has(hakemuksetSijoittelussa, hakija.hakijaOid)) {
        return _.reduce(hakemuksetSijoittelussa[hakija.hakijaOid], function (
          h,
          hakemus
        ) {
          if (
            sijoittelunTilaOrdinal(hakemus.tila) >
            sijoittelunTilaOrdinal(h.tila)
          ) {
            return hakemus
          }
          if (
            sijoittelunTilaOrdinal(hakemus.tila) <
            sijoittelunTilaOrdinal(h.tila)
          ) {
            return h
          }
          if (
            valintatapajonot[hakemus.valintatapajonoOid].prioriteetti <
            valintatapajonot[h.valintatapajonoOid].prioriteetti
          ) {
            return hakemus
          }
          return h
        })
      }
    }
    var findVastaanottotila = function (
      valintatulokset,
      hakemusSijoittelussa,
      hakija
    ) {
      if (hakemusSijoittelussa && _.has(valintatulokset, hakija.hakijaOid)) {
        var valintatulos = _.find(valintatulokset[hakija.hakijaOid], {
          valintatapajonoOid: hakemusSijoittelussa.valintatapajonoOid,
        })
        if (valintatulos) {
          return valintatulos.tila
        }
      }
    }
    var isHyvaksyttyHakijaryhmasta = function (
      hakijaryhmaOid,
      hakemusSijoittelussa
    ) {
      if (hakemusSijoittelussa == null) return undefined
      return (
        hakemusSijoittelussa.hyvaksyttyHakijaryhmista.findIndex(function (oid) {
          return oid === hakijaryhmaOid
        }) > -1
      )
    }
    var getKiintio = function (sijoittelunTulos, hakijaryhmaOid) {
      if (
        hakijaryhmaOid != null &&
        sijoittelunTulos != null &&
        sijoittelunTulos.hakijaryhmat != null
      ) {
        var hakijaryhma = _.findWhere(sijoittelunTulos.hakijaryhmat, {
          oid: hakijaryhmaOid,
        })
        if (hakijaryhma != null && hakijaryhma.kiintio != null) {
          return hakijaryhma.kiintio
        }
      }
      return ''
    }
    var hakijaryhmatPromise = HakukohdeHakijaryhma.get({
      hakukohdeoid: hakukohdeOid,
    }).$promise
    return $q
      .all({
        hakijaryhmat: hakijaryhmatPromise,
        sijoittelunTulos: VtsLatestSijoitteluajoHakukohde.get({
          hakuOid: hakuOid,
          hakukohdeOid: hakukohdeOid,
        }).$promise,
        valintatulokset: HakukohteenValintatuloksetIlmanTilaHakijalleTietoa.get(
          { hakuOid: hakuOid, hakukohdeOid: hakukohdeOid }
        ).$promise,
      })
      .then(function (o) {
        return HakuModel.promise
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
            var valintatapajonot = _.indexBy(
              o.sijoittelunTulos.valintatapajonot,
              'oid'
            )
            var hakemuksetSijoittelussa = _.chain(
              o.sijoittelunTulos.valintatapajonot
            )
              .map('hakemukset')
              .flatten()
              .groupBy('hakijaOid')
              .value()
            var valintatulokset = _.groupBy(o.valintatulokset, 'hakijaOid')
            return o.hakijaryhmat.map(function (hakijaryhma) {
              var hakijat = hakijaryhma.jonosijat.map(function (hakija) {
                var hakemusSijoittelussa = findHakemusSijoittelussa(
                  hakemuksetSijoittelussa,
                  valintatapajonot,
                  hakija
                )
                var vastaanottotila = findVastaanottotila(
                  valintatulokset,
                  hakemusSijoittelussa,
                  hakija
                )
                var hyvaksyttyHakijaryhmasta = isHyvaksyttyHakijaryhmasta(
                  hakijaryhma.hakijaryhmaOid,
                  hakemusSijoittelussa
                )
                var hakemus = hakemukset.filter(function (hakemus) {
                  return hakemus.personOid === hakija.hakijaOid
                })[0]
                if (hakemus) {
                  return {
                    etunimi: hakemus.etunimet
                      ? hakemus.etunimet
                      : hakemus.answers.henkilotiedot.Etunimet,
                    sukunimi: hakemus.sukunimi
                      ? hakemus.sukunimi
                      : hakemus.answers.henkilotiedot.Sukunimi,
                    hakemusOid: hakija.hakemusOid,
                    hakijaOid: hakija.hakijaOid,
                    ryhmaanKuuluminen: hakija.jarjestyskriteerit[0].tila,
                    jononNimi: hakemusSijoittelussa
                      ? valintatapajonot[
                          hakemusSijoittelussa.valintatapajonoOid
                        ].nimi
                      : undefined,
                    hakemusSijoittelussa: hakemusSijoittelussa,
                    sijoittelunTila: hakemusSijoittelussa
                      ? hakemusSijoittelussa.tila
                      : undefined,
                    vastaanottotila: vastaanottotila,
                    hyvaksyttyHakijaryhmasta: hyvaksyttyHakijaryhmasta,
                    pisteet: hakemusSijoittelussa
                      ? hakemusSijoittelussa.pisteet
                      : undefined,
                  }
                } else {
                  console.log(
                    'No hakemus found for hakijaOid: ' +
                      hakija.hakijaOid +
                      ', hakemusOid: ' +
                      hakija.hakemusOid
                  )
                }
              })
              return {
                nimi:
                  hakijaryhma.nimi +
                  (_.has(valintatapajonot, hakijaryhma.valintatapajonoOid)
                    ? ', ' +
                      valintatapajonot[hakijaryhma.valintatapajonoOid].nimi
                    : ''),
                kiintio: getKiintio(
                  o.sijoittelunTulos,
                  hakijaryhma.hakijaryhmaOid
                ),
                tableParams: new ngTableParams(
                  {
                    page: 1,
                    count: 50,
                    sorting: {
                      sukunimi: 'asc',
                    },
                  },
                  {
                    total: hakijat.length,
                    getData: function ($defer, params) {
                      var orderedData = params.sorting()
                        ? $filter('orderBy')(hakijat, params.orderBy())
                        : hakijat
                      orderedData = params.filter()
                        ? $filter('filter')(orderedData, params.filter())
                        : orderedData
                      params.total(orderedData.length)
                      $defer.resolve(
                        orderedData.slice(
                          (params.page() - 1) * params.count(),
                          params.page() * params.count()
                        )
                      )
                    },
                  }
                ),
              }
            })
          })
      })
  }
})

angular.module('valintalaskenta').controller('HakijaryhmatController', [
  '$scope',
  '$location',
  '$routeParams',
  '$timeout',
  '$upload',
  'Ilmoitus',
  'IlmoitusTila',
  'ValintalaskentaHakijaryhmaModel',
  'HakuModel',
  'HakukohdeModel',
  '$http',
  'AuthService',
  'LocalisationService',
  function (
    $scope,
    $location,
    $routeParams,
    $timeout,
    $upload,
    Ilmoitus,
    IlmoitusTila,
    ValintalaskentaHakijaryhmaModel,
    HakuModel,
    HakukohdeModel,
    $http,
    AuthService,
    LocalisationService
  ) {
    'use strict'
    $scope.hakuOid = $routeParams.hakuOid
    $scope.reviewUrlKey = 'haku-app.virkailija.hakemus.esikatselu'

    HakuModel.refreshIfNeeded($scope.hakuOid).then(function (hakuModel) {
      $scope.reviewUrlKey = hakuModel.hakuOid.ataruLomakeAvain
        ? 'ataru.application.review'
        : 'haku-app.virkailija.hakemus.esikatselu'
    })
    ValintalaskentaHakijaryhmaModel(
      $routeParams.hakuOid,
      $routeParams.hakukohdeOid
    ).then(function (model) {
      $scope.model = model
    })
    $scope.hakukohdeModel = HakukohdeModel
  },
])
