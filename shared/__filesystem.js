const fs = require("node:fs");

function isFile(pathname) {
  try {
    const stat = fs.statSync(pathname);
    return stat.isFile();
  } catch (_err) {
    return false;
  }
}

function isDirectory(pathname) {
  try {
    const stat = fs.statSync(pathname);
    return stat.isDirectory();
  } catch (_err) {
    return false;
  }
}

function isHidden(dirName) {
  return /^\.(.*)$/.test(dirName);
}

function getFilesAndDirectories(directoryPath) {
  return fs.readdirSync(directoryPath);
}

function getDirectories(directoryPath) {
  const directories = getFilesAndDirectories(directoryPath);
  return directories.filter((x) => !isHidden(x));
}

module.exports = {
  isFile,
  isDirectory,
  isHidden,
  getFilesAndDirectories,
  getDirectories,
};
