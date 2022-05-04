var plainUrl = window.urls().noEncode().url

var kieliNimiToNimi = function (tarjontaNimi) {
  var nimi = {}
  if (
    tarjontaNimi.kieli_fi !== undefined &&
    tarjontaNimi.kieli_fi.trim() !== ''
  ) {
    nimi.kieli_fi = tarjontaNimi.kieli_fi
  }
  if (
    tarjontaNimi.kieli_sv !== undefined &&
    tarjontaNimi.kieli_sv.trim() !== ''
  ) {
    nimi.kieli_sv = tarjontaNimi.kieli_sv
  }
  if (
    tarjontaNimi.kieli_en !== undefined &&
    tarjontaNimi.kieli_en.trim() !== ''
  ) {
    nimi.kieli_en = tarjontaNimi.kieli_en
  }
  return nimi
}
var arvoNimiToNimi = function (koutaNimi) {
  var nimi = {}
  if (koutaNimi.fi !== undefined && koutaNimi.fi.trim() !== '') {
    nimi.kieli_fi = koutaNimi.fi
  }
  if (koutaNimi.sv !== undefined && koutaNimi.sv.trim() !== '') {
    nimi.kieli_sv = koutaNimi.sv
  }
  if (koutaNimi.en !== undefined && koutaNimi.en.trim() !== '') {
    nimi.kieli_en = koutaNimi.en
  }
  return nimi
}
var tarjontaHakuToHaku = function (haku) {
  return {
    oid: haku.oid,
    tila: haku.tila,
    nimi: kieliNimiToNimi(haku.nimi),
    ataruLomakeAvain: haku.ataruLomakeAvain,
    haunTunniste: haku.haunTunniste,
    kohdejoukkoUri: haku.kohdejoukkoUri,
    kohdejoukonTarkenne: haku.kohdejoukonTarkenne,
    hakukausiVuosi: haku.hakukausiVuosi,
    hakukausiUri: haku.hakukausiUri,
    hakuaikas: haku.hakuaikas,
    hakutapaUri: haku.hakutapaUri,
    hakutyyppiUri: haku.hakutyyppiUri,
    organisaatioOids: haku.organisaatioOids,
    sijoittelu: haku.sijoittelu,
  }
}
var koutaHakuToHaku = function (haku, ohjausparametrit) {
  return {
    oid: haku.oid,
    tila: 'JULKAISTU',
    nimi: arvoNimiToNimi(haku.nimi),
    ataruLomakeAvain: haku.hakulomakeAtaruId,
    haunTunniste: null,
    kohdejoukkoUri: haku.kohdejoukkoKoodiUri,
    kohdejoukonTarkenne: haku.kohdejoukonTarkenneKoodiUri,
    hakukausiVuosi: null,
    hakukausiUri: null,
    hakuaikas: haku.hakuajat.map(function (hakuaika) {
      return {
        nimi: '',
        alkuPvm: hakuaika.alkaa ? new Date(hakuaika.alkaa).getTime() : null,
        loppuPvm: hakuaika.paattyy
          ? new Date(hakuaika.paattyy).getTime()
          : null,
      }
    }),
    hakutapaUri: haku.hakutapaKoodiUri,
    hakutyyppiUri: null,
    organisaatioOids: [haku.organisaatioOid],
    sijoittelu: ohjausparametrit.sijoittelu || false,
  }
}
var tarjontaHakukohdeTulosToHakukohde = function (hakukohde) {
  return {
    oid: hakukohde.hakukohdeOid,
    nimi: arvoNimiToNimi(hakukohde.hakukohdeNimi),
    tarjoajaNimi: arvoNimiToNimi(hakukohde.tarjoajaNimi),
  }
}
var koutaHakukohdeAndTarjoajatToHakukohde = function (hakukohde, tarjoajat) {
  return {
    oid: hakukohde.oid,
    nimi: arvoNimiToNimi(hakukohde.nimi),
    tarjoajaNimi: arvoNimiToNimi(tarjoajat[0].nimi),
  }
}
var tarjontaHakukohdeToHakukohde = function (hakukohde) {
  return {
    oid: hakukohde.oid,
    nimi: kieliNimiToNimi(hakukohde.hakukohteenNimet),
    tarjoajaOids: hakukohde.tarjoajaOids,
    tarjoajaNimi: arvoNimiToNimi(hakukohde.tarjoajaNimet),
    organisaatioRyhmaOids: hakukohde.organisaatioRyhmaOids || [],
    opetuskielet: hakukohde.opetusKielet,
    virkailijaUrl: plainUrl('tarjonta-app.hakukohde', hakukohde.oid),
  }
}
var koutaHakukohdeAndToteutusToHakukohde = function (
  hakukohde,
  toteutus,
  tarjoajat
) {
  var opetuskielet = []
  toteutus.metadata.opetus.opetuskieliKoodiUrit.forEach(function (
    oppilaitoksenopetuskieliUri
  ) {
    switch (oppilaitoksenopetuskieliUri.split('#')[0]) {
      case 'oppilaitoksenopetuskieli_1':
        opetuskielet.push('kieli_fi')
        break
      case 'oppilaitoksenopetuskieli_2':
        opetuskielet.push('kieli_sv')
        break
      case 'oppilaitoksenopetuskieli_3':
        opetuskielet.push('kieli_fi', 'kieli_sv')
        break
      case 'oppilaitoksenopetuskieli_4':
        opetuskielet.push('kieli_en')
        break
      case 'oppilaitoksenopetuskieli_5':
        opetuskielet.push('kieli_se')
        break
      case 'oppilaitoksenopetuskieli_9':
        opetuskielet.push('kieli_xx')
        break
    }
  })
  return {
    oid: hakukohde.oid,
    nimi: arvoNimiToNimi(hakukohde.nimi),
    tarjoajaOids: [hakukohde.tarjoaja],
    tarjoajaNimi: arvoNimiToNimi(tarjoajat[0].nimi),
    organisaatioRyhmaOids: [],
    opetuskielet: opetuskielet,
    virkailijaUrl: plainUrl('kouta.hakukohde', hakukohde.oid),
    voikoHakukohteessaOllaHarkinnanvaraisestiHakeneita:
      hakukohde.voikoHakukohteessaOllaHarkinnanvaraisestiHakeneita,
  }
}

