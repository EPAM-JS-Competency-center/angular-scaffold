import { execFileSync } from "child_process";
import { createInterface } from "readline";
import {
  ANGULAR_CLI_MAJOR_VERSION,
  askUser,
  ensureAngularCliVersion,
  getMajorVersion,
  parseAngularCliVersion,
} from "./angular-cli";
import { logEnd, logError, logStart } from "./log";

jest.mock("child_process", () => ({
  __esModule: true,
  execFileSync: jest.fn(),
}));

jest.mock("readline", () => ({
  __esModule: true,
  createInterface: jest.fn(),
}));

jest.mock("./log", () => ({
  __esModule: true,
  logStart: jest.fn(),
  logError: jest.fn(),
  logEnd: jest.fn(),
}));

describe("ANGULAR_CLI_MAJOR_VERSION", () => {
  it("should be defined as a string", () => {
    expect(typeof ANGULAR_CLI_MAJOR_VERSION).toBe("string");
    expect(ANGULAR_CLI_MAJOR_VERSION).toBe("21");
  });
});

describe("parseAngularCliVersion", () => {
  it("should parse Angular CLI version from ng version output", () => {
    const output = `
     _                      _                 ____ _     ___
    / \\   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \\ | '_ \\ / _\` | | | | |/ _\` | '__|   | |   | |    | |
  / ___ \\| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \\_\\_| |_|\\__, |\\__,_|_|\\__,_|_|       \\____|_____|___|
                |___/


Angular CLI: 21.0.1
Node: 20.10.0
Package Manager: npm 10.9.4
OS: darwin arm64

Angular:
...
    `;

    const result = parseAngularCliVersion(output);
    expect(result).toBe("21.0.1");
  });

  it("should return null if version is not found", () => {
    const output = "Some random output without version";
    const result = parseAngularCliVersion(output);
    expect(result).toBeNull();
  });

  it("should handle different version formats", () => {
    const output = "Angular CLI: 17.2.3";
    const result = parseAngularCliVersion(output);
    expect(result).toBe("17.2.3");
  });
});

describe("getMajorVersion", () => {
  it("should extract major version from semver string", () => {
    expect(getMajorVersion("21.0.1")).toBe("21");
    expect(getMajorVersion("17.2.3")).toBe("17");
    expect(getMajorVersion("18.0.0")).toBe("18");
  });

  it("should handle single digit versions", () => {
    expect(getMajorVersion("1.0.0")).toBe("1");
  });

  it("should handle multi-digit versions", () => {
    expect(getMajorVersion("100.200.300")).toBe("100");
  });
});

