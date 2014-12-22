'use strict';


describe('Testing HakukohteetController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location,
        hakukohteetModel,globalStates,hakuModel,scope,ctrl,hakukohteetjson;
    var routeParams = {"hakukohdeOid": "oid2", "hakuOid": "oid"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohteetJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohteetjson = hakukohteetJSON;
        hakukohteetModel = $injector.get('HakukohteetModel');
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        $httpBackend.flush();
    }));

    it('should get hakukohteet', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;
        globalStates = {
            hakukohteetVisible : true
        };
        $httpBackend.expectGET('haku/hakukohdeTulos?count=15&hakukohdeTilas=JULKAISTU&organisationOids=1.2.246.562.10.00000000001&searchTerms=&startIndex=0')
            .respond(201,hakukohteetjson);

        ctrl = $controller('HakukohteetController', {'$rootScope' : rootScope, '$scope' : scope,
            '$location': location, '$routeParams': routeParams, 'HakukohteetModel': hakukohteetModel,
            'HakuModel': hakuModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
         expect(scope.model.hakukohteet.length).toBe(16);
         expect(scope.model.filtered.length).toBe(0);
         expect(scope.model.totalCount).toBe(100);
         expect(scope.model.pageSize).toBe(15);
         expect(scope.model.searchWord).toBe("");
         expect(scope.model.lastSearch).toBe("");
         expect(scope.model.lastHakuOid).toBe(routeParams.hakuOid);
         expect(scope.model.omatHakukohteet).toBeTruthy();
         expect(scope.model.valmiitHakukohteet).toBe("JULKAISTU");
         expect(scope.model.readyToQueryForNextPage).toBeTruthy();

    });

    it('showHakukohde normaalihaku', function() {
        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulu1'
            },
            tarjoajaNimi : {
                fi: 'koulu1'
            },
            hakukohdeOid: '1.2.246.562.5.39836447563'
        };
        var lisahaku = false;
        scope.showHakukohde(hakukohde, lisahaku);
        expect(scope.model.hakukohteetVisible).toBeFalsy();
        expect(rootScope.selectedHakukohdeNimi).toBe('koulu1');
        expect(location.path()).toMatch('/haku/.*');
    });

    it('showHakukohde lisähaku', function() {
        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulu2'
            },
            tarjoajaNimi : {
                fi: 'koulu2'
            },
            hakukohdeOid: '1.2.246.562.5.39836447563'
        };
        var lisahaku = true;
        scope.showHakukohde(hakukohde, lisahaku);
        expect(scope.hakukohteetVisible).toBeFalsy();
        expect(scope.model.hakukohteetVisible).toBeFalsy();
        expect(rootScope.selectedHakukohdeNimi).toBe('koulu2');
        expect(location.path()).toMatch('/lisahaku/.*');
    });

    it('toggleHakukohteetVisible', function() {
        scope.toggleHakukohteetVisible();
        expect(scope.model.hakukohteetVisible).toBeTruthy();
        scope.toggleHakukohteetVisible();
        expect(scope.model.hakukohteetVisible).toBeFalsy();
    });

    it('getCount', function() {
        expect(scope.model.getCount()).toBe(16);
    });

    it('getTotalCount', function() {
        expect(scope.model.getTotalCount()).toBe(100);
    });

    it('getNextPage', function() {
        scope.model.getNextPage(false);
        expect(scope.model.hakukohteet.length).toBe(16);
        expect(scope.model.readyToQueryForNextPage).toBeFalsy();
        scope.model.getNextPage(true);
        expect(scope.model.hakukohteet.length).toBe(0);
        expect(scope.model.readyToQueryForNextPage).toBeFalsy();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});

