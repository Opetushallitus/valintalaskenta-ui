

angular.module('valintalaskenta')
    .config(function($routeProvider) {
    $routeProvider.
        when('/haku/', {controller:'HakuController', templateUrl:TEMPLATE_URL_BASE + 'haku/haut.html'}).
        when('/haku/:hakuOid/hakukohde/', {controller:'HakukohdeController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hakukohde.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller:'HakukohdeController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/perustiedot/hakukohdeperustiedot.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valinnanhallinta', {controller:'ValinnanhallintaController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hallinta/valinnanhallinta.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/harkinnanvaraiset', {controller:'HarkinnanvaraisetController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/harkinnanvaraiset/harkinnanvaraiset.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintalaskentatulos', {controller:'ValintalaskentatulosController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/valintalaskenta_tulos/valintalaskentatulos.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/valintakoetulos', {controller:'ValintakoetulosController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/koekutsut/valintakoetulos.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/hakeneet', {controller:'HakeneetController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hakeneet/hakeneet.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/pistesyotto', {controller:'PistesyottoController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/pistesyotto/pistesyotto.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/sijoitteluntulos', {controller:'SijoitteluntulosController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/sijoittelu_tulos/sijoitteluntulos.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/hakijaryhmat', {controller:'HakijaryhmatController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hakijaryhmat/hakijaryhmat.html'}).

        when('/valintatapajono/:valintatapajonoOid/hakemus/:hakemusOid/valintalaskentahistoria', {controller:'ValintalaskentaHistoriaController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/valintalaskenta_tulos/valintalaskentahistoria.html'}).

        when('/haku/:hakuOid/henkiloittain/', {controller:'HenkiloController', templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilo.html'}).
        when('/haku/:hakuOid/henkiloittain/:hakemusOid/henkilotiedot', {controller:'HenkiloTiedotController', templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilotiedot.html'}).
        when('/haku/:hakuOid/henkiloittain/:hakemusOid/henkilotiedot/:scrollTo', {controller:'HenkiloTiedotController', templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilotiedot.html'}).

        when('/haku/:hakuOid/yhteisvalinnanhallinta', {controller:'YhteisvalinnanHallintaController', templateUrl:TEMPLATE_URL_BASE + 'haku/hallinta/yhteisvalinnanhallinta.html'}).
        when('/haku/:hakuOid/yhteisvalinnanhallinta/valintatulos', {controller:'ValintatulosController', templateUrl:TEMPLATE_URL_BASE + 'haku/hallinta/tulos/valintatulos.html'}).

        when('/haku/:hakuOid/valintaryhmittain', {controller: 'ValintaryhmaController', templateUrl: TEMPLATE_URL_BASE + 'haku/valintaryhmat/valintaryhma.html'}).
        when('/lisahaku/:hakuOid/valintaryhmittain', {controller:'ValintaryhmaController', templateUrl: TEMPLATE_URL_BASE + 'haku/valintaryhmat/valintaryhma.html'}).


        when('/lisahaku/:hakuOid/hakukohde', {controller: 'LisahakuController', templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/lisahakuHakukohde.html'}).
        when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/perustiedot', {controller: 'HakukohdeController', templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/hakukohdeperustiedot.html'}).
        when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/hyvaksytyt', {controller: 'LisahakuhyvaksytytController', templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/hyvaksytyt.html'}).
        when('/lisahaku/:hakuOid/hakukohde/:hakukohdeOid/hakeneet', {controller: 'HakeneetController', templateUrl: TEMPLATE_URL_BASE + 'haku/lisahaku/hakeneet.html'}).

        otherwise({redirectTo:'/haku/'});

});