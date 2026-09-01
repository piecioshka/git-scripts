const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execSync } = require("node:child_process");

const {
  getGitBranchName,
  getGitUpstream,
  isGitBareRepository,
  isGitRepository,
  isGitWorktree,
  isGitWorkingTree,
  isLocalOnlyGitRepository,
  isDirtyGitRepository,
  countGitDirtyFiles,
  getGitUnpushedState,
} = require("./__git");

const env = {
  ...process.env,
  // Isolate from the machine's git config: the setup below assumes the
  // default branch is "main", which is not true on a vanilla git install.
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_SYSTEM: "/dev/null",
  GIT_CONFIG_COUNT: "1",
  GIT_CONFIG_KEY_0: "init.defaultBranch",
  GIT_CONFIG_VALUE_0: "main",
  GIT_AUTHOR_NAME: "test",
  GIT_AUTHOR_EMAIL: "test@example.com",
  GIT_COMMITTER_NAME: "test",
  GIT_COMMITTER_EMAIL: "test@example.com",
};

function sh(command, cwd) {
  return execSync(command, { cwd, env, stdio: "pipe" }).toString().trim();
}

let root;
const dir = (name) => path.join(root, name);

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "git-scripts-test-"));
  sh("git init -q --bare remote.git", root);
  sh("git clone -q remote.git origin-repo 2>/dev/null", root);
  fs.writeFileSync(path.join(dir("origin-repo"), "a.txt"), "a\n");
  sh(
    "git add . && git commit -qm one && git push -q -u origin HEAD:main",
    dir("origin-repo"),
  );
  sh("git clone -q remote.git clean-repo", root);
  sh("git clone -q remote.git dirty-repo", root);
  fs.appendFileSync(path.join(dir("dirty-repo"), "a.txt"), "b\n");
  sh("git clone -q remote.git untracked-repo", root);
  fs.writeFileSync(path.join(dir("untracked-repo"), "new.txt"), "x\n");
  sh("git clone -q remote.git detached-repo", root);
  sh("git checkout -q --detach", dir("detached-repo"));
  sh("git clone -q remote.git no-upstream-repo", root);
  sh("git checkout -qb feature", dir("no-upstream-repo"));
  sh("git clone -q remote.git ahead-repo", root);
  sh(
    "git commit -q --allow-empty -m ahead-one && git commit -q --allow-empty -m ahead-two",
    dir("ahead-repo"),
  );
  sh("git clone -q remote.git never-pushed-repo", root);
  sh("git checkout -qb topic", dir("never-pushed-repo"));
  sh("git commit -q --allow-empty -m topic-one", dir("never-pushed-repo"));
  sh("git clone -q remote.git many-branches-repo", root);
  sh("git commit -q --allow-empty -m on-main", dir("many-branches-repo"));
  sh(
    "git checkout -qb second origin/main && git commit -q --allow-empty -m on-second",
    dir("many-branches-repo"),
  );
  sh(
    "git branch --set-upstream-to=origin/main second",
    dir("many-branches-repo"),
  );
  sh("git init -q local-repo", root);
  sh("git commit -q --allow-empty -m init", dir("local-repo"));
  sh("git worktree add -q ../worktree -b wt", dir("clean-repo"));
  fs.mkdirSync(dir("plain-dir"));
  fs.writeFileSync(dir("plain-file.txt"), "hi\n");
});

