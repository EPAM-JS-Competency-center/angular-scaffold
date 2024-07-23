import { execOrFail } from "../helpers/index.js";
import { addEslint } from "./index.js";
import { renameSync, writeFileSync } from "fs";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  execOrFail: jest.fn(),
}));

jest.mock("fs", () => ({
  __esModule: true,
  renameSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe("addEsLint", () => {
  it("should install eslint and configure", () => {
    addEslint();

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npx ng add @angular-eslint/schematics@18 --skip-confirmation",
      startMsg: "Adding @angular-eslint schematics",
      errorMsg: "Error during adding Angular ESLint",
      endMsg: "@angular-eslint schematics added",
    });
    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D @epam/eslint-config-angular",
      startMsg: "Adding @epam/eslint-config-angular",
      errorMsg: "Error during adding @epam/eslint-config-angular",
      endMsg: "@epam/eslint-config-angular added and configured",
    });
    expect(renameSync).toHaveBeenCalledWith(
      "eslint.config.js",
      "eslint.config.mjs",
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      "eslint.config.mjs",
      `import eslintConfigAngular from "@epam/eslint-config-angular";

export default [...eslintConfigAngular];`,
      "utf8",
    );
  });
});
