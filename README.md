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

## Toolings provided by the package

Currently script only supports scaffolding new Angular project with all toolings listed below enabled and configured

1. ESLint - runs linting rules over ts/js/html files
1. Template rules
1. Jasmine rules
1. RxJS rules
1. Sonar rules
1. Stylelint - runs linting rules over scss files
1. Prettier - formats all files
1. SVGO - minifies svg images (if run twice in a row could produce two different code results which look identically)
1. Lint-staged - allows splitting commands by file ext
1. Husky - allows automated git hooks setup
