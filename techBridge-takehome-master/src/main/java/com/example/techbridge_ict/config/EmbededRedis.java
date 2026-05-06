package com.example.techbridge_ict.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import redis.embedded.RedisServer;


@Component
@Profile("test")
public class EmbededRedis {

    @Value("${spring.data.redis.port}")
    private  int  redisPort;
    private RedisServer redisServer;

    @PostConstruct
    public void startRedis() {
        redisServer = RedisServer.builder().port(redisPort).build();
        redisServer.start();
    }

    @PreDestroy
    public void stopRedis() {
        redisServer.stop();
    }

    public EmbededRedis port(int redisPort) {
        this.redisPort = redisPort;
        return this;
    }
}
