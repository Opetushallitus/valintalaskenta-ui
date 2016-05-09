angular.module('valintalaskenta')

.factory('VastaanottoUtil',[ function () {
  "use strict";
  return {
    merkitseMyohastyneeksi: function(valintatulokset) {
      valintatulokset.forEach(function(valintatulos) {
        if (valintatulos.julkaistavissa && "HYLATTY" !== valintatulos.tila && ("EI_VASTAANOTETTU_MAARA_AIKANA" === valintatulos.tilaHakijalle) || valintatulos.vastaanottoAikarajaMennyt) {
          valintatulos.muokattuVastaanottoTila = "EI_VASTAANOTETTU_MAARA_AIKANA"
        }
      });
    }
  };
}]);

app.factory('HakukohteenValintatuloksetIlmanTilaHakijalleTietoa', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/ilmanhakijantilaa/haku/:hakuOid/hakukohde/:hakukohdeOid?valintatapajonoOid=:valintatapajonoOid",
      {
          hakuOid: "@hakuOid",
          hakukohdeOid: "@hakukohdeoid",
          valintatapajonoOid: "@valintatapajonoOid"
      }, {
          get: {method: "GET", isArray:true, cache: false}
      });
});

app.factory('VastaanottoAikarajanMennytTieto', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/myohastyneet/haku/:hakuOid/hakukohde/:hakukohdeOid",
        {
            hakuOid: "@hakuOid",
            hakukohdeOid: "@hakukohdeOid"
        }, {
            post: {method: "POST", isArray: true }
        });
});

app.factory('HakemustenVastaanottotilaHakijalle', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/proxy/valintatulosservice/tilahakijalle/haku/:hakuOid/hakukohde/:hakukohdeOid/valintatapajono/:valintatapajonoOid",
      {
          hakuOid: "@hakuOid",
          hakukohdeOid: "@hakukohdeoid",
          valintatapajonoOid: "@valintatapajonoOid"
      }, {
        post: {method: "POST", isArray: true }
      });
});
