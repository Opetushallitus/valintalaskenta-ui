package fi.vm.sade.valintalaskenta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

  public static void main(String[] args) {
    System.setProperty("server.servlet.context-path", "/valintalaskenta-ui");
    SpringApplication.run(App.class, args);
  }
}
