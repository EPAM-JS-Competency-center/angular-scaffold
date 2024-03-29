export const eslintTemplateRules = {
  "@angular-eslint/template/no-duplicate-attributes": "error",
  "@angular-eslint/template/elements-content": "error",
  "@angular-eslint/template/alt-text": "error",
  "@angular-eslint/template/label-has-associated-control": "error",
  "@angular-eslint/template/no-positive-tabindex": "error",
  "@angular-eslint/template/valid-aria": "error",
  "@angular-eslint/template/banana-in-box": "error",
  "@angular-eslint/template/eqeqeq": [
    "error",
    {
      allowNullOrUndefined: true,
    },
  ],
  "@angular-eslint/template/no-any": "error",
};

export const eslintJasmineRules = {
  "jasmine/no-focused-tests": "error",
};

export const eslintRxJSRules = {
  "rxjs/no-ignored-observable": "error",
  "rxjs/no-unbound-methods": "error",
  "rxjs/throw-error": "error",
  "rxjs/no-compat": "error",
  "rxjs/no-unsafe-takeuntil": [
    "error",
    {
      alias: ["untilDestroyed"],
    },
  ],
};
