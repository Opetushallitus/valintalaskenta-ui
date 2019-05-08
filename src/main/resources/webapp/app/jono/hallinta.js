angular
  .module('valintalaskenta.jononhallinta', ['ui.bootstrap', 'angular-cache', 'ngCookies'])
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
  .config(function(CacheFactoryProvider) {
    angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
  })
  .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push(function ($cookies) {
          return {
              request: function (config) {
                  config.headers['clientSubSystemCode'] = "valintaperusteet.valintalaskenta-ui.valintalaskenta.jononhallinta";

                  var csrfToken = $cookies.get('CSRF');
                  if (csrfToken) {
                      config.headers['CSRF'] = csrfToken;
                      console.debug("CSRF header '%s' set", csrfToken);
                  }

                  return config;
              }
          }
      })
  }])
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
    $scope.stateFilters[JOB_STATES.RUNNING] = false;
    $scope.stateFilters[JOB_STATES.CANCELLED] = false;
    $scope.stateFilters[JOB_STATES.QUEUEING] = false;
    $scope.stateFilters[JOB_STATES.COMPLETED] = false;
    $scope.stateFilters[JOB_STATES.REMOVING] = false;
    $scope.usernamesByOid = {}; //Kerätään tänne session aikana kysellyt käyttäjien nimitiedot, voidaan olettaa etteivät ne
        //seurantakälin käyttäjän näkökulmasta muutu. Kysely vain kerran/oid/sessio.

    // Jobs being processed are subscribed to SSE endpoint for a soft real-time updates
    $scope.sseTrackedJobs = {};

    $scope.getHenkiloUrl = function(oid) {
      return $window.url('henkilo-ui.henkilo', oid);
    };

    $scope.isShown = function(elem, idx, arr) {
      return $scope.stateFilters[elem.tila] || _.every($scope.stateFilters, function(state) {return !state});
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
      $window.open(window.url("valintalaskentakoostepalvelu.valitalaskentakerralla.status.xls", job.uuid));
    };
    $scope.stateToHumanReadable = function(job) {
      var state = job.tila;
      if (state === JOB_STATES.CANCELLED) {
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
    $scope.calculateProgressPercent = function(job) {
      var percent = job.hakukohteitaValmiina / job.hakukohteitaYhteensa * 100;
      return Math.round(percent);
    };
    $scope.progressBarType = function(job) {
      var state = job.tila;
      if (state === JOB_STATES.CANCELLED || job.hakukohteitaKeskeytetty > 0) {
        return 'cancelled';
      } else if (state === JOB_STATES.COMPLETED) {
        return 'completed';
      } else {
        return 'default';
      }
    };

    var me = seurantaservice.getMyInfo();
    $scope.showRemoveOption = function(job){
      if (_.isEmpty(job) || _.isEmpty(me)) {
        return false;
      }
      return job.tila === JOB_STATES.QUEUEING && (
          job.userOID === me.oid ||
          _.isEmpty(_.filter(me.roles, function(x)  {return _.includes(x, '1.2.246.562.10.00000000001')})));
    };

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
          $scope.jobsByState = {
            running: _.size(_.filter($scope.jobs, function(job) { return job.tila == JOB_STATES.RUNNING; })),
            cancelled: _.size(_.filter($scope.jobs, function(job) { return job.tila == JOB_STATES.CANCELLED; })),
            queueing: _.size(_.filter($scope.jobs, function(job) { return job.tila == JOB_STATES.QUEUEING; })),
            completed: _.size(_.filter($scope.jobs, function(job) { return job.tila == JOB_STATES.COMPLETED; }))
          };
        });
    };

    updateJobList();

    var queryUserByOid = function(job, userOID) {
      console.log("queryUserByOid : " + userOID);
      if (_.isEmpty(userOID)) {
        return;
      }
      if ($scope.usernamesByOid[userOID]) {
        //console.log("Found in local user memory: ", $scope.usernamesByOid[userOID]);
        var nameInfo = $scope.usernamesByOid[userOID];
        job.userNameInitials = nameInfo.initials;
        job.userFullname = nameInfo.fullName;
      } else {
        job.userNameInitials = '';
        job.userFullname = userOID;
        seurantaservice.queryUsernameByOid(userOID).then(function (res) {
          if (typeof res === "undefined" || res.unauthorized) {
            job.userNameInitials = '__';
            job.userFullname = userOID;
            $scope.usernamesByOid[userOID] = {"initials": '__', "fullName": userOID}
          } else if (res.etunimet && res.sukunimi) {
            var nameInfo = {"initials": _.head(res.etunimet) + _.head(res.sukunimi), "fullName": res.etunimet + ' ' + res.sukunimi};
            job.userNameInitials = _.head(res.etunimet) + _.head(res.sukunimi);
            job.userFullname = res.etunimet + ' ' + res.sukunimi;
            console.log("Setting name information for oid " + userOID + " to ", nameInfo);
            $scope.usernamesByOid[userOID] = nameInfo;
          } else {
            console.log("Name information not available for user, using empty default initials." + userOID);
          }
        }, function (err) {
          console.log("Unhandled error querying username, using empty default initials. ", err);
        });
      }

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
