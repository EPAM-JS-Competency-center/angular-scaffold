import { writeFileSync } from "fs";
import shelljs from "shelljs";
import { addLintStaged } from ".";
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

describe("addLintStaged", () => {
  it("should install lint-staged", () => {
    addLintStaged();

    expect(logStart).toHaveBeenCalledWith("Installing lint-staged");

    expect(shelljs.exec).toHaveBeenCalledWith("npm i -D lint-staged@15");

    expect(writeFileSync).toHaveBeenCalledWith(
      "./lint-staged.config.js",
      `module.exports = {
  "*.{js,ts,html}": ["eslint --fix --cache", "prettier --write"],
  "*.scss": ["stylelint --fix --cache", "prettier --write"],
  "!*.{ts,js,html,scss,svg}": "prettier --write --ignore-unknown",
  "*.svg": "svgo",
}`,
      "utf8",
    );

    expect(logEnd).toHaveBeenCalledWith(
      "lint-staged installed and ready to use",
    );
  });

  it("should log error and exit", () => {
    shelljs.exec.mockReturnValue({ code: 1 });
    addLintStaged();

    expect(logError).toHaveBeenCalledWith("Could not install lint-staged");
    expect(shelljs.exit).toHaveBeenCalledWith(1);
  });
});
