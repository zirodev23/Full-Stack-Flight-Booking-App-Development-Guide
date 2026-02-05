# Full Stack `Flight Booking App` Development Guide

## Main goals

- AI agents integration in development process (boilerplate code generation)
- Database design and normalization
- Laravel full stack development
- Team collaboration

## Project Overview

Each group will develop a full-stack flight booking application using Laravel with either `Blade` templates or `Inertia + React` for the frontend. The project will cover main aspects of modern web development.

## Phase 1: Project Setup

### 1.1 New Laravel Project Creation

```
laravel new flight-booking-app
cd flight-booking-app
```

### 1.2 Environment Configuration

- Setup new Git repository for the project and keep track of changes (CI pipeline, easy code rollbacks)
- Configure `.env` with database settings for MySQL database
- Install (via NPM) and setup `Qwen Code` AI command line agentic tool for whole codebase analysis and code generation

### 1.3 Frontend Choice Decision

- **Option A**: Blade templates with Tailwind CSS or Bootstrap CSS
- **Option B**: Inertia.js with React and Tailwind CSS

## Phase 2: Database Schema Design

### 2.1 Normalized Database Schema

- Collect all data fields from sample application
- Create normalized database model with `draw.io` online tool

### 2.2 Database Migrations

- Create migration files for each table in Laravel app
- Define relationships (foreign keys) in migrations

## Phase 3: Eloquent Models Creation

- Create models for each entity
- Define relationships between models

## Phase 4: CRUD Operations and Frontend

** Flight and Booking data loaded via Database Seeder (no admin panel or any authentication needed) **

- Flight search form
- Booking creation
- Booking management (view, cancel)

## Phase 5: Testing Strategy

- Generate Github.com workflow (CI pipeline) for unit testing only (no code linter)
- Create simple Unit tests
- Push changes to Github and make sure CI pipeline works as expected

## Phase 6: Presentation

- Architecture decisions
- Technical challenges overcome
- Features implemented
- Lessons learned
