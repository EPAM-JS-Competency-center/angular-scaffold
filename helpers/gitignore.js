import { readFileSync, writeFileSync } from "fs";

/**
 *
 * @param fileName {string}
 */
export function gitignore(fileName) {
  let fileContents = readFileSync(".gitignore", "utf-8");
  fileContents += `
${fileName}
`;
  writeFileSync(".gitignore", fileContents);
}
