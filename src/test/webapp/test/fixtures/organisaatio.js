function organisaatioFixtures() {
    var httpBackend = testFrame().httpBackend
    var organisaatio = "1.2.246.562.10.00000000001/1.2.246.562.10.83391443328/1.2.246.562.10.29176843356/1.2.246.562.10.92016169366"
    httpBackend.when('GET', /.*organisaatio\/1\.2\.246\.562\.10\.00000000001\/parentoids/).respond(organisaatio)
    httpBackend.when('GET', /.*organisaatio\/1\.2\.246\.562\.10\.72985435253\/parentoids/).respond(organisaatio)
}