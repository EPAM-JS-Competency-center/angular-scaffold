import { execOrFail } from "../helpers/index.js";
import { addStorybook } from "./index.js";

jest.mock("../helpers/index.js", () => ({
  __esModule: true,
  execOrFail: jest.fn(),
}));

describe("addStorybook", () => {
  it("should install Storybook", async () => {
    await addStorybook();

    expect(execOrFail).toHaveBeenCalledWith({
      cmd: "npx storybook@latest init --yes --no-dev",
      startMsg: "Installing Storybook",
      errorMsg: "Error during Storybook installation",
      endMsg: "Storybook installed",
    });
  });
});
