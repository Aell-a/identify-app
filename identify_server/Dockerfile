FROM openjdk:17-alpine
WORKDIR /app
COPY /target/*.jar app.jar
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]