# Redmoore Systems

Public demo of a small warehouse cold-chain console for a fictional IoT company.

The app is a React SPA (React Router + TanStack Query) with a Laravel JSON API and Postgres. There are no user accounts. Fake data covers five UK logistics sites. The only write is acknowledging an alert.

This is a portfolio MVP, not a live product.

## Local setup

This project does **not** use Laravel Sail. PHP, Composer, and Node run on your machine. Docker is used only for Postgres.

```bash
cp .env.example .env
docker compose up -d
php artisan key:generate
php artisan migrate
npm install
npm run dev
```

In another terminal:

```bash
php artisan serve
```

Then open [http://localhost:8000](http://localhost:8000).

Postgres is published on host port **5434** (see `FORWARD_DB_PORT` in `.env`) so it does not clash with other local databases.

## Hosting

Intended for Render’s free web service and free Postgres. Render runs a normal Laravel build (`composer install`, `npm run build`, migrate). It does not use Sail. The site may sleep after 15 minutes idle; the first request after that can take about a minute.
