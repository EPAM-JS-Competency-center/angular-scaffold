import ora from "ora";
import {
  failSpinner,
  startSpinner,
  stopSpinner,
  succeedSpinner,
  updateSpinner,
} from "./spinner.js";

const mockSpinner = {
  start: jest.fn().mockReturnThis(),
  stop: jest.fn(),
  succeed: jest.fn(),
  fail: jest.fn(),
  text: "",
};

jest.mock("ora", () => ({
  __esModule: true,
  default: jest.fn(() => mockSpinner),
}));

describe("spinner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSpinner.text = "";
    // Reset the internal currentSpinner state by stopping any active spinner
    stopSpinner();
  });

  describe("startSpinner", () => {
    it("should create and start a new spinner", () => {
      const result = startSpinner("Loading...");

      expect(ora).toHaveBeenCalledWith("Loading...");
      expect(mockSpinner.start).toHaveBeenCalled();
      expect(result).toBe(mockSpinner);
    });

    it("should stop existing spinner before starting new one", () => {
      startSpinner("First");
      jest.clearAllMocks();

      startSpinner("Second");

      expect(mockSpinner.stop).toHaveBeenCalled();
      expect(ora).toHaveBeenCalledWith("Second");
    });
  });

  describe("succeedSpinner", () => {
    it("should mark spinner as successful with message", () => {
      startSpinner("Loading...");
      jest.clearAllMocks();

      succeedSpinner("Done!");

      expect(mockSpinner.succeed).toHaveBeenCalledWith("Done!");
    });

    it("should do nothing if no spinner is active", () => {
      succeedSpinner("Done!");

      expect(mockSpinner.succeed).not.toHaveBeenCalled();
    });
  });

  describe("failSpinner", () => {
    it("should mark spinner as failed with message", () => {
      startSpinner("Loading...");
      jest.clearAllMocks();

      failSpinner("Error!");

      expect(mockSpinner.fail).toHaveBeenCalledWith("Error!");
    });

    it("should do nothing if no spinner is active", () => {
      failSpinner("Error!");

      expect(mockSpinner.fail).not.toHaveBeenCalled();
    });
  });

  describe("updateSpinner", () => {
    it("should update spinner text", () => {
      startSpinner("Loading...");

      updateSpinner("Still loading...");

      expect(mockSpinner.text).toBe("Still loading...");
    });

    it("should do nothing if no spinner is active", () => {
      updateSpinner("New text");

      expect(mockSpinner.text).toBe("");
    });
  });

  describe("stopSpinner", () => {
    it("should stop the spinner", () => {
      startSpinner("Loading...");
      jest.clearAllMocks();

      stopSpinner();

      expect(mockSpinner.stop).toHaveBeenCalled();
    });

    it("should do nothing if no spinner is active", () => {
      stopSpinner();

      expect(mockSpinner.stop).not.toHaveBeenCalled();
    });
  });
});
