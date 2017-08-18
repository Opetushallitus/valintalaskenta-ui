package fi.vm.sade.valintalaskenta.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Config {

    @Value("${auth.mode:}")
    public String authMode;

    @Value("${valintalaskenta-ui.session-keepalive-interval.seconds:10000}")
    public Integer sessionKeepAliveIntervalInSeconds;

    @Value("${valintalaskenta-ui.session-max-idle-time.seconds:10000}")
    public Integer maxSessionIdleTimeInSeconds;

    @Value("${valintalaskenta-ui.sijoitteluntulokset.show-tila-hakijalle:true}")
    public boolean showTilaHakijalleInSijoittelunTulokset;

    @Value("${valintalaskenta-ui.read-from-valintarekisteri:false}")
    public boolean readFromValintarekisteri;
}
