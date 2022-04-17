import { readFileSync, writeFileSync } from "fs";
import shelljs from "shelljs";
import { logEnd, logError, logStart } from "../helpers/index.js";
import { addSonarRules } from "./sonar.js";

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

const eslintrcMockWithPlugins = {
  overrides: [
    {
      files: ["*.ts"],
      extends: ["test"],
      rules: {
        test_rule: "error",
      },
      plugins: [],
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
        extends: ["test", "plugin:sonarjs/recommended"],
        rules: {
          test_rule: "error",
        },
        plugins: ["sonarjs"],
      },
    ],
  },
  undefined,
  2
);

describe("addSonarRules", () => {
  it("should install package and update eslinrc file", () => {
    addSonarRules();

    expect(logStart).toHaveBeenCalledWith("Installing ESLint plugin for sonar");
    expect(shelljs.exec).toHaveBeenCalledWith("npm i eslint-plugin-sonarjs -D");
    expect(logEnd).toHaveBeenCalledWith("ESLint plugin for sonar installed");

    expect(logStart).toHaveBeenCalledWith("Updating ESLint rules for sonar");
    expect(readFileSync).toHaveBeenCalledWith("./.eslintrc.json", "utf8");
    expect(writeFileSync).toHaveBeenCalledWith(
      "./.eslintrc.json",
      eslintrcExpected
    );
    expect(logEnd).toHaveBeenCalledWith("ESLint rules for sonar updated");
  });

  it("should throw error", () => {
    readFileSync.mockReturnValue(JSON.stringify(invalidEslintrcMock));

    expect(() => addSonarRules()).toThrow("Could not find TS override");
  });

  it("should push plugin to existing array", () => {
    readFileSync.mockReturnValue(JSON.stringify(eslintrcMockWithPlugins));

    addSonarRules();

    expect(writeFileSync).toHaveBeenCalledWith(
      "./.eslintrc.json",
      eslintrcExpected
    );
  });

  it("should log error and exit", () => {
    shelljs.exec.mockReturnValue({ code: 1 });

    addSonarRules();

    expect(logError).toHaveBeenCalledWith(
      "Error during installation of ESLint plugin"
    );
    expect(shelljs.exit).toHaveBeenCalled();
    expect(logEnd).not.toHaveBeenCalled();
  });
});
