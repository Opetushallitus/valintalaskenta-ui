package fi.vm.sade.valintaperusteet;

import com.google.common.collect.ImmutableMap;
import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecuteResultHandler;
import org.apache.commons.exec.DefaultExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

/**
 * -Dkooste_server=http://localhost:8090
 * -Dpublic_server=https://itest-virkailija.oph.ware.fi
 */
public class NodeTestRunner {

    public static void startNodeJs() throws Exception {
        final CommandLine cmdLine = new CommandLine("node").addArgument("--harmony").addArgument("ui/valintalaskenta-ui/server/server.js");
        new DefaultExecutor().execute(cmdLine, ImmutableMap.of(
                "sijoittelu_server", propertyOrEmptyString("sijoittelu_server"),
                "public_server", propertyOrEmptyString("public_server"),
                "kooste_server", propertyOrEmptyString("kooste_server")), new DefaultExecuteResultHandler());
    }

    public static void main(String[] args) throws Exception {
        startNodeJs();
        Thread.currentThread().join();
    }

    private static String propertyOrEmptyString(String property) {
        return Optional.ofNullable(System.getProperty(property)).orElse("");
    }
}
