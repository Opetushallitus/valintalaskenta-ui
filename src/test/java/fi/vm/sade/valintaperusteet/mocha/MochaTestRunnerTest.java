package fi.vm.sade.valintaperusteet.mocha;

import fi.vm.sade.valintaperusteet.JettyTestRunner;
import org.junit.Test;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class MochaTestRunnerTest {

    @Test
    public void mochaTest() throws Exception {
        JettyTestRunner.start();
        String[] cmd = {"node_modules/mocha-phantomjs/bin/mocha-phantomjs", "-R", "spec", "http://localhost:" + JettyTestRunner.PORT + "/valintalaskenta-ui/test/runner.html"};
        Process ps = Runtime.getRuntime().exec(cmd);
        assertTrue(ps.waitFor(60, TimeUnit.SECONDS));
        assertEquals(0, ps.exitValue());
        JettyTestRunner.stop();
    }
}
