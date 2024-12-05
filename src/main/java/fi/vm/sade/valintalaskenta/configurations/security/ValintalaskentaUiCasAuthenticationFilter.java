package fi.vm.sade.valintalaskenta.configurations.security;

import fi.vm.sade.java_utils.security.OpintopolkuCasAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.cas.ServiceProperties;

public class ValintalaskentaUiCasAuthenticationFilter extends OpintopolkuCasAuthenticationFilter {
  @Autowired
  public ValintalaskentaUiCasAuthenticationFilter(ServiceProperties serviceProperties) {
    super(serviceProperties);
    setAuthenticationDetailsSource(
        new ValintalaskentaUiServiceAuthenticationDetailsSource(serviceProperties));
  }
}
