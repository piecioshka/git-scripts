const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { getProcessOptions } = require("./__cli");

describe("getProcessOptions", () => {
  it("returns only the positional list when no arguments are provided", () => {
    assert.deepEqual(getProcessOptions([]), { _: [] });
  });

  it("reads a value from the next argument", () => {
    const options = getProcessOptions(["--cwd", "/custom/path"]);
    assert.equal(options.cwd, "/custom/path");
    assert.deepEqual(options._, []);
  });

  it("reads a value after the equals sign", () => {
    assert.equal(getProcessOptions(["--base=develop"]).base, "develop");
  });

  it("parses --env into an object", () => {
    const options = getProcessOptions([
      "--env",
      "NODE_ENV=production,PORT=3000",
    ]);
    assert.deepEqual(options.env, { NODE_ENV: "production", PORT: "3000" });
  });

  it("uses true when the value is not defined", () => {
    assert.equal(getProcessOptions(["--use-http"])["use-http"], true);
  });

  it("does not take another option as a value", () => {
    const options = getProcessOptions(["--oneline", "--base", "main"]);
    assert.equal(options.oneline, true);
    assert.equal(options.base, "main");
  });

  it("collects positional arguments", () => {
    const options = getProcessOptions(["first", "--flag", "second"]);
    assert.equal(options.flag, "second");
    assert.deepEqual(options._, ["first"]);
  });
});
