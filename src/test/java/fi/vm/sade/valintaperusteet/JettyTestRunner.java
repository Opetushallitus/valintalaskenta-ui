package fi.vm.sade.valintaperusteet;

import fi.vm.sade.integrationtest.util.ProjectRootFinder;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.webapp.WebAppContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.ServerSocket;

public class JettyTestRunner {
    private static final Logger LOG = LoggerFactory.getLogger(JettyTestRunner.class);
    public static final int PORT = portChecker();
    static final String ROOT = ProjectRootFinder.findProjectRoot() + "/ui/valintalaskenta-ui";
    static Server server = new Server(PORT);
    static WebAppContext webAppContext = new WebAppContext();

    private static void initServer(Server server) throws IOException {
        String[] resources = {ROOT + "/src/main/webapp", ROOT + "/src/test/webapp"};
        webAppContext.setBaseResource(
                new ResourceCollection(resources)
        );
        webAppContext.setContextPath("/valintalaskenta-ui");
        webAppContext.setDescriptor(ROOT + "/src/test/webapp/WEB-INF/web.xml");
        server.setHandler(webAppContext);
    }

    public static void start() throws Exception {
        initServer(server);
        server.start();
    }

    public static void stop() throws Exception {
        server.stop();
    }

    public static void main(String[] args) throws Exception {
        Server mainServer = new Server(8080);
        try {
            initServer(mainServer);
            mainServer.start();
            while (true) {
                Thread.sleep(200);
            }
        } catch (Exception e) {
            LOG.error("Something terrible happened during jetty startup {}", e);
        } finally {
            mainServer.stop();
        }
    }

    public static int portChecker() {
        try {
            ServerSocket socket = new ServerSocket(0);
            int port = socket.getLocalPort();
            socket.close();
            return port;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
