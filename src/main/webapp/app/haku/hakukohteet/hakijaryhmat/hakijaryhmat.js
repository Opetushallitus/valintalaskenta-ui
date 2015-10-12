app.factory('ValintalaskentaHakijaryhmaModel', function(HakukohdeHakijaryhma,
                                                        HakukohdeValinnanvaihe,
                                                        HakukohteenValintatulokset,
                                                        LatestSijoitteluajoHakukohde,
                                                        ngTableParams,
                                                        $q,
                                                        $filter) {
    "use strict";
    return function (hakuOid, hakukohdeOid) {
        var sijoittelunTilaOrdinal = function (tila) {
            return ["VARALLA", "HYVAKSYTTY", "VARASIJALTA_HYVAKSYTTY", "HARKINNANVARAISESTI_HYVAKSYTTY"].indexOf(tila);
        };
        var laskennanTilaOrdinal = function (tila) {
            return ["MAARITTELEMATON", "HYLATTY", "HYVAKSYTTAVISSA", "HYVAKSYTTY_HARKINNANVARAISESTI", "VIRHE"].indexOf(tila);
        };
        var findHakemusSijoittelussa = function(hakemuksetSijoittelussa, valintatapajonot, hakija) {
            if (_.has(hakemuksetSijoittelussa, hakija.hakijaOid)) {
                return _.reduce(hakemuksetSijoittelussa[hakija.hakijaOid], function (h, hakemus) {
                    if (sijoittelunTilaOrdinal(hakemus.tila) > sijoittelunTilaOrdinal(h.tila)) {
                        return hakemus;
                    }
                    if (sijoittelunTilaOrdinal(hakemus.tila) < sijoittelunTilaOrdinal(h.tila)) {
                        return h;
                    }
                    if (valintatapajonot[hakemus.valintatapajonoOid].prioriteetti < valintatapajonot[h.valintatapajonoOid].prioriteetti) {
                        return hakemus;
                    }
                    return h;
                });
            }
        };
        var findValinnanTila = function(laskennanTilat, hakemusSijoittelussa, hakija) {
            if (laskennanTilat) {
                if (hakemusSijoittelussa &&
                    _.has(laskennanTilat, hakemusSijoittelussa.valintatapajonoid) &&
                    _.has(laskennanTilat[hakemusSijoittelussa.valintatapajonoid], hakija.hakijaOid)) {
                    return laskennanTilat[hakemusSijoittelussa.valintatapajonoid][hakija.hakijaOid].tuloksenTila;
                }
                var valinnanTila = _.chain(laskennanTilat)
                    .map(hakija.hakijaOid).compact().map('tuloksenTila').max(laskennanTilaOrdinal).value();
                if (valinnanTila !== -Infinity) {
                    return valinnanTila;
                }
            }
        };
        var findVastaanottotila = function(valintatulokset, hakemusSijoittelussa, hakija) {
            if (hakemusSijoittelussa && _.has(valintatulokset, hakija.hakijaOid)) {
                var valintatulos = _.find(valintatulokset[hakija.hakijaOid],
                    {valintatapajonoOid: hakemusSijoittelussa.valintatapajonoOid});
                if (valintatulos) {
                    return valintatulos.tila;
                }
            }
        };
        return $q.all({
            hakijaryhmat: HakukohdeHakijaryhma.get({hakukohdeoid: hakukohdeOid}).$promise,
            laskennanTilat: HakukohdeValinnanvaihe.get({parentOid: hakukohdeOid}).$promise,
            sijoittelunTulos: LatestSijoitteluajoHakukohde.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}).$promise,
            valintatulokset: HakukohteenValintatulokset.get({hakukohdeOid: hakukohdeOid}).$promise
        }).then(function (o) {
            var viimeinenValinnanvaihe = _.max(o.laskennanTilat, 'jarjestysnumero');
            if (viimeinenValinnanvaihe !== -Infinity) {
                var laskennanTilat = _.reduce(viimeinenValinnanvaihe.valintatapajonot, function(m, valintatapajono) {
                    m[valintatapajono.oid] = _.indexBy(valintatapajono.jonosijat, 'hakijaOid');
                    return m;
                }, {});
            }
            var valintatapajonot = _.indexBy(o.sijoittelunTulos.valintatapajonot, 'oid');
            var hakemuksetSijoittelussa = _.chain(o.sijoittelunTulos.valintatapajonot)
                .map('hakemukset').flatten().groupBy('hakijaOid').value();
            var valintatulokset = _.groupBy(o.valintatulokset, 'hakijaOid');
            return o.hakijaryhmat.map(function (hakijaryhma) {
                var hakijat = hakijaryhma.jonosijat.map(function (hakija) {
                    var hakemusSijoittelussa = findHakemusSijoittelussa(hakemuksetSijoittelussa, valintatapajonot, hakija);
                    var valinnanTila = findValinnanTila(laskennanTilat, hakemusSijoittelussa, hakija);
                    var vastaanottotila = findVastaanottotila(valintatulokset, hakemusSijoittelussa, hakija);
                    return {
                        etunimi: hakija.etunimi,
                        sukunimi: hakija.sukunimi,
                        hakemusOid: hakija.hakemusOid,
                        hakijaOid: hakija.hakijaOid,
                        ryhmaanKuuluminen: hakija.jarjestyskriteerit[0].tila,
                        valinnanTila: valinnanTila,
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
