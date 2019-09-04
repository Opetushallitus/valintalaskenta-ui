'use strict';

var modules = ['valintalaskenta', 'oph.localisation', 'resources.valvomo', 'valvomo', 'ngResource'];

modules.forEach(function(module) {
   angular.module(module)
       .factory('csrfHeaderInterceptor', ['$cookies', function ($cookies) {
           return {
               request: function (config) {
                   config.headers['Caller-Id'] = "1.2.246.562.10.00000000001.valintalaskenta-ui.frontend";

                   var csrfToken = $cookies.get('CSRF');
                   if (csrfToken) {
                       config.headers['CSRF'] = csrfToken;
                       console.debug("CSRF header '%s' set", csrfToken);
                   }

                   return config;
               }
           }
       }])
       .config(['$httpProvider', function ($httpProvider) {
           $httpProvider.interceptors.push('csrfHeaderInterceptor');
       }])
});