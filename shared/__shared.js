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

function getProcessOptions(argv) {
  const options = argv.filter((arg) => /^\-/.test(arg));
  return options.reduce((acc, option) => {
    const optionRaw = option.replace(/^\-*/, "");
    acc[optionRaw] = true;
    return acc;
  }, {});
}

const pad2Zeros = (value) => String(value).padStart(2, "0");
const pad5 = (value) => String(value).padStart(5);

function formatDate(date) {
  const year = date.getFullYear();
  const month = pad2Zeros(date.getMonth() + 1);
  const day = pad2Zeros(date.getDate());
  return `${year}-${month}-${day}`;
}

module.exports = {
  runCommand,
  getProcessOptions,
  pad2Zeros,
  pad5,
  formatDate,
};
