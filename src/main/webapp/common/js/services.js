angular.module('oph.services', [])

    .service('Utility', [function () {

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        this.debounce = function (func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

    }])

    .factory('Korkeakoulu',[ function () {
        "use strict";
        var service =
        {
            isKorkeakoulu: function(kohdejoukkoUri) {
                var returnValue = false;
                if (kohdejoukkoUri) {
                    returnValue = kohdejoukkoUri.indexOf('_12') !== -1;
                }
                return returnValue;
            }
        };
        return service;
    }])

    .factory('HakukohdeNimiService',['_', function (_) {
        "use strict";
        var service =
        {
            getKieli:  function(hakukohde) {
                if (hakukohde) {
                    var languages = ["kieli_fi", "kieli_sv", "kieli_en"];
                    var tarjoajaNimet = (hakukohde.tarjoajaNimet?hakukohde.tarjoajaNimet:hakukohde.tarjoajaNimi);
                    var hakukohdeNimet = (hakukohde.hakukohteenNimet?hakukohde.hakukohteenNimet:hakukohde.hakukohdeNimi);

                    var language = _.find(languages, function (lang) {
                        var languageId = _.last(lang.split("_"));
                        return ((!_.isEmpty(hakukohdeNimet[lang]) || !_.isEmpty(hakukohdeNimet[languageId])) && !_.isEmpty(tarjoajaNimet[languageId]));
                    });

                    return (language?language:"kieli_fi");
                }
                return "kieli_fi";
            },


            getKieliCode: function(hakukohde) {
                var language = this.getKieli(hakukohde);
                return _.last(language.split("_")).toUpperCase();
            },

            getTarjoajaNimi:  function(hakukohde) {
                var language = service.getKieli(hakukohde);
                var languageId = _.last(language.split("_"));
                var tarjoajaNimi = (hakukohde && hakukohde.tarjoajaNimet && hakukohde.tarjoajaNimet[languageId]) ? hakukohde.tarjoajaNimet[languageId] :
                    (hakukohde && hakukohde.tarjoajaNimi && hakukohde.tarjoajaNimi[languageId]) ? hakukohde.tarjoajaNimi[languageId] : "";
                return tarjoajaNimi;
            },

            getHakukohdeNimi:  function(hakukohde) {
                var language = service.getKieli(hakukohde);
                var languageId = _.last(language.split("_"));
                var hakukohteenNimi = (hakukohde && hakukohde.hakukohteenNimet && hakukohde.hakukohteenNimet[language]) ? hakukohde.hakukohteenNimet[language] :
                    (hakukohde && hakukohde.hakukohdeNimi && hakukohde.hakukohdeNimi[languageId]) ? hakukohde.hakukohdeNimi[languageId] : "";
                return hakukohteenNimi;
            }
        };
        return service;
    }])
    .factory('FilterService',[ function () {
        "use strict";
        var service =
        {
            fixFilterWithNestedProperty: function(params) {
                var filters = {};
                angular.forEach(params, function(value, key) {
                    if (key.indexOf('.') === -1) {
                        filters[key] = value;
                        return;
                    }

                    var createObjectTree = function (tree, properties, value) {
                        if (!properties.length) {
                            return value;
                        }

                        var prop = properties.shift();

                        if (!prop || !/^[a-zA-Z]/.test(prop)) {
                            throw new Error('invalid nested property name for filter');
                        }

                        tree[prop] = createObjectTree({}, properties, value);

                        return tree;
                    };

                    var filter = createObjectTree({}, key.split('.'), value);

                    angular.extend(filters, filter);
                });
                return filters;
            }
        };
        return service;
    }])
    .factory('HakukohdeAvainTyyppiService',[ function () {
        "use strict";

        var onkoVainTrueFalseArvo = function(arvot) {
            return arvot && arvot.length == 2 && arvot.indexOf("true") != -1 && arvot.indexOf("false") != -1
        };

        var service =
        {
            createAvainTyyppiValues: function(avaimet, tunnisteet) {
                avaimet.forEach(function (avain) {
                    tunnisteet.push(avain.tunniste);
                    tunnisteet.push(avain.osallistuminenTunniste);
                    avain.tyyppi = function () {
                        if (avain.funktiotyyppi === "TOTUUSARVOFUNKTIO" || onkoVainTrueFalseArvo(avain.arvot)) {
                            return "boolean";
                        }
                        return avain.arvot && avain.arvot.length > 0 ? "combo" : "input";
                    };
                });
            }
        };
        return service;
    }]);