var app = angular.module('valintalaskenta')
app.factory('KoostettuHakemusAdditionalData', function ($http) {
  return {
    get: function (query) {
      var url = plainUrl(
        'valintalaskentakoostepalvelu.pistesyotto.hakukohde',
        query.hakuOid,
        query.hakukohdeOid
      )
      return $http.get(url).then(function (r) {
        return r.data
      })
    },
    put: function (query, data) {
      var url = plainUrl(
        'valintalaskentakoostepalvelu.pistesyotto.hakukohde',
        query.hakuOid,
        query.hakukohdeOid
      )
      var headers = {}
      if (data.lastmodified) {
        headers = {
          'If-Unmodified-Since': data.lastmodified,
        }
      }
      return $http({
        method: 'PUT',
        url: url,
        headers: headers,
        data: JSON.stringify(data.hakeneet),
      })
    },
  }
})
app.factory('KoostettuHakemusAdditionalDataForHakemus', function ($http) {
  return {
    get: function (query) {
      var url = plainUrl(
        'valintalaskentakoostepalvelu.pistesyotto.hakemus',
        query.hakemusOid
      )
      return $http.get(url, { cache: false }).then(function (r) {
        return r.data
      })
    },
    put: function (query, data) {
      var url = plainUrl(
        'valintalaskentakoostepalvelu.pistesyotto.hakemus',
        query.hakemusOid
      )
      var headers = {}
      if (data.lastmodified) {
        headers = {
          'If-Unmodified-Since': data.lastmodified,
        }
      }
      return $http({
        method: 'PUT',
        url: url,
        headers: headers,
        data: JSON.stringify(data.hakemus),
      })
    },
  }
})

//TARJONTA RESOURCES

app.factory('HaunTiedot', function ($resource, $q) {
  var tarjontaResource = $resource(
    plainUrl('tarjonta-service.haku.hakuoid', ':hakuOid'),
    { hakuOid: '@hakuOid' },
    { get: { method: 'GET', cache: true } }
  )
  var koutaResource = $resource(
    plainUrl('kouta-internal.haku', ':hakuOid'),
    { hakuOid: '@hakuOid' },
    { get: { method: 'GET', cache: true } }
  )
  var ohjausparametritResource = $resource(
    plainUrl('ohjausparametrit-service.parametri', ':hakuOid'),
    { hakuOid: '@hakuOid' },
    { get: { method: 'GET', cache: true } }
  )
  return {
    get: function (params, onSuccess, onError) {
      var tarjontaP = tarjontaResource.get(params).$promise
      var koutaP = koutaResource.get(params).$promise
      var ohjausparametritP = ohjausparametritResource.get(params).$promise
      return {
        $promise: tarjontaP
          .then(function (tarjontaHaku) {
            if (tarjontaHaku.result) {
              return tarjontaHakuToHaku(tarjontaHaku.result)
            }
            return koutaP.then(function (koutaHaku) {
              return ohjausparametritP.then(
                function (ohjausparametrit) {
                  return koutaHakuToHaku(koutaHaku, ohjausparametrit)
                },
                function (response) {
                  if (response.status === 404) {
                    return $q.when(koutaHakuToHaku(koutaHaku, {}))
                  }
                  return response
                }
              )
            })
          })
          .then(onSuccess, onError),
      }
    },
  }
})

app.factory('TarjontaHaku', function ($resource, $q) {
  var tarjontaResource = $resource(
    plainUrl('tarjonta-service.haku.hakukohdetulos', ':hakuOid'),
    {},
    { get: { method: 'GET', cache: true } }
  )
  var koutaResource = $resource(
    plainUrl('kouta-internal.hakukohde.search'),
    {},
    { get: { method: 'GET', isArray: true, cache: false } }
  )
  var organisaatioResource = $resource(
    plainUrl('organisaatio-service.organisaatio', ':oid'),
    {},
    { get: { method: 'GET', cache: false } }
  )
  return {
    get: function (params, onSuccess, onError) {
      var tarjontaP = tarjontaResource
        .get(params)
        .$promise.then(function (result) {
          return {
            tulokset: (result.tulokset || []).map(
              tarjontaHakukohdeTulosToHakukohde
            ),
            kokonaismaara: result.kokonaismaara,
          }
        })
      var koutaParams = { haku: params.hakuOid }
      if (params.searchTerms && params.searchTerms.trim() !== '') {
        koutaParams.q = params.searchTerms
      }
      if (params.organisationOids && params.organisationOids !== '') {
        koutaParams.tarjoaja = params.organisationOids
      }
      koutaResource
        .get(koutaParams)
        .$promise.then(
          function (hakukohteet) {
            return $q
              .all(
                hakukohteet
                  .slice(params.startIndex, params.startIndex + params.count)
                  .map(function (hakukohde) {
                    return $q
                      .all(
                        [hakukohde.tarjoaja].map(function (oid) {
                          return organisaatioResource.get({ oid: oid }).$promise
                        })
                      )
                      .then(function (tarjoajat) {
                        return koutaHakukohdeAndTarjoajatToHakukohde(
                          hakukohde,
                          tarjoajat
                        )
                      })
                  })
              )
              .then(function (sivu) {
                return {
                  tulokset: sivu,
                  kokonaismaara: hakukohteet.length,
                }
              })
          },
          function (error) {
            if (error.status === 404) {
              return tarjontaP
            }
            return error
          }
        )
        .then(onSuccess, onError)
    },
  }
})

