const { describe, it, afterEach, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

const { setColorsEnabled } = require("./__colors");
const {
  parseJobs,
  parseColor,
  shouldColorize,
  parseProjectsArgs,
  formatHeader,
  formatError,
  formatSummary,
  parseNumstatLine,
  isNumstatLine,
  sumLines,
  plural,
  formatLineTotals,
  applyColorMode,
  gitColorMode,
  formatCommandOutput,
  renderWorkingTreeLabels,
  renderUnpushedLabels,
  formatUnpushedBranches,
} = require("./__projects");

const usage = "usage";

describe("parseJobs", () => {
  it("reads a positive integer", () => {
    assert.equal(parseJobs("--jobs=8"), 8);
  });

  it("rejects zero and non-integers", () => {
    assert.throws(() => parseJobs("--jobs=0"), /Invalid value for --jobs/);
    assert.throws(() => parseJobs("--jobs=1.5"), /Invalid value for --jobs/);
  });
});

describe("parseColor", () => {
  it("accepts auto, always and never", () => {
    for (const mode of ["auto", "always", "never"]) {
      assert.equal(parseColor(`--color=${mode}`), mode);
    }
  });

  it("rejects other values", () => {
    assert.throws(() => parseColor("--color=yes"), /Invalid value for --color/);
  });
});

describe("shouldColorize", () => {
  it("colors a terminal in auto mode", () => {
    assert.equal(shouldColorize("auto", { isTTY: true, env: {} }), true);
  });

  it("does not color a pipe or NO_COLOR in auto mode", () => {
    assert.equal(shouldColorize("auto", { isTTY: false, env: {} }), false);
    const env = { NO_COLOR: "1" };
    assert.equal(shouldColorize("auto", { isTTY: true, env }), false);
  });

  it("follows always and never regardless of the terminal", () => {
    assert.equal(shouldColorize("always", { isTTY: false, env: {} }), true);
    assert.equal(shouldColorize("never", { isTTY: true, env: {} }), false);
  });
});

describe("parseProjectsArgs", () => {
  it("reads the path and the common options", () => {
    const options = parseProjectsArgs(["dir", "--jobs=2", "--color=never"], {
      usage,
    });
    assert.equal(options.workspacePath, "dir");
    assert.equal(options.jobs, 2);
    assert.equal(options.color, "never");
  });

  it("has defaults for every common option", () => {
    const options = parseProjectsArgs([], { usage });
    assert.deepEqual(options, { color: "auto", jobs: 4, workspacePath: null });
  });

  it("hands the other options to parseOption", () => {
    const options = parseProjectsArgs(["--verbose"], {
      usage,
      defaults: { verbose: false },
      parseOption(arg, parsed) {
        if (arg !== "--verbose") return false;
        parsed.verbose = true;
        return true;
      },
    });
    assert.equal(options.verbose, true);
  });

  it("rejects an unknown option and a second path", () => {
    assert.throws(
      () => parseProjectsArgs(["--nope"], { usage }),
      /Unknown option: --nope/,
    );
    assert.throws(
      () => parseProjectsArgs(["a", "b"], { usage }),
      /Unexpected argument: b/,
    );
  });

  it("marks --help instead of exiting", () => {
    assert.equal(parseProjectsArgs(["-h"], { usage }).help, true);
  });
});

describe("formatting without colors", () => {
  setColorsEnabled(false);
  afterEach(() => setColorsEnabled(false));

  it("prints the labels, the name, the branch and the time", () => {
    const header = formatHeader({
      labels: ["[dirty 1]", "[ahead 2]"],
      pathname: "/work/app",
      branchName: "main",
      elapsedTime: 12,
    });
    assert.equal(header, "[dirty 1] [ahead 2] app [main] +12ms");
  });

  it("leaves out a missing branch and time", () => {
    const header = formatHeader({ labels: ["[file]"], pathname: "/work/a.md" });
    assert.equal(header, "[file] a.md");
  });

  it("prints an error with the name of the entry", () => {
    const line = formatError("/work/app", new Error("boom"));
    assert.equal(line, "[error] app: boom");
  });

  it("joins the non-empty counts and appends the failures", () => {
    assert.equal(
      formatSummary(["1 pushed", false, "2 skipped"]),
      "1 pushed, 2 skipped",
    );
    assert.equal(formatSummary(["1 pushed"], 3), "1 pushed, 3 failed");
  });
});

describe("formatting with colors", () => {
  it("wraps the parts in escape codes", () => {
    setColorsEnabled(true);
    try {
      assert.match(formatSummary(["1 pushed"], 1), /\x1b\[31m1 failed/);
    } finally {
      setColorsEnabled(true);
    }
  });
});

describe("numstat", () => {
  it("parses the counts and the path of a text file", () => {
    assert.deepEqual(parseNumstatLine("12\t3\tsrc/a b.js"), {
      file: "src/a b.js",
      binary: false,
      added: 12,
      removed: 3,
    });
  });

  it("counts a binary file as zero lines", () => {
    assert.deepEqual(parseNumstatLine("-\t-\tlogo.png"), {
      file: "logo.png",
      binary: true,
      added: 0,
      removed: 0,
    });
  });

  it("recognizes numstat lines only", () => {
    assert.equal(isNumstatLine("1\t0\tfile"), true);
    assert.equal(isNumstatLine("-\t-\tfile"), true);
    assert.equal(isNumstatLine("commit 0123abc"), false);
    assert.equal(isNumstatLine(""), false);
  });

  it("sums the added and removed lines", () => {
    const files = [
      { added: 1, removed: 2 },
      { added: 10, removed: 0 },
    ];
    assert.deepEqual(sumLines(files), { added: 11, removed: 2 });
  });

  it("words the totals like git diff --shortstat", () => {
    assert.equal(plural(1, "file"), "1 file");
    assert.equal(plural(0, "file"), "0 files");
    assert.deepEqual(formatLineTotals({ files: 1, added: 2, removed: 1 }), [
      "1 file changed",
      "2 insertions(+)",
      "1 deletion(-)",
    ]);
  });
});

describe("renderWorkingTreeLabels", () => {
  beforeEach(() => setColorsEnabled(false));

  it("gives one label to what is not a working tree", () => {
    assert.deepEqual(renderWorkingTreeLabels({ isFile: true }), ["[file]"]);
    assert.deepEqual(renderWorkingTreeLabels({ isBareRepository: true }), [
      "[bare repo]",
    ]);
    assert.deepEqual(renderWorkingTreeLabels({ isWorkingTree: false }), [
      "[not repo]",
    ]);
  });

  it("lists the worktree, dirty and untracked labels of a working tree", () => {
    const descriptor = {
      isWorkingTree: true,
      isWorktree: true,
      dirtyFiles: 2,
      untrackedFiles: 1,
    };
    assert.deepEqual(renderWorkingTreeLabels(descriptor), [
      "[worktree]",
      "[dirty 2]",
      "[untracked 1]",
    ]);
  });

  it("gives no labels to a clean working tree", () => {
    const descriptor = {
      isWorkingTree: true,
      dirtyFiles: 0,
      untrackedFiles: 0,
    };
    assert.deepEqual(renderWorkingTreeLabels(descriptor), []);
  });
});

describe("renderUnpushedLabels", () => {
  beforeEach(() => setColorsEnabled(false));

  it("counts the branches only when more than one is ahead", () => {
    const one = {
      aheadCommits: 3,
      aheadBranches: ["main"],
      unpushedBranches: [],
    };
    assert.deepEqual(renderUnpushedLabels(one), ["[ahead 3]"]);
    const two = { ...one, aheadBranches: ["main", "dev"] };
    assert.deepEqual(renderUnpushedLabels(two), ["[ahead 3 in 2 branches]"]);
  });

  it("adds the branches that were never pushed", () => {
    const unpushed = {
      aheadCommits: 0,
      aheadBranches: [],
      unpushedBranches: ["topic"],
    };
    assert.deepEqual(renderUnpushedLabels(unpushed), ["[never pushed 1]"]);
  });
});

describe("formatUnpushedBranches", () => {
  beforeEach(() => setColorsEnabled(false));

  it("leaves out the current branch when it is the only one ahead", () => {
    const unpushed = { aheadBranches: ["main"], unpushedBranches: ["topic"] };
    assert.deepEqual(formatUnpushedBranches(unpushed, "main"), [
      "    never pushed: topic",
    ]);
  });

  it("lists every ahead branch when more than one is ahead", () => {
    const unpushed = { aheadBranches: ["main", "dev"], unpushedBranches: [] };
    assert.deepEqual(formatUnpushedBranches(unpushed, "main"), [
      "    ahead: main",
      "    ahead: dev",
    ]);
  });
});

describe("formatCommandOutput", () => {
  it("drops the `Command failed` line", () => {
    const error = new Error("Command failed: git push\nrejected\n");
    assert.equal(formatCommandOutput(error), "rejected");
  });
});

describe("gitColorMode", () => {
  it("follows applyColorMode", () => {
    applyColorMode("never");
    assert.equal(gitColorMode(), "never");
    applyColorMode("always");
    assert.equal(gitColorMode(), "always");
    setColorsEnabled(false);
  });
});
