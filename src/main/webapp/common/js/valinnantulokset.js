/**
 * Created by heikki.honkanen on 28/02/2017.
 */

'use strict';

angular.module('valintalaskenta')

  .factory('Valinnantulokset', [function () {
    var valinnantulokset = {},
      useVtsData = READ_FROM_VALINTAREKISTERI === "true";

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
            if (newValue instanceof Date || oldValue instanceof Date) {
              var newTime = newValue instanceof Date ? newValue.getTime() : newValue;
              var oldTime = oldValue instanceof Date ? oldValue.getTime() : oldValue;
              if (!(isNaN(newTime) && isNaN(oldTime)) && newTime !== oldTime) {
                console.log('Mismatch with old and new valinnantulos for hakemus: ' + oldHakemus.hakemusOid +
                    ' on key ' + key.oldKey + ' (' + key.newKey + ')' + ': ' + oldValue + ' != ' + newValue);
                logValinnantulos = true;
              }
            } else if (oldValue !== newValue) {
              console.log('Mismatch with old and new valinnantulos for hakemus: ' + oldHakemus.hakemusOid +
                ' on key ' + key.oldKey + ' (' + key.newKey + ')' + ': ' + oldValue + ' != ' + newValue);
              logValinnantulos = true;
            }
            if (useVtsData) oldHakemus[key.oldKey] = newValue;
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
      {oldKey: 'valintatuloksentila', newKey: 'vastaanottotila'},
      {oldKey: 'hyvaksymiskirjeLahetetty', newKey: 'hyvaksymiskirjeLahetetty'}
    ];

    var sijoittelunTulosKeys =[
      "hakijaOid",
      "hakemusOid",
      "pisteet",
      "paasyJaSoveltuvuusKokeenTulos",
      "etunimi",
      "sukunimi",
      "prioriteetti",
      "jonosija",
      "tasasijaJonosija",
      "tila",
      "tilanKuvaukset",
      "tilaHistoria",
      "hyvaksyttyHarkinnanvaraisesti",
      "varasijanNumero",
      "valintatapajonoOid",
      "hakuOid",
      "onkoMuuttunutViimeSijoittelussa",
      "hyvaksyttyHakijaryhmista",
      "siirtynytToisestaValintatapajonosta",
      "todellinenJonosija",
      "vastaanottoTila",
      "muokattuVastaanottoTila",
      "muokattuIlmoittautumisTila",
      "tilaHakijalle",
      "logEntries",
      "tilaHakijalleTaytyyLadataPalvelimelta",
      "ilmoittautumisTila",
      "julkaistavissa",
      "ehdollisestiHyvaksyttavissa",
      "hyvaksyttyVarasijalta",
      "hyvaksyPeruuntunut"
    ].map(function(key) { return {oldKey: key, newKey: key }; });

    return valinnantulokset;
  }]);
