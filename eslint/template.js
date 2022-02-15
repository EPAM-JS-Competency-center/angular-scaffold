import { readFileSync, writeFileSync } from "fs";
import { logEnd, logStart } from "../helpers/index.js";
import { eslintTemplateRules } from "./rules.js";

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
