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
    }]);