# Implementation Plan: GymFlow MVP

**Branch**: `001-exercise-library` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)

**Input**: Approved GymFlow MVP specification and constitution.

## Summary

Implement GymFlow as a mobile-first React/TypeScript single-page application with a Node.js/Express/TypeScript REST backend and PostgreSQL persistence. The MVP delivery sequence is exercise library, workout-plan builder, completion-based per-plan rotation, active workout logging, previous-performance comparison, and immutable workout history. SQLite may be used for local and automated test environments.

## Technical Context

- **Frontend**: React 18+, TypeScript, React Router, TanStack Query, React Hook Form, Zod, Vitest, React Testing Library, and an accessible component library or local primitives.
- **Backend**: Node.js LTS, Express, TypeScript, Zod, Prisma or Kysely, Pino, Supertest, and Vitest.
- **Database**: PostgreSQL in production; SQLite only for local development and isolated tests.
- **Authentication**: Existing-user integration is unresolved. Recommend a secure session-based provider with server-side session storage or JWT sessions only if refresh/revocation requirements are satisfied. Provider, password policy, account recovery, and email verification will be resolved before implementation sign-off.
- **Exercise data**: Curated seed data plus optional external providers through an adapter. External failures are isolated and must never block predefined or custom exercises.
- **Target**: Modern desktop/mobile browsers, 320–1920 CSS pixels, WCAG 2.1 AA.
- **Testing**: Vitest, Supertest, React Testing Library, Playwright, Prisma migrations, and isolated SQLite/PostgreSQL test environments.

## Constitution Alignment

| Gate | Status | Evidence |
|---|---|---|
| React/TypeScript + Express/TypeScript | Pass | Recommended stack follows mandatory platform constraints. |
| Relational persistence | Pass | Users, plans, templates, logs, sets, favorites, and snapshots use relational entities. |
| REST + status/error conventions | Pass | Defined endpoints use 400, 401, 403, 404, 409, and 500 with a shared envelope. |
| Historical immutability | Pass | Completion creates immutable snapshot fields independent of live templates/exercises. |
| Sequential completion rotation | Pass | Progress is stored per plan and advanced only by a transactional completion operation. |
| Authentication and secrets | Pass | Every API route authenticates and authorizes; secrets use environment variables. |
| Modular architecture | Pass | Features are isolated across UI, domain services, API, repositories, and persistence. |
| Mobile-first accessibility | Pass | Responsive component primitives, semantic HTML, keyboard operation, and contrast checks are required. |
| Quality gates | Pass | Unit, integration, contract, accessibility, and end-to-end testing are included. |

## Architecture

### Request and state flow

```text
UI component/page
  -> feature hook/service
  -> REST client
  -> auth + validation middleware
  -> route/controller
  -> domain service
  -> repository/transaction
  -> PostgreSQL/SQLite
```

UI components must not contain authorization or historical-integrity logic. Domain services own plan, rotation, workout, snapshot, and previous-performance rules. Repositories own SQL and transactions. Controllers translate HTTP to domain operations and standardized errors.

### Backend modules

```text
backend/src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── exercises/
│   ├── favorites/
│   ├── plans/
│   ├── rotation/
│   ├── workouts/
│   ├── history/
│   └── progress/
├── middleware/
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── validate.ts
│   └── error-handler.ts
├── data/
│   ├── prisma/
│   ├── migrations/
│   └── seeds/
└── tests/
```

### Frontend modules

```text
frontend/src/
├── app/
│   ├── router.tsx
│   ├── providers.tsx
│   └── shell/
├── features/
│   ├── dashboard/
│   ├── exercises/
│   ├── plans/
│   ├── active-workout/
│   ├── history/
│   ├── progress/
│   └── settings/
├── components/
├── hooks/
├── services/
├── stores/
└── tests/
```

A TanStack Query cache is the server-state source of truth. Explicit local draft state protects active workouts and forms during network failures. Theme and unit preferences come from authenticated user preferences with a local fallback until synchronization is available.

## Reusable UI Components and Screens

