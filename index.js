#!/usr/bin/env node

import shelljs from "shelljs";
import { addJasmineRules } from "./eslint/jasmine.js";
import { addTemplateRules } from "./eslint/template.js";
import { execOrFail, logEnd } from "./helpers/index.js";

const appName = process.argv[2];

// Scaffold Angular app
execOrFail({
  cmd: "npx @angular/cli new " + appName,
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

// Add ESLint template rules
addTemplateRules();

// Add ESLint Jasmine rules
addJasmineRules();

logEnd("Ready to work!");
