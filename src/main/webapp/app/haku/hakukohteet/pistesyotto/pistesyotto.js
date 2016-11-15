app.factory('PistesyottoModel', function (
    $q,
    HakukohdeHenkilotFull,
    HakukohdeAvaimet,
    KoostettuHakemusAdditionalData,
    KoostettuHakemusAdditionalDataByOids,
    Valintakoetulokset,
    Ilmoitus,
    IlmoitusTila,
    HakukohdeAvainTyyppiService, _) {

    "use strict";

    var model;
    model = new function () {

        this.hakeneet = [];
        this.avaimet = [];
        this.errors = [];
        this.filter = "OSALLISTUU";
        this.tunnisteet = [];
        this.laskentaonly = true;

        this.refresh = function (hakukohdeOid, hakuOid) {

            model.hakeneet.length = 0;
            model.avaimet.length = 0;
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            model.hakuOid = hakuOid;
            model.tunnisteet.length = 0;

            var hakemusOids = [];

            //Haetaan hakukohteelle hakeneet ja lisätään niiden oidit arrayhin jolla haetaan additionalData
            HakukohdeHenkilotFull.get({aoOid: hakukohdeOid, rows: 100000, asId: hakuOid}, function (result) {
                result.forEach( function(hakemus) {
                    hakemusOids.push(hakemus.oid);
                });


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

                    // Jos hakija ei ole hakenut hakukohteelle mutta valintakoetulos kuitenkin löytyy
                    // haetaan myös tälle hakemukselle additionalData
                    if(hakemusOids.indexOf(vkt.hakemusOid) == -1) {
                        hakemusOids.push(vkt.hakemusOid);
                    }
                }, function (error) {
                    model.errors.push(error);
                });

                // Haetaan additionalData kaikkille niille hakemuksille jotka ovat hakeneet hakukohteelle
                // tai joille löytyy valintakoetulos
                    $q.all([
                        HakukohdeAvaimet.get({hakukohdeOid: hakukohdeOid}).$promise,
                        KoostettuHakemusAdditionalDataByOids.post(
                            {hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}, angular.toJson(hakemusOids)).$promise
                    ]).then(function(results) {
                        model.avaimet = results[0];
                        HakukohdeAvainTyyppiService.createAvainTyyppiValues(model.avaimet, model.tunnisteet);
                        model.hakeneet = results[1].map(function(pistetieto) {
                            var h = pistetieto.applicationAdditionalDataDTO;
                            h.filterData = {};
                            h.osallistuu = pistetieto.hakukohteidenOsallistumistiedot[hakukohdeOid].valintakokeidenOsallistumistiedot || {};
                            model.avaimet.forEach(function(avain) {
                                if (h.osallistuu[avain.tunniste] &&
                                    h.osallistuu[avain.tunniste].osallistumistieto !== "EI_KUTSUTTU") {
                                    h.filterData[avain.tunniste] = h.additionalData[avain.tunniste];
                                    h.filterData[avain.osallistuminenTunniste] = h.additionalData[avain.osallistuminenTunniste];
                                }
                            });
                            return h;
                        });
                    }, function(error) {
                        model.errors.push(error);
                    });
            });

            }, function (error) {
                            model.errors.push(error);
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
                KoostettuHakemusAdditionalData.put({hakuOid: model.hakuOid, hakukohdeOid: model.hakukohdeOid}, hakeneet, function(success){
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
        'PistesyottoModel', 'Ilmoitus', 'IlmoitusTila', 'Latausikkuna', 'HakukohdeModel', 'ParametriService',
        function ($scope, $log, $timeout, $routeParams, $upload, PistesyottoVienti, PistesyottoModel, Ilmoitus,
                  IlmoitusTila, Latausikkuna, HakukohdeModel, ParametriService) {
    "use strict";

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = PistesyottoModel;
    $scope.hakuOid = $routeParams.hakuOid;

    $scope.url = window.url;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.koeFilter = null;
    $scope.hakijaFilter = "";
    $scope.osallistuminenFilter = "";
    $scope.pageSize = 50;
    $scope.currentPage = 1;
    $scope.muutettu = false;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);
    PistesyottoModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = ['lastName','firstNames'];

    $scope.submit = function () {
        PistesyottoModel.submit();
    };

    ParametriService($routeParams.hakuOid).then(function (privileges) {
        $scope.inputdisabled = !privileges["koetulostentallennus"];
    });

	$scope.pistesyottoTuontiXlsx = function($files) {
		var file = $files[0];
		var fileReader = new FileReader();
	    fileReader.readAsArrayBuffer(file);
	    var hakukohdeOid = $scope.hakukohdeOid;
	    var hakuOid = $routeParams.hakuOid;
	    fileReader.onload = function(e) {
			$scope.upload = $upload.http({
	    		url: window.url("valintalaskentakoostepalvelu.pistesyotto.tuonti", {
                    hakuOid : hakuOid,
                    hakukohdeOid : hakukohdeOid
	    		}),
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
    $scope.filteredResult = [];
    $scope.$watch('model.hakeneet', function () {
        $scope.filteredResult = $scope.$eval("model.hakeneet | orderBy:predicate:reverse | filter:hakijaFilter | filter:osallistuvatFilter");
    }, true);
    $scope.$watchGroup(['hakijaFilter','koeFilter','osallistuminenFilter'], function () {
        $scope.filteredResult = $scope.$eval("model.hakeneet | orderBy:predicate:reverse | filter:hakijaFilter | filter:osallistuvatFilter");
    });

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
