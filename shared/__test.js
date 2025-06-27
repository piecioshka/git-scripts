const process = require("node:process");
const { green, red, yellow, gray } = require("./__colors");

function skip(title) {
  return `${yellow("-")} ${yellow(title)}`;
}

function describe(name, fn) {
  console.log(`${name}`);
  fn();
}

describe.skip = (name, fn) => console.log(skip(name));

function it(name, fn) {
  const start = process.hrtime();
  const logs = [];
  const errors = [];
  const previousConsoleLog = globalThis.console.log;
  globalThis.console.log = (...args) => logs.push(args.join(" "));
  const previousConsoleError = globalThis.console.error;
  globalThis.console.error = (...args) => errors.push(args.join(" "));
  fn();
  globalThis.console.log = previousConsoleLog;
  globalThis.console.error = previousConsoleError;
  const end = process.hrtime(start);
  const duration = (end[0] * 1e9 + end[1]) / 1e6; // Convert to milliseconds
  const icon = errors.length > 0 ? red("✗") : green("✓");
  console.log(`  ${icon} ${gray(name)} (${`${duration.toFixed(2)} ms`})`);
  logs.forEach((log) => console.log(log));
  errors.forEach((error) => console.error(error));
}

it.skip = (name, fn) => console.log(`  ${skip(name)}`);

function expect(value) {
  function handleFailed(expected) {
    console.error(`Expected: ${red(value)}`);
    console.error(`Received: ${green(expected)}`);
  }

  return {
    toEqual: (expected) => {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        handleFailed(expected);
      }
    },
    toBe: (expected) => {
      if (value !== expected) {
        handleFailed(expected);
      }
    },
  };
}

module.exports = {
  describe,
  it,
  expect,
};
