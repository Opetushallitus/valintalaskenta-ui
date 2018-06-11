

angular.module('valintalaskenta')
    .config(function($routeProvider) {
      var sijoitteluntulosResolve = {
          DokumenttipalveluData: function() {

            var dokumenttipalveluPromises = [
              HaeDokumenttipalvelusta.get({tyyppi:'osoitetarrat',hakukohdeoid:$routeParams.hakukohdeOid }).$promise,
              HaeDokumenttipalvelusta.get({tyyppi:'hyvaksymiskirjeet',hakukohdeoid:$routeParams.hakukohdeOid }).$promise,
              HaeDokumenttipalvelusta.get({tyyppi:'sijoitteluntulokset',hakukohdeoid:$routeParams.hakukohdeOid}).$promise
            ];

            $q.all(dokumenttipalveluPromises).then(
              function (success) {
                console.log("dokumenttipalveluPromises completed: " + success);

                var results = {};

                if (success[0][0]) {
                  results.osoitetarratUrl = success[0][0].documentId;
                  console.log("osoitetarratUrl value set");
                }
                if (success[1][0]) {
                  results.hyvaksymiskirjeetUrl = success[1][0].documentId;
                  console.log("hyvaksymiskirjeetUrl value set");
                }
                if (success[2][0]) {
                  results.sijoitteluntuloksetUrl = success[2][0].documentId;
                  console.log("sijoitteluntuloksetUrl value set");
                }

                return results;
              }, function (error) {
                console.log("dokumenttipalveluPromises error: " + error);
              });
          }
      };

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
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/pistesyotto/naytakaikki', {controller:'PistesyottoNaytaKaikkiController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/pistesyotto/nayta_kaikki/nayta_kaikki.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/sijoitteluntulos', {controller:'SijoitteluntulosController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/sijoittelu_tulos/sijoitteluntulos.html', resolve:sijoitteluntulosResolve}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/hakijaryhmat', {controller:'HakijaryhmatController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/hakijaryhmat/hakijaryhmat.html'}).
        when('/haku/:hakuOid/hakukohde/:hakukohdeOid/erillishaku', {controller:'ErillishakuController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/erillishaku/erillishaku.html'}).

        when('/valintatapajono/:valintatapajonoOid/hakemus/:hakemusOid/valintalaskentahistoria', {controller:'ValintalaskentaHistoriaController', templateUrl:TEMPLATE_URL_BASE + 'haku/hakukohteet/valintalaskenta_tulos/valintalaskentahistoria.html'}).

        when('/haku/:hakuOid/henkiloittain/', {controller:'HenkiloController', templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilo.html'}).
        when('/haku/:hakuOid/henkiloittain/:hakemusOid/henkilotiedot', {controller:'HenkiloTiedotController', templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilotiedot.html'}).
        when('/haku/:hakuOid/henkiloittain/:hakemusOid/henkilotiedot/:scrollTo', {controller:'HenkiloTiedotController', templateUrl:TEMPLATE_URL_BASE + 'haku/henkilot/henkilotiedot.html'}).

        when('/haku/:hakuOid/yhteisvalinnanhallinta', {controller:'YhteisvalinnanHallintaController', templateUrl:TEMPLATE_URL_BASE + 'haku/hallinta/yhteisvalinnanhallinta.html'}).

        when('/haku/:hakuOid/valintaryhmittain', {controller: 'ValintaryhmaController', templateUrl: TEMPLATE_URL_BASE + 'haku/valintaryhmat/valintaryhma.html'}).

        otherwise({redirectTo:'/haku/'});

});