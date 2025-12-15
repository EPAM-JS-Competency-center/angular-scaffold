import { addLefthook } from "./index.js";
import { execOrFail } from "../helpers/index.js";
import { writeFileSync } from "fs";
import { lefthookConfig } from "./config.js";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  execOrFail: jest.fn(),
}));

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

describe("addLefthook", () => {
  it("should write config and install lefthook", async () => {
    await addLefthook();

    expect(writeFileSync).toHaveBeenCalledWith("lefthook.yml", lefthookConfig);
    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npm install lefthook --save-dev",
      startMsg: "Installing Lefthook",
      errorMsg: "Failed to install Lefthook",
      endMsg: "Lefthook installed",
    });
  });
});
