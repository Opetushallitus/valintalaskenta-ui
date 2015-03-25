app.factory('PistesyottoModel', function ($q, HakukohdeAvaimet, HakemusAdditionalData, Valintakoetulokset, Ilmoitus,
                                          IlmoitusTila, HakukohdeAvainTyyppiService, _) {
    "use strict";

    var model;
    model = new function () {

        this.hakeneet = [];
        this.avaimet = [];
        this.errors = [];
        this.filter = "OSALLISTUU";
        this.tunnisteet = [];
        this.laskentaonly = false;

        this.refresh = function (hakukohdeOid, hakuOid) {

            model.hakeneet.length = 0;
            model.avaimet.length = 0;
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakuOid = hakuOid;
            model.tunnisteet.length = 0;

            Valintakoetulokset.get({hakukohdeoid: hakukohdeOid}, function (tulos) {
                var tulokset = {};

                // Haetaan osallistuuko hakija kokeeseen
                tulos.forEach(function (vkt) {
                    var hakutoiveet = {};
                    vkt.hakutoiveet.forEach(function (ht) {
                        var valintakokeet = {};

                        ht.valinnanVaiheet.forEach(function (vv) {

                            vv.valintakokeet.forEach(function (vk) {
                                valintakokeet[vk.valintakoeTunniste] = vk.osallistuminenTulos.osallistuminen;
                            });
                        });

                        hakutoiveet[ht.hakukohdeOid] = valintakokeet;
                    });

                    tulokset[vkt.hakemusOid] = hakutoiveet;
                }, function (error) {
                    model.errors.push(error);
                });


                HakemusAdditionalData.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}, function (result) {

                    model.hakeneet = result;
                    HakukohdeAvaimet.get({hakukohdeOid: hakukohdeOid}, function (result) {
                        model.avaimet = result;

                        HakukohdeAvainTyyppiService.createAvainTyyppiValues(model.avaimet, model.tunnisteet)

                        if (model.hakeneet) {
                            model.hakeneet.forEach(function (hakija) {
                                hakija.filterData = {};
                                hakija.osallistuu = {};

                                if (!hakija.additionalData) {
                                    hakija.additionalData = {};
                                }

                                model.avaimet.forEach(function (avain) {

                                    hakija.osallistuu[avain.tunniste] = false;

                                    if (tulokset[hakija.oid] &&
                                        tulokset[hakija.oid][hakukohdeOid] &&
                                        tulokset[hakija.oid][hakukohdeOid][avain.tunniste]

                                        ) {
                                        hakija.osallistuu[avain.tunniste] = tulokset[hakija.oid][hakukohdeOid][avain.tunniste];
                                    }

                                    if (!hakija.additionalData[avain.tunniste]) {
                                        hakija.additionalData[avain.tunniste] = "";
                                    }

                                    if (!hakija.additionalData[avain.osallistuminenTunniste]) {
                                        hakija.additionalData[avain.osallistuminenTunniste] = "MERKITSEMATTA";
                                    }

                                    if(avain.syotettavissaKaikille == true) {
                                        hakija.osallistuu[avain.tunniste] = 'OSALLISTUU';
                                    }

                                    if(avain.vaatiiOsallistumisen == false  && !hakija.additionalData[avain.osallistuminenTunniste]) {
                                        hakija.additionalData[avain.osallistuminenTunniste] = "EI_VAADITA";
                                    }

                                    if (hakija.osallistuu[avain.tunniste] === 'OSALLISTUU') {

                                        hakija.filterData[avain.tunniste] = hakija.additionalData[avain.tunniste];
                                        hakija.filterData[avain.osallistuminenTunniste] = hakija.additionalData[avain.osallistuminenTunniste];
                                    }
                                });
                            });
                        }
                    });
                }, function (error) {
                    model.errors.push(error);
                });

            });
        };

        this.refreshIfNeeded = function (hakukohdeOid, hakuOid) {

            if (hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }

        };


        var blockSubmit = false;
        this.submit = function () {
            if(!blockSubmit) {
                blockSubmit = true;
                // haku-app ei halua ylimääräistä tietoa
                var hakeneet = angular.copy(model.hakeneet);
                hakeneet.forEach(function(hakija){
                    // Filteröidään pois arvot, joita ei voi syöttää, koska haku-app mergaa
                    model.avaimet.forEach(function(avain) {
                        if(hakija.osallistuu[avain.tunniste] != 'OSALLISTUU') {
                            delete hakija.additionalData[avain.tunniste];
                            delete hakija.additionalData[avain.osallistuminenTunniste];
                        }
                    });
                    var keys = _.keys(hakija.additionalData);
                    keys.forEach(function(tunniste) {
                        if(!_.contains(model.tunnisteet, tunniste)) {
                            delete hakija.additionalData[tunniste];
                        }
                    });
                    hakija.filterData = undefined;
                    hakija.osallistuu = undefined;
                });
                HakemusAdditionalData.put({hakuOid: model.hakuOid, hakukohdeOid: model.hakukohdeOid}, hakeneet, function(success){
                    Ilmoitus.avaa("Tallennus onnistui", "Pisteiden tallennus onnistui.");
                    blockSubmit = false;
                },function(error){
                    Ilmoitus.avaa("Tallennus epäonnistui", "Pisteiden tallennus epäonnistui. Ole hyvä ja yritä hetken päästä uudelleen.", IlmoitusTila.ERROR);
                    console.log(error);
                    blockSubmit = false;
                });
            }
        };

        this.updateFilterData = function () {
            model.hakeneet.forEach(function (hakija) {
                angular.copy(hakija.additionalData, hakija.filterData);
            });
        };

    }();

    return model;
});


