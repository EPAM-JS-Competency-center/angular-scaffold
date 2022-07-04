#!/usr/bin/env node

import shelljs from "shelljs";
import { addJasmineRules } from "./eslint/jasmine.js";
import { addRxJSRules } from "./eslint/rxjs.js";
import { addSonarRules } from "./eslint/sonar.js";
import { addTemplateRules } from "./eslint/template.js";
import { execOrFail, logEnd } from "./helpers/index.js";
import { addHusky } from "./husky/index.js";
import { addLintStaged } from "./lint-staged/index.js";
import { addPrettier } from "./prettier/index.js";
import { addStylelint } from "./stylelint/index.js";

const appName = process.argv[2];

// Scaffold Angular app
execOrFail({
  cmd: `npx @angular/cli new ${appName} --style scss --routing true`,
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

// Add ESLint rules
addTemplateRules();
addJasmineRules();
addRxJSRules();
addSonarRules();

addPrettier();
addStylelint();

// Add svgo
execOrFail({
  cmd: "npm i -D svgo",
  startMsg: "Installing svgo",
  errorMsg: "Error during svgo installation",
  endMsg: "svgo installed",
});

addLintStaged();
addHusky();

logEnd("Ready to work!");
