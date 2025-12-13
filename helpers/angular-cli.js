import { execFileSync } from "child_process";
import { createInterface } from "readline";
import { logEnd, logError, logStart } from "./log.js";

export const ANGULAR_CLI_MAJOR_VERSION = "21";

/**
 * Parses Angular CLI version from `ng version` output
 * @param {string} output - The output from `ng version`
 * @returns {string|null} - The version string or null if not found
 */
export function parseAngularCliVersion(output) {
  const match = output.match(/Angular CLI:\s*(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Gets the major version from a semver string
 * @param {string} version - The version string (e.g., "21.0.1")
 * @returns {string} - The major version (e.g., "21")
 */
export function getMajorVersion(version) {
  return version.split(".")[0];
}

/**
 * Prompts the user with a yes/no question
 * @param {string} question - The question to ask
 * @returns {Promise<boolean>} - True if user answers yes
 */
export function askUser(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Checks Angular CLI version and handles version mismatch
 * @returns {Promise<void>}
 */
export async function ensureAngularCliVersion() {
  logStart("Checking Angular CLI version...");

  let versionOutput;
  try {
    versionOutput = execFileSync("ng", ["version"], {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    // ng not installed globally, which is fine - npx will handle it
    logEnd("No global Angular CLI found, will use npx");
    return;
  }

  const currentVersion = parseAngularCliVersion(versionOutput);
  if (!currentVersion) {
    logEnd("Could not determine Angular CLI version, proceeding with npx");
    return;
  }

  const currentMajor = getMajorVersion(currentVersion);
  if (currentMajor === ANGULAR_CLI_MAJOR_VERSION) {
    logEnd(`Angular CLI version ${currentVersion} is compatible`);
    return;
  }

  // Version mismatch detected
  console.log("");
  logError(`Version mismatch detected!`);
  console.log(`  Current global Angular CLI: v${currentVersion}`);
  console.log(`  Required major version: v${ANGULAR_CLI_MAJOR_VERSION}.x.x`);
  console.log("");

  const shouldUpdate = await askUser(
    `Do you want to update your global Angular CLI to v${ANGULAR_CLI_MAJOR_VERSION}? (y/n) `,
  );

  if (shouldUpdate) {
    logStart(`Updating global Angular CLI to v${ANGULAR_CLI_MAJOR_VERSION}...`);
    try {
      execFileSync(
        "npm",
        ["install", "-g", `@angular/cli@${ANGULAR_CLI_MAJOR_VERSION}`],
        { stdio: "inherit" },
      );
      logEnd("Global Angular CLI updated successfully");
    } catch {
      logError("Failed to update global Angular CLI");
      process.exit(1);
    }
  } else {
    console.log("");
    logError("Cannot proceed with a different Angular CLI version.");
    console.log("Running with a mismatched version is not guaranteed to work.");
    console.log("");
    console.log("Please choose one of the following options:");
    console.log(
      `  1. Update global CLI:  npm install -g @angular/cli@${ANGULAR_CLI_MAJOR_VERSION}`,
    );
    console.log(`  2. Remove global CLI:  npm uninstall -g @angular/cli`);
    console.log("");
    process.exit(1);
  }
}
