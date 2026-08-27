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
} = require("./__git");

const env = {
  ...process.env,
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
