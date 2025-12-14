#!/usr/bin/env node

import { program } from "commander";
import shelljs from "shelljs";
import {
  ANGULAR_CLI_MAJOR_VERSION,
  commit,
  ensureAngularCliVersion,
  execOrFail,
  gitignore,
  logWarn,
  startSpinner,
  succeedSpinner,
} from "./helpers/index.js";
import { addPrettier } from "./prettier/index.js";
import { addStylelint } from "./stylelint/index.js";
import { execFileSync } from "child_process";
import { addEslint } from "./eslint/index.js";
import { addLefthook } from "./lefthook/index.js";
import { addJest } from "./jest/index.js";
import { addStorybook } from "./storybook/index.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

const VALID_STYLES = ["scss", "css", "less", "sass"];

program
  .name("scaffold-angular")
  .description(
    "Scaffold a new Angular application with ESLint, Prettier, Stylelint, Jest, Storybook, and Lefthook pre-configured",
  )
  .version(packageJson.version)
  .argument("<app-name>", "Name of the Angular application to create")
  .option(
    "-s, --style <style>",
    `Style preprocessor to use (${VALID_STYLES.join(", ")})`,
    "scss",
  )
  .action(async (appName, options) => {
    const style = options.style.toLowerCase();

    if (!VALID_STYLES.includes(style)) {
      console.error(
        `Error: Invalid style "${style}". Valid options are: ${VALID_STYLES.join(", ")}`,
      );
      process.exit(1);
    }

    await ensureAngularCliVersion();

    startSpinner("Scaffolding Angular application...");
    execFileSync(
      "npx",
      [
        `@angular/cli@${ANGULAR_CLI_MAJOR_VERSION}`,
        "new",
        appName,
        "--style",
        style,
        "--minimal",
      ],
      { stdio: "inherit" },
    );
    succeedSpinner("Angular application scaffolded");

    shelljs.cd(appName);

    addEslint();
    commit("Add ESLint");

    gitignore(`# lint caches
.eslintcache`);
    commit("Add .eslintcache to .gitignore");

    addPrettier();
    commit("Add Prettier");

    addStylelint({ style });
    commit("Add Stylelint");

    gitignore(`.stylelintcache`);
    commit("Add .stylelintcache to .gitignore");

    execOrFail({
      cmd: "npm i -D svgo@4",
      startMsg: "Installing SVGO",
      errorMsg: "Error during SVGO installation",
      endMsg: "SVGO installed",
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

    logWarn(
      "Note: src/stories/ is excluded from ESLint. Update or move stories as needed.",
    );
    console.log("\n✨ Ready to work!\n");
  });

program.parse();
