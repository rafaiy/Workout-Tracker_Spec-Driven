# Feature Specification: GymFlow MVP

**Feature Branch**: `001-exercise-library`  
**Created**: 2026-11-19  
**Status**: Draft  
**Input**: Build GymFlow, a responsive, mobile-first web application for planning and tracking gym workouts.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover and Manage Exercises (Priority: P1)

As a GymFlow user, I can browse, search, filter, favorite, and create custom exercises so I can select appropriate movements for my workouts.

**Why this priority**: Exercise discovery is the foundation for workout planning and workout logging.

**Independent Test**: A signed-in user can browse grouped exercises, search and combine filters, manage favorites, create a custom exercise, and view exercise details without other GymFlow features being available.

**Acceptance Scenarios**:

1. **Given** predefined exercises exist, **When** I open the Exercise Library, **Then** I see exercises organized by their primary muscle group.
2. **Given** exercises exist, **When** I enter a partial name or select muscle, equipment, difficulty, or Favorites filters, **Then** I see only matching accessible exercises.
3. **Given** I view an exercise, **When** I open exercise details, **Then** I see its name, primary and secondary muscles, equipment, difficulty, instructions, optional `iconReference`, and suggested sets and repetitions.
4. **Given** I am signed in, **When** I favorite or unfavorite an exercise, **Then** only my favorite state changes and the exercise remains in the library.
5. **Given** I provide valid custom-exercise details, **When** I save the exercise, **Then** it is private to my account and becomes available in my exercise searches.

---

### User Story 2 - Build Workout Plans (Priority: P1)

As a GymFlow user, I can create and edit multiple workout plans containing ordered sessions and reusable exercises.

**Why this priority**: Plans provide the structure required to organize workouts and drive sequential rotation.

**Independent Test**: A user can create a plan with multiple sessions, add and reorder exercises, customize sets and repetitions, and edit or delete the plan without existing workout history changing.

**Acceptance Scenarios**:

1. **Given** I create a plan, **When** I add sessions, **Then** the sessions are stored in the order I specify.
2. **Given** I edit a session, **When** I add exercises, select muscle groups, and customize sets and repetitions, **Then** the session template retains those values.
3. **Given** sessions or exercises are ordered, **When** I reorder them, **Then** the saved sequence reflects my latest order.
4. **Given** I edit or delete a plan or exercise reference, **When** historical workouts exist, **Then** those completed workout records remain unchanged.

---

### User Story 3 - Advance Sessions by Completion (Priority: P1)

As a GymFlow user, I want each workout plan to maintain independent progress so the next workout follows the last completed session rather than a calendar or weekday.

**Why this priority**: Reliable sequential rotation is a core GymFlow behavior.

**Independent Test**: Multiple plans can independently complete sessions and resume, discard, or remain incomplete without advancing their own sequence or any other plan.

**Acceptance Scenarios**:

1. **Given** a three-session plan at session 1, **When** I complete session 1, **Then** the recommended session becomes session 2 regardless of elapsed time.
2. **Given** rest days or missed days occur, **When** no workout is completed, **Then** the plan's recommended session does not change.
3. **Given** a workout is saved incomplete or resumed, **When** it is not completed, **Then** the plan's rotation does not advance.
4. **Given** a resumed workout is completed, **When** completion is saved, **Then** the plan advances exactly once.
5. **Given** a workout is discarded, **When** it ends, **Then** it is not counted as completed and rotation remains unchanged.
6. **Given** two plans exist, **When** a session is completed in one plan, **Then** the recommended session in the other plan remains unchanged.

---

### User Story 4 - Track an Active Workout (Priority: P1)

As a GymFlow user, I can start a recommended session and record exercises, sets, weight, repetitions, duration, notes, and completion status.

**Why this priority**: Daily workout tracking delivers the application's primary recorded value.

**Independent Test**: A user can start a session, modify its live exercise list, record sets, finish or save incomplete, resume, discard, and confirm the correct previous-performance context.

**Acceptance Scenarios**:

1. **Given** I start the recommended session, **When** the active workout loads, **Then** it contains the planned exercise and set structure with editable workout values.
2. **Given** I am working on an exercise, **When** I add or remove sets or exercises, **Then** the active workout reflects those changes without changing its plan template.
3. **Given** prior performance exists, **When** I begin an exercise, **Then** I can see its most recent weight, repetitions, set count, and workout date.
4. **Given** I finish a valid workout, **When** I save it, **Then** it is recorded as completed and the plan advances exactly once.
5. **Given** I save an incomplete workout, **When** I open it later, **Then** I can resume it without advancing rotation.
6. **Given** I use the rest timer, **When** I start or stop it, **Then** the timer state is clear and does not falsely complete or save workout data.

