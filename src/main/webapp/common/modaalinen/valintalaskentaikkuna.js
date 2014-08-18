function ValintalaskentaIkkunaCtrl($scope, $modalInstance, oids, $interval, HakuModel,
                                   ValintalaskentaKeskeyta, ValintalaskentaKaynnissa, ValintalaskentaMuistissa,
                                   ValintalaskentaStatus, ValintalaskentaKerrallaHakukohteille, ValintalaskentaMuistissaStatus) {
	$scope.uuid = null;
	$scope.tyot = [];
	$scope.nimi = HakuModel.getNimi();
	$scope.lisaa = false;
    $scope.tehty = 0;

	$scope.getProsentit = function(t) {
		return t.prosentteina * 100;
	};

    if (oids.laskeMuistissa) {
        ValintalaskentaMuistissa.aktivoi({
            hakuOid: oids.hakuOid,
            hakukohdeOid: oids.hakukohdeOid,
            valinnanvaihe: oids.valinnanvaihe
        }, [], function (uuid) {
            $scope.uuid = uuid.latausUrl;
            update();
        }, function () {
            ValintalaskentaKaynnissa.hae(function (uuid) {
                $scope.uuid = uuid.latausUrl;
                update();
            });
        });
    } else {
        ValintalaskentaKerrallaHakukohteille.aktivoi({hakuoid: oids.hakuOid, whitelist: true}, oids.hakutoiveet,
            function (uuid) {
                $scope.uuid = uuid.latausUrl;
                update();
            }, function (error) {
        });
    }

	var update = function () {
		if($scope.uuid != null) {
            if (oids.laskeMuistissa) {
                ValintalaskentaMuistissaStatus.get({uuid: $scope.uuid}, function (r) {
                    if (r.prosessi) {
                        $scope.tyot = [r.prosessi.kokonaistyo, r.prosessi.valintalaskenta, r.prosessi.hakemukset, r.prosessi.valintaperusteet, r.prosessi.hakukohteilleHakemukset];
                        $scope.virheet = r.prosessi.exceptions;
                        $scope.varoitukset = r.prosessi.varoitukset;
                    }
                });
            } else {
                ValintalaskentaStatus.get({uuid: $scope.uuid}, function (r) {
                    if (r) {
                        $scope.tyo = {
                            tehty: r.tehty,
                            kokonaismaara: r.hakukohteita,
                            prosentti: 0
                        };
                        if (r.tehty > 0) {
                            if (r.tehty !== r.hakukohteita) {
                                $scope.tyo.prosentti = (r.tehty / r.hakukohteita) * 100;
                            } else {
                                $scope.tyo.prosentti = 100;
                            }
                        }
                    }
                });
            }
		}
    };
    
	var timer = $interval(function () {
        update();
    }, 10000);

	$scope.peruuta = function() {
        if (oids.laskeMuistissa) {
            ValintalaskentaKeskeyta.keskeyta({uuid: $scope.uuid});
        } else {

        }
    };

    $scope.naytaLisaa = function() {
    	$scope.lisaa = !$scope.lisaa;
    };

	  $scope.ok = function () {
		  $interval.cancel(timer);
	    $modalInstance.close(); //$scope.selected.item);
	  };

	  $scope.cancel = function () {
		  $interval.cancel(timer);
	    $modalInstance.dismiss('cancel');
	  };
};

function ValintaryhmaValintalaskentaIkkunaCtrl($scope, $modalInstance, oids, $log, $interval, $routeParams, ValintaryhmaLaskenta, HakuModel, ValintalaskentaKeskeyta, ValintalaskentaKaynnissa, ValintalaskentaMuistissa, ValintalaskentaStatus) {
    $scope.uuid = null;
    $scope.tyot = [];
    $scope.nimi = HakuModel.getNimi();
    $scope.lisaa = false;
    $scope.getProsentit = function(t) {
        return t.prosentteina * 100;
    };

    ValintaryhmaLaskenta.save({hakuOid: oids.hakuOid}, oids.hakukohdeOids, function(uuid) {
        $scope.uuid = uuid.latausUrl;
        update();
    }, function(error) {
        $log.error('Laskennan ajaminen valintaryhmälle epäonnistui: ', error);


//        ValintalaskentaKaynnissa.hae(function(uuid) {
//            console.log('valintalaskenta käynnissä: ', uuid);
//            $scope.uuid = uuid.latausUrl;
//            update();
//        });
    });

    var update = function () {
        if($scope.uuid != null) {
            ValintalaskentaStatus.get({uuid:$scope.uuid}, function(r) {
                if(r.prosessi) {
                    $scope.tyot = [r.prosessi.kokonaistyo, r.prosessi.valintalaskenta, r.prosessi.hakemukset, r.prosessi.valintaperusteet, r.prosessi.hakukohteilleHakemukset];
                    $scope.virheet = r.prosessi.exceptions;
                    $scope.varoitukset = r.prosessi.varoitukset;
                }
            });
        }
    };

    var timer = $interval(function () {
        update();
    }, 10000);

    $scope.peruuta = function() {
        ValintalaskentaKeskeyta.keskeyta({uuid:$scope.uuid});
    };

    $scope.naytaLisaa = function() {
        $scope.lisaa = !$scope.lisaa;
    };

    $scope.ok = function () {
        $interval.cancel(timer);
        $modalInstance.close(); //$scope.selected.item);
    };

    $scope.cancel = function () {
        $interval.cancel(timer);
        $modalInstance.dismiss('cancel');
    };
};