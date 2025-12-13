import { execFileSync } from "child_process";
import { logError } from "./log.js";

/**
 *
 * @param message {string}
 */
export function commit(message) {
  try {
    execFileSync("git", ["add", "."]);
    execFileSync("git", ["commit", "-m", message]);
  } catch (error) {
    logError(`Git commit failed: ${error.message}`);
    throw error;
  }
}