---

### User Story 5 - Review Workout History (Priority: P2)

As a GymFlow user, I can review completed and incomplete workout activity in calendar and chronological views.

**Why this priority**: History provides recall, accountability, and the data foundation for progress analysis.

**Independent Test**: A workout is visible in both an appropriate calendar date and chronological list, and editing or removing related plans or exercises does not alter its saved details.

**Acceptance Scenarios**:

1. **Given** workouts exist, **When** I open Workout History, **Then** I can view entries in chronological and calendar views.
2. **Given** I open a history entry, **When** it loads, **Then** I see date, plan and session name, muscle groups, exercises, sets, repetitions, weights, and duration.
3. **Given** a plan or exercise is later edited or deleted, **When** I reopen prior history, **Then** the historical workout details remain unchanged.

---

### User Story 6 - Review Progress (Priority: P2)

As a GymFlow user, I can view summarized workout totals and exercise progression so I can understand my training trends.

**Why this priority**: Progress summaries convert recorded workouts into useful feedback.

**Independent Test**: Aggregates and personal records are calculated from completed workout records and remain reproducible after template changes.

**Acceptance Scenarios**:

1. **Given** completed workouts exist, **When** I open Progress, **Then** I see workout totals, completed sets and repetitions, and training volume.
2. **Given** an exercise has recorded history, **When** I view progression, **Then** I can see its prior performance and personal records.
3. **Given** completed workouts exist across time, **When** I view activity summaries, **Then** muscle-group frequency and weekly or monthly activity are shown accurately.

---

### Edge Cases

- Search text is blank or whitespace-only: treat it as no search text.
- No search or filter matches: show a clear empty state with a reset action.
- A custom exercise belongs to another user: it is neither visible nor accessible by identifier.
- An exercise icon or external exercise source becomes unavailable: exercise access remains usable and a default exercise icon is shown.
- Weight is entered with an unsupported value, unit, or negative number: reject it with field-specific feedback.
- Repetitions or set counts are omitted, zero, negative, or non-numeric: reject them or prevent invalid active-workout submission.
- A save request fails or connectivity is lost: preserve entered draft data and do not falsely indicate success.
- A workout is resumed or completed more than once concurrently: record exactly one completion and advance rotation once.
- A plan, session, exercise, or workout is deleted while another action is in progress: prevent stale-state corruption and provide clear feedback.
- Theme or preference storage is unavailable: use the default light theme without blocking core actions.
- Historical records reference a plan or exercise that has been edited or deleted: records remain independently readable.

## Requirements *(mandatory)*

### Functional Requirements

#### Exercise Library

- **FR-001**: The system MUST provide predefined exercises grouped by primary muscle group.
- **FR-002**: The MVP muscle-group taxonomy MUST include Chest, Back, Shoulders, Biceps, Triceps, Forearms, Legs, Quadriceps, Hamstrings, Glutes, Calves, Abs, and Core.
- **FR-003**: Each exercise MUST contain name, one primary muscle group, zero or more secondary muscle groups, equipment, difficulty, instructions, optional `iconReference`, suggested sets, and suggested repetitions. When `iconReference` is absent or unavailable, the UI MUST use a default exercise icon.
- **FR-004**: The system MUST support partial, case-insensitive exercise-name search across accessible predefined and custom exercises.
- **FR-005**: The system MUST support muscle-group, equipment, difficulty, and Favorites filters.
- **FR-006**: Multiple selected values within one filter category MUST use any-match semantics, while different active filter categories MUST be combined using intersection semantics.
- **FR-007**: A signed-in user MUST be able to favorite and unfavorite any accessible exercise.
- **FR-008**: Favorites MUST be private to the owning user and must not affect any other user.
- **FR-009**: A signed-in user MUST be able to create, edit, and delete only their own custom exercises.
- **FR-010**: Custom exercises MUST be visible only to their owner.
- **FR-011**: Predefined exercises MUST remain read-only to users.

#### Workout Plans

- **FR-012**: A signed-in user MUST be able to create, edit, and delete multiple workout plans.
- **FR-013**: A plan MUST contain one or more ordered workout sessions.
- **FR-014**: A session MUST allow selected muscle groups and exercises, customized sets, repetitions, and exercise order.
- **FR-015**: Users MUST be able to reorder sessions and exercises in a plan.
- **FR-016**: Plans and session templates MUST remain separate from status-visible workout history.
- **FR-017**: Editing or deleting a plan or exercise MUST NOT mutate or invalidate existing history records.

