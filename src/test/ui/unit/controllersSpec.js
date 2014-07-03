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
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");
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
            'GlobalStates': globalStates, 'HakuModel': hakuModel});
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
            hakukohdeOid: '1.2.246.562.5.39836447563'
        };
        var lisahaku = false;
        scope.showHakukohde(hakukohde, lisahaku);
        expect(scope.hakukohteetVisible).toBeFalsy();
        expect(globalStates.hakukohteetVisible).toBeFalsy();
        expect(rootScope.selectedHakukohdeNimi).toBe('koulu1');
        expect(location.path()).toMatch('/haku/.*');
    });

    it('showHakukohde lisähaku', function() {
        var hakukohde = {
            hakukohdeNimi : {
                fi: 'koulu2'
            },
            hakukohdeOid: '1.2.246.562.5.39836447563'
        };
        var lisahaku = true;
        scope.showHakukohde(hakukohde, lisahaku);
        expect(scope.hakukohteetVisible).toBeFalsy();
        expect(globalStates.hakukohteetVisible).toBeFalsy();
        expect(rootScope.selectedHakukohdeNimi).toBe('koulu2');
        expect(location.path()).toMatch('/lisahaku/.*');
    });

    it('toggleHakukohteetVisible', function() {
        scope.toggleHakukohteetVisible();
        expect(globalStates.hakukohteetVisible).toBeTruthy();
        scope.toggleHakukohteetVisible();
        expect(globalStates.hakukohteetVisible).toBeFalsy();
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
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");
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

describe('Testing SijoitteluntulosController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location,
        scope,ctrl,hakukohdenimijson,hakukohdetilajson,hakujson,hakukohdejson, sijoitteluajojson, $modal, $window,
        kirjepohjat,latausikkuna,hakukohdeModel,
        sijoitteluntulosModel, osoitetarratSijoittelussaHyvaksytyille, hyvaksymiskirjeet, jalkiohjauskirjeet,
        sijoitteluXls, authService;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

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

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get sijoitteluntulokset', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);

        $httpBackend.expectGET('/dokumentit/osoitetarrat/'+routeParams.hakukohdeOid)
            .respond(201,'');
        $httpBackend.expectGET('/dokumentit/hyvaksymiskirjeet/'+routeParams.hakukohdeOid)
            .respond(201,'');
        $httpBackend.expectGET('/dokumentit/sijoitteluntulokset/'+routeParams.hakukohdeOid)
            .respond(201,'');

        $httpBackend.expectGET('haku/'+routeParams.hakuOid)
            .respond(201,hakujson);
        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,sijoitteluajojson);
        $httpBackend.expectGET('organisaatio/undefined/parentoids')
            .respond(201,'1.2.246.562.10.00000000001/undefined');
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);
        $httpBackend.expectGET('organisaatio/1.2.246.562.10.60222091211/parentoids')
            .respond(201,'1.2.246.562.10.00000000001/1.2.246.562.10.47941294986/1.2.246.562.10.98873174761/1.2.246.562.10.60222091211');
        $httpBackend.expectGET('resources/tila/hakukohde/'+routeParams.hakukohdeOid+'/1397647295344-8565235898154713515')
            .respond(201,hakukohdetilajson);


        ctrl = $controller('SijoitteluntulosController', {'$scope' : scope, '$modal' : $modal, '$routeParams': routeParams,
            '$window' : $window, 'Kirjepohjat': kirjepohjat, 'Latausikkuna': latausikkuna, 'HakukohdeModel': hakukohdeModel,
            'SijoitteluntulosModel': sijoitteluntulosModel, 'OsoitetarratSijoittelussaHyvaksytyille': osoitetarratSijoittelussaHyvaksytyille,
            'Hyvaksymiskirjeet': hyvaksymiskirjeet, 'Jalkiohjauskirjeet': jalkiohjauskirjeet, 'SijoitteluXls': sijoitteluXls,
            'AuthService': authService});

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
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[0].muokattuVastaanottoTila).toBe("");
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[3].muokattuVastaanottoTila).toBe("");
        scope.selectIlmoitettuToAll(valintatapajonoOid);
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[0].muokattuVastaanottoTila).toBe("ILMOITETTU");
        expect(scope.model.sijoitteluTulokset.valintatapajonot[0].hakemukset[3].muokattuVastaanottoTila).toBe("");
    });

    it('isKorkeakoulu', function() {
        scope.model.haku.kohdejoukkoUri = "uri_1";
        expect(scope.hakemuksenMuokattuVastaanottoTilat.length).toBe(5);
        scope.isKorkeakoulu();
        expect(scope.hakemuksenMuokattuVastaanottoTilat.length).toBe(5);
        scope.model.haku.kohdejoukkoUri = "uri_12";
        scope.isKorkeakoulu();
        expect(scope.hakemuksenMuokattuVastaanottoTilat.length).toBe(6);
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

    afterEach(function() {

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});




describe('Testing HakukohdeController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, hakukohdeModel, hakuModel,
        sijoitteluntulosModel, location, hakukohdejson, hakujson, sijoitteluajojson, hakukohdenimijson,
        hakukohdetilajson;

    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, hakuJSON, sijoitteluajoJSON, hakukohdenimiJSON,
                               hakukohdetilaJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeModel = $injector.get('HakukohdeModel');
        hakuModel = $injector.get('HakuModel');
        sijoitteluntulosModel = $injector.get('SijoitteluntulosModel');
        hakukohdejson = hakukohdeJSON;
        hakujson = hakuJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        sijoitteluajojson = sijoitteluajoJSON;
        hakukohdetilajson = hakukohdetilaJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get HakukohdeController', function() {
        scope = $rootScope.$new();
        location = $location;

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('haku/'+routeParams.hakuOid)
            .respond(201,hakujson);
        $httpBackend.expectGET('resources/sijoittelu/'+routeParams.hakuOid+'/sijoitteluajo/latest/hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,sijoitteluajojson);
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);
        $httpBackend.expectGET('resources/tila/hakukohde/'+routeParams.hakukohdeOid+'/1397647295344-8565235898154713515')
            .respond(201,hakukohdetilajson);

        ctrl = $controller('HakukohdeController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'HakukohdeModel': hakukohdeModel, 'HakuModel': hakuModel, 'SijoitteluntulosModel': sijoitteluntulosModel});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.model.hakukohde.alinHyvaksyttavaKeskiarvo).toBe(0);
        expect(scope.model.hakukohde.alinValintaPistemaara).toBe(0);
        expect(scope.model.hakukohde.aloituspaikatLkm).toBe(40);
        expect(scope.model.hakukohde.edellisenVuodenHakijatLkm).toBe(0);
        expect(scope.model.hakukohde.hakuOid).toBe("1.2.246.562.5.2013080813081926341927");
        expect(scope.model.hakukohde.hakuaikaAlkuPvm).toBe(1398936000000);
        expect(scope.model.hakukohde.hakuaikaLoppuPvm).toBe(1402920000000);
        expect(scope.model.hakukohde.hakukelpoisuusvaatimusUris.length).toBe(1);
        expect(scope.model.hakukohde.hakukohdeKoodistoNimi).toBe("Puutarhatalouden perustutkinto, yo, Kevät 2014, julkaistu");
        expect(scope.model.hakukohde.hakukohdeKoulutusOids.length).toBe(2);
        expect(scope.model.hakukohde.hakukohdeNimiUri).toBe("hakukohteet_879#1");
        expect(scope.model.hakukohde.kaksoisTutkinto).toBeFalsy();
        expect(scope.model.hakukohde.kaytetaanHakukohdekohtaistaHakuaikaa).toBeFalsy();
        expect(scope.model.hakukohde.kaytetaanHaunPaattymisenAikaa).toBeTruthy();
        expect(scope.model.hakukohde.kaytetaanJarjestelmanValintaPalvelua).toBeFalsy();
        expect(scope.model.hakukohde.liitteidenToimitusPvm).toBe(1394802000000);
        expect(scope.model.hakukohde.modified).toBe(1400588726870);
        expect(scope.model.hakukohde.modifiedBy).toBe("1.2.246.562.24.00000000001");
        expect(scope.model.hakukohde.oid).toBe("1.2.246.562.5.39836447563");
        expect(scope.model.hakukohde.opetuskielet.length).toBe(1);
        expect(scope.model.hakukohde.tarjoajaOid).toBe("1.2.246.562.10.60222091211");
        expect(scope.model.hakukohde.tila).toBe("JULKAISTU");
        expect(scope.model.hakukohde.valintakoes.length).toBe(1);
        expect(scope.model.hakukohde.valintaperustekuvausKoodiUri).toBe("valintaperustekuvausryhma_3#1");
        expect(scope.model.hakukohde.valintojenAloituspaikatLkm).toBe(40);
        expect(scope.model.hakukohde.version).toBe(35);
        expect(scope.model.hakukohde.ylinValintapistemaara).toBe(0);
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing HakukohdeNimiController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, hakukohdeModel;

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeModel = $injector.get('HakukohdeModel');
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get HakukohdeNimiController', function() {
        scope = $rootScope.$new();
        ctrl = $controller('HakukohdeNimiController', {'$scope' : scope, 'HakukohdeModel': hakukohdeModel});
    });

    it('check initialized variables', function() {
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing HakeneetController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, hakeneetModel, hakukohdeModel,
        hakukohdejson,hakeneetjson,hakukohdenimijson;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, hakeneetJSON, hakukohdenimiJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakeneetModel = $injector.get('HakeneetModel');
        hakukohdeModel = $injector.get('HakukohdeModel');
        hakukohdejson = hakukohdeJSON;
        hakeneetjson = hakeneetJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get HakeneetController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('haku-app/applications?aoOid='+routeParams.hakukohdeOid+'&appState=ACTIVE&appState=INCOMPLETE&rows=100000')
            .respond(201,hakeneetjson);
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);
        ctrl = $controller('HakeneetController', {'$scope' : scope,'$location': location, '$routeParams': routeParams,
            'HakeneetModel': hakeneetModel, 'HakukohdeModel': hakukohdeModel});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakeneet.length).toBe(17);
        expect(scope.model.hakeneet[10].firstNames).toBe("Peetu I");
        expect(scope.model.hakeneet[10].lastName).toBe("Kuusijoki");
        expect(scope.model.hakeneet[10].oid).toBe("1.2.246.562.11.00000842048");
        expect(scope.model.hakeneet[10].personOid).toBe("1.2.246.562.24.92205707637");
        expect(scope.model.hakeneet[10].ssn).toBe("161178-934E");
        expect(scope.model.hakeneet[10].state).toBe("INCOMPLETE");
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
        hakukohdejson,latausikkuna,ilmoitus,valinnanhallintaModel, valintalaskentaMuistissa,
            valintakoelaskentaAktivointi, parametriService, ilmoitusTila, valinnanvaihejson, hakukohdenimijson;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, valinnanvaiheJSON, hakukohdenimiJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeModel = $injector.get('HakukohdeModel');
        latausikkuna = $injector.get('Latausikkuna');
        ilmoitus = $injector.get('Ilmoitus');
        valinnanhallintaModel = $injector.get('ValinnanhallintaModel');
        valintalaskentaMuistissa = $injector.get('ValintalaskentaMuistissa');
        valintakoelaskentaAktivointi = $injector.get('ValintakoelaskentaAktivointi');
        parametriService = $injector.get('ParametriService');
        ilmoitusTila = $injector.get('IlmoitusTila');

        hakukohdejson = hakukohdeJSON;
        valinnanvaihejson = valinnanvaiheJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get ValinnanhallintaController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/valinnanvaihe')
            .respond(201,valinnanvaihejson);
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);

        ctrl = $controller('ValinnanhallintaController', {'$scope' : scope, '$routeParams': routeParams, '$modal': $modal,
            'Latausikkuna': latausikkuna, 'Ilmoitus': ilmoitus, 'ValinnanhallintaModel': valinnanhallintaModel,
            'HakukohdeModel': hakukohdeModel, 'ValintalaskentaMuistissa': valintalaskentaMuistissa, 'ValintakoelaskentaAktivointi': valintakoelaskentaAktivointi,
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
        ilmoitusTila, valintakoejson, hakukohdenimijson;
    var routeParams = {"hakuOid": "oid",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, valintakoeJSON, hakukohdenimiJSON) {
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
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get ValintakoetulosController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/valintakoe')
            .respond(201,valintakoejson);
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);
        $httpBackend.expectGET('resources/valintakoe/hakutoive/'+routeParams.hakukohdeOid)
            .respond(201,"[]");

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
        hakukohdejson,additionaljson,hakukohdenimijson,avaimetjson;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};
    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, additionaldataJSON, hakukohdenimiJSON, avaimetJSON) {
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
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get PistesyottoController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('resources/valintakoe/hakutoive/'+routeParams.hakukohdeOid)
            .respond(201,"[]");
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);
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
        koekutsukirjeet, osoitetarratHakemuksille, harkinnanvaraisetModel, pohjakuolutukset, hakukohdeModel, hakeneetModel,
        hakukohdejson,hakeneetjson,hakukohdenimijson, hakutoiveetjson;
    var routeParams = {"hakuOid": "oid1",
        "hakukohdeOid" : "oid2"};

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohdeJSON, hakeneetJSON, hakukohdenimiJSON, hakutoiveetJSON) {
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
        pohjakuolutukset = $injector.get('Pohjakuolutukset');
        hakukohdejson = hakukohdeJSON;
        hakeneetjson = hakeneetJSON;
        hakukohdenimijson = hakukohdenimiJSON;
        hakutoiveetjson = hakutoiveetJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get HarkinnanvaraisetController', function() {
        scope = $rootScope.$new();

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('haku-app/applications?aoOid='+routeParams.hakukohdeOid+'&appState=ACTIVE&appState=INCOMPLETE&rows=100000')
            .respond(201,hakeneetjson);
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);
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
            'Pohjakuolutukset': pohjakuolutukset});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakeneet.length).toBe(17);
        expect(scope.arvoFilter).toBe("SYOTETTAVA_ARVO");
        expect(scope.hakuOid).toBe(routeParams.hakuOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.muutettu).toBeFalsy();
        expect(scope.predicate).toBe("sukunimi");
        expect(scope.model.harkinnanvaraisestiHyvaksytyt.length).toBe(0);
        expect(scope.pohjakoulutukset[0]).toBe("Ulkomailla suoritettu koulutus");
        expect(scope.pohjakoulutukset[1]).toBe("Perusopetuksen oppimäärä");
        expect(scope.pohjakoulutukset[2]).toBe("Perusopetuksen osittain yksilöllistetty oppimäärä");
        expect(scope.pohjakoulutukset[3]).toBe("Perusopetuksen yksilöllistetty oppimäärä, opetus järjestetty toiminta-alueittain");
        expect(scope.pohjakoulutukset[6]).toBe("Perusopetuksen pääosin tai kokonaan yksilöllistetty oppimäärä");
        expect(scope.pohjakoulutukset[7]).toBe("Oppivelvollisuuden suorittaminen keskeytynyt (ei päättötodistusta)");
        expect(scope.pohjakoulutukset[9]).toBe("Lukion päättötodistus, ylioppilastutkinto tai abiturientti");
    });

    it('filterHarkinnanvaraiset', function() {
        expect(scope.model.filterHarkinnanvaraiset().length).toBe(0);
        scope.model.hakeneet[1].hakenutHarkinnanvaraisesti = "true";
        expect(scope.model.filterHarkinnanvaraiset().length).toBe(1);
    });

    it('filterValitut', function() {
        expect(scope.model.filterValitut().length).toBe(1);
        scope.model.hakeneet[2].hakenutHarkinnanvaraisesti = "true";
        expect(scope.model.filterValitut().length).toBe(2);
    });

    it('isAllValittu', function() {
        expect(scope.model.isAllValittu()).toBeTruthy();
        scope.model.hakeneet[2].valittu = null;
        expect(scope.model.isAllValittu()).toBeFalsy();
    });

    it('valitutHakemusOids', function() {
        expect(scope.model.valitutHakemusOids().length).toBe(1);
        scope.model.hakeneet[2].valittu = "true";
        expect(scope.model.valitutHakemusOids().length).toBe(2);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});


