#!/usr/bin/env node

import shelljs from "shelljs";
import {
  commit,
  execOrFail,
  gitignore,
  logEnd,
  logStart,
} from "./helpers/index.js";
import { addHusky } from "./husky/index.js";
import { addLintStaged } from "./lint-staged/index.js";
import { addPrettier } from "./prettier/index.js";
import { addStylelint } from "./stylelint/index.js";
import { execFileSync } from "child_process";
import { addEslint } from "./eslint/index.js";

const appName = process.argv[2];

logStart("Scaffolding Angular application...");
execFileSync("npx", ["@angular/cli@18", "new", appName, "--style", "scss"], {
  stdio: "inherit",
});
logEnd("Angular application scaffolded");

shelljs.cd(appName);

addEslint();
commit("Add ESLint");

gitignore(`# lint caches
.eslintcache`);
commit("Add .eslintcache to .gitignore");

addPrettier();
commit("Add Prettier");

addStylelint();
commit("Add Stylelint");

gitignore(`.stylelintcache`);
commit("Add .stylelintcache to .gitignore");

// Add svgo
execOrFail({
  cmd: "npm i -D svgo@3",
  startMsg: "Installing svgo",
  errorMsg: "Error during svgo installation",
  endMsg: "svgo installed",
});
commit("Add SVGo");

addLintStaged();
commit("Add Lint staged");

addHusky();
commit("Add Husky");

logEnd("Ready to work!");
