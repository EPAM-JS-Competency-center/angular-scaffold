import { exec } from "child_process";
import { execOrFail } from "./exec";
import { failSpinner, startSpinner, succeedSpinner } from "./spinner";

jest.mock("./spinner", () => ({
  __esModule: true,
  startSpinner: jest.fn(),
  succeedSpinner: jest.fn(),
  failSpinner: jest.fn(),
}));

jest.mock("child_process", () => ({
  __esModule: true,
  exec: jest.fn((cmd, callback) => {
    callback(null, "stdout", "");
  }),
}));

const mockProcessExit = jest
  .spyOn(process, "exit")
  .mockImplementation(() => {});

const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("execOrFail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start spinner, execute command, and succeed", async () => {
    await execOrFail({
      cmd: "cmd",
      startMsg: "startMsg",
      endMsg: "endMsg",
      errorMsg: "errorMsg",
    });

    expect(startSpinner).toHaveBeenCalledWith("startMsg");
    expect(exec).toHaveBeenCalledWith("cmd", expect.any(Function));
    expect(mockProcessExit).not.toHaveBeenCalled();
    expect(succeedSpinner).toHaveBeenCalledWith("endMsg");
    expect(failSpinner).not.toHaveBeenCalled();
  });

  it("should start spinner, execute command, fail and exit with code 1", async () => {
    exec.mockImplementation((cmd, callback) => {
      const error = new Error("command failed");
      callback(error, "", "error output");
    });

    await execOrFail({
      cmd: "cmd",
      startMsg: "startMsg",
      endMsg: "endMsg",
      errorMsg: "errorMsg",
    });

    expect(startSpinner).toHaveBeenCalledWith("startMsg");
    expect(exec).toHaveBeenCalledWith("cmd", expect.any(Function));
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(succeedSpinner).not.toHaveBeenCalled();
    expect(failSpinner).toHaveBeenCalledWith("errorMsg");
    expect(mockConsoleError).toHaveBeenCalledWith("error output");
  });
});