describe('Testing HenkiloController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location,
        henkiloModel,scope,ctrl,hakemuksetjson;
    var routeParams = {"hakuOid": "oid"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakemuksetJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakemuksetjson = hakemuksetJSON;
        henkiloModel = $injector.get('HenkiloModel');
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        $httpBackend.flush();
    }));

    it('should get henkilöt', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('haku-app/applications?appState=ACTIVE&appState=INCOMPLETE&q=&rows=30&start=0')
            .respond(201,hakemuksetjson);

        ctrl = $controller('HenkiloController', {'$scope' : scope,
            '$location': location, '$routeParams': routeParams, 'HenkiloModel': henkiloModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakemukset.length).toBe(60);
        expect(scope.model.totalCount).toBe(5012);
        expect(scope.model.pageSize).toBe(30);
        expect(scope.model.searchWord).toBe("");
        expect(scope.model.lastSearch).toBe("");
        expect(scope.model.readyToQueryForNextPage).toBeTruthy();
    });

    it('toggleHenkiloittainVisible', function() {
        scope.toggleHenkiloittainVisible();
        expect(scope.henkiloittainVisible).toBeFalsy();
        scope.toggleHenkiloittainVisible();
        expect(scope.henkiloittainVisible).toBeTruthy();
    });

    it('showHakemus', function() {
        var hakemus = {
            oid: '1.2.246.562.5.39836447563'
        };

        scope.showHakemus(hakemus);
        expect(location.path()).toMatch('/haku/' + routeParams.hakuOid + '/henkiloittain/' + hakemus.oid +
            "/henkilotiedot/id_" + hakemus.oid);

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

xdescribe('Testing SijoitteluntulosController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location,
        scope,ctrl,hakukohdenimijson,hakukohdetilajson,hakujson,hakukohdejson, sijoitteluajojson, $modal, $window,
        kirjepohjat,latausikkuna,hakukohdeModel,
        sijoitteluntulosModel, osoitetarratSijoittelussaHyvaksytyille, hyvaksymiskirjeet, jalkiohjauskirjeet,korkeakoulu,
        sijoitteluXls, authService,localisationService;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData', 'oph.services'));

    beforeEach(inject(function($injector, hakuJSON, hakukohdeJSON, sijoitteluajoJSON, hakukohdenimiJSON,
                               hakukohdetilaJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakujson = hakuJSON;
        hakukohdejson = hakukohdeJSON;
        sijoitteluajojson = sijoitteluajoJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        hakukohdetilajson = hakukohdetilaJSON;
        hakukohdeModel = $injector.get('HakukohdeModel');
        $modal = $injector.get('$modal');
        $window = $injector.get('$window');
        kirjepohjat = $injector.get('Kirjepohjat');
        latausikkuna = $injector.get('Latausikkuna');
        sijoitteluntulosModel = $injector.get('SijoitteluntulosModel');
        osoitetarratSijoittelussaHyvaksytyille = $injector.get('OsoitetarratSijoittelussaHyvaksytyille');
        hyvaksymiskirjeet = $injector.get('Hyvaksymiskirjeet');
        jalkiohjauskirjeet = $injector.get('Jalkiohjauskirjeet');
        sijoitteluXls = $injector.get('SijoitteluXls');
        authService = $injector.get('AuthService');
        localisationService = $injector.get('LocalisationService');
        korkeakoulu = $injector.get('Korkeakoulu');
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get sijoitteluntulokset', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('undefined/v1/rest/parametri/oid')
            .respond(201,'');
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('/dokumentit/osoitetarrat/'+routeParams.hakukohdeOid)
            .respond(201,'');
        $httpBackend.expectGET('/dokumentit/hyvaksymiskirjeet/'+routeParams.hakukohdeOid)
            .respond(201,'');
        $httpBackend.expectGET('/dokumentit/sijoitteluntulokset/'+routeParams.hakukohdeOid)
            .respond(201,'');
        for (var i = 0; i < 8; i++) {
            $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        }

        $httpBackend.expectGET('organisaatio/1.2.246.562.10.60222091211/parentoids')
            .respond(201,'1.2.246.562.10.00000000001/undefined');


        $httpBackend.expectGET('haku/'+routeParams.hakuOid)
            .respond(201,hakujson);

        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,sijoitteluajojson);

        $httpBackend.expectGET('resources/tila/hakukohde/'+routeParams.hakukohdeOid+'/1397647295344-8565235898154713515')
            .respond(201,hakukohdetilajson);


        ctrl = $controller('SijoitteluntulosController', {'$scope' : scope, '$modal' : $modal, '$routeParams': routeParams,
            '$window' : $window, 'Kirjepohjat': kirjepohjat, 'Latausikkuna': latausikkuna, 'HakukohdeModel': hakukohdeModel,
            'SijoitteluntulosModel': sijoitteluntulosModel, 'OsoitetarratSijoittelussaHyvaksytyille': osoitetarratSijoittelussaHyvaksytyille,
            'Hyvaksymiskirjeet': hyvaksymiskirjeet, 'Jalkiohjauskirjeet': jalkiohjauskirjeet, 'SijoitteluXls': sijoitteluXls,
            'AuthService': authService, 'LocalisationService': localisationService});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.sijoitteluTulokset.oid).toBe("1.2.246.562.5.39836447563");
        expect(scope.model.sijoitteluTulokset.tarjoajaOid).toBe("1.2.246.562.10.60222091211");
        expect(scope.model.sijoitteluTulokset.valintatapajonot.length).toBe(1);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].alinHyvaksyttyPistemaara).toBe(2);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].aloituspaikat).toBe(40);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].eiVarasijatayttoa).toBeFalsy();
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset.length).toBe(17);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakeneet).toBe(17);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hyvaksytty).toBe(8);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].kaikkiEhdonTayttavatHyvaksytaan).toBeFalsy();
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].nimi).toBe("Varsinaisen valinnanvaiheen valintatapajono");
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].oid).toBe("1397647295344-8565235898154713515");
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].poissaOlevaTaytto).toBeFalsy();
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].prioriteetti).toBe(0);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].tasasijasaanto).toBe("ARVONTA");
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].valittu).toBeTruthy();
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].varalla).toBe(0);
    });

    it('updateVastaanottoTila', function() {
        var hakemus = {
            oid: '1.2.246.562.5.39836447563',
            showMuutaHakemus: true
        };
        var valintatapajonoOid = "2";

        expect(hakemus.showMuutaHakemus).toBeTruthy();
        scope.updateVastaanottoTila(hakemus, valintatapajonoOid);
        expect(hakemus.showMuutaHakemus).toBeFalsy();
    });

    it('selectIlmoitettuToAll', function() {
        var valintatapajonoOid = "1397647295344-8565235898154713515";
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[0].muokattuVastaanottoTila).toBe("KESKEN");
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[3].muokattuVastaanottoTila).toBe("KESKEN");
        scope.selectIlmoitettuToAll(valintatapajonoOid);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[0].muokattuVastaanottoTila).toBe("KESKEN");
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[3].muokattuVastaanottoTila).toBe("KESKEN");
    });

    it('filterChangedValues', function() {
        var hakemus = {tilaHistoria: [
            {
                tila: "KESKEN"
            },
            {
                tila: "KESKEN"
            }
        ]};
        scope.model.naytaVainMuuttuneet = false;
        expect(scope.filterChangedValues(hakemus)).toBeTruthy();

        scope.model.naytaVainMuuttuneet = true;
        hakemus.tila = "KESKEN";
        expect(scope.filterChangedValues(hakemus)).toBeFalsy();

        scope.model.naytaVainMuuttuneet = true;
        hakemus.tilaHistoria[0].tila="HYVAKSYTTY"
        expect(scope.filterChangedValues(hakemus)).toBeTruthy();
    });

    it('resetIlmoittautumisTila', function() {
        var hakemus = {
            muokattuVastaanottoTila: ''
        };
        scope.resetIlmoittautumisTila(hakemus);
        expect(hakemus.muokattuIlmoittautumisTila).toBe("EI_TEHTY");
        hakemus.muokattuVastaanottoTila = "VASTAANOTTANUT";
        hakemus.muokattuIlmoittautumisTila = "LASNA";
        scope.resetIlmoittautumisTila(hakemus);
        expect(hakemus.muokattuIlmoittautumisTila).toBe("LASNA");
        hakemus.muokattuVastaanottoTila = "EHDOLLISESTI_VASTAANOTTANUT";
        hakemus.muokattuIlmoittautumisTila = "";
        scope.resetIlmoittautumisTila(hakemus);
        expect(hakemus.muokattuIlmoittautumisTila).toBe("EI_TEHTY");
        hakemus.muokattuVastaanottoTila = null;
        hakemus.muokattuIlmoittautumisTila = "";
        scope.resetIlmoittautumisTila(hakemus);
        expect(hakemus.muokattuIlmoittautumisTila).toBe("EI_TEHTY");
    });

    it('filterValitut', function() {
        var hakemukset = [
            {
                nimi: 'h1',
                valittu: false
            },
            {
                nimi: 'h3',
                valittu: true
            },
            {
                nimi: 'h2',
                valittu: false
            }
        ];

        expect(scope.model.filterValitut(hakemukset).length).toBe(1);
    });

    it('isAllValittu', function() {
        var valintatapajono = {
            hakemukset: [
                {
                    tila: "HYVAKSYTTY",
                    valittu: true
                },
                {
                    tila: "VARASIJALTA_HYVAKSYTTY",
                    valittu: true
                }
            ]
        };

        expect(scope.model.isAllValittu(valintatapajono)).toBeTruthy();
        valintatapajono = {
            hakemukset: [
                {
                    tila: "HYVAKSYTTY",
                    valittu: false
                },
                {
                    tila: "VARASIJALTA_HYVAKSYTTY",
                    valittu: true
                }
            ]
        };

        expect(scope.model.isAllValittu(valintatapajono)).toBeFalsy();
        valintatapajono = {
            hakemukset: [
                {
                    tila: "HYLATTY",
                    valittu: false
                },
                {
                    tila: "VARASIJALTA_HYVAKSYTTY",
                    valittu: true
                }
            ]
        };

        expect(scope.model.isAllValittu(valintatapajono)).toBeTruthy();
    });

    it('checkAll', function() {
        var valintatapajono = {
            valittu: true,
            hakemukset: [
                {
                    tila: "HYVAKSYTTY",
                    valittu: true
                },
                {
                    tila: "VARASIJALTA_HYVAKSYTTY",
                    valittu: true
                }
            ]
        };
        scope.model.checkAll(valintatapajono);
        expect(valintatapajono.valittu).toBeTruthy();
        valintatapajono = {
            valittu: false,
            hakemukset: [
                {
                    tila: "HYVAKSYTTY",
                    valittu: false
                },
                {
                    tila: "VARASIJALTA_HYVAKSYTTY",
                    valittu: true
                }
            ]
        };
        scope.model.checkAll(valintatapajono);
        expect(valintatapajono.valittu).toBeFalsy();
        valintatapajono = {
            valittu: true,
            hakemukset: [
                {
                    tila: "HYLATTY",
                    valittu: false
                },
                {
                    tila: "VARASIJALTA_HYVAKSYTTY",
                    valittu: true
                }
            ]
        };
        scope.model.checkAll(valintatapajono);
        expect(valintatapajono.valittu).toBeTruthy();
    });

    it('addMuokattuHakemus', function() {
        var hakemus =
        {
            oid: 'h1',
            valittu: false
        };

        expect(scope.muokatutHakemukset.length).toBe(0);

        scope.addMuokattuHakemus(hakemus);

        expect(scope.muokatutHakemukset.length).toBe(1);

        scope.addMuokattuHakemus(hakemus);

        expect(scope.muokatutHakemukset.length).toBe(1);

        hakemus.oid = 's';
        scope.addMuokattuHakemus(hakemus);

        expect(scope.muokatutHakemukset.length).toBe(2);
    });

    afterEach(function() {

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});





