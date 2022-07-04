# Scaffold Angular

The package is designed to make starting a new project a breeze.
It scaffolds a basic Angular app, installs and configures recommended tooling.
Strict rules are applied and can be changed later when the app was scaffolded to fulfill the needs of the team.

## Prerequisites

Node >= v16

NPM >= 8

## Using the package

```bash
npx scaffold-angular my-app
```

## Toolings provided by the package

Currently script only supports scaffolding new Angular project with all toolings listed below enabled and configured

1. ESLint - runs linting rules over ts/js/html files
   1. Template rules
   2. Jasmine rules
   3. RxJS rules
   4. Sonar rules
2. Stylelint - runs linting rules over scss files
3. Prettier - formats all files
4. SVGO - minifies svg images (if run twice in a row could produce two different code results which look identically)
5. Lint-staged - allows splitting commands by file ext
6. Husky - allows automated git hooks setup
