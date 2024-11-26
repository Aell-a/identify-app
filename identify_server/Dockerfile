FROM openjdk:21-slim
WORKDIR /app
COPY target/*.jar app.jar
COPY env.properties env.properties
VOLUME /app/uploads
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]