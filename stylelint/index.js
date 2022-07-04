import { writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";

export function addStylelint() {
  logStart("Installing stylelint");

  // Install stylelint and stylelint config to exclude rules controlled by Prettier
  // Install default SASS rules
  if (
    shelljs.exec(
      "npm i -D stylelint stylelint-config-prettier stylelint-config-sass-guidelines"
    ).code !== 0
  ) {
    logError("Could not install stylelint");
    return shelljs.exit(1);
  }

  const defaultConfig = {
    extends: ["stylelint-config-sass-guidelines", "stylelint-config-prettier"],
  };

  writeFileSync(
    "./.stylelintrc.json",
    JSON.stringify(defaultConfig, null, 2),
    "utf8"
  );

  logEnd("stylelint installed");
}
