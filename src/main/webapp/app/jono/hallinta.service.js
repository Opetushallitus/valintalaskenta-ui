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
    return $http.get('/seuranta-service/resources/seuranta/yhteenvetokaikillelaskennoille')
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log('failed to get job summaries from seuranta-service');
      });
  }

  function removeJob(job) {
    return $http.delete('/valintalaskentakerralla/haku/' + job.uuid, {params: {lopetaVainJonossaOlevaLaskenta: true}})
      .then(function() {
        job.tila = JOB_STATES.CANCELLED;
      });
  }

  function queryUsernameByOid(userOID) {
    return $http.get('/authentication-service/resources/henkilo/' + userOID)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log('failed to get username from henkilo-service: ' + userOID);
      });
  }
};

