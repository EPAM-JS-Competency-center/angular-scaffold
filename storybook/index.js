import { execOrFail } from "../helpers/index.js";

export function addStorybook() {
  execOrFail({
    cmd: "npx storybook@latest init --yes --no-dev",
    startMsg: "Installing Storybook",
    errorMsg: "Error during Storybook installation",
    endMsg: "Storybook installed",
  });
}
