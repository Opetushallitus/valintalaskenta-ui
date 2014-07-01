'use strict';

angular.module('valintalaskenta').provider('Props', function () {
        this.$get = [function() {
            if (location.hostname.indexOf('localhost') !== -1) {
                return {
                    enableConsoleLogs: true,
                    localizationUrl: 'https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1'
                };
            } else {
                return {
                    enableConsoleLogs: false,
                    localizationUrl: 'https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1'
                };

            }
        }];
    });