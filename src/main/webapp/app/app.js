"use strict";


var app = angular.module('valintalaskenta', ['ngResource', 'loading', 'ngRoute', 'ngAnimate', 'pascalprecht.translate',
    'ui.tinymce', 'valvomo','ui.bootstrap','angularFileUpload', 'lodash', 'oph.localisation', 'oph.services'], function($rootScopeProvider) {
	$rootScopeProvider.digestTtl(25);
}).run(function($http, MyRolesModel, LocalisationService){
	// ja vastaus ei ole $window.location.pathname koska siina tulee mukana myos index.html
  	tinyMCE.baseURL = '/valintalaskenta-ui/common/jslib/static/tinymce-4.0.12';
    MyRolesModel;
    $http.get(VALINTAPERUSTEET_URL_BASE + "buildversion.txt?auth");
    LocalisationService.getTranslation("");
});


//MODAALISET IKKUNAT
app.factory('Ilmoitus', function($modal, IlmoitusTila) {
	return {
		avaa: function(otsikko, ilmoitus, tila) {
			$modal.open({
		      backdrop: 'static',
		      templateUrl: '../common/modaalinen/ilmoitus.html',
		      controller: function($scope, $window, $modalInstance) {
				  $scope.ilmoitus = ilmoitus;
		    	  $scope.otsikko = otsikko;
                  if(!tila) {
                      tila = IlmoitusTila.INFO;
                  }
                  $scope.tila = tila;
		    	  $scope.sulje = function() {
		    	  		$modalInstance.dismiss('cancel');
		    	  };
		      },
		      resolve: {
		    	  
		      }
		    }).result.then(function() {
		    }, function() {
		    });
		    
		}
	};
});
app.factory('Latausikkuna', function($log, $modal, DokumenttiProsessinTila) {
	return {
		
		avaaKustomoitu: function(id, otsikko, lisatiedot, ikkunaHtml, laajennettuMalli, laajennettuMalliKaksi) {
			var timer = null;
			var cancelTimerWhenClosing = function() {
				DokumenttiProsessinTila.ilmoita({id: id, poikkeus:"peruuta prosessi"});
			};
			$modal.open({
		      backdrop: 'static',
		      templateUrl: ikkunaHtml,
		      controller: function($log, $scope, $window, $modalInstance, $interval, laajennos, DokumenttiProsessinTila) {
		    	  cancelTimerWhenClosing = function() {
				  	$interval.cancel(timer);
				  };
				  $scope.lisatiedot = lisatiedot;
		    	  $scope.otsikko = otsikko;
		    	  $scope.prosessi = {};
		    	  $scope.kutsuLaajennettuaMallia = function() {
		    	  	$log.error($scope.prosessi.dokumenttiId);
		    	  	laajennos($scope.prosessi.dokumenttiId);
		    	  };
		    	  $scope.kutsuLaajennettuaMalliaKaksi = function() {
		    	  	$log.error($scope.prosessi.dokumenttiId);
		    	  	laajennosKaksi($scope.prosessi.dokumenttiId);
		    	  };
		    	  $scope.update = function() {
		    	  		DokumenttiProsessinTila.lue({id: id.id}, function(data) {
		    	  			if(data.keskeytetty == true) {
		    	  				cancelTimerWhenClosing();
		    	  			}
		    	  			$scope.prosessi = data;
		    	  			if(data.dokumenttiId != null) {
		    	  				$interval.cancel(timer);
		    	  			}
		    	  		});
		    	  };
		    	  $scope.onVirheita = function() {
		    	  	if($scope.prosessi == null) {
		    	  		return false;
		    	  	} else {
		    	  		return $scope.prosessi.keskeytetty; 
		    	  	}
		    	  };
		    	  $scope.onKesken = function() {
		    	  	if($scope.prosessi == null) {
		    	  		return true;
		    	  	} else {
		    	  		return $scope.prosessi.dokumenttiId == null; 
		    	  	}
		    	  };
		    	  $scope.getProsentit = function(t) {
		    	  	if(t == null) {
		    	  		return 0;
		    	  	}
					return t.prosentteina * 100;
				  };
		    	  $scope.sulje = function() {
		    	  		DokumenttiProsessinTila.ilmoita({id: id.id, poikkeus:"Käyttäjän sulkema"});
		    	  		$modalInstance.dismiss('cancel');
		    	  };
		    	  timer = $interval(function () {
				        $scope.update();
				  }, 10000);
				  
				  $scope.ok = function() {
				  	if($scope.onKesken()) {
				  		return;
				  	} else {
				  		$window.location.href = "/dokumenttipalvelu-service/resources/dokumentit/lataa/" + $scope.prosessi.dokumenttiId;
				  	}
				  };
		      },
		      resolve: {
		    	  laajennos: function() {
		    	  	return laajennettuMalli;
		    	  }
		      }
		    }).result.then(function() {
		    	cancelTimerWhenClosing();
		    }, function() {
		    	DokumenttiProsessinTila.ilmoita({id: id, poikkeus:"peruuta prosessi"});
		    	cancelTimerWhenClosing();
		    });
		    
		},
		avaa: function(id, otsikko, lisatiedot) {
			this.avaaKustomoitu(id,otsikko,lisatiedot,'../common/modaalinen/latausikkuna.html',{});
		}
	};
});



app.constant('Pohjakoulutukset', {
	0: "Ulkomailla suoritettu koulutus",
	1: "Perusopetuksen oppimäärä",
	2: "Perusopetuksen osittain yksilöllistetty oppimäärä",
	3: "Perusopetuksen yksilöllistetty oppimäärä, opetus järjestetty toiminta-alueittain",
	6: "Perusopetuksen pääosin tai kokonaan yksilöllistetty oppimäärä",
	7: "Oppivelvollisuuden suorittaminen keskeytynyt (ei päättötodistusta)",
	9: "Lukion päättötodistus, ylioppilastutkinto tai abiturientti"
});

app.constant('IlmoitusTila', {
	INFO: 'success',
	WARNING: 'warning',
	ERROR: 'danger'
});

