function toObject(text) {
  return text.split(",").reduce((env, pair) => {
    const [key, value] = pair.split("=");
    env[key] = value;
    return env;
  }, {});
}

// Parses `--key`, `--key=value` and `--key value` options. A value is taken
// from the next argument only when it is not an option itself, so
// `--oneline --base main` gives { oneline: true, base: "main" }.
// Arguments that are not options are collected in the `_` list.
function getProcessOptions(argv) {
  const options = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith("--")) {
      options._.push(arg);
      continue;
    }

    let key = arg.slice(2);
    let value = true;
    const separator = key.indexOf("=");

    if (separator !== -1) {
      value = key.slice(separator + 1);
      key = key.slice(0, separator);
    } else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("-")) {
      value = argv[i + 1];
      i += 1;
    }

    options[key] =
      key === "env" && typeof value === "string" ? toObject(value) : value;
  }
  return options;
}

module.exports = {
  getProcessOptions,
};