describe("askUser", () => {
  let mockRl;

  beforeEach(() => {
    mockRl = {
      question: jest.fn(),
      close: jest.fn(),
    };
    createInterface.mockReturnValue(mockRl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true for 'y' answer", async () => {
    mockRl.question.mockImplementation((question, callback) => {
      callback("y");
    });

    const result = await askUser("Test question?");
    expect(result).toBe(true);
    expect(mockRl.close).toHaveBeenCalled();
  });

  it("should return true for 'yes' answer", async () => {
    mockRl.question.mockImplementation((question, callback) => {
      callback("yes");
    });

    const result = await askUser("Test question?");
    expect(result).toBe(true);
  });

  it("should return true for 'YES' answer (case insensitive)", async () => {
    mockRl.question.mockImplementation((question, callback) => {
      callback("YES");
    });

    const result = await askUser("Test question?");
    expect(result).toBe(true);
  });

  it("should return false for 'n' answer", async () => {
    mockRl.question.mockImplementation((question, callback) => {
      callback("n");
    });

    const result = await askUser("Test question?");
    expect(result).toBe(false);
  });

  it("should return false for any other answer", async () => {
    mockRl.question.mockImplementation((question, callback) => {
      callback("maybe");
    });

    const result = await askUser("Test question?");
    expect(result).toBe(false);
  });
});

describe("ensureAngularCliVersion", () => {
  const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
  const mockConsoleLog = jest
    .spyOn(console, "log")
    .mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleLog.mockRestore();
  });

  it("should proceed when no global Angular CLI is installed", async () => {
    execFileSync.mockImplementation(() => {
      throw new Error("ng command not found");
    });

    await ensureAngularCliVersion();

    expect(logStart).toHaveBeenCalledWith("Checking Angular CLI version...");
    expect(logEnd).toHaveBeenCalledWith(
      "No global Angular CLI found, will use npx",
    );
  });

  it("should proceed when version cannot be parsed", async () => {
    execFileSync.mockReturnValue("Invalid output");

    await ensureAngularCliVersion();

    expect(logStart).toHaveBeenCalledWith("Checking Angular CLI version...");
    expect(logEnd).toHaveBeenCalledWith(
      "Could not determine Angular CLI version, proceeding with npx",
    );
  });

  it("should proceed when version matches", async () => {
    execFileSync.mockReturnValue("Angular CLI: 21.0.1");

    await ensureAngularCliVersion();

    expect(logStart).toHaveBeenCalledWith("Checking Angular CLI version...");
    expect(logEnd).toHaveBeenCalledWith(
      "Angular CLI version 21.0.1 is compatible",
    );
  });

  it("should update global CLI when user accepts", async () => {
    execFileSync
      .mockReturnValueOnce("Angular CLI: 17.2.3") // First call for version check
      .mockReturnValueOnce(undefined); // Second call for npm install

    const mockRl = {
      question: jest.fn((question, callback) => callback("y")),
      close: jest.fn(),
    };
    createInterface.mockReturnValue(mockRl);

    await ensureAngularCliVersion();

    expect(logStart).toHaveBeenCalledWith("Checking Angular CLI version...");
    expect(logError).toHaveBeenCalledWith("Version mismatch detected!");
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "  Current global Angular CLI: v17.2.3",
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "  Required major version: v21.x.x",
    );
    expect(logStart).toHaveBeenCalledWith(
      "Updating global Angular CLI to v21...",
    );
    expect(execFileSync).toHaveBeenCalledWith(
      "npm",
      ["install", "-g", "@angular/cli@21"],
      { stdio: "inherit" },
    );
    expect(logEnd).toHaveBeenCalledWith(
      "Global Angular CLI updated successfully",
    );
  });

  it("should exit when update fails", async () => {
    execFileSync
      .mockReturnValueOnce("Angular CLI: 17.2.3")
      .mockImplementationOnce(() => {
        throw new Error("npm install failed");
      });

    const mockRl = {
      question: jest.fn((question, callback) => callback("yes")),
      close: jest.fn(),
    };
    createInterface.mockReturnValue(mockRl);

    await ensureAngularCliVersion();

    expect(logError).toHaveBeenCalledWith(
      "Failed to update global Angular CLI",
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should exit when user declines update", async () => {
    execFileSync.mockReturnValue("Angular CLI: 17.2.3");

    const mockRl = {
      question: jest.fn((question, callback) => callback("n")),
      close: jest.fn(),
    };
    createInterface.mockReturnValue(mockRl);

    await ensureAngularCliVersion();

    expect(logError).toHaveBeenCalledWith("Version mismatch detected!");
    expect(logError).toHaveBeenCalledWith(
      "Cannot proceed with a different Angular CLI version.",
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "Running with a mismatched version is not guaranteed to work.",
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "  1. Update global CLI:  npm install -g @angular/cli@21",
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "  2. Remove global CLI:  npm uninstall -g @angular/cli",
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should accept any 21.x.x version", async () => {
    execFileSync.mockReturnValue("Angular CLI: 21.5.10");

    await ensureAngularCliVersion();

    expect(logEnd).toHaveBeenCalledWith(
      "Angular CLI version 21.5.10 is compatible",
    );
  });
});