app.factory('TarjontaHakukohde', function ($resource, $q) {
  var tarjontaResource = $resource(
    plainUrl('tarjonta-service.hakukohde', ':hakukohdeoid'),
    { hakukohdeoid: '@hakukohdeoid' },
    { get: { method: 'GET', cache: true } }
  )
  var koutaHakukohdeResource = $resource(
    plainUrl('kouta-internal.hakukohde', ':hakukohdeoid'),
    {},
    { get: { method: 'GET', cache: false } }
  )
  var koutaToteutusResource = $resource(
    plainUrl('kouta-internal.toteutus', ':toteutusOid'),
    {},
    { get: { method: 'GET', cache: false } }
  )
  var organisaatioResource = $resource(
    plainUrl('organisaatio-service.organisaatio', ':oid'),
    {},
    { get: { method: 'GET', cache: false } }
  )
  return {
    get: function (params, onSuccess, onError) {
      var tarjontaP = tarjontaResource
        .get(params)
        .$promise.then(function (result) {
          if (result.result) {
            return tarjontaHakukohdeToHakukohde(result.result)
          }
          return null
        })
      var koutaP = koutaHakukohdeResource
        .get(params)
        .$promise.then(function (hakukohde) {
          return koutaToteutusResource
            .get({ toteutusOid: hakukohde.toteutusOid })
            .$promise.then(function (toteutus) {
              return $q
                .all(
                  [hakukohde.tarjoaja].map(function (oid) {
                    return organisaatioResource.get({ oid: oid }).$promise
                  })
                )
                .then(function (tarjoajat) {
                  return koutaHakukohdeAndToteutusToHakukohde(
                    hakukohde,
                    toteutus,
                    tarjoajat
                  )
                })
            })
        })
      return {
        $promise: tarjontaP
          .then(function (tarjontaHakukohde) {
            if (tarjontaHakukohde) {
              return tarjontaHakukohde
            }
            return koutaP
          })
          .then(onSuccess, onError),
      }
    },
  }
})

app.factory('TarjontaHaut', function ($resource, $q) {
  var tarjontaResource = $resource(
    window.url('tarjonta-service.haku.find', {
      addHakukohdes: 'false',
      cache: 'true',
    }),
    { virkailijaTyyppi: '@virkailijaTyyppi' },
    { get: { method: 'GET', cache: true } }
  )
  var koutaResource = $resource(
    window.url('kouta-internal.haku.search'),
    {},
    { get: { method: 'GET', isArray: true, cache: false } }
  )
  var ohjausparametritResource = $resource(
    plainUrl('ohjausparametrit-service.parametri', ':hakuOid'),
    { hakuOid: '@hakuOid' },
    { get: { method: 'GET', cache: true } }
  )
  return {
    get: function (params, onSuccess, onError) {
      var tarjontaP = params.onlyKoutaHaut
        ? $q.when([])
        : tarjontaResource
            .get({ virkailijaTyyppi: params.virkailijaTyyppi })
            .$promise.then(function (tarjontaHaut) {
              return tarjontaHaut.result.map(tarjontaHakuToHaku)
            })
      var koutaP = koutaResource
        .get({ tarjoaja: params.organizationOids.toString() })
        .$promise.then(function (koutaHaut) {
          return $q.all(
            koutaHaut.map(function (koutaHaku) {
              return ohjausparametritResource
                .get({ hakuOid: koutaHaku.oid })
                .$promise.then(
                  function (ohjausparametrit) {
                    return koutaHakuToHaku(koutaHaku, ohjausparametrit)
                  },
                  function (response) {
                    if (response.status === 404) {
                      return $q.when(koutaHakuToHaku(koutaHaku, {}))
                    }
                    return response
                  }
                )
            })
          )
        })
      tarjontaP
        .then(function (tarjontaHaut) {
          return koutaP.then(function (koutaHaut) {
            return tarjontaHaut.concat(koutaHaut)
          })
        })
        .then(onSuccess, onError)
    },
  }
})

// Hakuparametrit
app.factory('Parametrit', function ($resource) {
  return $resource(
    plainUrl('valintalaskentakoostepalvelu.parametrit', ':hakuOid'),
    {},
    {
      list: { method: 'GET', cache: false },
    }
  )
})

app.factory('ValintaTulosProxy', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.proxy.valintatulos.haku.hakemusoid',
      ':hakuOid',
      ':hakemusOid'
    ),
    {},
    {
      list: { method: 'GET', cache: false },
    }
  )
})

app.factory('ViestintapalveluProxy', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.proxy.viestintapalvelu.count.haku',
      ':hakuOid'
    ),
    {},
    {
      list: { method: 'GET', cache: false },
    }
  )
})

app.factory('ViestintapalveluJulkaiseProxy', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.proxy.viestintapalvelu.publish.haku',
      ':hakuOid'
    ),
    {
      asiointikieli: '@asiointikieli',
      kirjeenTyyppi: '@kirjeenTyyppi',
    },
    {
      post: { method: 'POST', cache: false },
    }
  )
})
app.factory('ViestintapalveluEPosti', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.securelinkit.aktivoi'
    ),
    {},
    {
      post: { method: 'POST', cache: false },
    }
  )
})

//Valintalaskenta
app.factory('HakukohdeValinnanvaihe', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.hakukohde.valinnanvaihe',
      ':parentOid'
    ),
    {
      parentOid: '@parentOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
      post: { method: 'POST' },
      insert: { method: 'PUT' },
    }
  )
})

app.factory('HakuVirheet', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.haku',
      ':parentOid',
      ':virhetyyppi'
    ),
    {
      parentOid: '@parentOid',
      virhetyyppi: '@virhetyyppi',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('ValinnanvaiheListByHakukohde', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.hakukohde.valinnanvaihe',
      ':hakukohdeoid',
      { tarjoajaOid: ':tarjoajaOid' }
    ),
    {
      hakukohdeoid: '@hakukohdeoid',
      tarjoajaOid: '@tarjoajaOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
      post: { method: 'POST' },
    }
  )
})

