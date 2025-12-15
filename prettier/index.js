import { writeFileSync } from "fs";
import { execOrFail } from "../helpers/index.js";

export async function addPrettier() {
  await execOrFail({
    cmd: "npm i -D prettier@3 eslint-config-prettier@10",
    startMsg: "Installing Prettier",
    errorMsg: "Could not install Prettier",
    endMsg: "Prettier installed",
  });

  // Create config file for IDEs to recognize Prettier with default config
  writeFileSync(
    "./prettier.config.js",
    `/** @type {import("prettier").Config} */
module.exports = {}`,
    "utf8",
  );
}
