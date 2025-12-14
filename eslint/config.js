export const eslintConfig = `import eslintConfigAngular from "@epam/eslint-config-angular";

export default [
  {
    ignores: [
      "*.config.ts",
      "setup-jest.ts",
      ".storybook/",
      "src/stories/",
    ],
  },
  ...eslintConfigAngular,
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
];
`;
