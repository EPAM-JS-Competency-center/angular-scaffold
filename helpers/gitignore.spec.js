import { gitignore } from "./gitignore.js";
import { readFileSync, writeFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue(`node_modules`),
  writeFileSync: jest.fn(),
}));

describe("gitignore", function () {
  it("should add a new line", function () {
    gitignore(".eslintcache");

    expect(readFileSync).toBeCalledWith(".gitignore", "utf-8");
    expect(writeFileSync).toBeCalledWith(
      ".gitignore",
      `node_modules
.eslintcache
`
    );
  });
});
