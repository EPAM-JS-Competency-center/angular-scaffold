import { execOrFail } from "../helpers/index.js";
import { readFileSync, writeFileSync } from "fs";
import { jestConfig, setupJest, tsconfigSpec } from "./config.js";

export function addJest() {
  execOrFail({
    cmd: "npm i -D jest@30 jest-preset-angular@16 @types/jest@30 jest-environment-jsdom@30 ts-node",
    startMsg: "Installing Jest and jest-preset-angular",
    errorMsg: "Error during Jest installation",
    endMsg: "Jest installed",
  });

  writeFileSync("jest.config.ts", jestConfig, "utf8");
  writeFileSync("setup-jest.ts", setupJest, "utf8");
  writeFileSync("tsconfig.spec.json", tsconfigSpec, "utf8");

  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  packageJson.scripts.test = "jest";
  writeFileSync("package.json", JSON.stringify(packageJson, null, 2), "utf8");

  const tsconfig = readFileSync("tsconfig.json", "utf8");
  const updatedTsconfig = tsconfig.replace(
    /("compilerOptions"\s*:\s*\{)/,
    '$1\n    "esModuleInterop": true,',
  );
  writeFileSync("tsconfig.json", updatedTsconfig, "utf8");
}
