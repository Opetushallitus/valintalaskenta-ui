package fi.vm.sade.valintalaskenta.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletResponse;

/**
 * User: tommiha
 * Date: 2/15/13
 * Time: 2:43 PM
 */
@Controller
public class ConfigController {

    @Value("${valintalaskenta-ui.tarjona-service-url.rest}")
    private String tarjontaServiceUrl;

    @Value("${valintalaskenta-ui.valintaperusteet-service-url.rest}")
    private String valintaperusteetServiceUrl;

    @Value("${valintalaskenta-ui.valintalaskentakoostepalvelu-service-url.rest}")
    private String valintalaskentakoostepalveluServiceUrl;

    @Value("${valintalaskenta-ui.hakemus-service-url.rest}")
    private String hakemusServiceUrl;

    @Value("${valintalaskenta-ui.valintalaskenta-service-url.rest}")
    private String valintalaskentaServiceUrl;


    @Value("${valintalaskenta-ui.sijoittelu-service-url.rest}")
    private String sijoitteluServiceUrl;


    @RequestMapping(value="/configuration.js", method = RequestMethod.GET, produces="text/javascript")
    @ResponseBody
    public String index(HttpServletResponse response) {
       // response.setContentType("text/javascript");
      //  response.setCharacterEncoding("UTF-8");
        StringBuilder b = new StringBuilder();
        append(b, "TARJONTA_URL_BASE", tarjontaServiceUrl);
        append(b, "VALINTAPERUSTEET_URL_BASE ", valintaperusteetServiceUrl);
        append(b, "VALINTALASKENTAKOOSTE_URL_BASE", valintalaskentakoostepalveluServiceUrl);
        append(b, "HAKEMUS_URL_BASE", hakemusServiceUrl);
        append(b, "SIJOITTELU_URL_BASE", sijoitteluServiceUrl);
        append(b, "SERVICE_URL_BASE", valintalaskentaServiceUrl);
        append(b, "TEMPLATE_URL_BASE", "");
        /*
        try{
            PrintWriter out = response.getWriter();
            out.println(b.toString());
            out.close();
        }
        catch(IOException ex){
          ex.printStackTrace();
        }
            //response.getWriter().print(b.toString());
            //return b.toString();
            */
        return b.toString();

        }

    private void append(StringBuilder b, String key, String value) {
        b.append(key);
        b.append( " = \"");
        b.append(value);
        b.append("\";\n");
    }

}
