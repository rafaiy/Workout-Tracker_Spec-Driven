# GymFlow MVP Requirements Review Checklist

**Purpose**: Review requirement completeness, clarity, consistency, measurability, and traceability for implementation.
**Created**: 2026-11-19
**Feature**: [spec.md](../spec.md)

**Marker semantics**: `[x]` means the requirement-quality criterion has been reviewed and satisfied. It does not mean implementation is complete.

## Exercise Library

- [ ] CHK001 - Are predefined exercise grouping, fields, details, and read-only behavior explicitly complete? [Completeness, Spec §FR-001–FR-003/FR-011]
- [ ] CHK002 - Are fixed muscle taxonomy values complete and consistently named? [Clarity, Spec §FR-002]
- [ ] CHK003 - Are equipment, difficulty, and secondary-muscle taxonomies sufficiently defined for validation? [Gap, Spec §FR-003]
- [ ] CHK004 - Are partial, case-insensitive search and filter semantics unambiguous? [Clarity, Spec §FR-004–FR-006]
- [ ] CHK005 - Are favorite privacy and add/remove outcomes consistent for predefined and custom exercises? [Consistency, Spec §FR-007–FR-010]
- [ ] CHK006 - Are custom-exercise required, optional, validation, ownership, edit, and delete states complete? [Completeness, Spec §FR-009–FR-011]
- [ ] CHK007 - Is unavailable icon/default-icon behavior defined clearly? [Edge Case, Spec §FR-045]

## Workout Plans

- [ ] CHK008 - Are plan CRUD, session ordering, exercise ordering, set/repetition customization, and multiple-plan support explicit? [Completeness, Spec §FR-012–FR-015]
- [ ] CHK009 - Are plan/session/template deletion outcomes for active workouts and future workouts sufficiently defined? [Gap, Spec §FR-017]
- [ ] CHK010 - Is the relationship between templates and history clearly separated? [Consistency, Spec §FR-016–FR-017]

## Sequential Rotation

- [ ] CHK011 - Is completion the only event that advances a plan, independent of weekdays and elapsed time? [Clarity, Spec §FR-018–FR-025]
- [ ] CHK012 - Are rest-day and missed-day behavior defined without any implicit calendar scheduling? [Coverage, Spec §FR-021]
- [ ] CHK013 - Are incomplete, resumed, discarded, and completed resumed-workout outcomes explicitly distinct? [Clarity, Spec §FR-022–FR-023]
- [ ] CHK014 - Are independent progress boundaries between multiple plans explicit? [Consistency, Spec §FR-024–FR-025]
- [x] CHK015 - Are terminal-session/cycle behavior and next-session derivation sufficiently specified? [Gap, Plan §Rotation Engine]
- [ ] CHK016 - Are concurrent completion, repeated completion, and idempotency outcomes objectively testable? [Measurability, NFR-010/SC-003]

## Active Workout Tracking

- [ ] CHK017 - Are start, resume, add/remove exercise, set, weight, reps, notes, timer, duration, and completion states complete? [Completeness, Spec §FR-026–FR-032]
- [ ] CHK018 - Are kg/lb storage, display, conversion, and invalid-unit rules explicit? [Clarity, Spec §FR-029/NFR-006]
- [ ] CHK019 - Are save-incomplete, resume, discard, and finish recovery behaviors consistently specified? [Consistency, Spec §FR-030/FR-041]
- [ ] CHK020 - Is prior-performance scope limited to completed history and defined when unavailable? [Clarity, Spec §FR-032]
- [ ] CHK021 - Are invalid weights, repetitions, set counts, units, and draft-save failures mapped to feedback requirements? [Coverage, Spec §Edge Cases/FR-040]
- [ ] CHK022 - Does the rest timer explicitly avoid implying workout completion or save success? [Clarity, Spec §User Story 4]

## History and Progress

