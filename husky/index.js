import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";

export function addHusky() {
  logStart("Installing husky");

  if (
    shelljs.exec("npm install husky lint-staged --save-dev").code !== 0 ||
    shelljs.exec('npm pkg set scripts.prepare="husky install"').code !== 0 ||
    shelljs.exec("npm run prepare").code !== 0 ||
    shelljs.exec('npx husky add .husky/pre-commit "npx lint-staged"').code !==
      0 ||
    shelljs.exec(
      'npx husky add .husky/pre-push "npm run test -- --browsers ChromeHeadless --watch false"'
    ).code !== 0
  ) {
    logError("Could not install husky. Please, check logs above for the error");
    return shelljs.exit(1);
  }

  logEnd("Husky installed!");
}
