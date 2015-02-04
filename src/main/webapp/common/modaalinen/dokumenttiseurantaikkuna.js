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
	}
	$scope.isKaynnissa = function() { // onko ajossa tai onko mielekasta enaa
		// ajaakkaan
		return $scope.uuid == null || $scope.kaynnissa;
	};
	$scope.reconnect = function(uuid) {
		$log.info("Yhdistetaan! " + uuid);
		$scope.source = new EventSource(SEURANTA_URL_BASE
				+ '/dokumentinseuranta/' + uuid + '/sse');
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
		$log.info("Toteuttamatta");
		/*
		ValintalaskentaKerrallaUudelleenYrita
				.uudelleenyrita(
						{
							uuid : $scope.uuid
						},
						function(uuid) {
							$scope.kaynnissa = true;
							$scope.paivitaForce(uuid.latausUrl);
						},
						function(err) {
							Ilmoitus
									.avaa(
											"Valintakoelaskenta epäonnistui",
											"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon. " + err.data,
											IlmoitusTila.ERROR);
						});
		*/
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
		/*
		ValintalaskentaKerrallaHakukohteille
				.aktivoi(
						{
							hakuoid : oids.hakuOid,
							tyyppi : tyyppi,
							erillishaku: oids.erillishaku,
							whitelist : whitelist,
							valinnanvaihe : oids.valinnanvaihe,
							valintakoelaskenta : oids.valintakoelaskenta,
						},
						hakukohteet,
						function(uuid) {

						},
						function(err) {
							Ilmoitus
									.avaa(
											"Valintakoelaskenta epäonnistui",
											"Valintakoelaskenta epäonnistui! Taustapalvelu saattaa olla alhaalla. Yritä uudelleen tai ota yhteyttä ylläpitoon. " + err.data,
											IlmoitusTila.ERROR);
						});
		*/
	}

	var update = function() {
		if ($scope.uuid != null) {
			DokumenttiSeurantaPalvelu.hae({
				uuid : $scope.uuid
			}, function(r) {
				$scope.paivitaMuuttujat(r);
				if ($scope.isKokonaanValmis() || $scope.isKokonaanKeskeytetty()) {
					$interval.cancel(timer);
				}
			});
		}
	};

	$scope.ok = function() {
		if (timer) {
			$interval.cancel(timer);
		}
		if ($scope.source) {
			$log.info("SSE "+$scope.uuid+" suljetaan selaimen pyynnosta!");
			$scope.source.close();
		}
		oids.ok();
		$log.info("TODO Peruuta keskenerainen");
		/*
		 $scope.peruuta = function() {
		 if (!$scope.disabloikeskeyta) {
		 $scope.disabloikeskeyta = true;
		 $log.info("Keskeytyspyynto TODO");

		 ValintalaskentaKerrallaAktivointi.keskeyta({
		 hakuoid : $scope.uuid
		 });

		 }
		 };
		 */
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
