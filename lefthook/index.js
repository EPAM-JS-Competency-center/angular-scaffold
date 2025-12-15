import { execOrFail } from "../helpers/index.js";
import { writeFileSync } from "fs";
import { lefthookConfig } from "./config.js";

export async function addLefthook() {
  writeFileSync("lefthook.yml", lefthookConfig);

  await execOrFail({
    cmd: "npm install lefthook --save-dev",
    startMsg: "Installing Lefthook",
    errorMsg: "Failed to install Lefthook",
    endMsg: "Lefthook installed",
  });
}
