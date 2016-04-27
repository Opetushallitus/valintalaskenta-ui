angular.module('valintalaskenta')

.factory('VastaanottoUtil',[ function () {
  "use strict";
  return {
    merkitseMyohastyneeksi: function(valintatulokset) {
      valintatulokset.forEach(function(valintatulos) {
        if (valintatulos.julkaistavissa && "HYLATTY" !== valintatulos.tila && "EI_VASTAANOTETTU_MAARA_AIKANA" === valintatulos.tilaHakijalle) {
          valintatulos.muokattuVastaanottoTila = valintatulos.tilaHakijalle
        }
      });
    }
  };
}]);
