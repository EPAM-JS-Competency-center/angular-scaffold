import { readFileSync, writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";
import { eslintRxJSRules } from "./rules.js";
import { addRxJSRules } from "./rxjs.js";

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

const invalidEslintrcMock = {
  overrides: [],
};

const eslintrcExpected = JSON.stringify(
  {
    overrides: [
      {
        files: ["*.ts"],
        extends: ["test", "plugin:rxjs/recommended"],
        rules: {
          test_rule: "error",
          ...eslintRxJSRules
        }
      }
    ],
    parserOptions: {
      project: "tsconfig.json"
    }
  },
  undefined,
  2
);

describe("addRxJSRules", () => {
  it("should install package and update eslinrc file", () => {
    addRxJSRules();

    expect(logStart).toHaveBeenCalledWith(
      "Installing ESLint plugin for RxJS"
    );
    expect(shelljs.exec).toHaveBeenCalledWith("npm i eslint-plugin-rxjs -D");
    expect(logEnd).toHaveBeenCalledWith(
      "ESLint plugin for RxJS installed"
    );

    expect(logStart).toHaveBeenCalledWith(
      "Updating ESLint rules for RxJS"
    );
    expect(readFileSync).toHaveBeenCalledWith("./.eslintrc.json", "utf8");
    expect(writeFileSync).toHaveBeenCalledWith(
      "./.eslintrc.json",
      eslintrcExpected
    );
    expect(logEnd).toHaveBeenCalledWith("ESLint rules for RxJS updated");
  });

  it("should throw error", () => {
    readFileSync.mockReturnValue(JSON.stringify(invalidEslintrcMock));

    expect(() => addRxJSRules()).toThrow("Could not find TS override");
  });

  it("should log error and exit", () => {
    shelljs.exec.mockReturnValue({ code: 1 });

    addRxJSRules();

    expect(logError).toHaveBeenCalledWith(
      "Error during installation of ESLint plugin"
    );
    expect(shelljs.exit).toHaveBeenCalled();
    expect(logEnd).not.toHaveBeenCalled();
  });
});
