# GymFlow MVP Quickstart Validation

## Prerequisites

- Authenticated GymFlow accounts for at least two users.
- PostgreSQL or isolated SQLite test database with migrations applied.
- Curated exercises, fixed muscle/equipment/difficulty taxonomies, and default exercise icon.

## Exercise Library

1. Open Exercise Library and verify exercises are grouped by primary muscle.
2. Search by partial mixed-case name and combine fixed filters.
3. Favorite and unfavorite predefined and owned custom exercises.
4. Create/edit/delete a custom exercise and verify cross-user privacy.
5. Verify missing or unavailable `iconReference` values show the default icon.

## Plans and Rotation

1. Create a plan with at least three ordered sessions.
2. Add/reorder template exercises and customize sets/repetitions.
3. Complete session 1 and verify session 2 becomes recommended.
4. Complete the final session and verify rotation wraps to session 1.
5. Save incomplete, resume, and discard workouts; verify each does not advance rotation.
6. Complete a resumed workout and verify exactly-one advancement and no duplicate completion.

## Active Workout and Previous Performance

1. Start the recommended session and verify it has the planned exercise/set structure.
2. Add/remove active-workout exercises without changing the plan template.
3. Record kg/lb weights, repetitions, set completion, notes, rest timer, and duration.
4. Verify prior performance shows the latest completed weight, repetitions, set count, and date.
5. Edit/delete the source plan/session/exercise while the workout is incomplete and verify the active snapshot is unchanged.

## History

1. Finish, save incomplete, and discard separate workout attempts.
2. Verify chronological and calendar history show each status as Completed, Incomplete, or Discarded.
3. Verify incomplete/discarded entries do not affect totals or personal records.
4. Reopen history after source plan/exercise edits/deletes and verify readable snapshots.

## Progress and UX

1. Verify completed totals, volume, PRs, muscle frequency, and weekly/monthly activity.
2. Complete flows using keyboard-only controls at 320 px and common desktop widths.
3. Verify light/dark themes, labels, focus indicators, contrast, loading, empty, error, retry, and save-failure states.
4. Simulate save failure and verify entered data remains available with no false success message.
