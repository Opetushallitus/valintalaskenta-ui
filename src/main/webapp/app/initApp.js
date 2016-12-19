(function initApp() {
    'use strict';

    var injector = angular.injector(['ng']);
    var $http = injector.get('$http');
    var $q = injector.get('$q');

    function initCas() {
        var services = [
            window.url("valintaperusteet-service.buildversion"),
            window.url("valintalaskenta-laskenta-service.buildversion"),
            window.url("valintalaskentakoostepalvelu.buildversion"),
            window.url("sijoittelu-service.buildversion"),
            window.url("viestintapalvelu.buildversion"),
            window.url("haku-app.buildversion"),
            window.url("valinta-tulos-service.login")
        ];
        return $q.all(services.map(loadBuildversion));
    }

    function loadBuildversion(serviceUrl) {
        return $http.get(serviceUrl);
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap('html', ['valintalaskenta']);
        });
    }

    initCas().then(bootstrapApplication, bootstrapApplication);
})();
