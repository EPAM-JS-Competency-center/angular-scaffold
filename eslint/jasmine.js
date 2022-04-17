import { readFileSync, writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";
import { eslintJasmineRules } from "./rules.js";

export function addJasmineRules() {
  logStart("Installing ESLint plugin for unit tests");

  if (shelljs.exec("npm i eslint-plugin-jasmine -D").code !== 0) {
    logError("Error during installation of ESLint plugin");
    return shelljs.exit(1);
  }

  logEnd("ESLint plugin for unit tests installed");
  logStart("Updating ESLint rules for unit tests");

  const eslintrcPath = "./.eslintrc.json";
  const eslintrcFile = readFileSync(eslintrcPath, "utf8");
  const eslintrc = JSON.parse(eslintrcFile);

  const tsSpecOverride = {
    files: ["*.spec.ts"],
    plugins: ["jasmine"],
    env: {
      jasmine: true,
    },
    extends: "plugin:jasmine/recommended",
    rules: eslintJasmineRules,
  };

  eslintrc.overrides.push(tsSpecOverride);

  writeFileSync(eslintrcPath, JSON.stringify(eslintrc, undefined, 2));

  logEnd("ESLint rules for unit tests updated");
}
