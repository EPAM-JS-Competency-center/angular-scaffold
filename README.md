# Angular Scaffold

The package is designed to install Angular, recommended tooling for it and some additional configurations.

## Using the package

`npx angular-scaffold my-app`

## Toolings provided by the package

Currently script only supports scaffolding new Angular project with all toolings listed below enabled and configured

1. ESLint

## Testing the package

1. `npm link`
2. Go to a test folder where you want to link the package to (npm should be initialized there)
3. `npm link angular-scaffold`
4. `npx angular-scaffold test-app` - It will run create a new Angular app in `test-app` folder and add all toolings.
