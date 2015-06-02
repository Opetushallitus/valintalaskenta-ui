function sijoitteluAjoFixtures() {
    var httpBackend = testFrame().httpBackend

    ///1.2.246.562.29.90697286251/sijoitteluajo/latest/hakemus/1.2.246.562.11.00001897296
    httpBackend.when('GET', /.*resources\/sijoittelu\/.*\/sijoitteluajo\/latest\/hakemus\/.*/).respond(
        {
            hakijaOid: null,
            hakemusOid: null,
            etunimi: null,
            sukunimi: null,
            hakutoiveet: []
        }
    );

    httpBackend.when('GET', /.*\/sijoittelu\/.*\/sijoitteluajo\/latest\/hakukohde\/.*/).respond({
        "sijoitteluajoId": null,
        "oid": null,
        "tila": null,
        "tarjoajaOid": null,
        "valintatapajonot": [],
        "kaikkiJonotSijoiteltu": true
    });
}
