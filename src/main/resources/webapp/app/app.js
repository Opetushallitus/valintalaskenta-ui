'use strict'

var app = angular
  .module(
    'valintalaskenta',
    [
      'ngResource',
      'loading',
      'ngRoute',
      'ngAnimate',
      'ngCookies',
      'pascalprecht.translate',
      'ui.tinymce',
      'valvomo',
      'ui.bootstrap',
      'angularFileUpload',
      'lodash',
      'ramda',
      'oph.localisation',
      'oph.services',
      'ngTable',
      'angular-cache',
      'ngIdle',
    ],
    function ($rootScopeProvider) {
      $rootScopeProvider.digestTtl(25)
    }
  )
  .run(function ($http, MyRolesModel, LocalisationService, CacheFactory) {
    // ja vastaus ei ole $window.location.pathname koska siina tulee mukana myos index.html
    tinyMCE.baseURL = '/valintalaskenta-ui/common/jslib/static/tinymce-4.0.12'
    LocalisationService.getTranslation('')

    $http.defaults.cache = CacheFactory('defaultCache', {
      maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes
      cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
      deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
    })
  })

app.run(function ($http, $cookies) {
  $http.defaults.headers.common['Caller-Id'] =
    '1.2.246.562.10.00000000001.valintalaskenta-ui.frontend.app'
  if ($cookies['CSRF']) {
    $http.defaults.headers.common['CSRF'] = $cookies['CSRF']
  }
})

if (window.mocksOn) {
  angular.module('valintalaskenta').requires.push('e2e-mocks')
}

app.constant('IlmoitusTila', {
  INFO: 'success',
  WARNING: 'warning',
  ERROR: 'danger',
})

var SESSION_KEEPALIVE_INTERVAL_IN_SECONDS =
  SESSION_KEEPALIVE_INTERVAL_IN_SECONDS || 30
var MAX_SESSION_IDLE_TIME_IN_SECONDS = MAX_SESSION_IDLE_TIME_IN_SECONDS || 1800
