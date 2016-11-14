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

function kirjeFixtures() {
  var httpBackend = testFrame().httpBackend;
  httpBackend.when('GET', /.*\/valintalaskentakoostepalvelu\/resources\/proxy\/viestintapalvelu\/count\/.*/).respond({
    "hyvaksymiskirje": {
      "fi":{"letterBatchId":264,"letterTotalCount":1,"letterReadyCount":1,"letterErrorCount":0,"letterPublishedCount":1,"readyForPublish":false,"readyForEPosti":true},
      "sv":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false},
      "en":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false}
    },
    "jalkiohjauskirje":{
      "fi":{"letterBatchId":186,"letterTotalCount":4,"letterReadyCount":4,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":true},
      "sv":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false},
      "en":{"letterBatchId":null,"letterTotalCount":0,"letterReadyCount":0,"letterErrorCount":0,"letterPublishedCount":0,"readyForPublish":false,"readyForEPosti":false}
    }
  });
}
