app.factory('HakuModel', function(Haku) {
    var model;
    model = new function() {
        this.hakuOid = {};
        this.haut = [
                        "1.2.246.562.5.741585101110",
                        "1.2.246.562.5.97108552544",
                        "1.2.246.562.5.49149251883"
                    ];

        this.init = function(oid) {
            model.hakuOid = model.haut[0];
            /*
            if(model.haut.length <= 0) { 
                
                Haku.get(function(result) {
                    console.log(result);
                    model.haut = result;
                    model.hakuOid = model.haut[0];
                });

            }
            */


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
            console.log()
            $location.path('/haku/' + HakuModel.hakuOid + '/hakukohde/');
        }
    });
    
}