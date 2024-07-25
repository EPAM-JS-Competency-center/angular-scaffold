import { execFileSync } from "child_process";

/**
 *
 * @param message {string}
 */
export function commit(message) {
  execFileSync("git", ["add", "."]);
  execFileSync("git", ["commit", "-m", message]);
}
