import { commit } from "./commit.js";
import { execFileSync } from "child_process";

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("commit", function () {
  it("should stage files and commit", function () {
    commit("test message");

    expect(execFileSync).toHaveBeenCalledWith("git", ["add", "."]);
    expect(execFileSync).toHaveBeenCalledWith("git", [
      "commit",
      "-m",
      "test message",
    ]);
  });
});
