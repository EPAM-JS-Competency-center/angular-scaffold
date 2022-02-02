#!/usr/bin/env node

import shelljs from "shelljs";
import { execOrFail, logEnd } from "./helpers/index.js";

const appName = process.argv[2];

// Scaffold Angular app
execOrFail({
  cmd: "npx ng new " + appName,
  startMsg: "Scaffolding Angular application...",
  errorMsg: "Error during Angular scaffolding",
  endMsg: "Angular application scaffolded",
});

shelljs.cd(appName);

// Add ESLint
execOrFail({
  cmd: "npx ng add @angular-eslint/schematics --skip-confirmation",
  startMsg: "Adding @angular-eslint schematics",
  errorMsg: "Error during adding Angular ESLint",
  endMsg: "@angular-eslint schematics added",
});

logEnd("Ready to work!");
