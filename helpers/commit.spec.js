import { commit } from "./commit.js";
import { execFileSync } from "child_process";
import { logError } from "./log.js";

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));

jest.mock("./log.js", () => ({
  logError: jest.fn(),
}));

describe("commit", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should stage files and commit", function () {
    commit("test message");

    expect(execFileSync).toHaveBeenCalledWith("git", ["add", "."]);
    expect(execFileSync).toHaveBeenCalledWith("git", [
      "commit",
      "-m",
      "test message",
    ]);
  });

  it("should handle git add errors", function () {
    const error = new Error("fatal: not a git repository");
    execFileSync.mockImplementation(() => {
      throw error;
    });

    expect(() => commit("test message")).toThrow(error);
    expect(logError).toHaveBeenCalledWith(
      "Git commit failed: fatal: not a git repository",
    );
  });

  it("should handle git commit errors", function () {
    const error = new Error("nothing to commit");
    execFileSync
      .mockImplementationOnce(() => {}) // git add succeeds
      .mockImplementationOnce(() => {
        throw error;
      }); // git commit fails

    expect(() => commit("test message")).toThrow(error);
    expect(logError).toHaveBeenCalledWith(
      "Git commit failed: nothing to commit",
    );
  });
});
