function dokumenttipalveluFixtures() {
    var httpBackend = testFrame().httpBackend
    httpBackend.when('GET', /.*\/dokumentit\/osoitetarrat\/.*/).respond();
    httpBackend.when('GET', /.*\/dokumentit\/hyvaksymiskirjeet\/.*/).respond();
    httpBackend.when('GET', /.*\/dokumentit\/sijoitteluntulokset\/.*/).respond();
}
