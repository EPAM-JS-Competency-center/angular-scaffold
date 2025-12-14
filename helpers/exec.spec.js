import shelljs from "shelljs";
import { execOrFail } from "./exec";
import { failSpinner, startSpinner, succeedSpinner } from "./spinner";

jest.mock("./spinner", () => ({
  __esModule: true,
  startSpinner: jest.fn(),
  succeedSpinner: jest.fn(),
  failSpinner: jest.fn(),
}));

jest.mock("shelljs", () => ({
  __esModule: true,
  default: {
    exec: jest.fn(() => ({
      code: 0,
      stderr: "",
    })),
    exit: jest.fn(),
  },
}));

describe("execOrFail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start spinner, execute command silently, and succeed", () => {
    execOrFail({
      cmd: "cmd",
      startMsg: "startMsg",
      endMsg: "endMsg",
      errorMsg: "errorMsg",
    });

    expect(startSpinner).toHaveBeenCalledWith("startMsg");
    expect(shelljs.exec).toHaveBeenCalledWith("cmd", { silent: true });
    expect(shelljs.exit).not.toHaveBeenCalledWith(1);
    expect(succeedSpinner).toHaveBeenCalledWith("endMsg");
    expect(failSpinner).not.toHaveBeenCalled();
  });

  it("should start spinner, execute command, fail and exit with code 1", () => {
    shelljs.exec.mockImplementation(() => ({
      code: 1,
      stderr: "error output",
    }));

    execOrFail({
      cmd: "cmd",
      startMsg: "startMsg",
      endMsg: "endMsg",
      errorMsg: "errorMsg",
    });

    expect(startSpinner).toHaveBeenCalledWith("startMsg");
    expect(shelljs.exec).toHaveBeenCalledWith("cmd", { silent: true });
    expect(shelljs.exit).toHaveBeenCalledWith(1);
    expect(succeedSpinner).not.toHaveBeenCalled();
    expect(failSpinner).toHaveBeenCalledWith("errorMsg");
  });
});
