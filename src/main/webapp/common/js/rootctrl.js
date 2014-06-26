'use strict';

angular.module('valintalaskenta.controllers', [])
    .controller('RootCtrl', ['$rootScope', '$scope','Props' ,'LocalisationService',
        function($rootScope, $scope, Props, LocalisationService ) {
            /**
             * katsotaan käyttäjän käyttöprofiilista cas/myroles tiedostosta
             * hänen palveluun määrittämä käyttökieli
             */
            LocalisationService.getUserLang().then(function(data){
                $scope.userLang = data;
            });
            /**
             * Astetaan käännösteksti valitulla avaimelle
             * @param key
             * @returns {*}
             */
            $scope.t = function(key) {
                return LocalisationService.tl(key);
            };
}]);