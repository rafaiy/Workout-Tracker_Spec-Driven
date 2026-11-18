# Clarification Coverage Checklist

**Purpose**: Confirm all five GymFlow clarification answers are reflected in implementation artifacts.
**Created**: 2026-11-19
**Feature**: [spec.md](../spec.md)

## Coverage Status

- [x] Final sessions wrap to the first session.
- [x] Empty plans pause rotation and deleted current sessions select the next remaining session.
- [x] Active workouts preserve start-time session/exercise snapshots.
- [x] Completed, incomplete, and discarded attempts appear in history with status.
- [x] Exercises use optional `iconReference` values only and fall back to a default icon.
- [x] Each exercise has one primary and zero or more secondary muscles.
- [x] Equipment uses a predefined list with `Other` for custom exercises.
- [x] Difficulty is Beginner, Intermediate, or Advanced.

## Implementation Review Items

- [ ] CHK001 - A current-session completion fixture verifies wrap to session 1 after the final session. [Test]
- [ ] CHK002 - An empty-plan fixture verifies no next workout and prevents start. [Test]
- [ ] CHK003 - A deleted-current-session fixture verifies the next remaining session is recommended. [Test]
- [ ] CHK004 - Source plan/session/exercise mutation fixtures preserve active workout snapshots. [Test]
- [ ] CHK005 - History fixtures verify Completed, Incomplete, and Discarded labels and aggregation rules. [Test]
- [ ] CHK006 - Exercise fixtures verify missing icons use the default icon and unsupported icon references fall back consistently. [Test]
- [ ] CHK007 - Secondary-muscle fixtures verify zero to many supported values and primary-muscle disjointness. [Test]
- [ ] CHK008 - Equipment/difficulty fixtures reject unsupported values and accept only the closed taxonomies. [Test]
