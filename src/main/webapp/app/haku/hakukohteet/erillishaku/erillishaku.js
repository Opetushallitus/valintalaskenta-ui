angular.module('valintalaskenta')

    .controller('ErillishakuController', ['$scope', '$log', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti',
        'TulosXls', 'HakukohdeModel', 'HakuModel', '$http', 'AuthService', 'UserModel','SijoitteluntulosModel', '_', 'LocalisationService','ErillishakuVienti',
        'ErillishakuProxy',
    function ($scope, $log, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti,TulosXls, HakukohdeModel, HakuModel, $http, AuthService, UserModel, SijoitteluntulosModel, _, LocalisationService,
              ErillishakuVienti,ErillishakuProxy) {
    "use strict";

    $scope.muokatutHakemukset = [];
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.hakuModel = HakuModel;
    $scope.sijoitteluModel = SijoitteluntulosModel; 
    $scope.sijoitteluModel.refresh($routeParams.hakuOid, $routeParams.hakukohdeOid);

        $scope.getTilatForHaku = function() {
            if($scope.hakuModel.korkeakoulu) {
                return ["EI_VASTAANOTETTU_MAARA_AIKANA",
                    "PERUNUT",
                    "PERUUTETTU",
                    "VASTAANOTTANUT_SITOVASTI",
                    "KESKEN"];
            } else {
                return ["VASTAANOTTANUT",
                    "EI_VASTAANOTETTU_MAARA_AIKANA",
                    "PERUNUT",
                    "KESKEN"];
            }
        }

    $scope.valintatuloksentilat = $scope.getTilatForHaku();
    $scope.erillishaku = ErillishakuProxy.hae({hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid});

    var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

    $scope.pageSize = 50;

    $scope.hakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(function () {
        $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOids', function () {
            AuthService.updateOrg("APP_SIJOITTELU", HakukohdeModel.hakukohde.tarjoajaOids[0]).then(function () {
                $scope.updateOrg = true;
            });
        });
    });
    
    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
        $scope.jkmuokkaus = true;
    });

    $scope.hakemuksenMuokattuIlmoittautumisTilat = [
        {value: "EI_TEHTY", text_prop: "sijoitteluntulos.enrollmentinfo.notdone", default_text:"Ei tehty"},
        {value: "LASNA_KOKO_LUKUVUOSI", text_prop: "sijoitteluntulos.enrollmentinfo.present", default_text:"Läsnä (koko lukuvuosi)"},
        {value: "POISSA_KOKO_LUKUVUOSI", text_prop: "sijoitteluntulos.enrollmentinfo.notpresent", default_text:"Poissa (koko lukuvuosi)"},
        {value: "EI_ILMOITTAUTUNUT", text_prop: "sijoitteluntulos.enrollmentinfo.noenrollment", default_text:"Ei ilmoittautunut"},
        {value: "LASNA_SYKSY", text_prop: "sijoitteluntulos.enrollmentinfo.presentfall", default_text:"Läsnä syksy, poissa kevät"},
        {value: "POISSA_SYKSY", text_prop: "sijoitteluntulos.enrollmentinfo.notpresentfall", default_text:"Poissa syksy, läsnä kevät"},
        {value: "LASNA", text_prop: "sijoitteluntulos.enrollmentinfo.presentspring", default_text:"Läsnä, keväällä alkava koulutus"},
        {value: "POISSA", text_prop: "sijoitteluntulos.enrollmentinfo.notpresentspring", default_text:"Poissa, keväällä alkava koulutus"}
    ];

    LocalisationService.getTranslationsForArray($scope.hakemuksenMuokattuIlmoittautumisTilat).then(function () {

        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

    });

    $scope.user = UserModel;
    UserModel.refreshIfNeeded().then(function(){
        $scope.jkmuokkaus = UserModel.isKKUser;
        $scope.jkmuokkaus = true;
    });

        $scope.getHakijanSijoitteluTulos = function (valintatapajono, hakija) {
            var jono = _.find($scope.model.erillishakuSijoitteluajoTulos.valintatapajonot, function (item) {
                return item.oid === valintatapajono.oid;
            });

            if(!_.isEmpty(jono)) {
                return _.find(jono.hakemukset, function (item) {
                    return item.hakijaOid === hakija.hakijaOid;
                });
            }
        };

        $scope.valintatapajonoVientiXlsx = function(valintatapajonoOid, valintatapajononNimi) {
            ValintatapajonoVienti.vie({
                    valintatapajonoOid: valintatapajonoOid,
                    valintatapajononNimi: valintatapajononNimi,
                    hakukohdeOid: $scope.hakukohdeOid,
                    hakuOid: $routeParams.hakuOid},
                {}, function (id) {
                    Latausikkuna.avaa(id, "Valintatapajonon vienti taulukkolaskentaan", "");
                }, function () {
                    Ilmoitus.avaa("Valintatapajonon vienti epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
                });
        };

        $scope.valintatapajonoTuontiXlsx = function(valintatapajonoOid, $files, valintatapajononNimi) {
            var file = $files[0];
            var fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            var hakukohdeOid = $scope.hakukohdeOid;
            var hakuOid = $routeParams.hakuOid;
            fileReader.onload = function(e) {
                $scope.upload = $upload.http({
                    url: VALINTALASKENTAKOOSTE_URL_BASE + "resources/valintatapajonolaskenta/tuonti?hakuOid=" +hakuOid + 
                    "&hakukohdeOid=" +hakukohdeOid + 
                    "&valintatapajonoOid="+ valintatapajonoOid +
                    "&valintatapajononNimi="+ valintatapajononNimi, //upload.php script, node.js route, or servlet url
                    method: "POST",
                    headers: {'Content-Type': 'application/octet-stream'},
                    data: e.target.result
                }).progress(function(evt) {
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(id, status, headers, config) {
                    Latausikkuna.avaaKustomoitu(id, "Valintatapajonon tuonti", "", "../common/modaalinen/tuontiikkuna.html",
                        function(dokumenttiId) {
                            // tee paivitys
                            $scope.model.refresh(hakukohdeOid, hakuOid);
                        }
                    );
                }).error(function(data) {
                    //error
                });
            };
        };

        $scope.valintalaskentaTulosXLS = function() {
            TulosXls.query({hakukohdeOid:$routeParams.hakukohdeOid});
        };

        $scope.showHistory = function(valintatapajonoOid, hakemusOid) {
            $location.path('/valintatapajono/' + valintatapajonoOid + '/hakemus/' + hakemusOid + '/valintalaskentahistoria');
        };

        $scope.showTilaPartial = function(valintatulos) {
            if(valintatulos.showTilaPartial === null || valintatulos.showTilaPartial === false) {
                valintatulos.showTilaPartial = true;
            } else {
                valintatulos.showTilaPartial = false;
            }
        };
        $scope.showHenkiloPartial = function(valintatulos) {
            if(valintatulos.showHenkiloPartial === null || valintatulos.showHenkiloPartial === false) {
                valintatulos.showHenkiloPartial = true;
            } else {
                valintatulos.showHenkiloPartial = false;
            }
        };


        $scope.submit = function (valintatapajonoOid) {
            $scope.model.updateHakemuksienTila(valintatapajonoOid, $scope.muokatutHakemukset, $scope.sijoitteluModel);
        };


        $scope.addMuokattuHakemus = function (hakemus) {
            $scope.muokatutHakemukset.push(hakemus.hakemusOid);
            $scope.muokatutHakemukset = _.uniq($scope.muokatutHakemukset);
        };


        $scope.muutaSijoittelunStatus = function (jono, status) {
            ValintalaskentatulosModel.muutaSijoittelunStatus(jono, status);
        };

        $scope.changeTila = function (jonosija, value) {
            if (_.isNumber(value)) {
                $timeout(function(){
                    jonosija.tuloksenTila = "HYVAKSYTTAVISSA";
                });
            } else {
                $timeout(function(){
                    jonosija.tuloksenTila = "";
                    delete jonosija.jonosija;
                });
            }

        };

        $scope.resetIlmoittautumisTila = function(hakemus) {
            if(hakemus.muokattuVastaanottoTila !== 'VASTAANOTTANUT' && hakemus.muokattuVastaanottoTila !== 'EHDOLLISESTI_VASTAANOTTANUT') {
                hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
            } else if (!hakemus.muokattuIlmoittautumisTila) {
                hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
            }
        };

        $scope.changeSija = function (jonosija, value) {
            if (value !== 'HYVAKSYTTAVISSA') {
                $timeout(function(){
                    delete jonosija.jonosija;
                });
            }

        };
        $scope.getHakutyyppi = function() {
        	if($scope.hakuModel.korkeakoulu) {
        		return "KORKEAKOULU";
        	} else {
        		return "TOISEN_ASTEEN_OPPILAITOS";
        	}
        }
        $scope.erillishaunVientiXlsx = function(valintatapajonoOid, valintatapajononNimi) {
        	var hakutyyppi = $scope.getHakutyyppi();
        	ErillishakuVienti.vie({
        		hakutyyppi: hakutyyppi,
        		hakukohdeOid: $scope.hakukohdeOid,
        		hakuOid: $routeParams.hakuOid,
                valintatapajononNimi: valintatapajononNimi,
        		tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
        		valintatapajonoOid: valintatapajonoOid
        	},
        		{}, function (id) {
                Latausikkuna.avaa(id, "Erillishaun hakukohteen vienti taulukkolaskentaan", "");
            }, function () {
                Ilmoitus.avaa("Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
            });
        };
        $scope.erillishaunTuontiXlsx = function($files, valintatapajonoOid, valintatapajononNimi) {
    		var file = $files[0];
    		var fileReader = new FileReader();
    	    fileReader.readAsArrayBuffer(file);
    	    var hakukohdeOid = $scope.hakukohdeOid;
    	    var hakuOid = $routeParams.hakuOid;
    	    var tarjoajaOid = $scope.hakukohdeModel.hakukohde.tarjoajaOids[0];
    	    var hakutyyppi = $scope.getHakutyyppi();
    	    fileReader.onload = function(e) {
    			$scope.upload = $upload.http({
    	    		url: VALINTALASKENTAKOOSTE_URL_BASE + "resources/erillishaku/tuonti?hakuOid=" +hakuOid + "&hakukohdeOid=" +hakukohdeOid
    	    		+"&tarjoajaOid="+ tarjoajaOid+"&valintatapajonoOid="+valintatapajonoOid
    	    		+"&valintatapajononNimi="+ valintatapajononNimi
    	    		+"&hakutyyppi="+hakutyyppi, //upload.php script, node.js route, or servlet url
    				method: "POST",
    				headers: {'Content-Type': 'application/octet-stream'},
    				data: e.target.result
    			}).progress(function(evt) {
    				//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    			}).success(function(id, status, headers, config) {
    				Latausikkuna.avaaKustomoitu(id, "Erillishaun hakukohteen tuonti", "", "../common/modaalinen/tuontiikkuna.html",
    	            function(dokumenttiId) {
    	            	// tee paivitys
    	            	$scope.model.refresh(hakukohdeOid, hakuOid);
    	            	$scope.sijoitteluModel.refresh(hakuOid, hakukohdeOid);
    	            }
    	            );
    			}).error(function(data) {
    			    //error
    			});
    	    };
    	};
}]);
