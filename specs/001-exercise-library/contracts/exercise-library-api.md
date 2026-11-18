# Exercise Library REST Contract

Authentication is required for every endpoint. Responses use a consistent error shape and HTTP status codes 400, 401, 403, 404, and 500 as applicable.

## List and Search Exercises

**GET /api/exercises**

Query parameters:
- `search`: optional partial exercise name
- `muscleGroups`: optional repeated or comma-separated muscle-group values
- `equipment`: optional repeated or comma-separated curated values
- `difficulty`: optional repeated or comma-separated values
- `favorites`: optional boolean
- `page`: optional positive integer
- `pageSize`: optional positive integer

Response: Paginated accessible exercises: predefined records plus the authenticated user's custom exercises.

Semantics:
- Name search is case-insensitive and partial.
- Values are OR within a category.
- Categories are AND across each other.
- The Favorites filter includes only the authenticated user's favorites.

## Get Exercise Details

**GET /api/exercises/{exerciseId}**

Returns a predefined exercise or an owned custom exercise.

Forbidden or missing custom exercise for another user: 404 or 403 according to privacy policy. No other user's metadata is disclosed.

## Create Custom Exercise

**POST /api/exercises**

Required fields:
- `name`
- `primaryMuscleGroup`
- `secondaryMuscleGroups`
- `equipment`
- `difficulty`
- `instructions`
- `suggestedSets`
- `suggestedReps`

Optional:
- `demoReference`

Validation:
- 400 for missing required fields or invalid enum/numeric values.
- Suggested sets/reps must be positive numbers.
- Difficulty must be Beginner, Intermediate, or Advanced.
- Custom exercise is associated with the authenticated user.

## Edit Custom Exercise

**PATCH /api/exercises/{exerciseId}**

Allowed only for a custom exercise owned by the authenticated user.

- 403 or 404 for a predefined or inaccessible exercise.
- 400 for invalid fields or values.
- Other exercise metadata remains unaffected.

## Delete Custom Exercise

**DELETE /api/exercises/{exerciseId}**

Allowed only for a custom exercise owned by the authenticated user.

- Removes the custom exercise and associated favorite records.
- 403 or 404 for predefined or inaccessible exercises.

## Favorite Exercise

**PUT /api/exercises/{exerciseId}/favorite**

Creates the authenticated user's favorite relationship.

- 404 if the exercise is inaccessible.
- Idempotent when already favorited.

## Unfavorite Exercise

**DELETE /api/exercises/{exerciseId}/favorite**

Removes only the authenticated user's favorite relationship.

- Idempotent if already unfavorited.

## Consistent Error Shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [
      {
        "field": "suggestedReps",
        "message": "Must be a positive number"
      }
    ]
  }
}
```
