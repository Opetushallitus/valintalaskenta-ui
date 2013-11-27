
app.factory('ValintatulosModel', function(Valintatulos) {
	var model;

	model = new function() {

        this.filter = { 
            type: "KAIKKI",
            hakukohteet : [],
            shownOnUi: 100 ,
            count:6000,
            index:0,


        };

        this.hakemukset = [];
        this.hakemusCount = null;
        this.hakuOid = null;



        this.shown = function() {
            return model.filter.shownOnUi;
        }
        this.page = function() {

        };
        this.totalPages = function() {

        };

        this.from = function() {
            return model.filter.index;
        };
        this.to = function() {
            return Math.min(model.filter.index + model.filter.count, model.hakemusCount);
        };
        this.totalResults = function() {
         return model.hakemusCount;
        }


        this.refresh = function(hakuOid) {
            model.hakuOid = hakuOid;

            var searchParams = {
              hakuOid: hakuOid
            };

            if(model.filter.type == "HYVAKSYTYT"){
               searchParams.hyvaksytyt=true
            }
            if(model.filter.type == "ILMANHYVAKSYNTAA"){
                 searchParams.ilmanHyvaksyntaa=true
            }
            if(model.filter.type == "VASTAANOTTANEET"){
                 searchParams.vastaanottaneet=true
            }
             if(model.filter.hakukohteet.length > 0 ){
                searchParams.hakukohdeOid=model.filter.hakukohteet;
             }
            if(model.filter.count != null) {
               searchParams.count=model.filter.count;
            }
             if(model.filter.index != null) {
               searchParams.index=model.filter.index;
            }



            Valintatulos.get(searchParams, function(result) {
                 model.hakemukset = result.results;
                 model.hakemusCount = result.totalCount;
            });
        };
	}
	return model;
});

function ValintatulosController($scope,ValintatulosModel, $routeParams) {
    $scope.hakuOid = $routeParams.hakuOid
    $scope.model = ValintatulosModel;

    $scope.lazyLoading = function() {
        $scope.model.filter.shownOnUi +=100;
    };
    $scope.addHakukohde = function() {
        $scope.model.filter.hakukohteet.push($scope.hakukohdeToAdd);
        $scope.hakukohdeToAdd = null;
    };
    $scope.deleteHakukohde = function(index) {
        $scope.model.filter.hakukohteet.splice(index, 1);
    };

    $scope.getHakukohdeStyle = function(hakukohde) {
        var style="";

         hakukohde.hakutoiveenValintatapajonot.forEach(function(valintatapajono) {
            if(valintatapajono.tila == "HYVAKSYTTY") {
                style = valintatapajono.tila;
            } else if(valintatapajono.tila == "VARALLA") {
                if(style != "HYVAKSYTTY") {
                    style = valintatapajono.tila;
                }
            } else if(valintatapajono.tila == "PERUUNTUNUT") {
                if(style != "HYVAKSYTTY" || style != "VARALLA") {
                    style = valintatapajono.tila;
                }
            } else if(valintatapajono.tila == "PERUNUT") {
               if(style != "HYVAKSYTTY" || style != "VARALLA" || style != "PERUUNTUNUT") {
                   style = valintatapajono.tila;
               }
            } else if(valintatapajono.tila == "HYLATTY") {
              if(style != "HYVAKSYTTY" || style != "VARALLA" || style != "PERUUNTUNUT" || style != "PERUNUT") {
                  style = valintatapajono.tila;
              }
            }
        } );
        return style;
    }


    $scope.refresh=function() {
        $scope.model.refresh($scope.hakuOid);
    };
}