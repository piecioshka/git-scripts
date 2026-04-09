const FORBIDDEN = 403;
const NOT_FOUND = 404;

async function isNotAvailable(url) {
  const response = await fetch(url, { method: "HEAD" });
  if (response.statusText === "rate limit exceeded") {
    return {
      private: null,
      reason: "rate limit exceeded",
    };
  }
  const status = [FORBIDDEN, NOT_FOUND].includes(response.status);

  return {
    private: status,
    reason: status ? "private or not found" : "public",
  };
}

module.exports = {
  isNotAvailable,
};
