import { writeFileSync } from "fs";
import shelljs from "shelljs";
import { addPrettier } from ".";
import { logEnd, logError, logStart } from "../helpers/index.js";

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
  writeFileSync: jest.fn(),
}));

describe("addPrettier", () => {
  it("should install prettier", () => {
    addPrettier();

    expect(logStart).toBeCalledWith("Installing prettier");

    expect(writeFileSync).toHaveBeenCalledWith(
      "./prettier.config.js",
      `/** @type {import("prettier").Config} */
module.exports = {}`,
      "utf8",
    );

    expect(logEnd).toHaveBeenCalledWith("prettier installed");
  });

  it("log error and exit process", () => {
    shelljs.exec.mockReturnValue({ code: 1 });

    addPrettier();

    expect(logError).toHaveBeenCalledWith("Could not install prettier");

    expect(shelljs.exit).toHaveBeenCalledWith(1);
  });
});
