import chalk from "chalk";
import { logEnd, logError, logStart } from "./log";

jest.mock("chalk", () => ({
  __esModule: true,
  default: {
    yellow: jest.fn().mockReturnValue("yellow"),
    green: jest.fn().mockReturnValue("green"),
    red: jest.fn().mockReturnValue("red"),
  },
}));

describe("logStart", () => {
  it("should log start message", () => {
    console.log = jest.fn();

    logStart("Test message");

    expect(chalk.yellow).toHaveBeenCalledWith("Test message");
    expect(console.log).toHaveBeenCalledWith("yellow");
  });
});

describe("logEnd", () => {
  it("should log end message", () => {
    console.log = jest.fn();

    logEnd("Test message 1");

    expect(chalk.green).toHaveBeenCalledWith("Test message 1");
    expect(console.log).toHaveBeenCalledWith("green");
  });
});

describe("logError", () => {
  it("should log error message", () => {
    console.log = jest.fn();

    logError("Test message 2");

    expect(chalk.red).toHaveBeenCalledWith("Test message 2");
    expect(console.log).toHaveBeenCalledWith("red");
  });
});
