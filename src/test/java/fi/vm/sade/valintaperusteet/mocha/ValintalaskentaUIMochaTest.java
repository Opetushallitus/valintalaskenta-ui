package fi.vm.sade.valintaperusteet.mocha;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import fi.vm.sade.valintaperusteet.JettyTestRunner;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import org.junit.Test;

public class ValintalaskentaUIMochaTest {
  public static final Duration MOCHA_TESTS_TIMEOUT = Duration.ofMinutes(2);

  @Test
  public void mochaTest() throws Exception {
    System.setProperty("front.baseUrl", "http://localhost:" + JettyTestRunner.PORT);
    JettyTestRunner.start();

    String[] cmd = {
      "node_modules/mocha-headless-chrome/bin/start",
      "-t",
      Long.toString(MOCHA_TESTS_TIMEOUT.toMillis()),
      // "-v", // Uncomment this to show browser running tests
      "-f",
      "http://localhost:" + JettyTestRunner.PORT + "/valintalaskenta-ui/test/runner.html"
    };

    System.out.println(
        "http://localhost:" + JettyTestRunner.PORT + "/valintalaskenta-ui/test/runner.html");

    ProcessBuilder pb = new ProcessBuilder(cmd);
    pb.inheritIO();
    Process ps = pb.start();
    assertTrue(ps.waitFor(120, TimeUnit.SECONDS));
    assertEquals(0, ps.exitValue());
    JettyTestRunner.stop();
  }
}
