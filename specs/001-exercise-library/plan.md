# Implementation Plan: Exercise Library

**Branch**: `001-exercise-library` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-exercise-library/spec.md`

## Summary

Build the authenticated Exercise Library MVP for GymFlow. Users will browse predefined exercises, search and combine fixed filters, view exercise details, manage private favorites, and create/edit/delete only their own custom exercises. The implementation will use a modular React/TypeScript single-page frontend and an Express/TypeScript REST backend with relational persistence, server-side validation, and ownership authorization.

## Technical Context

**Language/Version**: TypeScript on Node.js LTS for the backend and React 18+ with TypeScript for the frontend.

**Primary Dependencies**:
- Frontend: React, React Router, an HTTP client, React Testing Library, Vitest.
- Backend: Express, Zod or equivalent runtime validation, authentication middleware, Prisma or an equivalent SQL migration/query tool, Pino or equivalent structured logging.
- Shared: TypeScript, ESLint, Prettier, environment-variable configuration.

**Storage**: PostgreSQL in production and SQLite for MVP/local development. The relational schema will enforce exercise ownership and favorite uniqueness.

**Testing**:
- Backend: Vitest for unit and integration tests, Supertest for HTTP contract tests.
- Frontend: Vitest and React Testing Library for component, interaction, form, loading, empty, and error-state tests.

**Target Platform**: Desktop and mobile web browsers from 320 px to 1920 px.

**Project Type**: Full-stack web application with separate frontend and backend projects.

**Performance Goals**: Combined search/filter results for up to 1,000 accessible exercises within 2 seconds in at least 95% of measured sessions.

**Constraints**: Mobile-first, WCAG 2.1 AA, persistent light/dark preferences, fixed taxonomy values, client and server validation, and consistent REST error responses.

**Scale/Scope**: Single authenticated user domains for the MVP exercise library only. No workout plans, rotation, logging, history, analytics, or calendar behavior belongs in this feature.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|---|---|---|
| React + Node.js/Express architecture | Pass | Frontend and backend choices match constitution |
| PostgreSQL/SQLite relational data | Pass | Exercise, muscle, owner, and favorite relationships are modeled relationally |
| RESTful APIs and consistent status codes | Pass | Defined contracts use 400, 401, 403, 404, 500 and a shared error payload |
| Template/history separation | Pass | Exercise configuration is isolated from logs and no workout-history mutation is planned |
| Authentication and secrets | Pass | Protected endpoints use auth middleware; secrets remain environment configuration |
| Custom exercise privacy | Pass | Every custom CRUD/read operation is owner- or server-authorized |
| Predefined read-only behavior | Pass | Seeded source records reject user create/edit/delete operations |
| Mobile-first and accessible UI | Pass | Responsive layout, semantic controls, keyboard interaction, and ARIA requirements |
| Validation and quality gates | Pass | Zod/runtime validation, RTL/Vitest/Supertest, loading/empty/error tests |
| Domain scope | Pass | Only exercise library functionality is included |

## Architecture

### Backend

Use an Express application organized around modular domains:

- `auth` middleware resolves the authenticated user for every route.
- `features/exercises` owns routes, controllers, services, validation, repositories, taxonomy constants, and types.
- `middleware/error` maps domain and validation failures to the standard API error shape.
- `middleware/requestValidation` validates query parameters and request bodies before controller execution.
- `data` owns database configuration, migrations, seed data, and database client lifecycle.

Recommended flow:

```text
React feature service → Express route → auth/validation middleware
→ exercise controller → exercise service → exercise repository → relational database
```

Repositories stay responsible for SQL and transaction boundaries. Services enforce ownership and source rules. Controllers only translate HTTP inputs/outputs. This keeps privacy and read-only rules testable below the transport layer.

### Frontend

Use a single exercise-library state boundary with reusable components and TanStack Query or an equivalent request cache if adopted during implementation. State ownership should remain explicit:

- The library page owns search/filter/pagination state.
- An exercise-detail view owns selected-exercise loading and unavailable-media state.
- Custom-exercise forms own draft fields and field-level validation.
- Favorite state is updated through one mutation and reconciled from server response or invalidation.

Persistent theme preference is stored through the existing user preference mechanism. If no preference mechanism exists yet, the plan will add only the minimal persisted client preference required by this feature.

## Project Structure

### Documentation

```text
specs/001-exercise-library/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── spec.md
└── contracts/
    └── exercise-library-api.md
