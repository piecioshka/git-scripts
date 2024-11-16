# git-scripts

Git utility scripts

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

* [demo](demos/git-bars.example) `git bars COMMITTER_AUTHOR YEAR[_MONTH]` — Display revisions count in the past period
* [demo](demos/git-changed-packages.example) `git changed-packages [--oneline] [--main]` — Display names of packages with changed files
* [demo](demos/git-fire.example) `git fire "MESSAGE"` — Create commit with all changes and push to the origin
* [demo](demos/git-projects-births.example) `git projects-births [WORKSPACE_PATH=.]` — Display when projects start for the whole workspace
* [demo](demos/git-projects-status.example) `git projects-status [WORKSPACE_PATH=.]` — Display status for all projects in a workspace
* [demo](demos/git-projects-update.example) `git projects-update [WORKSPACE_PATH=.]` — Update all projects in a workspace
* [demo](demos/git-run-on-nested-repos.example) `git run-on-nested-repos COMMAND` — Run the command in all nested Git repositories
* [demo](demos/git-setup.example) `git setup` — Init repository and create initial revision
* [demo](demos/git-squash-all-commits.example) `git squash-all-commits` — Remove `.git/` directory and setup initialize repo again
* [demo](demos/git-sync.example) `git sync` — Check if local nad remote repo states are the same
* [demo](demos/git-user.example) `git user` — Display current user
* [demo](demos/git-zip.example) `git zip PACKAGE_NAME` — Extract archive from the current repository

## Related projects

* https://github.com/aarek/git-tools
* https://github.com/ddollar/git-utils
* https://github.com/jwiegley/git-scripts
* https://github.com/knadh/git-bars
* https://github.com/nvie/gitflow
