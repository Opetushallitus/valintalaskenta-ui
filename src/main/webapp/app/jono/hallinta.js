angular
  .module('valintalaskenta.jononhallinta', ['ui.bootstrap'])
  .constant("JOB_STATES", {
    RUNNING: "MENEILLAAN",
    QUEUEING: "ALOITTAMATTA",
    CANCELLED: "PERUUTETTU",
    COMPLETED: "VALMIS",
    REMOVING: "POISTETAAN"
  })
  // Maximum number of SSE subscriptions
  .constant("SSE", {
    MAX_CONNECTIONS: 3
  })
  .filter('timeFromNow', function() {
    return function(input) {
        return moment(new Date(input).toISOString()).fromNow();
    };
  })
  .controller('DashboardController',
             ['$http', '$scope', '$interval', '$window', 'JOB_STATES', 'SSE', 'uibButtonConfig', 'seurantaservice',
      function($http,   $scope,   $interval,   $window,   JOB_STATES,   SSE,   uibButtonConfig,   seurantaservice) {
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
      seurantaservice.removeJob(job)
        .then(function() {
          updateJobSubscriptions();
        })
        .catch(function(err) {
          console.log("Removing job from queue failed: ", err);
        });
    };
    $scope.fetchSummaryXLS = function(job) {
      $window.open(VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintalaskentakerralla/status/" + job.uuid + "/xls");
    };
    $scope.stateToHumanReadable = function(job) {
      var state = job.tila;
      if (state === JOB_STATES.CANCELLED || job.hakukohteitaKeskeytetty > 0) {
        return 'Keskeytynyt';
      } else if (state === JOB_STATES.COMPLETED) {
        return 'Valmis';
      } else if (state === JOB_STATES.QUEUEING) {
        return 'Jonossa';
      } else if (state === JOB_STATES.RUNNING) {
        return 'Käynnistetty';
      } else if (state === JOB_STATES.REMOVING) {
        return 'Poistetaan';
      } else {
        return '???';
      }
    };
    $scope.typeToHumanReadable = function(job) {
      switch(job.tyyppi) {
        case "VALINTARYHMA" : return "Valintaryhmä";
        case "HAKU" : return "Haku";
        case "HAKUKOHDE" : return "Hakukohde";
        default: return "";
      }
    };
    $scope.calculateProgressPercent = function(job) {
      var percent = job.hakukohteitaValmiina / job.hakukohteitaYhteensa * 100;
      return Math.round(percent);
    };
    $scope.progressBarType = function(job) {
      var state = job.tila;
      if (state === JOB_STATES.CANCELLED || job.hakukohteitaKeskeytetty > 0) {
        return 'cancelled';
      } else if (state === JOB_STATES.COMPLETED) {
        return 'info';
      } else {
        return 'default';
      }
    };

    $scope.userCache = {};

    var updateJobList = function() {
      var categoryOrder = function(cat) {
        var state = cat.tila;
        if (state === JOB_STATES.RUNNING) {
          return 1;
        } else if (state === JOB_STATES.QUEUEING) {
          return 2;
        } else if (state === JOB_STATES.CANCELLED) {
          return 3;
        } else if (state === JOB_STATES.COMPLETED) {
          return 4;
        } else {
          return 5;
        }
      };

      var compare = function(a, b) {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
      };

      seurantaservice.getJobs()
        .then(function(jobs) {
          $scope.jobs = jobs.sort(function(a, b) {
            var rval = compare(categoryOrder(a), categoryOrder(b));
            if (rval === 0) {
              if (!_.isEmpty(a.jonosija) && !_.isEmpty(b.jonosija)) {
                return compare(a.jonosija, b.jonosija);
              } else {
                return compare(b.luotu, a.luotu);
              }
            } else {
              return rval;
            }
          });
          _($scope.jobs).forEach(function(job) {
              queryUserByOid(job, job.userOID);
          });
          updateJobSubscriptions();
        });
    };

    updateJobList();

    var updateJobSubscriptions = function() {
      $scope.jobsByState = _.groupBy($scope.jobs, 'tila');

      // Add new running jobs to tracked jobs
      _($scope.jobsByState[JOB_STATES.RUNNING]).forEach(function(job) {
        if (! (job.uuid in $scope.sseTrackedJobs) && _.size($scope.sseTrackedJobs) < SSE.MAX_CONNECTIONS){
          setUpTrackedJob(job.uuid)
        }
      });

      // Remove completed / cancelled jobs from tracked jobs
      _.forEach($scope.sseTrackedJobs, function(eventSource, key) {
        var defaultObject =  {};
        defaultObject[JOB_STATES.RUNNING] = []
        if (! (_.contains(_.defaults($scope.jobsByState, defaultObject)[JOB_STATES.RUNNING].map(function(o) { return o.uuid; }), key))) {
          tearDownTrackedJob(key);
        }
      });
    };

    var queryUserByOid = function(job, userOID) {
      if (angular.isDefined($scope.userCache[userOID])) {
        return;
      }

      $scope.userCache[userOID] = '???';

      if (_.isEmpty(userOID)) {
        return;
      }

      seurantaservice.queryUsernameByOid(userOID).then(function(res) {
         $scope.userCache[userOID] = _.defaults(res.kayttajatiedot, {username: '???'}).username || '???';
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
