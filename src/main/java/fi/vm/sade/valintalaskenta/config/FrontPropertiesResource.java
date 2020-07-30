package fi.vm.sade.valintalaskenta.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class FrontPropertiesResource {

  private final UrlConfiguration urlConfiguration;

  @Autowired
  public FrontPropertiesResource(UrlConfiguration urlConfiguration) {
    Assert.notNull(urlConfiguration, "Instance of UrlConfiguration must not be null");
    this.urlConfiguration = urlConfiguration;
  }

  @RequestMapping(
      value = "/frontProperties.js",
      method = RequestMethod.GET,
      produces = "application/javascript;charset=UTF-8")
  @ResponseBody
  public String frontProperties() {
    return "window.urls.addOverrides(" + urlConfiguration.frontPropertiesToJson() + ");";
  }
}
