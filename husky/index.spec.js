import shelljs from "shelljs";
import { addHusky } from ".";
import { logEnd, logError, logStart } from "../helpers";
import { writeFileSync } from "fs";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  logStart: jest.fn(),
  logEnd: jest.fn(),
  logError: jest.fn(),
}));

jest.mock("shelljs", () => ({
  __esModule: true,
  default: {
    exec: jest.fn().mockReturnValue({
      code: 0,
    }),
    exit: jest.fn(),
  },
}));

jest.mock("fs", () => ({
  __esModule: true,
  writeFileSync: jest.fn(),
}));

describe("addHusky", () => {
  it("should install husky", () => {
    addHusky();

    expect(logStart).toHaveBeenCalledWith("Installing husky");

    expect(shelljs.exec).toHaveBeenCalledWith("npm install husky@9 --save-dev");
    expect(writeFileSync).toHaveBeenCalledWith(
      ".husky/pre-commit",
      `export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

npx lint-staged --allow-empty`,
      "utf8",
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      ".husky/pre-push",
      "npm run test -- --browsers ChromeHeadless --watch false",
      "utf8",
    );

    expect(logEnd).toHaveBeenCalledWith("Husky installed!");
  });

  it("should exit in case any command fails", () => {
    // npm i fail
    shelljs.exec.mockReturnValueOnce({
      code: 1,
    });
    addHusky();

    // husky init fail
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 1,
    });
    addHusky();

    // adding precommit fail
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    writeFileSync.mockImplementationOnce(() => {
      throw new Error("test");
    });
    addHusky();

    // adding prepush fail
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    writeFileSync.mockImplementationOnce(() => {});
    writeFileSync.mockImplementationOnce(() => {
      throw new Error("test");
    });
    addHusky();

    expect(logError).toHaveBeenCalledWith(
      "Could not install husky. Please, check logs above for the error",
    );
    expect(logError).toHaveBeenCalledTimes(6);
    expect(shelljs.exit).toHaveBeenCalledTimes(4);
  });
});
