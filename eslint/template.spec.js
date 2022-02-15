import { readFileSync, writeFileSync } from "fs";
import { logEnd, logStart } from "../helpers";
import { eslintTemplateRules } from "./rules";
import { addTemplateRules } from "./template";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  logStart: jest.fn(),
  logEnd: jest.fn(),
}));

jest.mock("fs", () => ({
  __esModule: true,
  readFileSync: jest.fn().mockReturnValue(JSON.stringify(eslintrcMock)),
  writeFileSync: jest.fn(),
}));

const eslintrcMock = {
  overrides: [
    {
      files: ["*.html"],
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
        files: ["*.html"],
        rules: {
          test_rule: "error",
          ...eslintTemplateRules,
        },
      },
    ],
  },
  undefined,
  2
);

describe("addTemplateRules", () => {
  it("should update eslinrc file", () => {
    addTemplateRules();

    expect(logStart).toHaveBeenCalledWith(
      "Updating ESLint rules for templates"
    );
    expect(readFileSync).toHaveBeenCalledWith("./.eslintrc.json", "utf8");
    expect(writeFileSync).toHaveBeenCalledWith(
      "./.eslintrc.json",
      eslintrcExpected
    );
    expect(logEnd).toHaveBeenCalledWith("ESLint rules for templates updated");
  });

  it("should throw error", () => {
    readFileSync.mockReturnValue(JSON.stringify(invalidEslintrcMock));

    expect(() => addTemplateRules()).toThrow("Could not find HTML override");
  });
});
