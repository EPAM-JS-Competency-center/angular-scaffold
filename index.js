#!/usr/bin/env node

import shelljs from "shelljs";
import {
  ANGULAR_CLI_MAJOR_VERSION,
  commit,
  ensureAngularCliVersion,
  execOrFail,
  gitignore,
  logEnd,
  logError,
  logStart,
} from "./helpers/index.js";
import { addPrettier } from "./prettier/index.js";
import { addStylelint } from "./stylelint/index.js";
import { execFileSync } from "child_process";
import { addEslint } from "./eslint/index.js";
import { addLefthook } from "./lefthook/index.js";
import { addJest } from "./jest/index.js";
import { addStorybook } from "./storybook/index.js";

(async () => {
  const appName = process.argv[2];

  if (!appName) {
    logError("Please provide an application name");
    logError("Usage: npx scaffold-angular <app-name>");
    process.exit(1);
  }

  await ensureAngularCliVersion();

  logStart("Scaffolding Angular application...");
  execFileSync(
    "npx",
    [
      `@angular/cli@${ANGULAR_CLI_MAJOR_VERSION}`,
      "new",
      appName,
      "--style",
      "scss",
      "--minimal",
    ],
    { stdio: "inherit" },
  );
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
    cmd: "npm i -D svgo@4",
    startMsg: "Installing svgo",
    errorMsg: "Error during svgo installation",
    endMsg: "svgo installed",
  });
  commit("Add SVGo");

  addJest();
  commit("Add Jest");

  addStorybook();
  commit("Add Storybook");

  addLefthook();
  commit("Add Lefthook");

  execOrFail({
    cmd: "npx prettier --write .",
    startMsg: "Formatting files with Prettier",
    errorMsg: "Error during Prettier formatting",
    endMsg: "Files formatted",
  });
  commit("Format files with Prettier");

  logEnd("Ready to work!");
})();
