const { getGitOrigin, isGitRepository } = require("./__git");
const { isNotAvailable } = require("./__http");

function parseGitOrigin(url) {
  const regex = /^(?:git@|https:\/\/)(?:www\.)?([^/:]+)[/:](.+?)(?:\.git)?$/;
  const match = url.match(regex);
  return match
    ? {
        domain: match[1],
        repo: match[2],
      }
    : null;
}

async function isPrivateGitRepository(pathname) {
  if (!isGitRepository(pathname)) return false;

  const gitOrigin = await getGitOrigin(pathname);
  if (!gitOrigin) return false;

  const parsed = parseGitOrigin(gitOrigin);
  if (!parsed) return false;

  const { repo, domain } = parsed;
  const encodedRepo = encodeURIComponent(repo);

  const origins = {
    "github.com": `https://api.github.com/repos/${repo}`,
    "gitlab.com": `https://gitlab.com/api/v4/projects/${encodedRepo}`,
    "bitbucket.org": `https://api.bitbucket.org/2.0/repositories/${repo}`,
  };

  const apiUrl = origins[domain];

  if (!apiUrl) {
    return null;
  }

  return isNotAvailable(apiUrl);
}

module.exports = {
  isPrivateGitRepository,
};
