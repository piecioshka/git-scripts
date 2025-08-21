const path = require("node:path");

const { runCommand } = require("./__shared");
const { isDirectory } = require("./__filesystem");

function isGitRepository(pathname) {
  return isDirectory(path.resolve(pathname, ".git"));
}

async function getGitBranchName(pathname) {
  if (!isGitRepository(pathname)) return false;
  const command = "git branch --show-current";
  return await runCommand(command, { cwd: pathname });
}

async function getGitOrigin(pathname) {
  const command = "git config --get remote.origin.url";
  return await runCommand(command, { cwd: pathname });
}

async function isLocalGitRepository(pathname) {
  if (!isGitRepository(pathname)) return false;

  try {
    const output = await getGitOrigin(pathname);
    return output.length === 0;
  } catch (error) {
    return true;
  }
}

module.exports = {
  isGitRepository,
  getGitBranchName,
  getGitOrigin,
  isLocalGitRepository,
};
