# Tasks: GymFlow MVP

**Input**: `spec.md`, `plan.md`, `data-model.md`, API contracts, and clarification checklists.
**Organization**: Tasks are grouped by implementation milestone and user story.

## Phase 1: Project Setup

- [x] T001 Create `backend/`, `frontend/`, and `shared/` project structures per `plan.md`.
- [x] T002 Initialize Node.js/Express/TypeScript backend scripts and dependencies.
- [x] T003 Initialize React/TypeScript frontend with React Router, TanStack Query, React Hook Form, Zod, and HTTP client dependencies.
- [x] T004 [P] Add backend Vitest, Supertest, and contract-test tooling.
- [x] T005 [P] Add frontend Vitest, React Testing Library, and Playwright tooling.
- [x] T006 [P] Configure backend/frontend TypeScript, ESLint, Prettier, and environment templates.
- [x] T007 Create shared taxonomy, icon, workout-state, and domain-type packages.

## Phase 2: Foundational Infrastructure

- [ ] T008 Configure PostgreSQL production and SQLite test database connections.
- [ ] T009 Create migrations for users/preferences, exercises/favorites, plans/sessions/template exercises, and plan rotation progress.
- [ ] T010 Create migrations for workout attempts, exercise/set logs, and immutable/history snapshot records.
- [ ] T011 [P] Implement authentication and secure session/JWT provider adapter.
- [ ] T012 [P] Implement owner authorization and cross-user privacy helpers.
- [ ] T013 Implement shared validation, 400/401/403/404/409/500 errors, and correlation IDs.
- [ ] T014 [P] Seed fixed muscle/equipment/difficulty taxonomy and curated predefined exercises.
- [ ] T015 Implement optional `iconReference` validation and default-icon fallback data.
- [ ] T016 [P] Configure test databases/runners and shared fixtures.
- [ ] T017 [P] Implement reusable loading, empty, error, retry, save-status, and default-icon components.
- [ ] T018 Configure authenticated API client, TanStack Query cache, and server response error parsing.
- [ ] T019 [P] Implement persisted theme and kg/lb preference fallback state.

**Checkpoint**: Foundation passes before feature implementation begins.

## Phase 3: US1 - Exercise Library (P1)

### Tests

- [ ] T020 [P] [US1] Add exercise browse/detail/search/filter contract tests.
- [ ] T021 [P] [US1] Add two-user privacy tests for custom exercise and favorite access.
- [ ] T022 [P] [US1] Add RTL tests for icon fallback, filters, favorites, custom forms, loading, empty, and error states.

### Implementation

- [ ] T023 [P] [US1] Implement exercise/favorite repositories and search/filter predicates.
- [ ] T024 [P] [US1] Implement exercise ownership, predefined read-only, custom CRUD, and favorite services.
- [ ] T025 [US1] Implement exercise and favorite REST routes/controllers.
- [ ] T026 [P] [US1] Implement `ExerciseCard`, `ExerciseDetail`, `ExerciseSearch`, `ExerciseFilters`, and `FavoriteButton`.
- [ ] T027 [P] [US1] Implement custom `ExerciseForm` with optional icon, field validation, and draft preservation.
- [ ] T028 [US1] Implement `ExerciseLibraryPage` and `ExerciseDetailPage` with pagination and default-icon fallback.

**Checkpoint**: Browse/search/filter/detail/favorite/custom CRUD work independently.

## Phase 4: US2 - Workout Plan Builder (P1)

### Tests

- [ ] T029 [P] [US2] Add unit tests for session/exercise ordering, set/repetition validation, and reorder operations.
- [ ] T030 [P] [US2] Add integration/contract tests for plan ownership, session CRUD, template exercise CRUD, and deleted templates.
- [ ] T031 [P] [US2] Add RTL/Playwright tests for plan creation, reorder, customization, and deletion.

### Implementation

- [ ] T032 [P] [US2] Implement plan/session/template repositories and reorder transactions.
- [ ] T033 [US2] Implement plan/session/template domain services and ownership rules.
- [ ] T034 [US2] Implement plan/session/template REST routes/controllers.
- [ ] T035 [P] [US2] Implement `PlanListPage`, `PlanEditorPage`, session cards, exercise selectors, and accessible reorder controls.
- [ ] T036 [US2] Prevent live plan/template edits from mutating completed or active workout snapshots.

**Checkpoint**: Multiple plans and ordered templates are independently functional.

## Phase 5: US3 - Sequential Rotation (P1)

### Tests

- [ ] T037 [P] [US3] Add unit tests for next-session wrapping, final-to-first wrap, rest/missed no-op, and independent plans.
- [ ] T038 [P] [US3] Add integration tests for empty plans, deleted current sessions, incomplete/resume/discard no-op, resumed completion, and concurrent completion.
- [ ] T039 [P] [US3] Add Playwright tests for session 1 → session 2 and final-session → first-session wrap.

### Implementation

- [ ] T040 [P] [US3] Implement per-plan progress repository and ordered-session lookup.
- [ ] T041 [US3] Implement pure cyclic rotation service with no weekday or calendar input.
- [ ] T042 [US3] Implement no-next-workout behavior for plans with no valid sessions and deleted-current-session fallback to the next remaining session.
- [ ] T043 [US3] Implement start/resume/save-incomplete/discard/completion state transitions.
- [ ] T044 [US3] Implement transactional completion locking, idempotency keys, and duplicate guards.
- [ ] T045 [US3] Implement next-session and completion REST routes/controllers.

