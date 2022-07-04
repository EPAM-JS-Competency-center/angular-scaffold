import { readFileSync, writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";

export function addLintStaged() {
  logStart("Installing lint-staged");

  if (shelljs.exec("npm i -D lint-staged").code !== 0) {
    logError("Could not install lint-staged");
    return shelljs.exit(1);
  }

  const packageJsonPath = "./package.json";
  const packageJsonFile = readFileSync(packageJsonPath, "utf8");
  const packageObj = JSON.parse(packageJsonFile);

  // Each item in the object is executed in parallel,
  // to exclude race conditions of linters and Prettier
  // run linters and prettier on according files one by one
  packageObj["lint-staged"] = {
    "*.{js,ts,html}": ["eslint --fix --cache", "prettier --write"],
    "*.{scss}": ["stylelint --fix --cache", "prettier --write"],
    "!*.{ts,js,html,scss,svg}": "prettier --write --ignore-unknown",
    "*.svg": "svgo",
  };

  writeFileSync(packageJsonPath, JSON.stringify(packageObj, null, 2), "utf8");

  logEnd("lint-staged installed and ready to use");
}
