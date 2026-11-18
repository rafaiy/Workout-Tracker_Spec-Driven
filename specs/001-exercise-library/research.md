# Phase 0 Research: Exercise Library

## Decision: Web application architecture

**Chosen:** React/TypeScript frontend with Node.js/Express backend and PostgreSQL for production or SQLite for MVP.

**Rationale:** This matches the GymFlow constitution and provides strict ownership, query filtering, and relational integrity for exercises and favorites.

**Alternatives considered:**
- Client-only persistence — rejected because custom-exercise privacy and ownership require server authorization.
- GraphQL — rejected as unnecessary for CRUD and filtered browse operations; REST is simpler and constitution-aligned.

## Decision: Fixed taxonomies

**Chosen:** Fixed muscle-group taxonomy already specified in the feature. Equipment uses a curated MVP list, difficulty is exactly Beginner, Intermediate, or Advanced, and values outside lists are rejected.

**Rationale:** Controlled values produce consistent filters and prevent ambiguous custom-exercise metadata.

**Alternatives considered:** Free-text equipment/difficulty — rejected because it fragments filtering and validation.

## Decision: Exercise data model

**Chosen:** Separate Exercise, MuscleGroup membership, and UserFavorite entities. Exercises distinguish predefined versus user-owned records through ownership plus immutable predefined status.

**Rationale:** Predefined records can be seeded and remain read-only, while custom records remain private and editable by their owner.

**Alternatives considered:** Single exercise table with mutable source metadata — rejected because it could weaken predefined read-only guarantees.

## Decision: Search and filtering semantics

**Chosen:** Case-insensitive partial-name matching; OR within a filter category; AND across active categories. Search plus all active filters narrows the accessible exercise set.

**Rationale:** The clarified behavior is predictable and testable.

**Alternatives considered:** AND within categories — rejected based on the clarification answer.

## Decision: Suggested sets/reps

**Chosen:** Store suggestedSets and suggestedReps as separate positive integer values.

**Rationale:** The clarified representation is simple, validatable, and reusable by future plan features.

**Alternatives considered:** Free-text prescriptions or numeric ranges — rejected because they introduce ambiguous parsing and validation.

## Decision: Media requirement

**Chosen:** A predefined exercise requires a valid image/demo reference. A custom exercise may omit it and shows an unavailable-media state.

**Rationale:** Curated content must remain demonstrable while custom exercise creation stays low-friction.

**Alternatives considered:** Mandatory media for custom exercises — rejected based on the clarification answer.

## Decision: Pagination and testing

**Chosen:** Paginate browse/search results by default for the MVP and preserve filter state in the client. Add unit, integration, contract, and accessibility checks.

**Rationale:** Pagination limits result payload size while tests verify privacy, ownership, taxonomy, and historical separation boundaries.

**Alternatives considered:** Loading all 1,000 exercises — accepted as possible but less scalable for mobile performance.