- [ ] CHK023 - Are chronological, calendar, and workout-detail history fields complete? [Completeness, Spec §FR-033–FR-035]
- [ ] CHK024 - Is historical snapshot immutability clear for plan and exercise edits or deletion? [Consistency, Spec §FR-017/FR-035/NFR-007]
- [ ] CHK025 - Are workout totals, sets, repetitions, volume, PR, muscle frequency, and activity calculations consistently sourced from completed records? [Clarity, Spec §FR-037–FR-038]
- [ ] CHK026 - Are zero-data and deleted-exercise progress states specified? [Gap, Spec §Edge Cases]

## UX, Security, and Accessibility

- [ ] CHK027 - Are all seven required screens and navigation relationships identified? [Completeness, Spec §FR-036]
- [ ] CHK028 - Are loading, empty, error, retry, success, incomplete, and discarded states required across applicable workflows? [Completeness, Spec §FR-041]
- [ ] CHK029 - Are authentication and ownership boundaries specified for every private domain operation? [Security, Spec §FR-046]
- [ ] CHK030 - Are cross-user data disclosure responses defined without exposing custom-exercise existence? [Privacy, Plan §Exercise API]
- [ ] CHK031 - Are theme and unit preference persistence and fallback behavior explicit? [Clarity, Spec §FR-042/FR-029]
- [ ] CHK032 - Are keyboard, focus, labels, live feedback, and contrast requirements measurable across all primary flows? [Accessibility, Spec §FR-043/NFR-003]
- [ ] CHK033 - Are 320-pixel and desktop layouts checked for overflow and blocked controls? [Measurability, Spec §SC-008/NFR-001]
- [ ] CHK034 - Are draft preservation and false-success prevention explicitly testable for save failures? [Recovery, Spec §SC-009/NFR-004]

## Data Integrity and Security

- [ ] CHK035 - Are immutable snapshots complete enough to recreate history after plan/exercise deletion? [Completeness, Spec §FR-034–FR-035]
- [ ] CHK036 - Are concurrency controls required to prevent duplicate completion and duplicate completed history? [Consistency, NFR-010]
- [ ] CHK037 - Are validation rules consistent across exercise, plan, active-workout, set, and progress APIs? [Consistency, Spec §NFR-006]
- [ ] CHK038 - Are secrets, credentials, CSRF/session, CORS, and rate-limiting requirements documented or left with a named planning decision? [Security, Spec §FR-039/NFR-008]
- [ ] CHK039 - Are external exercise source failures isolated from local/custom exercise access? [Reliability, Spec §NFR-009]

## Acceptance and Traceability

- [ ] CHK040 - Can SC-001–SC-004 be objectively tested with a defined three-session and multi-plan fixture? [Measurability, Spec §SC-001–SC-004]
- [ ] CHK041 - Can SC-005–SC-006 be validated with reproducible end-to-end plan and logging tests? [Measurability, Spec §SC-005–SC-006]
- [ ] CHK042 - Can SC-007–SC-010 be measured without subjective implementation-dependent test outcomes? [Measurability, Spec §SC-007–SC-010]
- [ ] CHK043 - Does every functional and non-functional requirement map to at least one component/API/test artifact? [Traceability, Plan §Traceability]
- [x] CHK044 - Are unresolved authentication/provider decisions identified and owned, with terminal-rotation and plan-snapshot decisions resolved? [Dependencies, Plan §Unresolved Decisions]

## Constitution Alignment

- [ ] CHK045 - Do requirements preserve separation of editable templates/configuration and immutable workout history? [Constitution §I]
- [ ] CHK046 - Does every acceptance rule exclude fixed weekdays and weekday-derived advancement? [Constitution §II]
- [ ] CHK047 - Are incomplete, resumed, completed, and discarded workout states explicit and auditable? [Constitution §III]
- [ ] CHK048 - Do authentication, authorization, and secret requirements cover every private domain? [Constitution §IV]
- [ ] CHK049 - Do requirements include validation, error/loading/empty states, critical tests, and data-integrity gates? [Constitution §V]
