(function initApp() {
    'use strict';

    var injector = angular.injector(['ng']);
    var $http = injector.get('$http');
    $http.defaults.headers.common['Caller-Id'] = "1.2.246.562.10.00000000001.valintalaskenta-ui.frontend.init";
    var $q = injector.get('$q');

    function initCas() {
        var services = [
            window.url("valintaperusteet-service.buildversion"),
            window.url("valintalaskenta-laskenta-service.buildversion"),
            window.url("valintalaskentakoostepalvelu.buildversion"),
            window.url("sijoittelu-service.buildversion"),
            window.url("viestintapalvelu.buildversion"),
            window.url("haku-app.buildversion"),
            window.url("valinta-tulos-service.login"),
            window.url("oppijanumerorekisteri-service.login"),
            window.url("ataru.login"),
            window.url("dokumenttipalvelu-service.session.maxinactiveinterval")
        ];
        return $q.all(services.map(httpGet));
    }

    function httpGet(serviceUrl) {
        return $http.get(serviceUrl);
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap('html', ['valintalaskenta']);
        });
    }

    initCas().then(bootstrapApplication, bootstrapApplication);
})();
