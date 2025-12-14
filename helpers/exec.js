import shelljs from "shelljs";
import { failSpinner, startSpinner, succeedSpinner } from "./spinner.js";

export function execOrFail({ cmd, startMsg, endMsg, errorMsg }) {
  startSpinner(startMsg);

  const result = shelljs.exec(cmd, { silent: true });
  if (result.code !== 0) {
    failSpinner(errorMsg);
    if (result.stderr) {
      console.error(result.stderr);
    }
    return shelljs.exit(1);
  }

  succeedSpinner(endMsg);
}