after(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("isGitRepository / isGitWorktree / isGitWorkingTree", () => {
  it("recognizes a regular repository", () => {
    assert.equal(isGitRepository(dir("clean-repo")), true);
    assert.equal(isGitWorktree(dir("clean-repo")), false);
    assert.equal(isGitWorkingTree(dir("clean-repo")), true);
  });

  it("recognizes a worktree", () => {
    assert.equal(isGitRepository(dir("worktree")), false);
    assert.equal(isGitWorktree(dir("worktree")), true);
    assert.equal(isGitWorkingTree(dir("worktree")), true);
  });

  it("rejects plain directories and files", () => {
    assert.equal(isGitWorkingTree(dir("plain-dir")), false);
    assert.equal(isGitWorkingTree(dir("plain-file.txt")), false);
    assert.equal(isGitWorkingTree(dir("missing")), false);
  });
});

describe("isGitBareRepository", () => {
  it("recognizes a bare repository only", () => {
    assert.equal(isGitBareRepository(dir("remote.git")), true);
    assert.equal(isGitBareRepository(dir("clean-repo")), false);
    assert.equal(isGitBareRepository(dir("plain-dir")), false);
  });
});

describe("getGitBranchName", () => {
  it("returns the current branch", async () => {
    assert.equal(await getGitBranchName(dir("clean-repo")), "main");
  });

  it("works inside a worktree", async () => {
    assert.equal(await getGitBranchName(dir("worktree")), "wt");
  });

  it("returns an empty string for a detached HEAD", async () => {
    assert.equal(await getGitBranchName(dir("detached-repo")), "");
  });

  it("returns false outside of a repository", async () => {
    assert.equal(await getGitBranchName(dir("plain-dir")), false);
  });
});

describe("getGitUpstream", () => {
  it("returns the tracking branch", async () => {
    assert.equal(await getGitUpstream(dir("clean-repo")), "origin/main");
  });

  it("returns null without a tracking branch", async () => {
    assert.equal(await getGitUpstream(dir("no-upstream-repo")), null);
    assert.equal(await getGitUpstream(dir("detached-repo")), null);
  });
});

describe("isLocalOnlyGitRepository", () => {
  it("is true for a repository without origin", async () => {
    assert.equal(await isLocalOnlyGitRepository(dir("local-repo")), true);
  });

  it("is false for a clone and for a worktree of a clone", async () => {
    assert.equal(await isLocalOnlyGitRepository(dir("clean-repo")), false);
    assert.equal(await isLocalOnlyGitRepository(dir("worktree")), false);
  });

  it("is false outside of a repository", async () => {
    assert.equal(await isLocalOnlyGitRepository(dir("plain-dir")), false);
  });
});

describe("isDirtyGitRepository", () => {
  it("is true for modified tracked files", async () => {
    assert.equal(await isDirtyGitRepository(dir("dirty-repo")), true);
  });

  it("ignores untracked files", async () => {
    assert.equal(await isDirtyGitRepository(dir("untracked-repo")), false);
  });

  it("is false for a clean repository", async () => {
    assert.equal(await isDirtyGitRepository(dir("clean-repo")), false);
  });

  it("checks worktrees too", async () => {
    assert.equal(await isDirtyGitRepository(dir("worktree")), false);
    fs.appendFileSync(path.join(dir("worktree"), "a.txt"), "z\n");
    assert.equal(await isDirtyGitRepository(dir("worktree")), true);
  });
});

describe("countGitDirtyFiles", () => {
  it("counts modified tracked files", async () => {
    assert.equal(await countGitDirtyFiles(dir("dirty-repo")), 1);
  });

  it("is zero for a clean repository and outside of one", async () => {
    assert.equal(await countGitDirtyFiles(dir("clean-repo")), 0);
    assert.equal(await countGitDirtyFiles(dir("plain-dir")), 0);
  });
});

describe("getGitUnpushedState", () => {
  it("counts commits ahead of the upstream", async () => {
    const state = await getGitUnpushedState(dir("ahead-repo"));
    assert.equal(state.aheadCommits, 2);
    assert.deepEqual(state.aheadBranches, ["main"]);
    assert.deepEqual(state.unpushedBranches, []);
  });

  it("reports branches that were never pushed", async () => {
    const state = await getGitUnpushedState(dir("never-pushed-repo"));
    assert.equal(state.aheadCommits, 0);
    assert.deepEqual(state.aheadBranches, []);
    assert.deepEqual(state.unpushedBranches, ["topic"]);
  });

  it("sums every branch, not only the checked out one", async () => {
    const state = await getGitUnpushedState(dir("many-branches-repo"));
    assert.equal(state.aheadCommits, 2);
    assert.deepEqual(state.aheadBranches.sort(), ["main", "second"]);
  });

  it("is empty for a repository in sync with its remote", async () => {
    const state = await getGitUnpushedState(dir("origin-repo"));
    assert.equal(state.aheadCommits, 0);
    assert.deepEqual(state.unpushedBranches, []);
  });

  it("is empty outside of a repository", async () => {
    const state = await getGitUnpushedState(dir("plain-dir"));
    assert.equal(state.aheadCommits, 0);
    assert.deepEqual(state.aheadBranches, []);
    assert.deepEqual(state.unpushedBranches, []);
  });
});
