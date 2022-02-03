import { readFileSync, writeFileSync } from "fs";
import { logEnd, logStart } from "../helpers/index.js";

export const eslintTemplateRules = {
  "@angular-eslint/template/no-duplicate-attributes": "error",
  "@angular-eslint/template/accessibility-elements-content": "error",
  "@angular-eslint/template/accessibility-alt-text": "error",
  "@angular-eslint/template/accessibility-label-for": "error",
  "@angular-eslint/template/no-positive-tabindex": "error",
  "@angular-eslint/template/accessibility-valid-aria": "error",
  "@angular-eslint/template/banana-in-box": "error",
  "@angular-eslint/template/eqeqeq": [
    "error",
    {
      allowNullOrUndefined: true,
    },
  ],
  "@angular-eslint/template/no-call-expression": "error",
  "@angular-eslint/template/no-any": "error",
};

export function addTemplateRules() {
  logStart("Updating ESLint rules for templates");

  const eslintrcPath = "./.eslintrc.json";
  const eslintrcFile = readFileSync(eslintrcPath, "utf8");
  const eslintrc = JSON.parse(eslintrcFile);

  const htmlOverride = eslintrc.overrides.find((obj) =>
    obj.files.includes("*.html")
  );

  if (!htmlOverride) {
    throw new Error("Could not find HTML override");
  }

  htmlOverride.rules = {
    ...htmlOverride.rules,
    ...eslintTemplateRules,
  };

  writeFileSync(eslintrcPath, JSON.stringify(eslintrc, undefined, 2));

  logEnd("ESLint rules for templates updated");
}
