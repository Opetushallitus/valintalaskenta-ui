'use strict'

angular
  .module('valintalaskenta')

  .factory('Kirjeet', [
    '$modal',
    'Kirjepohjat',
    'Hyvaksymiskirjeet',
    'Latausikkuna',
    '$window',
    'Ilmoitus',
    'IlmoitusTila',
    'KoekutsukirjeetSahkopostita',
    'Koekutsukirjeet',
    function (
      $modal,
      Kirjepohjat,
      Hyvaksymiskirjeet,
      Latausikkuna,
      $window,
      Ilmoitus,
      IlmoitusTila,
      KoekutsukirjeetSahkopostita,
      Koekutsukirjeet
    ) {
      return {
        koekutsukirjeet: function (kirje) {
          $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
              oids: function () {
                return {
                  otsikko: 'Koekutsukirjeet',
                  toimintoNimi: 'Muodosta koekutsukirjeet',
                  toiminto: function (sisalto) {
                    Koekutsukirjeet.post(
                      {
                        hakuOid: kirje.hakuOid,
                        hakukohdeOid: kirje.hakukohdeOid,
                        tarjoajaOid: kirje.tarjoajaOid,
                        templateName: 'koekutsukirje',
                        valintakoeTunnisteet: [kirje.valintakoe],
                      },
                      {
                        tag: 'valintakoetulos',
                        hakemusOids: kirje.hakemusOids,
                        letterBodyText: sisalto,
                      },
                      function (id) {
                        Latausikkuna.avaaKustomoitu(
                          id,
                          kirje.otsikko,
                          IlmoitusTila.INFO,
                          kirje.valintakoeTunniste,
                          'haku/hakukohteet/koekutsut/modaalinen/valintakoe.html',
                          function (dokumenttiId) {
                            $window.open(
                              window.url(
                                'viestintapalvelu.letter.previewletterbatchemail',
                                dokumenttiId
                              )
                            )
                          },
                          function (dokumenttiId) {
                            KoekutsukirjeetSahkopostita.put(
                              dokumenttiId,
                              function (success) {
                                Ilmoitus.avaa(
                                  'Sähköpostilla lähetys onnistui',
                                  'Koekutsukirjeiden lähetys sähköpostilla onnistui'
                                )
                              },
                              function () {
                                Ilmoitus.avaa(
                                  'Sähköpostilla lähetys epäonnistui',
                                  'Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.',
                                  IlmoitusTila.ERROR
                                )
                              }
                            )
                          }
                        )
                      },
                      function () {}
                    )
                  },
                  showDateFields: true,
                  hakuOid: kirje.hakuOid,
                  hakukohdeOid: kirje.hakukohdeOid,
                  tarjoajaOid: kirje.tarjoajaOid,
                  pohjat: function () {
                    return Kirjepohjat.get({
                      templateName: kirje.templateName,
                      languageCode: kirje.langcode,
                      tarjoajaOid: kirje.tarjoajaOid,
                      tag: kirje.tag,
                      hakuOid: kirje.hakuOid,
                    })
                  },
                  hakukohdeNimiUri: kirje.hakukohdeNimiUri,
                  hakukohdeNimi: kirje.hakukohdeNimi,
                }
              },
            },
          })
        },
        hyvaksymiskirjeet: function (kirje) {
          var viestintapalveluInstance = $modal.open({
            backdrop: 'static',
            templateUrl: '../common/modaalinen/viestintapalveluikkuna.html',
            controller: ViestintapalveluIkkunaCtrl,
            size: 'lg',
            resolve: {
              oids: function () {
                return {
                  hyvaksymisUi: true,
                  otsikko: 'Hyväksymiskirjeet',
                  toimintoNimi: 'Muodosta hyväksymiskirjeet',
                  toiminto: function (
                    sisalto,
                    palautusPvm,
                    palautusAika,
                    vainEmailinKieltaneet
                  ) {
                    console.log(
                      'Calling hyväksymiskirjeet backend, kirje.hakemusOids: ',
                      kirje.hakemusOids
                    )
                    console.log(
                      'vainEmailinKieltaneet = ' + vainEmailinKieltaneet
                    )
                    Hyvaksymiskirjeet.post(
                      {
                        sijoitteluajoId: kirje.sijoitteluajoId,
                        hakuOid: kirje.hakuOid,
                        tarjoajaOid: kirje.tarjoajaOid,
                        templateName: kirje.templateName,
                        palautusPvm: palautusPvm,
                        palautusAika: palautusAika,
                        tag: kirje.tag,
                        hakukohdeOid: kirje.hakukohdeOid,
                        vainTulosEmailinKieltaneet: vainEmailinKieltaneet,
                      },
                      {
                        hakemusOids: kirje.hakemusOids,
                        letterBodyText: sisalto,
                      },
                      function (id) {
                        Latausikkuna.avaa(
                          id,
                          'Sijoittelussa hyväksytyille hyväksymiskirjeet',
                          ''
                        )
                      },
                      function () {}
                    )
                  },
                  showDateFields: true,
                  hakuOid: kirje.hakuOid,
                  hakukohdeOid: kirje.hakukohdeOid,
                  tarjoajaOid: kirje.tarjoajaOid,
                  pohjat: function () {
                    return Kirjepohjat.get({
                      templateName: kirje.templateName,
                      languageCode: kirje.langcode,
                      tarjoajaOid: kirje.tarjoajaOid,
                      tag: kirje.tag,
                      hakuOid: kirje.hakuOid,
                    })
                  },
                  hakukohdeNimiUri: kirje.hakukohdeNimiUri,
                  hakukohdeNimi: kirje.hakukohdeNimi,
                }
              },
            },
          })
        },
      }
    },
  ])
