import { writeFileSync } from "fs";
import { addStylelint } from ".";
import { execOrFail } from "../helpers/index.js";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  execOrFail: jest.fn(),
}));

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

describe("addStylelint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should install stylelint with SASS guidelines by default", () => {
    addStylelint();

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D stylelint@16 stylelint-config-sass-guidelines@12",
      startMsg: "Installing Stylelint with SASS guidelines",
      errorMsg: "Could not install Stylelint",
      endMsg: "Stylelint installed",
    });

    expect(writeFileSync).toHaveBeenCalledWith(
      "./stylelint.config.js",
      `module.exports = {
  extends: ["stylelint-config-sass-guidelines"],
}`,
      "utf8",
    );
  });

  it("should install stylelint with SASS guidelines for scss style", () => {
    addStylelint({ style: "scss" });

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D stylelint@16 stylelint-config-sass-guidelines@12",
      startMsg: "Installing Stylelint with SASS guidelines",
      errorMsg: "Could not install Stylelint",
      endMsg: "Stylelint installed",
    });
  });

  it("should install stylelint with SASS guidelines for sass style", () => {
    addStylelint({ style: "sass" });

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D stylelint@16 stylelint-config-sass-guidelines@12",
      startMsg: "Installing Stylelint with SASS guidelines",
      errorMsg: "Could not install Stylelint",
      endMsg: "Stylelint installed",
    });
  });

  it("should install stylelint with standard config for css style", () => {
    addStylelint({ style: "css" });

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D stylelint@16 stylelint-config-standard@38",
      startMsg: "Installing Stylelint with standard config",
      errorMsg: "Could not install Stylelint",
      endMsg: "Stylelint installed",
    });

    expect(writeFileSync).toHaveBeenCalledWith(
      "./stylelint.config.js",
      `module.exports = {
  extends: ["stylelint-config-standard"],
}`,
      "utf8",
    );
  });

  it("should install stylelint with standard config for less style", () => {
    addStylelint({ style: "less" });

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D stylelint@16 stylelint-config-standard@38",
      startMsg: "Installing Stylelint with standard config",
      errorMsg: "Could not install Stylelint",
      endMsg: "Stylelint installed",
    });
  });
});
