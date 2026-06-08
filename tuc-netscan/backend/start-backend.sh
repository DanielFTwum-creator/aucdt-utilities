#!/bin/bash
exec /opt/jdk/jdk-21/bin/java -jar tuc-netscan-1.0.0.jar \
  --server.port=8085 \
  --spring.profiles.active=prod \
  --spring.datasource.username=aucdtadmin_dev \
  --spring.datasource.password='#4Dwsf07-dev' \
  --spring.datasource.url='jdbc:mariadb://localhost:3306/tuc_netscan?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC' \
  --spring.cache.type=redis \
  --spring.data.redis.host=localhost \
  --spring.data.redis.port=6379 \
  --netscan.jwt.secret=netscan-prod-secret-key-tuc-netscan-2026-very-secure \
  --netscan.mock.enabled=true \
  --spring.shell.interactive.enabled=false
