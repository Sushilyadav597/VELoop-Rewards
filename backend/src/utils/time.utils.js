/**
 * Time Utilities with Virtual Server Clock Support
 * Allows simulated time progression for testing streak cooldowns & missed days.
 */

let virtualTimeOffsetMs = 0;

/**
 * Get the authoritative server time (including any virtual simulation offset)
 */
const getServerTime = () => {
  return new Date(Date.now() + virtualTimeOffsetMs);
};

/**
 * Advance virtual server time by given milliseconds (for evaluator testing)
 */
const advanceServerTimeMs = (ms) => {
  virtualTimeOffsetMs += ms;
  return getServerTime();
};

/**
 * Reset virtual server time back to actual system time
 */
const resetVirtualServerTime = () => {
  virtualTimeOffsetMs = 0;
  return getServerTime();
};

const getVirtualTimeOffsetMs = () => virtualTimeOffsetMs;

module.exports = {
  getServerTime,
  advanceServerTimeMs,
  resetVirtualServerTime,
  getVirtualTimeOffsetMs
};
