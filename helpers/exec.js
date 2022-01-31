import shelljs from "shelljs";
import { logEnd, logError, logStart } from "./log";

export function execOrFail({ cmd, startMsg, endMsg, errorMsg }) {
  logStart(startMsg);

  if (shelljs.exec(cmd).code !== 0) {
    logError(errorMsg);
    shelljs.exit(1);
    return;
  }

  logEnd(endMsg);
}
