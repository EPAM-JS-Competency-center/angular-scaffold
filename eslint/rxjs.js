import { readFileSync, writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";
import { eslintRxJSRules } from "./rules.js";

export function addRxJSRules() {
  logStart("Installing ESLint plugin for RxJS");

  if (shelljs.exec("npm i eslint-plugin-rxjs -D").code !== 0) {
    logError("Error during installation of ESLint plugin");
    return shelljs.exit(1);
  }

  logEnd("ESLint plugin for RxJS installed");
  logStart("Updating ESLint rules for RxJS");

  const eslintrcPath = "./.eslintrc.json";
  const eslintrcFile = readFileSync(eslintrcPath, "utf8");
  const eslintrc = JSON.parse(eslintrcFile);

  const tsOverride = eslintrc.overrides.find((obj) =>
    obj.files.includes("*.ts")
  );

  eslintrc.parserOptions = {
    project: "tsconfig.json"
  };

  if (!tsOverride) {
    throw new Error("Could not find TS override");
  }

  tsOverride.extends.push("plugin:rxjs/recommended");
  tsOverride.rules = {
    ...tsOverride.rules,
    ...eslintRxJSRules
  };

  writeFileSync(eslintrcPath, JSON.stringify(eslintrc, undefined, 2));

  logEnd("ESLint rules for RxJS updated");
}
