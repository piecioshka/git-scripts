const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { mapInOrder, mapAsCompleted } = require("./__workspace");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("mapInOrder", () => {
  it("reports results in the order of the items, not of completion", async () => {
    const order = [];
    await mapInOrder(
      [30, 10, 20, 0],
      4,
      async (ms) => {
        await delay(ms);
        return ms;
      },
      (item, { value }) => order.push(value),
    );
    assert.deepEqual(order, [30, 10, 20, 0]);
  });

  it("never runs more than `jobs` tasks at a time", async () => {
    let running = 0;
    let peak = 0;
    await mapInOrder(
      [1, 2, 3, 4, 5, 6],
      2,
      async () => {
        running += 1;
        peak = Math.max(peak, running);
        await delay(5);
        running -= 1;
      },
      () => {},
    );
    assert.equal(peak, 2);
  });

  it("passes a thrown error to onResult and keeps going", async () => {
    const seen = [];
    await mapInOrder(
      ["a", "b", "c"],
      1,
      (item) => {
        if (item === "b") throw new Error("boom");
        return item.toUpperCase();
      },
      (item, result) =>
        seen.push(result.error ? result.error.message : result.value),
    );
    assert.deepEqual(seen, ["A", "boom", "C"]);
  });

  it("does nothing for an empty list", async () => {
    let calls = 0;
    await mapInOrder(
      [],
      4,
      () => {},
      () => (calls += 1),
    );
    assert.equal(calls, 0);
  });
});

describe("mapAsCompleted", () => {
  const delay = (ms, value) =>
    new Promise((resolve) => setTimeout(() => resolve(value), ms));

  it("reports results in the order of completion", async () => {
    const seen = [];
    await mapAsCompleted(
      [30, 10, 20],
      3,
      (ms) => delay(ms, ms),
      (item, { value }) => seen.push(value),
    );
    assert.deepEqual(seen, [10, 20, 30]);
  });

  it("never runs more than `jobs` tasks at a time", async () => {
    let running = 0;
    let peak = 0;
    await mapAsCompleted(
      [1, 2, 3, 4, 5],
      2,
      async () => {
        running += 1;
        peak = Math.max(peak, running);
        await delay(5);
        running -= 1;
      },
      () => {},
    );
    assert.equal(peak, 2);
  });

  it("passes a thrown error to onResult and keeps going", async () => {
    const seen = [];
    await mapAsCompleted(
      ["a", "b"],
      1,
      async (item) => {
        if (item === "a") throw new Error("boom");
        return item;
      },
      (item, result) =>
        seen.push(result.error ? result.error.message : result.value),
    );
    assert.deepEqual(seen, ["boom", "b"]);
  });

  it("does nothing for an empty list", async () => {
    const seen = [];
    await mapAsCompleted(
      [],
      4,
      async () => 1,
      () => seen.push(1),
    );
    assert.deepEqual(seen, []);
  });
});
