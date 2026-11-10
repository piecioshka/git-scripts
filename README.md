# git-scripts

<!-- prettier-ignore-start -->

[![github-ci](https://github.com/piecioshka/git-scripts/actions/workflows/ci.yml/badge.svg)](https://github.com/piecioshka/git-scripts/actions/workflows/ci.yml)

<!-- prettier-ignore-end -->

🔨 Git utility scripts

## Installation

```bash
cd ~/projects/ # or any workspace what you use
git clone git@github.com:piecioshka/git-scripts.git

# Bash: please add to `~/.bash_profile`
export PATH="$HOME/projects/git-scripts/bin:$PATH"

# Fish: please add to `~/.config/fish/config.fish`
set -gx PATH $HOME/projects/git-scripts/bin/ $PATH
```

**TIP**: After changing the shell configuration, restart the terminal to apply the new settings.

## Commands

- `git bars <committer_author> <year[_month]>`
  - Displays the revision count for the specified period [[example](examples/git-bars.example)].
- `git changed-monorepo-packages [--oneline] [--base=main] [--folder=packages]`
  - Displays the packages with files changed since the `base` branch [[example](examples/git-changed-monorepo-packages.example)].
- `git changed-monorepo-packages-status [folder=packages] [base=main]`
  - Displays the names of the changed packages in one line, compared with the `base` branch.
- `git clone-path <repository_url> <path/to/folder-or-file>`
  - Clones the repository to the specified path.
- `git copy-branch-name`
  - Copies the current branch name to the clipboard [[example](examples/git-copy-branch-name.example)].
- `git fire <message>`
  - Creates a commit with all changes and pushes it to the origin [[example](examples/git-fire.example)].
- `git new-issue <issue_id>`
  - Useful for starting a new task: creates a worktree with a branch `<folder>-<issue_id>` from the default branch, an empty commit and a draft pull request (requires `gh`).
- `[DEBUG=true] git projects-births [path=./] [--color=auto|always|never] [--jobs=N]`
  - Displays the date and the author of the first commit of every project in the workspace, grouped by year, and ends with the number of repositories [[example](examples/git-projects-births.example)].
- `[DEBUG=true] git projects-daily-status [path=./] [--color=auto|always|never] [--jobs=N]`
  - Displays the projects in the workspace with commits made today on any branch: `[N commits]`, `[N files]` (every file counted once, however many commits changed it) and `[+added -removed]`, and ends with the totals of the whole workspace [[example](examples/git-projects-daily-status.example)].
- `[DEBUG=true] git projects-push [path=./] [--verbose] [--color=auto|always|never] [--jobs=N]`
  - Pushes every branch and tag of all projects in the workspace to the origin, `N` repositories at a time (default: 4) [[example](examples/git-projects-push.example)].
  - Pushes only the repositories that have work the origin is missing: commits ahead of the upstream, branches without an upstream (pushed with `-u`, so they are not reported again) and local tags. Branches and tags are pushed independently, so a branch the origin has moved past does not hold back the tags.
  - Skips files, bare repositories, directories that are not repositories and local-only repositories. A dirty or detached repository is pushed as usual, because `push` only reads the refs and never touches the working tree. `[dirty N]` and `[untracked N]` mark the files that a push does not send.
  - Exits with code `1` when any push fails; the output of the failed push is printed below the repository, and `--verbose` prints it for the successful ones too. Ends with the number of repositories pushed, with nothing to push, skipped and failed.
- `[DEBUG=true] git projects-diff [path=./] [--stat] [--unified=N] [--color=auto|always|never] [--jobs=N]`
  - Displays the changes of tracked files, staged and unstaged (`git diff HEAD`, 1 line of context by default), of all projects in the workspace, `N` repositories at a time (default: 4).
  - Skips repositories without changes and ends with the number of repositories with changes and clean ones. Untracked files are only counted as `[untracked N]`, because Git has no diff for them.
  - `--stat` lists only the changed files with the number of added and removed lines (`binary` for binary files) instead of the diff, shows the totals next to every repository and ends with the number of changed files, insertions and deletions in the whole workspace.
  - All `git projects-*` commands (`births`, `daily-status`, `diff`, `push`, `status`, `update`) print the same way: one line per entry, `[labels] name [branch] +Nms`, the details indented below it, `[error] name: message` on stderr and a summary line at the end. `--color=auto|always|never` turns the colors of the script and of Git on or off (`auto` colors a terminal only, unless `NO_COLOR` is set), and a pager or `head` closing the pipe ends them quietly.
- `[DEBUG=true] git projects-status [path=./] [--changed] [--color=auto|always|never] [--jobs=N]`
  - Displays the state of all projects in the workspace, `N` repositories at a time (default: 4): `[dirty N]`, `[untracked N]`, `[ahead N]`, `[never pushed N]`, `[detached]`, `[no upstream]`, `[local repo]` or `[clean]`, with the changed files (`git status --short`) and the unpushed branches listed below the repository (a lone ahead branch is not repeated when it is the current one, as its name already stands next to `[ahead N]`).
  - `--changed` hides the repositories that have nothing to report. Nothing is fetched, so `[ahead N]` comes from the refs of the last fetch. Ends with the number of repositories with changes and clean ones.
- `[DEBUG=true] git projects-update [path=./] [--verbose] [--color=auto|always|never] [--jobs=N]`
  - Updates all projects in the workspace with `git pull --ff-only`, `N` repositories at a time (default: 4) [[example](examples/git-projects-update.example)].
  - Skips repositories that are dirty (modified tracked files), local-only, detached or without an upstream, and never leaves a repository in a merge or rebase; exits with code `1` when any update fails. Ends with the number of repositories updated, up to date, skipped and failed.
  - Reports the work that is missing from the origin: `[dirty N]` counts the modified tracked files, `[untracked N]` the untracked files that are not ignored (they do not stop the update), `[ahead N]` the commits of every local branch that its upstream does not have, and `[never pushed N]` the branches without an upstream; the branch names are listed below the repository, except for a lone ahead branch that is the current one. Repositories skipped by the update are reported too, but their numbers come from the refs of the last fetch, not from a fresh one.
- `git publish-branch`
  - Publishes the current branch to the origin and sets the upstream.
- `git repo-origin-url`
  - Displays the repository URL (`remote.origin.url`).
- `git run-on-nested-repos COMMAND [--max-depth=5] [--color=auto|always|never]`
  - Runs the specified command in all nested Git repositories, ends with the number of repositories and failures, and exits with code `1` when the command fails in any of them [[example](examples/git-run-on-nested-repos.example)].
  - Keeps the colors of the command output (e.g. `git branch`, `git status`) when printing to a terminal; `--color=always` keeps them in a pipe (`| less -R`), `--color=never` and `NO_COLOR` turn them off.
- `git setup`
  - Initializes the repository and creates the initial revision [[example](examples/git-setup.example)].
- `git squash-all-commits`
  - Removes the `.git/` directory and reinitializes the repository [[example](examples/git-squash-all-commits.example)].
- `git stats-between-tags [pattern] [--level=minor|major]`
  - Displays commits, added and removed lines between consecutive tags (`HEAD` is treated as a tag) [[example](examples/git-stats-between-tags.example)].
  - With `--level` only the tags of the given semver level are compared, so the changes of the skipped tags are merged into the surrounding range [[example](examples/git-stats-between-tags-level.example)].
- `git sync [--verbose]`
  - Synchronizes the repository with `origin`: fetches, pulls, and pushes **every** local branch and tag [[example](examples/git-sync.example)] [[example-2](examples/git-sync-verbose.example)].
  - Runs every step even when an earlier one fails, and exits with code `1` when any of them did.
- `git tags-recreate-versions-from-commits`
  - Creates the annotated tags `vX.Y.Z` for the commits whose subject is a version `X.Y.Z`, skipping the tags that already exist [[example](examples/git-tags-recreate-versions-from-commits.example)].
- `git tags-refresh`
  - Makes the local tags match the tags of `origin`: removes the local-only tags and moves the tags that point elsewhere.
- `git update-default-branch-master-to-main`
  - Changes the default branch from `master` to `main`.
- `git update-default-branch-master-to-main-in-workspace`
  - Changes the default branch from `master` to `main` in all your GitHub repositories, cloning each of them to a temporary directory (requires `gh` and `jq`); the archived ones are listed to change manually.
- `git user`
  - Displays the current user [[example](examples/git-user.example)].
- `git zip <name>`
  - Creates an archive from the current repository [[example](examples/git-zip.example)].
  - Packs tracked files only, including their uncommitted changes, and warns when untracked files were left out.

## Demos

Recorded with [vhs](https://github.com/charmbracelet/vhs).

### `git stats-between-tags`

```bash
git stats-between-tags
git stats-between-tags --level=minor
git stats-between-tags --level=major
```

![](demo/git-stats-between-tags.gif)

## Development

```bash
npm install
./test.sh # shellcheck, unit tests and Prettier check
```

## Related projects

- https://github.com/aarek/git-tools
- https://github.com/ddollar/git-utils
- https://github.com/jwiegley/git-scripts
- https://github.com/knadh/git-bars
- https://github.com/nvie/gitflow

## License

[The MIT License](https://piecioshka.mit-license.org) @ 2026
