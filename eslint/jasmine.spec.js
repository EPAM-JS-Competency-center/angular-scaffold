import { readFileSync, writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";
import { addJasmineRules } from "./jasmine";
import { eslintJasmineRules } from "./rules";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  logStart: jest.fn(),
  logEnd: jest.fn(),
  logError: jest.fn(),
}));

jest.mock("fs", () => ({
  __esModule: true,
  readFileSync: jest.fn().mockReturnValue(JSON.stringify(eslintrcMock)),
  writeFileSync: jest.fn(),
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

const eslintrcMock = {
  overrides: [
    {
      files: ["*.ts"],
      extends: ["test"],
      rules: {
        test_rule: "error",
      },
    },
  ],
};

const eslintrcExpected = JSON.stringify(
  {
    overrides: [
      {
        files: ["*.ts"],
        extends: ["test"],
        rules: {
          test_rule: "error",
        },
      },
      {
        files: ["*.spec.ts"],
        plugins: ["jasmine"],
        env: {
          jasmine: true,
        },
        extends: "plugin:jasmine/recommended",
        rules: eslintJasmineRules,
      },
    ],
  },
  undefined,
  2,
);

describe("addJasmineRules", () => {
  it("should install package and update eslinrc file", () => {
    addJasmineRules();

    expect(logStart).toHaveBeenCalledWith(
      "Installing ESLint plugin for unit tests",
    );
    expect(shelljs.exec).toHaveBeenCalledWith(
      "npm i eslint-plugin-jasmine@4 -D",
    );
    expect(logEnd).toHaveBeenCalledWith(
      "ESLint plugin for unit tests installed",
    );

    expect(logStart).toHaveBeenCalledWith(
      "Updating ESLint rules for unit tests",
    );
    expect(readFileSync).toHaveBeenCalledWith("./.eslintrc.json", "utf8");
    expect(writeFileSync).toHaveBeenCalledWith(
      "./.eslintrc.json",
      eslintrcExpected,
    );
    expect(logEnd).toHaveBeenCalledWith("ESLint rules for unit tests updated");
  });

  it("should log error and exit", () => {
    shelljs.exec.mockReturnValue({ code: 1 });

    addJasmineRules();

    expect(logError).toHaveBeenCalledWith(
      "Error during installation of ESLint plugin",
    );
    expect(shelljs.exit).toHaveBeenCalled();
    expect(logEnd).not.toHaveBeenCalled();
  });
});
