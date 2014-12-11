angular.module('oph.services', [])
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
    }]).factory('NimiService',['_', function (_) {
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
    }]);