app.factory('ErllishakuModel', function($routeParams, ValinnanvaiheListByHakukohde, JarjestyskriteeriMuokattuJonosija,
    ValinnanVaiheetIlmanLaskentaa, HakukohdeHenkilotFull, Ilmoitus, IlmoitusTila, $q, ValintaperusteetHakukohde, ValintatapajonoSijoitteluStatus) {
    "use strict";

    var model;
	model = new function() {
	}();

	return model;
});


angular.module('valintalaskenta').
    controller('ErillishakuController', ['$scope', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti','ErllishakuModel',
        'TulosXls', 'HakukohdeModel', '$http', 'AuthService', 'UserModel',
    function ($scope, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti,ErllishakuModel, TulosXls, HakukohdeModel, $http, AuthService, UserModel) {
    "use strict";

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ErllishakuModel;
    $scope.hakukohdeModel = HakukohdeModel;

    var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.pageSize = 50;
    $scope.currentPage = [];
    $scope.filteredResults = [];
    
/*
    var promise = $scope.model.refresh($scope.hakukohdeOid, $scope.hakuOid);
    AuthService.crudOph("APP_VALINTOJENTOTEUTTAMINEN").then(function(){
        $scope.updateOph = true;
        $scope.jkmuokkaus = true;
    });

    hakukohdeModelpromise.then(function () {
        AuthService.crudOrg("APP_VALINTOJENTOTEUTTAMINEN", HakukohdeModel.hakukohde.tarjoajaOid).then(function () {
            $scope.crudOrg = true;
        });
    });
    */

    $scope.user = UserModel;
    UserModel.refreshIfNeeded().then(function(){
        $scope.jkmuokkaus = UserModel.isKKUser;
    });

}]);
