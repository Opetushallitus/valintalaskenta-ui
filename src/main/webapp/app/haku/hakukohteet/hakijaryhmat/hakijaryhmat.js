app.factory('ValintalaskentaHakijaryhmaModel', function(HakukohdeHakijaryhma,
                                                        HakukohteenValintatulokset,
                                                        LatestSijoitteluajoHakukohde,
                                                        ngTableParams,
                                                        $q,
                                                        $filter) {
    "use strict";
    return function (hakuOid, hakukohdeOid) {
        var tilaOrdinal = function (tila) {
            switch (tila) {
                case "HYVAKSYTTY":
                    return 4;
                case "HARKINNANVARAISESTI_HYVAKSYTTY":
                    return 3;
                case "VARASIJALTA_HYVAKSYTTY":
                    return 2;
                case "VARALLA":
                    return 1;
                default:
                    return 0;
            }
        };
        return $q.all({
            hakijaryhmat: HakukohdeHakijaryhma.get({hakukohdeoid: hakukohdeOid}).$promise,
            valintatulokset: HakukohteenValintatulokset.get({hakukohdeOid: hakukohdeOid}).$promise,
            sijoittelunTulos: LatestSijoitteluajoHakukohde.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}).$promise
        }).then(function (o) {
            var valintatapajonot = {};
            var sijoittelunTilat = {};
            var valintatulokset = {};
            o.sijoittelunTulos.valintatapajonot.forEach(function (valintatapajono) {
                valintatapajonot[valintatapajono.oid] = valintatapajono;
                valintatapajono.hakemukset.forEach(function (hakemus) {
                    if (sijoittelunTilat.hasOwnProperty(hakemus.hakijaOid)) {
                        sijoittelunTilat[hakemus.hakijaOid].push(hakemus);
                    } else {
                        sijoittelunTilat[hakemus.hakijaOid] = [hakemus];
                    }
                });
            });
            o.valintatulokset.forEach(function (valintatulos) {
                if (valintatulokset.hasOwnProperty(valintatulos.hakijaOid)) {
                    valintatulokset[valintatulos.hakijaOid].push(valintatulos);
                } else {
                    valintatulokset[valintatulos.hakijaOid] = [valintatulos];
                }
            });
            return o.hakijaryhmat.map(function (hakijaryhma) {
                var hakijat = hakijaryhma.jonosijat.map(function (hakija) {
                    var hakemusSijoittelussa = null;
                    (sijoittelunTilat[hakija.hakijaOid] || []).forEach(function (hakemus) {
                        if (hakemusSijoittelussa === null ||
                            tilaOrdinal(hakemus.tila) > tilaOrdinal(hakemusSijoittelussa.tila ||
                                (tilaOrdinal(hakemus.tila) === tilaOrdinal(hakemusSijoittelussa.tila) &&
                                valintatapajonot[hakemus.valintatapajonoOid].prioriteetti < valintatapajonot[hakemusSijoittelussa.valintatapajonoOid].prioriteetti))) {
                            hakemusSijoittelussa = hakemus;
                        }
                    });
                    var vastaanottotila = null;
                    ((hakemusSijoittelussa && valintatulokset[hakija.hakijaOid]) || []).forEach(function (valintatulos) {
                        if (valintatulos.valintatapajonoOid === hakemusSijoittelussa.valintatapajonoOid) {
                            vastaanottotila = valintatulos.tila;
                        }
                    });
                    return {
                        etunimi: hakija.etunimi,
                        sukunimi: hakija.sukunimi,
                        hakemusOid: hakija.hakemusOid,
                        hakijaOid: hakija.hakijaOid,
                        ryhmaanKuuluminen: hakija.jarjestyskriteerit[0].tila,
                        valinnanTila: null,
                        hakemusSijoittelussa: hakemusSijoittelussa,
                        vastaanottotila: vastaanottotila
                    };
                });
                return {
                    nimi: hakijaryhma.nimi,
                    kiintio: hakijaryhma.kiintio,
                    tableParams: new ngTableParams({page: 1, count: 50}, {
                        total: hakijat.length,
                        getData: function ($defer, params) {
                            var orderedData = params.sorting() ?
                                $filter('orderBy')(hakijat, params.orderBy()) :
                                hakijat;
                            orderedData = params.filter() ?
                                $filter('filter')(orderedData, params.filter()) :
                                orderedData;
                            params.total(orderedData.length);
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    })
                };
            });
        });
    };
});

angular.module('valintalaskenta').
    controller('HakijaryhmatController', ['$scope', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila','ValintalaskentaHakijaryhmaModel','HakukohdeModel', '$http', 'AuthService', 'LocalisationService',
        function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila
                  ,ValintalaskentaHakijaryhmaModel, HakukohdeModel, $http, AuthService, LocalisationService) {
            "use strict";
            $scope.hakuOid =  $routeParams.hakuOid;
            ValintalaskentaHakijaryhmaModel($routeParams.hakuOid, $routeParams.hakukohdeOid).then(function(model) {
                $scope.model = model;
            });
            $scope.hakukohdeModel = HakukohdeModel;

            $scope.kuuluuFilterValue = "";
            $scope.kuuluuFilterValues = [
                {value: "", text_prop: "hakijaryhmat.alasuodata", default_text:"Älä suodata"},
                {value: "HYVAKSYTTAVISSA", text_prop: "hakijaryhmat.HYVAKSYTTAVISSA", default_text:"Kuuluu"},
                {value: "HYLATTY", text_prop: "hakijaryhmat.HYLATTY", default_text:"Ei kuulu"}
            ];

            LocalisationService.getTranslationsForArray($scope.kuuluuFilterValues).then(function () {});
    }]);
