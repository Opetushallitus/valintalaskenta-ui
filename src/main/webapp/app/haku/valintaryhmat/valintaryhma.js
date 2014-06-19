app.factory('ValintaryhmaModel', function ($q, _, ValintaryhmatJaHakukohteet) {


    var model = new function () {

        this.hakuOid = undefined;
        this.valintaryhmat = [];
        this.hakuasetukset = {
            q: null,
            haku: null,
            vainValmiitJaJulkaistut: true,
            vainHakukohteitaSisaltavatRyhmat: true,
            vainHakukohteet: null,
            valintaryhmatAuki: null
        };

        this.refresh = function (hakuOid) {
            model.hakuOid = hakuOid;
            var kohdejoukko = "";
            var tila = null;
            var deferred = $q.defer();
            if (this.hakuasetukset.haku) {
                hakuoid = this.hakuasetukset.haku.oid;
                kohdejoukko = this.hakuasetukset.haku.kohdejoukkoUri.split("#")[0];
            }

            if (model.hakuasetukset.vainValmiitJaJulkaistut) {
                tila = ["VALMIS", "JULKAISTU"];
            }

            ValintaryhmatJaHakukohteet.get({
                q: model.hakuasetukset.q,
                hakuOid: null, //model.hakuOid,
                tila: tila,
                kohdejoukko: kohdejoukko
            }, function (result) {
                model.valintaryhmat = result;
                deferred.resolve();

                //update();
               }, function() {
                   deferred.reject();
               });
            return deferred.promise;;
        };

        this.refreshIfNeeded = function (hakuOid) {
            if (_.isEmpty(hakuOid) || hakuOid === model.hakuOid !== hakuOid) {
                return model.refresh(hakuOid);
            }
        }

    };

    return model;
});

function ValintaryhmaController($scope, HakuModel, ValintaryhmaModel) {
    $scope.hakumodel = HakuModel;

    $scope.valintaryhmaModel = ValintaryhmaModel;
    var promise = $scope.valintaryhmaModel.refreshIfNeeded($scope.hakumodel);

    $scope.getTemplate = function(tyyppi) {
        if(tyyppi) {
            if(tyyppi == 'VALINTARYHMA') {
                return "valintaryhma_node.html";
            } else {
                return "hakukohde_leaf.html";
            }
        }
        return "";
    }

    $scope.expandNode = function(node) {
        console.log(node);
        if( (node.alavalintaryhmat && node.alavalintaryhmat.length > 0)  ||
            (node.hakukohdeViitteet && node.hakukohdeViitteet.length > 0 )  ) {
            if(node.isVisible != true) {
                node.isVisible = true;

                // aukaisee alitason, jos ei ole liikaa tavaraa
                var iter = function(ala) {
                    ala.forEach(function(ala){
                        "use strict";
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
    }
    
    /*
     function update() {
     var list = modelInterface.valintaperusteList;
     modelInterface.valintaperusteList = [];
     modelInterface.hakukohteet = [];
     modelInterface.tilasto.valintaryhmia = 0;
     modelInterface.tilasto.hakukohteita = 0;
     modelInterface.tilasto.valintaryhmiaNakyvissa = 0;
     modelInterface.tilasto.hakukohteitaNakyvissa = 0;


     var recursion = function (item, previousItem) {
     if (previousItem != null) {
     item.ylavalintaryhma = previousItem;
     }
     item.getParents = function () {
     i = this.ylavalintaryhma;
     arr = [];
     while (i != null) {
     arr.unshift(i);
     i = i.ylavalintaryhma;
     }
     return arr;
     };

     if (item.tyyppi == 'VALINTARYHMA') {
     modelInterface.tilasto.valintaryhmia++;
     AuthService.getOrganizations("APP_VALINTAPERUSTEET").then(function (organisations) {
     "use strict";
     item.access = false;
     organisations.forEach(function (org) {
     if (item.organisaatiot.length > 0) {
     item.organisaatiot.forEach(function (org2) {

     if (org2.parentOidPath != null && org2.parentOidPath.indexOf(org) > -1) {
     item.access = true;
     }
     });
     } else {
     item.access = true;
     }
     });
     });
     }
     if (item.tyyppi == 'HAKUKOHDE') {
     modelInterface.tilasto.hakukohteita++;
     modelInterface.hakukohteet.push(item);
     }
     if (item.alavalintaryhmat)  for (var i = 0; i < item.alavalintaryhmat.length; i++)  recursion(item.alavalintaryhmat[i], item);
     if (item.hakukohdeViitteet) for (var i = 0; i < item.hakukohdeViitteet.length; i++) recursion(item.hakukohdeViitteet[i], item);
     }
     for (var i = 0; i < list.length; i++) recursion(list[i]);

     modelInterface.hakukohteet.forEach(function (hakukohde) {
     hakukohde.sisaltaaHakukohteita = true;
     var parent = hakukohde.ylavalintaryhma;
     while (parent != null) {
     parent.sisaltaaHakukohteita = true;
     parent = parent.ylavalintaryhma;
     }
     });

     modelInterface.valintaperusteList = list;
     }
     */
}


