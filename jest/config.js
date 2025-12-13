export const jestConfig = `import type { Config } from "jest";
import { createCjsPreset } from "jest-preset-angular/presets/index.js";

// Uncomment and add packages that need to be transformed (e.g., ESM-only packages)
// const packagesToTransform = [
//   "@angular",
//   "@ngrx",
// ];
// const transformIgnorePatterns = [
//   \`node_modules/(?!.pnpm|(\${packagesToTransform.join("|")}))\`,
// ];

export default {
  ...createCjsPreset(),
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  // transformIgnorePatterns,
} satisfies Config;
`;

export const setupJest = `import { setupZonelessTestEnv } from "jest-preset-angular/setup-env/zoneless";

setupZonelessTestEnv();
`;

export const tsconfigSpec = `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "module": "ES2022",
    "types": ["jest"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
`;
