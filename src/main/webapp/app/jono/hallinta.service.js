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
    return $http.get(SEURANTA_URL_BASE + '/seuranta/yhteenvetokaikillelaskennoille')
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log('failed to get job summaries from seuranta-service');
      });
  }

  function removeJob(job) {
    return $http.delete(VALINTALASKENTAKOOSTE_URL_BASE + 'resources/valintalaskentakerralla/haku/' + job.uuid, {params: {lopetaVainJonossaOlevaLaskenta: true}})
      .then(function() {
        job.tila = JOB_STATES.CANCELLED;
      });
  }

  function queryUsernameByOid(userOID) {
    var userCache = CacheFactory.get('userCache');
    return $http.get(AUTHENTICATION_HENKILO_URL_BASE + '/resources/henkilo/' + userOID, {cache: userCache})
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log('failed to get username from henkilo-service: ' + userOID);
      });
  }

  function getMyInfo() {
    var userCache = CacheFactory.get('userCache');
    return $http.get(CAS_ME_URL, {cache: userCache})
      .then(function (response) {
        return response.data;
      }, function () {
        console.log('failed to get user info from CAS')
      });
  }
};

