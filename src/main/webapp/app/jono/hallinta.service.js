angular
  .module('valintalaskenta.jononhallinta')
  .factory('seurantaservice', seurantaservice);

seurantaservice.$inject = ['$http'];
function seurantaservice($http) {
  return {
    getJobs: getJobs,
    queryUsernameByOid: queryUsernameByOid,
    removeJob: removeJob

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
    return $http.get(AUTHENTICATION_HENKILO_URL_BASE + '/resources/henkilo/' + userOID)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log('failed to get username from henkilo-service: ' + userOID);
      });
  }
};

