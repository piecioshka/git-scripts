const fs = require('fs');
const fsPromise = require('node:fs/promises');
const path = require('path');
const exec = require('child_process').exec;

function runCommand(command, { verbose } = { verbose: false }) {
  if (verbose) {
    console.log(`[x] Run: ${command}`);
  }
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err || stderr) {
        // console.debug('[error]', err || stderr);
        return void reject(err || stderr);
      }
      resolve(stdout.replace(/\n$/, ''));
    });
  });
}

const isOption = (arg) => /^\-/.test(arg);

function getProcessOptions(argv) {
  const options = argv.filter((arg) => isOption(arg));
  return options.reduce((acc, option) => {
    const optionRaw = option.replace(/^\-*/, '');
    acc[optionRaw] = true;
    return acc;
  }, {});
}

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

function isGitRepository(pathname) {
  return isDirectory(path.resolve(pathname, '.git'));
}

const pad2Zeros = (value) => String(value).padStart(2, '0');
const pad5 = (value) => String(value).padStart(5);

function isHidden(dirName) {
  return /^\.(.*)$/.test(dirName);
}

function getFilesAndDirectories(directoryPath) {
  return fsPromise.readdir(directoryPath);
}

async function getDirectories(directoryPath) {
  const directories = await getFilesAndDirectories(directoryPath);
  return directories.filter((x) => !isHidden(x));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = pad2Zeros(date.getMonth() + 1);
  const day = pad2Zeros(date.getDate());
  return `${year}-${month}-${day}`;
}

module.exports = {
  runCommand,
  getProcessOptions,
  isFile,
  isDirectory,
  isGitRepository,
  isHidden,
  pad2Zeros,
  pad5,
  getFilesAndDirectories,
  getDirectories,
  formatDate,
};