describe('Testing HakukohdeController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, hakukohdeModel, hakuModel,
        sijoitteluntulosModel, location, hakukohdejson, hakujson, sijoitteluajojson, hakukohdenimijson,
        hakukohdetilajson, korkeakoulu, tarjontaHakukohde;

    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, hakuJSON, sijoitteluajoJSON, hakukohdenimiJSON,
                               hakukohdetilaJSON, HakukohdeTarjonnasta) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeModel = $injector.get('HakukohdeModel');
        hakuModel = $injector.get('HakuModel');
        sijoitteluntulosModel = $injector.get('SijoitteluntulosModel');
        korkeakoulu = $injector.get('Korkeakoulu')
        hakukohdejson = hakukohdeJSON;
        hakujson = hakuJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        sijoitteluajojson = sijoitteluajoJSON;
        hakukohdetilajson = hakukohdetilaJSON;
        tarjontaHakukohde = HakukohdeTarjonnasta;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");


        $httpBackend.flush();
    }));

    it('should get HakukohdeController', function() {
        scope = $rootScope.$new();
        location = $location;

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,tarjontaHakukohde);
        $httpBackend.expectGET('haku/'+routeParams.hakuOid)
            .respond(201,hakujson);
        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,sijoitteluajojson);
        $httpBackend.expectGET('resources/tila/hakukohde/'+routeParams.hakukohdeOid+'/1397647295344-8565235898154713515')
            .respond(201,hakukohdetilajson);


        ctrl = $controller('HakukohdeController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'HakukohdeModel': hakukohdeModel, 'HakuModel': hakuModel, 'SijoitteluntulosModel': sijoitteluntulosModel, 'KorkeaKoulu': korkeakoulu});

        $httpBackend.flush();
    });

    it('isHakukohdeChanged', function() {
        var hakukohdeOid = '123';
        expect(scope.model.isHakukohdeChanged(hakukohdeOid)).toBeTruthy();
        hakukohdeOid = 'oid2';
        expect(scope.model.isHakukohdeChanged(hakukohdeOid)).toBeFalsy();
    });

    it('setHakukohdeNames', function() {
        var hakukohdeNimi = 'hakukohdeNimi';
        var tarjoajaNimi = 'tarjoajaNimi';
        scope.model.setHakukohdeNames(hakukohdeNimi, tarjoajaNimi);

        expect(scope.model.hakukohdeNimi).toBe(hakukohdeNimi);
        expect(scope.model.tarjoajaNimi).toBe(tarjoajaNimi);

        hakukohdeNimi = '';
        tarjoajaNimi = '';
        scope.model.setHakukohdeNames(hakukohdeNimi, tarjoajaNimi);

        expect(scope.model.hakukohdeNimi).toBe('Autoalan perustutkinto, yo');
        expect(scope.model.tarjoajaNimi).toBe('Stadin ammattiopisto, Ilkantien toimipaikka');
    });

    it('check initialized variables', function() {
        expect(scope.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);

        expect(scope.model.hakukohde.aloituspaikatLkm).toBe(20);
        expect(scope.model.hakukohde.edellisenVuodenHakijatLkm).toBe(0);
        expect(scope.model.hakukohde.hakuOid).toBe("1.2.246.562.5.2013060313080811526781");
        expect(scope.model.hakukohde.hakukelpoisuusvaatimusUris.length).toBe(1);
        expect(scope.model.hakukohde.hakukohdeKoulutusOids.length).toBe(1);
        expect(scope.model.hakukohde.tila).toBe("JULKAISTU");
        expect(scope.model.hakukohde.ylinValintapistemaara).toBe(0);
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});



