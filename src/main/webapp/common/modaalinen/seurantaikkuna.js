function SeurantaIkkunaCtrl($scope, $modalInstance, oids, $window, $log,
		$interval, HakuModel,
		ValintalaskentaKerrallaHakukohteille,
		ValintalaskentaKokoHaulle,
		ValintalaskentaKerrallaAktivointi, Ilmoitus, IlmoitusTila,
		SeurantaPalvelu, ValintalaskentaKerrallaUudelleenYrita) {
	$scope.uuid = oids.uuid;
	$scope.kaynnissa = false;
	$scope.nimi = HakuModel.getNimi();
	$scope.nimentarkennus = oids.nimentarkennus;
	$scope.jonosija = undefined;
	$scope.tila = undefined;
	$scope.lisaa = false;
	$scope.ohitettu = 0;
	$scope.tehty = 0;
	$scope.kaikkityot = 0;
	$scope.disabloikeskeyta = false;
	$scope.source = null;
	$scope.kokonaanvalmis = false;
	$scope.valinnanvaihe = oids.valinnanvaihe;
	$scope.valintakoelaskenta = oids.valintakoelaskenta;
	
	var timer = undefined;
	$scope.paivitaPollaten = function(uuid) {
		$scope.uuid = uuid;
		update();
		$interval.cancel(timer);
		timer = $interval(function() {
			update();
		}, 10000);
	};
	$scope.paivitaMuuttujat = function(r) {
		$scope.ohitettu = r.hakukohteitaKeskeytetty;
		$scope.tehty = r.hakukohteitaValmiina;
		$scope.kaikkityot = r.hakukohteitaYhteensa;
		$scope.tila = r.tila;
		if(r.tila == "VALMIS") {
			if ($scope.ohitettu + $scope.tehty == $scope.kaikkityot) {
				$scope.kaynnissa = false;
			}
		}
		$scope.jonosija = r.jonosija;
		if ($scope.kaikkityot) {
			if ($scope.tehty == $scope.kaikkityot) {
				$scope.kokonaanvalmis = true;
			}
		}
	};

	$scope.hideUudelleenYritys = function() {
		// uudelleen yritys piiloon jos kokonaan valmis tai kaynnissa
		return $scope.isKokonaanValmis() || $scope.isKaynnissa();
	};
	$scope.isKokonaanValmis = function() {
		return $scope.kokonaanvalmis;
	};
	$scope.isKaynnissa = function() { // onko ajossa tai onko mielekasta enaa
		// ajaakkaan
		return $scope.uuid == null || $scope.kaynnissa;
	};
	$scope.paivitaForce = function(uuid) {
		$scope.paivitaPollaten(uuid);
	};
  function laskennanVastaus(uuid) {
    $scope.kaynnissa = true;
    if(uuid.lisatiedot) {
      $scope.seurataankoOlemassaAjossaOlevaaLaskentaa = !uuid.lisatiedot.luotiinkoUusiLaskenta;
    } else {
      $scope.seurataankoOlemassaAjossaOlevaaLaskentaa = false;
    }
    $scope.paivitaForce(uuid.latausUrl);
  }
  function laskennanVirhe(err) {
    Ilmoitus
      .avaa(
        "Valintakoelaskenta epäonnistui",
        "Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon. " + err.data,
        IlmoitusTila.ERROR);
  }
	$scope.uudelleenyritaForce = function() {
		ValintalaskentaKerrallaUudelleenYrita
				.uudelleenyrita(
						{
							uuid : $scope.uuid
						}, laskennanVastaus, laskennanVirhe);
	};
	$scope.uudelleenyrita = function() {
		if ($scope.isKaynnissa()) {
			Ilmoitus
					.avaa(
							"Laskenta on vielä käynnissä",
							"Uudelleen yritystä voidaan yrittää vasta kun vanha laskenta on päättynyt",
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

		if (oids.kokoHaku === true) {
			ValintalaskentaKokoHaulle.aktivoi({
				hakuoid : oids.hakuOid,
				erillishaku: oids.erillishaku,
				haunnimi: $scope.nimi,
				nimi: $scope.nimentarkennus,
				valinnanvaihe: oids.valinnanvaihe,
				valintakoelaskenta: oids.valintakoelaskenta
			}, null, laskennanVastaus, laskennanVirhe);
		} else {
			ValintalaskentaKerrallaHakukohteille.aktivoi({
						hakuoid: oids.hakuOid,
						tyyppi: tyyppi,
					  haunnimi: $scope.nimi,
					  nimi: $scope.nimentarkennus,
						erillishaku: oids.erillishaku,
						whitelist: whitelist,
						valinnanvaihe: oids.valinnanvaihe,
						valintakoelaskenta: oids.valintakoelaskenta
					},
					oids.hakukohteet ? oids.hakukohteet : [],
					laskennanVastaus,
					laskennanVirhe);
		}
	}

	$scope.yhteenveto = function() {
		$window.open(window.url("valintalaskentakoostepalvelu.valitalaskentakerralla.status.xls", $scope.uuid));
	};
	$scope.vieJsoniksi = function() {
		$window.open(window.url("seuranta-service.seuranta.lataa", $scope.uuid));
	};

	var update = function() {
		if ($scope.uuid != null) {
			SeurantaPalvelu.hae({
				uuid : $scope.uuid
			}, function(r) {
				$scope.paivitaMuuttujat(r);
				if ($scope.tehty + $scope.ohitettu == $scope.kaikkityot) {
					$interval.cancel(timer);
				}
			});
		}
	};

	$scope.peruuta = function() {
		if (!$scope.disabloikeskeyta) {
			$scope.disabloikeskeyta = true;
			ValintalaskentaKerrallaAktivointi.keskeyta({
				hakuoid : $scope.uuid
			});
		}
	};

	$scope.naytaLisaa = function() {
		$scope.lisaa = !$scope.lisaa;
	};

	$scope.ok = function() {
		if (timer) {
			$interval.cancel(timer);
		}
		if ($scope.source) {
			$log.info("SSE "+$scope.uuid+" suljetaan selaimen pyynnosta!");
			$scope.source.close();
		}
		$modalInstance.close(); // $scope.selected.item);
	};

	$scope.cancel = function() {
		if (timer) {
			$interval.cancel(timer);
		}
		if ($scope.source) {
			$log.info("SSE "+$scope.uuid+" suljetaan selaimen pyynnosta!");
			$scope.source.close();
		}
		$modalInstance.dismiss('cancel');

	};
	$scope.getOnnistuneetProsentit = function() {
		if ($scope.kaikkityot == 0) {
			return 0;
		} else {
			return Math.round(($scope.tehty / $scope.kaikkityot) * 100);
		}
	};
	$scope.getOhitetutProsentit = function() {
		if ($scope.kaikkityot == 0) {
			return 0;
		} else {
			return Math.round(($scope.ohitettu / $scope.kaikkityot) * 100);
		}
	};
	$scope.getProsentit = function() {
		if ($scope.kaikkityot == 0) {
			return 0;
		} else {
			return Math
					.round((($scope.tehty + $scope.ohitettu) / $scope.kaikkityot) * 100);
		}
	};
};
