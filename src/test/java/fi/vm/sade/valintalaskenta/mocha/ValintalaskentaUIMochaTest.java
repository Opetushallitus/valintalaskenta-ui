package fi.vm.sade.valintalaskenta.mocha;

import static org.junit.jupiter.api.Assertions.*;

import fi.vm.sade.valintalaskenta.TestApp;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = TestApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ValintalaskentaUIMochaTest {
  public static final Duration MOCHA_TESTS_TIMEOUT = Duration.ofMinutes(2);

  @LocalServerPort private int port;

  @Test
  public void mochaTest() throws Exception {
    System.setProperty("front.baseUrl", "http://localhost:" + port);

    String runnerUrl = "http://localhost:" + port + "/valintalaskenta-ui/test/runner.html";

    String[] cmd = {
      "node_modules/mocha-headless-chrome/bin/start",
      "-t",
      Long.toString(MOCHA_TESTS_TIMEOUT.toMillis()),
      // "-v", // Uncomment this to show browser running tests
      "-f",
      runnerUrl
    };

    System.out.println(runnerUrl);

    ProcessBuilder pb = new ProcessBuilder(cmd);
    pb.inheritIO();
    Process ps = pb.start();
    assertTrue(ps.waitFor(120, TimeUnit.SECONDS));
    assertEquals(0, ps.exitValue());
  }
}
