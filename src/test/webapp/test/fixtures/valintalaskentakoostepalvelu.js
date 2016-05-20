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
  var withOverrides = {};
  for (var attrname in defaultParametritFixtures) { withOverrides[attrname] = defaultParametritFixtures[attrname]; }
  for (var attrname in overrides) { withOverrides[attrname] = overrides[attrname]; }
  return function () {
    var httpBackend = testFrame().httpBackend;
    httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/parametrit\/.*/).respond(withOverrides);
  }
}
