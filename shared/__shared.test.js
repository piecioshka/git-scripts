const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  runCommand,
  pad2Zeros,
  pad5,
  formatDate,
  sortBy,
} = require("./__shared");

describe("runCommand", () => {
  it("resolves with the trimmed stdout", async () => {
    assert.equal(await runCommand("printf '  out \\n'"), "out");
  });

  it("does not mix stderr into the output", async () => {
    assert.equal(await runCommand("echo out; echo warn >&2"), "out");
  });

  it("rejects with both streams when the command fails", async () => {
    await assert.rejects(
      runCommand("echo out; echo reason >&2; exit 3"),
      (error) =>
        error.code === 3 &&
        error.message.includes("out") &&
        error.message.includes("reason"),
    );
  });

  it("runs in the given directory", async () => {
    assert.equal(await runCommand("pwd", { cwd: "/" }), "/");
  });
});

describe("pad2Zeros / pad5", () => {
  it("pads numbers", () => {
    assert.equal(pad2Zeros(7), "07");
    assert.equal(pad2Zeros(12), "12");
    assert.equal(pad5(42), "   42");
  });
});

describe("formatDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    assert.equal(formatDate(new Date(2026, 0, 5)), "2026-01-05");
  });
});

describe("sortBy", () => {
  it("sorts ascending by default and descending on demand", () => {
    const items = [{ v: 3 }, { v: 1 }, { v: 2 }];
    const key = (item) => item.v;
    assert.deepEqual([...items].sort(sortBy(key)).map(key), [1, 2, 3]);
    assert.deepEqual([...items].sort(sortBy(key, false)).map(key), [3, 2, 1]);
  });
});
