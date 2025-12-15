import { execOrFail } from "../helpers/index.js";

export async function addStorybook() {
  await execOrFail({
    cmd: "npx storybook@latest init --yes --no-dev",
    startMsg: "Installing Storybook",
    errorMsg: "Error during Storybook installation",
    endMsg: "Storybook installed",
  });
}
