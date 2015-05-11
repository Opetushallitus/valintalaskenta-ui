function tarjontaFixtures() {
    var httpBackend = testFrame().httpBackend
    httpBackend.when('GET', /.*\/tarjonta-service\/rest\/v1\/.*/).respond([
    ]);
}