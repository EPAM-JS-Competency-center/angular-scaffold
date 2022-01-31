import chalk from "chalk";
import shelljs from "shelljs";

export function logStart(msg) {
  console.log(chalk.yellow(msg));
}

export function logEnd(msg) {
  console.log(chalk.green(msg));
}

export function logError(msg) {
  console.log(chalk.red(msg));
}

export function execOrFail({ cmd, startMsg, endMsg, errorMsg }) {
  logStart(startMsg);

  if (shelljs.exec(cmd).code !== 0) {
    logError(errorMsg);
    shelljs.exit(1);
  }

  logEnd(endMsg);
}
