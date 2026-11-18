# Feature Specification: Exercise Library

**Feature Branch**: `001-exercise-library`  
**Created**: 2026-11-18  
**Status**: Draft  
**Input**: User description: "Specify Feature #1: Exercise Library for GymFlow – Your Workouts. Your Sequence. Your Progress."

## Clarifications

### Session 2026-11-19

- Q: What should the equipment and difficulty filter values use? → A: Fixed curated lists for both fields.
- Q: When a user selects multiple values within one filter, should matching use any or every selected value? → A: Match any selected value within a filter category; require matches across different active filter categories.
- Q: How should suggested sets and reps be represented for exercises? → A: Separate positive numeric values for sets and reps.
- Q: Must every exercise have an image or demo reference, or may that field be left empty? → A: Required for predefined exercises only; custom exercises may omit it.
- Q: Which difficulty levels should the fixed MVP taxonomy include? → A: Beginner, Intermediate, Advanced.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and Discover Exercises (Priority: P1)

As a GymFlow user, I can browse and select from a library of predefined exercises organized by muscle group so I record the suitable movements for a workout.

**Why this priority**: Browsing is the foundation of the exercise library and provides immediate value without dependencies on workout planning or logging.

**Independent Test**: Seeded predefined exercises can be viewed in muscle-group groups, and all predefined exercise records remain available in read-only mode.

**Acceptance Scenarios**:

1. **Given** I am signed in and open the exercise library, **When** the page loads, **Then** I see predefined exercises grouped by the fixed MVP muscle-group taxonomy.
2. **Given** exercises exist for a muscle group, **When** I select that muscle group, **Then** I see only exercises associated with it, including custom exercises I own where applicable.
3. **Given** I select an exercise, **When** I open its detail view, **Then** I see its name, primary muscles, secondary muscles, equipment, difficulty, instructions, image/demo reference, and suggested sets/reps.

---

### User Story 2 - Search and Combine Filters (Priority: P1)

As a GymFlow user, I can search by exercise name and combine muscle group, equipment, difficulty, and favorites filters so I can quickly find an appropriate exercise.

**Why this priority**: Search and filtering are essential for usability as the library grows and are core to the feature request.

**Independent Test**: Search and each individual filter can be tested independently, followed by tests proving that combined filters use intersection logic.

**Acceptance Scenarios**:

1. **Given** predefined and custom exercises exist, **When** I enter a partial exercise name using different letter casing, **Then** matching names are displayed regardless of case.
2. **Given** a set of exercises exists, **When** I select one muscle group, equipment value, and difficulty level, **Then** only exercises matching all selected values are displayed.
3. **Given** I enable the Favorites filter, **When** the results load, **Then** I see only exercises I have favorited.
4. **Given** no exercise matches the active search or filters, **When** results are evaluated, **Then** I see a clear empty state with controls to reset filters.

---

### User Story 3 - Favorite Exercises (Priority: P2)

As a GymFlow user, I can mark predefined or my own custom exercises as favorites and remove them later so frequently used exercises are easy to find.

**Why this priority**: Favorites improve repeated discovery and directly support the user's requested workflow, but the library remains useful without them.

**Independent Test**: A favorite can be added and removed for both a predefined exercise and an owned custom exercise, and the change affects only the signed-in user's Favorites view.

**Acceptance Scenarios**:

1. **Given** I view an exercise that is not favorited, **When** I activate Favorite, **Then** the exercise is marked as favorited for my account.
2. **Given** I view an exercise that is favorited, **When** I activate Unfavorite, **Then** the favorite status is removed without deleting the exercise.
3. **Given** I have favorited exercises, **When** I open Favorites, **Then** I see only my favorited predefined and owned custom exercises.

---

### User Story 4 - Create and Manage Custom Exercises (Priority: P2)

As a GymFlow user, I can create, edit, and delete my own custom exercises so I can represent movements not available in the predefined library.

**Why this priority**: Custom exercises support personalization, but the predefined library must remain usable if no custom exercises have been created.

**Independent Test**: One signed-in user can create, edit, delete, and search for a custom exercise while a second user cannot view or modify it.

**Acceptance Scenarios**:

