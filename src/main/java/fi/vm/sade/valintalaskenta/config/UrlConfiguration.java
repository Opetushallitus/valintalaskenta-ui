package fi.vm.sade.valintalaskenta.config;

import fi.vm.sade.properties.OphProperties;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Paths;

@Configuration
public class UrlConfiguration extends OphProperties {
    public UrlConfiguration() {
        addOptionalFiles(Paths.get(System.getProperties().getProperty("user.home"), "/oph-configuration/common.properties").toString());
    }
}
