#
# Build stage
#
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Leverage build cache by copying pom first
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

# Now copy source and build
COPY src ./src
RUN mvn -q -DskipTests package

#
# Runtime stage
#
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add a non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy fat jar from builder
COPY --from=builder /app/target/*.jar /app/app.jar

# Expose app port
EXPOSE 8080

ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE=dev

USER app
ENTRYPOINT ["/bin/sh","-c","java $JAVA_OPTS -jar /app/app.jar"]


