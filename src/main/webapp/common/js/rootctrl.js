'use strict';

angular.module('valintalaskenta').controller('RootCtrl', ['$rootScope', '$scope','LocalisationService', 'UserModel',
        function($rootScope, $scope, LocalisationService, UserModel ) {

            UserModel.refreshIfNeeded();

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