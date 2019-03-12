var app = angular.module('valintalaskenta');
app.factory('ValintalaskentaHakijaryhmaModel', function(HakukohdeHakijaryhma,
                                                        HakukohdeValinnanvaihe,
                                                        HakukohteenValintatuloksetIlmanTilaHakijalleTietoa,
                                                        VtsLatestSijoitteluajoHakukohde,
                                                        HenkiloPerustietosByHenkiloOidList,
                                                        ngTableParams,
                                                        $q,
                                                        $filter) {
    "use strict";
    return function (hakuOid, hakukohdeOid) {
        var sijoittelunTilaOrdinal = function (tila) {
            return ["VARALLA", "HYVAKSYTTY", "VARASIJALTA_HYVAKSYTTY", "HARKINNANVARAISESTI_HYVAKSYTTY"].indexOf(tila);
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
        var findVastaanottotila = function(valintatulokset, hakemusSijoittelussa, hakija) {
            if (hakemusSijoittelussa && _.has(valintatulokset, hakija.hakijaOid)) {
                var valintatulos = _.find(valintatulokset[hakija.hakijaOid],
                    {valintatapajonoOid: hakemusSijoittelussa.valintatapajonoOid});
                if (valintatulos) {
                    return valintatulos.tila;
                }
            }
        };
        var isHyvaksyttyHakijaryhmasta = function(hakijaryhmaOid, hakemusSijoittelussa) {
            if(hakemusSijoittelussa == null) return undefined;
            return hakemusSijoittelussa.hyvaksyttyHakijaryhmista.findIndex(function(oid) { return oid === hakijaryhmaOid; }) > -1;
        };
        var getKiintio = function(sijoittelunTulos, hakijaryhmaOid) {
            if(hakijaryhmaOid != null && sijoittelunTulos != null && sijoittelunTulos.hakijaryhmat != null) {
                var hakijaryhma = _.findWhere(sijoittelunTulos.hakijaryhmat, { oid: hakijaryhmaOid });
                if(hakijaryhma != null && hakijaryhma.kiintio != null) {
                    return hakijaryhma.kiintio;
                }
            }
            return '';
        }
        var fetchPersons = function (hakijaryhmat) {
            var personOids = _.chain(hakijaryhmat)
                .map(function (hakijaryhma) {
                    return hakijaryhma.jonosijat.map(function (hakija) { return hakija.hakijaOid; });
                })
                .flatten()
                .uniq()
                .value();
            return HenkiloPerustietosByHenkiloOidList.post(personOids);
        };
        var hakijaryhmatPromise = HakukohdeHakijaryhma.get({hakukohdeoid: hakukohdeOid}).$promise;
        return $q.all({
            hakijaryhmat: hakijaryhmatPromise,
            sijoittelunTulos: VtsLatestSijoitteluajoHakukohde.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}).$promise,
            valintatulokset: HakukohteenValintatuloksetIlmanTilaHakijalleTietoa.get({hakuOid: hakuOid, hakukohdeOid: hakukohdeOid}).$promise,
            henkilot: hakijaryhmatPromise.then(fetchPersons)
        }).then(function (o) {
            var valintatapajonot = _.indexBy(o.sijoittelunTulos.valintatapajonot, 'oid');
            var hakemuksetSijoittelussa = _.chain(o.sijoittelunTulos.valintatapajonot)
                .map('hakemukset').flatten().groupBy('hakijaOid').value();
            var valintatulokset = _.groupBy(o.valintatulokset, 'hakijaOid');
            return o.hakijaryhmat.map(function (hakijaryhma) {
                var hakijat = hakijaryhma.jonosijat.map(function (hakija) {
                    var hakemusSijoittelussa = findHakemusSijoittelussa(hakemuksetSijoittelussa, valintatapajonot, hakija);
                    var vastaanottotila = findVastaanottotila(valintatulokset, hakemusSijoittelussa, hakija);
                    var hyvaksyttyHakijaryhmasta = isHyvaksyttyHakijaryhmasta(hakijaryhma.hakijaryhmaOid, hakemusSijoittelussa);
                    var henkilo = o.henkilot.filter(function (person) {
                        return person.oidHenkilo === hakija.hakijaOid;
                    })[0];
                    return {
                        etunimi: henkilo.etunimet,
                        sukunimi: henkilo.sukunimi,
                        hakemusOid: hakija.hakemusOid,
                        hakijaOid: hakija.hakijaOid,
                        ryhmaanKuuluminen: hakija.jarjestyskriteerit[0].tila,
                        jononNimi: hakemusSijoittelussa ? valintatapajonot[hakemusSijoittelussa.valintatapajonoOid].nimi : undefined,
                        hakemusSijoittelussa: hakemusSijoittelussa,
                        sijoittelunTila: hakemusSijoittelussa ? hakemusSijoittelussa.tila : undefined,
                        vastaanottotila: vastaanottotila,
                        hyvaksyttyHakijaryhmasta: hyvaksyttyHakijaryhmasta,
                        pisteet: hakemusSijoittelussa ? hakemusSijoittelussa.pisteet : undefined
                    };
                });
                return {
                    nimi: hakijaryhma.nimi + (_.has(valintatapajonot, hakijaryhma.valintatapajonoOid) ? ', ' + valintatapajonot[hakijaryhma.valintatapajonoOid].nimi : ''),
                    kiintio: getKiintio(o.sijoittelunTulos, hakijaryhma.hakijaryhmaOid),
                    tableParams: new ngTableParams({
                        page: 1,
                        count: 50,
                        sorting: {
                            sukunimi: 'asc'
                        }
                    }, {
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
        'IlmoitusTila','ValintalaskentaHakijaryhmaModel', 'HakuModel', 'HakukohdeModel', '$http', 'AuthService', 'LocalisationService',
        function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila
                  ,ValintalaskentaHakijaryhmaModel, HakuModel, HakukohdeModel, $http, AuthService, LocalisationService) {
            "use strict";
            $scope.hakuOid =  $routeParams.hakuOid;
            $scope.reviewUrlKey = "haku-app.virkailija.hakemus.esikatselu";

            HakuModel.refreshIfNeeded($scope.hakuOid).then(function(hakuModel) {
                $scope.reviewUrlKey = hakuModel.hakuOid.ataruLomakeAvain ? "ataru.application.review" : "haku-app.virkailija.hakemus.esikatselu";
            });
            ValintalaskentaHakijaryhmaModel($routeParams.hakuOid, $routeParams.hakukohdeOid).then(function(model) {
                $scope.model = model;
            });
            $scope.hakukohdeModel = HakukohdeModel;
    }]);
