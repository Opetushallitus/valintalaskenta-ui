(function initApp() {
    'use strict';

    var injector = angular.injector(['ng']);
    var $http = injector.get('$http');
    var $q = injector.get('$q');

    function initCas() {
        var services = [
            VALINTAPERUSTEET_URL_BASE,
            SERVICE_URL_BASE,
            VALINTALASKENTAKOOSTE_URL_BASE,
            SIJOITTELU_URL_BASE,
            VIESTINTAPALVELU_URL_BASE,
            HAKEMUS_UI_URL_BASE
        ];
        return $q.all(services.map(loadBuildversion));
    }

    function loadBuildversion(serviceUrl) {
        return $http.get(serviceUrl + '/buildversion.txt?auth');
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            setTimeout(function() {
                angular.bootstrap('html', ['valintalaskenta']);
            }, 200);
        });
    }

    initCas().then(bootstrapApplication, bootstrapApplication);
})();