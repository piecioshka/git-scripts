const path = require("node:path");
const process = require("node:process");

const { getAheadBranchesToList } = require("./__git");
const {
  blue,
  bold,
  brightYellow,
  brown,
  cyan,
  dimGray,
  gray,
  green,
  italic,
  magenta,
  red,
  setColorsEnabled,
  yellow,
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

let colorsEnabled = true;

// Turns the colors of this process on or off and returns the decision, so it
// can be passed on to the Git commands (`-c color.ui=always|never`).
function applyColorMode(mode) {
  colorsEnabled = shouldColorize(mode, {
    isTTY: process.stdout.isTTY,
    env: process.env,
  });
  setColorsEnabled(colorsEnabled);
  return colorsEnabled;
}

// The value of `-c color.ui=...` for a Git command, which writes to a pipe and
// would otherwise drop its colors.
function gitColorMode() {
  return colorsEnabled ? "always" : "never";
}

// The output of a failed command without the `Command failed: ...` line that
// `runCommand` puts in front of it.
function formatCommandOutput(error) {
  return String(error.message)
    .replace(/^Command failed: .*\n?/, "")
    .trim();
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

// The labels every repository starts with. What is not a working tree gets
// one label that says what it is, and nothing else applies to it.
function renderWorkingTreeLabels(descriptor) {
  if (descriptor.isFile) return [blue("[file]")];
  if (descriptor.isBareRepository) return [dimGray("[bare repo]")];
  if (!descriptor.isWorkingTree) return [brown("[not repo]")];
  const labels = [];
  if (descriptor.isWorktree) labels.push(dimGray(italic("[worktree]")));
  if (descriptor.dirtyFiles > 0) {
    labels.push(red(`[dirty ${descriptor.dirtyFiles}]`));
  }
  if (descriptor.untrackedFiles > 0) {
    labels.push(cyan(`[untracked ${descriptor.untrackedFiles}]`));
  }
  return labels;
}

// `[ahead N in M branches] [never pushed N]` from `getGitUnpushedState`.
function renderUnpushedLabels({
  aheadCommits,
  aheadBranches,
  unpushedBranches,
}) {
  const labels = [];
  if (aheadCommits > 0) {
    const branches =
      aheadBranches.length > 1 ? ` in ${aheadBranches.length} branches` : "";
    labels.push(brightYellow(`[ahead ${aheadCommits}${branches}]`));
  }
  if (unpushedBranches.length > 0) {
    labels.push(yellow(`[never pushed ${unpushedBranches.length}]`));
  }
  return labels;
}

// The lines below a repository that name its unpushed branches. The current
// branch is left out when it is the only one ahead: the header names it.
function formatUnpushedBranches(unpushed, currentBranch) {
  const ahead = getAheadBranchesToList(unpushed.aheadBranches, currentBranch);
  return [
    ...ahead.map((branch) => gray(`    ahead: ${branch}`)),
    ...unpushed.unpushedBranches.map((branch) =>
      gray(`    never pushed: ${branch}`),
    ),
  ];
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
  gitColorMode,
  formatCommandOutput,
  renderWorkingTreeLabels,
  renderUnpushedLabels,
  formatUnpushedBranches,
  formatHeader,
  formatError,
  formatSummary,
  parseNumstatLine,
  isNumstatLine,
  sumLines,
  plural,
  formatLineLabel,
  formatLineTotals,
  quitOnClosedPipe,
};
