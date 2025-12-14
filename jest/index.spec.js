import { execOrFail } from "../helpers/index.js";
import { addJest } from "./index.js";
import { readFileSync, writeFileSync } from "fs";
import { appSpec, jestConfig, setupJest, tsconfigSpec } from "./config.js";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  execOrFail: jest.fn(),
}));

const mockPackageJson = { scripts: {} };
const mockTsconfig = `{
  "compilerOptions": {
    "target": "ES2022"
  },
  "references": [
    {
      "path": "./tsconfig.app.json"
    }
  ]
}`;

jest.mock("fs", () => ({
  __esModule: true,
  readFileSync: jest.fn((file) => {
    if (file === "package.json") return JSON.stringify(mockPackageJson);
    if (file === "tsconfig.json") return mockTsconfig;
  }),
  writeFileSync: jest.fn(),
}));

describe("addJest", () => {
  it("should install jest-preset-angular and create config files", () => {
    addJest();

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm i -D jest@30 jest-preset-angular@16 @types/jest@30 jest-environment-jsdom@30 ts-node",
      startMsg: "Installing Jest and jest-preset-angular",
      errorMsg: "Error during Jest installation",
      endMsg: "Jest installed",
    });
    expect(writeFileSync).toHaveBeenCalledWith(
      "jest.config.ts",
      jestConfig,
      "utf8",
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      "setup-jest.ts",
      setupJest,
      "utf8",
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      "tsconfig.spec.json",
      tsconfigSpec,
      "utf8",
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      "src/app/app.spec.ts",
      appSpec,
      "utf8",
    );
    expect(readFileSync).toHaveBeenCalledWith("package.json", "utf8");
    expect(writeFileSync).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify({ scripts: { test: "jest" } }, null, 2),
      "utf8",
    );
    expect(readFileSync).toHaveBeenCalledWith("tsconfig.json", "utf8");
    expect(writeFileSync).toHaveBeenCalledWith(
      "tsconfig.json",
      `{
  "compilerOptions": {
    "esModuleInterop": true,
    "target": "ES2022"
  },
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}`,
      "utf8",
    );
  });
});