1. **Given** I provide all required custom-exercise fields with valid values, **When** I submit the form, **Then** the exercise is created and associated with my account.
2. **Given** I own a custom exercise, **When** I edit it, **Then** only the editable exercise fields change and no predefined exercise changes.
3. **Given** I own a custom exercise, **When** I delete it, **Then** it is removed from my searchable library and Favorites view.
4. **Given** I attempt to edit or delete a predefined exercise, **When** I submit the action, **Then** the action is rejected and the exercise remains unchanged.
5. **Given** a custom exercise belongs to another user, **When** I search or browse, **Then** I cannot see, open, edit, or delete it.

---

### Edge Cases

- Search text contains only spaces or has no matches: the system treats it as an empty search or displays a clear no-results state.
- The user selects multiple values of the same filter category: matching uses any selected value within that category, then intersects matches across active categories.
- Required custom-exercise fields are omitted or contain invalid values, including non-positive or non-numeric sets/reps: submission is blocked and field-specific feedback is shown.
- A custom exercise is deleted while it is favorited: the favorite relationship is removed and no stale Favorites entry remains.
- A predefined exercise is missing a demo reference despite the predefined requirement: the record is treated as invalid seeded data and is not published to the library.
- A custom exercise has the same name as a predefined or another user's exercise: names are not required to be globally unique and may coexist.
- The user loses network connectivity or a save request fails: the entered custom-exercise data remains available for retry and no false success message is shown.
- Theme or accessibility preferences are unavailable or reset: default light appearance is used without preventing exercise access.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide predefined exercises seeded from a curated list and expose them to all authenticated users in read-only form.
- **FR-002**: The system MUST include the fixed MVP muscle-group taxonomy: Chest, Back, Shoulders, Biceps, Triceps, Forearms, Legs, Quadriceps, Hamstrings, Glutes, Calves, Abs and Core.
- **FR-003**: The system MUST organize browsable exercises by primary muscle group and permit an exercise to be associated with one primary muscle group and one or more secondary muscle groups.
- **FR-004**: The system MUST support case-insensitive partial-name search across accessible predefined and owned custom exercises.
- **FR-005**: The system MUST support combinable filters for muscle group, equipment, difficulty, and favorites.
- **FR-005A**: The system MUST use fixed curated equipment and difficulty taxonomy lists for predefined and custom exercises. Difficulty MUST be exactly one of Beginner, Intermediate, or Advanced, and other values MUST be rejected.
- **FR-006**: The system MUST apply combinable filter conditions using category-based behavior: an exercise MUST match at least one selected value within each active category and MUST match every active category that differs from Favorites status.
- **FR-007**: The system MUST display an exercise detail view containing name, primary muscles, secondary muscles, equipment, difficulty, instructions, image/demo reference, and suggested sets/reps.
- **FR-008**: The system MUST allow an authenticated user to favorite and unfavorite any accessible predefined or owned custom exercise.
- **FR-009**: Favorites MUST be scoped per user and MUST NOT affect another user's favorite state.
- **FR-010**: The system MUST allow an authenticated user to create a custom exercise with name, primary muscles, secondary muscles, equipment, difficulty, instructions, image/demo reference, and separate suggested set and rep values; both numeric values MUST be positive.
- **FR-011**: The system MUST validate every required custom-exercise field before accepting creation or edit, including that suggested sets and reps are positive numeric values, and provide field-specific error feedback for invalid submissions.
- **FR-012**: The system MUST allow a user to edit only their own custom exercises.
- **FR-013**: The system MUST allow a user to delete only their own custom exercises.
- **FR-014**: The system MUST prevent predefined exercises from being edited or deleted by users.
- **FR-015**: Custom exercises MUST be visible only to their owning user.
- **FR-016**: The system MUST use clear loading, empty, error, and retry states for browsing, searching, filtering, favoriting, and custom-exercise management.
- **FR-017**: The system MUST provide mobile-first responsive layouts for desktop and mobile browsers.
- **FR-018**: The system MUST support persistent light and dark theme preferences per user.
- **FR-019**: The system MUST provide keyboard-operable controls and meaningful labels for search, filters, favorite actions, exercise details, and custom-exercise forms.
- **FR-020**: The system MUST maintain a consistent no-results state and provide an available reset-filter action.
- **FR-021**: The system MUST prevent stale favorites or unauthorized custom-exercise access after an exercise is deleted or ownership changes.
- **FR-022**: The system MUST preserve all predefined exercise metadata read-only and must not mutate predefined records through custom exercise actions.
- **FR-001A**: Predefined exercises MUST include a valid image or demo reference before they are available in the library; custom exercises MAY omit this reference.

