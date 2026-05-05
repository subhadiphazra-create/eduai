# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Copy parent pom and module poms first (layer caching for dependencies)
COPY pom.xml                         ./pom.xml
COPY mailservice-client/pom.xml      ./mailservice-client/pom.xml
COPY mailservice-server/pom.xml      ./mailservice-server/pom.xml

# Copy source
COPY mailservice-client/src          ./mailservice-client/src
COPY mailservice-server/src          ./mailservice-server/src

# Install Maven wrapper (or use system Maven)
RUN apk add --no-cache maven

# Build (skip tests for image build; run tests in CI separately)
RUN mvn clean package -DskipTests --no-transfer-progress

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="EduAI Team <devops@eduai.com>"
LABEL description="EduAI Mail Microservice"
LABEL version="1.0.0"

# Non-root user for security
RUN addgroup -S mailservice && adduser -S mailservice -G mailservice

WORKDIR /app

# Copy fat jar from builder
COPY --from=builder /build/mailservice-server/target/mailservice-server-*.jar app.jar

# Log directory
RUN mkdir -p /var/log/eduai-mail-service && \
    chown -R mailservice:mailservice /app /var/log/eduai-mail-service

USER mailservice

# Port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8082/actuator/health || exit 1

# JVM tuning for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseG1GC \
               -XX:+OptimizeStringConcat \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.backgroundpreinitializer.ignore=true"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
