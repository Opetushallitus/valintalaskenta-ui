function SeurantaIkkunaCtrl($scope, $modalInstance, oids, $window, $log,
		$interval, $routeParams, HakuModel,
		ValintalaskentaKerrallaHakukohteille,
		ValintalaskentaKerrallaAktivointi, Ilmoitus, IlmoitusTila,
		SeurantaPalvelu, ValintalaskentaKerrallaUudelleenYrita,
		SeurantaPalveluLataa) {
	$scope.uuid = oids.uuid;
	$scope.kaynnissa = false;
	$scope.nimi = HakuModel.getNimi();
	$scope.nimentarkennus = oids.nimentarkennus;
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
		if (!!window.EventSource) {
			$scope.paivitaSSE(uuid);
			$interval.cancel(timer);
			$log.info("SSE "+uuid+" keep alive timeri kaynnistetty");
			timer = $interval(function() {
				// keep alive SSE yhteyteen
				$scope.paivitaSSE(uuid);
			}, 10000);
		} else {
			update();
			$interval.cancel(timer);
			timer = $interval(function() {
				update();
			}, 10000);
		}
	};
	$scope.paivitaMuuttujat = function(r) {
		$scope.ohitettu = r.hakukohteitaKeskeytetty;
		$scope.tehty = r.hakukohteitaValmiina;
		$scope.kaikkityot = r.hakukohteitaYhteensa;
		if(r.tila == "VALMIS") {
			if ($scope.ohitettu + $scope.tehty == $scope.kaikkityot) {
				$scope.kaynnissa = false;
			}
		}
		//$scope.kaynnissa = (r.tila == "MENEILLAAN");
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
	$scope.reconnect = function(uuid) {
		$log.info("Yhdistetaan! " + uuid);
		$scope.source = new EventSource(SEURANTA_URL_BASE
				+ '/seuranta/yhteenveto/' + uuid + '/sse');
		$scope.source.addEventListener('message', function(e) {
			$scope.$apply(function() {
				var r = angular.fromJson(e.data);
				$scope.paivitaMuuttujat(r);
				if (!$scope.kaynnissa) {
					$log.info("SSE "+$scope.uuid+" suljetaan selaimen pyynnosta!");
					$scope.source.close();
				}
			});
		}, false);

		$scope.source.addEventListener('open', function(e) {
			$log.info("SSE "+uuid+" yhteys avattu");
		}, false);

		$scope.source.addEventListener('error', function(e) {
			if (e.readyState == EventSource.CLOSED) {
				$log.error("SSE "+uuid+" yhteys suljettu");
			}
		}, false);
	};
	$scope.paivitaSSE = function(uuid) {
		$scope.uuid = uuid;
		if($scope.source) {
			if($scope.source.readystate == EventSource.CLOSED || $scope.source.readyState == EventSource.CLOSED) {
				$log.info("SSE "+uuid+" uudelleen kaynnistys koska yhteys oli suljettu");
				$scope.reconnect(uuid);
			}
		} else {
			$scope.reconnect(uuid);
		}
	};
	$scope.paivitaForce = function(uuid) {
		$scope.paivitaPollaten(uuid);
	};
	$scope.uudelleenyritaForce = function() {
		ValintalaskentaKerrallaUudelleenYrita
				.uudelleenyrita(
						{
							uuid : $scope.uuid
						},
						function(uuid) {
							$scope.kaynnissa = true;
							$scope.paivitaForce(uuid.latausUrl);
						},
						function() {
							Ilmoitus
									.avaa(
											"Valintakoelaskenta epäonnistui",
											"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.",
											IlmoitusTila.ERROR);
						});
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
		var hakukohteet = oids.hakukohteet;
		if (!hakukohteet) {
			hakukohteet = [];
		}
		ValintalaskentaKerrallaHakukohteille
				.aktivoi(
						{
							hakuoid : oids.hakuOid,
							tyyppi : tyyppi,
							whitelist : whitelist,
							valinnanvaihe : oids.valinnanvaihe,
							valintakoelaskenta : oids.valintakoelaskenta,
						},
						hakukohteet,
						function(uuid) {
							$scope.kaynnissa = true;
							$scope.paivitaForce(uuid.latausUrl);
						},
						function() {
							Ilmoitus
									.avaa(
											"Valintakoelaskenta epäonnistui",
											"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon.",
											IlmoitusTila.ERROR);
						});
	}

	$scope.yhteenveto = function() {
		$window.open(VALINTALASKENTAKOOSTE_URL_BASE
				+ "resources//valintalaskentakerralla/status/" + $scope.uuid
				+ "/xls");
	};
	$scope.vieJsoniksi = function() {
		$window.open(SEURANTA_URL_BASE + "/seuranta/lataa/" + $scope.uuid);
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
