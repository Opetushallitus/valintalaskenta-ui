angular.module('valintalaskenta-jononhallinta', ['ngResource', 'ui.bootstrap'])
  .constant("JOB_STATES", {
    RUNNING: "MENEILLAAN",
    QUEUEING: "ALOITTAMATTA",
    CANCELLED: "PERUUTETTU",
    COMPLETED: "VALMIS",
    REMOVING: "POISTETAAN"
  })
  .filter('timeFromNow', function() {
    return function(input) {
        return moment(new Date(input).toISOString()).fromNow();
    };
  })
  .controller('DashboardController',
             ['$http', '$scope', '$interval', 'JOB_STATES', 'uibButtonConfig',
      function($http,   $scope,   $interval,   JOB_STATES,   uibButtonConfig) {
    // Set moment library locatlization
    moment.locale('fi');
    // CSS class for angular-ui buttons(checkbox'ish)
    uibButtonConfig.activeClass = "active";

    $scope.stateFilters = {};
    $scope.stateFilters[JOB_STATES.RUNNING] = true;
    $scope.stateFilters[JOB_STATES.CANCELLED] = true;
    $scope.stateFilters[JOB_STATES.QUEUEING] = true;
    $scope.stateFilters[JOB_STATES.COMPLETED] = true;
    $scope.stateFilters[JOB_STATES.REMOVING] = true;

    // Jobs being processed are subscribed to SSE endpoint for a soft real-time updates
    $scope.sseTrackedJobs = {};

    $scope.isShown = function(elem, idx, arr) {
      return $scope.stateFilters[elem.tila];
    };

    $scope.removeJob = function(job) {
      var origState = job.tila;
      job.tila = JOB_STATES.REMOVING;
      updateJobSubscriptions();
      $http.delete('/valintalaskentakerralla/haku/' + job.uuid, {params: {lopetaVainJonossaOlevaLaskenta: true}}).then(
        function(res) {
          job.tila = JOB_STATES.CANCELLED;
          updateJobSubscriptions();
        }, function(err) {
          console.log("Removing job from queue failed: ", err);
      });
    };

    $scope.userCache = {};


    var updateJobList = function() {
      $http.get('/data.json').then(function(res) {
        $scope.jobs = res.data;
        _($scope.jobs).forEach(function(job) {
            queryUserByOid(job, job.userOid);
        });
        updateJobSubscriptions();
      });
    };

    updateJobList();

    var updateJobSubscriptions = function() {
      $scope.jobsByState = _.groupBy($scope.jobs, 'tila');
      // Add new running jobs to tracked jobs
      _($scope.jobsByState[JOB_STATES.RUNNING]).forEach(function(job) {
        if (! (job.uuid in $scope.sseTrackedJobs)) {
          setUpTrackedJob(job.uuid)
        }
      });
      // Remove completed / cancelled jobs from tracked jobs
      _.forEach($scope.sseTrackedJobs, function(eventSource, key) {
        var defaultObject =  {};
        defaultObject[JOB_STATES.RUNNING] = []
        if (! (_.contains(
                _.defaults($scope.jobsByState, defaultObject)[JOB_STATES.RUNNING].map(function(o) { return o.uuid; }),
                key))) {
          tearDownTrackedJob(key);
        }
      });
    };

    var queryUserByOid = function(job, userOID) {
      if (angular.isDefined($scope.userCache[userOID])) {
        return;
      }
      $scope.userCache[userOID] = '???';
      $http.get('/authentication-service/resources/henkilo/' + userOID).then(function(res) {
         $scope.userCache[userOID] = _.defaults(res.kayttajatiedot, {username: '???'}).username;
      }, function(err) {
         $scope.userCache[userOID] = '???';
      });
    };

    var setUpTrackedJob = function(jobId) {
      var handleCallback = function(rawMsg) {
        $scope.$apply(function() {
          var msg = JSON.parse(rawMsg.data);
          var job = _.head(_($scope.jobs).filter(function(o) {return  o.uuid === jobId}));
          if (job) {
            job.hakukohteitaYhteensa = msg.hakukohteitaYhteensa;
            job.hakukohteitaValmiina = msg.hakukohteitaValmiina;
            job.hakukohteitaKeskeytetty = msg.hakukohteitaKeskeytetty;
            job.tila = msg.tila;
          }
        });
      };

      var source = new EventSource('/seuranta-service/resources/seuranta/yhteenveto/'+ jobId + '/sse');

      source.addEventListener('message', handleCallback, false);
      source.onerror = function(e) {
        console.log("EventSource subscription failed for job " + jobId);
        console.log(e);
      };
      $scope.sseTrackedJobs[jobId] = source;
    };

    var tearDownTrackedJob = function(uuid) {
      $scope.sseTrackedJobs[uuid].close();
      delete $scope.sseTrackedJobs[uuid];
    };

    // Setup controller to refresh jobs once in every ten seconds and stop
    // polling on controller destroy
    var stop;
    $scope.startPolling = function() {
      if (angular.isDefined(stop)) {
        return;
      }
      stop = $interval(function() {
        updateJobList();
      }, 10000);
    };

    $scope.stopPolling = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

    $scope.$on('$destroy', function() {
      $scope.stopPolling();
    });

    $scope.startPolling();
}]);
