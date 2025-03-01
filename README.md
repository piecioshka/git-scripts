# git-scripts

🔨 Git utility scripts

## Installation

```bash
cd ~/projects/ # or any workspace what you use
git clone git@github.com:piecioshka/git-scripts.git

# Bash: please add to `~/.bash_profile`
export PATH="$HOME/projects/git-scripts/:$PATH"

# Fish: please add to `~/.config/fish/config.fish`
set -gx PATH $HOME/projects/git-scripts/ $PATH
```

**TIP**: When you modify shell configs, please restart the terminal to apply new settings.

## Commands

- `git bars <committer_author> <year[_month]>` — Display revisions count in the past period [[example](examples/git-bars.example)]
- `git browse` — Open current repository in the browser
- `git changed-monorepo-packages [--oneline] [--main]` — Display changed packages [[example](examples/git-changed-monorepo-packages.example)]
- `git changed-monorepo-packages-status <folder_with_packages>` — Display packages status
- `git fire <message>` — Create commit with all changes and push to the origin [[example](examples/git-fire.example)]
- `git open` — Open current repository in the browser
- `git projects-births [path=./]` — Display when projects start for the whole workspace [[example](examples/git-projects-births.example)]
- `git projects-status [path=./]` — Display status for all projects in a workspace [[example](examples/git-projects-status.example)]
- `git projects-update [path=./]` — Update all projects in a workspace [[example](examples/git-projects-update.example)]
- `git publish-branch` — Publish current branch to the origin and set upstream
- `git repo` — Display a repository URL (`remote.origin.url`)
- `git run-on-nested-repos COMMAND` — Run the command in all nested Git repositories [[example](examples/git-run-on-nested-repos.example)]
- `git setup` — Init repository and create initial revision [[example](examples/git-setup.example)]
- `git squash-all-commits` — Remove `.git/` directory and setup initialize repo again [[example](examples/git-squash-all-commits.example)]
- `git sync` — Check if local nad remote repo states are the same [[example](examples/git-sync.example)] [[example-2](examples/git-sync-verbose.example)]
- `git tags-refresh` — Refresh tags in the current repository
- `git update-default-branch-master-to-main` — Change default branch from `master` to `main`
- `git update-default-branch-master-to-main-in-workspace` — Change default branch from `master` to `main` in all repositories in the workspace
- `git user` — Display current user [[example](examples/git-user.example)]
- `git www` — Open current repository in the browser
- `git zip <name>` — Extract archive from the current repository [[example](examples/git-zip.example)]

## Related projects

- https://github.com/aarek/git-tools
- https://github.com/ddollar/git-utils
- https://github.com/jwiegley/git-scripts
- https://github.com/knadh/git-bars
- https://github.com/nvie/gitflow
