package fi.vm.sade.valintalaskenta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Profile("default")
public class ConfigController {
  private final Config config;

  @Autowired
  public ConfigController(Config config) {
    this.config = config;
  }

  @RequestMapping(
      value = "/configuration/configuration.js",
      method = RequestMethod.GET,
      produces = "text/javascript;charset=UTF-8")
  @ResponseBody
  public String index() {
    StringBuilder b = new StringBuilder();
    append(b, "TEMPLATE_URL_BASE", "");
    append(
        b,
        "SESSION_KEEPALIVE_INTERVAL_IN_SECONDS",
        Integer.toString(config.sessionKeepAliveIntervalInSeconds));
    append(
        b,
        "MAX_SESSION_IDLE_TIME_IN_SECONDS",
        Integer.toString(config.maxSessionIdleTimeInSeconds));
    if (!config.authMode.isEmpty()) {
      append(b, "AUTH_MODE", config.authMode);
    }
    append(
        b,
        "SHOW_TILA_HAKIJALLE_IN_SIJOITTELUN_TULOKSET",
        Boolean.toString(config.showTilaHakijalleInSijoittelunTulokset));
    return b.toString();
  }

  private void append(StringBuilder b, String key, String value) {
    b.append(key);
    b.append(" = \"");
    b.append(value);
    b.append("\";\n");
  }
}
