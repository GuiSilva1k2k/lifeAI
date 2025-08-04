#!/bin/sh

# O shell irá encerrar a execução do script quando um comando falhar
set -e

while ! nc -z $DB_HOST $DB_PORT; do
  echo "🟡 Waiting for Postgres Database Startup ($DB_HOST $DB_PORT) ..."
  sleep 2
done

echo "✅ Postgres Database Started Successfully ($DB_HOST:$DB_PORT)"

python manage.py collectstatic --noinput
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000