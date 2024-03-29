var app = angular.module('valintalaskenta')
app.factory('HenkiloTiedotModel', function (
  $q,
  AuthService,
  Hakemus,
  ValintalaskentaHakemus,
  ValinnanvaiheListFromValintaperusteet,
  HakukohdeValinnanvaihe,
  SijoittelunVastaanottotilat,
  VtsLatestSijoittelunTilat,
  ValintakoetuloksetHakemuksittain,
  HarkinnanvaraisestiHyvaksytty,
  HakukohdeAvaimet,
  HaunTiedot,
  HakemuksenValintatulokset,
  VtsValinnantuloksetHakemukselle,
  HakukohdeAvainTyyppiService,
  KoostettuHakemusAdditionalDataForHakemus,
  R,
  TarjontaHakukohde,
  AtaruApplications
) {
  'use strict'

  function setVastaanottoTilaOptionsToShow(hakutoiveenValintatapajonot) {
    var showSitovasti = false
    ;(hakutoiveenValintatapajonot || []).forEach(function (
      valintatapajono,
      index
    ) {
      if (valintatapajono.tila === 'HYVAKSYTTY') {
        if (valintatapajono.valintatapajonoPrioriteetti === index + 1) {
          showSitovasti = true
        }
        if (valintatapajono.valintatapajonoPrioriteetti === 1) {
          valintatapajono.showSitovasti = true
          valintatapajono.showEhdollisesti = false
        }
        if (valintatapajono.valintatapajonoPrioriteetti > 1) {
          valintatapajono.showSitovasti = showSitovasti
          valintatapajono.showEhdollisesti = true
        }
      }
    })
  }

  function getNimi(nimi) {
    return nimi.kieli_fi !== undefined
      ? nimi.kieli_fi
      : nimi.kieli_sv !== undefined
      ? nimi.kieli_sv
      : nimi.kieli_en
  }

  function hakukohteetByHakukohdeOid(hakemus) {
    var hakukohteetByHakukohdeOid = {}
    return $q
      .all(
        hakemus.hakutoiveet.map(function (hakutoive) {
          return TarjontaHakukohde.get({
            hakukohdeoid: hakutoive.hakukohdeOid,
          }).$promise.then(function (hakukohde) {
            hakukohteetByHakukohdeOid[hakukohde.oid] = {
              nimi: getNimi(hakukohde.nimi),
              tarjoajaNimi: getNimi(hakukohde.tarjoajaNimi),
              tarjoajaOid: hakukohde.tarjoajaOids[0],
              organisationOidsForAuthorization: hakukohde.tarjoajaOids.concat(
                hakukohde.organisaatioRyhmaOids
              ),
            }
          })
        })
      )
      .then(function () {
        return hakukohteetByHakukohdeOid
      })
  }

  function getHakuAppHakemus(hakuOid, hakemusOid) {
    return Hakemus.get({ oid: hakemusOid }).$promise.then(function (hakemus) {
      var hakutoiveet = []
      for (
        var i = 1;
        hakemus.answers.hakutoiveet['preference' + i + '-Koulutus-id'];
        i++
      ) {
        var harkinnanvarainen =
          hakemus.answers.hakutoiveet['preference' + i + '-discretionary']
        var discretionary =
          hakemus.answers.hakutoiveet['preference' + i + '-Harkinnanvarainen']

        var hakutoive = {
          hakukohdeOid:
            hakemus.answers.hakutoiveet['preference' + i + '-Koulutus-id'],
          hakenutHarkinnanvaraisesti:
            (harkinnanvarainen || discretionary) === 'true',
        }
        hakutoiveet.push(hakutoive)
      }
      return {
        oid: hakemusOid,
        personOid: hakemus.personOid,
        sukunimi: hakemus.answers.henkilotiedot.Sukunimi,
        etunimet: hakemus.answers.henkilotiedot.Etunimet,
        asiointikieli: hakemus.answers.lisatiedot.asiointikieli,
        henkilotunnus: hakemus.answers.henkilotiedot.Henkilotunnus,
        lahiosoite: hakemus.answers.henkilotiedot.lahiosoite,
        postinumero: hakemus.answers.henkilotiedot.Postinumero,
        pohjakoulutustoinenasteKoodiarvo:
          hakemus.answers.koulutustausta.POHJAKOULUTUS,
        hakutoiveet: hakutoiveet,
        link: url(
          'haku-app.virkailija.hakemus.esikatselu',
          hakuOid,
          hakemusOid
        ),
      }
    })
  }

  function getAtaruHakemus(hakuOid, hakemusOid) {
    return AtaruApplications.get({ hakemusOids: [hakemusOid] }).$promise.then(
      function (result) {
        var hakemus = result[0]
        return {
          oid: hakemus.oid,
          personOid: hakemus.personOid,
          sukunimi: hakemus.sukunimi,
          etunimet: hakemus.etunimet,
          asiointikieli: hakemus.asiointiKieli.kieliKoodi,
          henkilotunnus: hakemus.henkilotunnus,
          lahiosoite: hakemus.lahiosoite,
          postinumero: hakemus.postinumero,
          pohjakoulutustoinenasteKoodiarvo: null,
          hakutoiveet: hakemus.hakutoiveet.map(function (hakutoive) {
            return {
              hakukohdeOid: hakutoive.hakukohdeOid,
              hakenutHarkinnanvaraisesti: false,
            }
          }),
          link: url('ataru.application.review', hakuOid, hakemusOid),
        }
      }
    )
  }

  function valintalaskentaByHakukohdeOid(hakuOid, hakemusOid) {
    return ValintalaskentaHakemus.get({
      hakuoid: hakuOid,
      hakemusoid: hakemusOid,
    }).$promise.then(function (valintalaskenta) {
      var valintalaskentaByHakukohdeOid = {}
      valintalaskenta.hakukohteet.forEach(function (hakukohde) {
        valintalaskentaByHakukohdeOid[hakukohde.oid] = hakukohde.valinnanvaihe
      })
      return valintalaskentaByHakukohdeOid
    })
  }

  function harkinnanvaraisuusTilaByHakukohdeOid(hakuOid, hakemusOid) {
    return HarkinnanvaraisestiHyvaksytty.get({
      hakemusOid: hakemusOid,
      hakuOid: hakuOid,
    }).$promise.then(function (harkinnanvaraisuus) {
      var harkinnanvaraisuusTilaByHakukohdeOid = {}
      harkinnanvaraisuus.forEach(function (harkinnanvarainen) {
        harkinnanvaraisuusTilaByHakukohdeOid[harkinnanvarainen.hakukohdeOid] =
          harkinnanvarainen.harkinnanvaraisuusTila
      })
      return harkinnanvaraisuusTilaByHakukohdeOid
    })
  }

  function vastaanottotilatByValintatapajonoOid(hakuOid, hakemusOid) {
    return SijoittelunVastaanottotilat.get({
      hakuOid: hakuOid,
      hakemusOid: hakemusOid,
    }).$promise.then(function (vastaanottotilat) {
      var vastaanottotilatByValintatapajonoOid = {}
      vastaanottotilat.forEach(function (vastaanottotila) {
        vastaanottotilatByValintatapajonoOid[
          vastaanottotila.valintatapajonoOid
        ] = vastaanottotila.tila
      })
      return vastaanottotilatByValintatapajonoOid
    })
  }

  function tilaHistoriatByValintatapajonoOid(hakemusOid) {
    var tilaHistoriatByValintatapajonoOid = {}
    return VtsValinnantuloksetHakemukselle.query({
      hakemusOid: hakemusOid,
    })
      .$promise.then(function (tulokset) {
        tulokset.forEach(function (tulos) {
          tilaHistoriatByValintatapajonoOid[
            tulos.tilaHistoria.valintatapajonoOid
          ] = tulos.tilaHistoria
        })
      })
      .then(function () {
        return tilaHistoriatByValintatapajonoOid
      })
  }

  function logEntriesByValintatapajonoOid(hakuOid, hakemusOid, hakutoiveet) {
    var logEntriesByValintatapajonoOid = {}
    return $q
      .all(
        hakutoiveet.map(function (hakutoive) {
          return $q.all(
            hakutoive.hakutoiveenValintatapajonot.map(function (
              valintatapajono
            ) {
              return HakemuksenValintatulokset.get({
                hakemusOid: hakemusOid,
                hakuOid: hakuOid,
                hakukohdeOid: hakutoive.hakukohdeOid,
                valintatapajonoOid: valintatapajono.valintatapajonoOid,
              }).$promise.then(function (valintatulokset) {
                valintatulokset.forEach(function (valintatulos) {
                  logEntriesByValintatapajonoOid[
                    valintatapajono.valintatapajonoOid
                  ] = valintatulos.logEntries
                })
              })
            })
          )
        })
      )
      .then(function () {
        return logEntriesByValintatapajonoOid
      })
  }

  function getSijoittelu(hakuOid, hakemusOid) {
    return VtsLatestSijoittelunTilat.get({
      hakemusOid: hakemusOid,
      hakuOid: hakuOid,
    })
      .$promise.then(function (sijoittelunTilat) {
        var hakutoiveet = sijoittelunTilat.hakutoiveet || []
        var sijoitteluByHakukohdeOid = {}
        var sijoitteluByValintatapajonoOid = {}
        hakutoiveet.forEach(function (hakutoive) {
          sijoitteluByHakukohdeOid[hakutoive.hakukohdeOid] =
            hakutoive.hakutoiveenValintatapajonot
          hakutoive.hakutoiveenValintatapajonot.forEach(function (
            valintatapajono
          ) {
            sijoitteluByValintatapajonoOid[
              valintatapajono.valintatapajonoOid
            ] = valintatapajono
          })
        })
        return $q
          .all({
            tilaHistoriatByValintatapajonoOid: tilaHistoriatByValintatapajonoOid(
              hakemusOid
            ),
            logEntriesByValintatapajonoOid: logEntriesByValintatapajonoOid(
              hakuOid,
              hakemusOid,
              hakutoiveet
            ),
          })
          .then(function (o) {
            return {
              sijoitteluByHakukohdeOid: sijoitteluByHakukohdeOid,
              sijoitteluByValintatapajonoOid: sijoitteluByValintatapajonoOid,
              tilaHistoriatByValintatapajonoOid:
                o.tilaHistoriatByValintatapajonoOid,
              logEntriesByValintatapajonoOid: o.logEntriesByValintatapajonoOid,
            }
          })
      })
      .catch(function (e) {
        if (e.status === 404) {
          console.warn(
            'Virhe HTTP 404 Not Found haettaessa sijoittelun tuloksia. Ehkä tuloksia ei vielä ole?',
            e
          )
        } else {
          console.error('Virhe haettaessa sijoittelun tuloksia.', e)
          throw e
        }
        return {}
      })
  }

  function avaimetByHakukohdeOid(hakemus) {
    var avaimetByHakukohdeOid = {}
    return $q
      .all(
        hakemus.hakutoiveet.map(function (hakutoive) {
          return HakukohdeAvaimet.get({
            hakukohdeOid: hakutoive.hakukohdeOid,
          }).$promise.then(function (avaimet) {
            avaimetByHakukohdeOid[hakutoive.hakukohdeOid] = avaimet
          })
        })
      )
      .then(function () {
        return avaimetByHakukohdeOid
      })
  }

  function organizationChecksByHakukohdeOid(hakukohteetByHakukohdeOid) {
    var organizationChecksByHakukohdeOid = {}
    return $q
      .all(
        Object.entries(hakukohteetByHakukohdeOid).map(function (t) {
          var hakukohdeOid = t[0]
          return AuthService.readOrg(
            'APP_VALINTOJENTOTEUTTAMINENKK',
            t[1].organisationOidsForAuthorization
          ).then(
            function () {
              organizationChecksByHakukohdeOid[hakukohdeOid] = true
            },
            function () {
              organizationChecksByHakukohdeOid[hakukohdeOid] = false
            }
          )
        })
      )
      .then(function () {
        return organizationChecksByHakukohdeOid
      })
  }

  function refresh(hakuOid, hakemusOid) {
    var self = this
    self.hakemus = {}
    self.hakutoiveet = []
    self.hakuOid = hakuOid
    self.haku = {}
    self.errors = []
    self.sijoittelu = {}
    self.hakenutHarkinnanvaraisesti = false
    self.naytaPistesyotto = false
    self.lastmodified = null
    self.valintatapajonoLastModified = {} // FIXME vaatii valintatuloksen hakemisen uudemmasta VTS:n API:sta

    var hakuPromise = HaunTiedot.get({ hakuOid: hakuOid }).$promise.then(
      function (haku) {
        return haku
      },
      function (error) {
        return $q.reject(
          'Error fetching haku ' + hakuOid + ': ' + JSON.stringify(o)
        )
      }
    )
    var hakemusPromise = hakuPromise.then(function (haku) {
      if (haku.ataruLomakeAvain) {
        return getAtaruHakemus(hakuOid, hakemusOid)
      } else {
        return getHakuAppHakemus(hakuOid, hakemusOid)
      }
    })
    var hakukohteetPromise = hakemusPromise.then(hakukohteetByHakukohdeOid)
    return $q
      .all({
        haku: hakuPromise,
        hakemus: hakemusPromise,
        hakukohteetByHakukohdeOid: hakukohteetPromise,
        avaimetByHakukohdeOid: hakemusPromise.then(avaimetByHakukohdeOid),
        organizationChecksByHakukohdeOid: hakukohteetPromise.then(
          organizationChecksByHakukohdeOid
        ),
        valintalaskentaByHakukohdeOid: valintalaskentaByHakukohdeOid(
          hakuOid,
          hakemusOid
        ),
        harkinnanvaraisuusTilaByHakukohdeOid: harkinnanvaraisuusTilaByHakukohdeOid(
          hakuOid,
          hakemusOid
        ),
        sijoittelu: getSijoittelu(hakuOid, hakemusOid),
        vastaanottotilatByValintatapajonoOid: vastaanottotilatByValintatapajonoOid(
          hakuOid,
          hakemusOid
        ),
        additionalData: KoostettuHakemusAdditionalDataForHakemus.get({
          hakemusOid: hakemusOid,
        }),
      })
      .then(
        function (o) {
          self.haku = o.haku
          self.hakemus = o.hakemus
          self.sijoittelu = o.sijoittelu.sijoitteluByValintatapajonoOid
          self.lastmodified = o.additionalData.lastmodified
          self.hakutoiveet = o.hakemus.hakutoiveet.map(function (h, index) {
            var hakukohdeOid = h.hakukohdeOid
            var hakukohde = o.hakukohteetByHakukohdeOid[hakukohdeOid]
            var avaimet = o.avaimetByHakukohdeOid[hakukohdeOid]
            HakukohdeAvainTyyppiService.createAvainTyyppiValues(avaimet, [])
            var additionalData = R.path(
              ['hakukohteittain', hakukohdeOid],
              o.additionalData
            )
            var osallistuu = R.pathOr(
              {},
              [
                'hakukohteidenOsallistumistiedot',
                hakukohdeOid,
                'valintakokeidenOsallistumistiedot',
              ],
              additionalData
            )
            var naytaPistesyotto = avaimet.reduce(function (
              naytaPistesyotto,
              a
            ) {
              return (
                naytaPistesyotto ||
                (osallistuu[a.tunniste] &&
                  osallistuu[a.tunniste].osallistumistieto !== 'EI_KUTSUTTU')
              )
            },
            false)
            var sijoittelu = R.pathOr(
              [],
              ['sijoittelu', 'sijoitteluByHakukohdeOid', hakukohdeOid],
              o
            )
            setVastaanottoTilaOptionsToShow(sijoittelu)
            sijoittelu.forEach(function (valintatapajono) {
              valintatapajono.hakemusOid = hakemusOid
              valintatapajono.hakijaOid = self.hakemus.personOid
              valintatapajono.vastaanottoTila =
                o.vastaanottotilatByValintatapajonoOid[
                  valintatapajono.valintatapajonoOid
                ]
              valintatapajono.muokattuVastaanottoTila =
                valintatapajono.vastaanottoTila
              valintatapajono.tilaHistoria =
                o.sijoittelu.tilaHistoriatByValintatapajonoOid[
                  valintatapajono.valintatapajonoOid
                ]
              valintatapajono.logEntries =
                o.sijoittelu.logEntriesByValintatapajonoOid[
                  valintatapajono.valintatapajonoOid
                ]
            })
            return {
              hakukohdeOid: hakukohdeOid,
              hakutoiveNumero: index + 1,
              koulutuksenNimi: hakukohde.nimi,
              oppilaitos: hakukohde.tarjoajaNimi,
              oppilaitosId: hakukohde.tarjoajaOid,
              organisationOidsForAuthorization:
                hakukohde.organisationOidsForAuthorization,
              hakemusOid: hakemusOid,
              hakenutHarkinnanvaraisesti: h.hakenutHarkinnanvaraisesti,
              additionalData: R.path(
                ['applicationAdditionalDataDTO', 'additionalData'],
                additionalData
              ),
              valintalaskenta: o.valintalaskentaByHakukohdeOid[hakukohdeOid],
              harkinnanvaraisuusTila:
                o.harkinnanvaraisuusTilaByHakukohdeOid[hakukohdeOid],
              muokattuHarkinnanvaraisuusTila:
                o.harkinnanvaraisuusTilaByHakukohdeOid[hakukohdeOid],
              sijoittelu: sijoittelu,
              osallistuu: osallistuu,
              avaimet: avaimet,
              naytaPistesyotto: naytaPistesyotto,
              hasDoneOrganizationCheck: true,
              showAsLink: o.organizationChecksByHakukohdeOid[hakukohdeOid],
            }
          })
          self.hakenutHarkinnanvaraisesti = self.hakutoiveet.reduce(function (
            hakenutHarkinnanvaraisesti,
            hakutoive
          ) {
            return (
              hakenutHarkinnanvaraisesti || hakutoive.hakenutHarkinnanvaraisesti
            )
          },
          false)
          self.naytaPistesyotto = self.hakutoiveet.reduce(function (
            naytaPistesyotto,
            hakutoive
          ) {
            return naytaPistesyotto || hakutoive.naytaPistesyotto
          },
          false)
        },
        function (error) {
          self.errors.push(error)
        }
      )
  }

  function tallennaPisteet() {
    var mergedAdditionalData = R.mergeAll(
      R.map(function (h) {
        return h.additionalData
      }, this.hakutoiveet)
    )
    return KoostettuHakemusAdditionalDataForHakemus.put(
      {
        hakemusOid: this.hakemus.oid,
      },
      {
        lastmodified: this.lastmodified,
        hakemus: {
          oid: this.hakemus.oid,
          personOid: this.hakemus.personOid,
          additionalData: mergedAdditionalData,
        },
      }
    )
  }

  return {
    hakemus: {},
    hakutoiveet: [],
    hakuOid: null,
    haku: {},
    errors: [],
    sijoittelu: {},
    hakenutHarkinnanvaraisesti: false,
    naytaPistesyotto: false,
    lastmodified: null,
    valintatapajonoLastModified: {},

    refresh: refresh,
    tallennaPisteet: tallennaPisteet,
  }
})

