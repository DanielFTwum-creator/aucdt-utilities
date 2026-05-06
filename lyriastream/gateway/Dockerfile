FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /build
# Cache dependencies layer separately
COPY pom.xml .
RUN mvn dependency:go-offline -q
# Build
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
VOLUME ["/var/lyriastream/audio"]
EXPOSE 8080
HEALTHCHECK --interval=20s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