describe('Testing HakeneetController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, hakeneetModel, hakukohdeModel,
        hakukohdejson,hakeneetfulljson,hakukohdenimijson;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, hakeneetFullJSON, hakukohdenimiJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakeneetModel = $injector.get('HakeneetModel');
        hakukohdeModel = $injector.get('HakukohdeModel');
        hakukohdejson = hakukohdeJSON;
        hakeneetfulljson = hakeneetFullJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get HakeneetController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('haku-app/applications/listfull?aoOid='+routeParams.hakukohdeOid+'&appState=ACTIVE&appState=INCOMPLETE&asId='+routeParams.hakuOid+'&rows=100000')
            .respond(201,hakeneetfulljson);

        ctrl = $controller('HakeneetController', {'$scope' : scope,'$location': location, '$routeParams': routeParams,
            'HakeneetModel': hakeneetModel, 'HakukohdeModel': hakukohdeModel});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakeneet.length).toBe(3);
        expect(scope.model.hakeneet[1].answers.henkilotiedot.Etunimet).toBe("Tanja");
        expect(scope.model.hakeneet[1].answers.henkilotiedot.Sukunimi).toBe("Tanssija");
        expect(scope.model.hakeneet[1].oid).toBe("1.2.246.562.11.00000000026");
        expect(scope.model.hakeneet[1].personOid).toBe("1.2.246.562.24.59107908085");
        expect(scope.model.hakeneet[1].answers.henkilotiedot.Henkilotunnus).toBe("120589-238D");
        expect(scope.model.hakeneet[1].state).toBe("ACTIVE");
        expect(scope.tila.ACTIVE).toBeDefined();
        expect(scope.tila.INCOMPLETE).toBeDefined();
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing ValinnanhallintaController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, hakukohdeModel, $modal,
        hakukohdejson,latausikkuna,ilmoitus,valinnanhallintaModel, 
            parametriService, ilmoitusTila, valinnanvaihejson, hakukohdenimijson, tarjontaHakukohde;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, valinnanvaiheJSON, hakukohdenimiJSON, HakukohdeKoodistosta) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeModel = $injector.get('HakukohdeModel');
        latausikkuna = $injector.get('Latausikkuna');
        ilmoitus = $injector.get('Ilmoitus');
        valinnanhallintaModel = $injector.get('ValinnanhallintaModel');
        parametriService = $injector.get('ParametriService');
        ilmoitusTila = $injector.get('IlmoitusTila');
        tarjontaHakukohde = $injector.get('HakukohdeTarjonnasta')
        hakukohdejson = hakukohdeJSON;
        valinnanvaihejson = valinnanvaiheJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get ValinnanhallintaController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,tarjontaHakukohde);
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/valinnanvaihe')
            .respond(201,valinnanvaihejson);
        ctrl = $controller('ValinnanhallintaController', {'$scope' : scope, '$routeParams': routeParams, '$modal': $modal,
            'Latausikkuna': latausikkuna, 'Ilmoitus': ilmoitus, 'ValinnanhallintaModel': valinnanhallintaModel,
            'HakukohdeModel': hakukohdeModel, 
            'ParametriService': parametriService, 'IlmoitusTila': ilmoitusTila});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.model.tulosValinnanvaiheet.length).toBe(3);
        expect(scope.model.tulosValinnanvaiheet[1].aktiivinen).toBeTruthy();
        expect(scope.model.tulosValinnanvaiheet[1].inheritance).toBeTruthy();
        expect(scope.model.tulosValinnanvaiheet[1].kuvaus).toBe("Kielikokeen pakollisuus ja pÃ¤Ã¤sykoe");
        expect(scope.model.tulosValinnanvaiheet[1].nimi).toBe("Kielikokeen pakollisuus ja pÃ¤Ã¤sykoe");
        expect(scope.model.tulosValinnanvaiheet[1].oid).toBe("1403085634960-982176561192192818");
        expect(scope.model.tulosValinnanvaiheet[1].valinnanVaiheTyyppi).toBe("VALINTAKOE");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing ValintakoetulosController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, hakukohdeModel, valintakoetulosModel,
        hakukohdejson,latausikkuna,ilmoitus, koekutsukirjeet, osoitetarrat, valintakoeXls,
        ilmoitusTila, valintakoejson, hakukohdenimijson, hakeneetfulljson;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, valintakoeJSON, hakukohdenimiJSON, hakeneetFullJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeModel = $injector.get('HakukohdeModel');
        latausikkuna = $injector.get('Latausikkuna');
        ilmoitus = $injector.get('Ilmoitus');
        valintakoetulosModel = $injector.get('ValintakoetulosModel');
        ilmoitusTila = $injector.get('IlmoitusTila');
        koekutsukirjeet = $injector.get('Koekutsukirjeet');
        osoitetarrat = $injector.get('Osoitetarrat');
        valintakoeXls = $injector.get('ValintakoeXls');

        hakukohdejson = hakukohdeJSON;
        valintakoejson = valintakoeJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        hakeneetfulljson = hakeneetFullJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get ValintakoetulosController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/valintakoe')
            .respond(201,valintakoejson);

        $httpBackend.expectGET('resources/valintakoe/hakutoive/'+routeParams.hakukohdeOid)
            .respond(201,"[]");

        $httpBackend.expectGET('haku-app/applications/listfull?aoOid='+routeParams.hakukohdeOid+'&appState=ACTIVE&appState=INCOMPLETE&asId='+routeParams.hakuOid+'&rows=100000')
            .respond(201,hakeneetfulljson);
        ctrl = $controller('ValintakoetulosController', {'$scope' : scope, '$routeParams': routeParams, 'Ilmoitus': ilmoitus,
            'Latausikkuna': latausikkuna, 'ValintakoetulosModel': valintakoetulosModel, 'HakukohdeModel': hakukohdeModel,
            'Koekutsukirjeet': koekutsukirjeet, 'Osoitetarrat': osoitetarrat, 'ValintakoeXls': valintakoeXls, 'IlmoitusTila': ilmoitusTila});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.filter).toBe("OSALLISTUU");
        expect(scope.model.filterImmutable).toBe("OSALLISTUU");
        expect(scope.model.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.nakymanTila).toBe("Kokeittain");
        expect(scope.predicate.length).toBe(2);
        expect(scope.predicate[0]).toBe("sukunimi");
        expect(scope.predicate[1]).toBe("etunimi");
    });

    it('isBlank', function() {
        expect(scope.isBlank(null)).toBeTruthy();
        expect(scope.isBlank("")).toBeTruthy();
        expect(scope.isBlank(1)).toBeFalsy();
        expect(scope.isBlank("abc")).toBeFalsy();
    });

    it('filterValitut', function() {
        var hakijat = [
            {
                valittu: true
            },
            {
                valittu: false
            },
            {
            }
        ];
        expect(scope.model.filterValitut(hakijat).length).toBe(1);
    });

    it('filterOsallistujat', function() {
        var hakijat = [
            {
                osallistuminen: "EI OSALLISTU"
            },
            {
            },
            {
                osallistuminen: "OSALLISTUU"
            }
        ];
        expect(scope.model.filterOsallistujat(hakijat).length).toBe(1);
    });

    it('isAllValittu', function() {
        var koe = scope.model.valintakokeet['1403085635151-6979991825029653724'];
        var hakijat;

        expect(scope.model.isAllValittu(koe)).toBeTruthy();

        hakijat = [
            {
                osallistuminen: "EI OSALLISTU"
            },
            {
            },
            {
                osallistuminen: "OSALLISTUU"
            }
        ];

        koe.hakijat = hakijat;
        expect(scope.model.isAllValittu(koe)).toBeFalsy();

    });

    it('aktiivisetJaLahetettavatValintakoeOids', function() {
        var oids = scope.model.aktiivisetJaLahetettavatValintakoeOids();
        expect(oids.length).toBe(1);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing PistesyottoController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, hakeneetModel, hakukohdeModel,
        hakukohdejson,additionaljson,hakukohdenimijson,avaimetjson, tarjontaHakukohde;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, additionaldataJSON, hakukohdenimiJSON, avaimetJSON, HakukohdeKoodistosta) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakeneetModel = $injector.get('HakeneetModel');
        hakukohdeModel = $injector.get('HakukohdeModel');
        hakukohdejson = hakukohdeJSON;
        additionaljson = additionaldataJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        avaimetjson = avaimetJSON;
        tarjontaHakukohde = $injector.get('HakukohdeTarjonnasta');
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get PistesyottoController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,tarjontaHakukohde);
        $httpBackend.expectGET('resources/valintakoe/hakutoive/'+routeParams.hakukohdeOid)
            .respond(201,"[]");
        $httpBackend.expectGET('haku-app/applications/additionalData/'+routeParams.hakuOid+"/"+routeParams.hakukohdeOid)
            .respond(201,additionaljson);
        $httpBackend.expectGET('resources/hakukohde/avaimet/'+routeParams.hakukohdeOid)
            .respond(201,avaimetjson);
        ctrl = $controller('PistesyottoController', {'$scope' : scope,'$location': location, '$routeParams': routeParams,
            'HakeneetModel': hakeneetModel, 'HakukohdeModel': hakukohdeModel});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakeneet.length).toBe(7);
        expect(scope.model.avaimet.length).toBe(3);
        expect(scope.model.filter).toBe("OSALLISTUU");
        expect(scope.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.muutettu).toBeFalsy();
        expect(scope.osallistuminenFilter).toBe("");
        expect(scope.predicate.length).toBe(2);
        expect(scope.predicate[0]).toBe("lastName");
        expect(scope.predicate[1]).toBe("firstNames");
    });

    it('showTiedotPartial', function() {
        expect(scope.model.hakeneet[0].showTiedotPartial).toBeFalsy();
        scope.showTiedotPartial(scope.model.hakeneet[0]);
        expect(scope.model.hakeneet[0].showTiedotPartial).toBeTruthy();
    });

    it('changeArvo', function() {
        scope.model.hakeneet[0].additionalData[0] = "OSALLISTUI";
        scope.changeArvo(scope.model.hakeneet[0], 0, scope.model.hakeneet[0].additionalData[0],"");

        expect(scope.model.hakeneet[0].additionalData[0]).toBeUndefined();
        scope.model.hakeneet[0].additionalData[0] = "OSALLISTUI";
        scope.changeArvo(scope.model.hakeneet[0], 0, scope.model.hakeneet[0].additionalData[0],"boolean");

        expect(scope.model.hakeneet[0].additionalData[0]).toBe("true");
    });

    it('osallistuvatFilter', function() {
        scope.model.hakeneet[0].osallistuu["ElÃ¤intenhoidon koulutusohjelma, pk (Maatalousalan perustutkinto), pÃ¤Ã¤sy- ja soveltuvuuskoe"] = "OSALLISTUU";
        expect(scope.osallistuvatFilter(scope.model.hakeneet[0])).toBeTruthy();
        scope.osallistuminenFilter = "a";
        expect(scope.osallistuvatFilter(scope.model.hakeneet[0])).toBeFalsy();
        scope.model.hakeneet[0].filterData["ElÃ¤intenhoidon koulutusohjelma, pk (Maatalousalan perustutkinto), pÃ¤Ã¤sy- ja soveltuvuuskoe-OSALLISTUMINEN"]="a";
        expect(scope.osallistuvatFilter(scope.model.hakeneet[0])).toBeTruthy();
    });

    it('arvoPisteet', function() {
        scope.model.hakeneet[0].additionalData["ElÃ¤intenhoidon koulutusohjelma, pk (Maatalousalan perustutkinto), pÃ¤Ã¤sy- ja soveltuvuuskoe-OSALLISTUMINEN"]="";
        scope.model.hakeneet[0].osallistuu["ElÃ¤intenhoidon koulutusohjelma, pk (Maatalousalan perustutkinto), pÃ¤Ã¤sy- ja soveltuvuuskoe"] = "OSALLISTUU";
        scope.arvoPisteet();
        expect(scope.model.hakeneet[0].additionalData["ElÃ¤intenhoidon koulutusohjelma, pk (Maatalousalan perustutkinto), pÃ¤Ã¤sy- ja soveltuvuuskoe-OSALLISTUMINEN"]).toBe("OSALLISTUI");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing HarkinnanvaraisetController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, $log, ilmoitus, ilmoitusTila, latausikkuna,
        koekutsukirjeet, osoitetarratHakemuksille, harkinnanvaraisetModel, pohjakoulutukset, hakukohdeModel, hakeneetModel,
        hakukohdejson,hakeneetjson,hakukohdenimijson, hakutoiveetjson, tarjontaHakukohde;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, hakeneetJSON, hakukohdenimiJSON, hakutoiveetJSON, HakukohdeKoodistosta, HakukohdeTarjonnasta) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $log = $injector.get('$log');
        $controller = $injector.get('$controller');
        hakukohdeModel = $injector.get('HakukohdeModel');
        hakeneetModel = $injector.get('HakeneetModel');
        ilmoitus = $injector.get('Ilmoitus');
        ilmoitusTila = $injector.get('IlmoitusTila');
        latausikkuna = $injector.get('Latausikkuna');
        koekutsukirjeet = $injector.get('Koekutsukirjeet');
        osoitetarratHakemuksille = $injector.get('OsoitetarratHakemuksille');
        harkinnanvaraisetModel = $injector.get('HarkinnanvaraisetModel');
        pohjakoulutukset = $injector.get('Pohjakoulutukset');
        tarjontaHakukohde = HakukohdeTarjonnasta;
        hakukohdejson = hakukohdeJSON;
        hakeneetjson = hakeneetJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        hakutoiveetjson = hakutoiveetJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get HarkinnanvaraisetController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,tarjontaHakukohde);

        $httpBackend.expectGET('haku-app/applications?aoOid='+routeParams.hakukohdeOid+'&appState=ACTIVE&appState=INCOMPLETE&rows=100000')
            .respond(201,hakeneetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000827076?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000840202?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000846235?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000833345?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000832029?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000828499?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000861032?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000869924?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000847247?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000872681?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000842048?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000875976?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000857004?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000843021?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000869636?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000858430?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);
        $httpBackend.expectGET('haku-app/applications/1.2.246.562.11.00000871815?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakutoiveetjson);

        $httpBackend.expectGET('resources/harkinnanvarainenhyvaksynta/haku/'+routeParams.hakuOid+'/hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,[]);

        ctrl = $controller('HarkinnanvaraisetController', {'$scope' : scope,'$location': location, '$log' : $log,
            '$routeParams': routeParams, 'Ilmoitus': ilmoitus, 'IlmoitusTila': ilmoitusTila, 'Latausikkuna': latausikkuna,
            'Koekutsukirjeet': koekutsukirjeet, 'OsoitetarratHakemuksille': osoitetarratHakemuksille,
            'HarkinnanvaraisetModel': harkinnanvaraisetModel, 'HakukohdeModel': hakukohdeModel,
            'Pohjakoulutukset': pohjakoulutukset});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakeneet.length).toBe(17);
        expect(scope.arvoFilter).toBe("SYOTETTAVA_ARVO");
        expect(scope.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.muutettu).toBeFalsy();
        expect(scope.pohjakoulutukset[0]).toBe("Ulkomailla suoritettu koulutus");
        expect(scope.pohjakoulutukset[1]).toBe("Perusopetuksen oppimäärä");
        expect(scope.pohjakoulutukset[2]).toBe("Perusopetuksen osittain yksilöllistetty oppimäärä");
        expect(scope.pohjakoulutukset[3]).toBe("Perusopetuksen yksilöllistetty oppimäärä, opetus järjestetty toiminta-alueittain");
        expect(scope.pohjakoulutukset[6]).toBe("Perusopetuksen pääosin tai kokonaan yksilöllistetty oppimäärä");
        expect(scope.pohjakoulutukset[7]).toBe("Oppivelvollisuuden suorittaminen keskeytynyt (ei päättötodistusta)");
        expect(scope.pohjakoulutukset[9]).toBe("Lukion päättötodistus, ylioppilastutkinto tai abiturientti");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});