angular.module('valintalaskenta').controller('HenkiloTiedotController', [
  '$q',
  '$scope',
  '$modal',
  '$routeParams',
  'ParametriService',
  'Latausikkuna',
  'Jalkiohjauskirjepohjat',
  'Jalkiohjauskirjeet',
  'HenkiloTiedotModel',
  'AuthService',
  'Pohjakoulutukset',
  'Ilmoitus',
  'IlmoitusTila',
  'HakuModel',
  '$filter',
  'Korkeakoulu',
  '$window',
  'R',
  function (
    $q,
    $scope,
    $modal,
    $routeParams,
    ParametriService,
    Latausikkuna,
    Jalkiohjauskirjepohjat,
    Jalkiohjauskirjeet,
    HenkiloTiedotModel,
    AuthService,
    Pohjakoulutukset,
    Ilmoitus,
    IlmoitusTila,
    HakuModel,
    $filter,
    Korkeakoulu,
    $window,
    R
  ) {
    'use strict'

    $scope.model = HenkiloTiedotModel
    $scope.hakutoiveetLoadedPromise = $scope.model.refresh(
      $routeParams.hakuOid,
      $routeParams.hakemusOid
    )
    $scope.url = window.url
    $scope.hakuModel = HakuModel
    $scope.korkeakoulu = Korkeakoulu
    $scope.pohjakoulutustoinenaste = {}
    Pohjakoulutukset.query(function (result) {
      $scope.pohjakoulutustoinenaste = result.reduce(function (m, koodi) {
        var nimi = koodi.metadata.reduce(function (m, meta) {
          m[meta.kieli] = meta.nimi
          return m
        }, {})
        m[koodi.koodiArvo] = nimi[$scope.userLang.toUpperCase()] || nimi['FI']
        return m
      }, {})
    })

    $scope.hakuaVastaavaJalkiohjauskirjeMuotti = function () {
      return 'jalkiohjauskirje'
    }
    $scope.muodostaJalkiohjauskirje = function () {
      var isKorkeakoulu = $scope.korkeakoulu.isKorkeakoulu(
        $scope.hakuModel.hakuOid.kohdejoukkoUri
      )
      var applicationPeriod = $routeParams.hakuOid
      var hakemusOid = $scope.model.hakemus.oid
      var asiointikieli = $scope.model.hakemus.asiointikieli
      console.log(asiointikieli)
      var langcode = 'FI'
      if (
        asiointikieli !== undefined &&
        asiointikieli.toUpperCase() === 'RUOTSI'
      ) {
        langcode = 'SV'
      } else if (
        asiointikieli !== undefined &&
        asiointikieli.toUpperCase() === 'ENGLANTI'
      ) {
        langcode = 'EN'
      } else if ($scope.model.hakemus.asiointikieli !== undefined) {
        langcode = $scope.model.hakemus.asiointikieli.toUpperCase()
      }
      console.log('langcode: ' + langcode)
      var templateName = $scope.hakuaVastaavaJalkiohjauskirjeMuotti()
      var otsikko = ''
      var toimintoNimi = ''
      var latausikkunaTeksti = ''
      if (isKorkeakoulu) {
        otsikko = 'Ei-hyväksyttyjen kirjeet'
        toimintoNimi = 'Muodosta ei-hyväksyttyjen kirjeet'
        latausikkunaTeksti = 'Ei-hyväksyttyjen kirjeet'
      } else {
        otsikko = 'Jälkiohjauskirjeet'
        toimintoNimi = 'Muodosta jälkiohjauskirjeet'
        latausikkunaTeksti = 'Jälkiohjauskirjeet'
      }

      var viestintapalveluInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
        controller: ViestintapalveluIkkunaCtrl,
        size: 'lg',
        resolve: {
          oids: function () {
            return {
              otsikko: otsikko,
              toimintoNimi: toimintoNimi,
              toiminto: function (sisalto) {
                Jalkiohjauskirjeet.post(
                  {
                    hakuOid: $routeParams.hakuOid,
                    applicationPeriod: applicationPeriod,
                    templateName: templateName,
                  },
                  {
                    hakemusOids: [hakemusOid],
                    letterBodyText: sisalto,
                    languageCode: langcode,
                  },
                  function (id) {
                    Latausikkuna.avaa(id, latausikkunaTeksti, '')
                  },
                  function () {}
                )
              },
              showDateFields: true,
              hakuOid: $routeParams.hakuOid,
              pohjat: function () {
                return Jalkiohjauskirjepohjat.get({
                  templateName: templateName,
                  languageCode: langcode,
                  applicationPeriod: applicationPeriod,
                })
              },
            }
          },
        },
      })
    }

    AuthService.crudOph('APP_SIJOITTELU').then(function () {
      $scope.updateOph = true
    })

    $scope.isValinnanvaiheVisible = function (index, valinnanvaiheet) {
      var orderBy = $filter('orderBy')
      valinnanvaiheet = orderBy(valinnanvaiheet, 'jarjestysnumero', true)
      for (var i = 0; i < valinnanvaiheet.length; i++) {
        if (valinnanvaiheet[i].valintatapajonot.length > 0) {
          if (index === i) {
            return true
          } else {
            return false
          }
        }
      }
    }

    $scope.tallennaPisteet = function () {
      $scope.model.tallennaPisteet().then(
        function (response) {
          $scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid)
          if (R.isEmpty(response.data)) {
            Ilmoitus.avaa(
              'Tallennus onnistui',
              'Pisteet tallennettu onnistuneesti.',
              IlmoitusTila.INFO
            )
          } else {
            Ilmoitus.avaa(
              'Tallennus epäonnistui',
              'Hakemuksella oli uudempia pistetietoja. Ole hyvä ja yritä uudelleen.',
              IlmoitusTila.ERROR
            )
          }
        },
        function () {
          $scope.model.refresh($routeParams.hakuOid, $routeParams.hakemusOid)
          Ilmoitus.avaa(
            'Tallennus epäonnistui',
            'Pisteiden tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.',
            IlmoitusTila.ERROR
          )
        }
      )
    }

    $scope.valintalaskentaKerrallaHakukohteille = function () {
      var hakukohteet = $scope.model.hakutoiveet.map(function (hakutoive) {
        return hakutoive.hakukohdeOid
      })
      var erillishaku = HakuModel.hakuOid.erillishaku
      if (hakukohteet.length > 0) {
        $modal.open({
          backdrop: 'static',
          templateUrl: '../common/modaalinen/hakutoiveetseurantaikkuna.html',
          controller: SeurantaIkkunaCtrl,
          size: 'lg',
          resolve: {
            oids: function () {
              return {
                hakuOid: $routeParams.hakuOid,
                nimentarkennus: '',
                erillishaku: erillishaku,
                tyyppi: 'HAKUKOHDE',
                hakukohteet: hakukohteet,
              }
            },
          },
        })
      } else {
        Ilmoitus.avaa(
          'Ei hakutoiveta',
          'Hakijalle ei ole hakutoiveita.',
          IlmoitusTila.ERROR
        )
      }
    }

    $scope.showMuodostaJalkiohjauskirje = false
    ParametriService($routeParams.hakuOid).then(function (privileges) {
      $scope.showMuodostaJalkiohjauskirje = privileges.valintalaskenta
    })
  },
])
