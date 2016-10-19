angular
  .module('valintalaskenta.jononhallinta')
  .factory('seurantaservice', seurantaservice);

seurantaservice.$inject = ['$http', 'CacheFactory'];
function seurantaservice($http, CacheFactory) {
  if (!CacheFactory.get('userCache')) {
    CacheFactory.createCache('userCache', {
      deleteOnExpire: 'aggressive',
      recycleFreq: 60000
    });
  }
  return {
    getJobs: getJobs,
    queryUsernameByOid: queryUsernameByOid,
    removeJob: removeJob,
    getMyInfo: getMyInfo
  };

  function getJobs() {
    return $http.get(window.url("seuranta-service.seuranta.yhteenvetokaikillelaskennoille"))
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log('failed to get job summaries from seuranta-service');
      });
  }

  function removeJob(job) {
    return $http.delete(
        window.url("valintalaskentakoostepalvelu.valintatapajonolaskenta.tuonti.haku.hakukohde.valintatapajono", job.uuid),
        {params: {lopetaVainJonossaOlevaLaskenta: true}}
    ).then(function() {
      job.tila = JOB_STATES.CANCELLED;
    });
  }

  function queryUsernameByOid(userOID) {
    var userCache = CacheFactory.get('userCache');
    return $http.get(window.url("authentication-service.henkilo", userOID), {cache: userCache})
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log('failed to get username from henkilo-service: ' + userOID);
      });
  }

  function getMyInfo() {
    var userCache = CacheFactory.get('userCache');
    return $http.get(window.url("cas.me"), {cache: userCache})
      .then(function (response) {
        return response.data;
      }, function () {
        console.log('failed to get user info from CAS')
      });
  }
};

