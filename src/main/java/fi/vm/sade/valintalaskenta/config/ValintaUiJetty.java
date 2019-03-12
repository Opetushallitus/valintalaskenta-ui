package fi.vm.sade.valintalaskenta.config;

import fi.vm.sade.jetty.OpintopolkuJetty;

public class ValintaUiJetty extends OpintopolkuJetty {
    public static void main(String... args) {
        new ValintaUiJetty().start("/valintalaskenta-ui");
    }
}