#### Sequential Workout Rotation

- **FR-018**: Each plan MUST maintain independent sequence progress.
- **FR-019**: Progress MUST be determined by the last completed session for that plan, not by weekdays or calendar dates.
- **FR-020**: Completing a workout MUST advance that plan by exactly one session.
- **FR-021**: Rest days and missed days MUST NOT advance or reset plan progress.
- **FR-022**: Incomplete, resumed, or discarded workouts MUST NOT advance plan progress.
- **FR-023**: Completing a resumed workout MUST advance the plan exactly once.
- **FR-024**: The recommended next session MUST be derived independently for each plan.
- **FR-025**: Completing or editing one plan MUST NOT affect another plan's progress.

#### Workout Tracking

- **FR-026**: A user MUST be able to start the recommended session for a plan.
- **FR-027**: An active workout MUST allow adding and removing exercises without changing the underlying plan template.
- **FR-028**: Users MUST be able to record set count, weight, repetitions, set completion status, exercise notes, and workout duration.
- **FR-029**: Weight input MUST support the user's kilograms or pounds preference.
- **FR-030**: Users MUST be able to finish a workout or save it as incomplete and resume it later.
- **FR-031**: The application MUST provide a rest timer during active workouts.
- **FR-032**: Before an exercise, when prior data exists, the system MUST show the most recent recorded weight, repetitions, set count, and workout date.

#### Workout History

- **FR-033**: The system MUST show workout history in chronological and calendar views, including completed, incomplete, and discarded attempts.
- **FR-034**: A history entry MUST preserve status, date, plan/session identity or name, muscle groups, exercises, sets, repetitions, weights, duration, and start-time snapshots where applicable.
- **FR-035**: Historical entries MUST remain readable after their source plan or exercise is changed or deleted. Incomplete entries preserve their start-time snapshot and can be resumed and completed.

#### Dashboard, Progress, and Navigation

- **FR-036**: The application MUST provide Dashboard, My Workouts, Exercise Library, Active Workout, Workout History, Progress, and Settings screens.
- **FR-037**: Progress MUST summarize workout totals, completed sets and repetitions, training volume, exercise progression, personal records, muscle-group frequency, and weekly/monthly activity.
- **FR-038**: Personal records and progression MUST be calculated from completed workout and set records.

#### User Experience and Security

- **FR-039**: Authentication and persistent user data MUST be supported, with the provider and unresolved integration details determined during planning.
- **FR-040**: Invalid inputs and save failures MUST produce clear feedback and preserve entered data.
- **FR-041**: The system MUST provide loading, empty, error, retry, success, incomplete, and discarded states for applicable workflows.
- **FR-042**: The system MUST support persistent light and dark themes.
- **FR-043**: All primary workflows MUST support keyboard-operated controls and meaningful labels.
- **FR-044**: The interface MUST provide clear no-results behavior and a reset action for exercise searches and filters.
- **FR-045**: The system MUST disclose unavailable exercise icons without blocking use of the library and MUST render a consistent default exercise icon.
- **FR-046**: Exercise, plan, active-workout, favorite, and history operations MUST enforce the authenticated user's ownership or access boundaries.

### Non-Functional Requirements

- **NFR-001**: The application MUST be usable from 320 CSS pixels through common desktop widths without blocked controls or horizontal page overflow.
- **NFR-002**: Primary layouts and controls MUST use a mobile-first responsive design.
- **NFR-003**: The interface MUST meet WCAG 2.1 AA requirements for text contrast and keyboard navigation.
- **NFR-004**: The system MUST preserve active-workout drafts and custom-exercise form drafts after recoverable save failures.
- **NFR-005**: Results, history, and progress views MUST remain usable as the user's stored data grows, using pagination or equivalent data loading strategies.
- **NFR-006**: All exercise, set, weight, repetition, and progress calculations MUST consistently validate units and reject invalid values.
- **NFR-007**: Historical workout details MUST be immutable with respect to later template or exercise edits.
- **NFR-008**: Authentication secrets and database credentials MUST not be stored in source code or test fixtures.
- **NFR-009**: External exercise data failures MUST not prevent users from browsing local or custom exercise content.
- **NFR-010**: Repeated or concurrent completion submissions MUST not advance rotation or create duplicate completed workouts.

### Key Entities *(include if feature involves data)*

