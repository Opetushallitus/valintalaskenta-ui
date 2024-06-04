window.urls.addProperties({
  'tarjonta-service.haku.find': 'tarjonta-service/rest/v1/haku/find',
  'tarjonta-service.haku.hakuoid': 'tarjonta-service/rest/v1/haku/$1',
  'tarjonta-service.haku.hakukohdetulos':
    'tarjonta-service/rest/v1/haku/$1/hakukohdeTulos',
  'tarjonta-service.hakukohde': 'tarjonta-service/rest/v1/hakukohde/$1',

  'tarjonta-app.hakukohde': 'tarjonta-app/index.html#/hakukohde/$1',

  'kouta-internal.auth.login': 'kouta-internal/auth/login',
  'kouta-internal.haku.search': 'kouta-internal/haku/search',
  'kouta-internal.haku': 'kouta-internal/haku/$1',
  'kouta-internal.hakukohde.search': 'kouta-internal/hakukohde/search',
  'kouta-internal.hakukohde': 'kouta-internal/hakukohde/$1',
  'kouta-internal.toteutus': 'kouta-internal/toteutus/$1',

  'kouta.hakukohde': 'kouta/hakukohde/$1',

  'valintaperusteet-service.buildversion':
    'valintaperusteet-service/buildversion.txt?auth',
  'valintaperusteet-service.hakukohde':
    'valintaperusteet-service/resources/hakukohde/$1',
  'valintaperusteet-service.hakukohde.avaimet':
    'valintaperusteet-service/resources/hakukohde/avaimet/$1',
  'valintaperusteet-service.hakukohde.ilmanlaskentaa':
    'valintaperusteet-service/resources/hakukohde/$1/ilmanlaskentaa',
  'valintaperusteet-service.hakukohde.valinnanvaihe':
    'valintaperusteet-service/resources/hakukohde/$1/valinnanvaihe',
  'valintaperusteet-service.hakukohde.valintakoe':
    'valintaperusteet-service/resources/hakukohde/$1/valintakoe',
  'valintaperusteet-service.hakukohde.valintaryhma':
    'valintaperusteet-service/resources/hakukohde/$1/valintaryhma',
  'valintaperusteet-service.puu': 'valintaperusteet-service/resources/puu',
  'valintaperusteet-service.valintakoe':
    'valintaperusteet-service/resources/valintakoe/$1',
  'valintaperusteet-service.valintatapajono':
    'valintaperusteet-service/resources/valintatapajono/$1',
  'valintaperusteet-service.valintatapajono.update':
    'valintaperusteet-service/resources/V2valintaperusteet/$1/automaattinenSiirto',

  'valintalaskentakoostepalvelu.dokumentit':
    'valintalaskentakoostepalvelu/resources/dokumentit/$1/$2',
  'valintalaskentakoostepalvelu.dokumentit.lataa':
    'valintalaskentakoostepalvelu/resources/dokumentit/lataa/$1',
  'valintalaskentakoostepalvelu.dokumenttiseuranta':
    'valintalaskentakoostepalvelu/resources/dokumentinseuranta/$1',

  'valintalaskentakoostepalvelu.buildversion':
    'valintalaskentakoostepalvelu/buildversion.txt?auth',
  'valintalaskentakoostepalvelu.status':
    'valintalaskentakoostepalvelu/resources/$1/status',
  'valintalaskentakoostepalvelu.dokumenttiprosessi':
    'valintalaskentakoostepalvelu/resources/dokumenttiprosessi/$1',
  'valintalaskentakoostepalvelu.erillishaku.tuonti.json':
    'valintalaskentakoostepalvelu/resources/erillishaku/tuonti/ui',
  'valintalaskentakoostepalvelu.erillishaku.tuonti':
    'valintalaskentakoostepalvelu/resources/erillishaku/tuonti',
  'valintalaskentakoostepalvelu.erillishaku.vienti':
    'valintalaskentakoostepalvelu/resources/erillishaku/vienti',
  'valintalaskentakoostepalvelu.hakuimport.aktivoi':
    'valintalaskentakoostepalvelu/resources/hakuimport/aktivoi',
  'valintalaskentakoostepalvelu.kela.aktivoi':
    'valintalaskentakoostepalvelu/resources/kela/aktivoi',
  'valintalaskentakoostepalvelu.kela.laheta':
    'valintalaskentakoostepalvelu/resources/kela/laheta',
  'valintalaskentakoostepalvelu.parametrit':
    'valintalaskentakoostepalvelu/resources/parametrit/$1',
  'valintalaskentakoostepalvelu.pistesyotto.hakukohde':
    'valintalaskentakoostepalvelu/resources/pistesyotto/koostetutPistetiedot/haku/$1/hakukohde/$2',
  'valintalaskentakoostepalvelu.pistesyotto.hakemus':
    'valintalaskentakoostepalvelu/resources/pistesyotto/koostetutPistetiedot/hakemus/$1',
  'valintalaskentakoostepalvelu.pistesyotto.tuonti':
    'valintalaskentakoostepalvelu/resources/pistesyotto/tuonti',
  'valintalaskentakoostepalvelu.pistesyotto.vienti':
    'valintalaskentakoostepalvelu/resources/pistesyotto/vienti',
  'valintalaskentakoostepalvelu.proxy.erillishaku.haku.hakukohde':
    'valintalaskentakoostepalvelu/resources/proxy/erillishaku/haku/$1/hakukohde/$2',
  'valintalaskentakoostepalvelu.proxy.valintatulos.haku.hakemusoid':
    'valintalaskentakoostepalvelu/resources/proxy/valintatulos/haku/$1/hakemusOid/$2',
  'valintalaskentakoostepalvelu.proxy.valintatulosservice.hakemus.haku':
    'valintalaskentakoostepalvelu/resources/proxy/valintatulosservice/hakemus/$1/haku/$2',
  'valintalaskentakoostepalvelu.proxy.valintatulosservice.hakemus.haku.hakukohde.valintatapajono':
    'valintalaskentakoostepalvelu/resources/proxy/valintatulosservice/hakemus/$1/haku/$2/hakukohde/$3/valintatapajono/$4',
  'valintalaskentakoostepalvelu.proxy.valintatulosservice.haku.hakukohde':
    'valintalaskentakoostepalvelu/resources/proxy/valintatulosservice/haku/$1/hakukohde/$2',
  'valintalaskentakoostepalvelu.proxy.valintatulosservice.ilmanhakijantilaa.haku.hakukohde':
    'valintalaskentakoostepalvelu/resources/proxy/valintatulosservice/ilmanhakijantilaa/haku/$1/hakukohde/$2',
  'valintalaskentakoostepalvelu.proxy.valintatulosservice.myohastyneet.haku.hakukohde':
    'valintalaskentakoostepalvelu/resources/proxy/valintatulosservice/myohastyneet/haku/$1/hakukohde/$2',
  'valintalaskentakoostepalvelu.proxy.valintatulosservice.tilahakijalle.haku.hakukohde.valintatapajono':
    'valintalaskentakoostepalvelu/resources/proxy/valintatulosservice/tilahakijalle/haku/$1/hakukohde/$2/valintatapajono/$3',
  'valintalaskentakoostepalvelu.proxy.viestintapalvelu.count.haku':
    'valintalaskentakoostepalvelu/resources/proxy/viestintapalvelu/count/haku/$1',
  'valintalaskentakoostepalvelu.proxy.viestintapalvelu.publish.haku':
    'valintalaskentakoostepalvelu/resources/proxy/viestintapalvelu/publish/haku/$1',
  'valintalaskentakoostepalvelu.session.maxinactiveinterval':
    'valintalaskentakoostepalvelu/resources/session/maxinactiveinterval',
  'valintalaskentakoostepalvelu.sijoitteluntuloshaulle.osoitetarrat':
    'valintalaskentakoostepalvelu/resources/sijoitteluntuloshaulle/osoitetarrat',
  'valintalaskentakoostepalvelu.sijoitteluntuloshaulle.taulukkolaskennat':
    'valintalaskentakoostepalvelu/resources/sijoitteluntuloshaulle/taulukkolaskennat',
  'valintalaskentakoostepalvelu.valintakoe.hakutoive':
    'valintalaskentakoostepalvelu/resources/valintakoe/hakutoive/$1',
  'valintalaskentakoostepalvelu.valintalaskentaexcel.sijoitteluntulos.aktivoi':
    'valintalaskentakoostepalvelu/resources/valintalaskentaexcel/sijoitteluntulos/aktivoi',
  'valintalaskentakoostepalvelu.valintalaskentaexcel.valintakoekutsut.aktivoi':
    'valintalaskentakoostepalvelu/resources/valintalaskentaexcel/valintakoekutsut/aktivoi',
  'valintalaskentakoostepalvelu.valintalaskentaexcel.valintalaskennantulos.aktivoi':
    'valintalaskentakoostepalvelu/resources/valintalaskentaexcel/valintalaskennantulos/aktivoi',
  'valintalaskentakoostepalvelu.valintalaskentakerralla.haku':
    'valintalaskentakoostepalvelu/resources/valintalaskentakerralla/haku/$1',
  'valintalaskentakoostepalvelu.valintalaskentakerralla.haku.tyyppi':
    'valintalaskentakoostepalvelu/resources/valintalaskentakerralla/haku/$1/tyyppi/$2',
  'valintalaskentakoostepalvelu.valintalaskentakerralla.haku.tyyppi.whitelist':
    'valintalaskentakoostepalvelu/resources/valintalaskentakerralla/haku/$1/tyyppi/$2/whitelist/$3',
  'valintalaskentakoostepalvelu.valintalaskentakerralla.status':
    'valintalaskentakoostepalvelu/resources/valintalaskentakerralla/status/$1',
  'valintalaskentakoostepalvelu.valitalaskentakerralla.status.xls':
    'valintalaskentakoostepalvelu/resources/valintalaskentakerralla/status/$1/xls',
  'valintalaskentakoostepalvelu.valintalaskentakerralla.uudelleenyrita':
    'valintalaskentakoostepalvelu/resources/valintalaskentakerralla/uudelleenyrita/$1',
  'valintalaskentakoostepalvelu.valintaperusteet.kayttaavalintalaskentaa':
    'valintalaskentakoostepalvelu/resources/valintaperusteet/hakukohde/$1/kayttaaValintalaskentaa',
  'valintalaskentakoostepalvelu.valintatapajonolaskenta.tuonti':
    'valintalaskentakoostepalvelu/resources/valintatapajonolaskenta/tuonti',
  'valintalaskentakoostepalvelu.valintatapajonolaskenta.vienti':
    'valintalaskentakoostepalvelu/resources/valintatapajonolaskenta/vienti',
  'valintalaskentakoostepalvelu.viestintapalvelu.hakukohteessahylatyt.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/hakukohteessahylatyt/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.hyvaksymiskirjeet.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/hyvaksymiskirjeet/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.jalkiohjauskirjeet.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/jalkiohjauskirjeet/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.koekutsukirjeet.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/koekutsukirjeet/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.osoitetarrat.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/osoitetarrat/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.osoitetarrat.hakemuksille.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/osoitetarrat/hakemuksille/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.osoitetarrat.sijoittelussahyvaksytyille.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/osoitetarrat/sijoittelussahyvaksytyille/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.securelinkit.aktivoi':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/securelinkit/aktivoi',
  'valintalaskentakoostepalvelu.viestintapalvelu.securelinkit.esikatselu':
    'valintalaskentakoostepalvelu/resources/viestintapalvelu/securelinkit/esikatselu?hakuOid=$1&kirjeenTyyppi=$2&asiointikieli=$3',
  'valintalaskentakoostepalvelu.harkinnanvaraisuus':
    'valintalaskentakoostepalvelu/resources/harkinnanvaraisuus/hakemuksille',
  'valintalaskentakoostepalvelu.hakukohteen.hakukohderyhmat':
    'valintalaskentakoostepalvelu/resources/parametrit/hakukohderyhmat/$1',

  'sijoittelu-service.buildversion': 'sijoittelu-service/buildversion.txt?auth',
  'sijoittelu-service.erillissijoittelu.sijoitteluajo.hakukohde':
    'sijoittelu-service/resources/erillissijoittelu/$1/sijoitteluajo/$2/hakukohde/$3',
  'sijoittelu-service.session.maxinactiveinterval':
    'sijoittelu-service/resources/session/maxinactiveinterval',
  'sijoittelu-service.sijoittelu':
    'sijoittelu-service/resources/sijoittelu/$1/',
  'sijoittelu-service.sijoittelu.sijoitteluajo':
    'sijoittelu-service/resources/sijoittelu/$1/sijoitteluajo/$2',
  'sijoittelu-service.sijoittelu.sijoitteluajo.hakemukset':
    'sijoittelu-service/resources/sijoittelu/$1/sijoitteluajo/$2/hakemukset',
  'sijoittelu-service.sijoittelu.sijoitteluajo.hakemus':
    'sijoittelu-service/resources/sijoittelu/$1/sijoitteluajo/$2/hakemus/$3',
  'sijoittelu-service.sijoittelu.sijoitteluajo.hakukohde':
    'sijoittelu-service/resources/sijoittelu/$1/sijoitteluajo/$2/hakukohde/$3',
  'sijoittelu-service.tila.haku.hakukohde.valintatapajono.valintaesitys':
    'sijoittelu-service/resources/tila/haku/$1/hakukohde/$2/valintatapajono/$3/valintaesitys',
  'sijoittelu-service.koostesijoittelu.aktivoi':
    'sijoittelu-service/resources/koostesijoittelu/aktivoi',
  'sijoittelu-service.koostesijoittelu.jatkuva':
    'sijoittelu-service/resources/koostesijoittelu/jatkuva/$1',
  'sijoittelu-service.koostesijoittelu.status':
    'sijoittelu-service/resources/koostesijoittelu/status/$1',

  'valintalaskenta-laskenta-service.buildversion':
    'valintalaskenta-laskenta-service/buildversion.txt?auth',
  'valintalaskenta-laskenta-service.hakemus':
    'valintalaskenta-laskenta-service/resources/hakemus/$1/$2',
  'valintalaskenta-laskenta-service.haku':
    'valintalaskenta-laskenta-service/resources/haku/$1/$2',
  'valintalaskenta-laskenta-service.hakukohde.hakijaryhma':
    'valintalaskenta-laskenta-service/resources/hakukohde/$1/hakijaryhma',
  'valintalaskenta-laskenta-service.hakukohde.valinnanvaihe':
    'valintalaskenta-laskenta-service/resources/hakukohde/$1/valinnanvaihe',
  'valintalaskenta-laskenta-service.harkinnanvarainenhyvaksynta':
    'valintalaskenta-laskenta-service/resources/harkinnanvarainenhyvaksynta/',
  'valintalaskenta-laskenta-service.harkinnanvarainenhyvaksynta.haku.hakemus':
    'valintalaskenta-laskenta-service/resources/harkinnanvarainenhyvaksynta/haku/$1/hakemus/$2',
  'valintalaskenta-laskenta-service.harkinnanvarainenhyvaksynta.haku.hakukohde':
    'valintalaskenta-laskenta-service/resources/harkinnanvarainenhyvaksynta/haku/$1/hakukohde/$2',
  'valintalaskenta-laskenta-service.jonosijahistoria':
    'valintalaskenta-laskenta-service/resources/jonosijahistoria/$1/$2',
  'valintalaskenta-laskenta-service.session.maxinactiveinterval':
    'valintalaskenta-laskenta-service/resources/session/maxinactiveinterval',
  'valintalaskenta-laskenta-service.valinnanvaihe.valintatapajono':
    'valintalaskenta-laskenta-service/resources/valinnanvaihe/$1/valintatapajono',
  'valintalaskenta-laskenta-service.valintakoe.hakemus':
    'valintalaskenta-laskenta-service/resources/valintakoe/hakemus/$1',
  'valintalaskenta-laskenta-service.valintatapajono.jonosija':
    'valintalaskenta-laskenta-service/resources/valintatapajono/$1/$2/$3/jonosija',
  'valintalaskenta-laskenta-service.valintatapajono.jarjestyskriteeritulos':
    'valintalaskenta-laskenta-service/resources/valintatapajono/$1/jarjestyskriteeritulos',
  'valintalaskenta-laskenta-service.valintatapajono.valmissijoiteltavaksi':
    'valintalaskenta-laskenta-service/resources/valintatapajono/$1/valmissijoiteltavaksi',
  'valintalaskenta-laskenta-service.seuranta.hae.tyyppi':
    'valintalaskenta-laskenta-service/resources/seuranta/hae/$1/tyyppi/$2',
  'valintalaskenta-laskenta-service.seuranta.lataa':
    'valintalaskenta-laskenta-service/resources/seuranta/lataa/$1',
  'valintalaskenta-laskenta-service.seuranta.yhteenveto':
    'valintalaskenta-laskenta-service/resources/seuranta/yhteenveto/$1',
  'valintalaskenta-laskenta-service.seuranta.yhteenvetokaikillelaskennoille':
    'valintalaskenta-laskenta-service/resources/seuranta/yhteenvetokaikillelaskennoille',

  'valinta-tulos-service.login': 'valinta-tulos-service/auth/login',
  'valinta-tulos-service.valinnan-tulos.haku':
    'valinta-tulos-service/auth/valinnan-tulos',
  'valinta-tulos-service.valinnan-tulos.tallennus':
    'valinta-tulos-service/auth/valinnan-tulos/$1',
  'valinta-tulos-service.hyvaksymiskirje':
    'valinta-tulos-service/auth/hyvaksymiskirje',
  'valinta-tulos-service.muutoshistoria':
    'valinta-tulos-service/auth/muutoshistoria',
  'valinta-tulos-service.sijoitteluntulos':
    'valinta-tulos-service/auth/sijoitteluntulos/$1/sijoitteluajo/$2/hakukohde/$3',
  'valinta-tulos-service.vastaanottoposti.lahetetty':
    'valinta-tulos-service/auth/vastaanottoposti',
  'valinta-tulos-service.vastaanottoposti.laheta.uudelleen.hakemukselle':
    'valinta-tulos-service/auth/emailer/run/hakemus/$1',
  'valinta-tulos-service.vastaanottoposti.laheta.uudelleen.jonolle':
    'valinta-tulos-service/auth/emailer/run/hakukohde/$1/valintatapajono/$2',
  'valinta-tulos-service.vastaanottoposti.laheta.uudelleen.hakukohteelle':
    'valinta-tulos-service/auth/emailer/run/hakukohde/$1',
  'valinta-tulos-service.sijoittelu.sijoitteluajo.hakukohde':
    'valinta-tulos-service/auth/sijoittelu/$1/sijoitteluajo/$2/hakukohde/$3',
  'valinta-tulos-service.sijoittelu.sijoitteluajo.hakemus':
    'valinta-tulos-service/auth/sijoittelu/$1/sijoitteluajo/$2/hakemus/$3',
  'valinta-tulos-service.sijoittelu.sijoitteluajo.perustiedot':
    'valinta-tulos-service/auth/sijoittelu/$1/sijoitteluajo/$2/perustiedot',
  'valinta-tulos-service.lukuvuosimaksut':
    'valinta-tulos-service/auth/lukuvuosimaksu/$1',
  'valinta-tulos-service.valinnantulos.hakemus':
    'valinta-tulos-service/auth/valinnan-tulos/hakemus/?hakemusOid=$1',
  'valinta-tulos-service.valintaesitys':
    'valinta-tulos-service/auth/valintaesitys',
  'valinta-tulos-service.valintaesitys.hyvaksytty':
    'valinta-tulos-service/auth/valintaesitys/$1/hyvaksytty',

  'organisaatio-service.organisaatio':
    'organisaatio-service/rest/organisaatio/$1',
  'organisaatio-service.organisaatio.hierarkia.hae':
    'organisaatio-service/rest/organisaatio/v2/hierarkia/hae',
  'organisaatio-service.organisaatio.parentoids':
    'organisaatio-service/rest/organisaatio/$1/parentoids',

  'haku-app.buildversion': 'haku-app/buildversion.txt?auth',
  'haku-app.applications': 'haku-app/applications',
  'haku-app.applications.oid': 'haku-app/applications/$1',
  'haku-app.application.oid.key': 'haku-app/applications/$1/$2',
  'haku-app.applications.eligibilities':
    'haku-app/applications/eligibilities/$1/$2',
  'haku-app.applications.list': 'haku-app/applications/list',
  'haku-app.applications.listfull': 'haku-app/applications/listfull',
  'ataru.application.review': 'lomake-editori/applications/search?term=$2',
  'ataru.applications': 'lomake-editori/api/external/valinta-ui',
  'ataru.login': 'lomake-editori/auth/cas',
  'haku-app.virkailija.hakemus.esikatselu':
    'haku-app/virkailija/hakemus/$1/esikatselu/$2',

  'viestintapalvelu.buildversion': 'viestintapalvelu/buildversion.txt?auth',
  'viestintapalvelu.letter.emailletterbatch':
    'viestintapalvelu/api/v1/letter/emailLetterBatch/$1',
  'viestintapalvelu.letter.previewletterbatchemail':
    'viestintapalvelu/api/v1/letter/previewLetterBatchEmail/$1',
  'viestintapalvelu.template.gethistory':
    'valintalaskentakoostepalvelu/resources/proxy/viestintapalvelu/template/getHistory',
  'viestintapalvelu-ui.report.letters':
    'viestintapalvelu-ui/#/reportLetters/$1',
  'viestintapalvelu-ui.report.messages':
    'viestintapalvelu-ui/#/reportMessages/view/$1',

  'koodisto-service.codeelement.codes.hakutapa':
    'koodisto-service/rest/codeelement/codes/hakutapa/$1',
  'koodisto-service.codeelement.codes.hakutyyppi':
    'koodisto-service/rest/codeelement/codes/hakutyyppi/$1',
  'koodisto-service.codeelement.codes.haunkohdejoukko':
    'koodisto-service/rest/codeelement/codes/haunkohdejoukko/$1',
  'koodisto-service.codeelement.codes.kausi':
    'koodisto-service/rest/codeelement/codes/kausi/$1',
  'koodisto-service.codeelement.codes.pohjakoulutus':
    'koodisto-service/rest/codeelement/codes/pohjakoulutustoinenaste/$1',
  'koodisto-service.codeelement.codes.ehdollisenHyvaksymisenEhto':
    'koodisto-service/rest/codeelement/codes/hyvaksynnanehdot/$1',
  'koodisto-service.hakukohdenimi': 'koodisto-service/rest/hakukohdenimi/$1',
  'koodisto-service.json.hakukohteet.koodi':
    'koodisto-service/rest/json/hakukohteet/koodi/$1',

  'cas.myroles': 'kayttooikeus-service/cas/myroles',
  'cas.me': 'kayttooikeus-service/cas/me',

  'ohjausparametrit-service.parametri':
    'ohjausparametrit-service/api/v1/rest/parametri/$1',

  'ohjausparametrit-service.parametri.oids':
    'ohjausparametrit-service/api/v1/rest/parametri/oids',

  'lokalisointi.localisation': 'lokalisointi/cxf/rest/v1/localisation',

  'henkilo-ui.henkilo': 'henkilo-ui/virkailija/$1',
  'henkilo-ui.henkilo.permissioncheckservice':
    'henkilo-ui/oppija/$1?permissionCheckService=$2',
  'oppijanumerorekisteri-service.henkilo':
    'oppijanumerorekisteri-service/henkilo/$1',

  'oppijanumerorekisteri-service.login':
    'oppijanumerorekisteri-service/cas/prequel',

  'virkailija-raamit.apply': 'virkailija-raamit/apply-raamit.js',
})
