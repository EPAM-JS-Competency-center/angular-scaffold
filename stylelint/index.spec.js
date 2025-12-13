import { writeFileSync } from "fs";
import shelljs from "shelljs";
import { addStylelint } from ".";
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

describe("addStylelint", () => {
  it("should install stylelint", () => {
    addStylelint();

    expect(logStart).toHaveBeenCalledWith("Installing stylelint");

    expect(shelljs.exec).toHaveBeenCalledWith(
      "npm i -D stylelint@16 stylelint-config-sass-guidelines@12",
    );

    expect(writeFileSync).toHaveBeenCalledWith(
      "./stylelint.config.js",
      `module.exports = {
  extends: ["stylelint-config-sass-guidelines"],
}`,
      "utf8",
    );

    expect(logEnd).toHaveBeenCalledWith("stylelint installed");
  });

  it("should log error and exit process", () => {
    shelljs.exec.mockReturnValue({ code: 1 });

    addStylelint();

    expect(logError).toHaveBeenCalledWith("Could not install stylelint");
    expect(shelljs.exit).toHaveBeenCalledWith(1);
  });
});
