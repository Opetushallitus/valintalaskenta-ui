'use strict';


describe('Testing NimiService', function(){
    var hakukohdeNimiService;

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector) {
        hakukohdeNimiService = $injector.get('HakukohdeNimiService');
    }));


    it('getKieli', function() {
        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulufi',
                sv: '',
                en: 'kouluen'
            },
            tarjoajaNimi : {
                fi: 'koulufi',
                sv: '',
                en: ''
            }
        };
        expect(hakukohdeNimiService.getKieli(hakukohde)).toBe('kieli_fi');

        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulufi',
                sv: '',
                en: 'kouluen'
            },
            tarjoajaNimi : {
                fi: '',
                sv: 'koulusv',
                en: ''
            }
        };
        expect(hakukohdeNimiService.getKieli(hakukohde)).toBe('kieli_fi');

        var hakukohde = {
            hakukohdeNimi : {
                fi: '',
                sv: 'koulusv',
                en: 'kouluen'
            },
            tarjoajaNimi : {
                fi: '',
                sv: 'koulusv',
                en: ''
            }
        };
        expect(hakukohdeNimiService.getKieli(hakukohde)).toBe('kieli_sv');
    });

    it('getTarjoajaNimi', function() {
        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulufi',
                sv: '',
                en: 'kouluen'
            },
            tarjoajaNimi : {
                fi: 'koulufi',
                sv: '',
                en: ''
            }
        };
        expect(hakukohdeNimiService.getTarjoajaNimi(hakukohde)).toBe('koulufi');

        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulufi',
                sv: '',
                en: 'kouluen'
            },
            tarjoajaNimi : {
                fi: 'koulufi',
                sv: 'koulusv',
                en: ''
            }
        };
        expect(hakukohdeNimiService.getTarjoajaNimi(hakukohde)).toBe('koulufi');
    });

    it('getHakukohdeNimi', function() {
        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulufi',
                sv: '',
                en: 'kouluen'
            },
            tarjoajaNimi : {
                fi: 'koulufi',
                sv: '',
                en: ''
            }
        };
        expect(hakukohdeNimiService.getHakukohdeNimi(hakukohde)).toBe('koulufi');

        var hakukohde = {
            hakukohdeNimi : {
                fi: '',
                sv: '',
                en: 'kouluen'
            },
            tarjoajaNimi : {
                fi: '',
                sv: 'koulusv',
                en: ''
            }
        };
        expect(hakukohdeNimiService.getHakukohdeNimi(hakukohde)).toBe('');
    });

    afterEach(function() {
    });
});
