function parametritFixtures() {
    var httpBackend = testFrame().httpBackend;
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/parametrit\/.*/).respond(
        {
            valintalaskenta: true,
            pistesyotto: true,
            hakeneet: true,
            valinnanhallinta: true,
            harkinnanvaraiset: true,
            valintakoekutsut: true,
            hakijaryhmat: true
        }
    );
}