describe('Testing ValintalaskentatulosController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, $timeout, $upload,
        ilmoitus, ilmoitusTila, latausikkuna, valintatapajonoVienti, valintalaskentatulosModel, tulosXls, hakukohdeModel,
        $http, authService, hakukohdejson, valinnanvaihejson, hakukohdenimijson, userModel;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, valinnanvaiheJSON, hakukohdenimiJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $upload = $injector.get('$upload');
        $timeout = $injector.get('$timeout');
        $controller = $injector.get('$controller');
        ilmoitus = $injector.get('Ilmoitus');
        ilmoitusTila = $injector.get('IlmoitusTila');
        latausikkuna = $injector.get('Latausikkuna');
        valintatapajonoVienti = $injector.get('ValintatapajonoVienti');
        valintalaskentatulosModel = $injector.get('ValintalaskentatulosModel');
        tulosXls = $injector.get('TulosXls');
        hakukohdeModel = $injector.get('HakukohdeModel');
        $http = $injector.get('$http');
        authService = $injector.get('AuthService');
        userModel = $injector.get('UserModel');
        hakukohdejson = hakukohdeJSON;
        valinnanvaihejson = valinnanvaiheJSON;
        hakukohdenimijson = hakukohdenimiJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get ValintalaskentatulosController', function() {
        scope = $rootScope.$new();
        location = $location;

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,{});
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/valinnanvaihe?tarjoajaOid=')
            .respond(201,valinnanvaihejson);

        $httpBackend.expectGET('/organisaatio-service/organisaatio/1.2.246.562.10.00000000001')
            .respond(201,"1.2.246.562.10.00000000001/1.2.246.562.20.59262166669");
        $httpBackend.expectGET('organisaatio/1.2.246.562.10.60222091211/parentoids')
            .respond(201,"1.2.246.562.10.00000000001/1.2.246.562.20.59262166669");
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/ilmanlaskentaa')
            .respond(201,"[]");
        ctrl = $controller('ValintalaskentatulosController', {'$scope' : scope,'$location': location,
            '$routeParams': routeParams, '$timeout': $timeout, '$upload': $upload,
            'Ilmoitus': ilmoitus, 'IlmoitusTila': ilmoitusTila, 'Latausikkuna': latausikkuna,
            'ValintatapajonoVienti': valintatapajonoVienti, 'ValintalaskentatulosModel': valintalaskentatulosModel,
            'TulosXls': tulosXls, 'hakukohdeModel': hakukohdeModel, '$http': $http, 'AuthService': authService, 'UserModel': userModel});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakeneet.length).toBe(0);
        expect(scope.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.model.valinnanvaiheet.length).toBe(3);
        expect(scope.model.ilmanlaskentaa.length).toBe(0);
    });

    it('showHistory', function() {
        var valintatapajonoOid = "oid1";
        var hakemusOid = "oid2";
        scope.showHistory(valintatapajonoOid, hakemusOid);
        expect(location.path()).toMatch('/valintatapajono/' + valintatapajonoOid + '/hakemus/' + hakemusOid + '/valintalaskentahistoria');
    });

    it('showTilaPartial', function() {
        var valintatulos = {
        };
        scope.showTilaPartial(valintatulos);
        expect(valintatulos.showTilaPartial).toBeFalsy();
        scope.showTilaPartial(valintatulos);
        expect(valintatulos.showTilaPartial).toBeTruthy();
    });

    it('showHenkiloPartial', function() {
        var valintatulos = {
        };
        scope.showHenkiloPartial(valintatulos);
        expect(valintatulos.showHenkiloPartial).toBeFalsy();
        scope.showHenkiloPartial(valintatulos);
        expect(valintatulos.showHenkiloPartial).toBeTruthy();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});



