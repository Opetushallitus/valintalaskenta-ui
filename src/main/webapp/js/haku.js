app.factory('HakuModel', function($q, Haku, HaunTiedot) {
    var model;
    model = new function() {
        this.hakuOid;
        this.haut = [];

        this.init = function(oid) {
            
            if(model.haut.length <= 0) {
                Haku.get({}, function(result) {
                    var HakuOidObjects = result;
                    
                    var promises = [];

                    //iterate hakuoids and fetch corresponding hakuobjects
                    HakuOidObjects.forEach(function(element, index){
                        promises[index] = (function() {
                            var deferred = $q.defer();

                            HaunTiedot.get({hakuOid: element.oid}, function(result) {
                                model.haut.push(result);
                                deferred.resolve();    
                            });

                            return deferred.promise;
                        })();
                    });
                        
                    

                    //wait until all hakuobjects have been fetched
                    $q.all(promises).then(function() {
                        model.hakuOid = model.haut[0].oid;
                        
                        //set the previously selected haku or first in list
                        model.haut.forEach(function(haku){
                            if(haku.oid == oid) {
                                model.hakuOid = haku;
                            }
                        });
                    }); 
                });
            }
        };

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