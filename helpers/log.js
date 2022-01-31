import chalk from "chalk";

export function logStart(msg) {
  console.log(chalk.yellow(msg));
}

export function logEnd(msg) {
  console.log(chalk.green(msg));
}

export function logError(msg) {
  console.log(chalk.red(msg));
}
