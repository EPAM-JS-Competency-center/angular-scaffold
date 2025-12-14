# Scaffold Angular

The package will save you time when starting a new project on Angular. It sets up a working environment with all the
tools every project needs such as ESLint, Stylelint, Git hooks, Prettier.

These ensure smooth development by providing guard rails for code style. Save hours of arguing during pull request
reviews, spending hours teaching the code standards to the new team members. Automated tooling will take care of it for
you.

Strict rules are applied and can be changed later when the app was scaffolded to fulfill the needs of the team.

## Prerequisites

Node.js ^20.19.0 || ^22.12.0 || ^24.0.0 (aligned with Angular 21 requirements)

## Using the package

```bash
npx scaffold-angular my-app
```

## Tooling provided by the package

Currently, the script only supports scaffolding new Angular projects with all tooling listed below enabled and
configured

1. ESLint – runs linting rules over ts/html
   files ([@epam/eslint-config-angular](https://www.npmjs.com/package/@epam/eslint-config-angular))
2. Stylelint – runs linting rules over scss files
3. Prettier - formats all files
4. SVGO - minifies svg images (if run twice in a row could produce two different code results which look identically)
5. Jest - testing framework with jest-preset-angular
6. Storybook - component documentation and development
7. Lefthook - git hooks management tool
