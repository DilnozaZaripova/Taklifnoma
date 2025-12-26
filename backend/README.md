# Taklifnoma Backend Deployment Guide (Docker)

This guide explains how to deploy the Taklifnoma professional backend using Docker and Docker Compose.

## Prerequisites
- Docker and Docker Compose installed on your system.
- Gemini API Key from Google AI Studio.

## Quick Start (Development/Production)

1. **Configure Environment Variables**:
   Copy the example file and fill in your actual credentials:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `GEMINI_API_KEY` and `JWT_SECRET` are set correctly.*

2. **Launch the Stack**:
   Run the following command to build and start the containers in detached mode:
   ```bash
   docker compose up -d --build
   ```

3. **Verify Services**:
   Check if the containers are running:
   ```bash
   docker ps
   ```
   The backend should be accessible at `http://localhost:5000` (or the port defined in `.env`).

4. **Health Check**:
   Test the API health:
   ```bash
   curl http://localhost:5000/health
   ```

## Services Overview
- **backend**: Node.js Express application running in a multi-stage production container.
- **db**: PostgreSQL 15 database with persistent volume (`postgres_data`).

## Maintenance
- **View Logs**: `docker compose logs -f backend`
- **Stop Services**: `docker compose down`
- **Rebuild**: `docker compose up -d --build`

## Production Notes
- The database is only accessible within the internal Docker network for security.
- Persistent volumes ensure data safety during container restarts.
- The backend waits for the database to be healthy before starting.
