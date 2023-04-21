import shelljs from "shelljs";
import { addHusky } from ".";
import { logEnd, logError, logStart } from "../helpers";

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

describe("addHusky", () => {
  it("should install husky", () => {
    addHusky();

    expect(logStart).toHaveBeenCalledWith("Installing husky");

    expect(shelljs.exec).toHaveBeenCalledWith(
      "npm install husky lint-staged --save-dev"
    );
    expect(shelljs.exec).toHaveBeenCalledWith(
      'npm pkg set scripts.prepare="husky install"'
    );
    expect(shelljs.exec).toHaveBeenCalledWith("npm run prepare");
    expect(shelljs.exec).toHaveBeenCalledWith(
      'npx husky add .husky/pre-commit "npx lint-staged"'
    );
    expect(shelljs.exec).toHaveBeenCalledWith(
      'npx husky add .husky/pre-push "npm run test -- --browsers ChromeHeadless --watch false"'
    );

    expect(logEnd).toHaveBeenCalledWith("Husky installed!");
  });

  it("should exit in case any command fails", () => {
    // 1st command fail
    shelljs.exec.mockReturnValueOnce({
      code: 1,
    });
    addHusky();

    // 2nd command fail
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 1,
    });
    addHusky();

    // 3rd command fail
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 1,
    });
    addHusky();

    // 4th command fail
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 1,
    });
    addHusky();

    // 5th command fail
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 0,
    });
    shelljs.exec.mockReturnValueOnce({
      code: 1,
    });
    addHusky();

    expect(logError).toHaveBeenCalledWith(
      "Could not install husky. Please, check logs above for the error"
    );
    expect(logError).toHaveBeenCalledTimes(5);

    expect(shelljs.exit).toHaveBeenCalledTimes(5);
  });
});
