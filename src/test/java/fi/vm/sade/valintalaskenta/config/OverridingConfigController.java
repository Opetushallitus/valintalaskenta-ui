package fi.vm.sade.valintalaskenta.config;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import com.google.common.collect.ImmutableMap;
import com.google.common.io.Resources;
import org.apache.commons.io.Charsets;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.net.URL;
import java.util.*;

@Controller
public class OverridingConfigController {
    private final String configurationJs;
    public OverridingConfigController() throws IOException {
        this.configurationJs = toString(Resources.getResource("configuration.js"));
    }

    @RequestMapping(value = "/configuration.js", method = RequestMethod.GET, produces = "text/javascript", headers = "Accept=*/*")
    @ResponseBody
    public String index() {
        return configurationJs;
    }

    private static String toString(URL url) {
        try {
            return Resources.toString(url, Charsets.UTF_8);
        }catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }
}

