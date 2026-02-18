# Code quality guidelines

Refactoring principles, naming conventions, module organization, and testing requirements for this repository. For required checks and Definition of Done, see [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Refactoring Principles

When refactoring code in this repository, follow these principles to maintain code quality:

1. **Single Responsibility Principle (SRP)**
   - Each module has one clear reason to change
   - Pure logic is separated from I/O operations
   - Business rules are isolated from infrastructure

2. **Testing Strategy**
   - Use dependency injection (DI/DIP) for testability rather than vi.mock
   - GitHub Actions integration code should accept dependencies via parameters
   - All business logic should be extracted to separate modules for comprehensive testing
   - Tests should inject test doubles directly; production code uses actual modules
   - This separation maximizes maintainability and test coverage

3. **Dependency Direction**
   - Dependencies flow inward: infrastructure → orchestration → logic → types
   - No circular dependencies
   - Pure modules (validation) don't depend on I/O modules (github-api)

4. **Testability**
   - Pure functions are in separate modules for easy unit testing
   - API interactions are grouped for easy mocking
   - Orchestration logic accepts dependencies via parameters (DI/DIP pattern)
   - Runtime integration is tested by injecting test doubles directly
   - Avoid vi.mock; use explicit dependency injection instead

## Naming Conventions

The codebase follows these naming conventions:

1. **Constants**
   - `SCREAMING_SNAKE_CASE` for module-level constants and schemas
   - Examples: `OPTIONS_SCHEMA`, `DEFAULT_OPTIONS`, `COMMAND_REGEX`, `VALID_FLAGS`
   - Rationale: Makes constants immediately recognizable and distinguishable from variables

2. **Functions and Variables**
   - `camelCase` for functions, variables, and parameters
   - Examples: `parseOptions`, `buildConfig`, `optionsYaml`

3. **Types and Interfaces**
   - `PascalCase` for type names and interfaces
   - Examples: `ParsedOptions`, `ActionConfig`, `EventContext`

4. **Files and Modules**
   - `kebab-case` for file names
   - Examples: `options-parser.ts`, `github-api.ts`, `action.test.ts`

## Module Organization Guidelines

When adding new features or making changes, follow these guidelines:

1. **When to Create a New Module**
   - When a logical grouping exceeds ~300 lines
   - When a distinct new responsibility emerges (e.g., notification system, metrics)
   - When multiple files start duplicating similar code

2. **When NOT to Split Further**
   - Don't create modules with fewer than ~50 lines
   - Don't split functions that are tightly coupled (modify together frequently)
   - Don't create "utils" grab-bags without clear responsibility

3. **Testing Requirements**
   - All business logic MUST be testable and have tests
   - Runtime integration logic should be tested with dependency injection
   - Business logic should be tested comprehensively without mocks
   - Use direct dependency injection instead of vi.mock for better maintainability
   - Target 80%+ coverage for all modules

4. **Breaking Changes**
   - Update tests when splitting modules
   - Update README.md to reflect structural changes
   - Document architectural decisions in commit messages
