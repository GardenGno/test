# Wishlist Backend (NestJS)

Backend для праздничного сайта вишлистов. В проекте реализованы:

- регистрация и вход пользователей (JWT)
- профили с именем, датой рождения и списком подарков
- приоритет подарков от 1 до 5 ("огонечки")
- друзья и обмен списками подарков
- роли пользователей (user/admin)
- Swagger-документация

## Быстрый старт

1. Скопируйте `.env.example` в `.env` и заполните подключение к Postgres.
2. Установите зависимости и запустите сервер.

```bash
npm install
npm run start:dev
```

Swagger будет доступен по адресу `http://localhost:3000/docs`.

## Основные эндпоинты

- `POST /auth/register` — регистрация
- `POST /auth/login` — вход
- `GET /users/me` — профиль пользователя
- `PATCH /users/me` — обновление профиля
- `GET /users/search?name=...` — поиск друзей
- `POST /gifts` — добавить подарок
- `GET /gifts/me` — мои подарки
- `GET /gifts/:id` — карточка подарка
- `POST /friends/request` — запрос дружбы
- `PATCH /friends/accept/:id` — принять запрос
- `GET /friends` — список друзей
