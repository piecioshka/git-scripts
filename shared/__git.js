const path = require("node:path");

const { runCommand } = require("./__shared");
const { isDirectory } = require("./__filesystem");

function isGitRepository(pathname) {
  return isDirectory(path.resolve(pathname, ".git"));
}

async function getGitBranchName(pathname) {
  if (!isGitRepository(pathname)) {
    return false;
  }

  return runCommand("git branch --show-current", { cwd: pathname });
}

module.exports = {
  isGitRepository,
  getGitBranchName,
};