- **AppShell**: navigation, account actions, theme switch, responsive sidebar/mobile navigation.
- **Dashboard**: next recommended workouts, incomplete workouts, recent activity, volume and workout totals.
- **ExerciseLibraryPage**: search, filters, favorites, pagination, empty/error states, custom-exercise actions.
- **ExerciseDetail**: complete metadata and optional `iconReference` with default-icon fallback.
- **PlanListPage / PlanEditorPage**: plan CRUD, ordered session editors, exercise selectors, set/repetition configuration, and drag or accessible move controls.
- **ActiveWorkoutPage**: exercise log, set rows, add/remove controls, prior-performance panel, notes, rest timer, duration, save-incomplete, discard, and finish actions.
- **WorkoutHistoryPage**: chronological and calendar views, filters, detail expansion.
- **ProgressPage**: totals, volume, PRs, exercise progression, muscle frequency, and weekly/monthly charts.
- **SettingsPage**: weight unit, theme, account, and preference controls.

Every control must have semantic labels, keyboard support, visible focus, status announcements, and mobile layouts that avoid horizontal overflow.

## Data Model

Use UUID primary keys and timestamps consistently. Relational constraints and transactions enforce integrity.

### Core entities

- `User`: identity, unit preference, theme preference, timestamps.
- `Exercise`: id, name, source (`predefined|custom`), owner user for custom exercises, primary muscle, secondary muscles, equipment, difficulty, instructions, optional `iconReference`, suggested sets/reps, timestamps.
- `ExerciseFavorite`: userId, exerciseId, createdAt; unique on `(userId, exerciseId)`.
- `WorkoutPlan`: id, userId, name, status, description, timestamps.
- `PlanSessionTemplate`: id, planId, name, ordered index, optional notes, timestamps.
- `TemplateExercise`: id, sessionTemplateId, exerciseId, ordered index, configured sets, configured reps, optional rest seconds.
- `PlanRotationProgress`: planId, lastCompletedSessionId, nextSessionId or derived next index, lastCompletedAt, version. This entity is one row per plan and must be updated atomically.

### Active and historical entities

- `WorkoutAttempt`: id, userId, planId, planSessionTemplateId, state (`not_started|in_progress|completed|discarded`), source session snapshot fields, startedAt, finishedAt, durationSeconds, timestamps, completion version/idempotency key.
- `ExerciseLog`: id, workoutAttemptId, exerciseId, ordered index, exercise snapshot JSON, set snapshot/metadata fields, notes.
- `SetLog`: id, exerciseLogId, ordered index, weightValue, weightUnit, repetitions, completed, timestamps.
- `WorkoutHistorySnapshot`: id, workoutAttemptId, userId, status (`completed|in_progress|discarded`), plan/session/exercise snapshots, set/weight/unit/notes, aggregate totals, duration, and timestamps. A snapshot is created or updated as the workout state changes so calendar and chronological history remain complete.

### History snapshots

Live entities use foreign keys for configuration, while start-time snapshots preserve names and metadata for every workout state. Snapshot fields include plan name, session name, ordered muscle groups, exercise name, primary/secondary muscles, equipment, difficulty, instructions summary, optional `iconReference`, suggested/logged sets, reps, weight, unit, notes, duration, and status. Completed entries are used for progress and personal records; incomplete and discarded entries remain visible but are excluded from completed totals and rotation. For exercise history, snapshot rows may be denormalized by design rather than joined only to mutable live exercises.

Deleting a plan or exercise:

1. Marks or removes only live configuration safely.
2. Never deletes workout history or set logs.
3. Removes future template references if the plan is deleted, but leaves historical snapshot references readable.
4. Re-evaluates active/incomplete workouts through explicit server rules, preserving their draft snapshot rather than silently mutating history.

### Relationships

```text
User 1-* WorkoutPlan
WorkoutPlan 1-* PlanSessionTemplate
PlanSessionTemplate 1-* TemplateExercise
TemplateExercise *-1 Exercise
WorkoutPlan 1-1 PlanRotationProgress
User 1-* WorkoutAttempt
WorkoutPlan 1-* WorkoutAttempt
WorkoutAttempt 1-* ExerciseLog
ExerciseLog 1-* SetLog
WorkoutAttempt 1-1 WorkoutHistorySnapshot
User 1-* ExerciseFavorite
ExerciseFavorite *-1 Exercise
```

