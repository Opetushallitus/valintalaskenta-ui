angular.module("e2e-mocks", ["ngMockE2E"]).config(function () {
}).run(function ($httpBackend, $route) {
    window.httpBackend = $httpBackend;
    window.route = $route;
    if (window.runTestHooks) {
        window.runTestHooks()
    }
});