const path = require("node:path");

const { runCommand } = require("./__shared");
const { isDirectory } = require("./__filesystem");

async function getGitBranchName(pathname) {
  if (!isGitRepository(pathname)) return false;
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

function isGitRepository(pathname) {
  return isDirectory(path.resolve(pathname, ".git"));
}

async function isLocalOnlyGitRepository(pathname) {
  if (!isGitRepository(pathname)) return false;

  try {
    const output = await getGitOrigin(pathname);
    return output.length === 0;
  } catch (error) {
    return true;
  }
}

async function isDirtyGitRepository(pathname) {
  if (!isGitRepository(pathname)) return false;

  try {
    const command = "git status --porcelain 2>/dev/null | wc -l";
    const output = await runCommand(command, { cwd: pathname });
    return Boolean(Number(output));
  } catch (error) {
    return false;
  }
}

module.exports = {
  getGitBranchName,
  getGitOrigin,
  isGitRepository,
  isLocalOnlyGitRepository,
  isDirtyGitRepository,
};
