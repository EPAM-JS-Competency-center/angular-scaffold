import { exec } from "child_process";
import { failSpinner, startSpinner, succeedSpinner } from "./spinner.js";

export async function execOrFail({ cmd, startMsg, endMsg, errorMsg }) {
  startSpinner(startMsg);

  try {
    await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
    succeedSpinner(endMsg);
  } catch ({ error, stderr }) {
    failSpinner(errorMsg);
    if (stderr) {
      console.error(stderr);
    } else if (error?.message) {
      console.error(error.message);
    }
    process.exit(1);
  }
}