describe('Testing ValintalaskentatulosController', function(){
    var scope, ctrl, $rootScope, $controller, $httpBackend, $location, location, $timeout, $upload,
        ilmoitus, ilmoitusTila, latausikkuna, valintatapajonoVienti, valintalaskentatulosModel, tulosXls, hakukohdeModel,
        $http, authService, hakukohdejson, valinnanvaihejson, hakukohdenimijson;
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
        hakukohdejson = hakukohdeJSON;
        valinnanvaihejson = valinnanvaiheJSON;
        hakukohdenimijson = hakukohdenimiJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get ValintalaskentatulosController', function() {
        scope = $rootScope.$new();
        location = $location;

        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid)
            .respond(201,hakukohdejson);
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/valinnanvaihe')
            .respond(201,valinnanvaihejson);
        $httpBackend.expectGET('hakukohde/'+routeParams.hakukohdeOid+'/nimi')
            .respond(201,hakukohdenimijson);
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid+'/ilmanlaskentaa')
            .respond(201,"[]");

        ctrl = $controller('ValintalaskentatulosController', {'$scope' : scope,'$location': location,
            '$routeParams': routeParams, '$timeout': $timeout, '$upload': $upload,
            'Ilmoitus': ilmoitus, 'IlmoitusTila': ilmoitusTila, 'Latausikkuna': latausikkuna,
            'ValintatapajonoVienti': valintatapajonoVienti, 'ValintalaskentatulosModel': valintalaskentatulosModel,
            'TulosXls': tulosXls, 'hakukohdeModel': hakukohdeModel, '$http': $http, 'AuthService': authService});

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
        findalljson;
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
        findalljson = findallJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('should get HakuController', function() {
        scope = $rootScope.$new();
        location = $location;

        $httpBackend.expectGET('haku/findAll')
            .respond(201,findalljson);
        $httpBackend.expectGET('resources/parametrit/'+routeParams.hakuOid)
            .respond(201,'{"valintakoekutsut":true,"hakeneet":true,"valintalaskenta":true,"pistesyotto":true,"valinnanhallinta":true,"harkinnanvaraiset":true}');

        ctrl = $controller('HakuController', {'$scope' : scope,'$location': location,
            '$routeParams': routeParams, 'HakuModel': hakuModel, 'ParametriService': parametriService});

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