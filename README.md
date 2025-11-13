# git-scripts

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
- `git changed-monorepo-packages [--oneline] [--main]`
  - Displays changed packages [[example](examples/git-changed-monorepo-packages.example)].
- `git changed-monorepo-packages-status <folder_with_packages>`
  - Displays the status of packages.
- `git clone-path <repository_url> <path/to/folder-or-file>`
  - Clones the repository to the specified path.
- `git fire <message>`
  - Creates a commit with all changes and pushes it to the origin [[example](examples/git-fire.example)].
- `git is-private-repo`
  - Checks if the current repository is private [[example](examples/git-is-private-repo.example)].
- **[✨ New ✨]** `git new-issue <issue_id>`
  - Useful for starting a new task: creates a worktree, branch, and pull request.
- `git projects-births [path=./]`
  - Displays the start dates of projects in the workspace [[example](examples/git-projects-births.example)].
- `git projects-daily-status [path=./]`
  - Displays the status of all projects in the workspace [[example](examples/git-projects-daily-status.example)].
- `git projects-update [path=./]`
  - Updates all projects in the workspace [[example](examples/git-projects-update.example)].
- `git publish-branch`
  - Publishes the current branch to the origin and sets the upstream.
- `git repo`
  - Displays the repository URL (`remote.origin.url`).
- `git run-on-nested-repos COMMAND`
  - Runs the specified command in all nested Git repositories [[example](examples/git-run-on-nested-repos.example)].
- `git setup`
  - Initializes the repository and creates the initial revision [[example](examples/git-setup.example)].
- `git squash-all-commits`
  - Removes the `.git/` directory and reinitializes the repository [[example](examples/git-squash-all-commits.example)].
- `git sync`
  - Checks if the local and remote repository states are the same [[example](examples/git-sync.example)] [[example-2](examples/git-sync-verbose.example)].
- `git tags-refresh`
  - Refreshes tags in the current repository.
- `git update-default-branch-master-to-main`
  - Changes the default branch from `master` to `main`.
- `git update-default-branch-master-to-main-in-workspace`
  - Changes the default branch from `master` to `main` in all repositories in the workspace.
- `git user`
  - Displays the current user [[example](examples/git-user.example)].
- `git zip <name>`
  - Creates an archive from the current repository [[example](examples/git-zip.example)].

## Related projects

- https://github.com/aarek/git-tools
- https://github.com/ddollar/git-utils
- https://github.com/jwiegley/git-scripts
- https://github.com/knadh/git-bars
- https://github.com/nvie/gitflow
