# Quickstart Validation: Exercise Library

## Prerequisites

- Authenticated GymFlow user accounts for at least two users.
- Seeded predefined exercise records with valid media references.
- Fixed muscle, equipment, and difficulty taxonomies loaded.

## Browse and Detail Validation

1. Sign in and open the Exercise Library.
2. Verify predefined exercises appear grouped by the fixed muscle-group taxonomy.
3. Open an exercise and verify name, primary muscles, secondary muscles, equipment, difficulty, instructions, demo reference, and suggested sets/reps.
4. Verify a custom exercise belonging to a different user is not visible.

Expected: Library and detail views render with loading, empty, error, and retry states where applicable.

## Search and Filter Validation

1. Search by a partial exercise name using mixed letter casing.
2. Select one or more values within a category.
3. Combine muscle group, equipment, difficulty, and Favorites filters.
4. Reset filters and repeat with no matching results.

Expected: Search is case-insensitive and partial. Matching is OR within a category and AND across active categories.

## Favorite Validation

1. Favorite a predefined exercise.
2. Open Favorites and verify it appears.
3. Favorite an owned custom exercise and repeat.
4. Sign in as a second user and verify favorite state is independent.
5. Unfavorite both exercises.

Expected: Favorite state changes without deleting the exercise and is user-scoped.

## Custom Exercise Validation

1. Create a custom exercise with valid required fields and positive suggested sets/reps.
2. Edit the exercise and verify changes apply only to that record.
3. Submit invalid values and verify field-specific feedback.
4. Delete the custom exercise and verify it disappears from browse and Favorites.
5. Attempt to edit or delete a predefined exercise.

Expected: Valid custom CRUD succeeds for the owner; invalid input is blocked; predefined records remain unchanged.

## Privacy Validation

1. Sign in as User A and create a custom exercise.
2. Sign in as User B and search for the exercise.
3. Attempt direct detail/edit/delete access by identifier if the interface exposes URLs or identifiers.

Expected: User B receives not found or forbidden; no custom exercise metadata is disclosed.

## Accessibility and Responsive Validation

1. Complete browse, search, favorite, detail, create, edit, and delete flows using keyboard only.
2. Verify visible labels and sufficient focus indicators.
3. Test 320 px and 1920 px viewport widths with light and dark themes.

Expected: No blocked controls, horizontal page overflow, or WCAG 2.1 AA contrast failures.
