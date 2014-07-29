'use strict';

angular.module('valintalaskenta').controller('RootCtrl', ['$rootScope', '$scope','LocalisationService',
        function($rootScope, $scope, LocalisationService ) {
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