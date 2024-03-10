import shelljs from "shelljs";
import {logEnd, logError, logStart} from "../helpers/index.js";
import {writeFileSync} from "fs";

export function addHusky() {
  logStart("Installing husky");

  if (
    shelljs.exec("npm install husky lint-staged --save-dev").code !== 0 ||
    shelljs.exec('npx husky init').code !== 0 ||
    !addPreCommit() ||
    !addPrePush()
  ) {
    logError("Could not install husky. Please, check logs above for the error");
    return shelljs.exit(1);
  }

  logEnd("Husky installed!");
}

function addPreCommit() {
  try {
    writeFileSync('.husky/pre-commit', `export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

npx lint-staged --allow-empty`, 'utf8');

    return true
  } catch (e) {
    logError(e)
    return false
  }
}

function addPrePush() {
  try {
    writeFileSync('.husky/pre-push', "npm run test -- --browsers ChromeHeadless --watch false", 'utf8')

    return true
  } catch (e) {
    logError(e)
    return false
  }
}
