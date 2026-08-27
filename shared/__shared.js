const exec = require("node:child_process").exec;

const DEBUG = process.env.DEBUG === "true" || process.env.DEBUG === "1";

function __print_command(command) {
  if (DEBUG) {
    console.log(`==> ${command}`);
  }
}

// Resolves with the trimmed stdout only. Warnings printed by Git to stderr
// must not leak into the output, because callers parse it (e.g. Number()).
// When the command fails, the error message carries both streams.
// The optional `env` is merged into the current environment.
function runCommand(command, { cwd = ".", env } = {}) {
  __print_command(command);
  const options = { cwd, env: env ? { ...process.env, ...env } : process.env };
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
        if (DEBUG) {
          console.debug("[error]", err);
        }
        const details = `${stdout}${stderr}`.trim();
        err.message = details
          ? `Command failed: ${command}\n${details}`
          : `Command failed: ${command}`;
        return reject(err);
      }
      resolve(stdout.trim());
    });
  });
}

const pad2Zeros = (value) => String(value).padStart(2, "0");
const pad5 = (value) => String(value).padStart(5);

function formatDate(date) {
  const year = date.getFullYear();
  const month = pad2Zeros(date.getMonth() + 1);
  const day = pad2Zeros(date.getDate());
  return `${year}-${month}-${day}`;
}

function sortBy(cb, ascending = true) {
  return (a, b) => {
    const valueA = cb(a);
    const valueB = cb(b);
    return ascending ? valueA - valueB : valueB - valueA;
  };
}

module.exports = {
  runCommand,
  pad2Zeros,
  pad5,
  formatDate,
  sortBy,
};
