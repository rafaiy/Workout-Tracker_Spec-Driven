# GymFlow Post-Clarification Review Checklist

**Purpose**: Verify that the final clarifications are complete, consistent, measurable, and traceable before implementation.
**Created**: 2026-11-19
**Feature**: [spec.md](../spec.md)

## Clarified Rotation Behavior

- [ ] CHK001 - Is cyclic wrap to the first session explicitly required after the final session completes? [Clarity, Spec Clarifications]
- [ ] CHK002 - Are rest days and missed days explicitly excluded from rotation advancement? [Clarity, Spec Clarifications]
- [ ] CHK003 - Are incomplete saves, resumes, and discarded workouts explicitly excluded from advancement? [Consistency, Spec Clarifications]
- [ ] CHK004 - Is no-next-session behavior defined for plans with no valid sessions? [Completeness, Spec Clarifications]
- [ ] CHK005 - Is deletion of the current session resolved by recommending the next remaining session in plan order? [Completeness, Spec Clarifications]
- [ ] CHK006 - Is paused rotation with no sessions distinguishable from a valid next-session recommendation? [Clarity, Spec Clarifications]

## Active-Workout Snapshots

- [ ] CHK007 - Does starting a workout explicitly snapshot session and exercise details? [Completeness, Spec Clarifications]
- [ ] CHK008 - Are incomplete workouts explicitly resumable after source configuration changes? [Clarity, Spec Clarifications]
- [ ] CHK009 - Do plan, session, and exercise edits/deletes explicitly leave active snapshots unchanged? [Consistency, Spec Clarifications]
- [ ] CHK010 - Does completing a resumed workout advance the source plan exactly once? [Measurability, Spec Clarifications]
- [ ] CHK011 - Are discarded and incomplete workouts prevented from advancing rotation? [Consistency, Spec Clarifications]

## History and Status

- [ ] CHK012 - Does history include completed, incomplete, and discarded attempts in both chronological and calendar views? [Completeness, Spec Clarifications]
- [ ] CHK013 - Is each history entry required to expose an explicit status? [Clarity, Spec Clarifications]
- [ ] CHK014 - Are incomplete/discarded entries prevented from counting as completions or progress? [Consistency, Spec Clarifications]
- [ ] CHK015 - Are completed history entries preserved after live plan or exercise edits/deletes? [Completeness, Spec FR-035/NFR-007]

## Exercise Icons and Taxonomy

- [ ] CHK016 - Is exercise presentation explicitly icon-only, using optional `iconReference`? [Clarity, Spec Clarifications]
- [ ] CHK017 - Is icon reference optional for both predefined and custom exercises? [Consistency, Spec Clarifications]
- [ ] CHK018 - Is the default exercise icon requirement explicit and consistently applied? [Completeness, Spec Clarifications]
- [ ] CHK019 - Is exactly one primary muscle group required? [Clarity, Spec Clarifications]
- [ ] CHK020 - Are zero or more secondary muscles defined as valid and from the supported taxonomy? [Clarity, Spec Clarifications]
- [ ] CHK021 - Is equipment selected from a fixed predefined list, with `Other` available for custom exercises? [Consistency, Spec Clarifications]
- [ ] CHK022 - Are Beginner, Intermediate, and Advanced the only accepted difficulty values? [Clarity, Spec Clarifications]

## Cross-Artifact Consistency

- [ ] CHK023 - Do spec, plan, data model, API contract, tasks, and checklists use the same rotation wrap rule? [Consistency]
- [ ] CHK024 - Do spec, plan, data model, API contract, tasks, and checklists use the same active-workout snapshot rule? [Consistency]
- [ ] CHK025 - Do history artifacts classify completed, incomplete, and discarded statuses consistently? [Consistency]
- [ ] CHK026 - Do all exercise artifacts use `iconReference` consistently and use the default-icon fallback? [Consistency]
- [ ] CHK027 - Do the muscle taxonomies use separate `Abs` and `Core` values consistently? [Consistency]
- [ ] CHK028 - Are no resolved decisions contradicted by the unresolved-decision sections or old support documents? [Consistency]

## Testability and Traceability

- [ ] CHK029 - Are tests planned for wrap-from-final-session behavior and exact-one advancement? [Traceability, Plan Traceability]
- [ ] CHK030 - Are tests planned for empty plans and deletion of the current session? [Traceability, Plan/Tasks]
- [ ] CHK031 - Are tests planned for active snapshot preservation after plan/session/exercise edits/deletes? [Traceability, Plan/Tasks]
- [ ] CHK032 - Are tests planned for completed, incomplete, and discarded history status rendering and aggregation exclusion? [Traceability, Plan/Tasks]
- [ ] CHK033 - Are tests planned for missing icons, unsupported icon references, secondary-muscle edge cases, and default-icon rendering? [Traceability, Tasks]
- [ ] CHK034 - Are every resolved clarification mapped to at least one acceptance criterion or test task? [Traceability]
