app.factory('Valintaryhmat', function ($q, _) {


    var model = new function () {

        this.hakuOid = undefined;
        this.valintaryhmat = {};
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

            if (this.hakuasetukset.vainValmiitJaJulkaistut) {
                tila = ["VALMIS", "JULKAISTU"];
            }

            ValintaryhmatJaHakukohteet.get({
                q: this.hakuasetukset.q,
                hakuOid: hakuoid,
                tila: tila,
                kohdejoukko: kohdejoukko
            }, function (result) {
                this.valintaryhmat = result;
                console.log(result);
                deferred.resolve();
                //update();
            }, function (error) {
                deferred.reject('Valintaryhmien hakeminen epäonnistui:', error);
            });

            return deferred.promise;
        };

        this.refreshIfNeeded = function (hakuOid) {
            if (_.isEmpty(hakuOid) || hakuOid === model.hakuOid !== hakuOid) {
                model.refresh(hakuOid);
            }
        }

    };


    return model;
     s
});


function ValintaryhmaController($scope, HakuModel, Valintaryhmat) {
    $scope.hakumodel = HakuModel;

//    $scope.valintaryhmat = Valintaryhmat;
//    var promise = $scope.valintaryhmaLista.refreshIfNeeded($scope.hakumodel);
//    promise.then(function() {
//        console.log('fetched');
//    })

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