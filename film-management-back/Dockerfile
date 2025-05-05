FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
COPY ${FIREBASE_CREDENTIALS_PATH} ./${FIREBASE_CREDENTIALS_PATH}
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/${FIREBASE_CREDENTIALS_PATH} ./${FIREBASE_CREDENTIALS_PATH}
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENV DB_NAME=films_db
ENV DB_HOST=db:5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV MAIL_HOST=smtp.example.com
ENV MAIL_PORT=587
ENV MAIL_USERNAME=user@example.com
ENV MAIL_PASSWORD=password
ENV FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
ENV FIREBASE_BUCKET_NAME=your-bucket-name

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]