function koodistoFixtures() {
    var httpBackend = testFrame().httpBackend
    httpBackend.when('GET', /.*\/koodisto-service\/rest\/codeelement\/codes\/.*/).respond();
}