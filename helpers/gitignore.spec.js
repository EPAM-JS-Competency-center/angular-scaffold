import { gitignore } from "./gitignore.js";
import { readFileSync, writeFileSync } from "fs";
import { logError } from "./log.js";

jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue(`node_modules`),
  writeFileSync: jest.fn(),
}));

jest.mock("./log.js", () => ({
  logError: jest.fn(),
}));

describe("gitignore", function () {
  beforeEach(() => {
    jest.clearAllMocks();
    readFileSync.mockReturnValue(`node_modules`);
    writeFileSync.mockImplementation(() => {});
  });

  it("should add a new line", function () {
    gitignore(".eslintcache");

    expect(readFileSync).toHaveBeenCalledWith(".gitignore", "utf-8");
    expect(writeFileSync).toHaveBeenCalledWith(
      ".gitignore",
      `node_modules
.eslintcache
`,
    );
  });

  it("should handle read errors", function () {
    const error = new Error("ENOENT: no such file");
    readFileSync.mockImplementation(() => {
      throw error;
    });

    expect(() => gitignore(".eslintcache")).toThrow(error);
    expect(logError).toHaveBeenCalledWith(
      "Failed to update .gitignore: ENOENT: no such file",
    );
  });

  it("should handle write errors", function () {
    const error = new Error("EACCES: permission denied");
    writeFileSync.mockImplementation(() => {
      throw error;
    });

    expect(() => gitignore(".eslintcache")).toThrow(error);
    expect(logError).toHaveBeenCalledWith(
      "Failed to update .gitignore: EACCES: permission denied",
    );
  });
});
