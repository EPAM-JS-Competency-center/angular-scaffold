import { addLefthook } from "./index.js";
import { logEnd, logError, logStart } from "../helpers/index.js";
import { writeFileSync } from "fs";
import { lefthookConfig } from "./config.js";
import shelljs from "shelljs";

jest.mock("../helpers/index.js", () => ({
  logError: jest.fn(),
  logEnd: jest.fn(),
  logStart: jest.fn(),
}));

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("shelljs", () => ({
  __esModule: true,
  default: {
    exec: jest.fn().mockReturnValue({ code: 0 }),
    exit: jest.fn(),
  },
}));

describe("addLefthook", () => {
  it("should pass the flow", () => {
    addLefthook();

    expect(logStart).toHaveBeenCalledWith("Installing Lefthook");
    expect(writeFileSync).toHaveBeenCalledWith("lefthook.yml", lefthookConfig);
    expect(shelljs.exec).toHaveBeenCalledWith(
      "npm install lefthook --save-dev",
    );
    expect(logEnd).toHaveBeenCalledWith("Lefthook installed");
  });

  it("should exit on error", () => {
    jest.mocked(shelljs.exec).mockReturnValue({ code: 1 });
    addLefthook();

    expect(logError).toHaveBeenCalledWith("Failed to install Lefthook");
    expect(shelljs.exit).toHaveBeenCalledWith(1);
  });
});