## REST API Contracts

All authenticated endpoints use `/api/v1`. Responses use JSON and a shared error envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [{ "field": "weightValue", "message": "Must be a positive number" }]
  }
}
```

### Exercises and favorites

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/exercises` | Paginated browse/search/filter |
| GET | `/exercises/:id` | Accessible predefined or owned custom detail |
| POST | `/exercises` | Create owned custom exercise |
| PATCH | `/exercises/:id` | Edit owned custom exercise |
| DELETE | `/exercises/:id` | Delete owned custom exercise |
| PUT | `/exercises/:id/favorite` | Add favorite |
| DELETE | `/exercises/:id/favorite` | Remove favorite |
| GET | `/exercises/:id/previous-performance` | Latest completed data for prior comparison |

Filters accept repeated or comma-separated fixed taxonomy values. Search is case-insensitive partial-name matching. Muscle/equipment/difficulty values use OR within a category and AND across categories. Cross-user custom records return 404 to avoid existence disclosure.

### Plans and templates

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/plans` | List/create plans |
| GET/PATCH/DELETE | `/plans/:planId` | Read/update/delete plan |
| GET/POST | `/plans/:planId/sessions` | Read/create session templates |
| PATCH/DELETE | `/plans/:planId/sessions/:sessionId` | Update/delete a session |
| PUT | `/plans/:planId/sessions/reorder` | Persist session order |
| PUT | `/plans/:planId/sessions/:sessionId/exercises/reorder` | Persist exercise order |
| POST/PATCH/DELETE | `/plans/:planId/sessions/:sessionId/exercises` | Manage template exercises |

Plan mutation payloads contain explicit ordered indices and server validation rejects duplicate/invalid indices, unknown exercises, invalid sets/reps, or cross-user exercise references.

### Rotation and active workouts

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/plans/:planId/next-session` | Return next session derived from completion progress |
| POST | `/plans/:planId/workouts/start` | Start or resume a recommended/source session |
| GET/PATCH | `/workouts/:workoutId` | Read/update active draft |
| POST | `/workouts/:workoutId/exercises` | Add workout-only exercise |
| DELETE | `/workouts/:workoutId/exercises/:exerciseLogId` | Remove workout-only exercise |
| PUT | `/workouts/:workoutId/sets/:setId` | Update weight/reps/completion |
| POST | `/workouts/:workoutId/save-incomplete` | Persist without completing |
| POST | `/workouts/:workoutId/discard` | Mark discarded |
| POST | `/workouts/:workoutId/complete` | Complete atomically and advance once |

The completion request accepts `Idempotency-Key` and/or `completionKey`. The server rejects unknown or already-completed attempts, validates final set data, creates history snapshots and set logs atomically, and uses plan progress locking/version checks to advance once.

