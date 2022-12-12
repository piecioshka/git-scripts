# git-scripts

Utility Git scripts _[by @piecioshka](https://twitter.com/piecioshka)_

## Installation

```bash
cd ~/projects/ # or any workspace path you use
git clone git@github.com:piecioshka/git-scripts.git

# Bash: please add to `~/.bash_profile`
export PATH="$HOME/projects/git-scripts/:$PATH"

# Fish: please add to `~/.config/fish/config.fish`
set -gx PATH $HOME/projects/git-scripts/ $PATH
```

## Commands

* `git bars COMMITER_AUTHOR YEAR[_MONTH]` — Display revisions count in the past period
* `git changed-packages [--oneline]` — Display names of packages with changed files
* `git fire [MSG]` — Create commit with all changes and push to the origin
* `git projects-births [WORKSPACE_PATH]` — Display when projects start for the whole workspace
* `git projects-status [WORKSPACE_PATH]` — Display status for all projects in a workspace
* `git projects-update [WORKSPACE_PATH]` — Update all projects in a workspace
* `git save` — Create revision with a dummy commit message
* `git setup` — Init repository and create initial revision
* `git squash-all-commits` — Remove `.git/` directory and setup initialize repo again
* `git sync` — Check if local nad remote repo states are the same
* `git user` — Display current user
* `git zip PACKAGE_NAME` — Extract archive from the current repository

## Related

* https://github.com/ddollar/git-utils
* https://github.com/jwiegley/git-scripts
* https://github.com/knadh/git-bars
* https://github.com/nvie/gitflow
