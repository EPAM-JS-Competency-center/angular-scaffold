import { gitignore } from "./gitignore.js";
import { readFileSync, writeFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue(`node_modules`),
  writeFileSync: jest.fn(),
}));

describe("gitignore", function () {
  it("should add a new line", function () {
    gitignore(".eslintcache");

    expect(readFileSync).toHaveBeenCalledWith(".gitignore", "utf-8");
    expect(writeFileSync).toHaveBeenCalledWith(
      ".gitignore",
      `node_modules
.eslintcache
`,
    );
  });
});
