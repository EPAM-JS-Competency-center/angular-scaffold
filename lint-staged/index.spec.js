import { readFileSync, writeFileSync } from "fs";
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
  readFileSync: jest.fn().mockReturnValue("{}"),
  writeFileSync: jest.fn(),
}));

describe("addLintStaged", () => {
  it("should install lint-staged", () => {
    addLintStaged();

    expect(logStart).toHaveBeenCalledWith("Installing lint-staged");

    expect(shelljs.exec).toHaveBeenCalledWith("npm i -D lint-staged");

    expect(readFileSync).toHaveBeenCalledWith("./package.json", "utf8");

    expect(writeFileSync).toHaveBeenCalledWith(
      "./package.json",
      JSON.stringify(
        {
          "lint-staged": {
            "*.{js,ts,html}": ["eslint --fix --cache", "prettier --write"],
            "*.{scss}": ["stylelint --fix --cache", "prettier --write"],
            "!*.{ts,js,html,scss,svg}": "prettier --write --ignore-unknown",
            "*.svg": "svgo",
          },
        },
        null,
        2
      ),
      "utf8"
    );

    expect(logEnd).toHaveBeenCalledWith(
      "lint-staged installed and ready to use"
    );
  });

  it("should log error and exit", () => {
    shelljs.exec.mockReturnValue({ code: 1 });
    addLintStaged();

    expect(logError).toHaveBeenCalledWith("Could not install lint-staged");
    expect(shelljs.exit).toHaveBeenCalledWith(1);
  });
});
