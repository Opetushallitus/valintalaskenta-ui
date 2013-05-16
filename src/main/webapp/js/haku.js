app.factory('HakuModel', function(Haku, $http) {
    var model;
    model = new function() {
        this.hakuOid;
        this.haut = [];

        this.init = function(oid) {
            
            if(model.haut.length <= 0) {
                $http.get(TARJONTA_URL_BASE + "haku").success(function(result) {
                    model.haut = result;
                    console.log(model.haut);
                    model.hakuOid = model.haut[0];
                    console.log(model.hakuOid);
                });
            }


            // Ladataan haut vain kerran. Haut tuskin muuttuvat kovinkaan usein.
            /*
            if(model.haut.length <= 0) {
                Haku.get({}, function(result) {
                    model.haut = result;
                    model.hakuOid = model.haut[0];
                    model.haut.forEach(function(haku){
                        if(haku.oid == oid) {
                            model.hakuOid = haku;
                        }
                    });
                });
            }
            */
        }
    };

    return model;
});

function HakuController($scope, $location, $routeParams, HakuModel) {
    $scope.model = HakuModel;
    HakuModel.init($routeParams.hakuOid);

    $scope.$watch('model.hakuOid', function() {
        if(HakuModel.hakuOid && HakuModel.hakuOid != "undefined" && HakuModel.hakuOid != $routeParams.hakuOid) {
            $location.path('/haku/' + HakuModel.hakuOid + '/hakukohde/');
        }
    });
    
}