import shelljs from "shelljs";
import { logEnd, logError, logStart } from "./log.js";

export function execOrFail({ cmd, startMsg, endMsg, errorMsg }) {
  logStart(startMsg);

  if (shelljs.exec(cmd).code !== 0) {
    logError(errorMsg);
    return shelljs.exit(1);
  }

  logEnd(endMsg);
}