### History and progress

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/history` | Paginated chronological history including completed, in-progress, and discarded attempts |
| GET | `/history/calendar?month=YYYY-MM` | Calendar entries for completed, in-progress, and discarded attempts |
| GET | `/history/:workoutId` | Status-visible workout snapshot/detail |
| GET | `/progress/summary` | Totals, volume, frequency, weekly/monthly activity |
| GET | `/progress/exercises/:exerciseId` | Exercise progression and personal records |

## Sequential Rotation Engine

A plan has a single progress row with `lastCompletedSessionId`, `lastCompletedAt`, `progressVersion`, and a completion index derived from the ordered session templates. The ordered index is never based on weekday or calendar date.

On completion:

1. Authenticate and verify the attempt belongs to the user and plan.
2. Enter a transaction and lock the workout attempt and plan progress row.
3. Reject discard or already-completed states and validate an idempotency key.
4. Persist the final exercise/set logs and immutable history snapshot.
5. Mark the attempt completed once.
6. Determine the next session cyclically; completing the final session wraps to the first session. A plan with no valid sessions has no next workout and pauses rotation until a session is added. If the current session is deleted, choose the next remaining session in plan order.
7. Increment `progressVersion` and update `lastCompletedSessionId/At` exactly once.

If a concurrent duplicate is submitted, the database uniqueness constraint and transaction state return the existing completion result rather than advancing again.

State effects:

- **Rest/missed days**: no completion transaction occurs, so progress is unchanged.
- **Incomplete save**: state remains `in_progress`; progress unchanged.
- **Resume**: reopens the existing attempt; no progress change until completion.
- **Discard**: state becomes `discarded`; progress unchanged.
- **Completion**: exactly one advancement transaction.
- **Plan edit**: an active or incomplete workout keeps its start-time session and exercise snapshot; later source edits do not mutate it. Completion of the resumed workout advances the source plan exactly once.

## Exercise and Workout Rules

- Fixed equipment/difficulty/muscle taxonomies are shared frontend/backend constants. Invalid values are rejected on both layers.
- Suggested sets/reps and active sets use positive integers; weight is a non-negative decimal within configured limits. Weight storage is normalized internally while API values respect kg/lb preferences.
- Search/filter state is paginated and debounced. OR applies within a category; AND applies across categories.
- Previous performance reads only the user's completed history and prefers a most-recent completed date. It displays weight, reps, set count, and date with a clear unavailable state.
- Rest timer state is local/active-workout state with start, pause, reset, and optional notifications. Timer expiration must never imply workout completion or save success.
- Progress calculations derive completed sets, reps, volume, muscle frequency, activity, and PRs from immutable history/set logs. If a log references a deleted exercise, its snapshot supplies display names and no live join is required.

## Validation, Authorization, and Errors

- Zod schemas validate every request body and query parameter before domain execution.
- Authentication middleware protects every API route.
- Domain services verify plan/workout ownership and exercise accessibility.
- Custom exercise mutations return 404 for inaccessible records and 403 for predefined mutation attempts.
- 400 validation; 401 unauthenticated; 403 forbidden predefined/source mutation; 404 missing/inaccessible; 409 state/version conflict; 500 unexpected.
- Pino logs include correlation/request IDs and domain context; secrets, passwords, request credentials, and tokens are excluded.
- Network/save failures preserve local drafts and return explicit retry actions; no success toast or rotation update occurs before server confirmation.

## Security, Privacy, and Accessibility

- Hash passwords and use secure, revocable authentication sessions or short-lived JWTs with refresh controls.
- Store no credentials or secrets in source or test fixtures.
- Use CSRF protection for cookie sessions, strict CORS, secure cookies, rate limiting, and parameterized ORM queries.
- Add per-user authorization to every list/detail mutation.
- Active workouts, plans, favorites, history, and progress are private.
- Use semantic HTML, visible labels, focus management, keyboard reordering alternatives, live regions, and 320 px layouts.
- Dark/light themes preserve sufficient contrast and persist per user.
- Exercise icon references are optional. Missing or unsupported icon references use a local/default icon without blocking exercise access.

## Testing Strategy

### Unit tests

- Taxonomy/search/filter semantics.
- Set/reps/weight/unit validation.
- Rotation next-session calculation and state transitions.
- History snapshot serialization and progress aggregation.
- Idempotency and completion-state guards.

### Integration and contract tests

- Supertest for every route group and standardized errors.
- Multi-user ownership/privacy tests.
- Plan/session/exercise ordering and deletion tests.
- Transactional completion tests for exactly-one advancement.
- History integrity tests after plan/exercise edits or deletion.
- External exercise source failure fallback.

### End-to-end tests

- Exercise browse/search/favorite/custom CRUD.
- Plan creation, session/exercise reorder, and custom set/reps.
- Start, log, add/remove, rest timer, incomplete save/resume/discard/finish.
- Previous-performance display.
- Calendar and chronological history.
- Progress totals/PR/frequency.
- Concurrent/double completion.
- Mobile/desktop, keyboard, and dark/light flows.

Playwright is reserved for critical end-to-end flows rather than replacing lower-level domain tests.

## Milestones and Dependencies

1. **Foundation**: monorepos, database, migrations, auth, shared validation/taxonomies, API envelope, test infrastructure.
2. **Exercise Library**: seed/import data, browse/detail/search/filter, favorites, custom CRUD, previous-performance API shell.
3. **Plan Builder**: plans, ordered sessions, template exercises, reorder operations, plan privacy.
4. **Rotation Engine**: per-plan progress, start/next-session API, completion transaction, idempotency, state tests.
5. **Workout Logging**: active attempt, exercise/set logs, rest timer, incomplete/resume/discard/complete, unit preference.
6. **History and Integrity**: status-visible completed/in-progress/discarded snapshots, calendar/list/detail APIs, and edit/delete isolation tests.
7. **Progress and Polish**: totals, volume, PR, frequency, charts, responsive/accessibility/performance checks.

The plan-builder depends on exercise records. Rotation depends on completed workout transactions and plan session identity. History depends on status-visible workout snapshots. Progress depends on completed set/history records.

## Requirement-to-Component/API/Test Traceability

| Requirements | Frontend/API | Automated verification |
|---|---|---|
| FR-001–FR-011 exercises | ExerciseLibraryPage, ExerciseDetail, ExerciseForm, `/exercises`, `/favorites` | Unit taxonomy/filter; contract privacy; RTL browse/form; E2E search/favorites |
| FR-012–FR-017 plans/templates | PlanList/PlanEditor, `/plans`, `/sessions`, `/exercises` | Integration ordering/CRUD; E2E plan builder; history immutability |
| FR-018–FR-025 rotation | Next-session UI, `/plans/:id/next-session`, completion endpoint | Unit state rules; transaction concurrency tests; E2E three-session/multi-plan |
| FR-026–FR-032 active workouts | ActiveWorkoutPage, rest timer, previous-performance panel | Unit set validation; integration draft/resume/discard; E2E logging |
| FR-033–FR-035 history | HistoryPage/calendar/detail | Snapshot integration tests after edit/delete; E2E history |
| FR-036–FR-038 dashboard/progress | AppShell/Dashboard/Progress | Unit aggregation; RTL; E2E totals/PR/frequency |
| FR-039–FR-046 UX/security | Auth shell, shared error/draft/theme components | Auth/privacy contracts; accessibility; responsive; save-failure tests |
| NFR-007 historical immutability | Snapshot repositories and completion transaction | Integration tests edit/delete live entities and reread history |
| NFR-010 exactly-one completion | Idempotency key + plan/workout locks | Concurrent completion integration test; repeated request contract test |

## Assumptions

- Authentication and user preference providers are present or selected before data implementation.
- PostgreSQL is available for production and a SQLite test database is sufficient for deterministic MVP tests.
- The MVP uses one ordered-session cycle with an explicit next-session result and no fixed weekdays.
- External exercise providers are optional and not a source of truth for privacy or historical snapshots.
- Plan editing may affect future workouts, but active/incomplete workout snapshots remain unchanged and completed history is immutable.

## Risks and Mitigations

- **Concurrent completion**: mitigate with transaction locks, progress version, and idempotency uniqueness.
- **Snapshot drift**: write immutable history fields in the completion transaction and forbid later updates.
- **Authentication uncertainty**: isolate auth behind an adapter and document provider decisions before API implementation.
- **External provider outage**: use local cached/seeded exercises and a circuit/fallback adapter.
- **Mobile complexity**: implement reusable mobile components, test 320 px, and provide keyboard alternatives to dragging.
- **Progress calculation drift**: centralize aggregation and test against fixture histories.
- **Draft loss**: persist recoverable draft state locally/server-side and distinguish it clearly from saved completion.

## Unresolved Decisions

1. Authentication provider/session mechanism and account recovery flow.
2. Final Prisma/Kysely choice and PostgreSQL/SQLite migration strategy.
3. Optional local/shared icon asset strategy and predefined icon set.
4. Pagination defaults and history/calendar export expectations.

## Complexity Tracking

No constitution exception is requested. The implementation is intentionally separated into domain modules and immutable completion snapshots to preserve historical truth and completion-based rotation.
