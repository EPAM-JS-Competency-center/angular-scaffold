import shelljs from "shelljs";
import { commit, execOrFail, gitignore, logEnd, logStart } from "./helpers";
import { addPrettier } from "./prettier";
import { addStylelint } from "./stylelint";
import { execFileSync } from "child_process";
import { addEslint } from "./eslint/index.js";
import { addLefthook } from "./lefthook/index.js";

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
  execOrFail: jest.fn(),
  logEnd: jest.fn(),
  logStart: jest.fn(),
  commit: jest.fn(),
  gitignore: jest.fn(),
}));

jest.mock("./lefthook/index.js", () => ({
  addLefthook: jest.fn(),
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

    expect(logStart).toBeCalledWith("Scaffolding Angular application...");
    expect(execFileSync).toBeCalledWith(
      "npx",
      ["@angular/cli@18", "new", "test-app", "--style", "scss"],
      {
        stdio: "inherit",
      },
    );
    expect(logEnd).toBeCalledWith("Angular application scaffolded");

    expect(shelljs.cd).toBeCalledWith("test-app");

    expect(addEslint).toBeCalled();
    expect(commit).toBeCalledWith("Add ESLint");

    expect(gitignore).toBeCalledWith(`# lint caches
.eslintcache`);
    expect(commit).toBeCalledWith("Add .eslintcache to .gitignore");

    expect(addPrettier).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add Prettier");

    expect(addStylelint).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add Stylelint");

    expect(gitignore).toBeCalledWith(`.stylelintcache`);
    expect(commit).toBeCalledWith("Add .stylelintcache to .gitignore");

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D svgo@3",
      startMsg: "Installing svgo",
      errorMsg: "Error during svgo installation",
      endMsg: "svgo installed",
    });
    expect(commit).toBeCalledWith("Add SVGo");

    expect(addLefthook).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add Lefthook");

    expect(logEnd).toHaveBeenCalledWith("Ready to work!");
  });
});
