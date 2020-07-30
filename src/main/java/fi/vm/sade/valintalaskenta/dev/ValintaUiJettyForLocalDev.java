package fi.vm.sade.valintalaskenta.dev;

import static fi.vm.sade.valintalaskenta.config.ValintaUiJetty.CONTEXT_PATH;
import static fi.vm.sade.valintalaskenta.config.ValintaUiJetty.JETTY;

import java.time.Duration;

public class ValintaUiJettyForLocalDev {
  private static final int port =
      Integer.parseInt(System.getProperty("valintalaskenta-ui.port", "8083"));

  public static void main(String... args) {
    JETTY.start(CONTEXT_PATH, port, 1, 10, Duration.ofMinutes(1));
  }
}
