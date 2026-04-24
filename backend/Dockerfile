# Download dependencies for the application
FROM dhi.io/gradle:9-jdk25-alpine3.22-dev AS builder
WORKDIR /app

COPY gradlew build.gradle settings.gradle ./
COPY ./gradle ./gradle

RUN --mount=type=cache,target=/root/.gradle \
      ./gradlew dependencies --no-daemon

COPY src ./src

RUN --mount=type=cache,target=/root/.gradle \
      ./gradlew bootJar -x test --no-daemon --configuration-cache

# Run the built application in a lightweight JRE image \
FROM dhi.io/eclipse-temurin:25-alpine3.22 AS runtime

WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 4000
ENTRYPOINT ["java", "-jar", "app.jar"]