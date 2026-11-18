# Phase 0 Research: GymFlow MVP

## Web Architecture

**Decision:** React/TypeScript with Node.js/Express/TypeScript and PostgreSQL; SQLite for local/tests.

**Rationale:** React and Express satisfy the constitution and provide clear modular domains. PostgreSQL provides transactional guarantees for rotation, ownership, favorites, and history. SQLite keeps local MVP validation and tests fast.

**Alternatives:** Client-only persistence was rejected for authentication/privacy; GraphQL was rejected as unnecessary for stable REST CRUD and workout operations.

## Authentication

**Decision:** Use secure, revocable authenticated sessions or short-lived JWTs with refresh/revocation controls, determined at implementation setup.

**Rationale:** Every plan, workout, favorite, history, and progress operation is private and requires server-side authorization.

## Exercise Data

**Decision:** Seed predefined exercises locally and support optional external providers through an isolated adapter.

**Rationale:** Local exercise data remains available during provider outages. External data is supplementary and never a dependency for historical snapshots.

## Exercise Icons and Taxonomies

**Decision:** Icons are optional `iconReference` values. Missing or unavailable icon references use a default exercise icon. The MVP has icon-only exercise presentation.

**Taxonomies:** Muscle groups are fixed; equipment is fixed with `Other` available for custom exercises; difficulty is Beginner, Intermediate, or Advanced.

**Rationale:** A single icon fallback keeps cards/details usable without external exercise presentation dependencies.

## Search and Filtering

**Decision:** Search is case-insensitive and partial-name based. OR semantics apply within a filter category; AND semantics apply across active categories.

## Plans and Ordered Sessions

**Decision:** Plans contain ordered session templates and template exercises with configured sets/repetitions.

**Rationale:** Templates remain separate from active attempts and immutable workout history.

## Sequential Rotation

**Decision:** Each plan stores independent progress based on the last completed session. Completion advances once and wraps from the final session to session 1. Rest/missed days, incomplete saves, resumes, and discards do not advance progress.

**Rationale:** Weekday/calendar state is excluded from the domain rule and concurrent completion is guarded transactionally.

## Workout Snapshots

**Decision:** Start a workout by snapshotting session and exercise details. Keep the snapshot unchanged across later plan/session/exercise edits. Completing a resumed workout updates the history record to completed and advances rotation once.

**Rationale:** Immutable start-time data preserves resumed-workout truth and prevents source template mutations from rewriting history.

## History and Status

**Decision:** History includes completed, in-progress, and discarded workout attempts with visible status. Only completed attempts contribute to totals, volume, and personal records.

## Weight and Units

**Decision:** Store normalized weight values and return values in the user's kg/lb preference. Repetitions and set counts are positive integers; weight is non-negative and bounded by implementation validation.

## Testing

**Decision:** Use unit, integration/contract, component, accessibility, and end-to-end tests with Vitest, Supertest, React Testing Library, Playwright, PostgreSQL, and SQLite fixtures.
