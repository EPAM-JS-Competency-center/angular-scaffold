# Claude Instructions

## Project Overview

**scaffold-angular** is an NPX-based scaffolding tool for Angular projects. It works like `create-react-app` - users run
it once with `npx scaffold-angular <app-name>` to set up a new Angular project with standard tooling, then never
interact with this package again.

**Important:** This is a one-time scaffold tool, not a dependency. Users do not install or keep this package. After
scaffolding, developers maintain installed dependencies themselves.

## Quick Reference

```bash
npm test          # Run Jest tests
npm run release   # Bump version and update changelog (runs tests first)
```

## Project Structure

```
index.js              # Main CLI entry point (executable)
helpers/              # Utility functions (exec, logging, git, angular-cli version)
eslint/               # ESLint installation and config template
prettier/             # Prettier installation
stylelint/            # Stylelint installation
jest/                 # Jest (jest-preset-angular) installation and config templates
lefthook/             # Git hooks (Lefthook) installation and config template
```

## How It Works

When run via `npx scaffold-angular <app-name>`:

1. Validates app name parameter is provided
2. Ensures Angular CLI v21 is available (prompts to update if needed)
3. Creates new Angular app with SCSS styling and `--minimal` flag
4. Sequentially installs tooling, each as a separate git commit:

**Note on `--minimal` flag:** This flag is used solely to prevent Angular CLI from installing its default test
framework (Vitest as of Angular 21). We install Jest instead. If `--minimal` starts affecting other desired scaffolding
behavior, reconsider the approach (e.g., use explicit `--test-runner` flag or post-scaffold removal).

- ESLint (with `@epam/eslint-config-angular`)
- Prettier
- Stylelint (with sass-guidelines)
- SVGO
- Jest (with `jest-preset-angular`)
- Lefthook (git hooks for pre-commit, pre-push, commit-msg)

## Key Dependencies

- `chalk` - Colored console output
- `shelljs` - Cross-platform shell commands

## Testing

Tests use Jest with Babel for ESM support. Each module has a corresponding `.spec.js` file:

- `index.spec.js` - Main CLI flow
- `helpers/*.spec.js` - Utility function tests
- `eslint/index.spec.js`, `prettier/index.spec.js`, `jest/index.spec.js`, etc. - Module tests

## Code Conventions

- **Config templates:** Each tool module has a `config.js` that exports the configuration template as a string
- **Execution pattern:** Use `execOrFail()` helper for shell commands with consistent logging
- **Git commits:** Each tool installation creates a separate commit (e.g., "Add ESLint", "Add Prettier")
- **Logging:** Use `logStart()`, `logEnd()`, `logError()` from `helpers/log.js`
- **File writes:** Use `fs.writeFileSync` with UTF-8 encoding for config files

## What Gets Scaffolded

Generated projects include:

- `eslint.config.mjs` - Flat ESLint config with Angular rules
- `prettier.config.js` - Prettier config (empty, uses defaults)
- `stylelint.config.js` - Stylelint with sass-guidelines
- `jest.config.ts` - Jest config using `jest-preset-angular`
- `setup-jest.ts` - Jest setup file for Angular zone environment
- `tsconfig.spec.json` - TypeScript config for Jest tests
- `lefthook.yml` - Git hooks config (pre-commit: lint/format, pre-push: test, commit-msg: validate)
- `.gitignore` additions for cache files

## Version Constraints

- Node.js >= 18 required
- Angular CLI v21 (checked/prompted at runtime)
- All scaffolded tool versions are pinned in respective module files

## Commit Message Format

Follow Conventional Commits: `type(scope): description`

- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- Example: `feat: add jest support`
