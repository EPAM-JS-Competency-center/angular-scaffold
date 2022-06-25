# Contributing to Scaffold Angular

## Commit message

For pull requests commit messages do not need to follow a special message format as it will be squashed and merged.

For PR merge commit message should follow [the conventional commits format](https://www.conventionalcommits.org/en/v1.0.0/).

Type must be one of the following:

- fix
- feat
- docs
- refactor

## Testing library

1. `npm link`
2. Go to a test folder where you want to link the package to (npm should be initialized there)
3. `npm link scaffold-angular`
4. `npx scaffold-angular test-app` - It will run create a new Angular app in `test-app` folder and add all toolings.
