function toObject(text) {
  return text.split(",").reduce((env, pair) => {
    const [key, value] = pair.split("=");
    env[key] = value;
    return env;
  }, {});
}

function getProcessOptions(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const nextArg = argv[i + 1];

    if (arg === "--env") {
      options.env = toObject(nextArg);
    } else if (arg.startsWith("--")) {
      options[arg.slice(2)] = nextArg ?? true;
    }
  }
  return options;
}

module.exports = {
  getProcessOptions,
};