app.factory('Valintatapajono', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.valintatapajono.jarjestyskriteeritulos',
      ':valintatapajonoid'
    ),
    {
      valintatapajonoid: '@valintatapajonoid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('ValintatapajonoListByValinnanvaihe', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.valinnanvaihe.valintatapajono',
      ':valinnanvaiheoid'
    ),
    {
      valinnanvaiheoid: '@valinnanvaiheoid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('HarkinnanvarainenHyvaksynta', function ($resource) {
  return $resource(
    window.url('valintalaskenta-laskenta-service.harkinnanvarainenhyvaksynta'),
    {},
    {
      post: { method: 'POST' },
    }
  )
})
app.factory('HarkinnanvaraisestiHyvaksytyt', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.harkinnanvarainenhyvaksynta.haku.hakukohde',
      ':hakuOid',
      ':hakukohdeOid'
    ),
    {
      hakuOid: '@hakuOid',
      hakukohdeOid: '@hakukohdeOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})
app.factory('HarkinnanvaraisestiHyvaksytty', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.harkinnanvarainenhyvaksynta.haku.hakemus',
      ':hakuOid',
      ':hakemusOid'
    ),
    {
      hakuOid: '@hakuOid',
      hakemusOid: '@hakemusOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('HakukohdeHakijaryhma', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.hakukohde.hakijaryhma',
      ':hakukohdeoid'
    ),
    {
      hakukohdeoid: '@hakukohdeoid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

//valintaperusteet
app.factory('ValinnanvaiheListFromValintaperusteet', function ($resource) {
  return $resource(
    plainUrl(
      'valintaperusteet-service.hakukohde.valinnanvaihe',
      ':hakukohdeoid'
    ),
    {
      hakukohdeoid: '@hakukohdeoid',
    },
    {
      get: {
        method: 'GET',
        isArray: true,
        cache: false,
        params: { withValisijoitteluTieto: true },
      },
    }
  )
})
app.factory('Valintatapajono', function ($resource) {
  return $resource(
    plainUrl('valintaperusteet-service.valintatapajono', ':valintatapajonoOid'),
    {
      valintatapajonoOid: '@valintatapajonoOid',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})
app.factory('ValinnanVaiheetIlmanLaskentaa', function ($resource) {
  return $resource(
    plainUrl(
      'valintaperusteet-service.hakukohde.ilmanlaskentaa',
      ':hakukohdeoid'
    ),
    {
      hakukohdeoid: '@hakukohdeoid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('ValintaperusteetHakukohde', function ($resource) {
  return $resource(
    plainUrl('valintaperusteet-service.hakukohde', ':hakukohdeoid'),
    {
      hakukohdeoid: '@hakukohdeoid',
    },
    {
      get: { method: 'GET', isArray: false, cache: false },
    }
  )
})

app.factory('ValintaperusteetHakukohdeValintaryhma', function ($resource) {
  return $resource(
    plainUrl(
      'valintaperusteet-service.hakukohde.valintaryhma',
      ':hakukohdeoid'
    ),
    {
      hakukohdeoid: '@hakukohdeoid',
    },
    {
      get: { method: 'GET', isArray: false, cache: false },
    }
  )
})

// d
app.factory('DokumenttiProsessinTila', function ($resource) {
  return $resource(
    plainUrl('valintalaskentakoostepalvelu.dokumenttiprosessi', ':id'),
    { id: '@id' },
    {
      lue: { method: 'GET', cache: false },
      ilmoita: { method: 'POST' },
    }
  )
})
//dokumenttipalvelu
app.factory('Dokumenttiprosessi', function (
  $http,
  $log,
  $rootScope,
  $resource,
  $window,
  $interval
) {
  return {
    _timer: undefined,
    aloitaPollaus: function (callback) {
      this.lopetaPollaus()
      this._timer = $interval(function () {
        callback()
      }, 10000)
    },
    lopetaPollaus: function () {
      if (this._timer != undefined) {
        $interval.cancel(this._timer)
      }
    },
  }
})
app.factory('HaeDokumenttipalvelusta', function ($resource) {
  return $resource(
    plainUrl(
      'dokumenttipalvelu-service.dokumentit',
      ':tyyppi',
      ':hakukohdeoid'
    ),
    {
      tyyppi: '@tyyppi',
      hakukohdeoid: '@hakukohdeoid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})
app.factory('Dokumenttipalvelu', function (
  $http,
  $log,
  $rootScope,
  $resource,
  $window,
  Poller
) {
  return {
    _filter: '',
    _p1: null,
    _repeater: function () {
      var self = this
      $rootScope.$apply(function () {
        self._p1 = Poller.poll(
          window.url('dokumenttipalvelu-service.dokumentit.hae')
        )
        self._p1.then(function (data) {
          console.log(data)
        })
      })
    },
    _timer: null,
    paivita: function (callback) {
      $http({
        method: 'GET',
        cache: false,
        url: window.url('dokumenttipalvelu-service.dokumentit.hae'),
      }).success(function (data) {
        callback(data)
      })
    },
    aloitaPollaus: function (callback, filter) {
      this._filter = filter
      this.paivita(callback)
      this._timer = $window.setInterval(this._repeater, 5000)
      $log.info('start polling start' + this._timer)
    },
    lopetaPollaus: function () {
      $window.clearInterval(this._timer)
      $log.info('end polling end' + this._timer)
    },
  }
})

//koostepalvelut
app.factory('ValintalaskentaKokoHaulle', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.valintalaskentakerralla.haku.tyyppi',
      ':hakuoid',
      'HAKU'
    ),
    { hakuoid: '@hakuoid' },
    { aktivoi: { method: 'POST' } }
  )
})

app.factory('ValintalaskentaKerrallaHakukohteille', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.valintalaskentakerralla.haku.tyyppi.whitelist',
      ':hakuoid',
      ':tyyppi',
      ':whitelist'
    ),
    {
      hakuoid: '@hakuoid',
      whitelist: '@whitelist',
      tyyppi: '@tyyppi',
    },
    {
      aktivoi: { method: 'POST' },
    }
  )
})

app.factory('ValintalaskentaKerrallaAktivointi', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.valintalaskentakerralla.haku',
      ':hakuoid'
    ),
    { hakuoid: '@hakuoid' },
    {
      keskeyta: { method: 'DELETE' },
    }
  )
})

app.factory('ValintalaskentaKerrallaUudelleenYrita', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.valintalaskentakerralla.uudelleenyrita',
      ':uuid'
    ),
    { uuid: '@uuid' },
    {
      uudelleenyrita: { method: 'POST' },
    }
  )
})

app.factory('DokumenttiSeurantaPalvelu', function ($resource) {
  return $resource(
    plainUrl('seuranta-service.dokumenttiseuranta', ':uuid'),
    { uuid: '@uuid' },
    { hae: { method: 'GET', isArray: false, cache: false } }
  )
})

app.factory('SeurantaPalvelu', function ($resource) {
  return $resource(
    plainUrl('seuranta-service.seuranta.yhteenveto', ':uuid'),
    { uuid: '@uuid' },
    { hae: { method: 'GET', isArray: false, cache: false } }
  )
})

