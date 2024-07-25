import { logEnd, logError, logStart } from "../helpers/index.js";
import shelljs from "shelljs";
import { writeFileSync } from "fs";
import { lefthookConfig } from "./config.js";

export function addLefthook() {
  logStart("Installing Lefthook");

  writeFileSync("lefthook.yml", lefthookConfig);

  if (shelljs.exec("npm install lefthook --save-dev").code !== 0) {
    logError("Failed to install Lefthook");
    return shelljs.exit(1);
  }

  logEnd("Lefthook installed");
}
