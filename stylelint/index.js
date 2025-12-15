import { writeFileSync } from "fs";
import { execOrFail } from "../helpers/index.js";

/**
 * @param {Object} options
 * @param {string} options.style - The style format (scss, css, less, sass)
 */
export async function addStylelint({ style = "scss" } = {}) {
  const isSassStyle = style === "scss" || style === "sass";

  if (isSassStyle) {
    await execOrFail({
      cmd: "npm i -D stylelint@16 stylelint-config-sass-guidelines@12",
      startMsg: "Installing Stylelint with SASS guidelines",
      errorMsg: "Could not install Stylelint",
      endMsg: "Stylelint installed",
    });

    writeFileSync(
      "./stylelint.config.js",
      `module.exports = {
  extends: ["stylelint-config-sass-guidelines"],
}`,
      "utf8",
    );
  } else {
    await execOrFail({
      cmd: "npm i -D stylelint@16 stylelint-config-standard@38",
      startMsg: "Installing Stylelint with standard config",
      errorMsg: "Could not install Stylelint",
      endMsg: "Stylelint installed",
    });

    writeFileSync(
      "./stylelint.config.js",
      `module.exports = {
  extends: ["stylelint-config-standard"],
}`,
      "utf8",
    );
  }
}
