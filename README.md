# FILM!

## Установка

### PostgreSQL

Установите PostgreSQL (или запустите в Docker) и создайте пользователя и базу:

    CREATE USER exampleuser WITH PASSWORD 'examplepass';
    CREATE DATABASE exampledb OWNER exampleuser;

Загрузите схему и тестовые данные из `backend/test`, по порядку:

    psql -U exampleuser -d exampledb -h localhost -f backend/test/prac.init.sql
    psql -U exampleuser -d exampledb -h localhost -f backend/test/prac.films.sql
    psql -U exampleuser -d exampledb -h localhost -f backend/test/prac.shedules.sql

### Бэкенд

Создайте файл `backend/.env` по образцу `backend/.env.example`:

* `DATABASE_DRIVER` - тип драйвера СУБД, в нашем случае `postgres`
* `DATABASE_URL` - строка подключения, например `postgres://127.0.0.1:5432/exampledb`
* `DATABASE_USERNAME` - пользователь БД
* `DATABASE_PASSWORD` - пароль пользователя БД

PostgreSQL должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.




