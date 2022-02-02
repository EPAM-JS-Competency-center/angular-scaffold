import shelljs from "shelljs";
import { execOrFail } from "./exec";
import { logEnd, logError, logStart } from "./log";

jest.mock("./log", () => ({
  __esModule: true,
  logStart: jest.fn(),
  logError: jest.fn(),
  logEnd: jest.fn(),
}));

jest.mock("shelljs", () => ({
  __esModule: true,
  default: {
    exec: jest.fn(() => ({
      code: 0,
    })),
    exit: jest.fn(),
  },
}));

describe("execOrFail", () => {
  it("log start, execute the command and log end", () => {
    execOrFail({
      cmd: "cmd",
      startMsg: "startMsg",
      endMsg: "endMsg",
      errorMsg: "errorMsg",
    });

    expect(logStart).toHaveBeenCalledWith("startMsg");
    expect(shelljs.exec).toHaveBeenCalledWith("cmd");
    expect(shelljs.exit).not.toHaveBeenCalledWith(1);
    expect(logEnd).toHaveBeenCalledWith("endMsg");
    expect(logError).not.toHaveBeenCalled();
  });

  it("log start, execute the command, log error and exit with code 1", () => {
    shelljs.exec.mockImplementation(() => ({ code: 1 }));
    execOrFail({
      cmd: "cmd",
      startMsg: "startMsg",
      endMsg: "endMsg",
      errorMsg: "errorMsg",
    });

    expect(logStart).toHaveBeenCalledWith("startMsg");
    expect(shelljs.exec).toHaveBeenCalledWith("cmd");
    expect(shelljs.exit).toHaveBeenCalledWith(1);
    expect(logEnd).not.toHaveBeenCalledWith("endMsg");
    expect(logError).toHaveBeenCalled();
  });
});
