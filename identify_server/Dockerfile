FROM openjdk:21-slim
WORKDIR /app
COPY target/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080

EXPOSE 8080

CMD ["java", "-jar", "app.jar", "--server.port=${PORT}"]