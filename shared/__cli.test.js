const { describe, it, expect } = require("./__test");
const { getProcessOptions } = require("./__cli");

describe("getProcessOptions", () => {
  it("should return empty object when no arguments are provided", () => {
    const options = getProcessOptions([]);
    expect(options).toEqual({});
  });

  it("should return options with custom cwd", () => {
    const options = getProcessOptions(["--cwd", "/custom/path"]);
    expect(options.cwd).toBe("/custom/path");
  });

  it("should return options with custom env variable", () => {
    const options = getProcessOptions(["--env", "NODE_ENV=production"]);
    expect(options.env.NODE_ENV).toBe("production");
  });

  it("should return options with true when value is not define", () => {
    const options = getProcessOptions(["--use-http"]);
    expect(options["use-http"]).toBe(true);
  });
});
