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
//                        model.hakuOid = model.haut[0];
                        model.haut.forEach(function(haku){
                            if(haku.oid == oid) {
                                model.hakuOid = haku;
                            }

                            var hakutyyppi = haku.hakutyyppiUri;
                            var lisahakutyyppiRegExp = /(hakutyyppi_03).*/;
                            var match = lisahakutyyppiRegExp.exec(hakutyyppi);
                            match ? showLisahakuView = true : showLisahakuView = false;

                            haku.lisahaku = showLisahakuView;
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

        if($scope.hakumodel.hakuOid && $scope.hakumodel.hakuOid.oid != $routeParams.hakuOid) {
            if($scope.hakumodel.hakuOid.lisahaku) {
                $location.path('/lisahaku/' + HakuModel.hakuOid.oid + '/hakukohde/');
            } else {
                $location.path('/haku/' + HakuModel.hakuOid.oid + '/hakukohde/');
            }
        }
    });
    
}