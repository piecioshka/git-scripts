function red(string) {
  return `\x1b[31m${string}\x1b[0m`;
}

function green(string) {
  return `\x1b[32m${string}\x1b[0m`;
}

function yellow(string) {
  return `\x1b[33m${string}\x1b[0m`;
}

module.exports = {
  red,
  green,
  yellow,
};
