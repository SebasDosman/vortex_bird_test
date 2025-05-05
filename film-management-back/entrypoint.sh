#!/bin/sh

DB_HOST_NAME=$(echo $DB_HOST | cut -d: -f1)
DB_PORT=$(echo $DB_HOST | cut -d: -f2)

until nc -z $DB_HOST_NAME $DB_PORT; do
  echo "Database is unavailable - sleeping"
  sleep 3
done

echo "Database is up - executing command"

echo "DB_HOST: $DB_HOST"
echo "DB_NAME: $DB_NAME"
echo "DB_USER: $DB_USER"

java -jar app.jar