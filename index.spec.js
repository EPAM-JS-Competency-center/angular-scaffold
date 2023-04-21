import shelljs from "shelljs";
import { addJasmineRules } from "./eslint/jasmine";
import { addRxJSRules } from "./eslint/rxjs";
import { addSonarRules } from "./eslint/sonar";
import { addTemplateRules } from "./eslint/template";
import { commit, execOrFail, logEnd, logStart } from "./helpers";
import { addHusky } from "./husky";
import { addLintStaged } from "./lint-staged";
import { addPrettier } from "./prettier";
import { addStylelint } from "./stylelint";
import { execFileSync } from "child_process";

jest.mock("shelljs", () => ({
  __esModule: true,
  default: {
    cd: jest.fn(),
  },
}));

jest.mock("./eslint/template.js", () => ({
  __esModule: true,
  addTemplateRules: jest.fn(),
}));

jest.mock("./eslint/jasmine.js", () => ({
  __esModule: true,
  addJasmineRules: jest.fn(),
}));

jest.mock("./eslint/rxjs.js", () => ({
  __esModule: true,
  addRxJSRules: jest.fn(),
}));

jest.mock("./eslint/sonar.js", () => ({
  __esModule: true,
  addSonarRules: jest.fn(),
}));

jest.mock("./helpers/index.js", () => ({
  execOrFail: jest.fn(),
  logEnd: jest.fn(),
  logStart: jest.fn(),
  commit: jest.fn()
}));

jest.mock("./husky/index.js", () => ({
  addHusky: jest.fn(),
}));

jest.mock("./lint-staged/index.js", () => ({
  addLintStaged: jest.fn(),
}));

jest.mock("./prettier/index.js", () => ({
  addPrettier: jest.fn(),
}));

jest.mock("./stylelint/index.js", () => ({
  addStylelint: jest.fn(),
}));

jest.mock("child_process", () => ({
  execFileSync: jest.fn()
}));

describe("index.js", () => {
  it("should pass the flow", async () => {
    process.argv = ["node", "index.js", "test-app"];
    await import("./index.js");

    expect(logStart).toBeCalledWith("Scaffolding Angular application...");
    expect(execFileSync).toBeCalledWith(
      "npx",
      ["@angular/cli", "new", "test-app", "--style", "scss"],
      {
        stdio: "inherit"
      }
    );
    expect(logEnd).toBeCalledWith("Angular application scaffolded");

    expect(shelljs.cd).toBeCalledWith("test-app");

    expect(execOrFail).toBeCalledWith({
      cmd: "npx ng add @angular-eslint/schematics --skip-confirmation",
      startMsg: "Adding @angular-eslint schematics",
      errorMsg: "Error during adding Angular ESLint",
      endMsg: "@angular-eslint schematics added"
    });
    expect(commit).toBeCalledWith("Add ESLint");

    expect(addTemplateRules).toHaveBeenCalled();
    expect(addJasmineRules).toHaveBeenCalled();
    expect(addRxJSRules).toHaveBeenCalled();
    expect(addSonarRules).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add ESLint rules");

    expect(addPrettier).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add Prettier");

    expect(addStylelint).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add Stylelint");

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D svgo",
      startMsg: "Installing svgo",
      errorMsg: "Error during svgo installation",
      endMsg: "svgo installed"
    });
    expect(commit).toBeCalledWith("Add SVGo");

    expect(addLintStaged).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add Lint staged");

    expect(addHusky).toHaveBeenCalled();
    expect(commit).toBeCalledWith("Add Husky");

    expect(logEnd).toHaveBeenCalledWith("Ready to work!");
  });
});
