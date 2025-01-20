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

- `git bars <committer_author> <year[_month]>` — Display revisions count in the past period [[demo](demos/git-bars.example)]
- `git browse` — Open current repository in the browser
- `git changed-monorepo-packages [--oneline] [--main]` — Display names of packages with changed files [[demo](demos/git-changed-monorepo-packages.example)]
- `git changed-monorepo-packages-status <folder_with_packages>` — Display status of packages in the monorepo
- `git fire <message>` — Create commit with all changes and push to the origin [[demo](demos/git-fire.example)]
- `git open` — Open current repository in the browser
- `git projects-births [path=./]` — Display when projects start for the whole workspace [[demo](demos/git-projects-births.example)]
- `git projects-status [path=./]` — Display status for all projects in a workspace [[demo](demos/git-projects-status.example)]
- `git projects-update [path=./]` — Update all projects in a workspace [[demo](demos/git-projects-update.example)]
- `git publish-branch` — Publish current branch to the origin and set upstream
- `git repo` — Display a repository URL (`remote.origin.url`)
- `git run-on-nested-repos COMMAND` — Run the command in all nested Git repositories [[demo](demos/git-run-on-nested-repos.example)]
- `git setup` — Init repository and create initial revision [[demo](demos/git-setup.example)]
- `git squash-all-commits` — Remove `.git/` directory and setup initialize repo again [[demo](demos/git-squash-all-commits.example)]
- `git sync` — Check if local nad remote repo states are the same [[demo](demos/git-sync.example)]
- `git tags-refresh` - Refresh tags in the current repository
- `git user` — Display current user [[demo](demos/git-user.example)]
- `git www` — Open current repository in the browser
- `git zip <name>` — Extract archive from the current repository [[demo](demos/git-zip.example)]

## Related projects

- https://github.com/aarek/git-tools
- https://github.com/ddollar/git-utils
- https://github.com/jwiegley/git-scripts
- https://github.com/knadh/git-bars
- https://github.com/nvie/gitflow
