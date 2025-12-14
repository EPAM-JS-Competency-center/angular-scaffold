import { writeFileSync } from "fs";
import { addPrettier } from ".";
import { execOrFail } from "../helpers/index.js";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  execOrFail: jest.fn(),
}));

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

describe("addPrettier", () => {
  it("should install prettier and create config", () => {
    addPrettier();

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D prettier@3 eslint-config-prettier@10",
      startMsg: "Installing Prettier",
      errorMsg: "Could not install Prettier",
      endMsg: "Prettier installed",
    });

    expect(writeFileSync).toHaveBeenCalledWith(
      "./prettier.config.js",
      `/** @type {import("prettier").Config} */
module.exports = {}`,
      "utf8",
    );
  });
});
