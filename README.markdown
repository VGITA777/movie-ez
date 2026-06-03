# MovieEz

A full-stack movie discovery app with a Spring Boot API and an Angular frontend.

## What is in this repo
- `backend/`: Spring Boot API (Java 25, Gradle) with security, JPA, caching, and PostgreSQL support.
- `frontend/`: Angular app (Angular CLI 21.2.8).
- `docker-compose.yaml`: Container wiring for the API and frontend, plus required secrets.

## Services (docker-compose)
- `movie-ez-api`: API service (exposes port 4000 inside the container).
- `movie-ez-frontend`: Frontend service (maps port 8081 on the host).

## Configuration
- Secrets are read from `secrets/` via Docker secrets (see `docker-compose.yaml`).
- The API integrates with TMDB and uses a PostgreSQL database and JWT auth (see `docker-compose.yaml` env vars).

