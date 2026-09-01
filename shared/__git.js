const path = require("node:path");

const { runCommand } = require("./__shared");
const { isFile, isDirectory } = require("./__filesystem");

function isGitWorktree(pathname) {
  return (
    isFile(path.resolve(pathname, ".git")) &&
    !isDirectory(path.resolve(pathname, ".git"))
  );
}

function isGitRepository(pathname) {
  return isDirectory(path.resolve(pathname, ".git"));
}

function isGitWorkingTree(pathname) {
  return isGitRepository(pathname) || isGitWorktree(pathname);
}

function isGitBareRepository(pathname) {
  return (
    isFile(path.resolve(pathname, "HEAD")) &&
    isDirectory(path.resolve(pathname, "objects")) &&
    isDirectory(path.resolve(pathname, "refs"))
  );
}

async function getGitBranchName(pathname) {
  if (!isGitWorkingTree(pathname)) return false;
  const command = "git branch --show-current";
  try {
    return await runCommand(command, { cwd: pathname });
  } catch (error) {
    return null;
  }
}

async function getGitOrigin(pathname) {
  const command = "git config --get remote.origin.url";
  try {
    return await runCommand(command, { cwd: pathname });
  } catch (error) {
    return null;
  }
}

async function getGitUpstream(pathname) {
  const command = "git rev-parse --abbrev-ref --symbolic-full-name @{u}";
  try {
    return await runCommand(command, { cwd: pathname });
  } catch (error) {
    return null;
  }
}

async function isLocalOnlyGitRepository(pathname) {
  if (!isGitWorkingTree(pathname)) return false;

  const output = await getGitOrigin(pathname);
  return output === null || output.length === 0;
}

async function countGitDirtyFiles(pathname) {
  if (!isGitWorkingTree(pathname)) return 0;

  try {
    // Untracked files never block a fast-forward pull, so only tracked changes
    // make a repository dirty.
    const command =
      "git status --porcelain --untracked-files=no 2>/dev/null | wc -l";
    const output = await runCommand(command, { cwd: pathname });
    return Number(output) || 0;
  } catch (error) {
    return 0;
  }
}

async function isDirtyGitRepository(pathname) {
  return (await countGitDirtyFiles(pathname)) > 0;
}

// Every local branch that carries work missing from the remote: either commits
// ahead of its upstream, or no upstream at all (never pushed). Both are read
// from the refs already present locally, so this makes no network request --
// the numbers describe the last known state of the remote.
async function getGitUnpushedState(pathname) {
  const empty = { aheadCommits: 0, aheadBranches: [], unpushedBranches: [] };
  if (!isGitWorkingTree(pathname)) return empty;

  const format = "%(refname:short)%09%(upstream:short)";
  const command = `git for-each-ref --format='${format}' refs/heads`;
  let output;
  try {
    output = await runCommand(command, { cwd: pathname });
  } catch (error) {
    return empty;
  }

  const result = { aheadCommits: 0, aheadBranches: [], unpushedBranches: [] };
  for (const line of output.split("\n")) {
    if (!line.trim()) continue;
    const [branch, upstream] = line.split("\t");
    if (!upstream) {
      result.unpushedBranches.push(branch);
      continue;
    }
    const ahead = await getGitAheadCount(pathname, branch);
    if (ahead > 0) {
      result.aheadCommits += ahead;
      result.aheadBranches.push(branch);
    }
  }
  return result;
}

// The local tags that origin does not have yet. `--dry-run` asks git what a
// real `push --tags` would do, so the answer covers exactly the tags that
// would travel, without creating anything on the remote.
async function countGitUnpushedTags(pathname) {
  if (!isGitWorkingTree(pathname)) return 0;
  const command = "LC_ALL=C git push --tags --dry-run --porcelain origin";
  let output;
  try {
    output = await runCommand(command, { cwd: pathname });
  } catch (error) {
    // No origin, no network, a rejected ref: the push itself reports those,
    // so here an unknown state counts as nothing to push.
    return 0;
  }
  // The porcelain format lists one line per ref, prefixed with the status:
  // "*" for a new ref, "=" for one that is already up to date.
  return output
    .split("\n")
    .filter((line) => line.startsWith("*") && line.includes("refs/tags/"))
    .length;
}

async function getGitAheadCount(pathname, branch) {
  // The branch name comes from git itself, but it still travels through a
  // shell, so quote it: refs may contain characters the shell would expand.
  const ref = `'${branch.replace(/'/g, "'\\''")}'`;
  const command = `git rev-list --count ${ref}@{u}..${ref}`;
  try {
    return Number(await runCommand(command, { cwd: pathname })) || 0;
  } catch (error) {
    return 0;
  }
}

module.exports = {
  getGitBranchName,
  getGitOrigin,
  getGitUpstream,
  isGitBareRepository,
  isGitRepository,
  isGitWorktree,
  isGitWorkingTree,
  isLocalOnlyGitRepository,
  isDirtyGitRepository,
  countGitDirtyFiles,
  getGitUnpushedState,
  countGitUnpushedTags,
};
