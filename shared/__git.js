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

async function isDirtyGitRepository(pathname) {
  if (!isGitWorkingTree(pathname)) return false;

  try {
    // Untracked files never block a fast-forward pull, so only tracked changes
    // make a repository dirty.
    const command =
      "git status --porcelain --untracked-files=no 2>/dev/null | wc -l";
    const output = await runCommand(command, { cwd: pathname });
    return Boolean(Number(output));
  } catch (error) {
    return false;
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
};
