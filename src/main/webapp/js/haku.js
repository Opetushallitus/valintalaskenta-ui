app.factory('HakuModel', function($q, Haku, HaunTiedot) {
    var model;
    model = new function() {
        this.hakuOid;
        this.haut = [];
        this.lisahaku = false;

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
                            	if(result.tila=="JULKAISTU") {
                            		model.haut.push(result);
                            	}
                                deferred.resolve();    
                            },function() {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        })();
                    });
                        
                    //wait until all hakuobjects have been fetched
                    $q.all(promises).then(function() {
                        //set the previously selected haku or first in list
                        model.hakuOid = model.haut[0].oid;
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
    $scope.hakumodel = HakuModel;
    HakuModel.init($routeParams.hakuOid);
    $scope.$watch('hakumodel.hakuOid', function() {
        
        // set lisahaku-flag to true if selected haku is of type lisahaku
        if($scope.hakumodel.hakuOid && isLisahaku($scope.hakumodel.hakuOid.oid)) {
            $scope.hakumodel.lisahaku = true;
        } else {
            $scope.hakumodel.lisahaku = false;
        }
        
        if($scope.hakumodel.hakuOid && $scope.hakumodel.hakuOid.oid != $routeParams.hakuOid) {
            if($scope.hakumodel.lisahaku) {
                $location.path('/lisahaku/' + HakuModel.hakuOid.oid + '/hakukohde/');
            } else {
                $location.path('/haku/' + HakuModel.hakuOid.oid + '/hakukohde/');
            }
        }
    });

    //return true if selected haku is lisahaku, otherwise false
    function isLisahaku(hakuOid) {
        var showLisahakuView = false;
        $scope.hakumodel.haut.forEach(function(haku) {
            if(hakuOid === haku.oid) { 
                var hakutyyppi = haku.hakutyyppiUri;
                var lisahakutyyppiRegExp = /(hakutyyppi_03).*/;
                var match = lisahakutyyppiRegExp.exec(hakutyyppi);
                match ? showLisahakuView = true : showLisahakuView = false;
            }
        });
        return showLisahakuView;
    }
    
}