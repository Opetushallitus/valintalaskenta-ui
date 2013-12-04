package fi.vm.sade.valintalaskenta.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author kkammone
 */
@Controller
public class ConfigController {

    @Value("${valintalaskenta-ui.tarjona-service-url.rest}")
    private String tarjontaServiceUrl;

    @Value("${valintalaskenta-ui.valintaperusteet-service-url.rest}")
    private String valintaperusteetServiceUrl;

    @Value("${valintalaskenta-ui.valintalaskentakoostepalvelu-service-url.rest}")
    private String valintalaskentakoostepalveluServiceUrl;

    @Value("${valintalaskenta-ui.hakemus-service-url.rest}")
    private String hakemusServiceUrl;

    @Value("${valintalaskenta-ui.hakemus-ui-url}")
    private String hakemusUiUrl;

    @Value("${valintalaskenta-ui.valintalaskenta-service-url.rest}")
    private String valintalaskentaServiceUrl;

    @Value("${valintalaskenta-ui.valintalaskenta-service-url.excel}")
    private String valintalaskentaUrl;

    @Value("${valintalaskenta-ui.sijoittelu-service-url.rest}")
    private String sijoitteluServiceUrl;

    @Value("${valintalaskenta-ui.sijoittelu-service-url.excel}")
    private String sijoitteluUrl;

    @Value("${organisaatio.api.rest.url}")
    private String organisaatioUrl;

    @Value("${auth.mode:}")
    private String authMode;

    @Value("${valintalaskenta-ui.cas.url:/cas/myroles}")
    private String casUrl;

    @Value("${valintalaskentakoostepalvelu.viestintapalvelu.url}")
    private String viestintapalveluUrl;

    @Value("${valintalaskentakoostepalvelu.dokumenttipalvelu.rest.url}")
    private String dokumenttipalveluUrl;

    /**
     * Generoi javascriptia propertiesseista
     * 
     * @return
     */
    @RequestMapping(value = "/configuration.js", method = RequestMethod.GET, produces = "text/javascript")
    @ResponseBody
    public String index() {
        StringBuilder b = new StringBuilder();
        append(b, "TARJONTA_URL_BASE", tarjontaServiceUrl);
        append(b, "VALINTAPERUSTEET_URL_BASE", valintaperusteetServiceUrl);
        append(b, "DOKUMENTTIPALVELU_URL_BASE", dokumenttipalveluUrl);
        append(b, "VALINTALASKENTAKOOSTE_URL_BASE", valintalaskentakoostepalveluServiceUrl);
        append(b, "HAKEMUS_URL_BASE", hakemusServiceUrl);
        append(b, "SIJOITTELU_URL_BASE", sijoitteluServiceUrl);
        append(b, "SERVICE_URL_BASE", valintalaskentaServiceUrl);
        append(b, "SIJOITTELU_EXCEL_URL_BASE", sijoitteluUrl);
        append(b, "SERVICE_EXCEL_URL_BASE", valintalaskentaUrl);
        append(b, "ORGANISAATIO_URL_BASE", organisaatioUrl);
        append(b, "HAKEMUS_UI_URL_BASE", hakemusUiUrl);
        append(b, "VIESTINTAPALVELU_URL_BASE", viestintapalveluUrl);
        append(b, "TEMPLATE_URL_BASE", "");
        append(b, "CAS_URL", casUrl);
        if (!authMode.isEmpty()) {
            append(b, "AUTH_MODE", authMode);

        }

        return b.toString();
    }

    private void append(StringBuilder b, String key, String value) {
        b.append(key);
        b.append(" = \"");
        b.append(value);
        b.append("\";\n");
    }

}
