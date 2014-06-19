
//domain .. this is both, service & domain layer
app.factory('Ylavalintaryhma', function($resource, ValintaryhmatJaHakukohteet, AuthService) {

    //and return interface for manipulating the model
    var modelInterface =  {
        //models
        valintaperusteList: [],
        search : {   q: null,
            valintaryhmatAuki: null
        },
        tilasto: {
            valintaryhmia: 0,
            valintaryhmiaNakyvissa: 0
        },

        isExpanded: function(data) {
            return data.isVisible;
        },
        isCollapsed: function(data) {
            return !this.isExpanded(data);
        },
        refresh:function() {

            ValintaryhmatJaHakukohteet.get({
                q: this.search.q,
                hakukohteet: true
            },function(result) {
                modelInterface.valintaperusteList = result;
                modelInterface.update();
            });
        },
        expandTree:function() {
            modelInterface.forEachValintaryhma(function(item) {
                item.isVisible = true;
            });
        },
        forEachValintaryhma:function(f) {
            var recursion = function(item, f) {
                f(item);
                if(item.alavalintaryhmat) for(var i=0; i<item.alavalintaryhmat.length;i++)  recursion(item.alavalintaryhmat[i],  f);
            }
            for(var i=0; i<modelInterface.valintaperusteList.length;i++) recursion(modelInterface.valintaperusteList[i],  f);
        },
        getValintaryhma:function(oid) {
            var valintaryhma = null;
            modelInterface.forEachValintaryhma(function(item) {
                if(item.oid == oid) valintaryhma = item;
            });
            return valintaryhma;
        },
        update:function() {
            var list = modelInterface.valintaperusteList;
            modelInterface.valintaperusteList = [];
            modelInterface.tilasto.valintaryhmia = 0;
            modelInterface.tilasto.valintaryhmiaNakyvissa = 0;


            var recursion = function(item) {

                if(item.tyyppi == 'VALINTARYHMA') {
                    modelInterface.tilasto.valintaryhmia++;
                }
/*
                AuthService.getOrganizations("APP_VALINTAPERUSTEET").then(function(organisations){
                    "use strict";
                    item.access = false;
                    organisations.forEach(function(org){

                        if(item.organisaatiot.length > 0) {
                            item.organisaatiot.forEach(function(org2) {
                                if(org2.parentOidPath.indexOf(org) > -1) {
                                    item.access = true;
                                }
                            });
                        } else {
                            AuthService.updateOph("APP_VALINTAPERUSTEET").then(function(){
                                item.access = true;
                            });
                        }
                    });
                });
*/
                if(item.alavalintaryhmat) {
                    for(var i=0; i<item.alavalintaryhmat.length;i++)  recursion(item.alavalintaryhmat[i]);
                }
            }
            for(var i=0; i<list.length;i++) {
                recursion(list[i]);
            }

            modelInterface.valintaperusteList = list;
        },
        expandNode:function(node) {
            if( (node.alavalintaryhmat && node.alavalintaryhmat.length > 0)) {

                if(node.isVisible != true) {
                    node.isVisible = true;
                } else {
                    node.isVisible = false;
                }
            }
        }
    };
    modelInterface.refresh();
    return modelInterface;
});


app.factory('UusiHakukohdeModel', function() {
    var model = new function()  {

        this.hakukohde = {};
        this.tilat = [ 'LUONNOS',
            'VALMIS',
            'JULKAISTU',
            'PERUTTU',
            'KOPIOITU'];

        this.refresh = function() {
            model.hakukohde = {};
            model.haku = "";
            model.selectedHakukohde = "";
            model.parentOid = "";
        }

    };

    return model;
});

function ValintaryhmaController($scope, $log, _, HakuModel, UusiHakukohdeModel, Ylavalintaryhma, ValintaryhmaLaskenta) {
    $scope.predicate = 'nimi';
    $scope.model = UusiHakukohdeModel;
    
    $scope.domain = Ylavalintaryhma;
    UusiHakukohdeModel.refresh();
    Ylavalintaryhma.refresh();
    $scope.hakukohteet = [];

    $scope.hakumodel = HakuModel;

    $scope.expandNode = function(node) {
        if( (node.alavalintaryhmat && node.alavalintaryhmat.length > 0)  ||
            (node.hakukohdeViitteet && node.hakukohdeViitteet.length > 0 )  ) {
            if(node.isVisible != true) {
                node.isVisible = true;

                // aukaisee alitason, jos ei ole liikaa tavaraa
                var iter = function(ala) {
                    ala.forEach(function(ala){
                        if(!ala.alavalintaryhmat || ala.alavalintaryhmat.length < 4) {
                            ala.isVisible = true;
                            iter(ala.alavalintaryhmat);
                        }
                    });
                }
                if(node.alavalintaryhmat.length < 4) {
                    iter(node.alavalintaryhmat);
                }


            } else {
                node.isVisible = false;
            }
        }
    };
    
    $scope.changeValintaryhma = function(valintaryhma) {
        $scope.selectedValintaryhma = valintaryhma;
        $scope.hakukohteet.length = 0;
        $scope.findHakukohteet(valintaryhma);
    };
    
    $scope.findHakukohteet = function(valintaryhma) {
        _.forEach(valintaryhma.hakukohdeViitteet, function(hakukohde) {
            $scope.hakukohteet.push(hakukohde);
        });

        _.forEach(valintaryhma.alavalintaryhmat, function(valintaryhma) {
            $scope.findHakukohteet(valintaryhma);
        });
    };

    $scope.valintaryhmaLaskenta = function() {
        var hakukohdeOids = [];
        _.forEach($scope.hakukohteet, function(hakukohde) {
            hakukohdeOids.push(hakukohde.oid);
        });

        ValintaryhmaLaskenta.save({hakuOid: $scope.hakumodel.hakuOid.oid}, hakukohdeOids, function(result) {
            console.log('asöldkfjöalsd');
        }, function(error) {
            $log.error("Valintalaskennan suorittaminen valintaryhmän hakukohteille epäonnistui", error);
        });
    }

    

}