describe('Testing HakuController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, hakuModel, parametriService,
        findalljson, userModel, customHakuUtil;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, findallJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakuModel = $injector.get('HakuModel');
        parametriService = $injector.get('ParametriService');

        userModel = $injector.get('UserModel');
        customHakuUtil = $injector.get('CustomHakuUtil');

        findalljson = findallJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get HakuController', function() {
        scope = $rootScope.$new();
        location = $location;

        $httpBackend.expectGET('haku/findAll')
            .respond(201,findalljson);

        $httpBackend.expectGET('codeelement/codes/hakutyyppi/1')
            .respond(201,'[]');
        $httpBackend.expectGET('codeelement/codes/haunkohdejoukko/1')
            .respond(201,'[]');
        $httpBackend.expectGET('codeelement/codes/hakutapa/1')
            .respond(201,'[]');
        $httpBackend.expectGET('codeelement/codes/kausi/1')
            .respond(201,'[]');

        $httpBackend.expectGET('resources/parametrit/'+routeParams.hakuOid)
            .respond(201,'{"valintakoekutsut":true,"hakeneet":true,"valintalaskenta":true,"pistesyotto":true,"valinnanhallinta":true,"harkinnanvaraiset":true}');

        $httpBackend.expectGET('/organisaatio-service/organisaatio/1.2.246.562.10.00000000001')
            .respond(201,'"1.2.246.562.10.00000000001"');

        ctrl = $controller('HakuController', {'$scope' : scope,'$location': location,
            '$routeParams': routeParams, 'HakuModel': hakuModel, 'ParametriService': parametriService,
            'UserModel': userModel,'CustomHakuUtil': customHakuUtil});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakumodel.haut.length).toBe(4);
        expect(scope.hakumodel.lisahaku).toBeFalsy();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing ValintalaskentaHistoriaController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, valintalaskentaHistoriaModel;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $location = $injector.get('$location');
        valintalaskentaHistoriaModel = $injector.get('ValintalaskentaHistoriaModel');

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");

        $httpBackend.expectGET('resources/jonosijahistoria')
            .respond(201,[]);
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintalaskentaHistoriaController', function() {
        scope = $rootScope.$new();

        ctrl = $controller('ValintalaskentaHistoriaController', {'$scope' : scope, '$routeParams': routeParams,
            'ValintalaskentaHistoriaModel': valintalaskentaHistoriaModel});

    });

    it('check initialized variables', function() {
        expect(scope.model.valuesToAdd.length).toBe(2);
        expect(scope.model.valuesToAdd[0]).toBe("Nimetty lukuarvo");
        expect(scope.model.valuesToAdd[1]).toBe("Nimetty totuusarvo");
    });

    it('check prepareValuesForUi', function() {
        scope.model.model.push(
            {
                funktio : "Nimetty lukuarvo",
                tulos: "1"
            });
        scope.model.model.push(
            {
                funktio : "Nimetty 3totuusarvo",
                tulos: "2"
            });
        scope.model.model.push(
            {
                funktio : "Nimetty totuusarvo",
                tulos: "3"
            });

        scope.model.prepareValuesForUi();
        expect(scope.model.model.valueArray.length).toBe(2);
        expect(scope.model.model.valueArray[0].tulos).toBe("1");
        expect(scope.model.model.valueArray[1].tulos).toBe("3");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});


xdescribe('Testing HenkiloTiedotController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, $q, $modal, parametriService, latausikkuna,
        jalkiohjauskirjepohjat,jalkiohjauskirjeet,henkiloTiedotModel,authService,pohjakoulutukset,ilmoitus,ilmoitusTila,
        hakujson,hakuhenkilojson, sijoitteluajolatestjson;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector,hakuJSON,hakuhenkiloJSON,sijoitteluajolatestJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $location = $injector.get('$location');
        $q = $injector.get('$q');
        $modal = $injector.get('$modal');
        parametriService = $injector.get('ParametriService');
        latausikkuna = $injector.get('Latausikkuna');
        jalkiohjauskirjepohjat = $injector.get('Jalkiohjauskirjepohjat');
        jalkiohjauskirjeet = $injector.get('Jalkiohjauskirjeet');
        henkiloTiedotModel = $injector.get('HenkiloTiedotModel');
        authService = $injector.get('AuthService');
        pohjakoulutukset = $injector.get('Pohjakoulutukset');
        ilmoitus = $injector.get('Ilmoitus');
        ilmoitusTila = $injector.get('IlmoitusTila');
        hakujson = hakuJSON;
        hakuhenkilojson = hakuhenkiloJSON;
        sijoitteluajolatestjson = sijoitteluajolatestJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        $httpBackend.flush();
    }));

    it('should get HenkiloTiedotController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('haku/'+routeParams.hakuOid)
            .respond(201,hakujson);
        $httpBackend.expectGET('haku-app/applications?appState=ACTIVE&appState=INCOMPLETE')
            .respond(201,hakuhenkilojson);
        $httpBackend.expectGET('resources/harkinnanvarainenhyvaksynta/haku/'+routeParams.hakuOid+'/hakemus')
            .respond(201,"[]");
        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakemus/1.2.246.562.11.00000832618')
            .respond(201,sijoitteluajolatestjson);
        $httpBackend.expectGET('resources/valintakoe/hakemus/1.2.246.562.11.00000832618')
            .respond(201,'{"hakuOid":null,"hakemusOid":null,"hakijaOid":null,"etunimi":null,"sukunimi":null,"createdAt":null,"hakutoiveet":[]}');
        $httpBackend.expectGET('resources/tila/hakukohde/1.2.246.562.5.50892484929/13964193066528565284441732547687')
            .respond(201,'[{"logEntries":[]}]');
        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakukohde/1.2.246.562.5.50892484929')
            .respond(201,sijoitteluajolatestjson);
        $httpBackend.expectGET('resources/tila/hakukohde/1.2.246.562.5.11316132247/1397646876830-5369318340180590787')
            .respond(201,'[{"logEntries":[]}]');
        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakukohde/1.2.246.562.5.11316132247')
            .respond(201,sijoitteluajolatestjson);
        $httpBackend.expectGET('resources/tila/1.2.246.562.11.00000832618')
            .respond(201,'[{"logEntries":[]}]');


        $httpBackend.expectGET('resources/hakemus/'+routeParams.hakuOid)
            .respond(201,'{"hakuoid":"1.2.246.562.5.2013080813081926341927","hakemusoid":"1.2.246.562.11.00000852630","hakukohteet":[]}');

        ctrl = $controller('HenkiloTiedotController', {'$q' : $q, '$scope' : scope, '$modal': $modal, '$routeParams': routeParams,
            'ParametriService': parametriService, 'Latausikkuna': latausikkuna, 'Jalkiohjauskirjepohjat': jalkiohjauskirjepohjat,
            'Jalkiohjauskirjeet':jalkiohjauskirjeet, 'HenkiloTiedotModel': henkiloTiedotModel, 'AuthService': authService,
            'Pohjakoulutukset':pohjakoulutukset, 'Ilmoitus': ilmoitus, 'IlmoitusTila': ilmoitusTila});
        $httpBackend.flush();
    });


    it('vastaanottoTilaOptionsToShow', function() {
        var hakutoive = {
            hakutoiveenValintatapajonot: [
                {
                    tila: 'HYVAKSYTTY',
                    valintatapajonoPrioriteetti: 1,
                    valintatapajonoOid: '13964193066528565284441732547687'
                }

            ]
        };
        scope.model.vastaanottoTilaOptionsToShow(hakutoive);
        expect(scope.model.sijoittelu[hakutoive.hakutoiveenValintatapajonot[0].valintatapajonoOid].showSitovasti).toBeTruthy();
        expect(scope.model.sijoittelu[hakutoive.hakutoiveenValintatapajonot[0].valintatapajonoOid].showEhdollisesti).toBeFalsy();

        hakutoive.hakutoiveenValintatapajonot[0].valintatapajonoPrioriteetti = 2;
        scope.model.vastaanottoTilaOptionsToShow(hakutoive);
        expect(scope.model.sijoittelu[hakutoive.hakutoiveenValintatapajonot[0].valintatapajonoOid].showSitovasti).toBeFalsy();
        expect(scope.model.sijoittelu[hakutoive.hakutoiveenValintatapajonot[0].valintatapajonoOid].showEhdollisesti).toBeTruthy();
    });


    it('isValinnanvaiheVisible', function() {
        var index = 1;
        var valinnanvaiheet = [
            {
                valintatapajonot: [
                    {}
                ]
            }
        ];

        expect(scope.isValinnanvaiheVisible(index, valinnanvaiheet)).toBeFalsy();
        index = 0;

        expect(scope.isValinnanvaiheVisible(index, valinnanvaiheet)).toBeTruthy();
    });


    it('changeOsallistuminen', function() {
        var value = undefined;
        var hakija = {
            additionalData: []
        };
        hakija.additionalData['123'] = "";
        var tunniste = '123';

        scope.changeOsallistuminen(hakija, tunniste, value);
        expect(hakija.additionalData['123']).toBe("");
        value = 1;
        scope.changeOsallistuminen(hakija, tunniste, value);
        expect(hakija.additionalData['123']).toBe("OSALLISTUI");
    });


    it('changeArvo', function() {
        var value = "OSALLISTUI";
        var hakija = {
            additionalData: []
        };
        hakija.additionalData['123'] = "";
        var tunniste = '123';
        var tyyppi = "";

        scope.changeArvo(hakija, tunniste, value, tyyppi);
        expect(hakija.additionalData['123']).toBeUndefined();
        tyyppi = "boolean";

        scope.changeArvo(hakija, tunniste, value, tyyppi);
        expect(hakija.additionalData['123']).toBe("true");
    });

    it('check initialized variables', function() {
        expect(scope.model.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.model.hakutoiveet.length).toBe(2);
        expect(scope.model.errors.length).toBe(0);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});


