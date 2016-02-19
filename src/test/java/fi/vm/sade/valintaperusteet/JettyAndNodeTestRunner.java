package fi.vm.sade.valintaperusteet;

import com.google.common.collect.ImmutableMap;
import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecuteResultHandler;
import org.apache.commons.exec.DefaultExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

public class JettyAndNodeTestRunner {
    private static final Logger LOG = LoggerFactory.getLogger(JettyAndNodeTestRunner.class);

    public static void main(String[] args) throws Exception {
        final CommandLine cmdLine = new CommandLine("node").addArgument("--harmony").addArgument("ui/valintalaskenta-ui/server/server.js");
        new DefaultExecutor().execute(cmdLine, ImmutableMap.of(
                "public_server", propertyOrEmptyString("public_server"),
                "kooste_server", propertyOrEmptyString("kooste_server")), new DefaultExecuteResultHandler());

        Thread.currentThread().join();
    }

    private static String propertyOrEmptyString(String property) {
        return Optional.ofNullable(System.getProperty(property)).orElse("");
    }
}
