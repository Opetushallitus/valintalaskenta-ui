app.factory('HyvaksytytModel', function(HakukohdeHenkilot, Hakemus, HakemusKey) {
	var model;
	model = new function() {

		this.hakeneet = [];
		this.avaimet = [];
        this.errors = [];

		this.refresh = function(hakukohdeOid, hakuOid) {
            model.errors.length = 0;
            model.hakukohdeOid = hakukohdeOid;
            HakukohdeHenkilot.get({aoOid: hakukohdeOid, rows:100000}, function(result) {
                model.hakeneet = result.results;
                if(model.hakeneet) {
                    model.hakeneet.forEach(function(hakija){

                        Hakemus.get({oid: hakija.oid}, function(result) {
                            hakija.hakemus=result;
                            HakemusKey.get({
                                oid: hakija.oid,
                                "key": "lisahaku-hyvaksytty"
                            }, function(res) {
                                if(res["lisahaku-hyvaksytty"] === model.hakukohdeOid) {
                                    hakija.lisahakuHyvaksytty = "Kyllä";
                                }
                            });
                        });
                    });    
                }
                
            }, function(error) {
                model.errors.push(error);
            });
		};

       this.updateHakemus = function(hakemusOid) {
            HakemusKey.put({
               "oid": hakemusOid,
               "key": "lisahaku-hyvaksytty",
               "value": model.hakukohdeOid
           });
           model.hakeneet.forEach(function(hakija) {
               if(hakija.oid === hakemusOid) {
                   hakija.lisahakuHyvaksytty = "Kyllä";
               }
           });
       };

        this.removeHakemusFromHyvaksytyt = function(hakemusOid) {
            HakemusKey.put({
                "oid": hakemusOid,
                "key": "lisahaku-hyvaksytty",
                "value": ""
            });
            model.hakeneet.forEach(function(hakija) {
                if(hakija.oid === hakemusOid) {
                    hakija.lisahakuHyvaksytty = null;
                }
            });
        };

		this.refreshIfNeeded = function(hakukohdeOid, hakuOid) {
            if(hakukohdeOid && hakukohdeOid !== model.hakukohdeOid) {
                model.refresh(hakukohdeOid, hakuOid);
            }
        };

	};

	return model;
});

function LisahakuhyvaksytytController($scope, $location, $routeParams, HyvaksytytModel, HakukohdeModel, AuthService) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HyvaksytytModel;
    $scope.hakuOid =  $routeParams.hakuOid;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.arvoFilter = "SYOTETTAVA_ARVO";
    $scope.muutettu = false;

    $scope.hakemuksenMuokattuIlmoittautumisTilat = [
        {value: "EI_TEHTY", text: "sijoitteluntulos.enrollmentinfo.notdone"},
        {value: "LASNA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.present"},
        {value: "POISSA_KOKO_LUKUVUOSI", text: "sijoitteluntulos.enrollmentinfo.notpresent"},
        {value: "EI_ILMOITTAUTUNUT", text: "sijoitteluntulos.enrollmentinfo.noenrollment"},
        {value: "LASNA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.presentfall"},
        {value: "POISSA_SYKSY", text: "sijoitteluntulos.enrollmentinfo.notpresentfall"},
        {value: "LASNA", text: "sijoitteluntulos.enrollmentinfo.presentspring"},
        {value: "POISSA", text: "sijoitteluntulos.enrollmentinfo.notpresentspring"}
    ];

    //korkeakoulujen 'ehdollisesti vastaanotettu' lisätään isKorkeakoulu() -funktiossa
    $scope.hakemuksenMuokattuVastaanottoTilat = [
        {value: "ILMOITETTU", text: "Hakijalle ilmoitettu"},
        {value: "VASTAANOTTANUT", text: "Vastaanottanut"},
        {value: "EI_VASTAANOTETTU_MAARA_AIKANA", text: "Ei vastaanotettu määräaikana"},
        {value: "PERUNUT", text: "Perunut"},
        {value: "PERUUTETTU", text: "Peruutettu"}
    ];



    HakukohdeModel.refreshIfNeeded($scope.hakukohdeOid);

    HyvaksytytModel.refreshIfNeeded($scope.hakukohdeOid, $routeParams.hakuOid);

    $scope.predicate = 'sukunimi';

    $scope.submit = function() {
        HyvaksytytModel.submit();
    };

    $scope.lisahakuValitse = function(hakemusOid) {
        $scope.model.updateHakemus(hakemusOid);
    };

    $scope.lisahakuPoistavalinta = function(hakemusOid) {
        $scope.model.removeHakemusFromHyvaksytyt(hakemusOid);
    };

    $scope.$watch('hakukohdeModel.hakukohde.tarjoajaOid', function () {
        AuthService.updateOrg("APP_SIJOITTELU", $scope.hakukohdeOid).then(function () {
            $scope.updateOrg = true;
        });

    });

    AuthService.crudOph("APP_SIJOITTELU").then(function () {
        $scope.updateOph = true;
    });

    $scope.resetIlmoittautumisTila = function(hakemus) {
        if(hakemus.muokattuVastaanottoTila !== 'VASTAANOTTANUT' && hakemus.muokattuVastaanottoTila !== 'EHDOLLISESTI_VASTAANOTTANUT') {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        } else if (!hakemus.muokattuIlmoittautumisTila) {
            hakemus.muokattuIlmoittautumisTila = 'EI_TEHTY';
        }
    };
}
