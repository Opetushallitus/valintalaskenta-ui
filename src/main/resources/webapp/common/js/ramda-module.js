angular
  .module('ramda', [])

  .factory('R', [
    function () {
      return window.R // assumes ramda has already been loaded on the page
    },
  ])