```

### Source Code

```text
backend/
├── src/
│   ├── features/
│   │   └── exercises/
│   │       ├── exercise.routes.ts
│   │       ├── exercise.controller.ts
│   │       ├── exercise.service.ts
│   │       ├── exercise.repository.ts
│   │       ├── exercise.validation.ts
│   │       ├── exercise.types.ts
│   │       └── exercise.mappers.ts
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── validate.ts
│   │   └── error-handler.ts
│   └── data/
│       ├── database.ts
│       ├── migrations/
│       └── seeds/
└── tests/
    ├── unit/
    ├── contract/
    └── integration/

frontend/
├── src/
│   ├── features/
│   │   └── exercises/
│   │       ├── components/
│   │       │   ├── ExerciseCard.tsx
│   │       │   ├── ExerciseDetail.tsx
│   │       │   ├── ExerciseFilters.tsx
│   │       │   ├── ExerciseSearch.tsx
│   │       │   ├── FavoriteButton.tsx
│   │       │   └── ExerciseForm.tsx
│   │       ├── pages/
│   │       │   ├── ExerciseLibraryPage.tsx
│   │       │   └── ExerciseDetailPage.tsx
│   │       ├── hooks/
│   │       │   ├── useExercises.ts
│   │       │   ├── useExercise.ts
│   │       │   └── useExerciseMutations.ts
│   │       └── services/
│   │           └── exerciseApi.ts
│   ├── components/
│   │   ├── LoadingState.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   ├── services/
│   └── hooks/
└── tests/
    └── exercises/
```

## Components

- `ExerciseLibraryPage`: page shell, search/filter state, pagination, loading/empty/error states.
- `ExerciseSearch`: accessible case-insensitive name search input.
- `ExerciseFilters`: fixed muscle, equipment, and difficulty controls plus Favorites toggle.
- `ExerciseCard`: compact metadata and favorite control.
- `ExerciseDetail`: complete exercise metadata and unavailable-media fallback.
- `FavoriteButton`: toggles one user's favorite state with progress and error feedback.
- `ExerciseForm`: create/edit custom exercise form with positive numeric set/repetition fields and field-level errors.
- `ExerciseDetailPage`: resolves accessible exercise; handles unauthorized or missing records without exposing privacy details.

Reusable controls must use semantic HTML, visible labels, keyboard operation, focus indicators, sufficient contrast, and screen-reader announcements for state changes.

## Data Model

### Exercise

- `id: UUID` — immutable primary key.
- `name: string` — required, trimmed, non-empty.
- `source: predefined | custom` — immutable after creation.
- `ownerUserId: UUID | null` — custom exercises only.
- `primaryMuscleGroup: enum` — one of the fixed MVP muscle groups.
- `secondaryMuscleGroups: enum[]` — zero or more fixed taxonomy values.
- `equipment: enum` — fixed curated equipment value.
- `difficulty: enum` — Beginner, Intermediate, or Advanced.
- `instructions: text` — required.
- `demoReference: string | null` — required for predefined; optional for custom.
- `suggestedSets: integer` — positive.
- `suggestedReps: integer` — positive.
- `createdAt`, `updatedAt` — timestamps.

A partial unique constraint or application index may support search, but duplicate names are allowed.

### ExerciseFavorite

- `userId: UUID`.
- `exerciseId: UUID`.
- `createdAt: timestamp`.
- Unique constraint on `(userId, exerciseId)`.

Deleting a custom exercise cascades or explicitly deletes only its favorite relationships. It must not alter future feature references unless future feature tables establish an immutable snapshot/relationship design.

## REST Endpoints

All endpoints require authentication.

| Method | Endpoint | Purpose | Key responses |
|---|---|---|---|
| GET | `/api/exercises` | Paginated browse/search/filter | 200, 400, 401, 500 |
| GET | `/api/exercises/:exerciseId` | Detail for predefined or owned custom exercise | 200, 401, 403, 404, 500 |
| POST | `/api/exercises` | Create owned custom exercise | 201, 400, 401, 500 |
| PATCH | `/api/exercises/:exerciseId` | Edit owned custom exercise | 200, 400, 401, 403, 404, 500 |
| DELETE | `/api/exercises/:exerciseId` | Delete owned custom exercise | 204, 401, 403, 404, 500 |
| PUT | `/api/exercises/:exerciseId/favorite` | Add per-user favorite | 200/204, 401, 404, 500 |
| DELETE | `/api/exercises/:exerciseId/favorite` | Remove per-user favorite | 204, 401, 404, 500 |

Predefined exercises are never mutable through these endpoints. Any edit or delete attempt receives 403. Inaccessible custom exercises receive 404 or 403 according to the privacy contract, but must not disclose existence or metadata.

## Search and Filter Rules

- Search matches exercise name case-insensitively using partial matching.
- Values within one category use OR semantics.
- Different active categories use AND semantics.
- Favorites is always constrained to the authenticated user's favorite IDs.
- Results include predefined exercises and only the user's custom exercises.
- Pagination is applied after filtering and ordering.

## Validation

Server validation is authoritative and must validate:
- trimmed, non-empty name;
- fixed primary and secondary muscle values;
- fixed equipment values;
- Beginner/Intermediate/Advanced difficulty;
- required instructions;
- positive integer suggestedSets and suggestedReps;
- valid media reference format where supplied;
- predefined source and ownership status on mutations.

The React form mirrors these rules for immediate feedback but never treats client validation as a security boundary.

## Error Handling

Use one JSON error envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [
      { "field": "suggestedReps", "message": "Must be a positive number" }
    ]
  }
}
```

