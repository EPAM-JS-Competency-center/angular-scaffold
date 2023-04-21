import { commit } from "./commit.js";
import { execFileSync } from "child_process";

jest.mock("child_process", () => ({
  execFileSync: jest.fn()
}));

describe("commit", function() {
  it("should stage files and commit", function() {
    commit("test message");

    expect(execFileSync).toBeCalledWith("git", ["add", "."]);
    expect(execFileSync).toBeCalledWith("git", [
      "commit",
      "-m",
      "test message"
    ]);
  });
});
