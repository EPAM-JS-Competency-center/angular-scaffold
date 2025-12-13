import { readFileSync, writeFileSync } from "fs";
import { logError } from "./log.js";

/**
 *
 * @param fileName {string}
 */
export function gitignore(fileName) {
  try {
    let fileContents = readFileSync(".gitignore", "utf-8");
    fileContents += `
${fileName}
`;
    writeFileSync(".gitignore", fileContents);
  } catch (error) {
    logError(`Failed to update .gitignore: ${error.message}`);
    throw error;
  }
}
