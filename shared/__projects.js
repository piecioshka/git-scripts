const path = require("node:path");
const process = require("node:process");

const {
  bold,
  gray,
  italic,
  magenta,
  red,
  setColorsEnabled,
} = require("./__colors");

// The common output and options of the `git projects-*` scripts, so that
// every one of them prints a repository, an error and the summary the same way.

const DEFAULT_JOBS = 4;
const COLOR_MODES = ["auto", "always", "never"];

const COMMON_OPTIONS = `
        --color=WHEN    colors of the output: auto, always or never (default:
                        auto - only when printing to a terminal, unless
                        NO_COLOR is set)
        --jobs=N        number of repositories handled in parallel (default: ${DEFAULT_JOBS})`;

function parseJobs(arg) {
  const jobs = Number(arg.slice("--jobs=".length));
  if (!Number.isInteger(jobs) || jobs < 1) {
    throw new Error(`Invalid value for --jobs: ${arg}`);
  }
  return jobs;
}

function parseColor(arg) {
  const value = arg.slice("--color=".length);
  if (!COLOR_MODES.includes(value)) {
    throw new Error(`Invalid value for --color: ${arg}`);
  }
  return value;
}

function shouldColorize(mode, { isTTY, env } = {}) {
  if (mode === "auto") return Boolean(isTTY) && !env.NO_COLOR;
  return mode === "always";
}

// Parses `[path] [--color=WHEN] [--jobs=N] [--help]` and hands every other
// argument to `parseOption(arg, options)`, which returns true when it knew it.
function parseProjectsArgs(argv, { usage, defaults = {}, parseOption }) {
  const options = {
    color: "auto",
    jobs: DEFAULT_JOBS,
    workspacePath: null,
    ...defaults,
  };
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg.startsWith("--color=")) {
      options.color = parseColor(arg);
    } else if (arg.startsWith("--jobs=")) {
      options.jobs = parseJobs(arg);
    } else if (parseOption && parseOption(arg, options)) {
      continue;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}\n${usage}`);
    } else if (options.workspacePath === null) {
      options.workspacePath = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}\n${usage}`);
    }
  }
  return options;
}

// Turns the colors of this process on or off and returns the decision, so it
// can be passed on to the Git commands (`-c color.ui=always|never`).
function applyColorMode(mode) {
  const enabled = shouldColorize(mode, {
    isTTY: process.stdout.isTTY,
    env: process.env,
  });
  setColorsEnabled(enabled);
  return enabled;
}

// `[labels] name [branch] +Nms`: the first line of every repository.
function formatHeader({ labels = [], pathname, branchName, elapsedTime }) {
  const output = [...labels, bold(path.basename(pathname))];
  if (branchName) output.push(magenta(`[${branchName}]`));
  if (elapsedTime !== undefined) output.push(gray(italic(`+${elapsedTime}ms`)));
  return output.join(" ");
}

function formatError(pathname, error) {
  return `${red("[error]")} ${path.basename(pathname)}: ${error.message}`;
}

// The last line: the counts that are not empty, then the failures in red.
function formatSummary(parts, failures = 0) {
  const segments = parts.filter(Boolean).map((part) => gray(italic(part)));
  if (failures > 0) segments.push(red(`${failures} failed`));
  return segments.join(gray(italic(", ")));
}

// A pager or `head` closing the pipe early is not an error.
function quitOnClosedPipe() {
  process.stdout.on("error", (error) => {
    if (error.code === "EPIPE") process.exit(0);
    throw error;
  });
}

module.exports = {
  DEFAULT_JOBS,
  COMMON_OPTIONS,
  parseJobs,
  parseColor,
  shouldColorize,
  parseProjectsArgs,
  applyColorMode,
  formatHeader,
  formatError,
  formatSummary,
  quitOnClosedPipe,
};
