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

        ctrl = $controller(HakukohteetController, {'$rootScope' : rootScope, '$scope' : scope,
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
         expect(scope.model.omatHakukohteet).toBe(true);
         expect(scope.model.valmiitHakukohteet).toBe("JULKAISTU");
         expect(scope.model.readyToQueryForNextPage).toBe(true);

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
        expect(scope.hakukohteetVisible).toBe(false);
        expect(globalStates.hakukohteetVisible).toBe(false);
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
        expect(scope.hakukohteetVisible).toBe(false);
        expect(globalStates.hakukohteetVisible).toBe(false);
        expect(rootScope.selectedHakukohdeNimi).toBe('koulu2');
        expect(location.path()).toMatch('/lisahaku/.*');
    });

    it('toggleHakukohteetVisible', function() {
        scope.toggleHakukohteetVisible();
        expect(globalStates.hakukohteetVisible).toBe(true);
        scope.toggleHakukohteetVisible();
        expect(globalStates.hakukohteetVisible).toBe(false);
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

        ctrl = $controller(HenkiloController, {'$scope' : scope,
            '$location': location, '$routeParams': routeParams, 'HenkiloModel': henkiloModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakemukset.length).toBe(60);
        expect(scope.model.totalCount).toBe(5012);
        expect(scope.model.pageSize).toBe(30);
        expect(scope.model.searchWord).toBe("");
        expect(scope.model.lastSearch).toBe("");
        expect(scope.model.readyToQueryForNextPage).toBe(true);
    });

    it('toggleHenkiloittainVisible', function() {
        scope.toggleHenkiloittainVisible();
        expect(scope.henkiloittainVisible).toBe(false);
        scope.toggleHenkiloittainVisible();
        expect(scope.henkiloittainVisible).toBe(true);
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
        scope,ctrl,hakukohdenimijson,hakukohdetilajson,hakujson,hakukohdejson, sijoitteluajojson, $modal, $window,kirjepohjat,latausikkuna,hakukohdeModel,
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

        ctrl = $controller(SijoitteluntulosController, {'$scope' : scope, '$modal' : $modal, '$routeParams': routeParams,
            '$window' : $window, 'Kirjepohjat': kirjepohjat, 'Latausikkuna': latausikkuna, 'HakukohdeModel': hakukohdeModel,
            'SijoitteluntulosModel': sijoitteluntulosModel, 'OsoitetarratSijoittelussaHyvaksytyille': osoitetarratSijoittelussaHyvaksytyille,
            'Hyvaksymiskirjeet': hyvaksymiskirjeet, 'Jalkiohjauskirjeet': jalkiohjauskirjeet, 'SijoitteluXls': sijoitteluXls,
            'AuthService': authService});

        $httpBackend.flush();
    });

    afterEach(function() {

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});