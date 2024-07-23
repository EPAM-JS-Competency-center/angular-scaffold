import { execOrFail } from "../helpers/index.js";
import { renameSync, writeFileSync } from "fs";

export function addEslint() {
  execOrFail({
    cmd: "npx ng add @angular-eslint/schematics@18 --skip-confirmation",
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
  writeFileSync(
    "eslint.config.mjs",
    `import eslintConfigAngular from "@epam/eslint-config-angular";

export default [...eslintConfigAngular];`,
    "utf8",
  );
}
