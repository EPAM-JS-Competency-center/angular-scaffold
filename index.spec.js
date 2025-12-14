import shelljs from "shelljs";
import {
  commit,
  ensureAngularCliVersion,
  execOrFail,
  gitignore,
  logEnd,
  logStart,
} from "./helpers";
import { addPrettier } from "./prettier";
import { addStylelint } from "./stylelint";
import { execFileSync } from "child_process";
import { addEslint } from "./eslint/index.js";
import { addLefthook } from "./lefthook/index.js";
import { addJest } from "./jest/index.js";
import { addStorybook } from "./storybook/index.js";

jest.mock("shelljs", () => ({
  __esModule: true,
  default: {
    cd: jest.fn(),
  },
}));

jest.mock("./eslint/index.js", () => ({
  __esModule: true,
  addEslint: jest.fn(),
}));

jest.mock("./helpers/index.js", () => ({
  ANGULAR_CLI_MAJOR_VERSION: "21",
  ensureAngularCliVersion: jest.fn().mockResolvedValue(undefined),
  execOrFail: jest.fn(),
  logEnd: jest.fn(),
  logStart: jest.fn(),
  commit: jest.fn(),
  gitignore: jest.fn(),
}));

jest.mock("./jest/index.js", () => ({
  addJest: jest.fn(),
}));

jest.mock("./lefthook/index.js", () => ({
  addLefthook: jest.fn(),
}));

jest.mock("./storybook/index.js", () => ({
  addStorybook: jest.fn(),
}));

jest.mock("./prettier/index.js", () => ({
  addPrettier: jest.fn(),
}));

jest.mock("./stylelint/index.js", () => ({
  addStylelint: jest.fn(),
}));

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("index.js", () => {
  it("should pass the flow", async () => {
    process.argv = ["node", "index.js", "test-app"];
    await import("./index.js");

    expect(ensureAngularCliVersion).toHaveBeenCalled();
    expect(logStart).toHaveBeenCalledWith("Scaffolding Angular application...");
    expect(execFileSync).toHaveBeenCalledWith(
      "npx",
      ["@angular/cli@21", "new", "test-app", "--style", "scss", "--minimal"],
      {
        stdio: "inherit",
      },
    );
    expect(logEnd).toHaveBeenCalledWith("Angular application scaffolded");

    expect(shelljs.cd).toHaveBeenCalledWith("test-app");

    expect(addEslint).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith("Add ESLint");

    expect(gitignore).toHaveBeenCalledWith(`# lint caches
.eslintcache`);
    expect(commit).toHaveBeenCalledWith("Add .eslintcache to .gitignore");

    expect(addPrettier).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith("Add Prettier");

    expect(addStylelint).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith("Add Stylelint");

    expect(gitignore).toHaveBeenCalledWith(`.stylelintcache`);
    expect(commit).toHaveBeenCalledWith("Add .stylelintcache to .gitignore");

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D svgo@4",
      startMsg: "Installing svgo",
      errorMsg: "Error during svgo installation",
      endMsg: "svgo installed",
    });
    expect(commit).toHaveBeenCalledWith("Add SVGo");

    expect(addJest).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith("Add Jest");

    expect(addStorybook).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith("Add Storybook");

    expect(addLefthook).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith("Add Lefthook");

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npx prettier --write .",
      startMsg: "Formatting files with Prettier",
      errorMsg: "Error during Prettier formatting",
      endMsg: "Files formatted",
    });
    expect(commit).toHaveBeenCalledWith("Format files with Prettier");

    expect(logEnd).toHaveBeenCalledWith("Ready to work!");
  });
});
