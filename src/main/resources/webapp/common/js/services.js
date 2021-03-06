angular
  .module('oph.services', [])

  .service('Utility', [
    function () {
      // Returns a function, that, as long as it continues to be invoked, will not
      // be triggered. The function will be called after it stops being called for
      // N milliseconds. If `immediate` is passed, trigger the function on the
      // leading edge, instead of the trailing.
      this.debounce = function (func, wait, immediate) {
        var timeout
        return function () {
          var context = this,
            args = arguments
          var later = function () {
            timeout = null
            if (!immediate) func.apply(context, args)
          }
          var callNow = immediate && !timeout
          clearTimeout(timeout)
          timeout = setTimeout(later, wait)
          if (callNow) func.apply(context, args)
        }
      }
    },
  ])

  .factory('HakuHelper', [
    function () {
      'use strict'
      var service = {
        setErillishaku: function (haku) {
          var hakutyyppi = haku.hakutyyppiUri
          var hakutapa = haku.hakutapaUri

          var erillishakutapaRegExp = /(hakutapa_02).*/
          var jatkuvahakuRegExp = /(hakutapa_03).*/
          var lisahakutyyppiRegExp = /(hakutyyppi_03).*/

          var matchErillishaku = erillishakutapaRegExp.exec(hakutapa)
          var matchJatkuvahaku = jatkuvahakuRegExp.exec(hakutapa)
          var matchLisahaku = lisahakutyyppiRegExp.exec(hakutyyppi)

          ;(matchErillishaku || matchJatkuvahaku || matchLisahaku) &&
          !haku.sijoittelu
            ? (haku.erillishaku = true)
            : (haku.erillishaku = false)
          return haku
        },
      }
      return service
    },
  ])

  .factory('Korkeakoulu', [
    function () {
      'use strict'
      var service = {
        isKorkeakoulu: function (kohdejoukkoUri) {
          var returnValue = false
          if (kohdejoukkoUri) {
            returnValue = kohdejoukkoUri.indexOf('_12') !== -1
          }
          return returnValue
        },
      }
      return service
    },
  ])

  .factory('HakukohdeNimiService', [
    '_',
    '$rootScope',
    function (_, $rootScope) {
      'use strict'

      function normalizeLangMap(rawLangMap) {
        var langMap = {}
        _.each(rawLangMap, function (label, langKey) {
          langMap[langKey.replace('kieli_', '')] = label
        })
        return langMap
      }

      function getTranslation(rawLangMap) {
        var lang = $rootScope.userLang || ''
        var translations = normalizeLangMap(rawLangMap)
        return (
          translations[lang.toLowerCase()] ||
          translations.fi ||
          translations.sv ||
          translations.en
        )
      }

      var service = {
        getOpetusKieli: function (hakukohde) {
          if (hakukohde) {
            var opetuskielet = hakukohde.opetusKielet

            if (opetuskielet) {
              if (opetuskielet.indexOf('kieli_fi') != -1) return 'kieli_fi'
              else if (opetuskielet.indexOf('kieli_sv') != -1) return 'kieli_sv'
              else if (opetuskielet.indexOf('kieli_en') != -1) return 'kieli_en'
            }
          }
          return 'kieli_fi'
        },

        getOpetusKieliCode: function (hakukohde) {
          var language = this.getOpetusKieli(hakukohde)
          return _.last(language.split('_')).toUpperCase()
        },

        getTarjoajaNimi: function (hakukohde) {
          return getTranslation(
            hakukohde.tarjoajaNimi || hakukohde.tarjoajaNimet
          )
        },

        getHakukohdeNimi: function (hakukohde) {
          return getTranslation(
            hakukohde.hakukohdeNimi || hakukohde.hakukohteenNimet
          )
        },
      }
      return service
    },
  ])
  .factory('FilterService', [
    function () {
      'use strict'
      var service = {
        fixFilterWithNestedProperty: function (params) {
          var filters = {}
          angular.forEach(params, function (value, key) {
            if (key.indexOf('.') === -1) {
              filters[key] = value
              return
            }

            var createObjectTree = function (tree, properties, value) {
              if (!properties.length) {
                return value
              }

              var prop = properties.shift()

              if (!prop || !/^[a-zA-Z]/.test(prop)) {
                throw new Error('invalid nested property name for filter')
              }

              tree[prop] = createObjectTree({}, properties, value)

              return tree
            }

            var filter = createObjectTree({}, key.split('.'), value)

            angular.extend(filters, filter)
          })
          return filters
        },
      }
      return service
    },
  ])
  .factory('HakukohdeAvainTyyppiService', [
    function () {
      'use strict'

      var onkoVainTrueFalseArvo = function (arvot) {
        return (
          arvot &&
          arvot.length == 2 &&
          arvot.indexOf('true') != -1 &&
          arvot.indexOf('false') != -1
        )
      }

      var service = {
        createAvainTyyppiValues: function (avaimet, tunnisteet) {
          avaimet.forEach(function (avain) {
            tunnisteet.push(avain.tunniste)
            tunnisteet.push(avain.osallistuminenTunniste)
            avain.tyyppi = function () {
              if (
                avain.funktiotyyppi === 'TOTUUSARVOFUNKTIO' ||
                onkoVainTrueFalseArvo(avain.arvot)
              ) {
                return 'boolean'
              }
              return avain.arvot && avain.arvot.length > 0 ? 'combo' : 'input'
            }
          })
        },
      }
      return service
    },
  ])
