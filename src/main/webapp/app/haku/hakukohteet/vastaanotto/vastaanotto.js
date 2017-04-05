angular.module('valintalaskenta')

.factory('VastaanottoUtil',
         ['VastaanottoAikarajanMennytTieto', '$q',
  function ( VastaanottoAikarajanMennytTieto,   $q) {
    "use strict";
  return {
    merkitseMyohastyneeksi: function(valintatulokset) {
      var muokatutValintatulokset = [];
      valintatulokset.forEach(function(valintatulos) {
        if (valintatulos.julkaistavissa && "HYLATTY" !== valintatulos.tila && ("EI_VASTAANOTETTU_MAARA_AIKANA" === valintatulos.tilaHakijalle || valintatulos.vastaanottoAikarajaMennyt)) {
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
          dataloadedCallback(true);
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
      } else if (_.isFunction(dataloadedCallback)) {
          dataloadedCallback(false);
      }
    }
  };
}]);

app.factory('HakukohteenValintatuloksetIlmanTilaHakijalleTietoa', function($resource) {
    var plainUrls = window.urls().noEncode();
    return $resource(
        plainUrls.url("valintalaskentakoostepalvelu.proxy.valintatulosservice.ilmanhakijantilaa.haku.hakukohde",
            ":hakuOid", ":hakukohdeOid", {valintatapajonoOid : ":valintatapajonoOid"}),
        {
            hakuOid: "@hakuOid",
            hakukohdeOid: "@hakukohdeoid",
            valintatapajonoOid: "@valintatapajonoOid"
        }, {
            get: {method: "GET", isArray:true, cache: false}
        });
});

app.factory('VastaanottoAikarajanMennytTieto', function($resource) {
    var plainUrls = window.urls().noEncode();
    return $resource(
        plainUrls.url("valintalaskentakoostepalvelu.proxy.valintatulosservice.myohastyneet.haku.hakukohde",
            ":hakuOid", ":hakukohdeOid"),
        {
            hakuOid: "@hakuOid",
            hakukohdeOid: "@hakukohdeOid"
        }, {
            post: {method: "POST", isArray: true }
        });
});

app.factory('HakemustenVastaanottotilaHakijalle', function($resource) {
    var plainUrls = window.urls().noEncode();
    return $resource(
        plainUrls.url("valintalaskentakoostepalvelu.proxy.valintatulosservice.tilahakijalle.haku.hakukohde.valintatapajono",
            ":hakuOid", ":hakukohdeOid", ":valintatapajonoOid"),
        {
            hakuOid: "@hakuOid",
            hakukohdeOid: "@hakukohdeoid",
            valintatapajonoOid: "@valintatapajonoOid"
        }, {
            post: {method: "POST", isArray: true }
        });
});

app.factory('ValinnanTulos', function($http) {
    var plainUrls = window.urls().noEncode();
    $http.defaults.headers.patch = {"Content-Type": "application/json"};
    return {
        get: function(params, config) {
            return $http.get(plainUrls.url("valinta-tulos-service.valinnan-tulos", params), config || {});
        },
        patch: function(params, data, config) {
            return $http.patch(plainUrls.url("valinta-tulos-service.valinnan-tulos", params), data, config || {});
        }
    };
});
