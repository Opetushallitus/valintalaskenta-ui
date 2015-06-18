angular.module("e2e-mocks", ["ngMockE2E"]).config(function () {
}).run(function ($httpBackend) {
    window.httpBackend = $httpBackend;
    if (window.runTestHooks) {
        window.runTestHooks()
    }
});