app.factory('SeurantaPalveluHaunLaskennat', function ($resource) {
  return $resource(
    plainUrl('seuranta-service.seuranta.hae.tyyppi', ':hakuoid', ':tyyppi'),
    { hakuoid: '@hakuoid', tyyppi: '@tyyppi' },
    { hae: { method: 'GET', isArray: true, cache: false } }
  )
})

app.factory('SeurantaPalveluLataa', function ($resource) {
  return $resource(
    plainUrl('seuranta-service.seuranta.lataa', ':uuid'),
    { uuid: '@uuid' },
    { hae: { method: 'GET', isArray: false, cache: false } }
  )
})

app.factory('ValintalaskentaStatus', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.valintalaskentakerralla.status',
      ':uuid'
    ),
    { uuid: '@uuid' },
    { get: { method: 'GET', cache: false } }
  )
})

app.factory('SijoitteluAktivointi', function ($resource) {
  return $resource(
    plainUrl('valintalaskentakoostepalvelu.koostesijoittelu.aktivoi'),
    {},
    {
      aktivoi: { method: 'POST' },
    }
  )
})

app.factory('SijoittelunValvonta', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.koostesijoittelu.status',
      ':hakuoid'
    ),
    { hakuoid: '@hakuoid' },
    { hae: { method: 'GET', cache: false } }
  )
})

app.factory('OsoitetarratSijoittelussaHyvaksytyille', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.osoitetarrat.sijoittelussahyvaksytyille.aktivoi'
    ),
    {},
    { post: { method: 'POST', isArray: false } }
  )
})

app.factory('SijoitteluXls', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.valintalaskentaexcel.sijoitteluntulos.aktivoi'
    ),
    {},
    { post: { method: 'POST', isArray: false } }
  )
})

app.factory('TulosXls', function ($window) {
  return {
    query: function (data) {
      $window.location.href = window.url(
        'valintalaskentakoostepalvelu.valintalaskentaexcel.valintalaskennantulos.aktivoi',
        { hakukohdeOid: data.hakukohdeOid }
      )
    },
  }
})
app.factory('ValintakoeXls', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.valintalaskentaexcel.valintakoekutsut.aktivoi'
    ),
    {},
    { lataa: { method: 'POST' } }
  )
})

app.factory('KoekutsukirjeetEsikatseleSahkopostita', function ($resource) {
  return $resource(
    plainUrl('viestintapalvelu.letter.previewletterbatchemail', ':documentId'),
    { documentId: '@documentId' },
    { put: { method: 'GET', isArray: false, cache: false } }
  )
})
app.factory('KoekutsukirjeetSahkopostita', function ($resource) {
  return $resource(
    plainUrl('viestintapalvelu.letter.emailletterbatch', ':documentId'),
    { documentId: '@documentId' },
    { put: { method: 'POST', isArray: false } }
  )
})
app.factory('AktivoiKelaFtp', function ($resource) {
  return $resource(
    window.url('valintalaskentakoostepalvelu.kela.laheta'),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})

app.factory('KelaDokumentti', function ($resource) {
  return $resource(
    window.url('valintalaskentakoostepalvelu.kela.aktivoi'),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})
app.factory('ErillishakuVienti', function ($resource) {
  return $resource(
    window.url('valintalaskentakoostepalvelu.erillishaku.vienti'),
    {},
    {
      vie: { method: 'POST', isArray: false },
    }
  )
})
app.factory('ErillishakuTuonti', function ($http) {
  return {
    tuo: function (data, config) {
      // Clear applications cache before editing applications
      var cache = $http.defaults.cache
      cache.remove(window.url('haku-app.applications.listfull'))

      return $http.post(
        window.url('valintalaskentakoostepalvelu.erillishaku.tuonti.json'),
        data,
        config || {}
      )
    },
  }
})

app.factory('ErillishakuHyvaksymiskirjeet', function ($resource) {
  return $resource(window.url('valinta-tulos-service.hyvaksymiskirje'), null, {
    get: { method: 'GET', isArray: true, cache: false },
    post: { method: 'POST', isArray: true },
  })
})
app.factory('KayttaaValintalaskentaa', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.valintaperusteet.kayttaavalintalaskentaa',
      ':hakukohdeOid'
    ),
    {
      hakukohdeOid: '@hakukohdeOid',
    },
    {
      get: { method: 'GET', isArray: false, cache: false },
    }
  )
})
app.factory('PistesyottoVienti', function ($resource) {
  return $resource(
    window.url('valintalaskentakoostepalvelu.pistesyotto.vienti'),
    {},
    {
      vie: { method: 'POST', isArray: false },
    }
  )
})
app.factory('ValintatapajonoVienti', function ($resource) {
  return $resource(
    window.url('valintalaskentakoostepalvelu.valintatapajonolaskenta.vienti'),
    {},
    {
      vie: { method: 'POST', isArray: false },
    }
  )
})

app.factory('Koekutsukirjeet', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.koekutsukirjeet.aktivoi'
    ),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})

app.factory('Osoitetarrat', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.osoitetarrat.aktivoi'
    ),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})
app.factory('OsoitetarratHakemuksille', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.osoitetarrat.hakemuksille.aktivoi'
    ),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})

app.factory('HakukohteelleJalkiohjauskirjeet', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.hakukohteessahylatyt.aktivoi'
    ),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})
app.factory('Hyvaksymiskirjeet', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.hyvaksymiskirjeet.aktivoi'
    ),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})

app.factory('SijoittelunTulosOsoitetarrat', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.sijoitteluntuloshaulle.osoitetarrat'
    ),
    {},
    {
      aktivoi: { method: 'POST', isArray: false },
    }
  )
})

app.factory('SijoittelunTulosTaulukkolaskenta', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.sijoitteluntuloshaulle.taulukkolaskennat'
    ),
    {},
    {
      aktivoi: { method: 'POST', isArray: false },
    }
  )
})

app.factory('Jalkiohjauskirjeet', function ($resource) {
  return $resource(
    window.url(
      'valintalaskentakoostepalvelu.viestintapalvelu.jalkiohjauskirjeet.aktivoi'
    ),
    {},
    {
      post: { method: 'POST', isArray: false },
    }
  )
})