- `400`: invalid input or query parameters.
- `401`: missing or invalid authentication.
- `403`: authenticated user attempts a forbidden predefined or custom mutation.
- `404`: exercise or favorite resource is unavailable or inaccessible.
- `500`: unexpected server failure, logged with correlation context but not secrets or passwords.

Frontend states:
- `loading`: skeleton or accessible progress status.
- `empty`: no matching exercises and reset-filter action.
- `error`: concise message plus retry action.
- `save error`: preserve draft fields and allow retry.
- `save success`: confirm and refresh only affected exercise state.

## Testing Strategy

### Backend

- Vitest unit tests: search/filter semantics, taxonomy validation, positive set/reps validation, and predefined/custom source rules.
- Supertest contract tests: status codes, routes, query validation, and consistent error shape.
- Integration tests: two-user privacy, owner-only edit/delete, predefined mutation rejection, favorite isolation, and custom deletion cleanup.
- Database tests use an isolated SQLite test database for fast repeatable execution.
- Seed tests verify predefined media and fixed taxonomy integrity.

### Frontend

- React Testing Library tests: browse, search, combined filters, details, favorite/unfavorite, custom create/edit/delete, loading/empty/error states, draft preservation, and theme rendering.
- Vitest/JSDOM tests run interactions through accessible queries and keyboard events.
- Responsive checks verify no overflow or blocked controls at 320 px and 1920 px.
- Automated WCAG checks supplement, but do not replace, manual keyboard and screen-reader validation.

### Acceptance Coverage

- 95% first-attempt task completion targets are validated by moderated usability tests.
- 100% privacy and predefined mutation tests are enforced with two-user integration cases.
- Combined search/filter results for 1,000 accessible records are benchmarked within the 2-second target.
- Critical custom-form cases verify field-specific feedback for every invalid required field.

## Key Decisions

1. Use REST and Express because the feature is standard authenticated CRUD and filtering; GraphQL would add unnecessary schema/runtime complexity.
2. Use an SQL ORM/query layer with migrations because ownership, uniqueness, filtering, and seed integrity need relational guarantees.
3. Use separate Exercise and ExerciseFavorite entities because favorites must be private and independent per user.
4. Use source and owner fields because predefined records can be seed-managed and custom records remain owner-restricted.
5. Use fixed taxonomies because free-text equipment/difficulty values would undermine predictable filtering.
6. Use separate positive sets/reps fields because range or free-text representations create ambiguous validation and future plan reuse.
7. Require media for predefined exercises and allow custom exercises to omit it because curated data needs demonstrations while custom creation remains practical.
8. Do not expose custom exercise existence to unrelated users, prefer 404 for detail access, and avoid leaking private metadata in errors or logs.
9. Keep pagination in the API so mobile clients do not load all accessible exercises at once.

## Dependencies

- Existing authentication and user session/JWT mechanism.
- Fixed muscle, equipment, and difficulty taxonomy definitions.
- Database migration and seed infrastructure.
- Persistent theme preference support or a minimal feature-level preference store.
- Environment configuration for database, authentication, and API base URL.

No external exercise-image service is required for MVP storage; `demoReference` may be a repository-provided URL or media identifier validated against allowed formats.

## Complexity Tracking

No constitution violations requiring exception.

## Post-Design Constitution Re-check

- React/TypeScript and Node.js/Express are used with modular feature folders.
- PostgreSQL/SQLite relational persistence and server-side authorization preserve privacy and integrity.
- REST contracts use consistent status codes and error payloads.
- Predefined records remain read-only and custom exercises remain owner-scoped.
- The design does not introduce workouts, weekdays, rotation, history, or analytics.
- The implementation plan includes validation, loading/empty/error states, backend/frontend tests, and data-integrity integration coverage.
