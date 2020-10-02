angular
  .module('valintalaskenta')
  .service('Hakemukset', [
    'HakukohdeHenkilotFull',
    'AtaruApplications',
    'HakuModel',
    function (HakukohdeHenkilotFull, AtaruApplications, HakuModel) {
      this.get = function (hakuOid, hakukohdeOid) {
        return HakuModel.promise.then(function (hakuModel) {
          if (hakuModel.hakuOid.ataruLomakeAvain) {
            console.log('Getting applications from ataru.')
            return AtaruApplications.get({
              hakuOid: hakuOid,
              hakukohdeOid: hakukohdeOid,
            }).$promise.then(function (ataruHakemukset) {
              if (!ataruHakemukset.length)
                console.log("Couldn't find any applications in Ataru.")
              return ataruHakemukset.map(function (hakemus) {
                //hakemus.personOid = hakemus.henkiloOid;
                hakemus.henkiloOid = hakemus.personOid
                return hakemus
              })
            })
          } else {
            console.log('Getting applications from hakuApp.')
            return HakukohdeHenkilotFull.get({
              aoOid: hakukohdeOid,
              rows: 100000,
              asId: hakuOid,
            }).$promise.then(function (hakemukset) {
              if (!hakemukset.length)
                console.log("Couldn't find any applications in Hakuapp.")
              return hakemukset
            })
          }
        })
      }
    },
  ])
  .controller('ErillishakuController', [
    '$rootScope',
    '$scope',
    '$modal',
    '$log',
    '$location',
    '$routeParams',
    '$timeout',
    '$upload',
    '$q',
    '$filter',
    'FilterService',
    'Ilmoitus',
    'IlmoitusTila',
    'Latausikkuna',
    'ValintatapajonoVienti',
    'TulosXls',
    'HakukohdeModel',
    'HakuModel',
    'HakuUtility',
    '$http',
    'AuthService',
    '_',
    'LocalisationService',
    'ErillishakuVienti',
    'ErillishakuTuonti',
    '$window',
    'HakukohdeNimiService',
    'Hyvaksymiskirjeet',
    'Kirjepohjat',
    'Kirjeet',
    'VastaanottoUtil',
    'NgTableParams',
    'TallennaValinnat',
    'Hakemukset',
    'EhdollisenHyvaksymisenEhdot',
    'ValinnanTulos',
    'Valinnantulokset',
    'ErillishakuHyvaksymiskirjeet',
    'Lukuvuosimaksut',
    'Valintaesitys',
    'valinnantuloksenHistoriaService',
    'VtsVastaanottopostiLahetetty',
    'VtsVastaanottopostiLahetaUudelleenHakemukselle',
    'VtsVastaanottopostiLahetaUudelleenHakukohteelle',
    function (
      $rootScope,
      $scope,
      $modal,
      $log,
      $location,
      $routeParams,
      $timeout,
      $upload,
      $q,
      $filter,
      FilterService,
      Ilmoitus,
      IlmoitusTila,
      Latausikkuna,
      ValintatapajonoVienti,
      TulosXls,
      HakukohdeModel,
      HakuModel,
      HakuUtility,
      $http,
      AuthService,
      _,
      LocalisationService,
      ErillishakuVienti,
      ErillishakuTuonti,
      $window,
      HakukohdeNimiService,
      Hyvaksymiskirjeet,
      Kirjepohjat,
      Kirjeet,
      VastaanottoUtil,
      NgTableParams,
      TallennaValinnat,
      Hakemukset,
      EhdollisenHyvaksymisenEhdot,
      ValinnanTulos,
      Valinnantulokset,
      ErillishakuHyvaksymiskirjeet,
      Lukuvuosimaksut,
      Valintaesitys,
      valinnantuloksenHistoriaService,
      VtsVastaanottopostiLahetetty,
      VtsVastaanottopostiLahetaUudelleenHakemukselle,
      VtsVastaanottopostiLahetaUudelleenHakukohteelle
    ) {
      'use strict'

      var valintatapajonoOid = null
      var hakemukset = []
      $scope.muokatutHakemukset = []
      $scope.hyvaksymiskirjeLahetettyCheckbox = {}
      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.hakuOid = $routeParams.hakuOid
      $scope.url = window.url
      $scope.hakukohdeModel = HakukohdeModel
      $scope.hakuModel = HakuModel
      $scope.showInvalidsOnly = false
      $scope.valintatuloksentilat = []
      $scope.pageSize = 50
      $scope.deleting = null
      $scope.ehdollisestiHyvaksyttavissaOlevatOpts = []
      $scope.excelEnabled = false
      $scope.vieExcelEnabled = false
      $scope.tuoExcelEnabled = false
      $scope.hyvaksymiskirjeetEnabled = false
      $scope.reviewUrlKey = 'haku-app.virkailija.hakemus.esikatselu'

      $scope.showEhdot = function (model, value) {
        if (value == 'muu') {
          model.ehtoInputFields = true
          model.ehtoEditableInputFields = true
          model.ehdollisenHyvaksymisenEhtoFI = ''
          model.ehdollisenHyvaksymisenEhtoSV = ''
          model.ehdollisenHyvaksymisenEhtoEN = ''
        } else {
          model.ehtoInputFields = true
          model.ehtoEditableInputFields = false
          $scope.ehdollisestiHyvaksyttavissaOlevatOpts.forEach(function (op) {
            if (op.koodiUri == value) {
              model.ehdollisenHyvaksymisenEhtoFI = op.nimiFI
              model.ehdollisenHyvaksymisenEhtoSV = op.nimiSV
              model.ehdollisenHyvaksymisenEhtoEN = op.nimiEN
            }
          })
        }
      }

      EhdollisenHyvaksymisenEhdot.query(function (result) {
        result.forEach(function (ehto) {
          $scope.ehdollisestiHyvaksyttavissaOlevatOpts.push({
            koodiUri: ehto.koodiArvo,
            nimi: _.findWhere(ehto.metadata, { kieli: 'FI' }).nimi,
            nimiFI: _.findWhere(ehto.metadata, { kieli: 'FI' }).nimi,
            nimiSV: _.findWhere(ehto.metadata, { kieli: 'SV' }).nimi,
            nimiEN: _.findWhere(ehto.metadata, { kieli: 'EN' }).nimi,
          })
        })
      })

      function valintatuloksenTilojenKielistykset(valintatuloksentilat) {
        return valintatuloksentilat.reduce(function (o, tila) {
          o[tila.value] = tila.text || tila.default_text
          return o
        }, {})
      }

      HakuModel.promise.then(function (model) {
        $scope.korkeakoulu = model.korkeakoulu
        if (model.hakuOid.ataruLomakeAvain) {
          $scope.vieExcelEnabled = true
          $scope.tuoExcelEnabled = false
          $scope.excelEnabled = false
          $scope.hyvaksymiskirjeetEnabled = false
          $scope.reviewUrlKey = 'ataru.application.review'
        } else {
          $scope.vieExcelEnabled = true
          $scope.tuoExcelEnabled = true
          $scope.excelEnabled = true
          $scope.hyvaksymiskirjeetEnabled = true
          $scope.reviewUrlKey = 'haku-app.virkailija.hakemus.esikatselu'
        }
        if ($scope.korkeakoulu) {
          $scope.valintatuloksentilat = [
            {
              value: 'KESKEN',
              text_prop: 'sijoitteluntulos.kesken',
              default_text: 'Kesken',
            },
            {
              value: 'EHDOLLISESTI_VASTAANOTTANUT',
              text_prop: 'sijoitteluntulos.ehdollisestivastaanottanut',
              default_text: 'Ehdollisesti vastaanottanut',
            },
            {
              value: 'VASTAANOTTANUT_SITOVASTI',
              text_prop: 'sijoitteluntulos.vastaanottanutsitovasti',
              default_text: 'Vastaanottanut sitovasti',
            },
            {
              value: 'EI_VASTAANOTETTU_MAARA_AIKANA',
              text_prop: 'sijoitteluntulos.eivastaanotettu',
              default_text: 'Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana',
            },
            {
              value: 'PERUNUT',
              text_prop: 'sijoitteluntulos.perunut',
              default_text: 'Perunut',
            },
            {
              value: 'PERUUTETTU',
              text_prop: 'sijoitteluntulos.peruutettu',
              default_text: 'Peruutettu',
            },
            {
              value: 'OTTANUT_VASTAAN_TOISEN_PAIKAN',
              text_prop: 'sijoitteluntulos.ottanutvastaantoisenpaikan',
              default_text: 'Ottanut vastaan toisen paikan',
              disable: true,
            },
          ]
        } else {
          $scope.valintatuloksentilat = [
            {
              value: 'KESKEN',
              text_prop: 'sijoitteluntulos.kesken',
              default_text: 'Kesken',
            },
            {
              value: 'VASTAANOTTANUT_SITOVASTI',
              text_prop: 'sijoitteluntulos.vastaanottanut',
              default_text: 'Vastaanotettu',
            },
            {
              value: 'EI_VASTAANOTETTU_MAARA_AIKANA',
              text_prop: 'sijoitteluntulos.eivastaanotettu',
              default_text: 'Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana',
            },
            {
              value: 'PERUNUT',
              text_prop: 'sijoitteluntulos.perunut',
              default_text: 'Perunut',
            },
            {
              value: 'PERUUTETTU',
              text_prop: 'sijoitteluntulos.peruutettu',
              default_text: 'Peruutettu',
            },
          ]
        }
        $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset(
          $scope.valintatuloksentilat
        )
        LocalisationService.getTranslationsForArray(
          $scope.valintatuloksentilat
        ).then(function () {
          HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid)
          $scope.valintatuloksenTilaKielistys = valintatuloksenTilojenKielistykset(
            $scope.valintatuloksentilat
          )
        })
      })

      $scope.hakemuksentilat = [
        { value: null, text_prop: '', default_text: '' },
        {
          value: 'HYLATTY',
          text_prop: 'sijoitteluntulos.hylatty',
          default_text: 'Hyl\u00E4tty',
        },
        {
          value: 'VARALLA',
          text_prop: 'sijoitteluntulos.varalla',
          default_text: 'Varalla',
        },
        {
          value: 'PERUUNTUNUT',
          text_prop: 'sijoitteluntulos.peruuntunut',
          default_text: 'Peruuntunut',
        },
        {
          value: 'VARASIJALTA_HYVAKSYTTY',
          text_prop: 'sijoitteluntulos.varasijalta',
          default_text: 'Varasijalta hyv\u00E4ksytty',
        },
        {
          value: 'HYVAKSYTTY',
          text_prop: 'sijoitteluntulos.hyvaksytty',
          default_text: 'Hyv\u00E4ksytty',
        },
        {
          value: 'PERUNUT',
          text_prop: 'sijoitteluntulos.perunut',
          default_text: 'Perunut',
        },
        {
          value: 'PERUUTETTU',
          text_prop: 'sijoitteluntulos.peruutettu',
          default_text: 'Peruutettu',
        },
      ]

      $scope.ilmoittautumistilat = [
        {
          value: 'EI_TEHTY',
          text_prop: 'sijoitteluntulos.enrollmentinfo.notdone',
          default_text: 'Ei tehty',
        },
        {
          value: 'LASNA_KOKO_LUKUVUOSI',
          text_prop: 'sijoitteluntulos.enrollmentinfo.present',
          default_text: 'Läsnä (koko lukuvuosi)',
        },
        {
          value: 'POISSA_KOKO_LUKUVUOSI',
          text_prop: 'sijoitteluntulos.enrollmentinfo.notpresent',
          default_text: 'Poissa (koko lukuvuosi)',
        },
        {
          value: 'EI_ILMOITTAUTUNUT',
          text_prop: 'sijoitteluntulos.enrollmentinfo.noenrollment',
          default_text: 'Ei ilmoittautunut',
        },
        {
          value: 'LASNA_SYKSY',
          text_prop: 'sijoitteluntulos.enrollmentinfo.presentfall',
          default_text: 'Läsnä syksy, poissa kevät',
        },
        {
          value: 'POISSA_SYKSY',
          text_prop: 'sijoitteluntulos.enrollmentinfo.notpresentfall',
          default_text: 'Poissa syksy, läsnä kevät',
        },
        {
          value: 'LASNA',
          text_prop: 'sijoitteluntulos.enrollmentinfo.presentspring',
          default_text: 'Läsnä, keväällä alkava koulutus',
        },
        {
          value: 'POISSA',
          text_prop: 'sijoitteluntulos.enrollmentinfo.notpresentspring',
          default_text: 'Poissa, keväällä alkava koulutus',
        },
        { value: '', default_text: '' },
      ]
      $scope.maksuvelvollisuus = [
        {
          value: 'NOT_CHECKED',
          text_prop: 'maksuvelvollisuus.not_checked',
          default_text: 'Ei tarkistettu',
        },
        {
          value: 'NOT_REQUIRED',
          text_prop: 'maksuvelvollisuus.not_required',
          default_text: 'Ei maksuvelvollinen',
        },
        {
          value: 'REQUIRED',
          text_prop: 'maksuvelvollisuus.required',
          default_text: 'Maksuvelvollinen',
        },
      ]
      $scope.maksuntilat = [
        {
          value: 'MAKSAMATTA',
          text_prop: 'sijoitteluntulos.maksuntila.maksamatta',
          default_text: 'Maksamatta',
        },
        {
          value: 'MAKSETTU',
          text_prop: 'sijoitteluntulos.maksuntila.maksettu',
          default_text: 'Maksettu',
        },
        {
          value: 'VAPAUTETTU',
          text_prop: 'sijoitteluntulos.maksuntila.vapautettu',
          default_text: 'Vapautettu',
        },
      ]
      $scope.valintaTuloksenTilaToHakemuksenTila = {
        EHDOLLISESTI_VASTAANOTTANUT: 'HYVAKSYTTY',
        VASTAANOTTANUT_SITOVASTI: 'HYVAKSYTTY',
        EI_VASTAANOTETTU_MAARA_AIKANA: 'PERUNUT',
        PERUNUT: 'PERUNUT',
        PERUUTETTU: 'PERUUTETTU',
        OTTANUT_VASTAAN_TOISEN_PAIKAN: 'PERUUNTUNUT',
      }

      $scope.objectIsEmpty = function (obj) {
        return _.isEmpty(obj)
      }

      $scope.validateHakemuksenTilat = function (hakemus) {
        if (
          hakemus.hakemuksentila == null &&
          hakemus.valintatuloksentila == 'KESKEN'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'HYLATTY' &&
          hakemus.valintatuloksentila == 'KESKEN'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'VARALLA' &&
          hakemus.valintatuloksentila == 'KESKEN'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'PERUUNTUNUT' &&
          hakemus.valintatuloksentila == 'KESKEN'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'PERUUNTUNUT' &&
          hakemus.valintatuloksentila == 'OTTANUT_VASTAAN_TOISEN_PAIKAN'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'PERUNUT' &&
          hakemus.valintatuloksentila == 'EI_VASTAANOTETTU_MAARA_AIKANA'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'VARASIJALTA_HYVAKSYTTY' &&
          hakemus.valintatuloksentila == 'KESKEN'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'VARASIJALTA_HYVAKSYTTY' &&
          hakemus.valintatuloksentila == 'EHDOLLISESTI_VASTAANOTTANUT'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'VARASIJALTA_HYVAKSYTTY' &&
          hakemus.valintatuloksentila == 'VASTAANOTTANUT_SITOVASTI'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'HYVAKSYTTY' &&
          hakemus.valintatuloksentila == 'KESKEN'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'HYVAKSYTTY' &&
          hakemus.valintatuloksentila == 'EHDOLLISESTI_VASTAANOTTANUT'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'HYVAKSYTTY' &&
          hakemus.valintatuloksentila == 'VASTAANOTTANUT_SITOVASTI'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'PERUNUT' &&
          hakemus.valintatuloksentila == 'PERUNUT'
        )
          hakemus.isValid = true
        else if (
          hakemus.hakemuksentila == 'PERUUTETTU' &&
          hakemus.valintatuloksentila == 'PERUUTETTU'
        )
          hakemus.isValid = true
        else hakemus.isValid = false

        if (!(hakemus.etunimi && hakemus.sukunimi)) {
          hakemus.isValid = false
        }
      }

      $scope.invalidsAmount = function () {
        return _(hakemukset).filter(function (hakemus) {
          return hakemus.isValid == false
        }).length
      }

      $scope.changeVastaanottoTieto = function (hakemus) {
        $scope.setHakemuksenTilaToVastaanottoTila(hakemus)
        $scope.addMuokattuHakemus(hakemus)
      }

      $scope.setHakemuksenTilaToVastaanottoTila = function (hakemus) {
        if (hakemus.valintatuloksentila != 'KESKEN') {
          if ($scope.hakemusIsVarasijaltaHyvaksytty(hakemus)) {
            hakemus.hakemuksentila = 'VARASIJALTA_HYVAKSYTTY'
          } else {
            hakemus.hakemuksentila =
              $scope.valintaTuloksenTilaToHakemuksenTila[
                hakemus.valintatuloksentila
              ]
          }
        }
      }

      $scope.parseHakemuksenTila = function (hakemus) {
        var text = ''
        if (
          hakemus.valintatuloksentila == 'EI_VASTAANOTETTU_MAARA_AIKANA' &&
          hakemus.hakemuksentila == 'PERUNUT'
        ) {
          text = 'Peruuntunut'
        } else {
          _($scope.hakemuksentilat).filter(function (tila) {
            if (hakemus.hakemuksentila == tila.value)
              text = tila.text || tila.default_text
          })
        }
        return text
      }

      $scope.hakemusIsVarasijaltaHyvaksytty = function (hakemus) {
        return (
          (hakemus.hakemuksentila == 'VARALLA' ||
            hakemus.hakemuksentila == 'VARASIJALTA_HYVAKSYTTY') &&
          (hakemus.valintatuloksentila == 'EHDOLLISESTI_VASTAANOTTANUT' ||
            hakemus.valintatuloksentila == 'VASTAANOTTANUT_SITOVASTI')
        )
      }

      $scope.isValinnantilanKuvauksenTekstiVisible = function (model) {
        return model.allowValinnantilanKuvauksenTekstiVisibility
      }

      $scope.isValinnantilanKuvauksenEsikatseluVisible = function (model) {
        return (
          model.hakemuksentila &&
          model.hakemuksentila === 'HYLATTY' &&
          (!_.isEmpty(model.valinnantilanKuvauksenTekstiFI) ||
            !_.isEmpty(model.valinnantilanKuvauksenTekstiSV) ||
            !_.isEmpty(model.valinnantilanKuvauksenTekstiEN))
        )
      }

      $scope.valinnantilanKuvauksenEsikatseluteksti = function (model) {
        var langcode = ($rootScope.userLang || 'fi').toUpperCase()
        var valinnantilanKuvausValitullaKielella =
          model['valinnantilanKuvauksenTeksti' + langcode]
        return _.isEmpty(valinnantilanKuvausValitullaKielella)
          ? model.valinnantilanKuvauksenTekstiFI ||
              model.valinnantilanKuvauksenTekstiSV ||
              model.valinnantilanKuvauksenTekstiEN
          : valinnantilanKuvausValitullaKielella
      }

      $scope.showEhdollinenHyvaksynta = function () {
        return !HakuUtility.isToinenAsteKohdeJoukko(
          HakuModel.hakuOid.kohdejoukkoUri
        )
      }

      $q.all([
        LocalisationService.getTranslationsForArray($scope.hakemuksentilat),
        LocalisationService.getTranslationsForArray($scope.ilmoittautumistilat),
        LocalisationService.getTranslationsForArray($scope.maksuvelvollisuus),
        LocalisationService.getTranslationsForArray($scope.maksuntilat),
      ]).then(function () {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid)
      })

      $scope.isVaaraVastaanottotila = function (tila) {
        return tila === 'VASTAANOTTANUT'
      }

      $scope.isVastaanottanut = function (tila) {
        return tila === 'VASTAANOTTANUT_SITOVASTI'
      }

      var isKeinotekoinenOid = function (oid) {
        return !oid ? false : /MISSING/.test(oid)
      }

      var addKeinotekoinenOidIfMissing = function (valintatapajono) {
        if (!valintatapajono.oid) {
          valintatapajono.oid = 'MISSING_OID'
        }
      }

      var toLowerStripUnderscore = function (str) {
        return str.toLowerCase().replace('_', ' ')
      }

      var multiFilter = function (value, index, array) {
        if (_.isEmpty($scope.filters)) return true
        return _.some(
          _.map($scope.filters, function (val, key) {
            if (value[key] == null) return false
            return (
              toLowerStripUnderscore(value[key]).indexOf(
                toLowerStripUnderscore(val)
              ) > -1
            )
          })
        )
      }

      var createTableParamsForValintatapaJono = function (valintatapajono) {
        if (valintatapajono.oid) {
          $scope.tableParams = new NgTableParams(
            {
              page: 1,
              count: 50,
              filters: {
                sukunimi: '',
                etunimi: '',
              },
              sorting: {
                sukunimi: 'asc',
                etunimi: 'desc',
              },
            },
            {
              total: valintatapajono.hakemukset.length,
              getData: function ($defer, params) {
                var filters = FilterService.fixFilterWithNestedProperty(
                  params.filter()
                )

                // remove empty filters
                _.map(filters, function (val, key) {
                  if (!val) delete filters[key]
                })

                // Implement first and last name filtering with only 1 search box.
                // Has to be done with $scope.filters since custom filter functions cannot take filters as params AFAIK.
                if ('sukunimi' in filters) filters.etunimi = filters.sukunimi
                $scope.filters = filters

                var orderedData = params.sorting()
                  ? $filter('orderBy')(
                      valintatapajono.hakemukset,
                      params.orderBy()
                    )
                  : valintatapajono.hakemukset

                orderedData = $scope.showInvalidsOnly
                  ? _(orderedData).filter(function (o) {
                      return !o.isValid
                    })
                  : orderedData

                orderedData = params.filter()
                  ? $filter('filter')(orderedData, multiFilter)
                  : orderedData

                $scope.filters = {}
                $defer.resolve(
                  orderedData.slice(
                    (params.page() - 1) * params.count(),
                    params.page() * params.count()
                  )
                )
              },
            }
          )
        }
      }

      var enrichHakemuksetWithHakijat = function (
        valintatapajono,
        kaikkiHakemukset
      ) {
        valintatapajono.hakemukset.map(function (hakemus) {
          var henkilo = kaikkiHakemukset.find(function (henkilonHakemus) {
            return henkilonHakemus.personOid == hakemus.hakijaOid
          })
          if (henkilo) {
            {
              hakemus.etunimi = henkilo.etunimet
                ? henkilo.etunimet
                : henkilo.answers.henkilotiedot.Etunimet
              hakemus.sukunimi = henkilo.sukunimi
                ? henkilo.sukunimi
                : henkilo.answers.henkilotiedot.Sukunimi
            }
          } else {
            console.log(
              'Ei löytynyt henkilon ',
              hakemus.hakijaOid,
              ' hakemusta.'
            )
          }
        })
        return valintatapajono
      }

      var addHakemuksetWithoutValinnantulos = function (
        kaikkiHakemukset,
        valintatapajono
      ) {
        var valintatapajononHakemusOidit = _.map(
          valintatapajono.hakemukset,
          function (h) {
            return h.hakemusOid
          }
        )
        var missingHakemukset = _.filter(kaikkiHakemukset, function (hakemus) {
          return !_.contains(valintatapajononHakemusOidit, hakemus.oid)
        })
        Array.prototype.push.apply(
          valintatapajono.hakemukset,
          _.map(missingHakemukset, createHakemusWithoutValinnantulos)
        )
      }

      var createHakemusWithoutValinnantulos = function (hakemus) {
        return {
          hakijaOid: hakemus.personOid,
          hakemusOid: hakemus.oid,
        }
      }

      var processErillishaku = function (
        valintatapajono,
        oidToMaksuvelvollisuus,
        lukuvuosimaksut,
        lahetetytVastaanottoPostit
      ) {
        addKeinotekoinenOidIfMissing(valintatapajono)
        createTableParamsForValintatapaJono(valintatapajono)
        fetchAndPopulateVastaanottoAikaraja(
          $routeParams.hakuOid,
          $routeParams.hakukohdeOid,
          valintatapajono.hakemukset
        )

        valintatapajono.hakemukset.forEach(function (hakemus) {
          $scope.hyvaksymiskirjeLahetettyCheckbox[
            hakemus.hakijaOid
          ] = !!hakemus.hyvaksymiskirjeLahetetty
          if (
            hakemus.valintatuloksentila === '' ||
            !_.isString(hakemus.valintatuloksentila)
          ) {
            hakemus.valintatuloksentila = 'KESKEN'
          }
          if (oidToMaksuvelvollisuus[hakemus.hakemusOid]) {
            hakemus.maksuvelvollisuus =
              oidToMaksuvelvollisuus[hakemus.hakemusOid]
            hakemus.loytyiHakemuksista = true
          } else {
            hakemus.maksuvelvollisuus = 'NOT_CHECKED'
            hakemus.loytyiHakemuksista = false
          }
          hakemus.vastaanottopostiSent =
            lahetetytVastaanottoPostit.indexOf(hakemus.hakemusOid) > -1
          if ('REQUIRED' === hakemus.maksuvelvollisuus) {
            hakemus.isMaksuvelvollinen = true
            var lukuvuosimaksu = _.find(lukuvuosimaksut, {
              personOid: hakemus.hakijaOid,
            })
            if (lukuvuosimaksu) {
              hakemus.muokattuMaksuntila = lukuvuosimaksu.maksuntila
              hakemus.maksuntila = lukuvuosimaksu.maksuntila
            } else {
              hakemus.muokattuMaksuntila = 'MAKSAMATTA'
              hakemus.maksuntila = 'MAKSAMATTA'
            }
          }
          $scope.validateHakemuksenTilat(hakemus)
        })

        valintatapajonoOid = valintatapajono.oid
        hakemukset = valintatapajono.hakemukset
      }

      var getErillishaunValinnantuloksetFromVts = function () {
        return $q
          .all([
            ValinnanTulos.get(
              { hakukohdeOid: $scope.hakukohdeOid, hakuOid: $scope.hakuOid },
              { headers: { 'Cache-Control': 'no-cache, no-store' } }
            ),
            ErillishakuHyvaksymiskirjeet.get({
              hakukohdeOid: $scope.hakukohdeOid,
            }).$promise,
          ])
          .then(
            function (result) {
              $scope.valintatapajonoLastModified = result[0].headers(
                'X-Last-Modified'
              )
              var hakemukset = result[0].data
              var kirjeLahetetty = result[1].reduce(function (acc, kirje) {
                acc[kirje.henkiloOid] = new Date(kirje.lahetetty)
                return acc
              }, {})
              hakemukset.forEach(function (hakemus) {
                hakemus.hyvaksymiskirjeLahetetty =
                  kirjeLahetetty[hakemus.henkiloOid] || null
              })
              return hakemukset
            },
            function (error) {
              console.log(error)
            }
          )
      }

      var getErillishaunValinnantulokset = function () {
        var fromVts = getErillishaunValinnantuloksetFromVts()
        return fromVts.then(function (vt) {
          vt.forEach(function (v) {
            v.hakijaOid = v.henkiloOid
            v.hakemuksentila = v.valinnantila
            v.valintatuloksentila = v.vastaanottotila
            v.loytyiSijoittelusta = true
            v.vastaanottoAikaraja = v.vastaanottoDeadline
          })
          return {
            oid: vt.length === 0 ? null : vt[0].valintatapajonoOid,
            hakemukset: vt,
          }
        })
      }

      var getHakuappHakemusMaksuvelvollisuus = function (
        hakemus,
        hakukohdeOid
      ) {
        var eligibility = _.find(hakemus.preferenceEligibilities, {
          aoId: hakukohdeOid,
        })
        if (eligibility && eligibility.maksuvelvollisuus) {
          return eligibility.maksuvelvollisuus
        } else return null
      }

      var getAtaruHakemusMaksuvelvollisuus = function (hakemus, hakukohdeOid) {
        if (hakemus.hakutoiveet) {
          var hakutoive = hakemus.hakutoiveet.filter(function (h) {
            return h.hakukohdeOid === hakukohdeOid
          })[0]

          var paymentObligation = hakutoive ? hakutoive.paymentObligation : null
          switch (paymentObligation) {
            case 'obligated':
              return 'REQUIRED'
            case 'not-obligated':
              return 'NOT_REQUIRED'
            default:
              return null
          }
        } else return null
      }

      var getMaksuvelvollisuudet = function (hakemukset, hakukohdeOid) {
        return _.reduce(
          _.map(hakemukset, function (hakemus) {
            var maksuvelvollisuus =
              getHakuappHakemusMaksuvelvollisuus(hakemus, hakukohdeOid) ||
              getAtaruHakemusMaksuvelvollisuus(hakemus, hakukohdeOid) ||
              'NOT_CHECKED'
            return { oid: hakemus.oid, maksuvelvollisuus: maksuvelvollisuus }
          }),
          function (result, hakemus) {
            result[hakemus.oid] = hakemus.maksuvelvollisuus
            return result
          },
          {}
        )
      }

      $q.all([
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid),
        Hakemukset.get($routeParams.hakuOid, $routeParams.hakukohdeOid),
        Lukuvuosimaksut.get({ hakukohdeOid: $routeParams.hakukohdeOid }),
        getErillishaunValinnantulokset(),
        VtsVastaanottopostiLahetetty.get({
          hakukohdeOid: $routeParams.hakukohdeOid,
        }).$promise,
      ]).then(function (resolved) {
        AuthService.updateOrg(
          'APP_SIJOITTELU',
          HakukohdeModel.organisationOidsForAuthorisation
        ).then(function () {
          $scope.updateOrg = true
        })
        var kaikkiHakemukset = resolved[1]
        var maksuvelvollisuudet = getMaksuvelvollisuudet(
          kaikkiHakemukset,
          $routeParams.hakukohdeOid
        )
        var lukuvuosimaksut = resolved[2].data
        var valintatapajono = resolved[3]
        var lahetetytVastaanottoPostit = resolved[4]
        addHakemuksetWithoutValinnantulos(kaikkiHakemukset, valintatapajono)
        var enrichedValintatapajono = enrichHakemuksetWithHakijat(
          valintatapajono,
          kaikkiHakemukset
        )
        processErillishaku(
          enrichedValintatapajono,
          maksuvelvollisuudet,
          lukuvuosimaksut,
          lahetetytVastaanottoPostit
        )
      })

      $scope.updateHyvaksymiskirjeLahetetty = function (hakemus) {
        hakemus.hyvaksymiskirjeLahetetty = $scope
          .hyvaksymiskirjeLahetettyCheckbox[hakemus.hakijaOid]
          ? new Date()
          : null
        $scope.addMuokattuHakemus(hakemus)
      }

      var hakemusToErillishakuRivi = function (hakemus) {
        return {
          etunimi: hakemus.etunimi,
          sukunimi: hakemus.sukunimi,
          henkilotunnus: hakemus.henkilotunnus,
          sahkoposti: hakemus.sahkoposti,
          syntymaAika: hakemus.syntymaaika,
          personOid: hakemus.hakijaOid,
          hakemuksenTila: hakemus.hakemuksentila,
          ehdollisestiHyvaksyttavissa: hakemus.ehdollisestiHyvaksyttavissa,
          ehdollisenHyvaksymisenEhtoKoodi:
            hakemus.ehdollisenHyvaksymisenEhtoKoodi,
          ehdollisenHyvaksymisenEhtoFI: hakemus.ehdollisenHyvaksymisenEhtoFI,
          ehdollisenHyvaksymisenEhtoSV: hakemus.ehdollisenHyvaksymisenEhtoSV,
          ehdollisenHyvaksymisenEhtoEN: hakemus.ehdollisenHyvaksymisenEhtoEN,
          valinnantilanKuvauksenTekstiFI:
            hakemus.valinnantilanKuvauksenTekstiFI,
          valinnantilanKuvauksenTekstiSV:
            hakemus.valinnantilanKuvauksenTekstiSV,
          valinnantilanKuvauksenTekstiEN:
            hakemus.valinnantilanKuvauksenTekstiEN,
          maksuvelvollisuus: hakemus.maksuvelvollisuus
            ? hakemus.maksuvelvollisuus
            : 'NOT_CHECKED',
          hyvaksymiskirjeLahetetty: hakemus.hyvaksymiskirjeLahetetty,
          vastaanottoTila: hakemus.valintatuloksentila,
          ilmoittautumisTila: hakemus.ilmoittautumistila,
          poistetaankoRivi: hakemus.poistetaankoRivi,
          julkaistaankoTiedot: hakemus.julkaistavissa,
          hakemusOid: hakemus.hakemusOid,
          ehtoEditableInputFields:
            hakemus.ehdollisenHyvaksymisenEhtoKoodi == 'muu',
          ehtoInputFields: hakemus.ehdollisestiHyvaksyttavissa, // use this
        }
      }

      var submitLukuvuosimaksut = function (hakemukset) {
        var muokatutMaksuntilat = _.filter(hakemukset, function (h) {
          return h.maksuntila !== h.muokattuMaksuntila
        })
        if (muokatutMaksuntilat.length !== 0) {
          var lukuvuosimaksut = _.map(muokatutMaksuntilat, function (hakemus) {
            return {
              personOid: hakemus.hakijaOid,
              maksuntila: hakemus.muokattuMaksuntila,
            }
          })
          return Lukuvuosimaksut.post(
            { hakukohdeOid: $scope.hakukohdeOid },
            lukuvuosimaksut
          )
        } else {
          return $q.resolve()
        }
      }

      var saveChanges = function () {
        if (($scope.muokatutHakemukset || []).length === 0) {
          return $q.resolve()
        }
        $scope.muokatutHakemukset.forEach(function (muokattuHakemus) {
          if (muokattuHakemus.hakemuksentila !== 'HYLATTY') {
            muokattuHakemus.valinnantilanKuvauksenTekstiFI = null
            muokattuHakemus.valinnantilanKuvauksenTekstiSV = null
            muokattuHakemus.valinnantilanKuvauksenTekstiEN = null
          }
        })
        return submitLukuvuosimaksut($scope.muokatutHakemukset)
          .then(function () {
            var erillishakuRivit = _.map(
              $scope.muokatutHakemukset,
              hakemusToErillishakuRivi
            )
            return ErillishakuTuonti.tuo(
              { rivit: erillishakuRivit },
              {
                params: $scope.erillisHakuTuontiParams(valintatapajonoOid),
                headers: {
                  'If-Unmodified-Since':
                    $scope.valintatapajonoLastModified ||
                    new Date().toUTCString(),
                },
              }
            )
          })
          .then(function (response) {
            var id = { id: response.data.id }
            var p = $q.defer()
            Latausikkuna.avaaKustomoitu(
              id,
              'Tallennetaan muutokset.',
              IlmoitusTila.INFO,
              '',
              '../common/modaalinen/erillishakutallennus.html',
              function (dokumenttiId) {
                if (dokumenttiId) {
                  p.resolve()
                } else {
                  p.reject()
                }
              }
            )
            return p.promise
          })
      }

      $scope.submitIlmanLaskentaa = function () {
        saveChanges().then(
          function () {
            $window.location.reload()
          },
          function (response) {
            console.log(response)
            LocalisationService.getTranslation(
              'erillishaku.odottamatonvirhe'
            ).then(function (messageTranslated) {
              Ilmoitus.avaa(
                'Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.',
                messageTranslated,
                IlmoitusTila.ERROR
              )
            })
          }
        )
      }

      $scope.addMuokattuHakemus = function (hakemus) {
        if (hakemus) {
          if ($scope.muokatutHakemukset.indexOf(hakemus) === -1) {
            $scope.muokatutHakemukset.push(hakemus)
          }
          $scope.validateHakemuksenTilat(hakemus)
        }
      }

      $scope.paivitaHakemuksenValintatila = function (hakemus) {
        if (hakemus) {
          hakemus.allowValinnantilanKuvauksenTekstiVisibility =
            hakemus.hakemuksentila === 'HYLATTY'
        }
        $scope.addMuokattuHakemus(hakemus)
      }

      $scope.closeValinnantilanKuvauksenTeksti = function (model) {
        model.allowValinnantilanKuvauksenTekstiVisibility = false
      }

      $scope.openValinnantilanKuvauksenTeksti = function (model) {
        model.allowValinnantilanKuvauksenTekstiVisibility = true
      }

      $scope.getHakutyyppi = function () {
        if ($scope.hakuModel.korkeakoulu) {
          return 'KORKEAKOULU'
        } else {
          return 'TOISEN_ASTEEN_OPPILAITOS'
        }
      }

      $scope.erillisHakuTuontiParams = function (valintatapajonoOid) {
        return {
          hakutyyppi: $scope.getHakutyyppi(),
          hakukohdeOid: $scope.hakukohdeOid,
          hakuOid: $routeParams.hakuOid,
          tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
          valintatapajonoOid: isKeinotekoinenOid(valintatapajonoOid)
            ? null
            : valintatapajonoOid,
        }
      }

      $scope.erillishaunVientiXlsx = function () {
        var hakutyyppi = $scope.getHakutyyppi()
        ErillishakuVienti.vie(
          {
            hakutyyppi: hakutyyppi,
            hakukohdeOid: $scope.hakukohdeOid,
            hakuOid: $routeParams.hakuOid,
            tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
            valintatapajonoOid: isKeinotekoinenOid(valintatapajonoOid)
              ? null
              : valintatapajonoOid,
          },
          {},
          function (id) {
            Latausikkuna.avaa(
              id,
              'Erillishaun hakukohteen vienti taulukkolaskentaan',
              ''
            )
          },
          function () {
            Ilmoitus.avaa(
              'Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.',
              IlmoitusTila.ERROR
            )
          }
        )
      }

      $scope.erillishaunTuontiXlsx = function ($files) {
        var file = $files[0]
        var fileReader = new FileReader()
        fileReader.readAsArrayBuffer(file)
        var hakukohdeOid = $scope.hakukohdeOid
        var hakuOid = $routeParams.hakuOid
        var hakutyyppi = $scope.getHakutyyppi()

        var params = {
          hakuOid: hakuOid,
          hakukohdeOid: hakukohdeOid,
          hakutyyppi: hakutyyppi,
        }
        if (!isKeinotekoinenOid(valintatapajonoOid)) {
          params.valintatapajonoOid = valintatapajonoOid
        }
        fileReader.onload = function (e) {
          $scope.upload = $upload
            .http({
              url: window.url(
                'valintalaskentakoostepalvelu.erillishaku.tuonti',
                params
              ),
              method: 'POST',
              headers: {
                'Content-Type': 'application/octet-stream',
                'If-Unmodified-Since':
                  $scope.valintatapajonoLastModified ||
                  new Date().toUTCString(),
              },
              data: e.target.result,
            })
            .progress(function (evt) {})
            .success(function (id, status, headers, config) {
              Latausikkuna.avaaKustomoitu(
                id,
                'Erillishaun hakukohteen tuonti',
                IlmoitusTila.INFO,
                '',
                '../common/modaalinen/tuontiikkuna.html',
                function (dokumenttiId) {
                  // tee paivitys
                  $window.location.reload()
                }
              )
            })
            .error(function (data) {
              console.log(data)
            })
        }
      }

      $scope.luoHyvaksymiskirjeetPDF = function (hakemusOids) {
        var hakukohde = $scope.hakukohdeModel.hakukohde
        var tag = $routeParams.hakukohdeOid
        Kirjeet.hyvaksymiskirjeet({
          hakuOid: $routeParams.hakuOid,
          hakukohdeOid: $routeParams.hakukohdeOid,
          hakemusOids: hakemusOids,
          tarjoajaOid: hakukohde.tarjoajaOids[0],
          hakukohdeNimi: $scope.hakukohdeModel.hakukohdeNimi,
          tag: tag,
          langcode: HakukohdeNimiService.getOpetusKieliCode(hakukohde),
          templateName: 'hyvaksymiskirje',
        })
      }

      $scope.selectEiVastanotettuMaaraaikanaToAll = function () {
        var valintatulokset = _.map(hakemukset, function (hakemus) {
          return {
            julkaistavissa: hakemus.julkaistavissa,
            ehdollisestiHyvaksyttavissa: hakemus.ehdollisestiHyvaksyttavissa,
            ehdollisenHyvaksymisenEhtoKoodi:
              hakemus.ehdollisenHyvaksymisenEhtoKoodi,
            ehdollisenHyvaksymisenEhtoFI: hakemus.ehdollisenHyvaksymisenEhtoFI,
            ehdollisenHyvaksymisenEhtoSV: hakemus.ehdollisenHyvaksymisenEhtoSV,
            ehdollisenHyvaksymisenEhtoEN: hakemus.ehdollisenHyvaksymisenEhtoEN,
            hyvaksymiskirjeLahetetty: hakemus.hyvaksymiskirjeLahetetty,
            tila: hakemus.valintatuloksentila,
            vastaanottoAikarajaMennyt: hakemus.vastaanottoAikarajaMennyt,
            tilaHakijalle: hakemus.valintatuloksenTilaHakijalle,
            hakemusOid: hakemus.hakemusOid,
            hakijaOid: hakemus.hakijaOid,
          }
        })

        VastaanottoUtil.merkitseMyohastyneeksi(valintatulokset)
        _.forEach(valintatulokset, function (valintatulos) {
          if (
            valintatulos.muokattuVastaanottoTila &&
            valintatulos.muokattuVastaanottoTila !== valintatulos.tila
          ) {
            var vastaavaHakemus = _.find(hakemukset, function (hakemus) {
              return hakemus.hakemusOid === valintatulos.hakemusOid
            })
            vastaavaHakemus.valintatuloksentila =
              valintatulos.muokattuVastaanottoTila
            vastaavaHakemus.hakemuksentila =
              $scope.valintaTuloksenTilaToHakemuksenTila[
                valintatulos.muokattuVastaanottoTila
              ]
            $scope.addMuokattuHakemus(vastaavaHakemus)
          }
        })
      }

      $scope.selectIlmoitettuToAll = function () {
        var counter = 0
        counter = hakemukset.filter(function (hakemus) {
          return !hakemus.julkaistavissa && hakemus.hakemuksentila
        }).length
        var reload = document.location.reload.bind(document.location)
        TallennaValinnat.avaa(
          'Hyväksy jonon valintaesitys',
          'Olet hyväksymässä ' + counter + ' kpl. hakemuksia.',
          function () {
            return saveChanges()
              .then(function () {
                var p = Valintaesitys.hyvaksy(valintatapajonoOid)
                p = $q.resolve()
                return p.then(function () {
                  return 'Valintaesitys hyväksytty'
                })
              })
              .catch(function (response) {
                var msg = 'Valintaesityksen hyväksyntä epäonnistui'
                if (response && response.data && response.data.error) {
                  msg = response.data.error
                }
                return $q.reject({
                  message: msg,
                  errorRows: [],
                })
              })
          }
        ).then(reload, reload)
      }

      $scope.disableButton = function (button) {
        angular.element(button).off('click')
        angular.element(button).attr('disabled', true)
      }

      $scope.removeHakemusRow = function (hakemus, eventTarget) {
        $(eventTarget).closest('tr').find('td > div').slideUp()
        $timeout(function () {
          hakemukset = _(hakemukset).filter(function (o) {
            return o.hakemusOid != hakemus.hakemusOid
          })
          $scope.tableParams.reload()
        }, 500)
      }

      $scope.removeHakemus = function (hakemus, $event) {
        $timeout.cancel($scope.deleting)
        $scope.deleting = null
        $scope.disableButton(angular.element($event.target).prev())
        $scope.removeHakemusRow(hakemus, $event.target)
        hakemus.poistetaankoRivi = true

        console.log(hakemusToErillishakuRivi(hakemus))
        ErillishakuTuonti.tuo(
          { rivit: [hakemusToErillishakuRivi(hakemus)] },
          {
            params: $scope.erillisHakuTuontiParams(valintatapajonoOid),
            headers: {
              'If-Unmodified-Since':
                $scope.valintatapajonoLastModified || new Date().toUTCString(),
            },
          }
        )
          .success(function (res, status, headers, config) {
            console.log(res)
          })
          .error(function (e) {
            console.log(e)
          })
      }

      $scope.handleRemoveHakemus = function (hakemus, $event) {
        if (!$scope.deleting) {
          angular.element($event.target).hide().next().show()
          angular
            .element($event.target)
            .parent('td')
            .siblings()
            .addClass('deleting-row')
          $scope.deleting = $timeout(function () {
            $scope.deleting = null
            angular.element($event.target).next().hide()
            angular.element($event.target).show()
            angular
              .element($event.target)
              .parent('td')
              .siblings()
              .removeClass('deleting-row')
          }, 3000)
        }
      }

      $scope.openValinnantuloksenHistoriaModal = function (
        valintatapajonoOid,
        hakemusOid
      ) {
        $modal.open({
          templateUrl: 'vtsLogModal.html',
          controller: 'ValinnantuloksenHistoriaModalController',
          size: 'lg',
          resolve: {
            historia: function () {
              return valinnantuloksenHistoriaService.get(
                valintatapajonoOid,
                hakemusOid
              )
            },
          },
        })
      }

      $scope.resendVastaanottopostiForHakukohde = function () {
        VtsVastaanottopostiLahetaUudelleenHakukohteelle.post({
          hakukohdeOid: $routeParams.hakukohdeOid,
        })
          .$promise.then(function (data) {
            var msg =
              !data || !data.length
                ? 'Ei lähetettäviä sähköposteja.'
                : 'Sähköpostin lähetys onnistui!\n' + data.join(', ')
            Ilmoitus.avaa(
              'Paikka vastaanotettavissa -sähköpostin uudelleenlähetys',
              msg,
              IlmoitusTila.INFO
            )
          })
          .catch(function (err) {
            console.log(err)
            Ilmoitus.avaa(
              'Paikka vastaanotettavissa -sähköpostin uudelleenlähetys',
              'Sähköpostin lähetys epäonnistui! ' + err.statusText,
              IlmoitusTila.ERROR
            )
          })
      }

      $scope.resendVastaanottopostiForHakemus = function (hakemus) {
        VtsVastaanottopostiLahetaUudelleenHakemukselle.post({
          hakemusOid: hakemus.hakemusOid,
        })
          .$promise.then(function (data) {
            hakemus.vastaanottopostiSent = false
            var msg =
              !data || !data.length
                ? 'Ei lähetettäviä sähköposteja.'
                : 'Sähköpostin lähetys onnistui!\n' + data.join(', ')
            Ilmoitus.avaa(
              'Paikka vastaanotettavissa -sähköpostin uudelleenlähetys',
              msg,
              IlmoitusTila.INFO
            )
          })
          .catch(function (err) {
            console.log(err)
            Ilmoitus.avaa(
              'Paikka vastaanotettavissa -sähköpostin uudelleenlähetys',
              'Sähköpostin lähetys epäonnistui! ' + err.statusText,
              IlmoitusTila.ERROR
            )
          })
      }

      function fetchAndPopulateVastaanottoAikaraja(
        hakuOid,
        hakukohdeOid,
        kaikkiHakemukset
      ) {
        var oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon = _.map(
          _.filter(kaikkiHakemukset, function (h) {
            return (
              h.valintatuloksentila === 'KESKEN' &&
              h.julkaistavissa &&
              (h.hakemuksentila === 'HYVAKSYTTY' ||
                h.hakemuksentila === 'VARASIJALTA_HYVAKSYTTY' ||
                h.hakemuksentila === 'PERUNUT')
            )
          }),
          function (relevanttiHakemus) {
            return relevanttiHakemus.hakemusOid
          }
        )

        var dataLoadedCallback = _.noop
        VastaanottoUtil.fetchAndPopulateVastaanottoDeadlineDetailsAsynchronously(
          hakuOid,
          hakukohdeOid,
          kaikkiHakemukset,
          oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon,
          dataLoadedCallback
        )
      }
    },
  ])