- **User**: Owns plans, favorites, custom exercises, active workouts, workout history, preferences, and rotation progress.
- **Exercise**: Predefined or custom movement with muscles, equipment, difficulty, instructions, optional `iconReference`, and suggested sets/repetitions.
- **Muscle Group**: Fixed display and filtering taxonomy for exercise organization.
- **Favorite**: Private user-to-exercise relationship.
- **Workout Plan**: Named collection of ordered workout sessions.
- **Session Template**: Ordered exercise configuration within a plan.
- **Template Exercise**: Exercise reference and configured set/repetition values within a session.
- **Workout Attempt**: Active, incomplete, completed, or discarded workout instance.
- **Exercise Log**: Recorded performance for an exercise within a workout attempt.
- **Set Log**: Recorded weight, repetitions, completion status, and optional set metadata for an exercise log.
- **Workout History**: Status-visible snapshot of completed, incomplete, or discarded workout details at the relevant snapshot point.
- **Personal Record**: Derived exercise performance record calculated from completed set or workout history.
- **User Preference**: Theme, weight unit, and applicable display settings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tested three-session rotation scenarios recommend session 2 after session 1 completes, regardless of elapsed calendar time.
- **SC-002**: Rest days, missed days, incomplete saves, resumes, and discarded workouts produce 0 unintended rotation advancements.
- **SC-003**: 100% of concurrent completion attempts advance a plan exactly once and create no duplicate completion.
- **SC-004**: Completing a session in one plan leaves 100% of independently tested other plans unchanged.
- **SC-005**: Users can create a plan, add and reorder sessions and exercises, and customize sets/repetitions in an end-to-end usability test.
- **SC-006**: Active-workout set logging shows prior performance when available and correctly records kg or lb values according to user settings.
- **SC-007**: Editing or deleting a plan or exercise leaves 100% of previously saved workout-history details unchanged in tested cases.
- **SC-008**: Search, filters, favorites, custom exercises, history, and active workout flows remain operable at 320 CSS pixels and common desktop widths.
- **SC-009**: Invalid inputs and simulated save failures preserve draft data and never display false saved-success feedback.
- **SC-010**: 95% of first-attempt test users can find a known exercise and start a recommended workout without assistance.

## Assumptions

- The application has authenticated users and persistent storage; providers are identified during technical planning if not already established.
- Session plans do not use fixed weekdays or dates as progression rules.
- Historical data stores snapshots or equivalent immutable references for plan and exercise names and performance details.
- Weight units are kilograms and pounds according to per-user settings.
- External exercise sources are supplementary and may be unavailable without blocking locally stored exercises.
- Predefined exercise content and optional icon references must be appropriate and must not provide medical or personalized clinical advice.
- Exercise customizations made during an active workout do not mutate the source plan unless the user explicitly edits the plan separately.
- Calendar history is based on actual completed or saved workout dates rather than planned weekdays.

## Out of Scope

- Fixed weekday scheduling or calendar-based workout advancement.
- Medical, diagnostic, rehabilitation, or personalized clinical advice.
- Social sharing, workouts shared by multiple users, ratings, or community exercise moderation.
- External-source credentials or live third-party service guarantees.
- Billing or paid subscription management.
- Advanced coaching algorithms beyond the specified sequential completion rotation.
- Public or anonymous access to private plans, workouts, favorites, history, or progress.

## Clarifications

### Session 2026-11-19

- **Final-session rotation**: Completing the last session wraps the plan to the first session. Rest days, missed days, incomplete workouts, and discarded workouts do not advance rotation.
- **Empty plans**: Plans with no valid sessions cannot be started and have no next workout. If the current session is deleted, rotation recommends the next remaining session in plan order; if no sessions remain, rotation pauses until a valid session is added.
- **Active-workout snapshots**: Starting a workout snapshots the session and exercise details. An incomplete workout remains resumable and is not changed by later edits or deletion of source plans, sessions, or exercises. Completing it advances the source plan exactly once.
- **History status**: Calendar and chronological history include completed, incomplete, and discarded attempts. Status remains visible; discarded and incomplete attempts do not count as completions or advance rotation.
- **Exercise icons**: Exercise icons use optional `iconReference` values for predefined and custom exercises. The MVP provides icon-only exercise presentation and uses a consistent default exercise icon when unavailable.
- **Muscle taxonomy**: Each exercise has exactly one primary muscle group and zero or more secondary muscle groups from the fixed supported taxonomy.
- **Equipment and difficulty**: Equipment is selected from predefined values, including `Other` for custom exercises. Difficulty is exactly `Beginner`, `Intermediate`, or `Advanced`.
