angular
  .module('valintalaskenta')

  .service('HakuUtility', [
    '_',
    function (_) {
      this.isKKHaku = function (haku) {
        // if haku.kohdejoukkoUri contains string '_12' then haku is korkeakouluhaku
        return _.has('kohdejoukkoUri', haku)
          ? _.contains(haku.kohdejoukkoUri, '_12')
          : false
      }

      this.isToinenAsteKohdeJoukko = function (kohdejoukkoUri) {
        if (kohdejoukkoUri) {
          var arr = ['_11', '_17', '_20']
          return arr.some(function (s) {
            return kohdejoukkoUri.indexOf(s) !== -1
          })
        }
        return false
      }

      this.isYhteishaku = function (haku) {
        if (haku && haku.hakutapaUri) {
          return haku.hakutapaUri.indexOf('_01') !== -1
        }
        return false
      }

      this.isVarsinainenhaku = function (haku) {
        if (haku && haku.hakutyyppiUri) {
          return haku.hakutyyppiUri.indexOf('_01') !== -1
        }
        return false
      }
    },
  ])
