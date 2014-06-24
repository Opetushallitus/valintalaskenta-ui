'use strict';

describe('Testing HakukohteetController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location,
        hakukohteetModel,globalStates,hakuModel,scope,ctrl,hakukohteetjson;

    beforeEach(module('valintalaskenta','testData'));

    beforeEach(inject(function($injector, hakukohteetJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohteetjson = hakukohteetJSON.query.results;
        hakukohteetModel = $injector.get('HakukohteetModel');
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
    }));

    it('should get hakukohteet', function(GlobalStates) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        globalStates = GlobalStates;
        var routeParams = {"hakukohdeOid": "oid2"};
        globalStates = {
            hakukohteetVisible : true
        };

        ctrl = $controller(HakukohteetController, {'$rootScope' : rootScope, '$scope' : scope,
            '$location': $location, '$routeParams': routeParams, 'HakukohteetModel': hakukohteetModel,
            'GlobalStates': globalStates, 'HakuModel': hakuModel});


        $rootScope.$apply();
        $httpBackend.flush();
        waits(500);
        $httpBackend.expectGET('haku/hakukohdeTulos?count=15&hakukohdeTilas=JULKAISTU&organisationOids=1.2.246.562.10.00000000001&searchTerms=&startIndex=0')
            .respond(201,hakukohteetjson);

    });

    it('check initialized variables', function() {
        expect(scope.model.hakukohteet.length).toBe(16);
        expect(scope.model.filtered.length).toBe(0);
        expect(scope.model.totalCount).toBe(100);
        expect(scope.model.pageSize).toBe(15);
        expect(scope.model.searchWord).toBe("");
        expect(scope.model.lastSearch).toBe("");
        expect(scope.model.lastHakuOid).toBe(null);
        expect(scope.model.omatHakukohteet).toBe(true);
        expect(scope.model.valmiitHakukohteet).toBe("JULKAISTU");
        expect(scope.model.readyToQueryForNextPage).toBe(true);

    });

    it('showHakukohde', function() {
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
    });


    afterEach(function() {
        $rootScope.$apply();
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});
