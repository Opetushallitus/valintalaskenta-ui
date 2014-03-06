"use strict";
app.factory('PistesyottoModel', function ($q, HakukohdeAvaimet, HakemusAdditionalData, Valintakoetulokset) {
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
            model.hakuOid = hakuOid;

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

                                hakija.filterData = {};
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
        }

        this.refreshIfNeeded = function (hakukohdeOid, hakuOid) {

            if (hakukohdeOid && hakukohdeOid != model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }

        }


        this.submit = function () {

            // haku-app ei halua ylimääräistä tietoa
            var hakeneet = angular.copy(model.hakeneet);
            hakeneet.forEach(function(hakija){
                hakija.filterData = undefined;
                hakija.osallistuu = undefined;
            });
            HakemusAdditionalData.put({hakuOid: model.hakuOid, hakukohdeOid: model.hakukohdeOid}, hakeneet, function(success){
                toastr.success('Tallennus onnistui');
            },function(error){
                toastr.error('Tallennus epäonnistui');
                console.log(error);
            });

        };

        this.updateFilterData = function () {
            model.hakeneet.forEach(function (hakija) {
                angular.copy(hakija.additionalData, hakija.filterData);
            });
        }

    };

    return model;
});


function PistesyottoController($scope, $timeout, $routeParams, PistesyottoModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = PistesyottoModel;
    $scope.hakuOid = $routeParams.hakuOid;

    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.koeFilter = null;
    $scope.osallistuminenFilter = "";
//    $scope.vainOsallistuvat = true;
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

    $scope.osallistuvatFilter = function (actual) {
        var show = false;

        if ($scope.koeFilter == null) {
            if (actual.osallistuu) {
                PistesyottoModel.avaimet.forEach(function (avain) {

                    if (actual.osallistuu[avain.tunniste] == 'OSALLISTUU') {
                        show = true;
                    }

                });
            }
        } else if ($scope.koeFilter
            && actual.osallistuu
            && actual.osallistuu[$scope.koeFilter.tunniste] == 'OSALLISTUU') {

            show = true;
        }

        if (show && $scope.osallistuminenFilter != "") {
            if ($scope.koeFilter == null) {

                if (actual.filterData) {
                    var tempShow = false;
                    PistesyottoModel.avaimet.forEach(function (avain) {

                        if (actual.osallistuu[avain.tunniste] == 'OSALLISTUU' && actual.filterData[avain.tunniste + '-OSALLISTUMINEN'] == $scope.osallistuminenFilter) {
                            console.log(actual);
                            console.log(avain.tunniste + '-OSALLISTUMINEN');
                            tempShow = true;
                        }

                    });
                    show = tempShow;
                }
            } else if (actual.filterData
                && actual.filterData[$scope.koeFilter.tunniste + '-OSALLISTUMINEN']
                != $scope.osallistuminenFilter) {
                show = false;
            }
        }

        return show;

    }

    $scope.updateFilterData = function () {
        PistesyottoModel.updateFilterData();
    }

    $scope.limit = 20;
    $scope.lazyLoading = function () {

        $scope.showLoading = true;
        $timeout(function () {
            $scope.limit += 50;
            $scope.showLoading = false;
        }, 10);
    }
}
