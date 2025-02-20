package com.example.airport.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import java.util.Arrays;
import org.springframework.security.config.Customizer;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(Arrays.asList("*"));
            config.setAllowCredentials(true); // Дозволити куки
            return config;
        }))
        .authorizeHttpRequests(auth -> auth
            .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .antMatchers("/api/sort-passengers").authenticated()
            .anyRequest().permitAll()
        )
        .httpBasic(withDefaults()) // Увімкнути Basic Auth
        .csrf(csrf -> csrf.disable()); // Вимкнути CSRF для API

    return http.build();
}
}