import ora from "ora";

let currentSpinner = null;

/**
 * Start a spinner with a message
 * @param {string} message - The message to display
 * @returns {import('ora').Ora} The spinner instance
 */
export function startSpinner(message) {
  if (currentSpinner) {
    currentSpinner.stop();
  }
  currentSpinner = ora(message).start();
  return currentSpinner;
}

/**
 * Mark the current spinner as successful
 * @param {string} [message] - Optional success message
 */
export function succeedSpinner(message) {
  if (currentSpinner) {
    currentSpinner.succeed(message);
    currentSpinner = null;
  }
}

/**
 * Mark the current spinner as failed
 * @param {string} [message] - Optional failure message
 */
export function failSpinner(message) {
  if (currentSpinner) {
    currentSpinner.fail(message);
    currentSpinner = null;
  }
}

/**
 * Update the current spinner's text
 * @param {string} message - The new message
 */
export function updateSpinner(message) {
  if (currentSpinner) {
    currentSpinner.text = message;
  }
}

/**
 * Stop the spinner without a status
 */
export function stopSpinner() {
  if (currentSpinner) {
    currentSpinner.stop();
    currentSpinner = null;
  }
}
