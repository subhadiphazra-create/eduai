package com.eduai.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security configuration for the API Gateway.
 * Uses reactive Spring Security (WebFlux) since Gateway runs on Netty.
 *
 * JWT validation is done here at the gateway level before routing to downstream services.
 * Each downstream service also validates JWT independently for defense-in-depth.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    // TODO: Inject and use JwtAuthenticationFilter once implemented
    // @Autowired
    // private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Public endpoints that do not require authentication.
     * Extend this list as needed (e.g., /api/v1/public/**, Swagger UI paths).
     */
    private static final String[] PUBLIC_PATHS = {
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/actuator/health",
            "/actuator/info",
            "/api/v1/auth/verify-otp",
            "/api/v1/tasks/**"
    };

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        // Allow public endpoints without authentication
                        .pathMatchers(PUBLIC_PATHS).permitAll()
                        // TODO: Add role-based access rules below
                        // Example: .pathMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        // Example: .pathMatchers("/api/v1/tasks/**").hasAnyRole("USER", "ADMIN")
                        // All other requests require authentication
                        .anyExchange().authenticated()
                )
                // TODO: Add JWT authentication filter
                // .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
