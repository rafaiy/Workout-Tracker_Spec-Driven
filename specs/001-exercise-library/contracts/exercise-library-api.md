# GymFlow REST Contract

Authentication is required for every endpoint. Responses use a shared error envelope and 400, 401, 403, 404, 409, and 500 status codes as applicable.

## Exercise Endpoints

**GET /api/v1/exercises**

Supports search, repeated filters, Favorites, and pagination.

- Search is case-insensitive and partial.
- Muscle/equipment/difficulty values use OR within a category and AND across categories.
- Secondary muscles are optional and may be empty.
- Icons are optional and use `iconReference`; missing/unsupported references use the default exercise icon.

**GET /api/v1/exercises/:exerciseId**

Returns an accessible predefined or owned custom exercise.

**POST /api/v1/exercises**

Creates a custom exercise for the authenticated user.

Required fields: `name`, `primaryMuscleGroup`, `secondaryMuscleGroups`, `equipment`, `difficulty`, `instructions`, `suggestedSets`, `suggestedReps`.

Optional: `iconReference`.

**PATCH /api/v1/exercises/:exerciseId**

Edits only an owned custom exercise.

**DELETE /api/v1/exercises/:exerciseId**

Deletes only an owned custom exercise.

- Cross-user records return 404.
- Predefined mutation attempts return 403.

**PUT/DELETE /api/v1/exercises/:exerciseId/favorite**

Adds or removes the authenticated user's favorite relationship.

## Plan, Rotation, and Workout Endpoints

- `GET/POST /api/v1/plans`
- `GET/PATCH/DELETE /api/v1/plans/:planId`
- `GET/POST /api/v1/plans/:planId/sessions`
- `PATCH/DELETE /api/v1/plans/:planId/sessions/:sessionId`
- `PUT /api/v1/plans/:planId/sessions/reorder`
- `POST/PATCH/DELETE /api/v1/plans/:planId/sessions/:sessionId/exercises`
- `GET /api/v1/plans/:planId/next-session`
- `POST /api/v1/plans/:planId/workouts/start`
- `GET/PATCH /api/v1/workouts/:workoutId`
- `POST /api/v1/workouts/:workoutId/save-incomplete`
- `POST /api/v1/workouts/:workoutId/discard`
- `POST /api/v1/workouts/:workoutId/complete`

Completing a workout is atomic and idempotent. The final session wraps to the first. Empty plans return no next workout and 409 if start is attempted.

Starting a workout captures a session/exercise snapshot. Plan/template edits afterward do not mutate that snapshot.

## History and Progress

- `GET /api/v1/history` — chronological completed, incomplete, and discarded entries.
- `GET /api/v1/history/calendar?month=YYYY-MM` — calendar entries grouped by workout date.
- `GET /api/v1/history/:workoutId` — immutable status and workout snapshot.
- `GET /api/v1/progress/summary`
- `GET /api/v1/progress/exercises/:exerciseId`

History entries include an explicit `status` of `completed`, `in_progress`, or `discarded`. Only completed entries contribute to progression and personal records.

## Consistent Error Shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [
      { "field": "suggestedReps", "message": "Must be a positive integer" }
    ]
  }
}
```
