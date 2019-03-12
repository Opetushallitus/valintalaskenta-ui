'use strict';

angular.module('valintalaskenta').controller('RootCtrl', ['$rootScope', 'LocalisationService', 'UserModel',
        function($rootScope, LocalisationService, UserModel ) {

            UserModel.refreshIfNeeded();

            /**
             * katsotaan käyttäjän käyttöprofiilista cas/myroles tiedostosta
             * hänen palveluun määrittämä käyttökieli
             */
            LocalisationService.getUserLang().then(function(data){
                $rootScope.userLang = data;
            });
            /**
             * Astetaan käännösteksti valitulla avaimelle
             * @param key
             * @returns {*}
             */
            $rootScope.t = function(key) {
                return LocalisationService.tl(key);
            };
}]);