import chalk from "chalk";

/**
 *
 * @param {string} msg Message to print
 */
export function logStart(msg) {
  console.log(chalk.yellow(msg));
}

/**
 *
 * @param {string} msg Message to print
 */
export function logEnd(msg) {
  console.log(chalk.green(msg));
}

/**
 *
 * @param {string} msg Message to print
 */
export function logError(msg) {
  console.log(chalk.red(msg));
}
