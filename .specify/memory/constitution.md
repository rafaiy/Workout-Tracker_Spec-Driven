<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles: Initial constitution creation for GymFlow
- Added sections: Core Principles, Platform & Architecture Constraints, Development Workflow & Quality Gates, Governance
- Removed sections: none
- Follow-up TODOs: none
-->

# GymFlow Constitution

## Core Principles

### I. Data Integrity and Historical Immutability
GymFlow MUST preserve the distinction between workout templates and actual workout history. Workout plans, session templates, and exercise definitions are editable configuration; logs, set records, and completed session outcomes are immutable historical facts. Editing or deleting a plan, exercise, or template MUST NEVER mutate prior logs, completed sets, or performance history. All data relationships MUST remain consistent with the domain model: User → WorkoutPlan → SessionTemplate → TemplateExercise and User → WorkoutLog → ExerciseLog → SetLog. The system MUST reject any operation that would corrupt historical truth or create ambiguous state transitions.

### II. Completion-Based Rotation Reliability
The Smart Workout Rotation engine MUST determine the next workout ONLY from the last COMPLETED workout in the active plan. Rest days, missed gym days, incomplete sessions, and discarded sessions MUST NOT advance or reset the rotation. Rotation state MUST be scoped per workout plan, and each plan MUST maintain independent progress. Workouts MUST be sequenced by completion, not by fixed weekdays or calendar dates. The system MUST treat a workout as completed only when the plan records a valid completion state, and it MUST never infer advancement from incomplete or cancelled attempts.

### III. Explicit Session States and Recovery Safety
Every workout attempt MUST be tracked with clear lifecycle states: not_started, in_progress, completed, and discarded. Resume, restart, and discard actions MUST be explicit and auditable; the application MUST never silently convert an incomplete session into a completed one. Users MUST be able to restart a plan from the correct point without altering historical records, and all state transitions MUST be represented through immutable log events rather than destructive edits.

### IV. Security, Authentication, and Secrets Protection
GymFlow MUST implement secure authentication with hashed passwords and a verified session or JWT mechanism. All API surfaces MUST validate identity and authorization before accessing user-specific data. Secrets, API keys, and credentials MUST NEVER be stored in source code; configuration MUST come from environment variables or a secure secret manager. The backend MUST treat every user request as untrusted until validated and authorized.

### V. Quality Gates, Testing, and Data-Integrity Validation
No feature is considered complete unless it includes validation, error handling, loading states, and empty states. Critical logic MUST be covered by tests, including rotation engine behavior, set logging accuracy, and PR calculation. The rotation engine MUST have unit tests covering completing a session, restarting, discarding, and multi-plan independence, with branch coverage at 100% on rotation logic. Every new domain feature MUST include at least one integration test proving template/history separation and data integrity. The codebase MUST prefer simple, maintainable solutions over unnecessary abstraction or premature optimization.

## Platform & Architecture Constraints

GymFlow MUST use React with TypeScript for the frontend and Node.js with Express for the backend. The application MUST use PostgreSQL for production-grade persistence, with SQLite allowed only for the MVP. The relational schema MUST enforce integrity between plans, session templates, logs, exercises, and exercise/set records. The backend MUST expose RESTful APIs with appropriate HTTP methods and status codes: 400 for validation failures, 401 for unauthenticated requests, 403 for forbidden access, 404 for missing resources, and 500 for unexpected server errors. API responses MUST use a consistent error payload shape.

The frontend MUST follow a modular architecture with separate domains for exercises, workout plans, rotation engine, workout logs, and analytics. The application MUST use reusable React components, a single source of truth for state, and a clean folder structure that includes features/, components/, services/, and hooks/. The UI MUST be mobile-first, responsive, and aesthetically modern, with dark and light themes persisted as user preferences. Accessibility MUST be built in: semantic HTML, keyboard navigation, ARIA labels, and sufficient color contrast are non-negotiable.

Workout data MUST be validated on both the client and server. Set counts, reps, weight values, and unit preferences MUST be accepted only when valid. The system MUST support user-specific weight units (kg/lbs), with consistent storage and conversion rules so historical logs remain interpretable and correct. The product MUST prioritize fast interactions during active workouts through quick set logging, minimal taps, and a concise rest timer experience.

## Development Workflow & Quality Gates

The MVP scope MUST be prioritized in this order: exercise library, workout plan builder, sequential rotation engine, daily workout logging, previous workout comparison, and workout history. Progress dashboard features, analytics, charts, and deeper reporting come only after the MVP is stable. The sequential rotation engine is the highest-priority core domain and MUST be built and validated before adding adjacent features.

All new work MUST satisfy the definition of done: code is tested, documented, follows the required folder structure, and passes constitution checks for rotation correctness and data integrity. The project MUST include automated validation for critical logic and integration scenarios. Feature work MUST not be considered done without input validation, error handling, loading states, and empty-state handling. Development MUST remain grounded in simple, maintainable design and explicit contracts rather than broad abstraction.

## Governance

This Constitution governs all design, implementation, and review decisions for GymFlow. It supersedes ad hoc preferences and local conventions when there is a conflict with the required domain rules. Any amendment requires a documented change, a clear rationale, a version bump, and agreement from the project maintainers before adoption.

Versioning MUST follow semantic versioning: MAJOR for backward-incompatible governance or principle changes, MINOR for new sections or materially expanded guidance, and PATCH for clarifying or non-semantic refinements. The ratification date records the original approval of this constitution; the last amended date records the most recent revision. All pull requests and reviews MUST verify compliance with this Constitution, especially for rotation correctness, data integrity, auth/security, and test coverage expectations.

The project MUST treat historical accuracy as a product requirement, not a convenience. The maintainers MUST refuse changes that weaken the separation between templates and logs, alter rotation semantics without explicit governance approval, or skip required validation around user data and system state transitions. Compliance is measured by working tests, clear domain contracts, and the absence of destructive data mutations in the workout history model.

**Version**: 1.0.0 | **Ratified**: 2026-11-17 | **Last Amended**: 2026-11-17
