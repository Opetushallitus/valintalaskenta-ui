angular.module('valintalaskenta')

.factory('VastaanottoUtil',
         ['VastaanottoAikarajanMennytTieto', '$q',
  function ( VastaanottoAikarajanMennytTieto,   $q) {
    "use strict";
  return {
    merkitseMyohastyneeksi: function(valintatulokset) {
      var muokatutValintatulokset = [];
      valintatulokset.forEach(function(valintatulos) {
        if (valintatulos.julkaistavissa && "HYLATTY" !== valintatulos.tila && ("EI_VASTAANOTETTU_MAARA_AIKANA" === valintatulos.tilaHakijalle) || valintatulos.vastaanottoAikarajaMennyt) {
          valintatulos.muokattuVastaanottoTila = "EI_VASTAANOTETTU_MAARA_AIKANA"
          muokatutValintatulokset.push(valintatulos);
        }
      });
      return muokatutValintatulokset;
    },

    fetchAndPopulateVastaanottoDeadlineDetailsAsynchronously: function(hakuOid, hakukohdeOid, kaikkiHakemukset, oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon, dataloadedCallback) {
      var aikarajaMennytDeferred = $q.defer();
      aikarajaMennytDeferred.promise.then(function (aikarajaMennytTiedot) {
        _.forEach(aikarajaMennytTiedot, function (vastaanottoAikarajaMennyt) {
          _.forEach(kaikkiHakemukset, function (hakemus) {
            if (hakemus && (hakemus.hakemusOid === vastaanottoAikarajaMennyt.hakemusOid)) {
              hakemus.vastaanottoAikarajaMennyt = vastaanottoAikarajaMennyt.mennyt;
              hakemus.vastaanottoAikaraja = vastaanottoAikarajaMennyt.vastaanottoDeadline;
            }
          });
        });
        if (_.isFunction(dataloadedCallback)) {
          dataloadedCallback();
        }
      });

      if (oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon.length > 0) {
        VastaanottoAikarajanMennytTieto.post({
            hakuOid: hakuOid,
            hakukohdeOid: hakukohdeOid
          }, angular.toJson(oiditHakemuksilleJotkaTarvitsevatAikarajaMennytTiedon),
          function (result) {
            aikarajaMennytDeferred.resolve(result);
          },
          function (error) {
            aikarajaMennytDeferred.reject(error);
          }
        );
      }
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