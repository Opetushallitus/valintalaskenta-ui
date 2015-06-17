function organisaatioFixtures() {
    var httpBackend = testFrame().httpBackend
    httpBackend.when('GET', /.*organisaatio\/1\.2\.246\.562\.10\.10464399921\/parentoids/)
        .respond("1.2.246.562.10.00000000001/1.2.246.562.10.23511028237/1.2.246.562.10.328060821310/1.2.246.562.10.10464399921")
    var organisaatio = "1.2.246.562.10.00000000001/1.2.246.562.10.83391443328/1.2.246.562.10.29176843356/1.2.246.562.10.92016169366"
    httpBackend.when('GET', /.*organisaatio\/1\.2\.246\.562\.10\.00000000001\/parentoids/).respond(organisaatio)
    httpBackend.when('GET', /.*organisaatio\/1\.2\.246\.562\.10\.72985435253\/parentoids/).respond(organisaatio)
    httpBackend.when('GET', /.*\/organisaatio-service\/.*/).respond({
        "oid": "1.2.246.562.10.00000000001",
        "nimi": {"fi": "Opetushallitus", "sv": "Utbildningsstyrelsen", "en": "The Finnish National Board of Education"},
        "alkuPvm": "1970-01-01",
        "postiosoite": {},
        "vuosiluokat": [],
        "kieletUris": [],
        "yhteystiedot": [],
        "kuvaus2": {},
        "tyypit": ["Muu organisaatio"],
        "yhteystietoArvos": [],
        "nimet": [{
            "nimi": {
                "fi": "Opetushallitus",
                "sv": "Utbildningsstyrelsen",
                "en": "The Finnish National Board of Education"
            }, "alkuPvm": "1970-01-01", "version": 1
        }],
        "kayntiosoite": {},
        "maaUri": "maatjavaltiot1_fin",
        "ryhmatyypit": [],
        "kayttoryhmat": [],
        "version": 0,
        "status": "AKTIIVINEN"
    })
}
