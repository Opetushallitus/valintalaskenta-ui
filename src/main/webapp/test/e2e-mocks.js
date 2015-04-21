angular.module("e2e-mocks", ["ngMockE2E"]).run(function($httpBackend) {
  window.httpBackend = $httpBackend
  httpBackend.when('GET', /.*\/valintalaskenta-ui\/.*/).passThrough()
  httpBackend.when('GET', /.*\/lokalisointi\/.*/).respond([])
  if(window.runTestHooks) {
    window.runTestHooks()
  }
})