angular
  .module('valintalaskenta')

  .filter('duration', [
    function () {
      return function (input) {
        return (
          (((input % (60 * 60 * 24)) / (60 * 60)) | 0) +
          'h ' +
          (((input % (60 * 60)) / 60) | 0) +
          'min ' +
          (input % 60 | 0) +
          's'
        )
      }
    },
  ])

  .filter('startFrom', [
    function () {
      return function (input, start) {
        start = +start //parse to int
        var returnValue = 0

        if (
          start > -1 &&
          input &&
          Object.prototype.toString.call(input) === '[object Array]'
        ) {
          returnValue = input.slice(start)
        }

        return returnValue
      }
    },
  ])

  .filter('julkaistuHaku', [
    function () {
      return function (input) {
        var result = []
        for (var i = 0; i < input.length; i++) {
          if (input[i].tila === 'JULKAISTU') {
            result.push(input[i])
          } else if (
            input[i].tila === 'VALMIS' &&
            input[i].kohdejoukonTarkenne === 'haunkohdejoukontarkenne_3#1'
          ) {
            result.push(input[i])
          }
        }
        return result
      }
    },
  ])

  .filter('tilaFilter', [
    function () {
      return function (input, tilaFilterValue) {
        var result = []
        if (input) {
          for (var i = 0; i < input.length; i++) {
            if (!tilaFilterValue || input[i].tila === tilaFilterValue) {
              result.push(input[i])
            }
          }
        }
        return result
      }
    },
  ])
  .filter('kuuluuFilter', [
    function () {
      return function (input, kuuluuFilterValue) {
        return (input || []).filter(function (hakija) {
          return (
            !kuuluuFilterValue || hakija.ryhmaanKuuluminen === kuuluuFilterValue
          )
        })
      }
    },
  ])
  .filter('ListLength', [
    function () {
      // usefull finding out length of a filtered list in template
      return function (list) {
        if (list) {
          return list.length
        } else {
          return 0
        }
      }
    },
  ])
