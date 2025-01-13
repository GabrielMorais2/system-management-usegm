package br.com.system.usegm.infra.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:5173", "http://localhost:3000", "https://system-management-usegm-1.onrender.com")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}