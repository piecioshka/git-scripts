const path = require("node:path");
const process = require("node:process");

const {
  bold,
  gray,
  green,
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

// One line of `git diff --numstat` or `git log --numstat`. Binary files have
// `-` instead of the numbers.
function parseNumstatLine(line) {
  const [added, removed, ...rest] = line.split("\t");
  const binary = added === "-" && removed === "-";
  return {
    file: rest.join("\t"),
    binary,
    added: binary ? 0 : Number(added),
    removed: binary ? 0 : Number(removed),
  };
}

function isNumstatLine(line) {
  return /^(\d+|-)\t(\d+|-)\t/.test(line);
}

function sumLines(files) {
  return files.reduce(
    (sum, { added, removed }) => ({
      added: sum.added + added,
      removed: sum.removed + removed,
    }),
    { added: 0, removed: 0 },
  );
}

function plural(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

// `[+12 -3]` next to the name of a repository.
function formatLineLabel({ added, removed }) {
  return `[${green(`+${added}`)} ${red(`-${removed}`)}]`;
}

// The totals that end the summary, worded like `git diff --shortstat`.
function formatLineTotals({ files, added, removed }) {
  return [
    `${plural(files, "file")} changed`,
    `${plural(added, "insertion")}(+)`,
    `${plural(removed, "deletion")}(-)`,
  ];
}

// A status line on stderr, redrawn in place, naming the work that has not
// printed its result yet. It is drawn only on a terminal, and it is cut to the
// width of the terminal, because a wrapped line could not be erased.
function createProgressLine(stream = process.stderr) {
  const enabled = Boolean(stream.isTTY);
  let text = "";
  const draw = () => {
    if (!enabled || !text) return;
    const width = Math.max((stream.columns || 80) - 1, 1);
    const line = text.length > width ? `${text.slice(0, width - 1)}…` : text;
    stream.write(`\r\x1b[K${gray(italic(line))}`);
  };
  const erase = () => {
    if (enabled && text) stream.write("\r\x1b[K");
  };
  return {
    update(value) {
      erase();
      text = value;
      draw();
    },
    // Runs `print` with the line out of the way, then draws it again below.
    around(print) {
      erase();
      print();
      draw();
    },
  };
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
  parseNumstatLine,
  isNumstatLine,
  sumLines,
  plural,
  formatLineLabel,
  formatLineTotals,
  createProgressLine,
  quitOnClosedPipe,
};