describe('Testing YhteisvalinnanHallintaController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, $q, $modal, latausikkuna,
        jalkiohjauskirjepohjat,jalkiohjauskirjeet,ilmoitus,ilmoitusTila,sijoittelunTulosTaulukkolaskenta,
        sijoittelunTulosOsoitetarrat,sijoittelunTulosHyvaksymiskirjeet,aktivoiKelaFtp,
        kelaDokumentti,sijoitteluAjo,jalkiohjausXls,sijoitteluAktivointi,hakuModel,virheModel,jatkuvaSijoittelu,
        $interval,$log,$timeout,$http,$route,$window,sijoitteluajolatestalljson, findalljson;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector,sijoitteluajolatestallJSON, findallJSON) {
        $window = $injector.get('$window');
        $route = $injector.get('$route');
        $http = $injector.get('$http');
        $timeout = $injector.get('$timeout');
        $log = $injector.get('$log');
        $interval = $injector.get('$interval');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $location = $injector.get('$location');
        $q = $injector.get('$q');
        $modal = $injector.get('$modal');
        latausikkuna = $injector.get('Latausikkuna');
        jalkiohjauskirjepohjat = $injector.get('Jalkiohjauskirjepohjat');
        jalkiohjauskirjeet = $injector.get('Jalkiohjauskirjeet');
        ilmoitus = $injector.get('Ilmoitus');
        ilmoitusTila = $injector.get('IlmoitusTila');
        sijoittelunTulosTaulukkolaskenta = $injector.get('SijoittelunTulosTaulukkolaskenta');
        sijoittelunTulosOsoitetarrat = $injector.get('SijoittelunTulosOsoitetarrat');
        sijoittelunTulosHyvaksymiskirjeet = $injector.get('SijoittelunTulosHyvaksymiskirjeet');
        aktivoiKelaFtp = $injector.get('AktivoiKelaFtp');
        kelaDokumentti = $injector.get('KelaDokumentti');
        sijoitteluAjo = $injector.get('SijoitteluAjo');
        jalkiohjausXls = $injector.get('JalkiohjausXls');
        sijoitteluAktivointi = $injector.get('SijoitteluAktivointi');
        hakuModel = $injector.get('HakuModel');
        virheModel = $injector.get('VirheModel');
        jatkuvaSijoittelu = $injector.get('JatkuvaSijoittelu');
        sijoitteluajolatestalljson = sijoitteluajolatestallJSON;
        findalljson = findallJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('haku/haut.html').respond("");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        $httpBackend.flush();
    }));

    it('should get YhteisvalinnanHallintaController', function() {
        scope = $rootScope.$new();


        $httpBackend.expectGET('haku/findAll')
            .respond(201,findalljson);
        $httpBackend.expectGET('resources/sijoittelu/' + routeParams.hakuOid + '/sijoitteluajo/latest')
            .respond(201,sijoitteluajolatestalljson);
        $httpBackend.expectGET('resources/koostesijoittelu/jatkuva?hakuOid=' + routeParams.hakuOid)
            .respond(201,"");

        ctrl = $controller('YhteisvalinnanHallintaController', {'$scope' : scope, '$modal': $modal, '$interval': $interval,
            '_': _,'SijoittelunTulosTaulukkolaskenta': sijoittelunTulosTaulukkolaskenta,
            'SijoittelunTulosOsoitetarrat':sijoittelunTulosOsoitetarrat,'SijoittelunTulosHyvaksymiskirjeet':sijoittelunTulosHyvaksymiskirjeet,
            'Jalkiohjauskirjepohjat':jalkiohjauskirjepohjat, 'AktivoiKelaFtp': aktivoiKelaFtp, '$log': $log, '$timeout': $timeout,
            '$q':$q,'$location':$location,'Ilmoitus':ilmoitus,
            'KelaDokumentti':kelaDokumentti,'Latausikkuna':latausikkuna,'$routeParams':routeParams, '$http':$http,
            '$route':$route,'$window':$window,'SijoitteluAjo':sijoitteluAjo,'JalkiohjausXls':jalkiohjausXls,
            'Jalkiohjauskirjeet':jalkiohjauskirjeet, 'SijoitteluAktivointi':sijoitteluAktivointi,'HakuModel':hakuModel,
            'VirheModel':virheModel,'JatkuvaSijoittelu':jatkuvaSijoittelu,'IlmoitusTila':ilmoitusTila
        });
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing ValintatulosController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, valintatulosModel;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $location = $injector.get('$location');
        valintatulosModel = $injector.get('ValintatulosModel');

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintatulosController', function() {
        scope = $rootScope.$new();

        ctrl = $controller('ValintatulosController', {'$scope' : scope, 'ValintatulosModel':valintatulosModel, '$routeParams': routeParams});

    });

    it('check initialized variables', function() {
        expect(scope.model.hakemukset.length).toBe(0);
        expect(scope.model.hakemusCount).toBeNull();
        expect(scope.model.hakuOid).toBeNull();
        expect(scope.model.filter.hakukohteet.length).toBe(0);
        expect(scope.model.filter.type).toBe("KAIKKI");
    });

    it('addHakukohde', function() {
        var hakukohde = {};
        scope.hakukohdeToAdd = hakukohde;

        expect(scope.model.filter.hakukohteet.length).toBe(0);
        scope.addHakukohde();
        expect(scope.model.filter.hakukohteet.length).toBe(1);
    });

    it('deleteHakukohde', function() {
        expect(scope.model.filter.hakukohteet.length).toBe(1);
        scope.deleteHakukohde(0);
        expect(scope.model.filter.hakukohteet.length).toBe(0);
    });

    it('getHakukohdeStyle', function() {
        var hakukohde = {
            hakutoiveenValintatapajonot: [
                {tila:"HYVAKSYTTY"},
                {tila:"PERUUNTUNUT"},
                {tila:"PERUNUT"},
                {tila:"HYLATTY"}
            ]
        };
        expect(scope.getHakukohdeStyle(hakukohde),"VARALLA");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing LisahakuhyvaksytytController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, hyvaksytytModel, hakukohdeModel, authService,
        hakemusKey,hakukohdejson,hakeneetjson,hakukohdenimijson,hakutoiveetjson, localisationService,sijoitteluajojson,
        hakukohdetilajson, hakujson;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector,hakukohdeJSON,hakeneetJSON,hakukohdenimiJSON,hakutoiveetJSON,sijoitteluajoJSON,
                               hakukohdetilaJSON, hakuJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $location = $injector.get('$location');
        hyvaksytytModel = $injector.get('HyvaksytytModel');
        hakukohdeModel = $injector.get('HakukohdeModel');
        authService = $injector.get('AuthService');
        hakemusKey = $injector.get('HakemusKey');
        localisationService = $injector.get('LocalisationService');
        hakukohdejson = hakukohdeJSON;
        hakeneetjson = hakeneetJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        hakutoiveetjson = hakutoiveetJSON;
        sijoitteluajojson = sijoitteluajoJSON;
        hakukohdetilajson = hakukohdetilaJSON;
        hakujson = hakuJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        $httpBackend.flush();
    }));

    it('should get LisahakuhyvaksytytController', function() {
        scope = $rootScope.$new();


        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);

        $httpBackend.expectGET('haku/'+routeParams.hakuOid)
            .respond(201,hakujson);


        $httpBackend.expectGET('haku-app/applications?aoOid='+routeParams.hakukohdeOid+'&appState=ACTIVE&appState=INCOMPLETE&rows=100000')
            .respond(201,hakeneetjson);
        for (var i = 0; i < 8; i++) {
            $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");
        }

        $httpBackend.expectGET('organisaatio/'+routeParams.hakukohdeOid+'/parentoids')
            .respond(201,"1.2.246.562.10.00000000001/1.2.246.562.20.59262166669");


        $httpBackend.expectGET('organisaatio/'+routeParams.hakukohdeOid+'/parentoids')
            .respond(201,"1.2.246.562.10.00000000001/1.2.246.562.20.59262166669");



        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,sijoitteluajojson);

        $httpBackend.expectGET('resources/tila/hakukohde/'+routeParams.hakukohdeOid+'/1397647295344-8565235898154713515')
            .respond(201,hakukohdetilajson);


        ctrl = $controller('LisahakuhyvaksytytController', {'$scope' : scope, '$location':$location, '$routeParams': routeParams,
        'HyvaksytytModel':hyvaksytytModel,'HakukohdeModel':hakukohdeModel,'AuthService':authService,'HakemusKey':hakemusKey,
        'LocalisationService':localisationService});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat.length).toBe(8);
        expect(scope.muutettu).toBeFalsy();
        expect(scope.predicate).toBe("sukunimi");
        expect(scope.model.hakeneet.length).toBe(17);

        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[0].value).toBe("EI_TEHTY");
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[1].value).toBe("LASNA_KOKO_LUKUVUOSI");
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[2].value).toBe("POISSA_KOKO_LUKUVUOSI");
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[3].value).toBe("EI_ILMOITTAUTUNUT");
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[4].value).toBe("LASNA_SYKSY");
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[5].value).toBe("POISSA_SYKSY");
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[6].value).toBe("LASNA");
        expect(scope.hakemuksenMuokattuIlmoittautumisTilat[7].value).toBe("POISSA");


    });

    it('resetIlmoittautumisTila', function() {
        var hakemus = {
            muokattuVastaanottoTila: 'VASTAANOTTANUT',
            muokattuIlmoittautumisTila: 'TEHTY'
        };
        scope.resetIlmoittautumisTila(hakemus);
        expect(hakemus.muokattuIlmoittautumisTila).toBe("TEHTY");
        hakemus.muokattuVastaanottoTila = "EHDOLLISESTI_VASTAANOTTANUT";
        scope.resetIlmoittautumisTila(hakemus);
        expect(hakemus.muokattuIlmoittautumisTila).toBe("TEHTY");
        hakemus.muokattuVastaanottoTila = "EI_VASTAANOTTANUT";
        scope.resetIlmoittautumisTila(hakemus);
        expect(hakemus.muokattuIlmoittautumisTila).toBe("EI_TEHTY");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});



