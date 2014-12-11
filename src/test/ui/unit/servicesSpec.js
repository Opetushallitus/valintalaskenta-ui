'use strict';


describe('Testing NimiService', function(){
    var nimiService;

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, NimiService) {
        nimiService = $injector.get('NimiService');
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
        expect(nimiService.getKieli(hakukohde)).toBe('kieli_fi');

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
        expect(nimiService.getKieli(hakukohde)).toBe('kieli_fi');

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
        expect(nimiService.getKieli(hakukohde)).toBe('kieli_sv');
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
        expect(nimiService.getTarjoajaNimi(hakukohde)).toBe('koulufi');

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
        expect(nimiService.getTarjoajaNimi(hakukohde)).toBe('koulufi');
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
        expect(nimiService.getHakukohdeNimi(hakukohde)).toBe('koulufi');

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
        expect(nimiService.getHakukohdeNimi(hakukohde)).toBe('');
    });

    afterEach(function() {
    });
});
