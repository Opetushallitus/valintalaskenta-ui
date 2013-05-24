app.factory('HakuModel', function(Haku) {
    var model;
    model = new function() {
        this.hakuOid;
        this.haut = [];

        this.init = function(oid) {
            
            if(model.haut.length <= 0) {
                Haku.get({}, function(result) {
                    model.haut = result;
                    model.hakuOid = model.haut[0].oid;
                    
                    //set haku (in view) to hakuselect to what is was or to first option
                    model.haut.forEach(function(haku){
                        if(haku.oid == oid) {
                            model.hakuOid = haku;
                        }
                    });
                });

            }
        }
    };

    return model;
});

function HakuController($scope, $location, $routeParams, HakuModel) {
    $scope.model = HakuModel;
    HakuModel.init($routeParams.hakuOid);
    $scope.$watch('model.hakuOid', function() {
        if($scope.model.hakuOid && $scope.model.hakuOid.oid != $routeParams.hakuOid) {
            $location.path('/haku/' + HakuModel.hakuOid.oid + '/hakukohde/');
        }
    });
    
}