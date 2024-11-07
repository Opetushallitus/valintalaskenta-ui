package fi.vm.sade.valintalaskenta.configurations.security;

import fi.vm.sade.properties.OphProperties;
import fi.vm.sade.valintalaskenta.configurations.processor.ValintalaskentaUiCorsProcessor;
import fi.vm.sade.valintalaskenta.configurations.properties.CasProperties;
import fi.vm.sade.valintalaskenta.service.impl.ValintalaskentaUiUserDetailsServiceImpl;
import org.apereo.cas.client.session.HashMapBackedSessionMappingStorage;
import org.apereo.cas.client.session.SessionMappingStorage;
import org.apereo.cas.client.session.SingleSignOutFilter;
import org.apereo.cas.client.validation.Cas20ProxyTicketValidator;
import org.apereo.cas.client.validation.TicketValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.CasAuthenticationProvider;
import org.springframework.security.cas.web.CasAuthenticationEntryPoint;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableGlobalMethodSecurity(jsr250Enabled = false, prePostEnabled = true, securedEnabled = true)
@EnableWebSecurity
public class SecurityConfiguration {
    private CasProperties casProperties;
    private OphProperties ophProperties;
    private Environment environment;
    private SessionMappingStorage sessionMappingStorage;

    @Autowired
    public SecurityConfiguration(CasProperties casProperties, OphProperties ophProperties, Environment environment,
                                 SessionMappingStorage sessionMappingStorage) {
        this.casProperties = casProperties;
        this.ophProperties = ophProperties;
        this.environment = environment;
        this.sessionMappingStorage = sessionMappingStorage;
    }

    @Bean
    public ServiceProperties serviceProperties() {
        ServiceProperties serviceProperties = new ServiceProperties();
        serviceProperties.setService(casProperties.getService() + "/j_spring_cas_security_check");
        serviceProperties.setSendRenew(casProperties.getSendRenew());
        serviceProperties.setAuthenticateAllArtifacts(true);
        return serviceProperties;
    }

    //
    // CAS authentication provider (authentication manager)
    //
    @Bean
    public CasAuthenticationProvider casAuthenticationProvider() {
        CasAuthenticationProvider casAuthenticationProvider = new CasAuthenticationProvider();
        casAuthenticationProvider.setUserDetailsService(new ValintalaskentaUiUserDetailsServiceImpl());
        casAuthenticationProvider.setServiceProperties(serviceProperties());
        casAuthenticationProvider.setTicketValidator(ticketValidator());
        casAuthenticationProvider.setKey(casProperties.getKey());
        return casAuthenticationProvider;
    }

    @Bean
    public TicketValidator ticketValidator() {
        Cas20ProxyTicketValidator ticketValidator = new Cas20ProxyTicketValidator(ophProperties.url("cas.url"));
        ticketValidator.setAcceptAnyProxy(true);
        return ticketValidator;
    }

    //
    // CAS filter
    //
    @Bean
    public CasAuthenticationFilter casAuthenticationFilter(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        ValintalaskentaUiCasAuthenticationFilter casAuthenticationFilter = new ValintalaskentaUiCasAuthenticationFilter(serviceProperties());
        casAuthenticationFilter.setAuthenticationManager(authenticationConfiguration.getAuthenticationManager());
        casAuthenticationFilter.setFilterProcessesUrl("/j_spring_cas_security_check");
        return casAuthenticationFilter;
    }

    //
    // CAS single logout filter
    // requestSingleLogoutFilter is not configured because our users always sign out through CAS logout (using oppija-raamit
    // logout button) when CAS calls this filter if user has ticket to this service.
    //
    @Bean
    public SingleSignOutFilter singleSignOutFilter() {
        SingleSignOutFilter singleSignOutFilter = new SingleSignOutFilter();
        singleSignOutFilter.setIgnoreInitConfiguration(true);
        singleSignOutFilter.setSessionMappingStorage(sessionMappingStorage);
        return singleSignOutFilter;
    }

    @Bean
    public CasAuthenticationEntryPoint casAuthenticationEntryPoint() {
        CasAuthenticationEntryPoint casAuthenticationEntryPoint = new CasAuthenticationEntryPoint();
        casAuthenticationEntryPoint.setLoginUrl(ophProperties.url("cas.login"));
        casAuthenticationEntryPoint.setServiceProperties(serviceProperties());
        return casAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http, CasAuthenticationFilter casAuthenticationFilter) throws Exception {
        http.headers(headers -> headers.disable())
                .csrf(csrf -> csrf.disable())
                .authorizeRequests()
                .requestMatchers("/actuator/health")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .addFilter(casAuthenticationFilter)
                .exceptionHandling(eh -> eh.authenticationEntryPoint(casAuthenticationEntryPoint()))
                .addFilterBefore(singleSignOutFilter(), CasAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(Arrays.asList(
            ophProperties.url("url-virkailija"),
            "*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("caller-id"));
        source.registerCorsConfiguration("/**", configuration);
        CorsFilter corsFilter = new CorsFilter(source);
        ValintalaskentaUiCorsProcessor valintalaskentaUiCorsProcessor = new ValintalaskentaUiCorsProcessor();
        corsFilter.setCorsProcessor(valintalaskentaUiCorsProcessor);
        return corsFilter;
    }

}
