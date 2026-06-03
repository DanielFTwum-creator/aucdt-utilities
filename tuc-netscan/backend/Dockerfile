FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
RUN adduser -r -s /sbin/nologin netscan
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN apk add --no-cache nmap curl
USER netscan
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
