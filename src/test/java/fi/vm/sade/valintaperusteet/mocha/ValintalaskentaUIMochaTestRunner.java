package fi.vm.sade.valintaperusteet.mocha;

import com.google.gson.Gson;
import fi.vm.sade.valintaperusteet.JettyTestRunner;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ValintalaskentaUIMochaTestRunner {

    @Test
    public void mochaTest() throws Exception {
        JettyTestRunner.start();
        Map<String, Object> jsonConfs = new HashMap<>();
        jsonConfs.put("ignoreResourceErrors", true);

        Gson gson = new Gson();

        String[] cmd = {
                "node_modules/phantomjs-prebuilt/bin/phantomjs", "node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js",
                "http://localhost:" + JettyTestRunner.PORT + "/valintalaskenta-ui/test/runner.html",
                "spec", gson.toJson(jsonConfs)};

        System.out.println("http://localhost:" + JettyTestRunner.PORT + "/valintalaskenta-ui/test/runner.html");



        ProcessBuilder pb = new ProcessBuilder(cmd);
        pb.inheritIO();
        Process ps = pb.start();
        assertTrue(ps.waitFor(120, TimeUnit.SECONDS));
        assertEquals(0, ps.exitValue());
        JettyTestRunner.stop();
    }
}
