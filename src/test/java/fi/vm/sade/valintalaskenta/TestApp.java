package fi.vm.sade.valintalaskenta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;

@SpringBootApplication
public class TestApp {

  @Bean
  public SecurityFilterChain filterChain(
      HttpSecurity http, CasAuthenticationFilter casAuthenticationFilter) throws Exception {
    HttpSessionRequestCache requestCache = new HttpSessionRequestCache();
    requestCache.setMatchingRequestParameterName(null);
    http.headers(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(authz -> authz.anyRequest().permitAll())
        .requestCache(cache -> cache.requestCache(requestCache));

    return http.build();
  }

  public static void main(String[] args) {
    // System.setProperty("server.servlet.context-path", "/valintalaskenta-ui");
    SpringApplication.run(TestApp.class, args);
  }
}
