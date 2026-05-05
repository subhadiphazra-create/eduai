package com.eduai.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis configuration for the API Gateway.
 * Uses reactive Lettuce client for non-blocking Redis operations.
 *
 * Connection is fully autoconfigured by Spring Boot from application.yml
 * (spring.data.redis.*). We only define the template bean here to set
 * custom serializers (JSON values, String keys).
 *
 * Used for:
 * - Rate limiting per IP / per user
 * - JWT token blacklist (revoked tokens)
 * - Response caching (optional)
 */
@Configuration
public class RedisConfig {

    /**
     * Reactive Redis template with String keys and JSON values.
     * Spring Boot autoconfigures the ReactiveRedisConnectionFactory
     * from application.yml — we just inject it here.
     */
    @Bean
    public ReactiveRedisTemplate<String, Object> reactiveRedisTemplate(
            ReactiveRedisConnectionFactory factory) {

        StringRedisSerializer keySerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer valueSerializer = new GenericJackson2JsonRedisSerializer();

        RedisSerializationContext<String, Object> context =
                RedisSerializationContext.<String, Object>newSerializationContext(keySerializer)
                        .value(valueSerializer)
                        .hashKey(keySerializer)
                        .hashValue(valueSerializer)
                        .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}