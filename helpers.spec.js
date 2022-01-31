import { logStart } from "./helpers";

// TODO fix error during tests start

describe("logStart", () => {
  it("should log message", () => {
    console.log = jest.fn();

    logStart("Test message");

    expect(console.log).toHaveBeenCalledWith("test");
  });
});
