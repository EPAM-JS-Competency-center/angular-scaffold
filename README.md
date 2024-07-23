# Scaffold Angular

The package will save you time when starting a new project on Angular. It sets up a working environment with all the
tools every project needs such as: ESLint, Stylelint, Git hooks, Prettier.
These ensure smooth development by providing guard rails for code style. Save hours of arguing during pull request
reviews, spending hours teaching the code standards to the new team members. Automated tooling will take care of it for
you.

Strict rules are applied and can be changed later when the app was scaffolded to fulfill the needs of the team.

## Prerequisites

Node >= v18

## Using the package

```bash
npx scaffold-angular my-app
```

## Tooling provided by the package

Currently, script only supports scaffolding new Angular project with all toolings listed below enabled and configured

1. ESLint - runs linting rules over ts/html
   files ([@epam/eslint-config-angular](https://www.npmjs.com/package/@epam/eslint-config-angular))
2. Stylelint - runs linting rules over scss files
3. Prettier - formats all files
4. SVGO - minifies svg images (if run twice in a row could produce two different code results which look identically)
5. Lint-staged - allows splitting commands by file ext
6. Husky - allows automated git hooks setup
