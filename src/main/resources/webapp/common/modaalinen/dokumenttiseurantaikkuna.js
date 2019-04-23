function DokumenttiSeurantaIkkunaCtrl($scope, $modalInstance, oids, $window, $log,
        $interval, $routeParams, HakuModel,
        ValintalaskentaKerrallaHakukohteille,
        ValintalaskentaKerrallaAktivointi, Ilmoitus, IlmoitusTila,
        DokumenttiSeurantaPalvelu, ValintalaskentaKerrallaUudelleenYrita,
        SeurantaPalveluLataa) {
    $scope.uuid = oids.uuid;
    $scope.kaynnissa = false;
    $scope.nimi = HakuModel.getNimi();
    $scope.nimentarkennus = oids.nimentarkennus;
    $scope.disabloikeskeyta = false;
    $scope.source = null;
    $scope.dokumenttiId = null;
    $scope.virheilmoitukset = null;

    $scope.update = function() {
        if ($scope.uuid != null) {
            DokumenttiSeurantaPalvelu.hae({
                uuid : $scope.uuid
            }, function(r) {
                $scope.paivitaMuuttujat(r);
                if ($scope.isKokonaanValmis() || $scope.isKokonaanKeskeytetty()) {
                    $interval.cancel($scope.timer);
                }
            });
        }
    };

    $scope.timer = undefined;
    $scope.paivitaPollaten = function(uuid) {
        $scope.uuid = uuid;
        $scope.update();
        $interval.cancel($scope.timer);
        $scope.timer = $interval(function() {
            $scope.update();
        }, 10000);
    };
    $scope.paivitaMuuttujat = function(r) {
        $scope.kuvaus = r.kuvaus;
        $scope.dokumenttiId = r.dokumenttiId;
        $scope.virheilmoitukset = r.virheilmoitukset;
    };

    $scope.hideUudelleenYritys = function() {
        // uudelleen yritys piiloon jos kokonaan valmis tai kaynnissa
        return $scope.isKokonaanValmis() || $scope.isKaynnissa();
    };
    $scope.isKokonaanValmis = function() {
        return $scope.dokumenttiId;
    };
    $scope.isKokonaanKeskeytetty = function() {
        return $scope.virheilmoitukset;
    };
    $scope.isKaynnissa = function() { // onko ajossa tai onko mielekasta enaa
        // ajaakkaan
        return $scope.uuid == null || $scope.kaynnissa;
    };
    $scope.paivitaForce = function(uuid) {
        $scope.paivitaPollaten(uuid);
    };
    $scope.uudelleenyritaForce = function() {
        $log.info("Toteuttamatta");
    };
    $scope.uudelleenyrita = function() {
        if ($scope.isKaynnissa()) {
            Ilmoitus
                    .avaa(
                            "Toiminto on vielä käynnissä",
                            "Uudelleen yritystä voidaan yrittää vasta kun vanha toiminto on päättynyt",
                            IlmoitusTila.ERROR);
        } else {
            $scope.kaynnissa = true;
            $scope.uudelleenyritaForce();
        }
    };
    if (oids.laskenta) {
        $log.info("Jatketaan olemassa olevaa laskentaa.");
        $scope.paivitaMuuttujat(oids.laskenta);
    } else {
        $log.info("Aloitetaan kokonaan uusi laskenta.");
        var whitelist = oids.whitelist;
        if (!whitelist) {
            whitelist = true;
        }
        var tyyppi = oids.tyyppi;
        if (!tyyppi) {
            tyyppi = "HAKU";
        }
        var hakukohteet = oids.hakukohteet;
        if (!hakukohteet) {
            hakukohteet = [];
        }
        $scope.kaynnissa = true;
        $scope.paivitaForce(oids.id);
    }

    $scope.ok = function() {
        if ($scope.timer) {
            $interval.cancel($scope.timer);
        }
        if ($scope.source) {
            $log.info("SSE "+$scope.uuid+" suljetaan selaimen pyynnosta!");
            $scope.source.close();
        }
        oids.ok();
        $log.info("TODO Peruuta keskenerainen");
        $modalInstance.close(); // $scope.selected.item);
    };

    $scope.cancel = function() {
        if ($scope.timer) {
            $interval.cancel($scope.timer);
        }
        if ($scope.source) {
            $log.info("SSE "+$scope.uuid+" suljetaan selaimen pyynnosta!");
            $scope.source.close();
        }
        $modalInstance.dismiss('cancel');
    };
    $scope.getOnnistuneetProsentit = function() {
        if ($scope.isKokonaanValmis()) {
            return 100;
        } else {
            return 0;
        }
    };
    $scope.getOhitetutProsentit = function() {
        if ($scope.isKokonaanKeskeytetty()) {
            return 100;
        } else {
            return 0;
        }
    };
};

