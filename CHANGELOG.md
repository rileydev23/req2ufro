# CHANGELOG

## [1.6.0] - 3 weeks ago

### Added

- **e44afcc** Add `GOOGLE_APPLICATION_CREDENTIALS_STRING` to environment config and update Google authentication logic.
- **4fdc589** Add user event retrieval functionality and improve token regeneration.
- **6369522** Implement event grading functionality and notification system.
- **78e38ac** Add notification token to user schema and implement notification functionality.

### Documentation

- **a054f2b** Add Swagger documentation for authentication routes and update dependencies.

---

## [1.5.0] - 8 weeks ago

### Added

- **8847add** Implement authentication routes and JWT token handling.
- **8d429e4** Add smoke tests for all modules.
- **3cf0c3f** Add regression tests for all modules.

### Fixed

- **9cdfaca** Fix subject controller and unit tests to handle semester assignment on creation and deletion.
- **fe1f45c** Fix user controller and its tests.

### Refactored

- **be06aea** Update Vercel configuration to use `app.js` for builds and routing.
- **d1e4ef1** Add Vercel configuration for rewrites to `src` directory.

---

## [1.2.0] - 10 weeks ago

### Added

- **44312fa** Add all methods for subject controller, adhering to TDD and passing unit tests.
- **1df71e2** Add subject tests implemented with TDD.
- **edc7bb4** Add subject controller with two pending tests.

### Fixed

- **d19218b** Fix broken controllers and tests.
- **5b7a40c** Remove grades from subject and adjust affected logic in tests.

### Refactored

- **c3b0e8b** Remove `populate` references from controllers for simpler unit testing.

---

## [1.0.0] - 3 months ago

### Added

- **79de359** Initialize TDD setup, create unit tests for three controllers, and initialize controllers with basic functionality.
- **cb5ac3c** Add smoke tests and update database connection format.
- **fc24a6a** Backend implemented in JS with Jest for testing.

### Refactored

- **216383d** Refactor configuration files, update dev script, and fix message typo.
- **95b5779** Refactor configuration files and tests, and update dev script in `package.json`.
- **98f5999** Initial commit.

---
