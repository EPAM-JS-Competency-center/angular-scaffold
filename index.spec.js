import shelljs from "shelljs";
import { addJasmineRules } from "./eslint/jasmine";
import { addTemplateRules } from "./eslint/template";
import { execOrFail, logEnd } from "./helpers";
import { addRxJSRules } from "./eslint/rxjs";
import { addSonarRules } from "./eslint/sonar.js";

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

describe("index.js", () => {
  it("should pass the flow", async () => {
    process.argv = ["node", "index.js", "test-app"];
    await import("./index.js");

    expect(execOrFail).toBeCalledWith({
      cmd: "npx @angular/cli new test-app",
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

    expect(logEnd).toHaveBeenCalledWith("Ready to work!");
  });
});
