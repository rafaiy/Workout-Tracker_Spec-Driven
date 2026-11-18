# Data Model: Exercise Library

## Exercise

Represents a predefined or custom exercise.

| Field | Type | Validation/Rules |
|---|---|---|
| id | UUID | immutable primary key |
| name | text | required, trimmed, non-empty, length limits |
| primaryMuscleGroup | enum | required; approved MVP taxonomy |
| secondaryMuscleGroups | list<enum> | optional; values from approved taxonomy |
| equipment | enum | required; curated MVP equipment taxonomy |
| difficulty | enum | required; Beginner, Intermediate, or Advanced |
| instructions | text | required, trimmed, non-empty |
| demoReference | text/URL | required for predefined; optional for custom |
| suggestedSets | integer | required, positive |
| suggestedReps | integer | required, positive |
| source | enum | predefined or custom |
| ownerUserId | UUID/null | required for custom; null for predefined |
| createdAt | timestamp | immutable |
| updatedAt | timestamp | updated only for custom exercise edits |

### Rules

- Predefined exercises are read-only to users.
- Custom exercises are visible and editable only by ownerUserId.
- Custom names are not globally unique.
- Deleting a custom exercise removes active-library and Favorites entries.
- Exercise metadata deletion must not mutate future or historical workout references.

## MuscleGroup

A fixed taxonomy value:

Chest, Back, Shoulders, Biceps, Triceps, Forearms, Legs, Quadriceps, Hamstrings, Glutes, Calves, Abs and Core.

## ExerciseFavorite

Represents a user's favorite state for one accessible exercise.

| Field | Type | Rules |
|---|---|---|
| userId | UUID | required |
| exerciseId | UUID | required and accessible to user |
| createdAt | timestamp | immutable |

- Unique together: userId + exerciseId.
- Favorite relationships are private per user.
- Deleting a custom exercise removes its favorite records.

## Relationships

- User 1 — * ExerciseFavorite * — 1 Exercise
- Custom Exercise * — 1 owning User
- Exercise * — 1 primary MuscleGroup
- Exercise * — * secondary MuscleGroup values
- Predefined Exercise source is not owned by a user

## State/Integrity Rules

- Create and edit custom exercises are the only exercise mutations available to users.
- Delete custom exercises only as owner.
- Predefined create/edit/delete operations are prohibited.
- Custom exercise visibility is enforced server-side even if a URL or identifier is guessed.
