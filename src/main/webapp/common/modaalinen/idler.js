app.directive('idle', ['Idle', '$timeout', '$interval', function(Idle, $timeout, $interval){
    return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
        var timeout;
        var timestamp = localStorage.lastEventTime;

        // Watch for the events set in ng-idle's options
        // If any of them fire (considering 500ms debounce), update localStorage.lastEventTime with a current timestamp
        elem.on(Idle._options().events, function(){
        if(Idle.running()) {
            if (timeout) { $timeout.cancel(timeout); }
            timeout = $timeout(function(){
            localStorage.setItem('lastEventTime', new Date().getTime());
            }, 3000, false);
        }
        });

        // Every 5s, poll localStorage.lastEventTime to see if its value is greater than the timestamp set for the last known event
        // If it is, reset the ng-idle timer and update the last known event timestamp to the value found in localStorage
        window.setInterval(function() {
        if (localStorage.lastEventTime > timestamp) {
            var element = angular.element('#sessionWarning .btn');
            if (element.length > 0) {
            $timeout(function() {
                element.click();
            }, 500, false);
            }
            Idle.watch();
            timestamp = localStorage.lastEventTime;
        }
        }, 5000, false);
    }
    };
}]);

app.controller('SessionExpiresCtrl', ['Idle', '$scope', '$modalInstance', '$window', 'LocalisationService', function( Idle, $scope, $modalInstance, $window, LocalisationService) {
    $scope.timeoutMessage = function() {
    var duration = Math.floor(MAX_SESSION_IDLE_TIME_IN_SECONDS / 60);
    //return "Istuntosi on vanhentunut" + " " + duration +  " " + "minuutin käyttämättömyyden johdosta.";
    //return LocalisationService.getTranslation("session.expired.text1.part1") + " " + duration +  " " + LocalisationService.getTranslation("session.expired.text1.part2");
    return (LocalisationService.tl("session.expired.text1.part1") || "Istuntosi on vanhentunut") + " " + duration +  " " + (LocalisationService.tl("session.expired.text1.part2") || "minuutin käyttämättömyyden johdosta.");
    };

    $scope.okConfirm = function() {
    Idle.watch();
    $modalInstance.close();
    };
    $scope.redirectToLogin = function() {
    $window.location.reload();
    };
}]);

app.controller('EventsCtrl', ['$scope','Idle', '$modal', '$http', function($scope, Idle, $modal, $http) {
    openModal = function(template) {
    return $modal.open({
        templateUrl: template,
        controller: 'SessionExpiresCtrl',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'modal-warning'
        });
    };

    $scope.$on('IdleWarn', function(e, countdown) {
    if (!$scope.sessionWarning || angular.element('#sessionWarning').length < 1) {
        $scope.sessionWarning = openModal('sessionWarning.html');
    }
    });

    $scope.$on('IdleTimeout', function() {
    $scope.sessionWarning.close();
    $scope.sessionWarning = openModal('sessionExpired.html');
    Idle.unwatch();
    });

}])
.config(['IdleProvider', 'KeepaliveProvider', function(IdleProvider, KeepaliveProvider) {
    var warningDuration = 300;
    IdleProvider.idle(MAX_SESSION_IDLE_TIME_IN_SECONDS - warningDuration);
    IdleProvider.timeout(warningDuration - 290);

    KeepaliveProvider.interval(SESSION_KEEPALIVE_INTERVAL_IN_SECONDS);
    KeepaliveProvider.http(SIJOITTELU_URL_BASE + "resources/session/maxinactiveinterval");
    KeepaliveProvider.http(DOKUMENTTIPALVELU_URL_BASE + "/session/maxinactiveinterval");
    KeepaliveProvider.http(SEURANTA_URL_BASE + "/session/maxinactiveinterval");
    KeepaliveProvider.http(VALINTALASKENTAKOOSTE_URL_BASE + "resources/session/maxinactiveinterval");
    KeepaliveProvider.http(SERVICE_URL_BASE + "resources/session/maxinactiveinterval");
}])
.run(['Idle', function(Idle){
    Idle.watch();
}]);