import { writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";

export function addPrettier() {
  logStart("Installing prettier");

  // Install Prettier and ESLint config to exclude rules controlled by Prettier
  if (shelljs.exec("npm i -D prettier eslint-config-prettier").code !== 0) {
    logError("Could not install prettier");
    return shelljs.exit(1);
  }

  // Create config file for IDEs to recognize Prettier with default config
  writeFileSync("./.prettierrc.json", "{}", "utf8");

  logEnd("prettier installed");
}
