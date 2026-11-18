# Data Model: GymFlow MVP

## Closed Enums (MVP)

### MuscleGroup
`Chest`, `Back`, `Shoulders`, `Biceps`, `Triceps`, `Forearms`, `Legs`, `Quadriceps`, `Hamstrings`, `Glutes`, `Calves`, `Abs`, `Core`.

### Equipment
A fixed predefined list contains `Barbell`, `Dumbbell`, `Kettlebell`, `Machine`, `Cable`, `Bodyweight`, `Resistance Band`, and `Other`. `Other` is available for custom exercises. Administrators cannot introduce additional runtime values outside an approved specification amendment.

### Difficulty
`Beginner`, `Intermediate`, `Advanced`.

## Exercise

Represents a predefined or custom exercise.

| Field | Type | Validation/Rules |
|---|---|---|
| id | UUID | immutable primary key |
| name | text | required, trimmed, non-empty |
| primaryMuscleGroup | enum | required; exactly one supported muscle group |
| secondaryMuscleGroups | list<MuscleGroup> | optional; zero or more supported values; disjoint from primary; may be empty |
| equipment | Equipment | required; exactly one predefined value, including `Other` for custom exercises |
| difficulty | Difficulty | required; exactly one of Beginner, Intermediate, Advanced |
| iconReference | text/null | optional icon identifier/reference; null or missing value uses the default exercise icon |
| suggestedSets | integer | required, positive |
| suggestedReps | integer | required, positive |
| source | enum | predefined or custom |
| ownerUserId | UUID/null | required for custom; null for predefined |
| createdAt | timestamp | immutable |
| updatedAt | timestamp | updated only for custom exercise edits |

### Rules

- Predefined and custom exercises may omit their icon reference.
- Exercise icons are optional; unsupported or missing icon references use a consistent default exercise icon.
- Predefined exercises are read-only to users.
- Custom exercises are visible and editable only by ownerUserId.
- Custom names are not globally unique.

## ExerciseFavorite

| Field | Type | Rules |
|---|---|---|
| userId | UUID | required |
| exerciseId | UUID | required and accessible to user |
| createdAt | timestamp | immutable |

- Unique together: userId + exerciseId.
- Favorite relationships are private per user.
- Deleting a custom exercise removes its favorite records.

## Workout and Rotation Entities

- `WorkoutPlan`: owned collection of ordered session templates and one rotation progress record.
- `PlanSessionTemplate`: ordered session with a stable session snapshot.
- `TemplateExercise`: ordered exercise configuration with suggested sets/repetitions.
- `PlanRotationProgress`: stores the last completed session and plan progress version.
- `WorkoutAttempt`: stores state `not_started`, `in_progress`, `completed`, or `discarded` plus the immutable snapshot of session and exercise details captured when started.
- `ExerciseLog`: workout attempt exercise snapshot and ordered set records.
- `SetLog`: weight, unit, repetitions, and completion status.
- `WorkoutHistorySnapshot`: immutable completed, incomplete, or discarded attempt display snapshot.

## Rotation Rules

- Completing the current session advances to the next ordered session.
- Completing the final session wraps to the first session.
- Rest/missed days, incomplete saves, resumes, and discards do not alter progress.
- Completion uses a transaction and idempotency/version guard to advance exactly once.
- A plan with no valid sessions has no next workout and pauses until a valid session is added.
- Deleting the current session recommends the next remaining session in plan order.

## Active-Workout Snapshot Rules

- The session and exercise details are snapshotted when the workout starts.
- Subsequent plan, session, or exercise edits do not alter the active workout snapshot.
- An incomplete workout remains resumable and can complete later.
- Completion advances the source plan exactly once.
- Discarded or incomplete workouts remain in history where applicable but do not advance rotation.

## History Rules

- Calendar and chronological history include completed, incomplete, and discarded attempts.
- Every entry exposes its status.
- Completed entries are immutable and used for progress and personal records.
- Incomplete/discarded entries do not count as completions or affect progress/rotation.

## Snapshot Integrity

The completion and active-workout paths must serialize plan, session, exercise, set, weight, unit, and duration details into immutable or append-only history records. Editing or deleting source configuration must not mutate existing entries.

