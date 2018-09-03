function onrPerustiedotFixtures(hakijat) {
    return function() {
        var httpBackend = testFrame().httpBackend;
        httpBackend.whenPOST(/.*\/oppijanumerorekisteri-service\/henkilo\/henkiloPerustietosByHenkiloOidList.*/).respond(hakijat);
    }
}