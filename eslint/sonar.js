import { logEnd, logError, logStart } from "../helpers/index.js";
import shelljs from "shelljs";
import { readFileSync, writeFileSync } from "fs";

export function addSonarRules() {
  logStart("Installing ESLint plugin for sonar");

  if (shelljs.exec("npm i eslint-plugin-sonarjs@0 -D").code !== 0) {
    logError("Error during installation of ESLint plugin");
    return shelljs.exit(1);
  }

  logEnd("ESLint plugin for sonar installed");
  logStart("Updating ESLint rules for sonar");

  const eslintrcPath = "./.eslintrc.json";
  const eslintrcFile = readFileSync(eslintrcPath, "utf8");
  const eslintrc = JSON.parse(eslintrcFile);

  const tsOverride = eslintrc.overrides.find((obj) =>
    obj.files.includes("*.ts"),
  );

  if (!tsOverride) {
    throw new Error("Could not find TS override");
  }

  tsOverride.extends.push("plugin:sonarjs/recommended");

  if (tsOverride.plugins) {
    tsOverride.plugins.push("sonarjs");
  } else {
    tsOverride.plugins = ["sonarjs"];
  }

  writeFileSync(eslintrcPath, JSON.stringify(eslintrc, undefined, 2));

  logEnd("ESLint rules for sonar updated");
}
