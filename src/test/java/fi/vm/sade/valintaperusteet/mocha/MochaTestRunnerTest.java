package fi.vm.sade.valintaperusteet.mocha;

import fi.vm.sade.valintaperusteet.JettyTestRunner;
import org.junit.Ignore;
import org.junit.Test;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@Ignore
public class MochaTestRunnerTest {

    @Test
    public void mochaTest() throws Exception {
        JettyTestRunner.start();
        String[] cmd = {"node_modules/phantomjs-prebuilt/bin/phantomjs", "node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js", "http://localhost:" + JettyTestRunner.PORT + "/valintalaskenta-ui/test/runner.html", "spec"};

        ProcessBuilder pb = new ProcessBuilder(cmd);
        pb.inheritIO();
        Process ps = pb.start();

        assertTrue(ps.waitFor(120, TimeUnit.SECONDS));
        assertEquals(0, ps.exitValue());
        JettyTestRunner.stop();
    }
}
