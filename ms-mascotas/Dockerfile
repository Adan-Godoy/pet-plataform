# --- Etapa 1: Build Base (compatible) ---
FROM maven:3.9.6-eclipse-temurin-17 AS base
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src

# --- Etapa 2: Test y Package ---
FROM base AS test_and_package
WORKDIR /app
RUN mvn verify

# --- Etapa 3: Production Run (ligera) ---
FROM eclipse-temurin:17-jre-alpine AS production-run 
WORKDIR /app
COPY --from=test_and_package /app/target/ms-mascotas-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]