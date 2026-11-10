const path = require("node:path");

const { getFilesAndDirectories, isHidden } = require("./__filesystem");

// The visible entries of the workspace, sorted, as absolute paths.
function listWorkspace(workspacePath) {
  return getFilesAndDirectories(workspacePath)
    .filter((file) => !isHidden(file))
    .sort()
    .map((file) => path.resolve(workspacePath, file));
}

// Runs `task` for every item, at most `jobs` at a time, and calls `onResult`
// in the order of the items (not in the order the tasks finish), so the output
// stays sorted while the work runs in parallel. A task that throws does not
// stop the others: `onResult` gets `{ error }` instead of `{ value }`.
async function mapInOrder(items, jobs, task, onResult) {
  const results = items.map(() => null);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = Promise.resolve()
        .then(() => task(items[index]))
        .then(
          (value) => ({ value }),
          (error) => ({ error }),
        );
      await results[index];
    }
  }

  const workers = Array.from({ length: Math.min(jobs, items.length) }, () =>
    worker(),
  );

  for (let index = 0; index < items.length; index++) {
    while (results[index] === null) {
      await Promise.race(workers.concat(results.filter(Boolean)));
    }
    onResult(items[index], await results[index]);
  }
  await Promise.all(workers);
}

module.exports = {
  listWorkspace,
  mapInOrder,
};
