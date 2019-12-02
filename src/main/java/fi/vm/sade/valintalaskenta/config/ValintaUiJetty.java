package fi.vm.sade.valintalaskenta.config;

import fi.vm.sade.jetty.OpintopolkuJetty;

public class ValintaUiJetty extends OpintopolkuJetty {
    public static final ValintaUiJetty JETTY = new ValintaUiJetty();
    public static final String CONTEXT_PATH = "/valintalaskenta-ui";

    public static void main(String... args) {
        JETTY.start(CONTEXT_PATH);
    }
}