app.factory('Kirjepohjat', function ($resource) {
  return $resource(
    plainUrl('viestintapalvelu.template.gethistory', {
      templateName: ':templateName',
      languageCode: ':languageCode',
      oid: ':tarjoajaOid',
      tag: ':tag',
      applicationPeriod: ':hakuOid',
    }),
    {
      templateName: '@templateName',
      languageCode: '@languageCode',
      tarjoajaOid: '@tarjoajaOid',
      tag: '@tag',
      hakuOid: '@hakuOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('Jalkiohjauskirjepohjat', function ($resource) {
  return $resource(
    plainUrl('viestintapalvelu.template.gethistory', {
      templateName: 'jalkiohjauskirje',
      languageCode: ':languageCode',
      tag: ':tag',
      applicationPeriod: ':applicationPeriod',
    }),
    {
      languageCode: '@languageCode',
      tag: '@tag',
      applicationPeriod: '@applicationPeriod',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('JalkiohjauskirjepohjatHuoltajille', function ($resource) {
  return $resource(
    plainUrl('viestintapalvelu.template.gethistory', {
      templateName: 'jalkiohjauskirje_huoltajille',
      languageCode: ':languageCode',
      tag: ':tag',
      applicationPeriod: ':applicationPeriod',
    }),
    {
      languageCode: '@languageCode',
      tag: '@tag',
      applicationPeriod: '@applicationPeriod',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('Hyvaksymiskirjepohjat', function ($resource) {
  return $resource(
    plainUrl('viestintapalvelu.template.gethistory', {
      templateName: 'hyvaksymiskirje',
      languageCode: ':languageCode',
      tag: ':tag',
      applicationPeriod: ':applicationPeriod',
    }),
    {
      languageCode: '@languageCode',
      tag: '@tag',
      applicationPeriod: '@applicationPeriod',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('HyvaksymiskirjepohjatHuoltajille', function ($resource) {
  return $resource(
    plainUrl('viestintapalvelu.template.gethistory', {
      templateName: 'hyvaksymiskirje_huoltajille',
      languageCode: ':languageCode',
      tag: ':tag',
      applicationPeriod: ':applicationPeriod',
    }),
    {
      languageCode: '@languageCode',
      tag: '@tag',
      applicationPeriod: '@applicationPeriod',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('Hakemus', function ($resource) {
  return $resource(
    plainUrl('haku-app.applications.oid', ':oid'),
    { oid: '@oid', appState: ['ACTIVE', 'INCOMPLETE'] },
    { get: { method: 'GET', cache: false } }
  )
})

app.factory('HakemusEligibilities', function ($resource) {
  return $resource(
    plainUrl(
      'haku-app.applications.eligibilities',
      ':hakuOid',
      ':hakukohdeOid'
    ),
    {
      hakuOid: '@hakuOid',
      hakukohdeOid: '@hakukohdeOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})
app.factory('HakukohdeHenkilot', function ($resource) {
  return $resource(
    window.url('haku-app.applications'),
    {
      aoOid: '@aoOid',
      asId: '@asId',
      appState: ['ACTIVE', 'INCOMPLETE'],
      rows: 100000,
    },
    {
      get: { method: 'GET', isArray: false, cache: true },
    }
  )
})

app.factory('HakukohdeHenkilotFull', function ($resource) {
  var headers = { 'Cache-Control': 'no-cache, no-store' }
  return $resource(
    window.url('haku-app.applications.listfull'),
    {
      aoOid: '@aoOid',
      asId: '@asId',
      appState: ['ACTIVE', 'INCOMPLETE'],
      rows: 100000,
    },
    {
      get: { method: 'GET', isArray: true, cache: true, headers: headers },
    }
  )
})

app.factory('HarkinnanvaraisetHakemukset', function ($resource) {
  return $resource(
    window.url('valintalaskentakoostepalvelu.harkinnanvaraisuus'),
    {},
    {
      post: { method: 'POST', isArray: true },
    }
  )
})

app.factory('AtaruApplications', function ($resource) {
  return $resource(
    window.url('ataru.applications'),
    {
      hakuOid: '@hakuOid',
      hakukohdeOid: '@hakukohdeOid',
      hakemusOids: '@hakemusOids',
      name: '@name',
    },
    {
      get: { method: 'GET', isArray: true, cache: true },
    }
  )
})

app.factory('Henkilot', function ($resource) {
  return $resource(
    window.url('haku-app.applications'),
    {
      appState: ['ACTIVE', 'INCOMPLETE'],
      rows: 100000,
    },
    {
      query: { method: 'GET', isArray: false, cache: true },
    }
  )
})

app.factory('HakemusKey', function ($resource) {
  return $resource(
    window.url('haku-app.application.oid.key'),
    {
      oid: '@oid',
      key: '@key',
      value: '@value',
    },
    {
      get: { method: 'GET', isArray: false, cache: false },
      put: { method: 'PUT', isArray: false },
    }
  )
})

//Sijoittelu
app.factory('HakemuksenValintatulokset', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.proxy.valintatulosservice.hakemus.haku.hakukohde.valintatapajono',
      ':hakemusOid',
      ':hakuOid',
      ':hakukohdeOid',
      ':valintatapajonoOid'
    ),
    {
      hakemusOid: '@hakemusOid',
      hakuOid: '@hakuOid',
      hakukohdeOid: '@hakukohdeoid',
      valintatapajonoOid: '@valintatapajonoOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('HenkilotByOid', function ($resource) {
  return $resource(
    window.url('haku-app.applications.list'),
    { rows: 100000 },
    { hae: { method: 'POST', isArray: true } }
  )
})

app.factory('ValintaesityksenHyvaksyminen', function ($resource) {
  return $resource(
    plainUrl(
      'sijoittelu-service.tila.haku.hakukohde.valintatapajono.valintaesitys',
      ':hakuOid',
      ':hakukohdeOid',
      ':hyvaksyttyJonoOid',
      {
        selite: ':selite',
        hyvaksytty: 'true',
      }
    ),
    {
      hakuOid: '@hakuOid',
      hakukohdeOid: '@hakukohdeOid',
      selite: '@selite',
      valintatapajonoOid: '@hyvaksyttyJonoOid',
    },
    {
      post: { method: 'POST' },
    }
  )
})

app.service('Valintaesitys', [
  '$http',
  function ($http) {
    this.findByHakukohde = function (hakukohdeOid) {
      return $http.get(
        window.url('valinta-tulos-service.valintaesitys', {
          hakukohdeOid: hakukohdeOid,
        })
      )
    }
    this.hyvaksy = function (valintatapajonoOid) {
      return $http.post(
        window.url(
          'valinta-tulos-service.valintaesitys.hyvaksytty',
          valintatapajonoOid
        ),
        {}
      )
    }
  },
])

app.factory('HakemuksenVastaanottoTila', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.proxy.valintatulosservice.hakemus.haku.hakukohde.valintatapajono',
      ':hakemusOid',
      ':hakuOid',
      ':hakukohdeOid',
      ':valintatapajonoOid'
    ),
    {
      hakuOid: '@hakuOid',
      hakukohdeOid: '@hakukohdeOid',
      valintatapajonoOid: '@valintatapajonoOid',
      hakemusOid: '@hakemusOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('SijoittelunVastaanottotilat', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.proxy.valintatulosservice.hakemus.haku',
      ':hakemusOid',
      ':hakuOid'
    ),
    {
      hakuoid: '@hakuoid',
      hakemusOid: '@hakemusOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('Sijoittelu', function ($resource) {
  return $resource(
    plainUrl('sijoittelu-service.sijoittelu', ':hakuOid'),
    { hakuOid: '@hakuOid' },
    { get: { method: 'GET', cache: false } }
  )
})

app.factory('VtsSijoitteluAjoPerustiedot', function ($resource) {
  return $resource(
    plainUrl(
      'valinta-tulos-service.sijoittelu.sijoitteluajo.perustiedot',
      ':hakuOid',
      ':sijoitteluajoOid'
    ),
    {
      hakuOid: '@hakuOid',
      sijoitteluajoOid: '@sijoitteluajoOid',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('VtsLatestSijoittelunTilat', function ($resource) {
  return $resource(
    plainUrl(
      'valinta-tulos-service.sijoittelu.sijoitteluajo.hakemus',
      ':hakuOid',
      'latest',
      ':hakemusOid'
    ),
    {
      hakemusOid: '@hakemusOid',
      hakuOid: '@hakuOid',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('VtsSijoittelunTulos', function ($resource) {
  return $resource(
    plainUrl(
      'valinta-tulos-service.sijoitteluntulos',
      ':hakuOid',
      'latest',
      ':hakukohdeOid'
    ),
    {
      hakukohdeOid: '@hakukohdeOid',
      hakuOid: '@hakuOid',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('VtsVastaanottopostiLahetetty', function ($resource) {
  return $resource(
    plainUrl('valinta-tulos-service.vastaanottoposti.lahetetty', {
      hakukohdeOid: ':hakukohdeOid',
    }),
    {
      hakukohdeOid: '@hakukohdeOid',
    },
    {
      get: { method: 'GET', cache: false, isArray: true },
    }
  )
})

app.factory('VtsVastaanottopostiLahetaUudelleenHakemukselle', function (
  $resource
) {
  return $resource(
    plainUrl(
      'valinta-tulos-service.vastaanottoposti.laheta.uudelleen.hakemukselle',
      ':hakemusOid'
    ),
    {
      hakemusOid: '@hakemusOid',
    },
    {
      post: { method: 'POST', isArray: true, cache: false },
    }
  )
})

app.factory('VtsVastaanottopostiLahetaUudelleenJonolle', function ($resource) {
  return $resource(
    plainUrl(
      'valinta-tulos-service.vastaanottoposti.laheta.uudelleen.jonolle',
      ':hakukohdeOid',
      ':jonoOid'
    ),
    {
      hakukohdeOid: '@hakukohdeOid',
      jonoOid: '@jonoOid',
    },
    {
      post: { method: 'POST', isArray: true, cache: false },
    }
  )
})

app.factory('VtsVastaanottopostiLahetaUudelleenHakukohteelle', function (
  $resource
) {
  return $resource(
    plainUrl(
      'valinta-tulos-service.vastaanottoposti.laheta.uudelleen.hakukohteelle',
      ':hakukohdeOid'
    ),
    {
      hakukohdeOid: '@hakukohdeOid',
    },
    {
      post: { method: 'POST', isArray: true, cache: false },
    }
  )
})

app.factory('VtsLatestSijoitteluajoHakukohde', function ($resource) {
  return $resource(
    plainUrl(
      'valinta-tulos-service.sijoittelu.sijoitteluajo.hakukohde',
      ':hakuOid',
      'latest',
      ':hakukohdeOid'
    ),
    {
      hakukohdeOid: '@hakukohdeOid',
      hakuOid: '@hakuOid',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('VtsValinnantuloksetHakemukselle', function ($resource) {
  return $resource(
    plainUrl('valinta-tulos-service.valinnantulos.hakemus', ':hakemusOid'),
    {
      hakemusOid: '@hakemusOid',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('ErillisHakuSijoitteluajoHakukohde', function ($resource) {
  return $resource(
    plainUrl(
      'sijoittelu-service.erillissijoittelu.sijoitteluajo.hakukohde',
      ':hakuOid',
      ':sijoitteluajoId',
      ':hakukohdeOid'
    ),
    {
      hakukohdeOid: '@hakukohdeOid',
      hakuOid: '@hakuOid',
      sijoitteluajoId: '@sijoitteluajoId',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('Valintatulos', function ($resource) {
  return $resource(
    plainUrl(
      'sijoittelu-service.sijoittelu.sijoitteluajo.hakemukset',
      ':hakuOid',
      'latest'
    ),
    { hakuOid: '@hakuOid' },
    { get: { method: 'GET', cache: false } }
  )
})

// Valintakoetulokset
app.factory('Valintakoetulokset', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.valintakoe.hakutoive',
      ':hakukohdeoid'
    ),
    {
      hakukohdeoid: '@hakukohdeoid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('Valintakoe', function ($resource) {
  return $resource(
    plainUrl('valintaperusteet-service.valintakoe', ':valintakoeOid'),
    {
      valintakoeOid: '@valintakoeOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})
app.factory('HakukohdeValintakoe', function ($resource) {
  return $resource(
    plainUrl('valintaperusteet-service.hakukohde.valintakoe', ':hakukohdeOid'),
    {
      hakukohdeOid: '@hakukohdeOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('ValintakoetuloksetHakemuksittain', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.valintakoe.hakemus',
      ':hakemusOid'
    ),
    {
      hakemusOid: '@hakemusOid',
    },
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('HakukohdeAvaimet', function ($resource) {
  return $resource(
    plainUrl('valintaperusteet-service.hakukohde.avaimet', ':hakukohdeOid'),
    {
      hakukohdeOid: '@hakukohdeOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('ValintalaskentaHistoria', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.jonosijahistoria',
      ':valintatapajonoOid',
      ':hakemusOid'
    ),
    {
      valintatapajonoOid: '@valintatapajonoOid',
      hakemusOid: '@hakemusOid',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})
app.factory('ValintalaskentaHakemus', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.hakemus',
      ':hakuoid',
      ':hakemusoid'
    ),
    {
      hakuoid: '@hakuoid',
      hakemusoid: '@hakemusoid',
    },
    {
      get: { method: 'GET', isArray: false, cache: false },
    }
  )
})
app.factory('MyRoles', function ($resource) {
  return $resource(
    window.url('cas.myroles'),
    {},
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('JatkuvaSijoittelu', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskentakoostepalvelu.koostesijoittelu.jatkuva',
      ':method'
    ),
    {},
    {
      get: { method: 'GET', cache: false },
    }
  )
})

app.factory('JarjestyskriteeriMuokattuJonosija', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.valintatapajono.jonosija',
      ':valintatapajonoOid',
      ':hakemusOid',
      ':jarjestyskriteeriprioriteetti'
    ),
    {
      valintatapajonoOid: '@valintatapajonoOid',
      hakemusOid: '@hakemusOid',
      jarjestyskriteeriprioriteetti: '@jarjestyskriteeriprioriteetti',
    },
    {
      post: { method: 'POST' },
      remove: { method: 'DELETE' },
    }
  )
})

app.factory('ValintatapajonoSijoitteluUpdate', function ($resource) {
  return $resource(
    plainUrl(
      'valintaperusteet-service.valintatapajono.update',
      ':valintatapajonoOid',
      { status: ':status' }
    ),
    {
      valintatapajonoOid: '@valintatapajonoOid',
      status: '@status',
    },
    {
      post: { method: 'POST' },
    }
  )
})

app.factory('ValintatapajonoSijoitteluStatus', function ($resource) {
  return $resource(
    plainUrl(
      'valintalaskenta-laskenta-service.valintatapajono.valmissijoiteltavaksi',
      ':valintatapajonoOid',
      { status: ':status' }
    ),
    {
      valintatapajonoOid: '@valintatapajonoOid',
      status: '@status',
    },
    {
      put: { method: 'put' },
    }
  )
})

//Valintaryhma
app.factory('ValintaryhmatJaHakukohteet', function ($resource) {
  return $resource(
    window.url('valintaperusteet-service.puu'),
    {
      q: '@q',
      hakuOid: '@hakuOid',
      tila: '@tila',
      kohdejoukko: '@kohdejoukko',
    },
    {
      get: { method: 'GET', isArray: true, cache: false },
    }
  )
})

app.factory('OrganizationByOid', function ($resource) {
  return $resource(
    plainUrl('organisaatio-service.organisaatio', ':oid'),
    { oid: '@oid' },
    { get: { method: 'GET', cache: true } }
  )
})

app.factory('OrganizationHierarchy', function ($resource) {
  return $resource(
    plainUrl('organisaatio-service.organisaatio.hierarkia.hae', {
      aktiiviset: 'true',
      suunnitellut: 'true',
      lakkautetut: 'false',
      oid: ':oid',
    }),
    { oid: '@oid' },
    { get: { method: 'GET', cache: true } }
  )
})

angular
  .module('valintalaskenta')

  .factory('HakujenHakutyypit', [
    '$resource',
    function ($resource) {
      return $resource(
        window.url('koodisto-service.codeelement.codes.hakutyyppi', 1)
      )
    },
  ])

  .factory('HakujenKohdejoukot', [
    '$resource',
    function ($resource) {
      return $resource(
        window.url('koodisto-service.codeelement.codes.haunkohdejoukko', 1)
      )
    },
  ])

  .factory('HakujenHakutavat', [
    '$resource',
    function ($resource) {
      return $resource(
        window.url('koodisto-service.codeelement.codes.hakutapa', 1)
      )
    },
  ])

  .factory('HakujenHakukaudet', [
    '$resource',
    function ($resource) {
      return $resource(
        window.url('koodisto-service.codeelement.codes.kausi', 1)
      )
    },
  ])

  .factory('Pohjakoulutukset', [
    '$resource',
    function ($resource) {
      return $resource(
        window.url('koodisto-service.codeelement.codes.pohjakoulutus', 1)
      )
    },
  ])

  .factory('EhdollisenHyvaksymisenEhdot', [
    '$resource',
    function ($resource) {
      return $resource(
        window.url(
          'koodisto-service.codeelement.codes.ehdollisenHyvaksymisenEhto',
          1
        )
      )
    },
  ])

  .factory('HakukohteenNimi', [
    '$resource',
    function ($resource) {
      return $resource(
        plainUrl('koodisto-service.hakukohdenimi', ':hakukohdeoid'),
        { hakukohdeoid: '@hakukohdeoid' }
      )
    },
  ])

  .factory('HakukohdeKoodistoNimi', [
    '$resource',
    function ($resource) {
      return $resource(
        plainUrl(
          'koodisto-service.json.hakukohteet.koodi',
          ':hakukohteenNimiUri'
        ),
        { hakukohteenNimiUri: '@hakukohteenNimiUri' }
      )
    },
  ])

  .factory('Ohjausparametrit', [
    '$resource',
    function ($resource) {
      return $resource(
        plainUrl('ohjausparametrit-service.parametri', ':hakuOid'),
        { hakuOid: '@hakuOid' }
      )
    },
  ])
