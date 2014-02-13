"use strict";
app.factory('PistesyottoModel', function ($http, HakukohdeAvaimet, HakukohdeHenkilot, HakemusKey, Valintakoetulokset, Hakemus, $q) {
    var model;
    model = new function () {

        this.hakeneet = [];
        this.avaimet = [];
        this.errors = [];
        this.filter = "OSALLISTUU";

        this.refresh = function (hakukohdeOid, hakuOid) {
            model.hakeneet.length = 0;
            model.avaimet.length = 0;
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;

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


                HakukohdeHenkilot.get({aoOid: hakukohdeOid, rows: 100000}, function (result) {
                    model.hakeneet = result.results;
                    HakukohdeAvaimet.get({hakukohdeOid: hakukohdeOid}, function (result) {
                        model.avaimet = result;

                        model.avaimet.forEach(function (avain) {
                            avain.tyyppi = function () {
                                if (avain.funktiotyyppi == "TOTUUSARVOFUNKTIO") {
                                    return "boolean";
                                }
                                return avain.arvot && avain.arvot.length > 0 ? "combo" : "input";
                            };
                        });

                        if (model.hakeneet) {
                            model.hakeneet.forEach(function (hakija) {

                                Hakemus.get({oid: hakija.oid}, function (result) {
                                    if (result.additionalInfo) {
                                        hakija.additionalData = result.additionalInfo;
                                    }

                                    hakija.originalData = {};
                                    hakija.osallistuu = {};

                                    if (!hakija.additionalData) {
                                        hakija.additionalData = [];
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

                                        if(hakija.osallistuu[avain.tunniste] === 'OSALLISTUU') {
                                            hakija.originalData[avain.tunniste] = hakija.additionalData[avain.tunniste];
                                            hakija.originalData[avain.osallistuminenTunniste] = hakija.additionalData[avain.osallistuminenTunniste];
                                        }
                                    });
                                });
                            });
                        }
                    });
                }, function (error) {
                    model.errors.push(error);
                });

            });
        }

        this.refreshIfNeeded = function (hakukohdeOid, hakuOid) {

            if (hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }

        }


        this.submit = function () {
            var promises = [];
            model.errors.length = 0;
            model.hakeneet.forEach(function (hakija) {
                model.avaimet.forEach(function (avain) {
                    var deferred = $q.defer();
                    promises.push(deferred);
                    var min = parseFloat(avain.min);
                    var max = parseFloat(avain.max);
                    var value = hakija.additionalData[avain.tunniste];
                    var valueFloat = parseFloat(value);
                    var tallenna = false;
                    if (!isNaN(min) && !isNaN(max)) {
                        // arvovali on kaytossa
                        if (isNaN(valueFloat)) {
                            // tallenna jos null?
                            if (!value) {
                                value = "";
                                tallenna = true;
                                //hakija.errorField[avain.tunniste] = "";
                            } else {
                                // virhe roskaa
                                //hakija.errorField[avain.tunniste] = "Arvo on virheellinen!";
                            }
                        } else if (min <= valueFloat && max >= valueFloat) {
                            tallenna = true;
                            //hakija.errorField[avain.tunniste] = "";
                        } else {
                            // virhe ei alueella
                            //hakija.errorField[avain.tunniste] = "Arvo ei ole arvoalueella!";
                        }

                    } else {
                        // ei arvovalia. tallennetaan mita vaan?
                        tallenna = true;
                        //hakija.errorField[avain.tunniste] = "";
                    }

                    if (tallenna && hakija.originalData[avain.tunniste] !== value) {
                        HakemusKey.put({
                                "oid": hakija.oid,
                                "key": avain.tunniste,
                                "value": value
                            }
                            , function () {
                                hakija.originalData[avain.tunniste] = value;
                            }, function(error) {
                                model.errors.push(error);
                            });
                    }

                    if (hakija.originalData[avain.osallistuminenTunniste] !== hakija.additionalData[avain.osallistuminenTunniste]) {

                        HakemusKey.put({
                                "oid": hakija.oid,
                                "key": avain.osallistuminenTunniste,
                                "value": hakija.additionalData[avain.osallistuminenTunniste]
                            }
                            , function () {
                                deferred.resolve();
                                hakija.originalData[avain.osallistuminenTunniste] = hakija.additionalData[avain.osallistuminenTunniste];
                            }, function(error) {
                                deferred.reject();
                                model.errors.push(error);
                            });
                    }
                });
            });
            var promise = $q.all(promises);

            promise.then(function(){
                toastr.success('Tallennus onnistui');
            }, function() {
                toastr.error('Tallennus epäonnistui');
            })
            
        };

    };

    return model;
});


function PistesyottoController($scope, $timeout, $location, $routeParams, PistesyottoModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = PistesyottoModel;
    $scope.hakuOid = $routeParams.hakuOid;

    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.arvoFilter = null;
    $scope.tila = "";
    $scope.vainOsallistuvat = true;
    $scope.muutettu = false;

    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    PistesyottoModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'lastName';

    $scope.submit = function () {
        PistesyottoModel.submit();
    }

    $scope.showTiedotPartial = function (hakija) {
        hakija.showTiedotPartial = !hakija.showTiedotPartial;
    };

    $scope.changeOsallistuminen = function (hakija, tunniste, value, avain) {
        if (value) {
            hakija.additionalData[tunniste] = "OSALLISTUI";
        }
    }
    $scope.changeArvo = function (hakija, tunniste, value, tyyppi) {
        hakija.additionalData[tunniste] = "";
        if (value == "OSALLISTUI") {
            if (tyyppi == "boolean") {
                hakija.additionalData[tunniste] = "true";
            } else {
                hakija.additionalData[tunniste] = undefined;
            }
        }

    }

    $scope.osallistuvatFilter = function(actual) {
        var show = false;

        if(!$scope.vainOsallistuvat) {
            show = true;
        } else if($scope.arvoFilter == null) {
            if(actual.osallistuu) {
                for(var osallistuu in actual.osallistuu) {
                    if(actual.osallistuu[osallistuu] == 'OSALLISTUU') {
                        show = true;
                    }
                }
            }
        } else if($scope.arvoFilter
            && $scope.vainOsallistuvat
            && actual.osallistuu
            && actual.osallistuu[$scope.arvoFilter.tunniste] == 'OSALLISTUU') {

            show = true;
        }

        if(show && $scope.tila != "") {
            if($scope.arvoFilter == null) {
                if(actual.originalData) {
                    for(var tila in actual.originalData) {
                        if(tila.indexOf('-OSALLISTUMINEN') > -1) {
                            if(actual.originalData[tila] != $scope.tila) {
                                show = false;
                            }
                        }
                    }
                }
            } else if( actual.originalData
                && actual.originalData[$scope.arvoFilter.tunniste + '-OSALLISTUMINEN'] != $scope.tila ) {
                show = false;
            }
        }

        return show;

    }
}