describe('Häviääko koetulokset', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, hakeneetModel, hakukohdeModel,
        hakukohdejson,additionaljson,hakukohdenimijson,avaimetjson,osallistumisetjson, tarjontaHakukohde;
    var routeParams = {"hakuOid": "1.2.246.562.29.173465377510",
        "hakukohdeOid" : "1.2.246.562.20.81959342411"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, pisteAdditionalJSON, HakukohdeTarjonnasta, hakukohdenimiJSON, pisteAvaimetJSON, pisteOsallistuminenJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakeneetModel = $injector.get('HakeneetModel');
        hakukohdeModel = $injector.get('HakukohdeModel');
        hakukohdejson = hakukohdeJSON;
        additionaljson = pisteAdditionalJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        avaimetjson = pisteAvaimetJSON;
        tarjontaHakukohde = HakukohdeTarjonnasta;
        osallistumisetjson = pisteOsallistuminenJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintalaskenta').respond("");

        $httpBackend.flush();
    }));

    it('should get AlaHavitaPistesyottoController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,tarjontaHakukohde);
        $httpBackend.expectGET('resources/valintakoe/hakutoive/'+routeParams.hakukohdeOid)
            .respond(201,osallistumisetjson);
        $httpBackend.expectGET('haku-app/applications/additionalData/'+routeParams.hakuOid+"/"+routeParams.hakukohdeOid)
            .respond(201,additionaljson);
        $httpBackend.expectGET('resources/hakukohde/avaimet/'+routeParams.hakukohdeOid)
            .respond(201,avaimetjson);
        ctrl = $controller('PistesyottoController', {'$scope' : scope,'$location': location, '$routeParams': routeParams,
            'HakeneetModel': hakeneetModel, 'HakukohdeModel': hakukohdeModel});

        $httpBackend.flush();
    });

    it('haviaakoPisteet', function() {
        console.log('-----------------------------',scope.model);
        expect(scope.model.hakeneet[0].additionalData["SOTE1_kaikkiosiot-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(scope.model.hakeneet[0].additionalData["SOTE1_kaikkiosiot"]).toBe("1");
        expect(scope.model.hakeneet[0].additionalData["SOTEKOE_VK_RYHMA1-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(scope.model.hakeneet[0].additionalData["SOTEKOE_VK_RYHMA1"]).toBe("59");

        expect(scope.model.hakeneet[1].additionalData["SOTE1_kaikkiosiot-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(scope.model.hakeneet[1].additionalData["SOTE1_kaikkiosiot"]).toBe("1");
        expect(scope.model.hakeneet[1].additionalData["SOTEKOE_VK_RYHMA1-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(scope.model.hakeneet[1].additionalData["SOTEKOE_VK_RYHMA1"]).toBe("59");

        var hakeneet = angular.copy(scope.model.hakeneet);
        hakeneet.forEach(function(hakija){
            hakija.filterData = undefined;
            hakija.osallistuu = undefined;
        });

        expect(hakeneet[0].additionalData["SOTE1_kaikkiosiot-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(hakeneet[0].additionalData["SOTE1_kaikkiosiot"]).toBe("1");
        expect(hakeneet[0].additionalData["SOTEKOE_VK_RYHMA1-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(hakeneet[0].additionalData["SOTEKOE_VK_RYHMA1"]).toBe("59");

        expect(hakeneet[1].additionalData["SOTE1_kaikkiosiot-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(hakeneet[1].additionalData["SOTE1_kaikkiosiot"]).toBe("1");
        expect(hakeneet[1].additionalData["SOTEKOE_VK_RYHMA1-OSALLISTUMINEN"]).toBe("OSALLISTUI");
        expect(hakeneet[1].additionalData["SOTEKOE_VK_RYHMA1"]).toBe("59");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});