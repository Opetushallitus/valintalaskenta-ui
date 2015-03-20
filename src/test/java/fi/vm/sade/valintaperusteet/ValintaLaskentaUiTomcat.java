package fi.vm.sade.valintaperusteet;

import fi.vm.sade.integrationtest.tomcat.EmbeddedTomcat;
import fi.vm.sade.integrationtest.util.ProjectRootFinder;
import org.apache.catalina.LifecycleException;

import javax.servlet.ServletException;

public class ValintaLaskentaUiTomcat extends EmbeddedTomcat {
    static final String MODULE_ROOT = ProjectRootFinder.findProjectRoot() + "/ui/valintaLaskenta-ui";
    static final String CONTEXT_PATH = "/valintalaskenta-ui";
    static final int DEFAULT_PORT = 9096;
    static final int DEFAULT_AJP_PORT = 28530;

    public ValintaLaskentaUiTomcat(int port, int ajpPort) {
        super(port, ajpPort, MODULE_ROOT, CONTEXT_PATH);
    }

    public final static void main(String... args) throws ServletException, LifecycleException {
        useIntegrationTestSettingsIfNoProfileSelected();
        new ValintaLaskentaUiTomcat(
                Integer.parseInt(System.getProperty("/valintalaskenta-ui-app.port", String.valueOf(DEFAULT_PORT))),
                Integer.parseInt(System.getProperty("/valintalaskenta-ui-app.port.ajp", String.valueOf(DEFAULT_AJP_PORT)))
        ).start().await();
    }


    private static void useIntegrationTestSettingsIfNoProfileSelected() {
        System.setProperty("application.system.cache", "false");
        if (System.getProperty("spring.profiles.active") == null) {
            System.setProperty("spring.profiles.active", "it");
        }
        System.out.println("Running embedded with profile " + System.getProperty("spring.profiles.active"));
    }
}
