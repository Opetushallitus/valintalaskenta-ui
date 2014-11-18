


angular.module('valintalaskenta')
.config(function ($translateProvider) {

    $translateProvider.translations('fi', {
        sijoitteluntulos: {
            header: {
                enrollmentinfo: 'Ilmoittautumistieto'
            },
            enrollmentinfo: {
                notdone: "Ei tehty",
                present: "Läsnä (koko lukuvuosi)",
                notpresent: "Poissa",
                noenrollment: "Ei ilmoittautunut",
                presentfall: "Läsnä syksy, poissa kevät",
                notpresentfall: "Poissa syksy, läsnä kevät",
                presentspring: "Läsnä, keväällä alkava koulutus",
                notpresentspring: "Poissa, keväällä alkava koulutus"
            },
            buttons: {
                acceptall: "Hyväksy valintaesitys"
            }
        },

        discretionary: {
            modal: {
                title: "Harkinnanvarainen",
                oid: "Hakemuksen tunniste",
                state: "Harkinnanvarainen tila"
            }
        },
        ILMOITETTU: "Hakijalle ilmoitettu",
        VASTAANOTTANUT: "Vastaanottanut",
        EI_VASTAANOTETTU_MAARA_AIKANA: "Ei vastaanotettu määräaikana",
        PERUNUT: "Perunut",
        PERUUTETTU: "Peruutettu",
        EHDOLLISESTI_VASTAANOTTANUT: "Ehdollisesti vastaanottanut"
    });



    $translateProvider.translations('en', {
        sijoitteluntulos: {
            header: {
                enrollmentinfo: 'Ilmoittautumistieto'
            },
            enrollmentinfo: {
                notdone: "Ei tehty",
                present: "Läsnä (koko lukuvuosi)",
                notpresent: "Poissa",
                noenrollment: "Ei ilmoittautunut",
                presentfall: "Läsnä syksy, poissa kevät",
                notpresentfall: "Poissa syksy, läsnä kevät",
                presentspring: "Läsnä, keväällä alkava koulutus",
                notpresentspring: "Poissa, keväällä alkava koulutus"
            },
            buttons: {
                acceptall: "Hyväksy valintaesitys"
            }
        },

        discretionary: {
            modal: {
                title: "Harkinnanvarainen",
                oid: "Hakemuksen tunniste",
                state: "Harkinnanvarainen tila"
            }
        },
        ILMOITETTU: "Hakijalle ilmoitettu",
        VASTAANOTTANUT: "Vastaanottanut",
        EI_VASTAANOTETTU_MAARA_AIKANA: "Ei vastaanotettu määräaikana",
        PERUNUT: "Perunut",
        PERUUTETTU: "Peruutettu",
        EHDOLLISESTI_VASTAANOTTANUT: "Ehdollisesti vastaanottanut"
    });

    $translateProvider.preferredLanguage('fi');
});

