import shelljs from "shelljs";
import { addJasmineRules } from "./eslint/jasmine";
import { addRxJSRules } from "./eslint/rxjs";
import { addSonarRules } from "./eslint/sonar";
import { addTemplateRules } from "./eslint/template";
import { execOrFail, logEnd } from "./helpers";
import { addHusky } from "./husky";
import { addLintStaged } from "./lint-staged";
import { addPrettier } from "./prettier";
import { addStylelint } from "./stylelint";

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

describe("index.js", () => {
  it("should pass the flow", async () => {
    process.argv = ["node", "index.js", "test-app"];
    await import("./index.js");

    expect(execOrFail).toBeCalledWith({
      cmd: "npx @angular/cli new test-app --style scss --routing true",
      startMsg: "Scaffolding Angular application...",
      errorMsg: "Error during Angular scaffolding",
      endMsg: "Angular application scaffolded",
    });

    expect(shelljs.cd).toBeCalledWith("test-app");

    expect(execOrFail).toBeCalledWith({
      cmd: "npx ng add @angular-eslint/schematics --skip-confirmation",
      startMsg: "Adding @angular-eslint schematics",
      errorMsg: "Error during adding Angular ESLint",
      endMsg: "@angular-eslint schematics added",
    });

    expect(addTemplateRules).toHaveBeenCalled();

    expect(addJasmineRules).toHaveBeenCalled();

    expect(addRxJSRules).toHaveBeenCalled();

    expect(addSonarRules).toHaveBeenCalled();

    expect(addPrettier).toHaveBeenCalled();

    expect(addStylelint).toHaveBeenCalled();

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D svgo",
      startMsg: "Installing svgo",
      errorMsg: "Error during svgo installation",
      endMsg: "svgo installed",
    });

    expect(addLintStaged).toHaveBeenCalled();

    expect(addHusky).toHaveBeenCalled();

    expect(logEnd).toHaveBeenCalledWith("Ready to work!");
  });
});
