/**
 * Hakee käännöspalvelusta resurssit sovelluksen lokalisointiin
 */
angular
  .module('oph.localisation', [])
  .factory('Localisations', [
    '$resource',
    '$q',
    function ($resource, $q) {
      var locals = $resource(
        window.url('lokalisointi.localisation'),
        {},
        {
          query: {
            method: 'GET',
            params: {
              category: 'valintalaskenta',
            },
            isArray: true,
          },
        }
      ).query().$promise
      /**
       * Haetaan lokalisoinnit käännöspalvelusta
       * palauttaa käännösten objekti taulukon.
       * @returns {promise}
       */
      return {
        getLocalisations: function () {
          return locals
        },
      }
    },
  ])

  /**
   * Sovelluksen lokalisointi palvelu
   */
  .service('LocalisationService', [
    'Localisations',
    '$q',
    'MyRolesModel',
    '$cacheFactory',
    function (Localisations, $q, MyRolesModel, $cacheFactory) {
      //välimuisti käännöksille
      var cache = $cacheFactory('locales')

      /**
       * Palauttaa käyttäjän käyttökielen ( fi | sv | en )cas/myroles:sta oletus kieli on fi
       * @returns {promise}
       */
      this.getUserLang = function () {
        return MyRolesModel.then(function (data) {
          var userLang = null
          for (var i = 0; i < data.length && userLang === null; i++) {
            var m = data[i].match('LANG_(.*)')
            if (m) {
              userLang = m[1]
            }
          }
          return userLang || 'fi'
        })
      }

      /**
       * Haetaan käännöspalvelusta käyttäjän käyttökielen mukaan
       * lokalisoidut käännökset ja laitetaan ne välimuistiin
       * avain arvo pareina
       * @param userLang : käyttäjän käyttökieli oletus arvo 'fi'
       * @returns {promise}
       */
      function getTranslations(userLang) {
        if (cache.info().size === 0) {
          return Localisations.getLocalisations().then(
            function (localisations) {
              localisations.forEach(function (localisation) {
                if (localisation.locale === userLang) {
                  cache.put(localisation.key, localisation.value)
                }
              })
            },
            function (error) {
              console.warn('Failed to retrieve locales', error)
              return $q.resolve()
            }
          )
        } else {
          return $q.resolve()
        }
      }

      this.getTranslationsForArray = function (array) {
        if (!array) {
          return $q.resolve()
        }
        var self = this
        return $q.all(
          array.map(function (item) {
            item.text = item.default_text
            return self.getTranslation(item.text_prop).then(function (text) {
              if (text) {
                item.text = text
              }
            })
          })
        )
      }

      /**
       * Palauttaa käännöstekstin avaimelle
       * @param key: käännöstekstin avain
       * @returns {promise}
       */
      this.getTranslation = function (key) {
        var t = cache.get(key)
        if (t) {
          return $q.resolve(t)
        } else {
          return this.getUserLang()
            .then(function (userLang) {
              return getTranslations(userLang)
            })
            .then(function () {
              return cache.get(key)
            })
        }
      }

      /**
       * Palauttaa käännötekstin käännös avaimella
       * @param key: käännöksen avain
       * @returns {*}
       */
      this.tl = function (key) {
        return cache.get(key)
      }
    },
  ])
  /**
   * UI-directive käännösten käyttämiseen
   */
  .directive('tl', [
    'LocalisationService',
    function (LocalisationService) {
      return {
        restrict: 'A',
        replace: true,
        scope: false,
        compile: function (element, attrs) {
          var key = attrs['tl']
          LocalisationService.getTranslation(key).then(function (data) {
            element.html(data)
          })
        },
      }
    },
  ])
