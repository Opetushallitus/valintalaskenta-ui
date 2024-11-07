package fi.vm.sade.valintalaskenta.configurations.security;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.web.authentication.ServiceAuthenticationDetails;
import org.springframework.security.cas.web.authentication.ServiceAuthenticationDetailsSource;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

public class ValintalaskentaUiServiceAuthenticationDetailsSource
    extends ServiceAuthenticationDetailsSource {
  private static final Logger logger =
      LoggerFactory.getLogger(ValintalaskentaUiServiceAuthenticationDetailsSource.class);

  public ValintalaskentaUiServiceAuthenticationDetailsSource(ServiceProperties serviceProperties) {
    super(serviceProperties);
  }

  @Override
  public ServiceAuthenticationDetails buildDetails(HttpServletRequest request) {
    return new ValintalaskentaUiServiceAuthenticationDetails(request);
  }

  public static class ValintalaskentaUiServiceAuthenticationDetails extends WebAuthenticationDetails
      implements ServiceAuthenticationDetails {
    private final String serviceUrl;

    public ValintalaskentaUiServiceAuthenticationDetails(HttpServletRequest request) {
      super(request);
      logger.debug(
          "Got request: " + request.getRequestURL().toString() + " setting this as serviceUrl");
      this.serviceUrl = request.getRequestURL().toString();
    }

    @Override
    public String getServiceUrl() {
      return serviceUrl;
    }
  }
}
