const NOT_FOUND = 404;

async function isNotFound(url) {
  const response = await fetch(url, { method: "HEAD" });
  return response.status === NOT_FOUND;
}

module.exports = {
  isNotFound,
};
