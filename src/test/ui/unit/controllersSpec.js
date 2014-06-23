'use strict';

describe('Testing HakukohteetController', function(){
    var $rootScope, $controller, $httpBackend, $location,
        hakukohteetModel,globalStates,hakuModel,scope;

    beforeEach(module('valintalaskenta'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        $controller = $injector.get('$controller');

        scope = $rootScope.$new();

        hakukohteetModel = $injector.get('HakukohteetModel');

    }));

    it('should have', function() {

        var routeParams = {"hakukohdeOid": "oid2"};
        globalStates = {
            hakukohteetVisible : true
        };

        var hakukohdeString = {
            "kokonaismaara" : 2,
            "tulokset" : [ {
                "hakukohdeOid" : "1.2.246.562.20.59262166669",
                "tarjoajaOid" : "1.2.246.562.10.74903763345",
                "tarjoajaNimi" : {
                    "fi" : "Kauppiaitten Kauppaoppilaitos"
                },
                "hakukohdeNimi" : {
                    "fi" : "Liiketalouden perustutkinto, yo",
                    "sv" : "Grundexamen inom företagsekonomi, st",
                    "en" : "Liiketalouden perustutkinto, yo"
                },
                "hakukohdeTila" : "JULKAISTU",
                "hakuVuosi" : 0,
                "koulutusVuosi" : 0
            }, {
                "hakukohdeOid" : "1.2.246.562.20.799065290810",
                "tarjoajaOid" : "1.2.246.562.10.40503922409",
                "tarjoajaNimi" : {
                    "fi" : "Tampereen seudun ammattiopisto Tredu, Oriveden toimipiste"
                },
                "hakukohdeNimi" : {
                    "fi" : "Kalatalouden perustutkinto, yo",
                    "sv" : "Grundexamen i fiskeri, st",
                    "en" : "Kalatalouden perustutkinto, yo"
                },
                "hakukohdeTila" : "JULKAISTU",
                "hakuVuosi" : 0,
                "koulutusVuosi" : 0
            }]
        };
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];

        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        waits(500);
        $httpBackend.expectGET('haku/hakukohdeTulos?count=15&hakukohdeTilas=JULKAISTU&organisationOids=1.2.246.562.10.00000000001&searchTerms=&startIndex=0').respond(hakukohdeString);


        var ctrl = $controller(HakukohteetController, {'$rootScope' : $rootScope, '$scope' : scope,
            '$location': $location, '$routeParams': routeParams, 'HakukohteetModel': hakukohteetModel,
            'GlobalStates': globalStates, 'HakuModel': hakuModel});
        $rootScope.$apply();
    });


    afterEach(function() {

        $rootScope.$apply();
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});
