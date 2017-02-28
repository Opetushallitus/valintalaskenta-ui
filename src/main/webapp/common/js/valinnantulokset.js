/**
 * Created by heikki.honkanen on 28/02/2017.
 */

"use strict";

angular.module('valintalaskenta')

  .factory('Valinnantulokset', [function () {
    var checkKeys = [
      // {keyInOld: keyInNew}
      {oldKey: 'ehdollisestiHyvaksyttavissa', newKey: 'ehdollisestiHyvaksyttavissa'},
      {oldKey: 'hakemusOid', newKey: 'hakemusOid'},
      {oldKey: 'hakijaOid', newKey: 'henkiloOid'},
      {oldKey: 'hyvaksyttyVarasijalta', newKey: 'hyvaksyttyVarasijalta'},
      {oldKey: 'ilmoittautumistila', newKey: 'ilmoittautumistila'},
      {oldKey: 'julkaistavissa', newKey: 'julkaistavissa'},
      {oldKey: 'hakemuksentila', newKey: 'valinnantila'},
      {oldKey: 'valintatuloksentila', newKey: 'vastaanottotila'}
    ];

    return {
      compareOldAndNewVtsResponse: function(oldVtsValintatapajono, newVtsValinnantulokset) {
        _(oldVtsValintatapajono.hakemukset).forEach(function (oldHakemus) {
          var newValinnantulos = _(newVtsValinnantulokset).find(function (newTulos) {
            return newTulos.hakemusOid === oldHakemus.hakemusOid;
          });

          if (typeof newValinnantulos === "undefined") {
            console.log("No valinnantulos for hakemus: " + oldHakemus.hakemusOid + " in new VTS api.");
          } else {
            var logValinnantulos = false;
            _(checkKeys).forEach(function (key) {
              var newValue = newValinnantulos[key.newKey],
                oldValue = oldHakemus[key.oldKey];
              if (oldValue !== newValue) {
                console.log("Mismatch with old and new valinnantulos for hakemus: " + oldHakemus.hakemusOid
                  + " on key " + key.oldKey + " (" + key.newKey + ")" + ": " + oldValue + " != " + newValue);
                logValinnantulos = true;
              }
            });
            if (logValinnantulos) console.log(newValinnantulos);
          }
        });
      }
    };
  }]);
