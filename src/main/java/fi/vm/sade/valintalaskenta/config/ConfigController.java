package fi.vm.sade.valintalaskenta.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ConfigController {
    private final Config config;
    @Autowired
    public ConfigController(Config config) {
        this.config = config;
    }

    @RequestMapping(value = "/configuration.js", method = RequestMethod.GET, produces = "text/javascript", headers = "Accept=*/*")
    @ResponseBody
    public String index() {
        StringBuilder b = new StringBuilder();
        append(b, "LOCALISATION_URL_BASE", config.localisationUrl);
        append(b, "TARJONTA_URL_BASE", config.tarjontaServiceUrl);
        append(b, "VALINTAPERUSTEET_URL_BASE", config.valintaperusteetServiceUrl);
        append(b, "DOKUMENTTIPALVELU_URL_BASE", config.dokumenttipalveluUrl);
        append(b, "SEURANTA_URL_BASE", config.seurantaUrl);
        append(b, "VALINTALASKENTAKOOSTE_URL_BASE",
                config.valintalaskentakoostepalveluServiceUrl);
        append(b, "HAKEMUS_URL_BASE", config.hakemusServiceUrl);
        append(b, "AUTHENTICATION_HENKILOUI_URL_BASE", config.authenticationHenkiloUiUrl);
        append(b, "AUTHENTICATION_HENKILO_URL_BASE", config.authenticationHenkiloServiceUrl);
        append(b, "SIJOITTELU_URL_BASE", config.sijoitteluServiceUrl);
        append(b, "SERVICE_URL_BASE", config.valintalaskentaServiceUrl);
        append(b, "SIJOITTELU_EXCEL_URL_BASE", config.sijoitteluUrl);
        append(b, "SERVICE_EXCEL_URL_BASE", config.valintalaskentaUrl);
        append(b, "ORGANISAATIO_URL_BASE", config.organisaatioUrl);
        append(b, "HAKEMUS_UI_URL_BASE", config.hakemusUiUrl);
        append(b, "VIESTINTAPALVELU_URL_BASE", config.viestintapalveluUrl);
        append(b, "TEMPLATE_URL_BASE", "");
        append(b, "KOODISTO_URL_BASE", config.koodistoServiceRestURL);
        append(b, "OHJAUSPARAMETRIT_URL_BASE", config.ohjausparametripalveluRestUrl);
        append(b, "CAS_URL", config.casUrl);
        append(b, "CAS_ME_URL", config.casMeUrl);
        append(b, "SESSION_KEEPALIVE_INTERVAL_IN_SECONDS", Integer.toString(config.sessionKeepAliveIntervalInSeconds));
        append(b, "MAX_SESSION_IDLE_TIME_IN_SECONDS", Integer.toString(config.maxSessionIdleTimeInSeconds));
        if (!config.authMode.isEmpty()) {
            append(b, "AUTH_MODE", config.authMode);
        }
        append(b, "SHOW_TILA_HAKIJALLE_IN_SIJOITTELUN_TULOKSET", Boolean.toString(config.showTilaHakijalleInSijoittelunTulokset));
        return b.toString();
    }

    private void append(StringBuilder b, String key, String value) {
        b.append(key);
        b.append(" = \"");
        b.append(value);
        b.append("\";\n");
    }
}
