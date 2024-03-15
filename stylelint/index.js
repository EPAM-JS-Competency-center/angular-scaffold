import { writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";

export function addStylelint() {
  logStart("Installing stylelint");

  // Install stylelint and stylelint config to exclude rules controlled by Prettier
  // Install default SASS rules
  if (
    shelljs.exec("npm i -D stylelint@16 stylelint-config-sass-guidelines@11")
      .code !== 0
  ) {
    logError("Could not install stylelint");
    return shelljs.exit(1);
  }

  writeFileSync(
    "./stylelint.config.js",
    `module.exports = {
  extends: ["stylelint-config-sass-guidelines"],
}`,
    "utf8",
  );

  logEnd("stylelint installed");
}
