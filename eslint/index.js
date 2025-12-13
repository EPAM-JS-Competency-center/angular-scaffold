import { ANGULAR_CLI_MAJOR_VERSION, execOrFail } from "../helpers/index.js";
import { renameSync, writeFileSync } from "fs";
import { eslintConfig } from "./config.js";

export function addEslint() {
  execOrFail({
    cmd: `npx ng add @angular-eslint/schematics@${ANGULAR_CLI_MAJOR_VERSION} --skip-confirmation`,
    startMsg: "Adding @angular-eslint schematics",
    errorMsg: "Error during adding Angular ESLint",
    endMsg: "@angular-eslint schematics added",
  });
  execOrFail({
    cmd: "npm i -D @epam/eslint-config-angular",
    startMsg: "Adding @epam/eslint-config-angular",
    errorMsg: "Error during adding @epam/eslint-config-angular",
    endMsg: "@epam/eslint-config-angular added and configured",
  });
  renameSync("eslint.config.js", "eslint.config.mjs");
  writeFileSync("eslint.config.mjs", eslintConfig, "utf8");
}
