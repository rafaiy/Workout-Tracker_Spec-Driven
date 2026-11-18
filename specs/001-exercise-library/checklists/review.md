# GymFlow Requirements Review Checklist

**Purpose**: Review requirement completeness, clarity, consistency, measurability, and traceability.
**Created**: 2026-11-19
**Feature**: [spec.md](../spec.md)

## Exercise Library

- [ ] CHK001 - Are exercise fields, grouping, search, filters, favorites, custom CRUD, and privacy requirements complete? [Completeness]
- [ ] CHK002 - Are fixed muscle, equipment, and difficulty taxonomies complete and unambiguous? [Clarity]
- [ ] CHK003 - Are primary/secondary muscle cardinality and disjointness requirements explicit? [Clarity]
- [ ] CHK004 - Is `iconReference` optional for predefined/custom exercises and a default icon required when absent? [Consistency]
- [ ] CHK005 - Is exercise presentation explicitly icon-only, with `iconReference` optional and default-icon fallback required? [Consistency]

## Plans and Rotation

- [ ] CHK006 - Are plan and ordered-session CRUD/reorder requirements complete? [Completeness]
- [ ] CHK007 - Is per-plan progress independent of weekdays and calendar dates? [Clarity]
- [ ] CHK008 - Does completion wrap from the final session to session 1? [Clarity]
- [ ] CHK009 - Are rest/missed/incomplete/resume/discard states explicitly excluded from advancement? [Consistency]
- [ ] CHK010 - Does a resumed completion advance exactly once and resist concurrent duplicate completion? [Measurability]
- [ ] CHK011 - Is no-session behavior and deleted-current-session fallback explicit? [Completeness]

## Active Workouts and Snapshots

- [ ] CHK012 - Does starting a workout create an immutable start-time session/exercise snapshot? [Completeness]
- [ ] CHK013 - Are incomplete/resumed/discarded states and their history visibility explicit? [Consistency]
- [ ] CHK014 - Do source plan/session/exercise edits/deletes preserve active workout snapshots? [Consistency]
- [ ] CHK015 - Are kg/lb storage, display, set/repetition, notes, duration, timer, and save-failure behaviors complete? [Measurability]

## History and Progress

- [ ] CHK016 - Do chronological/calendar/history-detail views include Completed, Incomplete, and Discarded statuses? [Completeness]
- [ ] CHK017 - Are incomplete/discarded entries excluded from completed totals, volume, and personal records? [Consistency]
- [ ] CHK018 - Are completed snapshots immutable after source plan/exercise edits/deletes? [Measurability]
- [ ] CHK019 - Are progress aggregation periods, volume units, PR rules, and no-data states sufficiently measurable? [Gap]

## UX, Security, and Accessibility

- [ ] CHK020 - Are authentication and ownership boundaries specified for every private domain? [Security]
- [ ] CHK021 - Are loading, empty, error, retry, success, incomplete, and discarded states complete? [Coverage]
- [ ] CHK022 - Are keyboard, focus, labels, live feedback, contrast, and 320-pixel/desktop behavior measurable? [Accessibility]
- [ ] CHK023 - Are save failures prevented from falsely indicating success and preserving drafts? [Recovery]
- [ ] CHK024 - Are API status codes and the shared error envelope consistent across exercise, plan, workout, history, and progress endpoints? [Consistency]

## Constitution and Traceability

- [ ] CHK025 - Do requirements preserve template/history separation? [Constitution §I]
- [ ] CHK026 - Does every rotation rule exclude fixed weekdays and calendar advancement? [Constitution §II]
- [ ] CHK027 - Are workout attempt states explicit and auditable? [Constitution §III]
- [ ] CHK028 - Are authentication, authorization, and secrets protected for every private operation? [Constitution §IV]
- [ ] CHK029 - Do tasks map critical requirements to unit, integration, contract, component, and end-to-end tests? [Constitution §V]
