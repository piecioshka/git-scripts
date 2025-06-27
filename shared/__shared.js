const exec = require("node:child_process").exec;

function __print_command(command) {
  // console.log(`==> ${command}`);
}

function runCommand(command, { cwd } = { cwd: "." }) {
  __print_command(command);
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (err, stdout, stderr) => {
      if (err) {
        // console.debug('[error]', err);
        return reject(err);
      }
      resolve((stdout + stderr).trim().replace(/\n$/, ""));
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
