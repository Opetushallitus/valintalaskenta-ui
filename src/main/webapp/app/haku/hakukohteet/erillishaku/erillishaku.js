angular.module('valintalaskenta')

    .controller('ErillishakuController', ['$scope', '$log', '$location', '$routeParams', '$timeout', '$upload', 'Ilmoitus',
        'IlmoitusTila', 'Latausikkuna', 'ValintatapajonoVienti',
        'TulosXls', 'HakukohdeModel', 'HakuModel', '$http', 'AuthService', 'UserModel','SijoitteluntulosModel', '_', 'LocalisationService','ErillishakuVienti',
        'ErillishakuProxy','ErillishakuTuonti','VastaanottoTila',
    function ($scope, $log, $location, $routeParams, $timeout,  $upload, Ilmoitus, IlmoitusTila, Latausikkuna,
              ValintatapajonoVienti,TulosXls, HakukohdeModel, HakuModel, $http, AuthService, UserModel, SijoitteluntulosModel, _, LocalisationService,
              ErillishakuVienti,ErillishakuProxy,ErillishakuTuonti,VastaanottoTila) {
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
        if ($scope.hakuModel.korkeakoulu) {
            return [
                {value:"EI_VASTAANOTETTU_MAARA_AIKANA", text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
                {value:"PERUNUT",   text:"Perunut"},
                {value:"PERUUTETTU",text:"Peruutettu"},
                {value:"VASTAANOTTANUT_SITOVASTI", text:"Vastaanotettu sitovasti"},
                {value:"KESKEN",    text:"Kesken"},
                {value:"",text:""}
            ];
        } else {
            return [
                {value:"VASTAANOTTANUT", text: "Vastaanottanut"},
                {value:"EI_VASTAANOTETTU_MAARA_AIKANA", text:"Ei vastaanotettu m\u00E4\u00E4r\u00E4aikana"},
                {value:"PERUNUT",   text:"Perunut"},
                {value:"KESKEN",    text:"Kesken"},
                {value:"",text:""}
            ];
        }
    };

        $scope.hakemuksentilat = [
            {value:"HYVAKSYTTY",text:"Hyv\u00E4ksytty"},
            {value:"VARASIJALTA_HYVAKSYTTY",text:"Varasijalta hyv\u00E4ksytty"},
            {value:"VARALLA",text:"Varalla"},
            {value:"PERUNUT",text:"Perunut"},
            {value:"PERUUTETTU",text:"Peruutettu"},
            {value:"PERUUNTUNUT",text:"Peruuntunut"},
            {value:"HYLATTY",text:"Hyl\u00E4tty"}
        ];

        $scope.valintatuloksentilat = $scope.getTilatForHaku();
        $scope.ilmoittautumistilat = [
            {value:"EI_TEHTY",text:"Ei tehty"},
            {value:"LASNA_KOKO_LUKUVUOSI",text:"L\u00E4sna koko lukuvuosi"},
            {value:"POISSA_KOKO_LUKUVUOSI",text:"Poissa koko lukuvuosi"},
            {value:"EI_ILMOITTAUTUNUT",text:"Ei ilmoittautunut"},
            {value:"LASNA_SYKSY",text:"L\u00E4sna syksy"},
            {value:"POISSA_SYKSY",text:"Poissa syksy"},
            {value:"LASNA",text:"L*sna"},
            {value:"POISSA",text:"Poissa"},
            {value:"",text:""}];

    $scope.erillishaku = ErillishakuProxy.hae({hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid});

    var hakukohdeModelpromise = HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);

        $scope.virheellisetTilat = function(tulos) {
            var virhe = "";
            if(undefined === _.find($scope.valintatuloksentilat, {'value': tulos.valintatuloksentila})) {
                virhe = virhe + ", " + tulos.valintatuloksentila;
            }
            if(undefined === _.find($scope.hakemuksentilat, {'value': tulos.hakemuksentila})) {
                virhe = virhe + ", " + tulos.hakemuksentila;
            }
            if(undefined === _.find($scope.ilmoittautumistilat, {'value': tulos.ilmoittautumistila})) {
                virhe = virhe + ", " + tulos.ilmoittautumistila;
            }
            return virhe;
        };

        $scope.tarkistaTilat = function(tulos) {
            return undefined === _.find($scope.valintatuloksentilat, {'value': tulos.valintatuloksentila})
                || undefined === _.find($scope.hakemuksentilat, {'value':tulos.hakemuksentila})
                || undefined === _.find($scope.ilmoittautumistilat, {'value':tulos.ilmoittautumistila});
        };

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

        $scope.hakemusToErillishakuRivi = function (hakemus) {
            //$log.info(hakemus);
            return {
                etunimi: hakemus.etunimi,
                sukunimi: hakemus.sukunimi,
                henkilotunnus: hakemus.henkilotunnus,
                sahkoposti: hakemus.sahkoposti,
                syntymaAika: hakemus.syntymaaika,
                personOid: hakemus.hakijaOid,
                hakemuksenTila: hakemus.hakemuksentila,
                vastaanottoTila: hakemus.valintatuloksentila,
                ilmoittautumisTila: hakemus.ilmoittautumistila,
                poistetaankoRivi: hakemus.poistetaankoRivi,
                julkaistaankoTiedot: hakemus.julkaistavissa,
                hakemusOid: hakemus.hakemusOid
            };
        };

        $scope.hakemusToValintatulos = function (valintatapajono) {
            return function(hakemus) {
                return {
                    tila: hakemus.hakemuksentila,
                    ilmoittautumisTila: hakemus.ilmoittautumistila,
                    valintatapajonoOid: valintatapajono.oid,
                    hakemusOid: hakemus.hakemusOid,
                    julkaistavissa: hakemus.julkaistavissa,
                    hyvaksyttyVarasijalta: hakemus.hyvaksyttyVarasijalta
                };
            };
        };

        $scope.submitIlmanLaskentaa = function (valintatapajono) {
            $scope.erillishaunTuontiJson(valintatapajono.oid, valintatapajono.nimi, _.map($scope.muokatutHakemukset,$scope.hakemusToErillishakuRivi));
        };

        $scope.submitLaskennalla = function (valintatapajono) {
            VastaanottoTila.post({
             hakuoid: $routeParams.hakuOid,
             hakukohdeOid: $routeParams.hakukohdeOid,
             selite: "Massamuokkaus"
             }, _.map($scope.muokatutHakemukset,$scope.hakemusToValintatulos(valintatapajono)), function (result) {
                $scope.muokatutHakemukset = [];
                Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Muutokset on tallennettu.");
            }, function (error) {
                Ilmoitus.avaa("Sijoittelun tulosten tallennus", "Tallennus epäonnistui! Yritä uudelleen tai ota yhteyttä ylläpitoon.", IlmoitusTila.ERROR);
            });
        };

        $scope.addMuokattuHakemus = function (hakemus) {
            $scope.muokatutHakemukset.push(hakemus);
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
        $scope.erillishaunTuontiJson = function(valintatapajonoOid, valintatapajononNimi, json) {

            var hakutyyppi = $scope.getHakutyyppi();
            ErillishakuTuonti.tuo({
                hakutyyppi: hakutyyppi,
                hakukohdeOid: $scope.hakukohdeOid,
                hakuOid: $routeParams.hakuOid,
                valintatapajononNimi: valintatapajononNimi,
                tarjoajaOid: $scope.hakukohdeModel.hakukohde.tarjoajaOids[0],
                valintatapajonoOid: valintatapajonoOid
            },
                {rivit: json}, function (id) {
                Latausikkuna.avaaKustomoitu(id, "Erillishaun hakukohteen tuonti", "", "../common/modaalinen/tuontiikkuna.html",
                    function(dokumenttiId) {
                        // tee paivitys
                        $scope.muokatutHakemukset = [];
                        $scope.erillishaku = ErillishakuProxy.hae({hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid});
                    }
                );
            }, function () {
                Ilmoitus.avaa("Erillishaun hakukohteen vienti taulukkolaskentaan epäonnistui! Ota yhteys ylläpitoon.", IlmoitusTila.ERROR);
            });

        };
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
                            $scope.erillishaku = ErillishakuProxy.hae({hakuOid: $routeParams.hakuOid, hakukohdeOid: $routeParams.hakukohdeOid});
                        }
    	            );
    			}).error(function(data) {
    			    //error
    			});
    	    };
    	};
}]);