**Checkpoint**: Cyclic, per-plan rotation advances exactly once only on completion.

## Phase 6: US4 - Active Workout Logging and Snapshots (P1)

### Tests

- [ ] T046 [P] [US4] Add unit tests for set/repetition/weight/unit validation and snapshot serialization.
- [ ] T047 [P] [US4] Add integration tests for workout-only exercise changes, save/resume/discard/complete, source-plan edits/deletes, and snapshot preservation.
- [ ] T048 [P] [US4] Add RTL/Playwright tests for active workout, prior performance, rest timer, duration, save failure, resume, discard, and finish.

### Implementation

- [ ] T049 [P] [US4] Implement workout attempt, exercise-log, set-log, and previous-performance repositories.
- [ ] T050 [US4] Implement active-workout snapshot capture and workout-only template isolation.
- [ ] T051 [US4] Implement active-workout routes/controllers for drafts, sets, timer-independent duration, save-incomplete, discard, and complete.
- [ ] T052 [P] [US4] Implement `ActiveWorkoutPage`, set editor, exercise controls, notes, duration, and rest timer.
- [ ] T053 [P] [US4] Implement prior-performance panel and unavailable-performance state.
- [ ] T054 [US4] Preserve drafts locally/server-side and prevent false success on save failure.
- [ ] T055 [US4] Normalize and convert kg/lb values consistently while preserving display preferences.

**Checkpoint**: Active logging works and source edits/deletes never mutate active snapshots.

## Phase 7: US5 - Workout History with Status (P2)

### Tests

- [ ] T056 [P] [US5] Add integration tests for completed, incomplete, and discarded history entries and plan/exercise edit/delete isolation.
- [ ] T057 [P] [US5] Add contract tests for chronological history, calendar history, status filtering, and detail snapshots.
- [ ] T058 [P] [US5] Add RTL/Playwright tests for status labels and deleted-source history readability.

### Implementation

- [ ] T059 [P] [US5] Implement status snapshot serialization for completed, in-progress, and discarded workouts and preserve start-time data.
- [ ] T060 [P] [US5] Implement chronological/calendar history repositories and status aggregation.
- [ ] T061 [US5] Implement history REST routes/controllers with completed/in_progress/discarded status.
- [ ] T062 [US5] Implement `WorkoutHistoryPage` and calendar/detail components with visible status badges.
- [ ] T063 [US5] Exclude incomplete/discarded attempts from completion totals and PR/progress calculations.

**Checkpoint**: History includes all attempt statuses and completed records remain immutable.

## Phase 8: US6 - Dashboard, Progress, and Settings (P2)

### Tests

- [ ] T064 [P] [US6] Add unit tests for completed-only totals, volume, PR, muscle frequency, and period calculations.
- [ ] T065 [P] [US6] Add integration tests for deleted-exercise snapshots and no-data states.
- [ ] T066 [P] [US6] Add RTL/Playwright tests for dashboard, progress, theme, and unit settings.

### Implementation

- [ ] T067 [P] [US6] Implement centralized progress aggregation from completed records only.
- [ ] T068 [US6] Implement dashboard, summary, and exercise-progress API routes.
- [ ] T069 [P] [US6] Implement `DashboardPage`, `ProgressPage`, totals/cards/charts, and no-data states.
- [ ] T070 [P] [US6] Implement `SettingsPage` for theme, kg/lb preference, and account settings.
- [ ] T071 [US6] Implement responsive `AppShell` navigation for all required screens.

**Checkpoint**: Dashboard/progress/settings and all primary navigation flows pass.

## Phase 9: Security, Accessibility, and Reliability

- [ ] T072 [P] Add multi-user privacy tests across plans, favorites, custom exercises, workouts, history, and progress.
- [ ] T073 [P] Configure CSRF/session security, CORS, rate limiting, secure headers, and ORM parameterization.
- [ ] T074 [P] Add keyboard/focus/live-region/semantic-markup tests across primary flows.
- [ ] T075 [P] Add 320 px and desktop responsive/overflow tests.
- [ ] T076 [P] Add external exercise fallback, missing-icon default, and unsupported-icon-reference tests.
- [ ] T077 Add structured logging, correlation IDs, and secret-safe redaction.
- [ ] T078 Run security, accessibility, responsive, and save-failure regressions.

## Phase 10: Validation and Milestone Sign-off

- [ ] T079 Add end-to-end journeys for exercises, plans, cyclic rotation, logging, snapshots, history, progress, and settings.
- [ ] T080 Run full frontend/backend suites and fix regressions.
- [ ] T081 Verify the constitution and post-clarification checklists.
- [ ] T082 Document setup, migrations, seed/icon data, provider configuration, and validation procedures.
- [ ] T083 Run performance checks for search/history/progress/concurrent completion and resolve regressions.
- [ ] T084 Recheck requirement traceability and mark only genuinely unresolved provider/auth/configuration decisions before sign-off.

## Dependencies

- Foundation → every feature.
- Exercise Library → plan exercise selection and prior-performance data.
- Plan Builder → active workout sessions and rotation source sessions.
- Rotation → transactional completion and per-plan progress.
- Active Workout → snapshot/history/progress data.
- History Status → progress aggregation and visible status views.
- Progress/Settings → completed history and authenticated preferences.

## MVP Delivery Order

1. Foundation/authentication.
2. Exercise library with icon fallback.
3. Plan builder.
4. Cyclic per-plan rotation.
5. Active workout logging with start-time snapshots.
6. Completed/incomplete/discarded history.
7. Dashboard/progress/settings and accessibility/reliability polish.
