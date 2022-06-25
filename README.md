# Scaffold Angular

The package is designed to install Angular, recommended tooling for it and some additional configurations.

## Prerequisites

Node >= v16

NPM >= 8

## Using the package

`npx scaffold-angular my-app`

## Toolings provided by the package

Currently script only supports scaffolding new Angular project with all toolings listed below enabled and configured

1. ESLint

## Testing the package

1. `npm link`
2. Go to a test folder where you want to link the package to (npm should be initialized there)
3. `npm link scaffold-angular`
4. `npx scaffold-angular test-app` - It will run create a new Angular app in `test-app` folder and add all toolings.