angular.module('valintalaskenta').
    controller('PistesyottoController', ['$scope', '$log', '$timeout', '$routeParams', '$upload', 'PistesyottoVienti',
        'PistesyottoModel', 'Ilmoitus', 'IlmoitusTila', 'Latausikkuna', 'HakukohdeModel',
        function ($scope, $log, $timeout, $routeParams, $upload, PistesyottoVienti, PistesyottoModel, Ilmoitus,
                  IlmoitusTila, Latausikkuna, HakukohdeModel) {
    "use strict";

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = PistesyottoModel;
    $scope.hakuOid = $routeParams.hakuOid;

    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.koeFilter = null;
    $scope.osallistuminenFilter = "";
    $scope.pageSize = 50;
    $scope.currentPage = 1;
    $scope.filteredResult = [];
    $scope.muutettu = false;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);
    PistesyottoModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = ['lastName','firstNames'];

    $scope.submit = function () {
        PistesyottoModel.submit();
    };

	$scope.pistesyottoTuontiXlsx = function($files) {
		var file = $files[0];
		var fileReader = new FileReader();
	    fileReader.readAsArrayBuffer(file);
	    var hakukohdeOid = $scope.hakukohdeOid;
	    var hakuOid = $routeParams.hakuOid;
	    fileReader.onload = function(e) {
			$scope.upload = $upload.http({
	    		url: VALINTALASKENTAKOOSTE_URL_BASE + "resources/pistesyotto/tuonti?hakuOid=" +hakuOid + "&hakukohdeOid=" +hakukohdeOid, //upload.php script, node.js route, or servlet url
				method: "POST",
				headers: {'Content-Type': 'application/octet-stream'},
				data: e.target.result
			}).progress(function(evt) {
				//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function(id, status, headers, config) {
				Latausikkuna.avaaKustomoitu(id, "Pistesyöttötietojen tuonti", "", "../common/modaalinen/tuontiikkuna.html",
	            function(dokumenttiId) {
	            	// tee paivitys
	            	$scope.model.refresh(hakukohdeOid, hakuOid);
	            }
	            );
			}).error(function(data) {
			    //error
			});
	    };
	};
    $scope.pistesyottoVientiXlsx = function() {
    	PistesyottoVienti.vie({
    		hakukohdeOid: $scope.hakukohdeOid,
    		hakuOid: $routeParams.hakuOid},
    		{}, function (id) {
            Latausikkuna.avaa(id, "Pistesyöttötietojen vienti taulukkolaskentaan", "");
        }, function () {
            Ilmoitus.avaa("Pistesyöttötietojen vienti epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
        });
    };
    
    $scope.showTiedotPartial = function (hakija) {
        hakija.showTiedotPartial = !hakija.showTiedotPartial;
    };

    $scope.osallistuvatFilter = function (actual) {
        var show = false;

        if ($scope.koeFilter === null) {
            if (actual.osallistuu) {
                PistesyottoModel.avaimet.forEach(function (avain) {

                    if (actual.osallistuu[avain.tunniste] === 'OSALLISTUU') {
                        show = true;
                    }

                });
            }
        } else if ($scope.koeFilter &&
            actual.osallistuu && actual.osallistuu[$scope.koeFilter.tunniste] === 'OSALLISTUU') {

            show = true;
        }

        if (show && $scope.osallistuminenFilter !== "") {
            if ($scope.koeFilter === null) {

                if (actual.filterData) {
                    var tempShow = false;
                    PistesyottoModel.avaimet.forEach(function (avain) {

                        if (actual.osallistuu[avain.tunniste] === 'OSALLISTUU' && actual.filterData[avain.tunniste + '-OSALLISTUMINEN'] === $scope.osallistuminenFilter) {
                            tempShow = true;
                        }

                    });
                    show = tempShow;
                }
            } else if (actual.filterData &&
                actual.filterData[$scope.koeFilter.tunniste + '-OSALLISTUMINEN'] !== $scope.osallistuminenFilter) {
                show = false;
            }
        }

        return show;

    };

    $scope.updateFilterData = function () {
        PistesyottoModel.updateFilterData();
    };

    $scope.arvonta = $routeParams.arvonta;

    $scope.arvoPisteet = function() {
        PistesyottoModel.hakeneet.forEach(function(hakija){
            PistesyottoModel.avaimet.forEach(function(avain){
                if(hakija.osallistuu[avain.tunniste] === 'OSALLISTUU') {
                    var min = parseFloat(avain.min, 0);
                    var max = parseFloat(avain.max, 0);
                    var random = (Math.random() * (max - min) + min);
                    random = random.toFixed(1);

                    hakija.additionalData[avain.tunniste] = "" + random;
                    hakija.additionalData[avain.tunniste + '-OSALLISTUMINEN'] = 'OSALLISTUI';
                }
            });
        });
    };
}]);
