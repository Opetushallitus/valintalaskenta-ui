/**
 * Hakee käännöspalvelusta resurssit sovelluksen lokalisointiin
 */
angular.module('oph.localisation', [])
    .factory('Localisations',[ '$resource', 'Props','$q', function ($resource, Props, $q) {
        var localisations ={};
        var locals = $resource(Props.localizationUrl+'/localisation',{},{
            query: {
                method:'GET',
                params:{
                    category: 'valintaperusteet'
                },
                isArray: true
            }
        });
        /**
         * Haetaan lokalisoinnit käännöspalvelusta
         * palauttaa käännösten objekti taulukon.
         * @returns {promise}
         */
        localisations.getLocalisations = function(){
            var deferred = $q.defer();
            locals.query().$promise.then(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        };
        return localisations;
    }])


/**
 * Sovelluksen lokalisointi palvelu
 */
    .service('LocalisationService',  [ 'Localisations', '$q', 'MyRolesModel', '$cacheFactory',
        function(Localisations, $q, MyRolesModel, $cacheFactory){

            //välimuisti käännöksille
            var cache = $cacheFactory('locales');

            /**
             * Palauttaa käyttäjän käyttökielen ( fi | sv | en )cas/myroles:sta oletus kieli on fi
             * @returns {promise}
             */
            this.getUserLang = function(){
                var deferred = $q.defer();
                MyRolesModel.then(
                    function(data){
                        var found = true;
                        // oletus kieli fi, jos käyttäjällä ei kieltä asetettu cas/myroles:ssa
                        var userLang = 'fi';
                        for(var i=0 ; i < data.length && found ; i++ ){
                            if( data[i].match("LANG_") !== null){
                                userLang = data[i].slice(5);
                                found = false;
                            }
                        }
                        deferred.resolve(userLang);
                    }
                );
                return deferred.promise;
            };

            /**
             * Haetaan käännöspalvelusta käyttäjän käyttökielen mukaan
             * lokalisoidut käännökset ja laitetaan ne välimuistiin
             * avain arvo pareina
             * @param userLang : käyttäjän käyttökieli oletus arvo 'fi'
             * @returns {promise}
             */
            function getTranslations(userLang){
                var deferred = $q.defer();
                if(cache.info().size == 0){
                     Localisations.getLocalisations().then(function(data){
                        for(var trl in data){
                            if(data[trl].id !== undefined && data[trl].locale === userLang){
                                putCachedLocalisation(data[trl].key, data[trl].value );
                            }
                        }
                        deferred.resolve();
                    })
                };
                return deferred.promise;
            };
            /**
             * Palauttaa käännöstekstin avaimelle
             * @param key: käännöstekstin avain
             * @returns {promise}
             */
            this.getTranslation = function(key){
                var deferred = $q.defer();
                if(!hasTranslation(key)){
                    this.getUserLang().then(function(data){
                        getTranslations(data).then(function(){
                            var locale = cache.get(key);
                            deferred.resolve( locale ? cache.get(key) : undefined );
                        });
                    });
                }else{
                    var locale = cache.get(key);
                    deferred.resolve( locale ? cache.get(key) : undefined );
                }
                return deferred.promise;
            };
            /**
             * Laittaa käännöstekstit välimuistiin avain arvo pareine
             * @param key: käännöstekstin avain
             * @param newEntry: käännnösteksi
             */
            function putCachedLocalisation(key,newEntry) {
                cache.put(key, newEntry);
            };
            /**
             * Tarkistaa onko käännösteksti olemassa
             * @param key: käännöstekstin avain
             * @returns {*|boolean}
             */
            function hasTranslation(key){
                return angular.isDefined(cache.get(key));
            }

            /**
             * Palauttaa käännötekstin käännös avaimella
             * @param key: käännöksen avain
             * @returns {*}
             */
            this.tl = function(key){
                if(hasTranslation(key)){
                    return cache.get(key);
                }else{
                    return undefined;
                }
            };

        }])
/**
 * UI-directive käännösten käyttämiseen
 */
    .directive('tl', ['LocalisationService', function(LocalisationService) {

        return {
            restrict: 'A',
            replace: true,
            scope: false,
            compile: function(element, attrs) {
                var key = attrs["tl"];
                LocalisationService.getTranslation(key).then(function(data){
                    element.html(data);
                });

            }

        };
    }]);
