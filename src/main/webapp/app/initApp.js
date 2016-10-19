(function initApp() {
    'use strict';

    var injector = angular.injector(['ng']);
    var $http = injector.get('$http');
    var $q = injector.get('$q');

    function initCas() {
        var services = [
            window.url("valintaperusteet-service.base"),
            window.url("valintalaskenta-laskenta-service.base"),
            window.url("valintalaskentakoostepalvelu.base"),
            window.url("sijoittelu-service.base"),
            window.url("viestintapalvelu.base"),
            window.url("haku-app.base")
        ];
        return $q.all(services.map(loadBuildversion));
    }

    function loadBuildversion(serviceUrl) {
        return $http.get(serviceUrl + '/buildversion.txt?auth');
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap('html', ['valintalaskenta']);
        });
    }

    initCas().then(bootstrapApplication, bootstrapApplication);
})();