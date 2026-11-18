# Tasks: Exercise Library

**Input**: Design documents from `/specs/001-exercise-library/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the React and Node.js application structure

- [ ] T001 Create backend and frontend project directories per `specs/001-exercise-library/plan.md` at repository root
- [ ] T002 Initialize the Node.js/Express/TypeScript backend with package scripts in `backend/package.json`
- [ ] T003 Initialize the React/TypeScript frontend with React, React Router, and HTTP client dependencies in `frontend/package.json`
- [ ] T004 [P] Add Vitest and Supertest backend test dependencies in `backend/package.json`
- [ ] T005 [P] Add Vitest and React Testing Library frontend test dependencies in `frontend/package.json`
- [ ] T006 [P] Configure TypeScript, ESLint, and Prettier for backend in `backend/`
- [ ] T007 [P] Configure TypeScript, ESLint, and Prettier for frontend in `frontend/`
- [ ] T008 Create environment configuration templates for database, auth, and API URLs in `backend/.env.example` and `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Add PostgreSQL and SQLite-capable database configuration in `backend/src/data/database.ts`
- [ ] T010 Create Exercise migration with id UUID, name, source, ownerUserId, primary/secondary muscles, equipment, difficulty, instructions, demoReference, suggestedSets, suggestedReps, and timestamps in `backend/src/data/migrations/`
- [ ] T011 [P] Create ExerciseFavorite migration with userId, exerciseId, createdAt, and unique user/exercise constraint in `backend/src/data/migrations/`
- [ ] T012 [P] Seed fixed muscle, equipment, and difficulty taxonomies in `backend/src/data/seeds/`
- [ ] T013 Seed curated predefined exercises with valid demo references in `backend/src/data/seeds/`
- [ ] T014 Implement authentication middleware for every Exercise Library route in `backend/src/middleware/authenticate.ts`
- [ ] T015 Implement shared 400/401/403/404/500 error payload handling in `backend/src/middleware/error-handler.ts`
- [ ] T016 Implement shared request validation middleware in `backend/src/middleware/validate.ts`
- [ ] T017 [P] Create Exercise domain types, enums, and taxonomy constants in `backend/src/features/exercises/exercise.types.ts`
- [ ] T018 [P] Create reusable frontend loading, empty, and error components in `frontend/src/components/`
- [ ] T019 Configure frontend exercise API client with auth and consistent error parsing in `frontend/src/features/exercises/services/exerciseApi.ts`
- [ ] T020 [P] Configure frontend theme support for persistent light/dark preference in `frontend/src/`
- [ ] T021 Configure backend and frontend test databases/runners in `backend/vitest.config.ts` and `frontend/vitest.config.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse and Discover Exercises (Priority: P1) MVP

**Goal**: Allow an authenticated user to browse predefined exercises, open exercise details, and see only accessible owned custom exercises

**Independent Test**: Seeded predefined exercises are grouped by muscle group and detail data renders while another user's custom exercise remains inaccessible

### Tests for User Story 1

- [ ] T022 [P] [US1] Write Supertest contract tests for GET `/api/exercises` and GET `/api/exercises/:exerciseId` in `backend/tests/contract/exercise-browse.contract.test.ts`
- [ ] T023 [P] [US1] Write integration tests for predefined visibility and cross-user custom exercise privacy in `backend/tests/integration/exercise-browse.integration.test.ts`
- [ ] T024 [P] [US1] Write React Testing Library tests for exercise list, detail, loading, empty, and unavailable-media states in `frontend/tests/exercises/exercise-browse.test.tsx`

### Implementation for User Story 1

- [ ] T025 [P] [US1] Implement Exercise repository browse/detail queries in `backend/src/features/exercises/exercise.repository.ts`
- [ ] T026 [P] [US1] Implement Exercise service read rules for predefined and owned-custom visibility in `backend/src/features/exercises/exercise.service.ts`
- [ ] T027 [US1] Implement GET browse and detail controllers/routes in `backend/src/features/exercises/exercise.controller.ts` and `backend/src/features/exercises/exercise.routes.ts`
- [ ] T028 [P] [US1] Implement `ExerciseCard` for name and available metadata in `frontend/src/features/exercises/components/ExerciseCard.tsx`
- [ ] T029 [P] [US1] Implement `ExerciseDetail` with unavailable-media fallback in `frontend/src/features/exercises/components/ExerciseDetail.tsx`
- [ ] T030 [US1] Implement browse/detail hooks for loading and error state in `frontend/src/features/exercises/hooks/useExercises.ts` and `frontend/src/features/exercises/hooks/useExercise.ts`
- [ ] T031 [US1] Implement `ExerciseLibraryPage` muscle-group browsing and pagination in `frontend/src/features/exercises/pages/ExerciseLibraryPage.tsx`
- [ ] T032 [US1] Implement `ExerciseDetailPage` for accessible exercise details in `frontend/src/features/exercises/pages/ExerciseDetailPage.tsx`

**Checkpoint**: User Story 1 is independently functional and testable

---

## Phase 4: User Story 2 - Search and Combine Filters (Priority: P1)

**Goal**: Let users search names and combine muscle group, equipment, difficulty, and Favorites filters

**Independent Test**: Partial mixed-case search and combined filters return exact OR-within-category and AND-across-category matches

### Tests for User Story 2

- [ ] T033 [P] [US2] Write unit tests for case-insensitive partial-name search and filter semantics in `backend/tests/unit/exercise-filter.test.ts`
- [ ] T034 [P] [US2] Write Supertest contract tests for valid and invalid search/filter query combinations in `backend/tests/contract/exercise-search.contract.test.ts`
- [ ] T035 [P] [US2] Write React Testing Library tests for search, filter combinations, reset, and no-results states in `frontend/tests/exercises/exercise-search.test.tsx`

### Implementation for User Story 2

- [ ] T036 [P] [US2] Extend Exercise repository with case-insensitive partial search and paginated category predicates in `backend/src/features/exercises/exercise.repository.ts`
- [ ] T037 [US2] Implement query validation for search, repeated filters, favorites, page, and pageSize in `backend/src/features/exercises/exercise.validation.ts`
- [ ] T038 [US2] Update GET `/api/exercises` to apply OR within categories and AND across active categories in `backend/src/features/exercises/exercise.service.ts`
- [ ] T039 [P] [US2] Implement accessible `ExerciseSearch` with case-insensitive query state in `frontend/src/features/exercises/components/ExerciseSearch.tsx`
- [ ] T040 [P] [US2] Implement `ExerciseFilters` for fixed muscle, equipment, difficulty, and Favorites controls in `frontend/src/features/exercises/components/ExerciseFilters.tsx`
- [ ] T041 [US2] Integrate search/filter/pagination state and no-results reset into `frontend/src/features/exercises/pages/ExerciseLibraryPage.tsx`

**Checkpoint**: Browse and search/filter stories both work independently

---

## Phase 5: User Story 3 - Favorite Exercises (Priority: P2)

**Goal**: Allow each user to favorite and unfavorite predefined or owned custom exercises

**Independent Test**: One user's favorite state is independent of a second user and deleting a custom exercise removes stale favorites

### Tests for User Story 3

- [ ] T042 [P] [US3] Write Supertest contract tests for favorite/unfavorite endpoints in `backend/tests/contract/exercise-favorite.contract.test.ts`
- [ ] T043 [P] [US3] Write integration tests for per-user favorites and custom-exercise deletion cleanup in `backend/tests/integration/exercise-favorite.integration.test.ts`
- [ ] T044 [P] [US3] Write React Testing Library tests for favorite toggle, optimistic rollback, and Favorites filter in `frontend/tests/exercises/exercise-favorite.test.tsx`

### Implementation for User Story 3

- [ ] T045 [P] [US3] Implement ExerciseFavorite repository add/remove/exists operations in `backend/src/features/exercises/exercise.repository.ts`
- [ ] T046 [US3] Implement favorite and unfavorite service rules in `backend/src/features/exercises/exercise.service.ts`
- [ ] T047 [US3] Implement PUT and DELETE `/api/exercises/:exerciseId/favorite` routes in `backend/src/features/exercises/exercise.routes.ts`
- [ ] T048 [P] [US3] Implement `FavoriteButton` with accessible state and error feedback in `frontend/src/features/exercises/components/FavoriteButton.tsx`
- [ ] T049 [US3] Implement favorite mutations and cache reconciliation in `frontend/src/features/exercises/hooks/useExerciseMutations.ts`
- [ ] T050 [US3] Integrate favorite-only filtering and stale-state cleanup in `frontend/src/features/exercises/pages/ExerciseLibraryPage.tsx`

**Checkpoint**: User Story 3 is independently functional

---

## Phase 6: User Story 4 - Create and Manage Custom Exercises (Priority: P2)

**Goal**: Let users create, edit, and delete only their own custom exercises with validated metadata

**Independent Test**: Two-user integration proves owner-only custom CRUD and predefined mutation rejection while field-level validation is consistent

### Tests for User Story 4

- [ ] T051 [P] [US4] Write Supertest contract tests for POST, PATCH, and DELETE custom exercise endpoints in `backend/tests/contract/exercise-custom.contract.test.ts`
- [ ] T052 [P] [US4] Write integration tests for owner-only CRUD, cross-user denial, predefined mutation rejection, and delete cleanup in `backend/tests/integration/exercise-custom.integration.test.ts`
- [ ] T053 [P] [US4] Write unit tests for required fields, positive sets/reps, fixed taxonomies, and media rules in `backend/tests/unit/exercise-validation.test.ts`
- [ ] T054 [P] [US4] Write React Testing Library tests for create/edit/delete validation, save failure retry, and predefined read-only UI in `frontend/tests/exercises/exercise-form.test.tsx`

### Implementation for User Story 4

- [ ] T055 [P] [US4] Implement server schemas for name, primary/secondary muscles, equipment, difficulty, instructions, demoReference, suggestedSets, and suggestedReps in `backend/src/features/exercises/exercise.validation.ts`
- [ ] T056 [P] [US4] Implement custom create/edit/delete repository operations in `backend/src/features/exercises/exercise.repository.ts`
- [ ] T057 [US4] Implement custom ownership and predefined read-only service rules in `backend/src/features/exercises/exercise.service.ts`
- [ ] T058 [US4] Implement POST, PATCH, and DELETE exercise routes/controllers in `backend/src/features/exercises/exercise.routes.ts` and `backend/src/features/exercises/exercise.controller.ts`
- [ ] T059 [P] [US4] Implement `ExerciseForm` with field-level validation and draft preservation in `frontend/src/features/exercises/components/ExerciseForm.tsx`
- [ ] T060 [US4] Implement create/edit/delete mutations and retry behavior in `frontend/src/features/exercises/hooks/useExerciseMutations.ts`
- [ ] T061 [US4] Add custom exercise create/edit/delete entry points to `frontend/src/features/exercises/pages/ExerciseLibraryPage.tsx` and `ExerciseDetailPage.tsx`
- [ ] T062 [US4] Prevent predefined edit/delete controls and handle server 403 responses in `frontend/src/features/exercises/`

**Checkpoint**: All four user stories are independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive behavior, performance, documentation, and final validation

- [ ] T063 [P] Add keyboard navigation and focus management tests across exercise library components in `frontend/tests/exercises/`
- [ ] T064 [P] Add WCAG 2.1 AA contrast and semantic markup checks across exercise pages in `frontend/tests/exercises/`
- [ ] T065 [P] Add 320 px and 1920 px responsive layout checks in `frontend/tests/exercises/`
- [ ] T066 Benchmark combined search/filter with 1,000 accessible exercises in `backend/tests/integration/exercise-performance.integration.test.ts`
- [ ] T067 [P] Add structured logging with correlation identifiers and no secrets in `backend/src/middleware/` and exercise feature files
- [ ] T068 Review all API payloads and domain operations for consistent error envelope usage in `backend/src/`
- [ ] T069 [P] Add user-facing error, loading, empty, and unavailable-media documentation in `specs/001-exercise-library/quickstart.md`
- [ ] T070 Run full frontend and backend test suites and fix regressions in `backend/` and `frontend/`
- [ ] T071 Run `specs/001-exercise-library/quickstart.md` end-to-end validation
- [ ] T072 Recheck implementation against the constitution and requirements review checklist in `specs/001-exercise-library/checklists/review.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - blocks all user stories
- **User Stories (Phase 3–6)**: Depend on Foundational completion
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 - Browse**: No dependency on US2, US3, or US4
- **US2 - Search/Filters**: Uses browse repository/services and can start after Foundation; independently testable
- **US3 - Favorites**: Uses Exercise/ExerciseFavorite entities and can start after Foundation
- **US4 - Custom Exercise CRUD**: Uses Exercise entity and auth/validation foundation; independently testable

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- Database, middleware, taxonomy, and frontend foundation tasks marked [P] can run in parallel
- After Foundation, US1–US4 can proceed in parallel if staffed
- Tests for each story marked [P] can run before implementation
- Backend repository/service/controller work and frontend component/hooks work may proceed in separate parallel tracks after contracts are fixed

---

## Parallel Example: User Story 1

```text
T022 Supertest GET browse/detail contract tests
T023 Two-user browse privacy integration tests
T024 React Testing Library browse/detail tests
T025 Exercise browse/detail repository
T028 ExerciseCard component
T029 ExerciseDetail component
```

---

## Parallel Example: User Story 4

```text
T051 POST/PATCH/DELETE contract tests
T052 Two-user custom CRUD integration tests
T053 Custom exercise validation unit tests
T054 React custom exercise form tests
T055 Server validation schemas
T056 Custom repository operations
T059 ExerciseForm component
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. STOP and validate: seeded predefined browse/detail and cross-user privacy work independently

### Incremental Delivery

1. Foundation → Browse/detail MVP
2. Add search/filter
3. Add favorites
4. Add custom exercise CRUD
5. Complete accessibility, responsive, performance, and polish validation

### Independent Test Criteria

- **US1**: Browse/detail and predefined/custom privacy pass without search, favorites, or custom CRUD
- **US2**: Search/filter semantics pass independently from favorites and custom CRUD
- **US3**: Per-user favorite state and deletion cleanup pass independently
- **US4**: Owner-only custom CRUD and predefined rejection pass independently
