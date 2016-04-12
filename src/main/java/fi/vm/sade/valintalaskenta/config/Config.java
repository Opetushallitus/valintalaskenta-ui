package fi.vm.sade.valintalaskenta.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Config {
    @Value("${localisation.rest}")
    public String localisationUrl;

    @Value("${valintalaskenta-ui.tarjona-service-url.rest}")
    public String tarjontaServiceUrl;

    @Value("${valintalaskenta-ui.valintaperusteet-service-url.rest}")
    public String valintaperusteetServiceUrl;

    @Value("${valintalaskenta-ui.valintalaskentakoostepalvelu-service-url.rest}")
    public String valintalaskentakoostepalveluServiceUrl;

    @Value("${valintalaskenta-ui.hakemus-service-url.rest}")
    public String hakemusServiceUrl;

    @Value("${valintalaskenta-ui.hakemus-ui-url}")
    public String hakemusUiUrl;

    @Value("${valintalaskenta-ui.authentication-henkiloui-url}")
    public String authenticationHenkiloUiUrl;

    @Value("${valintalaskenta-ui.valintalaskenta-service-url.rest}")
    public String valintalaskentaServiceUrl;

    @Value("${valintalaskenta-ui.valintalaskenta-service-url.excel}")
    public String valintalaskentaUrl;

    @Value("${valintalaskenta-ui.sijoittelu-service-url.rest}")
    public String sijoitteluServiceUrl;

    @Value("${valintalaskenta-ui.sijoittelu-service-url.excel}")
    public String sijoitteluUrl;

    @Value("${organisaatio.api.rest.url}")
    public String organisaatioUrl;

    @Value("${auth.mode:}")
    public String authMode;

    @Value("${valintalaskenta-ui.cas.url:/cas/myroles}")
    public String casUrl;

    @Value("${valintalaskentakoostepalvelu.viestintapalvelu.url}")
    public String viestintapalveluUrl;

    @Value("${valintalaskentakoostepalvelu.dokumenttipalvelu.rest.url}")
    public String dokumenttipalveluUrl;

    @Value("${valintalaskentakoostepalvelu.seuranta.rest.url}")
    public String seurantaUrl;

    @Value("${valintalaskenta-ui.koodisto-service-url.rest}")
    public String koodistoServiceRestURL;

    @Value("${valintalaskentakoostepalvelu.parametriservice.rest.url}")
    public String ohjausparametripalveluRestUrl;

    @Value("${valintalaskenta-ui.session-keepalive-interval.seconds:10000}")
    public Integer sessionKeepAliveIntervalInSeconds;

    @Value("${valintalaskenta-ui.session-max-idle-time.seconds:10000}")
    public Integer maxSessionIdleTimeInSeconds;
}
