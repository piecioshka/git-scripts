const exec = require("child_process").exec;

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err || stderr || stdout.length === 0) {
        return void reject(err);
      }
      resolve(stdout);
    });
  });
}

const isOption = (arg) => /^\-/.test(arg);

function getProcessOptions(argv) {
  const options = argv.filter((arg) => isOption(arg));
  return options.reduce((acc, option) => {
    const optionRaw = option.replace(/^\-*/, "");
    acc[optionRaw] = true;
    return acc;
  }, {});
}

module.exports = {
  runCommand,
  getProcessOptions,
};
