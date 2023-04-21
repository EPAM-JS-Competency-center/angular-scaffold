#!/usr/bin/env node

import shelljs from "shelljs";
import { addJasmineRules } from "./eslint/jasmine.js";
import { addRxJSRules } from "./eslint/rxjs.js";
import { addSonarRules } from "./eslint/sonar.js";
import { addTemplateRules } from "./eslint/template.js";
import { commit, execOrFail, logEnd, logStart } from "./helpers/index.js";
import { addHusky } from "./husky/index.js";
import { addLintStaged } from "./lint-staged/index.js";
import { addPrettier } from "./prettier/index.js";
import { addStylelint } from "./stylelint/index.js";
import { execFileSync } from "child_process";

const appName = process.argv[2];

logStart("Scaffolding Angular application...");
execFileSync("npx", ["@angular/cli", "new", appName, "--style", "scss"], {
  stdio: "inherit"
});
logEnd("Angular application scaffolded");

shelljs.cd(appName);

// Add ESLint
execOrFail({
  cmd: "npx ng add @angular-eslint/schematics --skip-confirmation",
  startMsg: "Adding @angular-eslint schematics",
  errorMsg: "Error during adding Angular ESLint",
  endMsg: "@angular-eslint schematics added"
});
commit("Add ESLint");

// Add ESLint rules
addTemplateRules();
addJasmineRules();
addRxJSRules();
addSonarRules();
commit("Add ESLint rules");

addPrettier();
commit("Add Prettier");

addStylelint();
commit("Add Stylelint");

// Add svgo
execOrFail({
  cmd: "npm i -D svgo",
  startMsg: "Installing svgo",
  errorMsg: "Error during svgo installation",
  endMsg: "svgo installed"
});
commit("Add SVGo");

addLintStaged();
commit("Add Lint staged");

addHusky();
commit("Add Husky");

logEnd("Ready to work!");