### Non-Functional Requirements

- **NFR-001**: Exercise search and filter results MUST be visible to the user within 2 seconds at the MVP scale of 1,000 accessible exercises.
- **NFR-002**: The library MUST remain usable at common mobile viewport widths down to 320 CSS pixels and desktop widths up to 1920 CSS pixels.
- **NFR-003**: The user interface MUST meet WCAG 2.1 AA color-contrast requirements and support keyboard-only navigation.
- **NFR-004**: All exercise operations MUST return clear user-facing success or failure feedback and must not silently discard user input.
- **NFR-005**: Custom exercise data MUST remain private to the owning user for browsing and detail access.
- **NFR-006**: Exercise data validation MUST run consistently across submission and update paths, including blank names and invalid suggested sets/reps.
- **NFR-007**: The feature MUST avoid exposing workout plans, workout history, logging, analytics, or rotation controls outside the stated scope.

### Key Entities *(include if feature involves data)*

- **Exercise**: A predefined or custom movement. Required attributes are name, primary muscles, secondary muscles, equipment, difficulty, instructions, image/demo reference, suggested sets, and suggested reps. Suggested sets and suggested reps are separate positive numeric values. Ownership distinguishes seeded predefined exercises from user-created custom exercises.
- **Muscle Group**: A fixed MVP taxonomy value from the approved list. Used for primary and secondary muscle classification and browsing.
- **Favorite**: A user-to-exercise relationship indicating that the exercise is marked as a favorite. It is private to the owning user.
- **Custom Exercise**: A user-owned Exercise that may be edited or deleted only by that owner and is not shared across accounts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of test users can find a known exercise using search or a combination of filters within 30 seconds on a first attempt.
- **SC-002**: At least 95% of test users can favorite or unfavorite an exercise without leaving the current browse context on the first attempt.
- **SC-003**: 95% of test users can create a complete custom exercise without validation or navigation assistance on the first attempt.
- **SC-004**: 100% of tested attempts to access, edit, or delete another user's custom exercise are denied.
- **SC-005**: 100% of tested attempts to edit or delete a predefined exercise are rejected.
- **SC-006**: A combined search and filter request for up to 1,000 accessible exercises completes and presents results within 2 seconds in at least 95% of measured sessions.
- **SC-007**: All primary flows—browse, search/filter, view details, favorite, create, edit, and delete—can be completed using only a keyboard.
- **SC-008**: The mobile and desktop layouts show no blocked controls or horizontal page overflow at 320 CSS pixels and 1920 CSS pixels.
- **SC-009**: 100% of custom-exercise forms display field-specific validation feedback for omitted required fields or invalid suggested sets/reps.

## Assumptions

- The application has an existing authenticated-user concept before this feature is integrated.
- Predefined exercise records are seeded into the GymFlow library and are not user-manageable.
- Equipment values use a fixed curated taxonomy; difficulty values are fixed to Beginner, Intermediate, or Advanced. Taxonomy extensions require an authorized product configuration change.
- One exercise has one primary muscle group and may have multiple secondary muscle groups.
- The image/demo reference is required for predefined exercises and optional for custom exercises.
- Search matches exercise names by partial text and ignores letter casing.
- Filter categories use intersection behavior across categories; within a multi-select category, an exercise matches if it matches any selected value in that category.
- Custom exercise deletion removes it from active library and favorite views for the owner; historical cross-feature usage is outside this feature's scope.
- The feature is delivered only for authenticated users; public or anonymous library access is out of scope.
- Pagination or virtualization is applied if needed by the implementation to maintain library responsiveness.

## Out of Scope

- Workout plan creation and editing
- Session templates
- Smart workout rotation
- Active workout logging or set-entry
- Workout history and calendar views
- Previous workout comparison
- Progress dashboard and analytics
- Sharing custom exercises with other users
- Social features and exercise ratings
- Public/anonymous exercise browsing
