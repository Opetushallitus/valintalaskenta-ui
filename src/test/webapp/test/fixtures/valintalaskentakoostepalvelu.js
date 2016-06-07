var defaultParametritFixtures = {
  valintalaskenta: true,
  pistesyotto: true,
  hakeneet: true,
  valinnanhallinta: true,
  harkinnanvaraiset: true,
  valintakoekutsut: true,
  hakijaryhmat: true,
  koetulostentallennus: false,
  koekutsujenmuodostaminen: false
}

function parametritFixtures() {
    var httpBackend = testFrame().httpBackend;
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/parametrit\/.*/).respond(defaultParametritFixtures);
}
function parametritFixturesWithOverrides(overrides) {
  var withOverrides = _.extend({}, defaultParametritFixtures, overrides)
  return function () {
    var httpBackend = testFrame().httpBackend;
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/parametrit\/.*/).respond(withOverrides);
  }
}
