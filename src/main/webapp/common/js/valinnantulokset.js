/**
 * Created by heikki.honkanen on 28/02/2017.
 */

'use strict';

angular.module('valintalaskenta')

  .factory('Valinnantulokset', [function () {
    var valinnantulokset = {};

    valinnantulokset.compareOldAndNewVtsResponse = function(oldVtsValintatapajono, newVtsValinnantulokset, checkKeys) {
      compareValintatapajonoValinnantulokset(oldVtsValintatapajono, newVtsValinnantulokset);

      _(oldVtsValintatapajono.hakemukset).forEach(function (oldHakemus) {
        var newValinnantulos = getNewValinnantulos(newVtsValinnantulokset, oldHakemus);

        if (typeof newValinnantulos === 'undefined') {
          console.log('No valinnantulos for hakemus: ' + oldHakemus.hakemusOid + ' in new VTS api.');
          splitLog();
        } else {
          var logValinnantulos = false;
          _(checkKeys).forEach(function (key) {
            var newValue = newValinnantulos[key.newKey],
              oldValue = oldHakemus[key.oldKey];
            if (oldValue !== newValue) {
              console.log('Mismatch with old and new valinnantulos for hakemus: ' + oldHakemus.hakemusOid +
                ' on key ' + key.oldKey + ' (' + key.newKey + ')' + ': ' + oldValue + ' != ' + newValue);
              logValinnantulos = true;
            }
          });
          if (logValinnantulos) {
            console.log(newValinnantulos);
            splitLog();
          }
        }
      });
    };

    function getNewValinnantulos(newVtsValinnantulokset, oldHakemus) {
      var newValinnantulokses = _(newVtsValinnantulokset).filter(function(newTulos) {
        return newTulos.hakemusOid === oldHakemus.hakemusOid;
      });

      var newValinnantulos = undefined;

      if (newValinnantulokses.length > 1) {
        console.log('Too many ' + newValinnantulokses.length +
          ' valinnantulos for hakemus ' + newValinnantulokses[0].hakemusOid);
      }
      else newValinnantulos = newValinnantulokses[0];
      return newValinnantulos;
    }

    var compareValintatapajonoValinnantulokset = function(oldVtsValintatapajono, newVtsValinnantulokset) {
      var hakemukset = oldVtsValintatapajono.hakemukset;

      if (hakemukset.length < newVtsValinnantulokset.length) {
        console.log('Too many valinnantulos from VTS for valintatapajono ' + oldVtsValintatapajono.oid);
        var oldHakemusOids = _(hakemukset).map(function(hakemus) {return hakemus.hakemusOid}),
          valinnantulosHakemusOids = _(newVtsValinnantulokset).map(function(tulos) {return tulos.hakemusOid}),
          extraOids = _.difference(valinnantulosHakemusOids, oldHakemusOids);
        console.log('Hakemusoids in VTS response but not in original hakemus list: ' + extraOids.join(','));
        splitLog();
      }
    };

    var splitLog = function() {
      console.log('-------------------------------------------');
    };

    valinnantulokset.compareErillishakuOldAndNewVtsResponse = function(oldVtsValintatapajono, newVtsValinnantulokset) {
      valinnantulokset.compareOldAndNewVtsResponse(oldVtsValintatapajono, newVtsValinnantulokset, erillishakuKeys)
    };

    valinnantulokset.compareSijoitteluOldAndNewVtsResponse = function(oldVtsValintatapajono, newVtsValinnantulokset) {
      valinnantulokset.compareOldAndNewVtsResponse(oldVtsValintatapajono, newVtsValinnantulokset, sijoittelunTulosKeys)
    };

    var getNewValinnantulos = function(newVtsValinnantulokset, oldHakemus) {
      var newValinnantulokses = _(newVtsValinnantulokset).filter(function(newTulos) {
        return newTulos.hakemusOid === oldHakemus.hakemusOid;
      });

      var newValinnantulos = undefined;

      if (newValinnantulokses.length > 1) {
        console.log('Too many ' + newValinnantulokses.length +
          ' valinnantulos for hakemus ' + newValinnantulokses[0].hakemusOid);
      }
      else newValinnantulos = newValinnantulokses[0];
      return newValinnantulos;
    };

    var compareValintatapajonoValinnantulokset = function(oldVtsValintatapajono, newVtsValinnantulokset) {
      var hakemukset = oldVtsValintatapajono.hakemukset;

      if (hakemukset.length < newVtsValinnantulokset.length) {
        console.log('Too many valinnantulos from VTS for valintatapajono ' + oldVtsValintatapajono.oid);
        var oldHakemusOids = _(hakemukset).map(function(hakemus) {return hakemus.hakemusOid}),
          valinnantulosHakemusOids = _(newVtsValinnantulokset).map(function(tulos) {return tulos.hakemusOid}),
          extraOids = _.difference(valinnantulosHakemusOids, oldHakemusOids);
        console.log('Hakemusoids in VTS response but not in original hakemus list: ' + extraOids.join(','));
        splitLog();
      }
    };

    var splitLog = function() {
      console.log('-------------------------------------------');
    };

    var erillishakuKeys = [
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
    
    var sijoittelunTulosKeys = [
      {oldKey: 'ehdollisestiHyvaksyttavissa', newKey: 'ehdollisestiHyvaksyttavissa'},
      {oldKey: 'hakemusOid', newKey: 'hakemusOid'},
      {oldKey: 'hakijaOid', newKey: 'henkiloOid'},
      {oldKey: 'hyvaksyttyVarasijalta', newKey: 'hyvaksyttyVarasijalta'},
      {oldKey: 'ilmoittautumisTila', newKey: 'ilmoittautumistila'},
      {oldKey: 'julkaistavissa', newKey: 'julkaistavissa'},
      {oldKey: 'tila', newKey: 'valinnantila'},
      {oldKey: 'vastaanottoTila', newKey: 'vastaanottotila'}
    ];

    return valinnantulokset;
  }]);
