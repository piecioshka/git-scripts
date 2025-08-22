const FORBIDDEN = 403;
const NOT_FOUND = 404;

async function isNotAvailable(url) {
  const response = await fetch(url, { method: "HEAD" });
  return [FORBIDDEN, NOT_FOUND].includes(response.status);
}

module.exports = {
  isNotAvailable,
};
